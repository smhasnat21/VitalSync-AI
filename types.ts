export enum MessageRole {
  USER = 'user',
  MODEL = 'model'
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: number;
}

export interface KnowledgeDoc {
  id: string;
  title: string;
  content: string;
  category: 'Lab Report' | 'Diet Plan' | 'Workout Routine' | 'Medical History' | 'Other';
  dateAdded: number;
}

export interface HealthMetric {
  date: string;
  value: number;
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number; // kg
  height: number; // cm
  goal: string;
}

export type ViewState = 'dashboard' | 'chat' | 'knowledge' | 'tracker';