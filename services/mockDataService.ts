import { SourceType } from '../types';

const MOCK_MESSAGES = [
  { source: SourceType.WORK_MESSAGE, content: "URGENT: Quantum encryption keys for Project Alpha need rotation immediately. Security protocol 9 initiated." },
  { source: SourceType.SOCIAL_FEED, content: "Kai just uploaded a new memory stream: 'Sunset on Mars Colony 4'. Check out the sensory overlay!" },
  { source: SourceType.AR_OVERLAY, content: "Advertisement: Upgrade your retinal display to 16K resolution today. 20% off for Prime Citizens." },
  { source: SourceType.NEUROLINK, content: "System Update: Cortex firmware v9.2 ready to install. Will require 5 minutes of unconsciousness." },
  { source: SourceType.ENVIRONMENTAL, content: "Warning: High UV radiation detected in Sector 7. Recommend activating dermal shields." },
  { source: SourceType.WORK_MESSAGE, content: "Meeting reminder: Q3 Synergy Alignment with the AI Board of Directors in 15 minutes." },
  { source: SourceType.SOCIAL_FEED, content: "Viral Trend: People are switching off their auditory implants for 'Pure Silence Challenge'." },
  { source: SourceType.NEUROLINK, content: "Biometric Alert: Cortisol levels rising. Suggest deep breathing module." },
  { source: SourceType.AR_OVERLAY, content: "Navigation: Fastest route to Hyperloop Station B found. Traffic heavy in the lower atmosphere." },
  { source: SourceType.WORK_MESSAGE, content: "FYI: The coffee synthesizer on floor 45 is out of nutrient packs." },
];

export const generateMockItem = () => {
  const template = MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)];
  return {
    ...template,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    processed: false,
    originalContent: template.content,
  };
};