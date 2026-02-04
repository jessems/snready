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

// ServiceNow release versions
export type ServiceNowRelease =
  | "Vancouver"
  | "Washington"
  | "Xanadu"
  | "Yokohama"
  | "Zurich";

export interface DeltaExamInfo {
  isMainline: boolean; // Only mainline certs have delta exams
  currentRelease: ServiceNowRelease;
  previousRelease?: ServiceNowRelease;
  deltaExamDetails?: {
    questionCount: number; // Typically 7-10 questions
    duration: number; // Typically 20 minutes
    passingScore: number;
    format: string;
    retakeAllowed: number; // Number of retakes allowed (typically 3)
  };
  deltaWindow?: {
    opens: string; // ISO date string
    closes: string; // ISO date string (typically 90 days)
  };
  studyGuideUrl?: string;
}

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
  release: ServiceNowRelease;
  lastUpdated: string;
  deltaExam?: DeltaExamInfo;
}

export interface ExamDomain {
  name: string;
  slug: string;
  percentage: number;
  description: string;
}

// Extended certification with readiness status
export interface CertificationWithReadiness extends Certification {
  isReady: boolean;
  topicCount: number;
  totalQuestions: number;
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
export type CognitiveLevel = "knowledge" | "understanding" | "application";
export type QuestionType = "multiple_choice" | "multiple_select";
export type SourceType = "course" | "documentation" | "both";

export interface QuestionOption {
  id: string;       // lowercase: "a", "b", "c", "d"
  text: string;
}

export interface WrongAnswerExplanation {
  choiceId: string;
  explanation: string;
  reference?: string;  // optional source reference
}

export interface QuestionExplanation {
  correct: string;
  wrongAnswers: WrongAnswerExplanation[];
}

export interface QuestionSource {
  type: SourceType;
  course?: {
    courseSlug: string;
    moduleTitle: string;
    lessonSlug: string;
    lessonTitle: string;
    url?: string;         // link to lesson on Now Learning
  };
  documentation?: {
    docSlug: string;
    section: string;
    url: string;          // link to docs.servicenow.com
  };
  path: string;           // absolute path to source file
  excerpt: string;        // key supporting text from source
}

export interface QuestionLabels {
  certification: string;           // "csa"
  domain: string;                  // "Incident Management"
  domainSlug: string;              // "incident-management"
  domainPercentage: number;        // 12
  subtopics: string[];             // ["Major Incidents", "Escalation"]
  course?: string;                 // course slug
  module?: string;                 // module name
  lesson?: string;                 // lesson slug
  tags: string[];                  // ["SLA", "assignment rules"]
}

export interface QuestionMetadata {
  generatedAt: string;             // ISO timestamp
  version: string;                 // "1.0"
  release: string;                 // "Xanadu"
  reviewed: boolean;               // manual review flag
}

export interface Question {
  id: string;                      // "csa-incident-management-0001"
  certification: string;           // "csa" (denormalized for querying)
  topic: string;                   // "incident-management"
  cognitiveLevel: CognitiveLevel;  // "knowledge" | "understanding" | "application"
  type: QuestionType;              // "multiple_choice" | "multiple_select"
  question: string;
  options: QuestionOption[];
  correctAnswers: string[];        // ["b"] or ["a", "c"]
  explanation: QuestionExplanation;
  references?: string[];           // general references
  isFree: boolean;

  // Extended fields for generation pipeline
  source: QuestionSource;
  labels: QuestionLabels;
  meta: QuestionMetadata;
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
