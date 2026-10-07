// S11 Write (agent stage) + S12 Validate.
//   write:packets  drafts → packets; the agent polishes the stem and writes explanations
//   write:ingest   validate outputs → data/pipeline/<cert>/generated.json (+ rejections.json)
// The agent cannot change options or which ones are correct: those come from the fact store.
import { certFile, log, readJson, readJsonIfExists, writeJson } from "../lib/io";
import { existingPackets, readPacketOutputs, writePackets } from "../lib/packets";
import { closestOfficial, officialFingerprints, tooCloseToOfficial, type OfficialFingerprint } from "../lib/official-guard";
import { normalize } from "../lib/text";
import type { Draft, GeneratedQuestion } from "../lib/types";

const STAGE = "write";
const DRAFTS_PER_PACKET = 10;

interface WriteInput {
  drafts: Array<{
    instanceId: string;
    format: Draft["format"];
    cognitiveLevel: Draft["cognitiveLevel"];
    stem: string;
    options: Array<{ id: string; text: string; correct: boolean; source: { subject: string; value: string | string[]; quote: string; url: string } }>;
    fact: { subject: string; value: string | string[]; context?: string; quote: string; url: string };
  }>;
}

interface WriteOutput {
  questions: Array<{
    instanceId: string;
    verdict: "ok" | "reject";
    rejectKind?: "trivia" | "ambiguous" | "giveaway" | "mismatch" | "other";
    reason?: string;
    stem?: string;
    cognitiveLevel?: Draft["cognitiveLevel"];
    explanation?: { correct: string; wrongAnswers: Array<{ choiceId: string; explanation: string }> };
  }>;
}

export interface Rejection {
  instanceId: string;
  stage: "writer" | "validate";
  kind?: string;
  factId: string;
  reason: string;
}

export function loadGenerated(cert: string): GeneratedQuestion[] {
  return readJsonIfExists<{ questions: GeneratedQuestion[] }>(certFile(cert, "generated.json"), { questions: [] }).questions;
}

export function loadRejections(cert: string): Rejection[] {
  return readJsonIfExists<Rejection[]>(certFile(cert, "rejections.json"), []);
}

export function runWritePackets(cert: string): void {
  const { drafts } = readJson<{ drafts: Draft[] }>(certFile(cert, "drafts.json"));
  const prior = existingPackets<WriteInput>(STAGE, cert);
  const packeted = new Set(prior.inputs.flatMap((i) => i.drafts.map((d) => d.instanceId)));
  const todo = drafts.filter((d) => !packeted.has(d.identity.instanceId));
  const factById = new Map(drafts.flatMap((d) => [d.primaryFact, ...d.distractorFacts]).map((f) => [f.factId, f]));

  const packets = [];
  for (let i = 0; i < todo.length; i += DRAFTS_PER_PACKET) {
    packets.push({
      id: `write-${String(prior.next + packets.length).padStart(3, "0")}`,
      input: {
        drafts: todo.slice(i, i + DRAFTS_PER_PACKET).map((d) => ({
          instanceId: d.identity.instanceId,
          format: d.format,
          cognitiveLevel: d.cognitiveLevel,
          stem: d.stem,
          options: d.options.map((o) => {
            const f = (o.factId && factById.get(o.factId)) || d.primaryFact;
            return { id: o.id, text: o.text, correct: o.correct, source: { subject: f.subject, value: f.value, quote: f.quote, url: f.sourceUrl } };
          }),
          fact: { subject: d.primaryFact.subject, value: d.primaryFact.value, context: d.primaryFact.context, quote: d.primaryFact.quote, url: d.primaryFact.sourceUrl },
        })),
      } satisfies WriteInput,
    });
  }
  writePackets(STAGE, cert, "write-questions.md", packets);
  log("s11", `${cert}: wrote ${packets.length} write packets for ${todo.length} drafts`);
}

