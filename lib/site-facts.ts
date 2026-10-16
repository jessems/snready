// Exam facts shown across the site, kept in one place so they can be sourced
// and re-reviewed together. Every claim here has a source in the comment above
// it; do not add exam facts elsewhere without one.

import type { Certification } from "@/types";

/** Date the exam facts and indexable pages were last reviewed by a person. */
export const LAST_REVIEWED_ISO = "2026-10-16";
export const LAST_REVIEWED_LABEL = "16 October 2026";

// Source: official exam blueprints (e.g. CSA KB0011554). ServiceNow scores
// against a predetermined cut score that it does not publish, and it is not
// always 70%. Never present 70% as the official passing score.
export const CUT_SCORE_LABEL = "Not published";
export const CUT_SCORE_NOTE =
  "ServiceNow does not publish the cut score, and the official exam blueprint says it is not always 70%.";
/** Pass mark SNReady uses for its own practice mock exams (not ServiceNow's). */
export const PRACTICE_PASS_TARGET = 70;

// Source: ServiceNow Community, "2026 exam vouchers, courses, exams & retakes -
// major changes explained" (18 Jan 2026):
// https://www.servicenow.com/community/training-and-certifications/2026-exam-vouchers-courses-exams-amp-retakes-major-changes/ba-p/3464930
// Exams moved from Kryterion/Webassessor to Pearson VUE; they are registered
// and paid for in ServiceNow University; exam vouchers no longer exist. The
// source does not say whether delivery is online or at a test centre, so
// neither is claimed here.
export const EXAM_DELIVERY_SOURCE_URL =
  "https://www.servicenow.com/community/training-and-certifications/2026-exam-vouchers-courses-exams-amp-retakes-major-changes/ba-p/3464930";
export const EXAM_DELIVERY =
  "Registered and paid for in ServiceNow University, scheduled through Pearson VUE";
export const EXAM_DELIVERY_SHORT = "Pearson VUE via ServiceNow University";

/**
 * Exam fee in USD, or null when we have no source for it. Fees come from
 * certifications.json (CSA/CAD $300, CIS exams $450, per the source above).
 */
export function getExamCost(cert: Pick<Certification, "examDetails">): number | null {
  return cert.examDetails.cost ?? null;
}

export function formatExamCost(cert: Pick<Certification, "examDetails">): string {
  const cost = getExamCost(cert);
  return cost === null ? "See ServiceNow University" : `$${cost}`;
}
