import { KnowledgeDoc, HealthMetric, UserProfile } from './types';

export const INITIAL_DOCS: KnowledgeDoc[] = [
  {
    id: '1',
    title: 'Recent Blood Work (Cholesterol)',
    category: 'Lab Report',
    content: 'Total Cholesterol: 210 mg/dL (High). LDL: 140 mg/dL. HDL: 45 mg/dL. Triglycerides: 160 mg/dL. Doctor recommends reducing saturated fats and increasing fiber intake.',
    dateAdded: Date.now() - 100000000
  },
  {
    id: '2',
    title: 'Keto Diet Plan Preference',
    category: 'Diet Plan',
    content: 'Patient prefers a Ketogenic diet approach. Allergies: Peanuts. Dislikes: Fish.',
    dateAdded: Date.now() - 50000000
  }
];

export const INITIAL_WEIGHT_DATA: HealthMetric[] = [
  { date: 'Mon', value: 78.5 },
  { date: 'Tue', value: 78.2 },
  { date: 'Wed', value: 78.0 },
  { date: 'Thu', value: 77.8 },
  { date: 'Fri', value: 77.5 },
  { date: 'Sat', value: 77.2 },
  { date: 'Sun', value: 76.9 },
];

export const INITIAL_SLEEP_DATA: HealthMetric[] = [
  { date: 'Mon', value: 6.5 },
  { date: 'Tue', value: 7.2 },
  { date: 'Wed', value: 5.5 },
  { date: 'Thu', value: 8.0 },
  { date: 'Fri', value: 7.5 },
  { date: 'Sat', value: 9.0 },
  { date: 'Sun', value: 8.5 },
];

export const INITIAL_PROFILE: UserProfile = {
  name: 'Alex',
  age: 34,
  weight: 77,
  height: 178,
  goal: 'Reduce cholesterol and lose 5kg'
};