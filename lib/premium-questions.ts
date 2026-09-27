// Client-side loader for premium questions. Premium questions are never part of the
// static export; they are served by the /api/questions Pages Function after it
// verifies the session cookie and the user's purchased certifications.

import type { Question } from "@/types";

export type PremiumQuestionScope = "premium" | "all";

export type PremiumQuestionsErrorCode =
  | "not_authenticated"
  | "no_access"
  | "network_error"
  | "unexpected_response"
  | string;

export type PremiumQuestionsResult =
  | { ok: true; questions: Question[] }
  | { ok: false; code: PremiumQuestionsErrorCode; status?: number; error: string };

export async function fetchPremiumQuestions({
  certification,
  topic,
  scope = "premium",
  signal,
}: {
  certification: string;
  topic?: string;
  scope?: PremiumQuestionScope;
  signal?: AbortSignal;
}): Promise<PremiumQuestionsResult> {
  const params = new URLSearchParams({ cert: certification.toLowerCase() });
  if (topic) params.set("topic", topic);
  if (scope !== "premium") params.set("scope", scope);

  let response: Response;
  try {
    response = await fetch(`/api/questions?${params.toString()}`, {
      credentials: "include",
      cache: "no-store",
      signal,
    });
  } catch (error) {
    if ((error as Error)?.name === "AbortError") throw error;
    return { ok: false, code: "network_error", error: "Could not reach the server" };
  }

  let data: { questions?: Question[]; code?: string; error?: string } | null = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (response.ok && data && Array.isArray(data.questions)) {
    return { ok: true, questions: data.questions };
  }

  return {
    ok: false,
    status: response.status,
    code: data?.code || "unexpected_response",
    error: data?.error || "Unexpected response from the server",
  };
}
