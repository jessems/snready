// Feedback system utilities

/**
 * Generate a feedback token from email and session ID.
 * Uses a simple hash that's URL-safe and deterministic.
 */
export function generateFeedbackToken(email: string, sessionId: string): string {
  // Create a deterministic but hard-to-guess token
  const input = `${email}:${sessionId}:snready-feedback-2026`;
  return btoa(input).replace(/[+/=]/g, (c) => 
    c === '+' ? '-' : c === '/' ? '_' : ''
  ).slice(0, 32);
}

/**
 * Validate a feedback token against stored purchase data.
 */
export function validateFeedbackToken(
  token: string, 
  email: string, 
  sessionId: string
): boolean {
  const expected = generateFeedbackToken(email, sessionId);
  return token === expected;
}

export interface PurchaseData {
  email: string;
  certification: string;
  plan: string;
  sessionId: string;
  purchasedAt: number;
  feedbackToken: string;
  checkInSent: boolean;
  checkInSentAt?: number;
}

export interface FeedbackData {
  email: string;
  certification: string;
  examTaken: 'yes' | 'no' | 'scheduled';
  passed?: 'yes' | 'no' | 'waiting';
  rating: number; // 1-5
  testimonial?: string;
  canFeature: boolean;
  submittedAt: number;
}
