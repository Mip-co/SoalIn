export type QuestionType = 'multiple_choice' | 'essay' | 'true_false';
export type DifficultyLevel = 'Mudah' | 'Sedang' | 'Sulit';

export interface MultipleChoiceQuestion {
  id: string;
  type: 'multiple_choice';
  text: string;
  options: string[];
  answer: string;
  explanation?: string;
  image?: string;
}

export interface EssayQuestion {
  id: string;
  type: 'essay';
  text: string;
  answer: string;
  image?: string;
}

export interface TrueFalseQuestion {
  id: string;
  type: 'true_false';
  text: string;
  answer: boolean;
  explanation?: string;
  image?: string;
}

export type Question = MultipleChoiceQuestion | EssayQuestion | TrueFalseQuestion;

export interface QuestionSettings {
  pgCount: number;
  essayCount: number;
  tfCount: number;
  classLevel: string;
  difficulty: DifficultyLevel;
  subject: string;
}

export interface ExportMetadata {
  schoolName: string;
  subject: string;
  classLevel: string;
  date: string;
  teacherName?: string;
  duration?: string;
}

export interface AppState {
  step: 'dashboard' | 'upload' | 'settings' | 'generate' | 'preview';
  kisiKisi: string;
  settings: QuestionSettings;
  questions: Question[];
  isLoading: boolean;
  error: string | null;
}
