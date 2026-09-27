import { getSessionAccess, hasCertificationAccess } from "../lib/access";
import { getQuestions, isKnownCertification, isKnownTopic, type QuestionScope } from "../lib/question-bank";

interface Env {
  SNREADY_ACCESS: KVNamespace;
}

type QuestionsErrorCode =
  | "missing_certification"
  | "unknown_certification"
  | "unknown_topic"
  | "invalid_scope"
  | "access_not_configured"
  | "not_authenticated"
  | "no_access"
  | "access_lookup_failed";

// Premium content must never be cached by the browser, CDN, or shared proxies.
const JSON_HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "private, no-store",
  Vary: "Cookie",
};

function jsonResponse(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function errorResponse(status: number, code: QuestionsErrorCode, error: string): Response {
  return jsonResponse({ error, code }, status);
}

// Returns premium questions for a certification the signed-in user has purchased.
// GET /api/questions?cert=cad[&topic=business-rules][&scope=premium|all]
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const cert = url.searchParams.get("cert")?.trim().toLowerCase();
  const topic = url.searchParams.get("topic")?.trim().toLowerCase() || undefined;
  const scopeParam = url.searchParams.get("scope")?.trim().toLowerCase() || "premium";

  if (!cert) {
    return errorResponse(400, "missing_certification", "Certification is required");
  }

  if (!isKnownCertification(cert)) {
    return errorResponse(404, "unknown_certification", "Unknown certification");
  }

  if (topic && !isKnownTopic(cert, topic)) {
    return errorResponse(404, "unknown_topic", "Unknown topic");
  }

  if (scopeParam !== "premium" && scopeParam !== "all") {
    return errorResponse(400, "invalid_scope", "Scope must be premium or all");
  }
  const scope = scopeParam as QuestionScope;

  if (!env.SNREADY_ACCESS) {
    console.error("Premium questions API is missing the SNREADY_ACCESS KV binding");
    return errorResponse(503, "access_not_configured", "Access checks are not configured for this deployment");
  }

  let sessionAccess: Awaited<ReturnType<typeof getSessionAccess>>;
  try {
    sessionAccess = await getSessionAccess(request, env.SNREADY_ACCESS);
  } catch (error) {
    console.error("Premium questions access lookup failed", { cert, error });
    return errorResponse(502, "access_lookup_failed", "Access lookup failed");
  }

  if (!sessionAccess.authenticated) {
    return errorResponse(401, "not_authenticated", "Log in to access premium questions");
  }

  if (!hasCertificationAccess(sessionAccess.access, cert)) {
    return errorResponse(403, "no_access", "Your account does not include this certification");
  }

  const questions = getQuestions(cert, { topic, scope });

  return jsonResponse(
    {
      certification: cert,
      ...(topic ? { topic } : {}),
      scope,
      count: questions.length,
      questions,
    },
    200
  );
};
