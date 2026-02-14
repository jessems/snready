import type {
  MockExamConfig,
  MockExamSession,
  MockExamQuestion,
  MockExamResult,
  MockExamHistoryEntry,
} from "@/types/mockExam";
import type { Question } from "@/types";

const STORAGE_KEY_PREFIX = "snready_mock_exam_";
const HISTORY_KEY = "snready_mock_exam_history";

// Fisher-Yates shuffle
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate unique session ID
export function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Convert Question to MockExamQuestion
export function toMockExamQuestion(q: Question): MockExamQuestion {
  return {
    id: q.id,
    question: q.question,
    options: q.options.map((opt) => ({ id: opt.id, text: opt.text })),
    correctAnswers: q.correctAnswers,
    type: q.type,
    explanation: q.explanation
      ? {
          correct: q.explanation.correct,
          wrongAnswers: q.explanation.wrongAnswers?.map((wa) => ({
            choiceId: wa.choiceId,
            explanation: wa.explanation,
          })),
        }
      : undefined,
    topic: q.topic,
    domain: q.labels?.domain,
  };
}

// Create a new mock exam session
export function createMockExamSession(
  config: MockExamConfig,
  allQuestions: Question[]
): MockExamSession {
  const shuffled = shuffleArray(allQuestions);
  const selected = shuffled.slice(0, config.questionCount);
  const questions = selected.map(toMockExamQuestion);

  // Shuffle options within each question too
  for (const q of questions) {
    q.options = shuffleArray(q.options);
  }

  const session: MockExamSession = {
    id: generateSessionId(),
    certSlug: config.certSlug,
    certName: config.certName,
    questionCount: config.questionCount,
    durationMinutes: config.durationMinutes,
    passingScore: config.passingScore,
    questions,
    answers: {},
    currentIndex: 0,
    startedAt: new Date().toISOString(),
    totalPausedMs: 0,
    status: "in-progress",
  };

  return session;
}

// Save session to localStorage
export function saveSession(session: MockExamSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    `${STORAGE_KEY_PREFIX}${session.id}`,
    JSON.stringify(session)
  );
}

// Load session from localStorage
export function loadSession(sessionId: string): MockExamSession | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${sessionId}`);
  if (!data) return null;
  try {
    return JSON.parse(data) as MockExamSession;
  } catch {
    return null;
  }
}

// Delete session from localStorage
export function deleteSession(sessionId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`${STORAGE_KEY_PREFIX}${sessionId}`);
}

// Get all in-progress sessions for a certification
export function getInProgressSessions(certSlug: string): MockExamSession[] {
  if (typeof window === "undefined") return [];
  const sessions: MockExamSession[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_KEY_PREFIX) && key !== HISTORY_KEY) {
      try {
        const session = JSON.parse(
          localStorage.getItem(key) || ""
        ) as MockExamSession;
        if (
          session.certSlug === certSlug &&
          (session.status === "in-progress" || session.status === "paused")
        ) {
          sessions.push(session);
        }
      } catch {
        // Ignore invalid entries
      }
    }
  }

  return sessions.sort(
    (a, b) =>
      new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );
}

// Pause session
export function pauseSession(session: MockExamSession): MockExamSession {
  return {
    ...session,
    pausedAt: new Date().toISOString(),
    status: "paused",
  };
}

// Resume session
export function resumeSession(session: MockExamSession): MockExamSession {
  if (!session.pausedAt) return session;

  const pausedMs =
    new Date().getTime() - new Date(session.pausedAt).getTime();

  return {
    ...session,
    pausedAt: undefined,
    totalPausedMs: session.totalPausedMs + pausedMs,
    status: "in-progress",
  };
}

// Calculate elapsed time (excluding paused time)
export function getElapsedMs(session: MockExamSession): number {
  const now = new Date().getTime();
  const start = new Date(session.startedAt).getTime();

  if (session.status === "paused" && session.pausedAt) {
    // Don't count time after pause
    const pausedAt = new Date(session.pausedAt).getTime();
    return pausedAt - start - session.totalPausedMs;
  }

  return now - start - session.totalPausedMs;
}

// Calculate remaining time
export function getRemainingMs(session: MockExamSession): number {
  const totalMs = session.durationMinutes * 60 * 1000;
  const elapsed = getElapsedMs(session);
  return Math.max(0, totalMs - elapsed);
}

// Check if time is up
export function isTimeUp(session: MockExamSession): boolean {
  return getRemainingMs(session) <= 0;
}

// Complete session and generate result
export function completeSession(session: MockExamSession): MockExamResult {
  const completedAt = new Date().toISOString();
  const timeUsedMs = getElapsedMs(session);

  const questionResults = session.questions.map((q) => {
    const userAnswers = session.answers[q.id] || [];
    const isCorrect =
      userAnswers.length === q.correctAnswers.length &&
      userAnswers.every((a) => q.correctAnswers.includes(a)) &&
      q.correctAnswers.every((a) => userAnswers.includes(a));

    return {
      questionId: q.id,
      question: q.question,
      options: q.options,
      userAnswers,
      correctAnswers: q.correctAnswers,
      isCorrect,
      explanation: q.explanation,
      topic: q.topic,
      domain: q.domain,
    };
  });

  const correctCount = questionResults.filter((r) => r.isCorrect).length;
  const score = Math.round((correctCount / session.questionCount) * 100);

  const result: MockExamResult = {
    sessionId: session.id,
    certSlug: session.certSlug,
    certName: session.certName,
    completedAt,
    totalQuestions: session.questionCount,
    correctAnswers: correctCount,
    score,
    passingScore: session.passingScore,
    passed: score >= session.passingScore,
    timeUsedMs,
    durationMinutes: session.durationMinutes,
    questionResults,
  };

  // Update session status
  const completedSession: MockExamSession = {
    ...session,
    completedAt,
    status: "completed",
  };
  saveSession(completedSession);

  // Add to history
  addToHistory(result);

  return result;
}

// Get exam history
export function getExamHistory(certSlug?: string): MockExamHistoryEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(HISTORY_KEY);
    if (!data) return [];

    const history = JSON.parse(data) as MockExamHistoryEntry[];

    if (certSlug) {
      return history.filter((h) => h.certSlug === certSlug);
    }

    return history;
  } catch {
    return [];
  }
}

// Add result to history
function addToHistory(result: MockExamResult): void {
  if (typeof window === "undefined") return;

  const entry: MockExamHistoryEntry = {
    sessionId: result.sessionId,
    certSlug: result.certSlug,
    certName: result.certName,
    completedAt: result.completedAt,
    score: result.score,
    passed: result.passed,
    questionCount: result.totalQuestions,
    timeUsedMs: result.timeUsedMs,
  };

  const history = getExamHistory();
  history.unshift(entry);

  // Keep last 50 entries
  const trimmed = history.slice(0, 50);

  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
}

// Format time as MM:SS
export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// Format time as Xh Ym Zs
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}
