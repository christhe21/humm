import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult, Priority, StreamAction } from '../types';

// Fallback logic if no API key is present
const heuristicAnalysis = (text: string, cls: number): AIAnalysisResult => {
  const isUrgent = text.toLowerCase().includes('urgent') || text.toLowerCase().includes('warning') || text.toLowerCase().includes('alert');
  const isAd = text.toLowerCase().includes('advertisement') || text.toLowerCase().includes('upgrade');
  
  let priority = Priority.NORMAL;
  if (isUrgent) priority = Priority.CRITICAL;
  if (isAd) priority = Priority.LOW;

  let action = StreamAction.DELIVER;
  if (cls > 80) {
    action = isUrgent ? StreamAction.SUMMARIZE : StreamAction.BLOCK;
  } else if (cls > 50) {
    action = isUrgent ? StreamAction.DELIVER : StreamAction.SUMMARIZE;
  } else {
    action = isAd ? StreamAction.QUEUE : StreamAction.DELIVER;
  }

  return {
    priority,
    summary: isUrgent ? "CRITICAL ALERT REQUIRING ATTENTION" : (text.slice(0, 40) + "..."),
    action,
    cognitiveCost: isUrgent ? 8 : 2
  };
};

export const analyzeStreamItem = async (
  content: string,
  cls: number,
  isSustainabilityMode: boolean
): Promise<AIAnalysisResult> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("No API Key found, using heuristic fallback.");
    return new Promise(resolve => setTimeout(() => resolve(heuristicAnalysis(content, cls)), 600));
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Act as HUMM (Human Mental Manager), an AI system from 2125.
      Your goal is to protect the user from Cognitive Burnout Syndrome (CBS).
      
      Current User State:
      - Cognitive Load Score (CLS): ${cls}/100 (Higher is worse)
      - Sustainability Mode: ${isSustainabilityMode}

      Incoming Data: "${content}"

      Instructions:
      1. Assign a Priority (CRITICAL, HIGH, NORMAL, LOW).
      2. Determine Action based on CLS:
         - If CLS > 80: BLOCK anything not CRITICAL. SUMMARIZE CRITICAL items heavily.
         - If CLS > 50: SUMMARIZE NORMAL/HIGH. QUEUE LOW.
         - If Sustainability Mode is ON: Aggressively QUEUE or BLOCK non-essential data.
      3. Create a "Smart Summary" (max 10 words) that conveys the essence without cognitive strain.
      4. Estimate Cognitive Cost (1-10).

      Return strictly valid JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            priority: { type: Type.STRING, enum: [Priority.CRITICAL, Priority.HIGH, Priority.NORMAL, Priority.LOW] },
            summary: { type: Type.STRING },
            action: { type: Type.STRING, enum: [StreamAction.DELIVER, StreamAction.SUMMARIZE, StreamAction.QUEUE, StreamAction.BLOCK] },
            cognitiveCost: { type: Type.NUMBER }
          },
          required: ["priority", "summary", "action", "cognitiveCost"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    
    // Validate result shape against our types just in case
    return {
      priority: result.priority || Priority.NORMAL,
      summary: result.summary || "Content processed.",
      action: result.action || StreamAction.DELIVER,
      cognitiveCost: result.cognitiveCost || 5
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return heuristicAnalysis(content, cls);
  }
};