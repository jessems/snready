export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswers: number[];
  multiSelect: boolean;
  explanation?: string;
}

export interface QuizState {
  currentIndex: number;
  answers: Record<number, number[]>;
  isSubmitted: boolean;
}

export interface QuizResult {
  questionId: number;
  userAnswers: number[];
  correctAnswers: number[];
  isCorrect: boolean;
}
