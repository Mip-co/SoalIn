export type QuestionType = 'multiple_choice' | 'essay' | 'true_false';
export type DifficultyLevel = 'Mudah' | 'Sedang' | 'Sulit';

export interface MultipleChoiceQuestion {
  id: string;
  type: 'multiple_choice';
  text: string;
  options: string[];
  answer: string;
  explanation?: string;
}

export interface EssayQuestion {
  id: string;
  type: 'essay';
  text: string;
  answer: string;
}

export interface TrueFalseQuestion {
  id: string;
  type: 'true_false';
  text: string;
  answer: boolean;
  explanation?: string;
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

export interface GenerateQuestionsRequest {
  kisiKisi: string;
  settings: QuestionSettings;
}

export interface RegenerateQuestionRequest {
  originalQuestion: Question;
  kisiKisi: string;
  settings: QuestionSettings;
}

export interface ExportMetadata {
  schoolName: string;
  subject: string;
  classLevel: string;
  date: string;
  teacherName?: string;
  duration?: string;
}

export interface ExportRequest {
  metadata: ExportMetadata;
  questions: Question[];
  includeAnswerKey: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ExtractTextResponse {
  extractedText: string;
  charCount: number;
  source: 'pdf' | 'docx';
}

export interface GenerateQuestionsResponse {
  questions: Question[];
  totalGenerated: number;
}
