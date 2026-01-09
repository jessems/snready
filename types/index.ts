// Certification types
export type CertificationCategory =
  | "foundation"
  | "developer"
  | "architect"
  | "platform-owner"
  | "itsm"
  | "customer-service"
  | "hr"
  | "itom"
  | "secops"
  | "grc"
  | "itam"
  | "spm"
  | "service-provider"
  | "specialist"
  | "micro";

export interface Certification {
  slug: string;
  name: string;
  fullName: string;
  description: string;
  category: CertificationCategory;
  level: "entry" | "professional" | "expert";
  examDetails: {
    questionCount: number;
    duration: number; // in minutes
    passingScore: number; // percentage
    cost: number; // USD
    format: string;
  };
  prerequisites: string[];
  domains: ExamDomain[];
  release: string; // e.g., "Yokohama"
  lastUpdated: string;
}

export interface ExamDomain {
  name: string;
  slug: string;
  percentage: number;
  description: string;
}

// Topic types
export interface TopicIntroduction {
  overview: string;      // What is this topic?
  whyItMatters: string;  // Exam importance
  keyConcepts: string;   // Key areas to study
  examTips: string;      // Specific exam advice
}

export interface Topic {
  slug: string;
  name: string;
  certification: string;
  domain: string;
  description: string;
  introduction?: TopicIntroduction;
  keyConcepts: string[];
  questionCount: number;
  freeQuestionCount: number;
}

// Question types
export interface Question {
  id: string;
  certification: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  type: "single" | "multiple"; // single or multiple choice
  question: string;
  options: QuestionOption[];
  correctAnswers: string[]; // array of option IDs
  explanation: string;
  references?: string[];
  isFree: boolean;
}

export interface QuestionOption {
  id: string;
  text: string;
}

// Quiz/Test types
export interface PracticeTest {
  id: string;
  certification: string;
  name: string;
  description: string;
  questionCount: number;
  duration: number; // in minutes
  questions: string[]; // question IDs
  isFree: boolean;
}

// User progress types (for future use)
export interface UserProgress {
  certification: string;
  topic: string;
  questionsAnswered: number;
  correctAnswers: number;
  lastAttempt: string;
}

// SEO types
export interface PageMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
  ogImage?: string;
}