/** S12: returns a rejection reason, or null when the written question is publishable. */
export function validateWritten(draft: Draft, out: WriteOutput["questions"][number], official: OfficialFingerprint[]): string | null {
  if (out.verdict !== "ok") return `writer: ${out.reason ?? "rejected"}`;
  if (!out.stem?.trim()) return "empty stem";
  const stem = ` ${normalize(out.stem)} `;
  for (const o of draft.options.filter((x) => x.correct)) {
    const answer = normalize(o.text);
    if (answer.length > 3 && stem.includes(` ${answer} `)) return `stem reveals the answer '${o.text}'`;
  }
  if (!out.explanation?.correct?.trim()) return "missing explanation";
  const wrongIds = draft.options.filter((o) => !o.correct).map((o) => o.id).sort();
  const explained = (out.explanation.wrongAnswers ?? []).map((w) => w.choiceId).sort();
  if (wrongIds.join() !== explained.join()) return `wrongAnswers must cover exactly ${wrongIds.join(",")}`;
  // Never republish an official item, even reworded: the writer polishes stems, so check the result.
  const closest = closestOfficial(out.stem, draft.options.map((o) => o.text), official);
  if (tooCloseToOfficial(closest)) {
    return `too close to official item ${closest!.itemId} (stem ${Math.round(closest!.stemSimilarity * 100)}%, options ${Math.round(closest!.optionOverlap * 100)}%)`;
  }
  return null;
}

export function runWriteIngest(cert: string): GeneratedQuestion[] {
  const drafts = new Map(readJson<{ drafts: Draft[] }>(certFile(cert, "drafts.json")).drafts.map((d) => [d.identity.instanceId, d]));
  const official = officialFingerprints(cert);
  const generated = new Map(loadGenerated(cert).map((q) => [q.identity.instanceId, q]));
  // Validation rejections are recomputed every run, so fixed rules can let items through.
  const rejections = new Map(loadRejections(cert).filter((r) => r.stage === "writer").map((r) => [r.instanceId, r]));
  let added = 0;

  for (const { output } of readPacketOutputs<WriteInput, WriteOutput>(STAGE, cert)) {
    for (const out of output.questions ?? []) {
      const draft = drafts.get(out.instanceId);
      if (!draft || generated.has(out.instanceId) || rejections.has(out.instanceId)) continue;
      const reason = validateWritten(draft, out, official);
      if (reason) {
        rejections.set(out.instanceId, {
          instanceId: out.instanceId,
          stage: out.verdict === "ok" ? "validate" : "writer",
          ...(out.verdict === "ok" ? {} : { kind: out.rejectKind ?? (/trivia/i.test(out.reason ?? "") ? "trivia" : "other") }),
          factId: draft.primaryFact.factId,
          reason,
        });
        continue;
      }
      const factById = new Map([draft.primaryFact, ...draft.distractorFacts].map((f) => [f.factId, f]));
      const url = draft.primaryFact.sourceUrl;
      const correctText = out.explanation!.correct.trim();
      generated.set(out.instanceId, {
        identity: draft.identity,
        cert,
        domainId: draft.domainId,
        format: draft.format,
        cognitiveLevel: out.cognitiveLevel ?? draft.cognitiveLevel,
        stem: out.stem!.trim(),
        options: draft.options.map((o) => ({ id: o.id, text: o.text })),
        correctAnswers: draft.options.filter((o) => o.correct).map((o) => o.id),
        explanation: {
          correct: correctText.includes(url) ? correctText : `${correctText} See ${url}`,
          wrongAnswers: out.explanation!.wrongAnswers.map((w) => {
            const option = draft.options.find((o) => o.id === w.choiceId)!;
            return { choiceId: w.choiceId, explanation: w.explanation, reference: (option.factId && factById.get(option.factId)?.sourceUrl) || url };
          }),
        },
        sourceUrl: url,
        quote: draft.primaryFact.quote,
        release: draft.primaryFact.release,
        ...(draft.derivedFrom ? { derivedFrom: draft.derivedFrom } : {}),
      });
      added++;
    }
  }

  const list = [...generated.values()].sort((a, b) => a.identity.instanceId.localeCompare(b.identity.instanceId));
  writeJson(certFile(cert, "generated.json"), { cert, questions: list });
  writeJson(certFile(cert, "rejections.json"), [...rejections.values()]);
  log("s12", `${cert}: +${added} questions (${list.length} total), ${rejections.size} rejected overall`);
  return list;
}
