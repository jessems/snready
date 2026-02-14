// Mock Exam Types

export interface MockExamConfig {
  certSlug: string;
  certName: string;
  questionCount: number;
  durationMinutes: number;
  passingScore: number;
}

export interface MockExamQuestion {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswers: string[];
  type: "multiple_choice" | "multiple_select";
  explanation?: {
    correct: string;
    wrongAnswers?: { choiceId: string; explanation: string }[];
  };
  topic: string;
  domain?: string;
}

export interface MockExamSession {
  id: string;
  certSlug: string;
  certName: string;
  questionCount: number;
  durationMinutes: number;
  passingScore: number;
  questions: MockExamQuestion[];
  answers: Record<string, string[]>; // questionId -> selected option ids
  currentIndex: number;
  startedAt: string; // ISO timestamp
  pausedAt?: string; // ISO timestamp if paused
  totalPausedMs: number; // Total time spent paused
  completedAt?: string; // ISO timestamp when submitted
  status: "in-progress" | "paused" | "completed";
}

export interface MockExamResult {
  sessionId: string;
  certSlug: string;
  certName: string;
  completedAt: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number; // percentage
  passingScore: number;
  passed: boolean;
  timeUsedMs: number;
  durationMinutes: number;
  questionResults: {
    questionId: string;
    question: string;
    options: { id: string; text: string }[];
    userAnswers: string[];
    correctAnswers: string[];
    isCorrect: boolean;
    explanation?: {
      correct: string;
      wrongAnswers?: { choiceId: string; explanation: string }[];
    };
    topic: string;
    domain?: string;
  }[];
}

export interface MockExamHistoryEntry {
  sessionId: string;
  certSlug: string;
  certName: string;
  completedAt: string;
  score: number;
  passed: boolean;
  questionCount: number;
  timeUsedMs: number;
}
