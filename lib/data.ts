import certificationsData from "@/data/certifications.json";
import csaTopics from "@/data/topics/csa-topics.json";
import type { Certification, CertificationWithReadiness, Topic, Question, ExamDomain, CertificationCategory } from "@/types";

// Category display names mapping
const categoryDisplayNames: Record<CertificationCategory, string> = {
  foundation: "Foundation",
  developer: "Developer",
  architect: "Architect",
  "platform-owner": "Platform Owner",
  itsm: "IT Service Management",
  "customer-service": "Customer Service",
  hr: "Human Resources",
  itom: "IT Operations Management",
  secops: "Security Operations",
  grc: "Governance, Risk & Compliance",
  itam: "IT Asset Management",
  spm: "Strategic Portfolio Management",
  "service-provider": "Service Provider",
  specialist: "Application Specialist",
  micro: "Micro-Certifications",
};

// Category descriptions for SEO and landing pages
const categoryDescriptions: Record<CertificationCategory, string> = {
  foundation:
    "Entry-level ServiceNow certifications that establish core platform knowledge. These certifications are the starting point for any ServiceNow career path and validate fundamental skills in system administration and platform operations.",
  developer:
    "Technical certifications for professionals who build custom applications and integrations on the ServiceNow platform. Covers scripting, APIs, UI development, and advanced platform customization.",
  architect:
    "Expert-level certification for senior technical professionals who design enterprise-scale ServiceNow implementations. Validates deep expertise in platform architecture, integration patterns, and best practices.",
  "platform-owner":
    "Strategic certifications for professionals who govern and optimize ServiceNow platform investments. Covers platform strategy, governance frameworks, and organizational change management.",
  itsm:
    "IT Service Management certifications covering ITIL-aligned processes implemented in ServiceNow. Validates expertise in incident, problem, change, and service catalog management.",
  "customer-service":
    "Customer service and field service management certifications. Covers case management, agent workspace, field service scheduling, and customer engagement workflows.",
  hr:
    "Human Resources Service Delivery certifications for HR professionals implementing ServiceNow HR solutions. Covers employee service center, case management, and HR workflow automation.",
  itom:
    "IT Operations Management certifications covering discovery, service mapping, event management, and cloud provisioning. Essential for infrastructure and operations teams.",
  secops:
    "Security Operations certifications for security professionals. Covers vulnerability response, security incident response, and threat intelligence integration.",
  grc:
    "Governance, Risk, and Compliance certifications covering risk management, compliance frameworks, and audit management. Essential for GRC professionals and compliance teams.",
  itam:
    "IT Asset Management certifications covering software and hardware asset lifecycle management. Validates expertise in license compliance, procurement, and asset optimization.",
  spm:
    "Strategic Portfolio Management certifications covering project portfolio management, agile development, and application portfolio management on ServiceNow.",
  "service-provider":
    "Certifications for managed service providers and telecommunications companies implementing ServiceNow for multi-tenant operations and service delivery.",
  specialist:
    "Specialized certifications covering specific ServiceNow applications and advanced implementation scenarios. Validates deep expertise in targeted platform areas.",
  micro:
    "Focused micro-certifications that validate specific skills and competencies. Ideal for professionals seeking targeted knowledge validation in specific ServiceNow areas.",
};

// Certification data access
export function getAllCertifications(): Certification[] {
  return certificationsData.certifications as Certification[];
}

export function getCertificationBySlug(slug: string): Certification | undefined {
  return certificationsData.certifications.find(
    (cert) => cert.slug === slug
  ) as Certification | undefined;
}

export function getCertificationSlugs(): string[] {
  return certificationsData.certifications.map((cert) => cert.slug);
}

// Topic data access
const topicsMap: Record<string, typeof csaTopics> = {
  csa: csaTopics,
};

export function getTopicsForCertification(certSlug: string): Topic[] {
  const topics = topicsMap[certSlug];
  if (!topics) return [];
  return topics.topics.map((topic) => ({
    ...topic,
    certification: certSlug,
    keyConcepts: topic.keyConcepts,
  })) as unknown as Topic[];
}

export function getTopicBySlug(
  certSlug: string,
  topicSlug: string
): Topic | undefined {
  const topics = getTopicsForCertification(certSlug);
  return topics.find((topic) => topic.slug === topicSlug);
}

export function getAllTopicSlugs(): { certification: string; topic: string }[] {
  const allSlugs: { certification: string; topic: string }[] = [];

  for (const certSlug of Object.keys(topicsMap)) {
    const topics = getTopicsForCertification(certSlug);
    for (const topic of topics) {
      allSlugs.push({ certification: certSlug, topic: topic.slug });
    }
  }

  return allSlugs;
}

// Question data access (dynamic import for questions)
export async function getQuestionsForTopic(
  certSlug: string,
  topicSlug: string
): Promise<Question[]> {
  try {
    const questionsModule = await import(
      `@/data/questions/${certSlug}/${topicSlug}.json`
    );
    return questionsModule.questions || [];
  } catch {
    return [];
  }
}

