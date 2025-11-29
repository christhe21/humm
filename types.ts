export enum Priority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  NORMAL = 'NORMAL',
  LOW = 'LOW'
}

export enum StreamAction {
  DELIVER = 'DELIVER',
  SUMMARIZE = 'SUMMARIZE',
  QUEUE = 'QUEUE',
  BLOCK = 'BLOCK'
}

export enum SourceType {
  NEUROLINK = 'NEUROLINK',
  AR_OVERLAY = 'AR_OVERLAY',
  WORK_MESSAGE = 'WORK_MESSAGE',
  SOCIAL_FEED = 'SOCIAL_FEED',
  ENVIRONMENTAL = 'ENVIRONMENTAL'
}

export interface StreamItem {
  id: string;
  source: SourceType;
  originalContent: string;
  timestamp: number;
  processed: boolean;
  
  // Fields populated after AI processing
  priority?: Priority;
  summary?: string;
  action?: StreamAction;
  cognitiveCost?: number; // Estimated mental load impact (1-10)
}

export interface CognitiveState {
  loadScore: number; // 0-100 (CLS)
  trend: 'RISING' | 'FALLING' | 'STABLE';
  focusMode: boolean;
  sustainabilityMode: boolean;
}

export interface AIAnalysisResult {
  priority: Priority;
  summary: string;
  action: StreamAction;
  cognitiveCost: number;
}