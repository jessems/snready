// Shared types for the question generation pipeline. See docs/question-pipeline.md.

// ---------- S1 Blueprint ----------

export interface BlueprintObjective {
  id: string; // "csa.d3.o2"
  name: string; // "List and Form anatomy"
}

export interface BlueprintDomain {
  id: string; // "csa.d3"
  number: number; // 3
  name: string;
  weight: number; // percentage, e.g. 20
  objectives: BlueprintObjective[];
}

export interface Blueprint {
  cert: string; // site slug, e.g. "csa"
  certCode: string; // code used in cert-sources.csv, e.g. "CSA"
  release: string; // docs release branch, e.g. "australia"
  spec: { kb: string; url: string; updated: string } | null;
  examItemCount: number | null;
  domains: BlueprintDomain[];
}

// ---------- S2 Sources ----------

export type SourceOrigin = "blueprint" | "curated" | "discovered";

export interface DocSource {
  kind: "doc";
  url: string; // canonical docs URL
  subpath: string; // "platform-security/access-control/exploring-access-control-list"
  title: string;
  domainIds: string[];
  objectiveIds: string[];
  origin: SourceOrigin;
}

export interface CourseSource {
  kind: "course";
  url: string;
  title: string;
  status: "skipped"; // course scraping is out of scope for now
}

export interface SourceManifest {
  cert: string;
  release: string;
  docs: DocSource[];
  courses: CourseSource[];
}

// ---------- S3/S4 Corpus ----------

export interface CorpusPage {
  subpath: string;
  canonicalUrl: string;
  title: string;
  seedSubpath: string; // which source seed led here
  depth: number;
}

export interface Chunk {
  chunkId: string;
  cert: string;
  subpath: string;
  canonicalUrl: string;
  pageTitle: string;
  heading: string;
  release: string;
  domainIds: string[];
  objectiveIds: string[];
  text: string;
}

// ---------- S5 Facts ----------

export interface Fact {
  factId: string;
  factType: string; // matches an archetype's factType
  subject: string;
  relation: string;
  value: string | string[]; // list for membership / ordered facts
  context?: string; // short disambiguating context, e.g. "Knowledge Management"
  quote: string; // verbatim from the chunk
  chunkId: string;
  sourceUrl: string;
  release: string;
  domainIds: string[];
  objectiveIds: string[];
  /** Extracted to ground an official exam item (S8f), not from a general docs pass. */
  examTargeted?: boolean;
}

// ---------- S7 Observed questions ----------

/** Official sources only. Our own question bank is never observed (see s7-observed.ts). */
export type ObservedOrigin = "sample" | "measureup" | "dump";

export interface ObservedItem {
  itemId: string; // hash of normalized stem + options
  cert: string;
  origin: ObservedOrigin;
  originRef: string; // file / question id it came from
  type: string;
  stem: string;
  options: string[];
  correct: number[] | null; // indexes into options; null when unknown
  domainHint: string | null;
}

export interface Classification {
  itemId: string;
  archetypeId: string;
  domainId: string | null;
  cognitiveLevel: "knowledge" | "understanding" | "application";
  format: "multiple_choice" | "multiple_select" | "multiple_choice_negative";
}

// ---------- S8 Analysis ----------

export interface Archetype {
  id: string;
  name: string;
  description: string;
  factType: string;
  generationUse: string;
}

/** How a template turns a fact into a stem, an answer and distractors. */
export type AnswerMode =
  | { mode: "single" } // answer = fact.value (string); distractors = sibling facts' values
  | { mode: "reverse" } // stem shows fact.value, answer = fact.subject; distractors = sibling subjects
  | { mode: "members"; correctCount: number } // pick N members of fact.value; distractors = non-members
  | { mode: "non_member" } // NOT/EXCEPT: 3 members are wrong, 1 non-member is correct
  | { mode: "ordinal"; position: "first" | "last" }; // ordered list, ask first/last step

export interface Template {
  templateId: string; // "<archetypeId>.t01"
  archetypeId: string;
  factType: string;
  relations: string[]; // facts with these relations can fill the template
  format: "multiple_choice" | "multiple_select" | "multiple_choice_negative";
  cognitiveLevel: "knowledge" | "understanding" | "application";
  answer: AnswerMode;
  /** Stem phrasings; {subject} (or {value} for reverse) and {context} are substituted. */
  stems: string[];
  optionCount: number;
}

export interface DistributionRow {
  key: string;
  count: number;
  share: number; // 0..1
}

export interface Distribution {
  cert: string;
  basis: { observedItems: number; origins: Record<string, number> };
  archetypes: DistributionRow[];
  formats: DistributionRow[];
  cognitiveLevels: DistributionRow[];
  /** archetype share within each domain; falls back to global shares when a domain has few items */
  byDomain: Record<string, DistributionRow[]>;
}

// ---------- S9 Plan ----------

export interface PlanQuota {
  domainId: string;
  archetypeId: string;
  target: number;
  availableInstances: number;
}

/**
 * How a generated question relates to the official item it was derived from:
 * - variant      same template (structure), different fact
 * - restructure  same fact (knowledge), different template
 */
export interface DerivedFrom {
  observedItemId: string;
  relation: "variant" | "restructure";
}

export interface DerivedTarget extends DerivedFrom {
  templateId: string;
  factId: string;
  domainId: string;
  instanceId: string;
}

export interface GenerationPlan {
  cert: string;
  totalTarget: number;
  quotas: PlanQuota[];
  gaps: Array<{ domainId: string; archetypeId: string; reason: string }>;
  /** Plans made with `plan:observed`: explicit instances derived from official items. */
  derived?: DerivedTarget[];
}

// ---------- S10-S13 Generated items ----------

export interface Identity {
  archetypeId: string;
  templateId: string;
  instanceId: string;
  familyKey: string;
  knowledgeKeys: string[];
}

export interface Draft {
  identity: Identity;
  cert: string;
  domainId: string;
  format: Template["format"];
  cognitiveLevel: Template["cognitiveLevel"];
  stem: string; // rendered from template, may be polished by the writer
  options: Array<{ id: string; text: string; correct: boolean; factId: string | null }>;
  primaryFact: Fact;
  distractorFacts: Fact[];
  derivedFrom?: DerivedFrom;
}

export interface GeneratedQuestion {
  identity: Identity;
  cert: string;
  domainId: string;
  format: Template["format"];
  cognitiveLevel: Template["cognitiveLevel"];
  stem: string;
  options: Array<{ id: string; text: string }>;
  correctAnswers: string[];
  explanation: {
    correct: string;
    wrongAnswers: Array<{ choiceId: string; explanation: string; reference: string }>;
  };
  sourceUrl: string;
  quote: string;
  release: string;
  derivedFrom?: DerivedFrom;
}