export async function getFreeQuestionsForTopic(
  certSlug: string,
  topicSlug: string
): Promise<Question[]> {
  const questions = await getQuestionsForTopic(certSlug, topicSlug);
  return questions.filter((q) => q.isFree);
}

// Domain helpers
export function getDomainsForCertification(certSlug: string): ExamDomain[] {
  const cert = getCertificationBySlug(certSlug);
  return cert?.domains || [];
}

// Stats helpers
export function getTotalQuestionCount(certSlug: string): number {
  const topics = getTopicsForCertification(certSlug);
  return topics.reduce((sum, topic) => sum + topic.questionCount, 0);
}

export function getTotalFreeQuestionCount(certSlug: string): number {
  const topics = getTopicsForCertification(certSlug);
  return topics.reduce((sum, topic) => sum + topic.freeQuestionCount, 0);
}

// Category helpers
export function getAllCategories(): CertificationCategory[] {
  const categories = new Set<CertificationCategory>();
  for (const cert of getAllCertifications()) {
    categories.add(cert.category);
  }
  return Array.from(categories);
}

export function getCertificationsByCategory(category: CertificationCategory): Certification[] {
  return getAllCertifications().filter((cert) => cert.category === category);
}

export function getCategoryDisplayName(category: CertificationCategory): string {
  return categoryDisplayNames[category] || category;
}

export function getCategoryDescription(category: CertificationCategory): string {
  return categoryDescriptions[category] || "";
}

export function getCertificationsGroupedByCategory(): Record<CertificationCategory, Certification[]> {
  const grouped: Record<string, Certification[]> = {};

  for (const cert of getAllCertifications()) {
    if (!grouped[cert.category]) {
      grouped[cert.category] = [];
    }
    grouped[cert.category].push(cert);
  }

  return grouped as Record<CertificationCategory, Certification[]>;
}

// Category ordering for display
const categoryOrder: CertificationCategory[] = [
  "foundation",
  "developer",
  "architect",
  "platform-owner",
  "itsm",
  "customer-service",
  "hr",
  "itom",
  "secops",
  "grc",
  "itam",
  "spm",
  "service-provider",
  "specialist",
  "micro",
];

export function getSortedCategories(): CertificationCategory[] {
  const presentCategories = getAllCategories();
  return categoryOrder.filter((cat) => presentCategories.includes(cat));
}

// Individual question access
export async function getQuestionById(
  certSlug: string,
  topicSlug: string,
  questionId: string
): Promise<Question | undefined> {
  const questions = await getQuestionsForTopic(certSlug, topicSlug);
  return questions.find((q) => q.id === questionId);
}

export async function getAllQuestionIds(): Promise<
  { certification: string; topic: string; questionId: string }[]
> {
  const allIds: { certification: string; topic: string; questionId: string }[] = [];

  for (const { certification, topic } of getAllTopicSlugs()) {
    const questions = await getQuestionsForTopic(certification, topic);
    for (const q of questions) {
      allIds.push({ certification, topic, questionId: q.id });
    }
  }

  return allIds;
}

export async function getQuestionIndex(
  certSlug: string,
  topicSlug: string,
  questionId: string
): Promise<number> {
  const questions = await getQuestionsForTopic(certSlug, topicSlug);
  return questions.findIndex((q) => q.id === questionId) + 1;
}

export async function getAdjacentQuestions(
  certSlug: string,
  topicSlug: string,
  questionId: string
): Promise<{ prev: Question | null; next: Question | null }> {
  const questions = await getQuestionsForTopic(certSlug, topicSlug);
  const currentIndex = questions.findIndex((q) => q.id === questionId);

  return {
    prev: currentIndex > 0 ? questions[currentIndex - 1] : null,
    next: currentIndex < questions.length - 1 ? questions[currentIndex + 1] : null,
  };
}

// Readiness helpers - determine if a certification has topics/questions available
export function isCertificationReady(certSlug: string): boolean {
  return getTopicsForCertification(certSlug).length > 0;
}

export function getAllCertificationsWithReadiness(): CertificationWithReadiness[] {
  return getAllCertifications().map((cert) => ({
    ...cert,
    isReady: isCertificationReady(cert.slug),
    topicCount: getTopicsForCertification(cert.slug).length,
    totalQuestions: getTotalQuestionCount(cert.slug),
  }));
}

export function getCertificationsGroupedByCategoryWithReadiness(): Record<
  CertificationCategory,
  CertificationWithReadiness[]
> {
  const grouped: Record<string, CertificationWithReadiness[]> = {};

  for (const cert of getAllCertificationsWithReadiness()) {
    if (!grouped[cert.category]) {
      grouped[cert.category] = [];
    }
    grouped[cert.category].push(cert);
  }

  // Sort within each category: ready certifications first
  for (const category of Object.keys(grouped)) {
    grouped[category].sort((a, b) => {
      if (a.isReady && !b.isReady) return -1;
      if (!a.isReady && b.isReady) return 1;
      return 0;
    });
  }

  return grouped as Record<CertificationCategory, CertificationWithReadiness[]>;
}
