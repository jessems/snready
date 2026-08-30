// Competitor comparison data for SEO pages

export interface CompetitorComparison {
  slug: string;
  name: string;
  fullName: string;
  description: string;
  website: string;
  pricing: {
    model: string;
    cost: string;
    details: string;
  };
  pros: string[];
  cons: string[];
  questionQuality: {
    score: number; // 1-5
    details: string;
  };
  features: {
    name: string;
    snready: boolean | string;
    competitor: boolean | string;
  }[];
  verdict: string;
  whoShouldUse: string;
  seoKeywords: string[];
}

export const competitorComparisons: CompetitorComparison[] = [
  {
    slug: "examtopics",
    name: "ExamTopics",
    fullName: "ExamTopics Brain Dumps",
    description: "ExamTopics offers crowd-sourced exam dumps with community-voted answers. While it has a large question database, the accuracy and ethics of using brain dumps are questionable.",
    website: "examtopics.com",
    pricing: {
      model: "Freemium with Premium tier",
      cost: "$39.99/month for premium",
      details: "Free tier shows questions with ads and rate limits. Premium removes limits."
    },
    pros: [
      "Large database of questions",
      "Community voting on answers",
      "Covers many certifications",
      "Free tier available"
    ],
    cons: [
      "Questions are brain dumps (memorized from real exams)",
      "Many answers are wrong despite community voting",
      "Violates ServiceNow certification agreement",
      "Certification can be revoked if caught using dumps",
      "Doesn't teach concepts, just memorization",
      "Answers change between users causing confusion"
    ],
    questionQuality: {
      score: 2,
      details: "Questions are real exam questions (which is unethical), but answers are often incorrect. Community voting doesn't guarantee accuracy."
    },
    features: [
      { name: "Original practice questions", snready: true, competitor: false },
      { name: "Verified correct answers", snready: true, competitor: "Community voted" },
      { name: "Detailed explanations", snready: true, competitor: "Partial" },
      { name: "Exam domain mapping", snready: true, competitor: false },
      { name: "Timed mock exams", snready: true, competitor: false },
      { name: "Mobile friendly", snready: true, competitor: true },
      { name: "Ethics compliant", snready: true, competitor: false },
      { name: "Based on official content", snready: true, competitor: "Brain dumps" },
      { name: "Progress tracking", snready: true, competitor: "Basic" },
      { name: "Free questions available", snready: "35+ per cert", competitor: "Rate limited" }
    ],
    verdict: "ExamTopics might help you pass through memorization, but it's risky. ServiceNow actively monitors for brain dump usage, and your certification can be revoked. SNReady offers original questions that teach real concepts without the ethical or legal risks.",
    whoShouldUse: "If you want to actually learn ServiceNow and have a certification you can be proud of, choose SNReady. If you're just trying to game the exam (risking revocation), ExamTopics exists.",
    seoKeywords: ["examtopics servicenow", "examtopics alternative", "servicenow brain dumps", "examtopics vs", "examtopics accuracy"]
  },
  {
    slug: "udemy",
    name: "Udemy",
    fullName: "Udemy ServiceNow Courses",
    description: "Udemy offers video courses for ServiceNow certifications. While great for learning concepts, most courses lack substantial practice questions and don't simulate the actual exam experience.",
    website: "udemy.com",
    pricing: {
      model: "One-time purchase per course",
      cost: "$13-100 per course (often on sale)",
      details: "Individual courses must be purchased separately. Frequent sales drop prices to $13-20."
    },
    pros: [
      "Video format good for visual learners",
      "Covers ServiceNow concepts well",
      "Lifetime access to purchased courses",
      "Frequent sales and discounts",
      "Good instructors on popular courses"
    ],
    cons: [
      "Practice questions are an afterthought",
      "Question quality varies wildly by instructor",
      "No timed exam simulation",
      "Doesn't track progress by exam domain",
      "Need multiple courses for comprehensive prep",
      "Content can be outdated (tied to old releases)"
    ],
    questionQuality: {
      score: 3,
      details: "Varies by course. Some instructors include quality questions, others have minimal or poorly written ones. Not designed as primary exam prep."
    },
    features: [
      { name: "Video lessons", snready: false, competitor: true },
      { name: "Hands-on labs", snready: false, competitor: "Some courses" },
      { name: "Practice questions", snready: "1,350+", competitor: "Varies (50-200)" },
      { name: "Timed mock exams", snready: true, competitor: false },
      { name: "Exam domain mapping", snready: true, competitor: false },
      { name: "Detailed explanations", snready: true, competitor: "Varies" },
      { name: "Progress tracking", snready: true, competitor: "Video completion only" },
      { name: "Updated for current release", snready: "Xanadu/Yokohama", competitor: "Varies" },
      { name: "Mobile app", snready: "Responsive web", competitor: true },
      { name: "Free preview", snready: "15 free questions per cert", competitor: "Video previews" }
    ],
    verdict: "Udemy is excellent for learning ServiceNow concepts through video, but it's not designed for exam practice. Use Udemy to learn the material, then use SNReady to practice for the actual exam. They complement each other well.",
    whoShouldUse: "Use Udemy if you're new to ServiceNow and need foundational knowledge. Add SNReady when you're ready to practice for the certification exam.",
    seoKeywords: ["udemy servicenow", "udemy csa course", "servicenow certification udemy", "best servicenow course", "udemy vs practice tests"]
  },
  {
    slug: "skillcertpro",
    name: "SkillCertPro",
    fullName: "SkillCertPro Practice Exams",
    description: "SkillCertPro is a popular practice test provider mentioned frequently on Reddit. They offer practice questions for various IT certifications including ServiceNow.",
    website: "skillcertpro.com",
    pricing: {
      model: "One-time purchase per certification",
      cost: "$15-25 per certification",
      details: "Lifetime access to purchased question banks."
    },
    pros: [
      "Affordable one-time pricing",
      "Frequently mentioned on Reddit",
      "Large question banks (500-600 questions)",
      "Covers multiple ServiceNow certifications"
    ],
    cons: [
      "Source of questions unclear (may include dumps)",
      "Some reported inaccurate answers",
      "Interface is dated",
      "Limited explanations for answers",
      "No exam domain breakdown"
    ],
    questionQuality: {
      score: 3,
      details: "Mixed reports. Some users pass using it, others report incorrect answers. The source of questions isn't transparent."
    },
    features: [
      { name: "Transparent question sourcing", snready: true, competitor: false },
      { name: "Verified correct answers", snready: true, competitor: "Mostly" },
      { name: "Detailed explanations", snready: true, competitor: "Basic" },
      { name: "Exam domain mapping", snready: true, competitor: false },
      { name: "Timed mock exams", snready: true, competitor: true },
      { name: "Modern interface", snready: true, competitor: false },
      { name: "Progress tracking by domain", snready: true, competitor: false },
      { name: "Free questions available", snready: "15 per cert", competitor: false },
      { name: "Question explanations", snready: "Detailed", competitor: "Brief" }
    ],
    verdict: "SkillCertPro is affordable and has helped people pass, but the question sourcing isn't transparent and some answers are incorrect. SNReady offers verified answers, detailed explanations, and domain-mapped progress tracking.",
    whoShouldUse: "Budget-conscious test-takers who want lots of questions. Choose SNReady if you value accuracy, explanations, and knowing your weak domains.",
    seoKeywords: ["skillcertpro servicenow", "skillcertpro review", "skillcertpro vs", "servicenow practice tests reddit"]
  },
  {
    slug: "servicenow-nowlearning",
    name: "Now Learning",
    fullName: "ServiceNow Now Learning (Official)",
    description: "ServiceNow's official learning platform offers the courses required for certification, including some practice questions. It's the authoritative source but limited in practice question volume.",
    website: "nowlearning.servicenow.com",
    pricing: {
      model: "Free with ServiceNow account",
      cost: "Free",
      details: "Courses are free. Certification exams cost $210-315."
    },
    pros: [
      "Official source material",
      "Required courses for certification",
      "Free to access",
      "Always up-to-date with latest release",
      "Includes labs and simulators"
    ],
    cons: [
      "Limited practice questions (10-20 per course)",
      "No timed exam simulation",
      "Practice questions don't match exam difficulty",
      "No domain-based progress tracking",
      "Can't focus on weak areas"
    ],
    questionQuality: {
      score: 4,
      details: "Questions are accurate but limited in number. Knowledge checks test understanding but don't simulate exam conditions."
    },
    features: [
      { name: "Official content", snready: "Based on official", competitor: true },
      { name: "Practice questions", snready: "1,350+", competitor: "10-20 per course" },
      { name: "Timed mock exams", snready: true, competitor: false },
      { name: "Exam simulation", snready: true, competitor: false },
      { name: "Domain progress tracking", snready: true, competitor: false },
      { name: "Video lessons", snready: false, competitor: true },
      { name: "Hands-on labs", snready: false, competitor: true },
      { name: "Free", snready: "Freemium", competitor: true }
    ],
    verdict: "Now Learning is essential — you should complete the required courses. But for exam practice, you need more questions and exam simulation. Use Now Learning to learn, then SNReady to practice.",
    whoShouldUse: "Everyone should use Now Learning for the official courses. Add SNReady for dedicated exam practice with full mock exams.",
    seoKeywords: ["servicenow now learning", "nowlearning practice tests", "servicenow official training"]
  }
];

export function getCompetitorBySlug(slug: string): CompetitorComparison | undefined {
  return competitorComparisons.find(c => c.slug === slug);
}

export function getAllCompetitorSlugs(): string[] {
  return competitorComparisons.map(c => c.slug);
}
