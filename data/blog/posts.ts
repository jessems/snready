// Blog posts data
// Add new posts here - they'll automatically appear on /blog and in sitemap

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string; // Markdown content
  publishedAt: string; // ISO date
  updatedAt?: string;
  author: string;
  tags: string[];
  featured?: boolean;
  readingTime?: number; // minutes
}

export const blogPosts: BlogPost[] = [
  {
    slug: "free-servicenow-csa-practice-questions-2026",
    title: "Free ServiceNow CSA Practice Questions 2026 (Updated for Zurich)",
    description: "Practice with 50+ free CSA exam questions updated for the Zurich release. Detailed explanations for every answer to help you pass the ServiceNow Certified System Administrator exam.",
    publishedAt: "2026-02-22",
    author: "SNReady Team",
    tags: ["CSA", "practice questions", "free", "Zurich"],
    featured: true,
    readingTime: 8,
    content: `
## Why Practice Questions Matter for CSA Success

The ServiceNow Certified System Administrator (CSA) exam tests your practical knowledge of the Now Platform. With 60 questions in 90 minutes, you need to recognize concepts quickly—and that only comes from practice.

Unlike generic "brain dumps" that become outdated with each release, SNReady questions are generated directly from official Now Learning content. This means you're practicing with material that matches what ServiceNow actually tests.

## What's on the CSA Exam?

The CSA exam covers 8 core domains:

| Domain | Weight | Questions |
|--------|--------|-----------|
| User Interface & Navigation | 15% | ~9 |
| User Administration & Security | 15% | ~9 |
| Database Administration | 20% | ~12 |
| Self-Service & Automation | 15% | ~9 |
| Incident Management | 10% | ~6 |
| Problem Management | 5% | ~3 |
| Change Management | 10% | ~6 |
| Reporting & Dashboards | 10% | ~6 |

## Sample CSA Practice Questions

Here are 5 free practice questions to test your knowledge:

### Question 1: Lists and Filters

**A user wants to create a personal filter that only they can see. Where should they save it?**

A) Global filter
B) Group filter
C) Personal filter
D) System filter

<details>
<summary>Show Answer</summary>

**Correct Answer: C) Personal filter**

Personal filters are visible only to the user who created them. Global filters are visible to everyone, and Group filters are visible to members of specific groups. There is no "System filter" option in ServiceNow.

</details>

### Question 2: User Administration

**Which of the following is required to give a user access to a specific application?**

A) Assign the user to a group
B) Grant the user a role
C) Add the user to an ACL
D) Create a user preference

<details>
<summary>Show Answer</summary>

**Correct Answer: B) Grant the user a role**

Roles control access to applications and modules in ServiceNow. While groups can have roles assigned to them (which then apply to group members), the fundamental mechanism is the role. ACLs control record-level access, not application access.

</details>

### Question 3: Database Administration

**What is the purpose of a dictionary override?**

A) To change the dictionary definition of a word
B) To modify field attributes on an extended table without affecting the parent
C) To override system properties
D) To bypass ACL rules

<details>
<summary>Show Answer</summary>

**Correct Answer: B) To modify field attributes on an extended table without affecting the parent**

Dictionary overrides allow you to customize field properties (like mandatory, read-only, default value) on extended tables without changing the parent table's definition. This is essential for maintaining clean table inheritance.

</details>

### Question 4: Self-Service & Automation

**Which type of workflow activity sends a notification to a user?**

A) Notification activity
B) Email activity
C) Alert activity
D) Notify activity

<details>
<summary>Show Answer</summary>

**Correct Answer: A) Notification activity**

In legacy workflows, the Notification activity sends email notifications. In Flow Designer (the modern approach), you would use the "Send Email" action. Note: This question tests legacy workflow knowledge which may still appear on the exam.

</details>

### Question 5: Incident Management

**What happens when an incident is resolved?**

A) It is immediately closed
B) State changes to Resolved; awaiting user confirmation
C) It is deleted from the system
D) It moves to the Problem table

<details>
<summary>Show Answer</summary>

**Correct Answer: B) State changes to Resolved; awaiting user confirmation**

When an incident is resolved, it enters a "Resolved" state but isn't immediately closed. This allows the affected user to confirm the resolution. If no response is received within a configurable time period, the incident automatically closes.

</details>

## Get More Practice Questions

These 5 questions are just a sample. SNReady offers:

- **50+ free CSA questions** across all 8 domains
- **100+ premium questions** with detailed explanations
- **Timed mock exams** that simulate the real test
- **Domain-specific practice** to target your weak areas

[Start Free CSA Practice →](/csa/practice-questions)

## CSA Exam Tips

1. **Know the UI cold** — You'll get questions about where to find things in the platform
2. **Understand table relationships** — Base tables, extended tables, and how data inherits
3. **Practice with roles and ACLs** — Security questions are heavily weighted
4. **Don't memorize, understand** — The exam tests application of concepts, not rote memory

## Ready to Pass Your CSA Exam?

Start with our free practice questions to assess your readiness. When you're ready for the full experience, unlock all questions with detailed explanations for just $9.

[Start Free Practice →](/csa/practice-questions)
`
  },
  {
    slug: "csa-vs-cad-which-servicenow-certification-first",
    title: "CSA vs CAD: Which ServiceNow Certification Should You Get First?",
    description: "Comparing ServiceNow CSA and CAD certifications. Learn which certification is right for your career path, the prerequisites, exam difficulty, and job opportunities for each.",
    publishedAt: "2026-02-22",
    author: "SNReady Team",
    tags: ["CSA", "CAD", "career", "comparison"],
    featured: true,
    readingTime: 6,
    content: `
## The Two Entry Points to ServiceNow

If you're starting your ServiceNow certification journey, you've probably noticed two main entry-level certifications:

- **CSA (Certified System Administrator)** — For platform administrators
- **CAD (Certified Application Developer)** — For developers and builders

Both are foundational certifications, but they lead to very different career paths. Let's break down which one is right for you.

## Quick Comparison

| Aspect | CSA | CAD |
|--------|-----|-----|
| **Focus** | Platform administration | Application development |
| **Prerequisites** | None | CSA recommended |
| **Questions** | 60 | 60 |
| **Time** | 90 minutes | 90 minutes |
| **Passing Score** | 70% | 70% |
| **Exam Fee** | $210 | $210 |
| **Typical Salary** | $80K-120K | $100K-140K |

## Who Should Get CSA First?

Get CSA first if you:

- ✅ Are new to ServiceNow entirely
- ✅ Want to understand how the platform works before building on it
- ✅ Plan to work in IT operations, support, or platform administration
- ✅ Need a solid foundation before specializing
- ✅ Want the most versatile entry certification

**CSA is the most common starting point** because it teaches you how ServiceNow works at a fundamental level. Even developers benefit from understanding administration concepts.

## Who Should Get CAD First?

Get CAD first if you:

- ✅ Already have strong JavaScript experience
- ✅ Have used ServiceNow as a developer (even without formal training)
- ✅ Are focused purely on development roles
- ✅ Want to fast-track into higher-paying developer positions

**Important:** ServiceNow officially recommends CSA as a prerequisite for CAD. While it's not strictly required, CAD assumes you understand CSA concepts like tables, forms, ACLs, and the data model.

## What Does Each Certification Cover?

### CSA Exam Domains

1. **User Interface & Navigation** (15%)
2. **User Administration & Security** (15%)
3. **Database Administration** (20%)
4. **Self-Service & Automation** (15%)
5. **Incident Management** (10%)
6. **Problem Management** (5%)
7. **Change Management** (10%)
8. **Reporting & Dashboards** (10%)

### CAD Exam Domains

1. **Scripting & APIs** (25%)
2. **Application Development** (20%)
3. **Business Rules** (15%)
4. **Client Scripts** (10%)
5. **UI Policies & Actions** (10%)
6. **Script Includes** (10%)
7. **Integration/REST** (10%)

## Career Paths After Each Certification

### After CSA
- ServiceNow Administrator
- Platform Support Specialist
- ITSM Analyst
- → CIS certifications (ITSM, CSM, HR, etc.)

### After CAD
- ServiceNow Developer
- Application Developer
- Integration Specialist
- → CTA (Technical Architect) path

## My Recommendation

**For most people: Get CSA first.**

Here's why:

1. **Foundation matters** — CSA concepts appear throughout all other certifications
2. **Job flexibility** — CSA-only roles are more common at entry level
3. **Easier exam** — CSA has less technical depth than CAD
4. **Better preparation** — You'll be better prepared for CAD after CSA

**Exception:** If you're an experienced developer joining a ServiceNow team and need to be productive immediately, you could study CSA material without taking the exam, then certify for CAD directly.

## How Long to Get Both?

A realistic timeline:

- **CSA only:** 2-4 weeks of focused study
- **CSA + CAD:** 6-10 weeks total
- **CSA → CAD (sequential):** Get CSA, work with the platform for 1-3 months, then pursue CAD

## Practice for Both Certifications

SNReady offers practice questions for both certifications, generated from official Now Learning content:

- [CSA Practice Questions](/csa/practice-questions) — 100+ questions across 8 domains
- [CAD Practice Questions](/cad/practice-questions) — 130+ questions across 7 domains

Start with free questions to assess your readiness, then unlock full access when you're ready to get serious.

[Compare CSA vs CAD in Detail →](/compare/csa-vs-cad)
`
  },
  {
    slug: "servicenow-csa-exam-guide-2026",
    title: "ServiceNow CSA Exam Guide 2026: Everything You Need to Pass",
    description: "Complete guide to passing the ServiceNow CSA exam in 2026. Covers exam format, study resources, domain breakdown, practice strategies, and tips from certified professionals.",
    publishedAt: "2026-02-22",
    author: "SNReady Team",
    tags: ["CSA", "exam guide", "study guide", "2026"],
    featured: true,
    readingTime: 12,
    content: `
## What is the ServiceNow CSA Certification?

The ServiceNow Certified System Administrator (CSA) is the foundational certification for ServiceNow professionals. It validates your ability to configure, manage, and maintain a ServiceNow instance.

**Why get CSA certified?**
- Industry-recognized credential
- Required for most ServiceNow admin positions
- Foundation for all other ServiceNow certifications
- Average salary increase of 15-25% after certification

## CSA Exam Overview

| Detail | Information |
|--------|-------------|
| **Exam Code** | Mainline exam |
| **Questions** | 60 multiple choice |
| **Time Limit** | 90 minutes |
| **Passing Score** | 70% (42/60 correct) |
| **Cost** | $210 USD |
| **Format** | Proctored (in-person or online) |
| **Validity** | Valid until next major release |

## Exam Domains & Weights

The CSA exam tests 8 domains. Here's what to focus on:

### 1. User Interface & Navigation (15%)
- Next Experience UI (Polaris)
- Workspace navigation
- Lists, filters, and views
- Form configuration
- Browser/session management

**Key concepts:** Unified Navigation, Application Navigator, contextual search, favorites, history

### 2. User Administration & Security (15%)
- User provisioning
- Groups and roles
- Access Control Lists (ACLs)
- Delegated administration
- Impersonation

**Key concepts:** Role hierarchy, ACL rules, user preferences, group membership

### 3. Database Administration (20%) ⭐ Highest Weight
- Table creation and management
- Fields and data types
- Dictionary entries
- Table relationships
- Indexes and performance

**Key concepts:** Base tables vs. extended tables, reference fields, glide system properties

### 4. Self-Service & Automation (15%)
- Service Catalog
- Workflows and Flow Designer
- Notifications
- Business rules
- Scheduled jobs

**Key concepts:** Catalog items, record producers, variables, order guides

### 5. Incident Management (10%)
- Incident lifecycle
- Assignment rules
- Inactivity monitors
- Major incidents
- Communications

**Key concepts:** State values, SLAs, related lists, parent/child incidents

### 6. Problem Management (5%)
- Problem workflow
- Root cause analysis
- Known errors
- Problem tasks
- Linking to incidents

**Key concepts:** Problem vs. incident, known error database (KEDB)

### 7. Change Management (10%)
- Change types (Normal, Standard, Emergency)
- Change workflows
- CAB process
- Risk assessment
- Change calendar

**Key concepts:** Change models, approval policies, collision detection

### 8. Reporting & Dashboards (10%)
- Report types
- Dashboard creation
- Performance Analytics basics
- Scheduled reports
- Report sharing

**Key concepts:** Bar charts, pie charts, trend reports, gauges, list reports

## Study Resources

### Official (Free)
1. **Now Learning** — ServiceNow's free learning platform
   - CSA Fundamentals course
   - Admin Fundamentals course
   - Release-specific delta courses

2. **Product Documentation** — docs.servicenow.com
   - Always reference the current release (Zurich)

3. **Developer Instance** — developer.servicenow.com
   - Free personal instance for hands-on practice

### Practice Tests
- **SNReady** — Practice questions from official course content
- Start with [free CSA questions](/csa/practice-questions)

## Study Plan: 4-Week Schedule

### Week 1: Foundation
- Complete Admin Fundamentals course
- Focus: UI Navigation, User Administration
- Hands-on: Create users, groups, roles in your PDI

### Week 2: Core Technical
- Focus: Database Administration, Self-Service
- Hands-on: Create tables, fields, catalog items
- Take first practice test to identify gaps

### Week 3: ITSM Modules
- Focus: Incident, Problem, Change Management
- Hands-on: Configure ITSM workflows
- Review weak areas from practice test

### Week 4: Review & Polish
- Focus: Reporting, remaining gaps
- Take timed mock exams
- Review explanations for every wrong answer

## Exam Day Tips

### Before the Exam
- ✅ Get a good night's sleep
- ✅ Review your notes, not new material
- ✅ Arrive 15 minutes early
- ✅ Bring valid ID

### During the Exam
- ✅ Read questions carefully — watch for "NOT" and "EXCEPT"
- ✅ Flag uncertain questions and return later
- ✅ Don't spend more than 2 minutes per question
- ✅ Trust your first instinct unless you're certain

### Question Types
- **Scenario-based:** "A user reports that..." — Apply concepts to situations
- **Direct knowledge:** "Which table stores..." — Know your facts
- **Best practice:** "What is the recommended..." — Follow ServiceNow standards

## Common Mistakes to Avoid

1. **Only reading, no hands-on** — You must practice in a real instance
2. **Using outdated materials** — Always study for the current release
3. **Ignoring low-weight domains** — A 5% domain can still have 3+ questions
4. **Memorizing without understanding** — The exam tests application, not recall
5. **Skipping practice tests** — They reveal what you don't know

## After You Pass

### Maintain Your Certification
- ServiceNow certifications are release-based
- Complete the Delta exam when a new release launches
- Delta exams are shorter and focus on new features

### Next Certifications
Popular paths after CSA:
- **CAD** (Application Developer) — For technical roles
- **CIS-ITSM** — For ITSM specialists
- **CIS-CSM** — For customer service roles
- **CIS-HR** — For HR service delivery

## Start Practicing Now

Don't wait until you've read every page of documentation. Start practicing early to identify your weak areas.

[Take Free CSA Practice Questions →](/csa/practice-questions)

---

*Last updated: February 2026 for Zurich release*
`
  },
  {
    slug: "how-to-pass-servicenow-cis-itsm-exam",
    title: "How to Pass the ServiceNow CIS-ITSM Exam: Study Guide & Tips",
    description: "Complete CIS-ITSM exam preparation guide. Learn what's covered, how to study, and get practice questions for the ServiceNow IT Service Management certification.",
    publishedAt: "2026-02-22",
    author: "SNReady Team",
    tags: ["CIS-ITSM", "exam guide", "ITSM", "study guide"],
    readingTime: 10,
    content: `
## What is CIS-ITSM?

The Certified Implementation Specialist - IT Service Management (CIS-ITSM) certification validates your ability to implement and configure ServiceNow ITSM applications. It's one of the most popular CIS certifications because ITSM is the core of ServiceNow deployments.

## Prerequisites

**Required:** CSA certification
**Recommended experience:** 6-12 months working with ServiceNow ITSM

## Exam Details

| Detail | Information |
|--------|-------------|
| **Questions** | 60 multiple choice |
| **Time** | 90 minutes |
| **Passing Score** | 70% |
| **Cost** | $315 USD |

## CIS-ITSM Exam Domains

### 1. ITSM Overview & Architecture (10%)
- ITSM application suite
- Module relationships
- ITIL alignment
- Virtual Agent basics

### 2. Incident Management (20%) ⭐
- Incident workflows
- Assignment rules
- Major incident management
- Communications
- Incident matching

### 3. Problem Management (15%)
- Problem workflow
- Root cause analysis
- Known errors
- Problem tasks
- Linking to incidents/changes

### 4. Change Management (20%) ⭐
- Change types and models
- Change workflows
- CAB management
- Risk assessment
- Change calendar/collision

### 5. Request Management (15%)
- Service Catalog integration
- Request workflows
- Requested items
- Tasks and approvals

### 6. SLA Management (10%)
- SLA definitions
- Task SLAs
- Breach tracking
- Reporting

### 7. Reporting & Analytics (10%)
- ITSM dashboards
- Performance Analytics
- Metrics and KPIs
- Trend analysis

## Study Plan

### Week 1-2: Incident & Problem
- Focus on incident lifecycle
- Master problem-incident relationships
- Hands-on: Configure workflows in PDI

### Week 3: Change Management
- Deep dive into change types
- CAB and approval processes
- Risk and impact calculations

### Week 4: Request, SLA, Reporting
- Service Catalog integration
- SLA configuration
- Practice exams

## Key Differences from CSA

CIS-ITSM goes deeper than CSA on ITSM topics:
- More complex workflow scenarios
- Implementation and configuration (not just administration)
- Best practices and ITIL alignment
- Performance optimization

## Practice Resources

- [CIS-ITSM Practice Questions](/cis-itsm/practice-questions) — 63+ questions
- [Free CIS-ITSM Questions](/cis-itsm/practice-questions) — Start here
- [Timed Mock Exam](/cis-itsm/mock-exam) — Simulate the real test

[Start CIS-ITSM Practice →](/cis-itsm/practice-questions)
`
  },
  {
    slug: "servicenow-certification-path-2026",
    title: "ServiceNow Certification Path 2026: Complete Roadmap",
    description: "Navigate the ServiceNow certification landscape. See all certifications, prerequisites, career paths, and which certifications are most valuable in 2026.",
    publishedAt: "2026-02-22",
    author: "SNReady Team",
    tags: ["certifications", "career", "roadmap", "2026"],
    readingTime: 8,
    content: `
## ServiceNow Certification Landscape

ServiceNow offers 30+ certifications across different specializations. Here's how to navigate them.

## Certification Levels

### Foundational
- **CSA** — Certified System Administrator
- **CAD** — Certified Application Developer

### Professional (CIS = Certified Implementation Specialist)
- CIS-ITSM, CIS-CSM, CIS-HR, CIS-Discovery, etc.
- Require CSA as prerequisite

### Expert
- **CTA** — Certified Technical Architect
- **CMA** — Certified Master Architect

## Most Valuable Certifications in 2026

Based on job demand and salary data:

### 1. CSA (Always #1)
- Required for almost all SN positions
- Foundation for everything else
- Get this first

### 2. CAD (High Demand)
- Developer shortage means premium salaries
- $100K-140K typical range
- Good if you have coding background

### 3. CIS-ITSM (Most Common CIS)
- ITSM is core of most implementations
- Broad applicability
- Natural next step after CSA

### 4. CIS-Discovery / CIS-SM (Growing Fast)
- ITOM is expanding rapidly
- Fewer certified professionals = higher value
- Good for differentiation

### 5. CTA (Premium Tier)
- Architect-level certification
- $150K-200K+ salaries
- Requires extensive experience

## Recommended Paths

### Path A: Administrator Track
CSA → CIS-ITSM → CIS-CSM or CIS-HR → Additional CIS certs

### Path B: Developer Track
CSA → CAD → CIS specialization → CTA

### Path C: ITOM Specialist
CSA → CIS-Discovery → CIS-SM → CIS-EM

## Practice for Any Certification

SNReady offers practice questions for:
- [CSA](/csa) — 100+ questions
- [CAD](/cad) — 130+ questions  
- [CIS-ITSM](/cis-itsm) — 63 questions
- [CIS-Discovery](/cis-discovery) — 60 questions
- [And more...](/certifications)

[Browse All Certifications →](/certifications)
`
  }
];

// Helper to get all posts sorted by date
export function getAllPosts(): BlogPost[] {
  return [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

// Get a single post by slug
export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

// Get featured posts
export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter(post => post.featured);
}

// Get posts by tag
export function getPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter(post => 
    post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

// Get all unique tags
export function getAllTags(): string[] {
  const tags = new Set<string>();
  blogPosts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
  return Array.from(tags).sort();
}
