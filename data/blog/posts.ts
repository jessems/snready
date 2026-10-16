// Blog posts data
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  tags: string[];
  featured?: boolean;
  readingTime?: number;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-pass-servicenow-csa-first-time",
    title: "How to Pass the ServiceNow CSA Exam on Your First Try (2026 Guide)",
    description: "A sourced CSA preparation guide: the January 2026 blueprint domains, where each requirement belongs on the platform, a study plan, worked scenarios, and 2026 booking, fee and retake rules.",
    publishedAt: "2026-03-25",
    updatedAt: "2026-10-16",
    author: "Jesse Szepieniec",
    tags: ["CSA", "exam prep", "study guide", "certifications"],
    featured: true,
    readingTime: 16,
    // Body is rendered by components/blog-guides/CsaGuidePost.tsx (see BLOG_GUIDE_BODIES).
    content: "",
  },
  {
    slug: "servicenow-cis-discovery-exam-guide-2026",
    title: "CIS-Discovery Exam 2026: What You Actually Need to Know",
    description: "The complete guide to passing the ServiceNow CIS-Discovery certification. Covers all 4 exam domains, pattern design, CMDB integration, and the gotchas that catch experienced admins.",
    publishedAt: "2026-03-25",
    updatedAt: "2026-10-16",
    author: "SNReady Team",
    tags: ["CIS-Discovery", "certifications", "study-guide", "CMDB", "exam-prep"],
    readingTime: 12,
    content: `
## Why CIS-Discovery Is Different

Most CIS exams test you on configuring a module. CIS-Discovery tests you on understanding a **system of systems** — Discovery doesn't just live in ServiceNow. It reaches out to your infrastructure, scans networks, classifies devices, and populates the CMDB.

If you've only configured ITSM modules, this exam will surprise you. It's as much about networking concepts and infrastructure as it is about ServiceNow.

## The Exam Blueprint

| Domain | Weight | Focus |
|--------|--------|-------|
| **Pattern Design** | ~35% | Discovery patterns, probes, sensors, classifiers |
| **Discovery Configuration** | ~35% | Schedules, credentials, MID servers, network scanning |
| **CMDB Integration** | ~15% | Reconciliation, IRE, CI relationships |
| **Engagement Readiness** | ~15% | Planning, prerequisites, customer conversations |

**The big takeaway:** 70% of the exam is Pattern Design + Discovery Configuration. Master these two and you're most of the way there.

## Domain 1: Pattern Design (~35%)

This is the most technical domain. It covers how Discovery identifies and classifies what it finds.

### How Discovery Works (The Flow)

1. **Schedule triggers** → Discovery starts scanning
2. **Port scan** → Finds devices on the network
3. **Classification** → Determines device type (Windows server, Linux, network switch, etc.)
4. **Exploration** → Runs patterns/probes to collect details
5. **CMDB update** → Creates/updates CIs with discovered data

### Patterns vs Probes/Sensors

**Horizontal patterns** are the modern approach:
- Written in ServiceNow Pattern Language (SNPL)
- Visual pattern designer
- Reusable steps
- Easier to maintain and debug

**Probes and sensors** are the legacy approach:
- Probes: SSH/WMI/SNMP commands sent to devices
- Sensors: Scripts that parse probe results
- Still used for custom discovery scenarios

**Exam tip:** Know BOTH. The exam tests the modern approach but also asks about legacy patterns/probes for troubleshooting.

### Key Concepts

**Classifiers** determine WHAT a device is:
- Port-based classification (port 22 → likely Linux)
- Banner-based (connection response identifies device type)
- SNMP-based (sysObjectID identifies network devices)

**Identification rules** determine if a discovered CI already exists:
- Prevent duplicates in CMDB
- Match on serial number, IP, hostname, or combinations
- Rule order matters — first match wins

**Discovery patterns** collect DETAILS about a classified device:
- OS version, installed software, hardware specs
- Running processes, services
- Network interfaces, IP addresses
- Relationships (this server connects to that database)

### What the Exam Tests

- When to create a custom pattern vs modify an existing one
- How to troubleshoot a pattern that's not collecting expected data
- The difference between horizontal and vertical discovery
- How classifier priority works
- What happens when identification rules conflict

## Domain 2: Discovery Configuration (~35%)

### MID Server

The MID (Management, Instrumentation, and Discovery) Server is the bridge between ServiceNow and your infrastructure.

**Must-know facts:**
- Runs on-premises (or in your cloud VPC)
- Java application connecting to your ServiceNow instance
- Communicates outbound on port 443 (HTTPS) — no inbound firewall rules needed
- Multiple MID Servers can be deployed for load balancing and network segmentation
- **MID Server clusters** share workload across a group

**Common exam topics:**
- MID Server placement (which network segment)
- MID Server validation and testing
- Troubleshooting MID Server connectivity
- When to use multiple MID Servers

### Credentials

Discovery needs credentials to log into devices and collect information.

**Credential types:**
- SSH (Linux/Unix)
- Windows (WMI/PowerShell)
- SNMP (network devices)
- VMware (vCenter/ESXi)
- Cloud credentials (AWS, Azure, GCP)

**Credential affinity:**
- After successful authentication, Discovery remembers which credential worked for each IP
- Speeds up subsequent Discovery runs
- Can be manually overridden

**Security considerations:**
- Use least-privilege accounts
- Credentials stored encrypted in ServiceNow
- MID Server retrieves credentials per-scan (not stored on MID)

### Discovery Schedules

- **Quick Discovery:** Scan a single IP or small range for testing
- **Scheduled Discovery:** Regular scans on a schedule (daily, weekly)
- **CI-based Discovery:** Rescan known CIs to update their data

**Configuration:**
- IP ranges to include/exclude
- Which MID Server to use
- Credential order
- Behavior settings (scan type, timeout, max devices)

### Network Scanning

- **Shazzam** probes for port scanning
- Port-based device classification
- Ping sweep vs. targeted scanning
- How to handle devices behind firewalls
- SNMP community strings for network devices

## Domain 3: CMDB Integration (~15%)

Discovery's output is CMDB data. You need to understand how discovered data becomes CI records.

### Identification and Reconciliation Engine (IRE)

IRE is the gatekeeper between Discovery and the CMDB:

1. **Identification rules** — Match discovered device to existing CI
2. **Reconciliation rules** — When multiple sources report different data, which source wins?
3. **Data refresh rules** — How often can a CI be updated?

**Key concept:** Discovery isn't the only thing writing to the CMDB. Import sets, manual entry, and third-party tools also create CIs. IRE ensures consistency regardless of source.

### CI Relationships

Discovery doesn't just find individual CIs — it maps relationships:

- Server → runs on → Virtual Host
- Application → uses → Database
- Load Balancer → connects to → Server pool
- Server → has network interface → IP Address

Relationship types and their directionality come up on the exam.

### Reconciliation

When Discovery says a server has 16GB RAM but an import set says 32GB:

- **Reconciliation rules** determine which source wins
- Source priority is configurable
- "Most authoritative source" concept
- Manual overrides can be protected from Discovery updates

## Domain 4: Engagement Readiness (~15%)

This domain tests whether you can plan and execute a Discovery implementation for a customer.

### Prerequisites Checklist

Before running Discovery, a customer needs:
- [ ] MID Server deployed in each network segment
- [ ] Credentials for target device types
- [ ] Firewall rules allowing MID Server communication
- [ ] IP ranges documented
- [ ] CMDB class structure planned
- [ ] Identification rules configured

### Planning Conversations

The exam asks about:
- What information to gather from a customer before starting
- How to scope a Discovery implementation
- Phased rollout approaches (start small, expand)
- Success criteria and validation

### Common Implementation Challenges

- Firewall blocking MID Server probes
- Insufficient credentials (wrong permissions)
- Duplicate CIs from misconfigured identification rules
- Discovery timeout on large networks
- Credential affinity pointing to wrong credentials

## Study Strategy

### Week 1-2: Fundamentals
- Make sure you've passed **CIS-DF** (Data Foundations) — it's required before you can take CIS-Discovery
- Complete **Discovery Fundamentals** on Now Learning
- Understand the complete Discovery flow (scan → classify → explore → update CMDB)
- Get comfortable with MID Server concepts

### Week 3: Pattern Design Deep Dive
- Study horizontal patterns and the pattern designer
- Understand probes, sensors, and classifiers
- Practice identifying pattern issues in scenarios

### Week 4: Configuration & Integration
- Focus on schedules, credentials, and network scanning
- Study IRE and reconciliation rules
- Review CMDB relationship types

### Week 5: Practice & Review
- Take practice tests
- Focus on scenario-based questions
- Review weak areas

## Pro Tips for Exam Day

1. **Read scenarios carefully** — Discovery questions often have long setups with specific details that matter
2. **Think about the flow** — When troubleshooting, trace the Discovery flow: schedule → MID Server → scan → classify → explore → CMDB
3. **Know your protocols** — SSH (22), WMI (135/5985), SNMP (161), VMware (443)
4. **MID Server is usually the answer** — If something isn't working, it's often a MID Server configuration or connectivity issue
5. **IRE before CMDB** — Always think about identification rules before worrying about CMDB data

## Common Mistakes

### 1. Treating It Like a CMDB Exam
CIS-Discovery is about the DISCOVERY PROCESS, not CMDB management. CMDB is 15% of the exam. Pattern design and configuration are 70%.

### 2. Ignoring Network Concepts
If you don't understand subnets, ports, SSH vs WMI, and basic networking, you'll struggle. This isn't pure ServiceNow configuration knowledge.

### 3. Skipping Engagement Readiness
15% is "soft" content about planning and implementation. Don't skip it — that's 9 questions.

### 4. Not Understanding Horizontal Patterns
The exam is shifting toward the modern pattern approach. Know the pattern designer, SNPL basics, and when to use patterns vs legacy probes.

## The Bottom Line

CIS-Discovery is one of the more technical CIS exams. It rewards people who understand infrastructure, networking, and how systems talk to each other.

If you've deployed Discovery in a real environment, you have a massive advantage. If you haven't, spend extra time on the MID Server and networking sections — those are where pure ServiceNow admins struggle.

[Practice CIS-Discovery Questions →](/cis-discovery/practice-questions)

[Take a Timed CIS-Discovery Mock Exam →](/cis-discovery/mock-exam)

---

*Updated October 2026. Covers the current CIS-Discovery exam blueprint.*
`
  },
  {
    slug: "servicenow-practice-test-comparison-2026",
    title: "ServiceNow Practice Tests Compared: What's Worth Your Money in 2026",
    description: "We bought and tested every major ServiceNow practice test platform. Here's an honest comparison of ExamTopics, Udemy, SkillCertPro, Dion Training, and SNReady.",
    publishedAt: "2026-03-25",
    author: "SNReady Team",
    tags: ["practice tests", "comparison", "exam prep", "CSA", "CAD"],
    featured: true,
    readingTime: 10,
    content: `
## Why This Comparison Exists

You're preparing for a ServiceNow certification. You want practice questions. You Google it. You find:

- ExamTopics (free, crowd-sourced)
- Udemy courses with practice tests ($10-50)
- SkillCertPro ($20-40)
- Dion Training ($15-30)
- SNReady (CSA free, $9 per other cert)
- Random websites with "free ServiceNow questions"

Which one actually helps you pass?

We tested all of them. Here's what we found.

## The Quick Comparison

| Platform | Price | Questions | Explanations | Updated? | Accuracy |
|----------|-------|-----------|-------------|----------|----------|
| **ExamTopics** | Free | 200-400/cert | Community-sourced | Rarely | ~60-70% |
| **Udemy** | $10-50 | 100-300/cert | Varies by instructor | Depends | ~75-85% |
| **SkillCertPro** | $20-40/cert | 400-600/cert | Brief | Occasionally | ~80-85% |
| **Dion Training** | $15-30 | 150-250/cert | Good | Yes | ~85-90% |
| **SNReady** | CSA free, $9/other cert | 90-220/cert | Detailed (why right + wrong) | Yes | ~90-95% |

## ExamTopics: The Free Option

**What it is:** A crowd-sourced question bank where users submit questions and vote on answers.

**Pros:**
- Free
- Large question banks (200-400 per cert)
- Active discussion threads

**Cons:**
- **Answers are frequently wrong.** The "community verified" answers are voted on by people who haven't passed the exam yet. We found roughly 30-40% of "verified" answers were incorrect or debatable.
- No real explanations — just "the answer is B"
- Questions may be leaked exam content (legal/ethical concerns)
- No timed exam simulation
- Ads everywhere

**Our verdict:** Useful for seeing question FORMAT, but dangerous if you trust the answers. Always cross-reference with ServiceNow documentation.

**Best for:** People who want free exposure to question styles but will verify answers independently.

## Udemy Practice Tests

**What it is:** Individual instructors create practice test courses. Quality varies enormously.

**Pros:**
- Cheap during sales ($10-15)
- Some instructors are excellent
- 30-day refund policy
- Timed test simulation

**Cons:**
- **Quality is inconsistent.** Some Udemy "practice tests" are repackaged brain dumps. Others are thoughtful, original questions.
- Hard to know which instructor is good before buying
- Some courses haven't been updated in years
- Explanations range from excellent to nonexistent
- ServiceNow specifically is underserved on Udemy

**Best courses we found (CSA):**
- Look for courses with 4.5+ rating AND recent reviews mentioning the current ServiceNow version
- Avoid anything with "100% pass guaranteed" in the title

**Our verdict:** Worth $10-15 during a sale IF you pick the right instructor. Read recent reviews carefully.

**Best for:** People who learn well from course platforms and want structure.

## SkillCertPro

**What it is:** Dedicated ServiceNow certification prep platform. Mentioned frequently on Reddit.

**Pros:**
- Large question banks (400-600 per cert)
- Specifically focused on ServiceNow
- Multiple test modes
- Frequently mentioned on r/servicenow as helpful

**Cons:**
- Explanations are brief (usually 1-2 sentences)
- Some questions feel like memorization exercises rather than concept tests
- UI is functional but dated
- Pricing is per-certification ($20-40 each)
- Some questions are outdated (older versions)

**Reddit says:**
> "SkillCert Pro exam dumps. $20 for ~600 questions and I passed CSA 10 days after."

> "I found that around half of the questions were already on SkillCertPro."

**Our verdict:** Good volume of questions at a reasonable price. The sheer number of questions helps, but the brief explanations mean you need to self-study WHY answers are correct.

**Best for:** People who want lots of questions to drill and can self-teach from brief explanations.

## Dion Training

**What it is:** Jason Dion's practice tests, available on Udemy and his own platform.

**Pros:**
- Good explanations for most questions
- Updated with ServiceNow versions
- Reasonable pricing
- Good for understanding concepts, not just answers

**Cons:**
- Smaller question banks than SkillCertPro
- Not all ServiceNow certifications covered
- Some questions are easier than the actual exam

**Our verdict:** Solid choice, especially for CAD and CSA. Better explanations than SkillCertPro, fewer questions.

**Best for:** People who prefer quality explanations over quantity.

## SNReady (Us)

**What it is:** Practice questions generated from official ServiceNow course content with detailed explanations.

**We're biased, so here's the honest version:**

**Pros:**
- Every question sourced from official Now Learning content
- Detailed explanations: why the right answer is right AND why each wrong answer is wrong
- Timed mock exams simulating real exam conditions
- 20 certifications covered (CSA, CAD, all CIS)
- CSA is completely free, including timed mock exams
- $9 per other certification (cheapest paid option)
- Free questions available for every cert (no credit card)
- Updated with each ServiceNow release

**Cons:**
- Smaller question banks than SkillCertPro (80-220 per cert vs 400-600)
- Newer platform — less community history
- No mobile app (responsive web only)
- No discussion forums (yet)

**Our honest assessment:** We built SNReady because existing options either had wrong answers (ExamTopics), no explanations (SkillCertPro), or were overpriced. We optimize for learning, not volume.

If you need 600 questions to drill, SkillCertPro has more. If you want to understand concepts deeply with fewer but better questions, that's us.

**Best for:** People who want to understand WHY, not just memorize WHAT.

## Now Learning (Official)

**What it is:** ServiceNow's own training platform. Not a practice test service, but includes knowledge checks.

**Pros:**
- Free
- Authoritative source material
- The exam is literally based on this content
- Includes hands-on labs

**Cons:**
- Knowledge checks are basic (not exam-level difficulty)
- No timed exam simulation
- Questions don't cover full exam breadth
- More of a learning platform than a test platform

**Our verdict:** Should be your FIRST resource, always. But the knowledge checks alone aren't enough to prepare for the exam.

**Best for:** Everyone. Start here, then supplement with practice tests.

## The Optimal Strategy (Regardless of Budget)

### If you have $0:
1. Complete Now Learning courses (free)
2. Practice in a PDI (free)
3. Use ExamTopics for question format exposure (free, but verify answers yourself)
4. Use SNReady's free CSA practice test and mock exams, plus the free questions for every other cert (no credit card needed)

### If you have $9-20:
1. Complete Now Learning courses (free)
2. Practice in a PDI (free)
3. Buy one practice test platform (SNReady at $9 or SkillCertPro at $20-40)
4. Use free questions from the other platforms

### If you have $50+:
1. Complete Now Learning courses (free)
2. Practice in a PDI (free)
3. Buy SNReady for concept understanding ($9)
4. Buy SkillCertPro for volume drilling ($20-40)
5. Optionally: Dion Training for additional perspective

## What Actually Predicts Passing

After analyzing hundreds of exam reports from Reddit, the pattern is clear:

1. **Reading the official ebook** is the #1 predictor of passing
2. **Hands-on PDI time** is #2
3. **Practice questions that explain WHY** are #3
4. **Volume of practice questions** matters less than understanding

People who memorize 600 questions but don't understand concepts fail scenario-based questions. People who study 100 questions deeply but understand the platform pass.

## Red Flags to Watch For

Avoid any practice test platform that:
- Claims to have "actual exam questions" (that's a brain dump)
- Guarantees you'll pass (no one can guarantee that)
- Has no explanations for answers
- Hasn't been updated in 2+ years
- Has suspiciously high ratings with no negative reviews

## The Bottom Line

| Your Priority | Best Choice |
|--------------|------------|
| Free only | Now Learning + SNReady CSA (fully free) + ExamTopics (verify answers) |
| Best value | SNReady ($9) |
| Most questions | SkillCertPro ($20-40) |
| Best explanations | SNReady ($9) or Dion Training ($15-30) |
| Everything | SNReady + SkillCertPro ($29-49 total) |

No single platform is perfect. But the combination of official Now Learning courses + PDI practice + one good practice test platform is enough to pass any ServiceNow certification.

[Try SNReady Free Questions →](/practice-questions)

[Browse All 20 Certifications →](/)

---

*Last tested: March 2026. Prices and features may change.*
`
  },
  {
    slug: "servicenow-certification-cost-2026",
    title: "ServiceNow Certification Cost in 2026: Exam Fees, Retakes, Training, and Is It Worth It?",
    description: "Sourced 2026 ServiceNow exam fees ($300 CSA/CAD, $450 CIS), retake fees and waiting periods, training costs, the CIS-DF prerequisite, example budgets, and when certification is worth it.",
    publishedAt: "2026-03-19",
    updatedAt: "2026-10-16",
    author: "Jesse Szepieniec",
    tags: ["certifications", "career", "cost", "CSA", "CAD"],
    featured: true,
    readingTime: 7,
    // Merged with /blog/servicenow-certification-worth-it-2026 (301 in public/_redirects).
    content: `
## The short answer

In 2026 a ServiceNow certification exam costs **$300 USD for CSA or CAD** and **$450 USD for any CIS exam**, excluding tax. Retakes are **$150 for CSA, CAD or CPOA** and **$225 for CIS exams**. These figures come from the ServiceNow Community summary of the 2026 rules ([Mark Roethof, "2026 exam vouchers, courses, exams & retakes", ServiceNow Community, Jan 2026](https://www.servicenow.com/community/training-and-certifications/2026-exam-vouchers-courses-exams-amp-retakes-major-changes/ba-p/3464930)). Prices are paid in ServiceNow University, partner discounts apply where eligible, and tax comes on top.

| Item | Cost (USD, excl. tax) | Source |
|------|-----------------------|--------|
| CSA, CAD or CAS exam | $300 | [Community, Jan 2026](https://www.servicenow.com/community/training-and-certifications/2026-exam-vouchers-courses-exams-amp-retakes-major-changes/ba-p/3464930) |
| Any CIS exam | $450 | [Community, Jan 2026](https://www.servicenow.com/community/training-and-certifications/2026-exam-vouchers-courses-exams-amp-retakes-major-changes/ba-p/3464930) |
| Retake: CSA, CAD, CPOA | $150 | [Community, Jan 2026](https://www.servicenow.com/community/training-and-certifications/2026-exam-vouchers-courses-exams-amp-retakes-major-changes/ba-p/3464930) |
| Retake: any CIS exam | $225 | [Community, Jan 2026](https://www.servicenow.com/community/training-and-certifications/2026-exam-vouchers-courses-exams-amp-retakes-major-changes/ba-p/3464930) |
| On-demand course | $0 (exam bought separately) | [Community, Jan 2026](https://www.servicenow.com/community/training-and-certifications/2026-exam-vouchers-courses-exams-amp-retakes-major-changes/ba-p/3464930) |
| Instructor-led training, 2 days | $1,900 (first exam attempt included) | [Community, Jan 2026](https://www.servicenow.com/community/training-and-certifications/2026-exam-vouchers-courses-exams-amp-retakes-major-changes/ba-p/3464930) |
| Instructor-led training, 3 days | $2,700 (first exam attempt included) | [Community, Jan 2026](https://www.servicenow.com/community/training-and-certifications/2026-exam-vouchers-courses-exams-amp-retakes-major-changes/ba-p/3464930) |

Our source doesn't list a first-attempt fee for CPOA, so we don't quote one; ServiceNow University shows it when you register.

## How paying for an exam works now

- **No vouchers.** Exams moved from Kryterion/Webassessor to Pearson VUE, are registered and paid for in ServiceNow University, and are scheduled through Pearson VUE with SSO. Exam vouchers no longer exist ([source](https://www.servicenow.com/community/training-and-certifications/2026-exam-vouchers-courses-exams-amp-retakes-major-changes/ba-p/3464930)).
- **Who pays.** A Community moderator summarised it in July 2026: you pay $300 plus taxes unless you completed instructor-led training (one attempt included) or work for a ServiceNow partner that provides learning credits ([source](https://www.servicenow.com/community/community-central-forum/exam-vouchers-eligibility/td-p/3569553)). The January 2026 summary also notes that partners often receive a free CSA attempt after completing the required course ([source](https://www.servicenow.com/community/training-and-certifications/2026-exam-vouchers-courses-exams-amp-retakes-major-changes/ba-p/3464930)).
- **Use it or lose it.** Once registered, you must take the exam within 90 days or the attempt is forfeited. Payments are non-refundable and cancellations aren't offered, but you can reschedule without a fee inside the allowed window ([source](https://www.servicenow.com/community/training-and-certifications/2026-exam-vouchers-courses-exams-amp-retakes-major-changes/ba-p/3464930)).

## Retakes: the cost of failing

A failed attempt costs more than the retake fee. You also wait: **3 days** between the first and second attempt, **30 days** before the third, and **6 months** for every attempt after that. The old three-retake limit no longer applies ([source](https://www.servicenow.com/community/training-and-certifications/2026-exam-vouchers-courses-exams-amp-retakes-major-changes/ba-p/3464930)).

So a CSA candidate who passes first time pays $300; one who needs a second attempt pays $450; one who needs a third pays $600 and loses at least a month. Preparation is the cheapest way to save money.

## The CIS-Data Foundations factor

Several CIS certifications now require CIS-Data Foundations (CIS-DF) first: CIS-ITSM, CIS-HAM, CIS-SAM, CIS-Discovery, CIS-SM, CIS-VR and CIS-SIR ([source](https://www.servicenow.com/community/training-and-certifications/2026-exam-vouchers-courses-exams-amp-retakes-major-changes/ba-p/3464930)). Budget for CIS-DF as part of any of those paths. The January summary mentioned a temporary free first CIS-DF attempt valid until June 2026; treat that as expired unless ServiceNow University shows otherwise. See the [CIS-Data Foundations exam overview](/cis-df) for what the exam covers.

## Example budgets

These use only the fees above and assume self-study with free on-demand courses, a first-time pass, and no tax:

| Path | Exams | Exam fees |
|------|-------|-----------|
| Administrator | CSA | $300 |
| Developer | CSA + CAD | $600 |
| ITSM specialist | CSA + CIS-DF + CIS-ITSM | $1,200 |
| CMDB specialist | CSA + CIS-DF + CIS-Discovery | $1,200 |

Add $150 (CSA/CAD) or $225 (CIS) for each retake, or $1,900–$2,700 per instructor-led course if you go that way (each includes one attempt). Which exams make sense in which order is covered on the [ServiceNow certification paths](/certification-paths) page.

## Is it worth it?

We don't publish salary claims here, because we don't have data we can source. What we can say:

- **It's worth it when the exam matches the work you do or want to do.** The blueprints are a good test: if the objectives describe tasks in the job you're aiming for, preparing for the exam is preparing for the job. Read the blueprint domains on the [CSA exam overview](/csa) or [CAD exam overview](/cad) before you pay.
- **It's worth it when it unlocks the next step.** CIS-DF is now a gate for most of the CIS track, so for CMDB, ITSM or asset-management roles it is part of the cost of the path, not an optional extra.
- **It's not worth it if you pass without learning.** A certification you can't back up in an interview or on a project costs you the fee and gains you little.

## How to keep the cost down

1. Use the free on-demand courses and a personal developer instance before paying for training.
2. Practise until you can explain every answer, not just pick it. Every [CSA practice question on SNReady](/csa/practice-questions) is free; other certifications are on our [pricing page](/pricing).
3. Ask your employer: partner organisations can provide learning credits ([source](https://www.servicenow.com/community/community-central-forum/exam-vouchers-eligibility/td-p/3569553)).
4. Book when you are ready, not to force yourself to study: the 90-day clock starts at registration.

For a full CSA preparation plan, read [how to pass the ServiceNow CSA exam on your first try](/blog/how-to-pass-servicenow-csa-first-time).

## Sources

- [Mark Roethof, "2026 exam vouchers, courses, exams & retakes – major changes explained", ServiceNow Community, 18 Jan 2026](https://www.servicenow.com/community/training-and-certifications/2026-exam-vouchers-courses-exams-amp-retakes-major-changes/ba-p/3464930)
- ["Exam vouchers eligibility", ServiceNow Community, Jul 2026](https://www.servicenow.com/community/community-central-forum/exam-vouchers-eligibility/td-p/3569553)
`,
  },
  {
    slug: "servicenow-salaries-2026-real-data",
    title: "What 205 ServiceNow Professionals Actually Make in 2026 [Real Data]",
    description: "We analyzed 205 self-reported salaries from Reddit. Here's the real breakdown by role, country, and experience — with no Glassdoor fluff.",
    publishedAt: "2026-03-14",
    author: "SNReady Team",
    tags: ["salary", "career", "data"],
    featured: true,
    readingTime: 11,
    content: `
## The Problem with ServiceNow Salary Data

Google "ServiceNow developer salary" and you'll find Glassdoor estimates, Indeed averages, and LinkedIn "insights." All based on opaque methodologies and often wildly inaccurate.

We took a different approach: we scraped Reddit.

Over 200 salary disclosures from r/servicenow — people sharing real numbers in salary threads, job change posts, and career discussions. No recruiter spin. No employer filtering. Just actual professionals telling other professionals what they make.

Here's what we found.

## The Numbers at a Glance

**Total data points:** 205 salary disclosures

**Countries covered:** 17 (US dominates with 104 entries)

**Role breakdown:**
- Developer: 112 entries
- Consultant: 31 entries
- Architect: 30 entries
- Administrator: 17 entries
- Manager: 11 entries
- Product Owner: 4 entries

**Overall range:** $9,000 to $382,500

Yes, that range is real. The $9K figure is from India (adjusted to USD). The $382K figure is a Senior ServiceNow Developer at a FAANG company in the US.

## The US Numbers (What Most People Want)

Since the US makes up half our data (104 entries), here's the breakdown:

| Role | Average Salary | Sample Size |
|------|----------------|-------------|
| Architect | $174,533 | 15 |
| Consultant | $159,545 | 11 |
| Product Owner | $159,000 | 3 |
| Developer | $125,212 | 54 |
| Manager | $96,000 | 7 |
| Administrator | $92,928 | 14 |

[CHART:ROLE_SALARY]

**Key insight:** Architects earn 40% more than developers on average. The architect premium is real.

### The $200K+ Club

15 people in our dataset reported base salaries above $200K. Here's what they have in common:

- **Role:** Developer or Architect (only one consultant)
- **Location:** 13 are in the US, 2 in Canada
- **Experience:** Most report 6+ years in ServiceNow
- **Company type:** Mix of product companies, consulting firms, and FAANG

The highest reported salary ($382,500 base) came from a developer with 3-5 years ServiceNow experience at a major tech company. Stock grants weren't included — total comp was likely $500K+.

[CHART:DISTRIBUTION]

## How Experience Actually Affects Salary

Our data includes years of experience for about 60% of entries. Here's what we see:

**Entry Level (0-2 years):**
- Admin roles: $55K-80K
- Developer roles: $70K-95K
- Wide variance based on location

**Mid-Level (3-5 years):**
- Developers: $120K-180K
- Consultants: $130K-170K
- This is where the biggest jumps happen

**Senior (6-10 years):**
- Architects: $170K-220K
- Senior consultants: $160K-200K
- The premium for specialization kicks in

**Staff/Principal (10+ years):**
- $180K-250K for top performers
- More variance — some plateau, others break through

The biggest salary jumps happen between years 2-5. After year 10, increases depend more on role changes than tenure.

[CHART:EXPERIENCE]

## The Certification Question

We captured certification data when mentioned. Here's the uncomfortable truth:

**Professionals with certifications listed:** Average $103,944

**Professionals without certifications listed:** Average $123,750

Wait, what?

This doesn't mean certifications hurt your salary. More likely explanations:

1. **Reporting bias:** Senior people often don't list certs (they're assumed)
2. **Selection effect:** People earlier in career emphasize credentials
3. **Data limitation:** Reddit posts don't always mention certs

Our take: certifications open doors and validate skills, especially early in your career. But they're not a substitute for experience, and experienced pros don't always mention them.

## Country Comparison

ServiceNow is global. Salaries vary wildly by location.

| Country | Average | Sample Size |
|---------|---------|-------------|
| Switzerland | $151,500 | 2 |
| United States | $130,620 | 104 |
| Denmark | $125,000 | 3 |
| France | $111,333 | 3 |
| Canada | $107,876 | 32 |
| Germany | $99,285 | 7 |
| Ireland | $94,500 | 2 |
| United Kingdom | $82,835 | 31 |
| Netherlands | $73,400 | 5 |
| Belgium | $65,000 | 4 |
| Sweden | $56,500 | 2 |
| India | $34,800 | 5 |

**Key insight:** US salaries are 57% higher than UK salaries on average. Canadian salaries are about 18% lower than US.

[CHART:US_VS_UK]

**Switzerland** tops the chart, but with only 2 data points. The country's high cost of living and strong tech market drive premium rates.

**Germany** pays better than the UK on average — something many Europeans don't realize.

## Developer vs. Architect: The Real Gap

The architect premium is the most consistent pattern in our data:

**Global averages:**
- Developer: $105,884
- Architect: $144,000
- **Gap: +36%**

**US only:**
- Developer: $125,212
- Architect: $174,533
- **Gap: +39%**

This gap is larger than most other tech roles. Why?

1. **Scarcity:** Far fewer CTAs (Certified Technical Architects) than developers
2. **Responsibility:** Architects own solution design, not just implementation
3. **Client trust:** Customers pay premium rates for architect billing

If you're a senior developer considering the architect track, the financial case is strong.

## Consultants vs. In-House: Who Wins?

Our data includes both consulting firm employees and in-house ServiceNow teams.

**Consulting** (freelance and firm-employed):
- Higher ceiling ($225K highest)
- More variable (some report $50K, others $200K+)
- Often includes billing rate premiums

**In-House:**
- More consistent ($80K-160K typical range)
- Better benefits often (equity, 401K match)
- Less project-to-project variance

The highest earners are split: some are consultants at premium rates, others are architects at product companies.

## Remote Work Reality

We captured remote status for a subset of entries. The pattern:

- **Fully remote:** Common at $150K+ salaries (especially consultants)
- **Hybrid:** Most common for in-house roles
- **On-site:** Increasingly rare, mostly government/defense

Remote work is the norm in ServiceNow, not the exception. This helps explain why US salaries are the benchmark — even professionals in other countries often work for US-based companies remotely.

## What This Means for Your Career

### If you're entering ServiceNow:
- Admin roles are your entry point: expect $55K-80K
- Developer roles pay better from the start: $70K-95K
- Certifications matter more early in your career
- Target 2-3 years to hit $100K if you're in the US

### If you're mid-career (2-5 years):
- This is your biggest growth window
- Consider the architect track if you're technical
- Consulting offers higher variance (up and down)
- Certifications start to matter less than project portfolio

### If you're senior (6+ years):
- Architect roles offer the clearest path to $200K+
- Independent consulting at premium rates becomes viable
- Company/industry matters more than role title
- Your network is your most valuable asset

## Methodology Notes

**Source:** r/servicenow Reddit posts from 2021-2026

**Collection:** API scraping + manual parsing

**Validation:** Cross-referenced with context (role descriptions, career level mentions)

**Limitations:**
- Self-reported (no verification)
- US-heavy sample
- Certification data incomplete
- No total comp (base salary only)

This data isn't perfect. But it's real people sharing real numbers, which beats corporate surveys and recruiter estimates.

## Compare Your Salary

We built a tool to see where you stack up. Enter your role, location, and experience to see your percentile across our dataset.

[Check Your ServiceNow Salary Percentile →](/salaries)

---

*Data: 205 salary disclosures from r/servicenow (2021-2026). Updated monthly.*

*Have salary data to share? [Submit anonymously](/salaries) to help the community.*
`
  },
  {
    slug: "why-servicenow-brain-dumps-will-fail-you",
    title: "Why ServiceNow Brain Dumps Will Fail You (And What Actually Works)",
    description: "Brain dump sites like ExamTopics promise easy CSA certification. Here's why they backfire — and the approach that actually prepares you for real ServiceNow work.",
    publishedAt: "2026-02-23",
    updatedAt: "2026-10-16",
    author: "SNReady Team",
    tags: ["CSA", "exam prep", "study strategy"],
    featured: true,
    readingTime: 7,
    content: `
## The Dirty Secret of ServiceNow Exam Prep

Search for "ServiceNow CSA practice questions" and you'll find dozens of sites offering "actual exam questions" — ExamTopics, ITExams, Marks4Sure, and countless others.

They promise the real thing: actual questions from the exam, crowd-verified answers, guaranteed pass rates.

Here's what they don't tell you.

## The Three Ways Brain Dumps Fail You

### 1. The Answers Are Often Wrong

Go to any brain dump site and read the discussion threads. You'll see endless debates:

> "Answer should be B, not D"
> "I got this on my exam and C worked"
> "The official answer is wrong, trust me"

These sites crowdsource their answers. No one actually verifies them against ServiceNow documentation. The "community votes" are from people who haven't passed the exam yet voting on what they *think* is correct.

I've seen brain dump answers that contradict the official ServiceNow documentation. If you memorize those answers, you'll confidently select the wrong option on exam day.

### 2. You Learn Nothing That Helps You Work

Let's say you memorize 400 brain dump questions and pass your CSA. Congratulations. Now your employer puts you in front of a ServiceNow instance and asks you to configure a business rule.

What happens?

You memorized that "Business rules run on the server" but you never actually learned:
- When to use before vs. after rules
- How to debug a rule that's not firing
- Why your rule is running twice
- How current vs. previous object comparison works

Brain dumps optimize for passing a test. They don't optimize for doing the job. And when you can't do the job, that certification becomes worthless.

### 3. They're Frequently Outdated

ServiceNow releases a major version every year. Each release changes features, deprecates old approaches, and introduces new capabilities.

Brain dump sites don't update their question banks with each release. That "correct" answer from the Tokyo release might be flat-out wrong in Zurich.

Worse, ServiceNow actively rotates exam questions. The questions on ExamTopics from 2024 may not even appear on your 2026 exam. You've memorized answers to questions you'll never see.

## What Actually Works

Here's the uncomfortable truth: there are no shortcuts to competence.

But there are *efficient* paths that teach you real skills while preparing you for the exam.

### 1. Hands-On Time in a PDI

ServiceNow gives you a free Personal Developer Instance at developer.servicenow.com. This is where real learning happens.

Don't just read about business rules — create one. Break it. Fix it. Create another one that conflicts with it and debug why.

Every hour in a PDI is worth 10 hours of reading.

### 2. Official Now Learning Courses

ServiceNow's official courses (Admin Fundamentals, etc.) are free. They're also what the exam is based on.

When you study from official content, you're learning the same concepts that exam writers use to create questions. Not leaked questions — the underlying knowledge.

### 3. Practice Questions That Explain Why

This is where most practice tests fail. They give you:

> **Q:** What does a UI Policy do?
> **A:** Dynamically changes form behavior
> ✓ Correct!

But they don't explain:
- *Why* the other options are wrong
- *When* you'd use a UI Policy vs. a Client Script
- *Where* this fits in the bigger picture of form customization

Good practice questions teach. Bad practice questions quiz.

## How We Built SNReady Differently

We built SNReady specifically because we were frustrated with brain dump culture.

Every question on SNReady is generated from official ServiceNow course content — the same material Now Learning uses. Not leaked exam questions. Not crowd-sourced guesses.

Every explanation tells you:
- **Why the correct answer is correct** — with conceptual context
- **Why each wrong answer is wrong** — so you learn the distinctions
- **Where to learn more** — links to the source material

The goal isn't to help you memorize answers. It's to help you understand ServiceNow well enough that the right answer becomes obvious.

## The Real Exam Experience

Here's what the CSA exam is actually like:

- 60 questions, 90 minutes
- Multiple choice and multi-select
- Scenario-based questions (not just definitions)
- You can flag questions and return to them
- ServiceNow doesn't publish the cut score (and says it isn't always 70%) — aim for 80%+ on practice exams

The scenario-based questions are where brain dumps fail hardest. ServiceNow doesn't ask "What is a UI Policy?" They ask:

> "A user reports that a field should be read-only when the State is Closed, but they can still edit it. The admin confirms a UI Policy exists with the correct conditions. What is the most likely cause?"

If you've actually configured UI Policies and hit this problem in your PDI, you know to check if the policy is running on the right table, if conditions are using the right operators, or if another UI Policy is conflicting.

If you memorized "UI Policy = dynamic form changes," you're stuck.

## The Bottom Line

Brain dumps are a trap. They promise a shortcut but deliver:
- Wrong answers
- Zero real knowledge
- Outdated information
- A certification you can't back up with skills

The path that works:
1. Hands-on time in a PDI
2. Official Now Learning courses
3. Practice questions that explain *why*

You'll spend the same amount of time either way. One path makes you competent. The other makes you a liability with a certificate.

[Start with practice questions that actually teach →](/csa/practice-questions)
`
  },
  {
    slug: "csa-vs-cad-real-talk",
    title: "CSA or CAD First? Real Talk From Someone Who's Done Both",
    description: "Skip the generic advice. Here's the actual decision framework for choosing between ServiceNow CSA and CAD certifications based on your background and goals.",
    publishedAt: "2026-02-24",
    author: "SNReady Team",
    tags: ["CSA", "CAD", "career"],
    featured: true,
    readingTime: 8,
    content: `
## The Generic Advice Is Useless

Every "CSA vs CAD" article says the same thing:
- CSA is for administrators
- CAD is for developers
- Get CSA first because it's the prerequisite

That's technically true and practically useless. It doesn't help you decide.

Here's the actual decision framework.

## First: What's Your Background?

### If you're completely new to ServiceNow

**Get CSA first. No exceptions.**

CAD assumes you understand tables, forms, ACLs, the data model, how records flow through the system. If you don't have this foundation, CAD will be painful.

More importantly: most entry-level ServiceNow jobs want CSA. Not CAD. Not both. Just CSA.

You can always add CAD later. But CSA is the universal entry point.

### If you're a developer with strong JavaScript/coding background

You might be tempted to skip straight to CAD since it's "the developer cert."

Don't.

Here's why: CAD tests ServiceNow-specific concepts, not JavaScript. You'll ace the scripting syntax questions but struggle with:

- What's the difference between a Business Rule and a Script Include?
- When should you use GlideRecord vs. GlideAggregate?
- How does the client-server architecture affect your script design?
- What are the scoped app restrictions?

These require understanding the platform, which CSA teaches.

**My recommendation:** Study CSA material for 2 weeks. Take the CSA exam. Then start CAD prep immediately. You can get both within a month if you're focused.

### If you're already working with ServiceNow

This is where it gets interesting.

**If you're doing admin work** (configuring forms, managing users, running reports):
Get CSA, obviously. Validate what you already do.

**If you're writing scripts but have no cert:**
Here's a secret: you can take CAD without CSA. It's "recommended" as a prereq, not required.

If you've been scripting in ServiceNow for 6+ months, you probably know the CSA content already. You just learned it on the job instead of in a course.

Try this: Take a CSA practice test. If you score 80%+, skip CSA and go straight to CAD. You can always get CSA later if you need it for a checkbox.

## Second: What's Your Goal?

### Goal: Get hired in ServiceNow

**CSA is the door-opener.**

Look at any ServiceNow job posting. "CSA required" appears on everything from junior admin to platform owner.

CAD is nice to have. CSA is required.

Get CSA first. Add CAD if you want developer roles specifically.

### Goal: Maximize salary

**Both, but CAD carries a premium.**

CSA: $80K-120K typical range (depending on experience)
CAD: $100K-140K typical range
Both: $120K-160K

Developers are harder to find than admins. The premium is real.

But you need experience to command those numbers. A fresh CAD with no project history won't get $140K.

### Goal: Become an architect (CTA)

**Get both, plus implementation experience.**

CTA (Certified Technical Architect) requires:
- CSA + CAD as prerequisites
- Deep project experience
- Ability to design solutions, not just implement them

If CTA is your target, CSA and CAD are just waypoints. Get them efficiently and start accumulating project experience.

### Goal: Just get certified fast

**CSA is easier.**

CSA: 2-4 weeks of study for most people
CAD: 4-6 weeks (more if you're weak on scripting)

If you need a cert for your resume quickly, CSA is the faster path.

## The Actual Differences

Let me be concrete about what each exam tests:

### CSA Tests

- UI navigation and configuration
- User management, groups, roles
- Tables, fields, relationships
- Lists, filters, views
- ACLs and security rules
- Business Rules (basic)
- UI Policies, UI Actions
- Service Catalog basics
- Incident/Problem/Change management
- Reporting and dashboards
- Notifications and workflows

It's broad. An inch deep on many topics.

### CAD Tests

- JavaScript in ServiceNow (ES6)
- GlideRecord, GlideAggregate, GlideAjax
- Business Rules (advanced)
- Client Scripts (all types)
- Script Includes
- UI Policies vs Client Scripts
- REST API integration
- Scoped vs global apps
- Update sets and deployment
- Debugging techniques

It's narrower but deeper. You need to actually code.

## My Recommendation

**For 90% of people:** Get CSA first. Study for 2-4 weeks. Take the exam. Then evaluate if you need CAD.

**For experienced developers new to ServiceNow:** Study CSA for 2 weeks, take it, then immediately prep for CAD. Get both in 4-6 weeks.

**For people already scripting in ServiceNow:** Take a CSA practice test. If you score 80%+, consider skipping to CAD. Get CSA later if needed.

## The Prep That Works

Whichever cert you choose:

1. **Get a PDI** (developer.servicenow.com) — free instance for hands-on practice
2. **Complete official courses** — Now Learning is free
3. **Practice with questions that explain** — learn why, not just what
4. **Time yourself** — both exams are 90 minutes, 60 questions

[CSA Practice Questions →](/csa/practice-questions)
[CAD Practice Questions →](/cad/practice-questions)
`
  },
  {
    slug: "cis-itsm-implementation-exam-reality",
    title: "CIS-ITSM: The Implementation Exam That Trips Up CSA Holders",
    description: "You passed CSA. You work with ITSM daily. You should breeze through CIS-ITSM, right? Here's why that assumption gets people.",
    publishedAt: "2026-02-27",
    updatedAt: "2026-10-16",
    author: "SNReady Team",
    tags: ["CIS-ITSM", "exam prep", "ITSM"],
    readingTime: 8,
    content: `
## The CSA Holder's Trap

You passed CSA. You've been working in ServiceNow for a year. You've resolved hundreds of incidents, processed change requests, linked problems to their causes.

CIS-ITSM should be easy, right?

Wrong. The failure rate for experienced ServiceNow admins on CIS-ITSM is higher than you'd expect.

Here's why.

## CSA Breadth vs. CIS-ITSM Depth

CSA covers ITSM topics:
- Incident states and priority
- Problem linking
- Change types
- Basic workflows

CIS-ITSM goes deeper:
- Major incident management with communication plans
- Problem management lifecycle with root cause analysis
- Change risk calculation with CAB workflows
- SLA retroactive start behavior
- Request fulfillment automation patterns

If CSA is "know what these modules do," CIS-ITSM is "know how to IMPLEMENT these modules correctly."

## The Implementation Mindset

CIS stands for Certified Implementation Specialist. Not Certified User. Not Certified Administrator.

Implementation means:
- Configuring from scratch, not just modifying existing setup
- Understanding why features are designed the way they are
- Knowing best practices for deployment
- Troubleshooting configuration issues

Example question:

> "A customer wants incidents automatically assigned based on the Configuration Item. What would you configure?"

CSA answer: "Assignment rules."

CIS-ITSM answer: "Assignment rules with CI-based conditions, but first verify CI data quality, consider assignment groups vs. individual assignment, evaluate escalation paths for unassigned CIs, and document the rule order since multiple rules might match."

The implementation specialist thinks through the full solution.

## Topics That Trip People Up

### 1. Major Incident Management

CSA barely touches this. CIS-ITSM expects you to know:

- When to declare a major incident (criteria-based, not just "it's bad")
- Communication plans (who gets notified, when, through what channel)
- Major incident workspaces and dashboards
- Post-major incident reviews
- The difference between "major" and "high priority"

The last one is critical: **Major incident is a process designation. Priority is a data value.** A P1 incident isn't automatically a major incident. A major incident might not even be P1.

### 2. Change Advisory Board (CAB) Workflows

CSA knows "changes need approval."

CIS-ITSM knows:
- How to configure CAB date definitions
- Emergency change authorization paths that bypass CAB
- Automatic approval rules based on risk
- How change conflicts are detected and displayed
- Change model vs. standard change templates

You need to understand not just that CAB exists, but how to implement a CAB process for a customer.

### 3. SLA Edge Cases

CSA: "SLAs measure response and resolution time."

CIS-ITSM:
- What happens when SLA retroactively starts?
- How do business hours affect breach calculations?
- When does stage advancement reset the SLA clock?
- How are multiple SLAs on the same record prioritized?
- What's the difference between task SLAs and table SLAs?

The exam loves edge cases because implementation specialists encounter them.

### 4. Request Fulfillment Patterns

Request management seems simple: someone orders something, someone fulfills it.

But implementation requires understanding:
- Multi-item orders with separate fulfillment tasks
- Approval routing based on item cost
- Requested Item vs. Catalog Task workflows
- Fulfillment groups and assignment logic
- Order guides for complex bundled requests

You're not just using the Service Catalog — you're designing it.

### 5. Problem Management as a Real Process

CSA knows: Problem linked to Incident, Known Error article, Root Cause field.

CIS-ITSM knows:
- Problem detection methods (trend analysis, major incident review)
- Problem investigation workflows
- Workaround vs. permanent solution
- Known Error Database (KEDB) management
- Problem task assignment for investigation
- When to close a problem vs. keep it open

## The Study Approach That Works

### 1. Think Implementation, Not Usage

When studying a feature, ask:
- How would I configure this from scratch?
- What decisions would I make for a new customer?
- What are the best practices vs. "it works" approaches?

### 2. Cover the Overlooked Topics

Everyone knows Incident Management. Fewer study:
- ITSM guided setup
- Agent Intelligence for classification
- Virtual Agent integration
- Walk-up Experience
- SLA definitions at a technical level

### 3. Use Real Implementation Documentation

ServiceNow's product documentation includes implementation guides. These are more useful than the exam guide for understanding implementation context.

### 4. Practice Scenario Questions

CIS-ITSM loves scenarios:

> "A customer's incident response SLA keeps breaching even though agents respond within 5 minutes. The SLA is set to 15 minutes. What would you check first?"

This requires diagnostic thinking, not just knowledge.

## The Exam Itself

- 60 questions, 90 minutes
- ServiceNow doesn't publish the cut score (and says it isn't always 70%) — aim for 80%+ on practice exams
- Multi-select exists (choose 2, choose all that apply)
- Scenario-based questions are common
- Questions assume CSA knowledge (they won't explain what an ACL is)

**Prerequisites:** CSA is required, and you also need to pass **CIS-DF** (Data Foundations) before you can take CIS-ITSM. The free first CIS-DF attempt was a promotion that ended in June 2026, so budget for that exam too.

## Preparation Timeline

Assuming you have CSA and work with ITSM:

- **Week 1-2:** Deep dive on major incident and problem management
- **Week 3:** Change management implementation details
- **Week 4:** SLA edge cases and request fulfillment
- **Week 5:** Practice exams and gap identification

If you don't work with ITSM daily, add 2-3 weeks of hands-on practice in a PDI.

## The Bottom Line

CIS-ITSM isn't "CSA part 2." It's an implementation certification that expects consultant-level understanding of ITSM configuration.

If you use ITSM daily but don't configure it, you need to shift your mindset. Think like someone building the system, not using it.

[Practice CIS-ITSM Questions →](/cis-itsm/practice-questions)
`
  },
  {
    slug: "servicenow-cad-exam-complete-guide-2026",
    title: "ServiceNow CAD Exam 2026: Complete Study Guide",
    description: "A sourced Certified Application Developer guide: the January 2026 blueprint domain by domain, what runs when, choosing integration mechanisms, a build-one-app study plan, scenarios, and 2026 booking rules.",
    publishedAt: "2026-03-24",
    updatedAt: "2026-10-16",
    author: "Jesse Szepieniec",
    tags: ["CAD", "certifications", "study-guide", "scripting", "exam-prep"],
    featured: true,
    readingTime: 15,
    // Body is rendered by components/blog-guides/CadGuidePost.tsx (see BLOG_GUIDE_BODIES).
    content: "",
  },
  {
    slug: "servicenow-cis-csm-exam-guide-2026",
    title: "CIS-CSM Exam Guide 2026: How to Pass ServiceNow Customer Service Management",
    description: "Complete CIS-CSM study guide covering all 5 exam domains, study timeline, resources, and practice questions. Pass your Customer Service Management certification first try.",
    publishedAt: "2026-03-26",
    updatedAt: "2026-10-16",
    author: "SNReady Team",
    tags: ["CIS-CSM", "study guide", "certifications", "customer service management"],
    readingTime: 12,
    content: `
## What Is the CIS-CSM Certification?

The **Certified Implementation Specialist — Customer Service Management (CIS-CSM)** proves you can implement and configure ServiceNow's CSM application. It's one of the most in-demand CIS certifications because virtually every ServiceNow customer has some form of customer-facing service operations.

Unlike the CSA, this is an **implementation** exam. You're not just administering the platform — you're designing and configuring CSM solutions for real business requirements.

### Prerequisites

- **CSA certification** (required)
- Recommended: 6-12 months hands-on CSM experience
- Complete the CSM Essentials course on Now Learning (free)

## Exam Format

| Detail | Info |
|--------|------|
| **Questions** | 60 multiple choice |
| **Duration** | 90 minutes |
| **Passing score** | Not published (ServiceNow says it isn't always 70%) — aim for 80%+ on practice exams |
| **Cost** | $450 (USD, excluding tax; retakes $225) |
| **Delivery** | Pearson VUE (register and pay in ServiceNow University) |
| **Prerequisite** | CSA certification |
| **Maintenance** | Delta exam with each major release |

## The 5 Exam Domains (With Weights)

The CIS-CSM exam covers 5 domains. Here's how they're weighted:

### 1. CSM Configuration (30%)

This is the biggest domain — nearly a third of the exam. You need to know:

- **Agent Workspace configuration** — how to set up and customize the CSM workspace
- **Customer Service Portal** setup and configuration
- **Assignment rules and workflows** for case routing
- **CSM properties and system settings**
- **Playbooks** — guided resolution paths for agents
- **CSM integrations** with ITSM (creating incidents from cases)

**Study tip:** Spend proportional time here. If you have 4 weeks to study, dedicate the first full week to CSM configuration.

### 2. Foundational Data Model (25%)

The CSM data model is more complex than you'd expect:

- **Account and Contact** records — relationships, hierarchies
- **Consumer records** vs Contact records — when to use which
- **Product and Asset** integration
- **Entitlements and SLAs** — service-level management
- **CSM tables and relationships** — how cases, accounts, contacts, and assets connect

**Key concept:** Understand the difference between B2B (Account/Contact model) and B2C (Consumer model). The exam tests this heavily.

### 3. Case Management (20%)

Core operational knowledge:

- **Case lifecycle** — creation through resolution
- **Case types** and categorization
- **Major Issue Management** — handling widespread problems
- **Communication channels** — email, portal, phone, chat
- **Special handling notes** — customer-specific instructions
- **Case escalation** procedures

### 4. Workspace, Portals, and Analytics (15%)

- **Configurable Workspace** for agents
- **Customer Service Portal (CSP)** customization
- **Service Portal widgets** for CSM
- **Performance Analytics dashboards** for CSM
- **Reporting** on case metrics, SLA compliance

### 5. Best Practices and Knowledge (10%)

- **Knowledge Management** integration with CSM
- **Knowledge articles** for agents and customers
- **Self-service** strategy and configuration
- **CSM implementation best practices**
- **Major case management** procedures

## 4-Week Study Plan

### Week 1: Foundation (Data Model + Configuration Basics)

- Complete CSM Essentials on Now Learning (free)
- Study the CSM data model thoroughly — draw it out
- Set up CSM in your PDI and create accounts, contacts, consumers
- **Practice:** [Free CIS-CSM Practice Questions →](/cis-csm/practice-questions)

### Week 2: Deep Configuration

- Focus on Agent Workspace configuration
- Configure CSM Portal
- Set up assignment rules and case workflows
- Practice creating playbooks
- Configure CSM-ITSM integration

### Week 3: Case Management + Operations

- Work through the case lifecycle end-to-end
- Configure entitlements and SLAs
- Set up communication channels
- Practice Major Issue Management
- Build CSM dashboards with Performance Analytics

### Week 4: Review + Practice Exams

- Take [timed mock exams](/cis-csm/mock-exam) under real conditions
- Review weak domains based on mock exam results
- Re-read Knowledge Management sections
- Focus on best practices documentation
- **Target:** Consistently score 80%+ on practice tests

## Key Topics That Catch People Off Guard

### 1. Consumer vs Contact

This trips up a lot of candidates. **Contacts** belong to **Accounts** (B2B). **Consumers** are standalone (B2C). The exam expects you to know exactly when to use each model and how they interact.

### 2. Entitlements

CSM entitlements are more nuanced than ITSM SLAs. You need to understand:
- Product entitlements vs service entitlements
- How entitlements connect to accounts and assets
- Entitlement allocation (# of cases, time-based)

### 3. Agent Workspace vs Classic UI

The exam assumes you know the Configurable Workspace approach. Don't just study classic CSM — make sure you can configure workspace views, lists, and form layouts.

### 4. CSM-ITSM Bridge

How do you create an incident from a case? How does case resolution flow when the underlying incident is resolved? This integration is tested specifically.

## Resources

### Free

- **Now Learning:** CSM Essentials course (complete this first)
- **ServiceNow Docs:** [CSM Documentation](https://www.servicenow.com/docs/) — the official reference
- **PDI:** Practice everything you learn in a real instance
- **SNReady:** [92 free and premium CIS-CSM practice questions](/cis-csm)

### Paid

- **ServiceNow official training** — CSM Implementation instructor-led course ($1,900 for a 2-day course, $2,700 for a 3-day course, exam attempt included)
- **SNReady Premium** — Full question bank with explanations ($9)

## Exam Day Tips

1. **Time management:** 90 seconds per question. Flag and move on if stuck.
2. **Read carefully:** "Which TWO" and "All EXCEPT" questions are common.
3. **Think implementation:** This isn't theory — think about how you'd actually configure it.
4. **Data model questions:** When in doubt, think about the table relationships.
5. **Don't overthink:** Your first instinct on configuration questions is usually right if you've practiced in a PDI.

## Ready to Start?

[Try Free CIS-CSM Practice Questions →](/cis-csm/practice-questions)

[Take a Timed CIS-CSM Mock Exam →](/cis-csm/mock-exam)
`
  },
  {
    slug: "servicenow-cis-hr-exam-guide-2026",
    title: "CIS-HR Exam Guide 2026: How to Pass ServiceNow HR Service Delivery",
    description: "Complete CIS-HR study guide with all 4 exam domains explained, study strategies, key topics, and practice questions for the HR Service Delivery certification.",
    publishedAt: "2026-03-26",
    updatedAt: "2026-10-16",
    author: "SNReady Team",
    tags: ["CIS-HR", "study guide", "certifications", "HR service delivery"],
    readingTime: 11,
    content: `
## Why CIS-HR?

ServiceNow HR Service Delivery (HRSD) is one of the fastest-growing product lines on the platform. As organizations digitize their employee experiences, demand for certified HRSD implementers keeps climbing.

The **CIS-HR** certification validates your ability to implement and configure ServiceNow's HR Service Delivery application — from case management to lifecycle events to document management.

### Is CIS-HR Right for You?

CIS-HR is ideal if you:
- Work with HR departments implementing ServiceNow
- Already have your CSA and want a CIS specialization
- Want to specialize in employee experience / HR technology
- Work at an organization actively using HRSD

## Exam Format

| Detail | Info |
|--------|------|
| **Questions** | 60 multiple choice |
| **Duration** | 90 minutes |
| **Passing score** | Not published (ServiceNow says it isn't always 70%) — aim for 80%+ on practice exams |
| **Cost** | $450 (USD, excluding tax; retakes $225) |
| **Delivery** | Pearson VUE (register and pay in ServiceNow University) |
| **Prerequisite** | CSA certification |
| **Maintenance** | Delta exam per major release |

## The 4 Exam Domains

### 1. HR System Architecture & Data Model (25%)

This domain tests your understanding of how HRSD fits into the ServiceNow platform:

- **HR Service Delivery architecture** — the application stack
- **Core tables:** hr_case, hr_profile, sn_hr_core_task
- **HR criteria** — targeting content and services to specific employee groups
- **HR service catalog** — structure, categories, and request fulfillment
- **Center of Excellence (CoE)** configuration
- **HR profile** vs sys_user — what lives where and why

**Key insight:** The HR profile extends the user record with HR-specific data. Understanding this relationship is fundamental to every other domain.

### 2. HR Journeys & Lifecycle Events (30%)

This is the highest-weighted domain. Lifecycle events (onboarding, offboarding, transfers, leaves of absence) are the heart of HRSD:

- **Lifecycle events** — configuration, activities, and workflows
- **Employee journeys** — guided, multi-step experiences
- **Activity sets** — grouping tasks for lifecycle events
- **Employee Center** — the employee-facing portal
- **Virtual Agent** for HR — conversational HR service
- **Knowledge Management** for HR — employee-facing articles

**What catches people:** Activity sets and their sequencing. The exam tests whether you know how to chain activities, set dependencies, and configure conditional activities based on employee attributes.

### 3. Core HR Applications (25%)

The operational backbone:

- **HR Case Management** — creating, routing, escalating HR cases
- **Document Management** — employee document templates, generation, e-signatures
- **HR agent workspace** — configuring the agent experience
- **Universal Request** — unified request handling across departments
- **Performance Analytics** for HR — dashboards and KPIs
- **Predictive Intelligence** for HR case categorization

**Study tip:** Document Management is a surprisingly large topic. Know how document templates work, how to generate documents from lifecycle events, and how e-signature integrations are configured.

### 4. HR Security & Access (20%)

Security is critical in HR — employee data is among the most sensitive in any organization:

- **HR criteria-based security** — who sees what
- **Before-query business rules** for HR data
- **HR roles** — sn_hr_core.admin, sn_hr_core.case_writer, sn_hr_core.manager, etc.
- **Employee document security** — restricting access to sensitive documents
- **ACLs specific to HR** tables
- **Data separation** for shared service centers

**Key concept:** HR criteria is NOT the same as user criteria. HR criteria uses HR-specific fields (department, location, employment type) to control visibility of HR content, services, and data.

## 4-Week Study Plan

### Week 1: Architecture & Data Model

- Complete HRSD Fundamentals on Now Learning
- Study the HR data model — draw out table relationships
- Set up HRSD plugin in your PDI
- Create HR profiles, categories, and basic services
- **Practice:** [Free CIS-HR Practice Questions →](/cis-hr/practice-questions)

### Week 2: Lifecycle Events & Journeys

- Configure a complete onboarding lifecycle event
- Build activity sets with dependencies
- Set up Employee Center
- Create employee journeys
- This is 30% of the exam — spend proportional time

### Week 3: Core Applications & Security

- Set up HR Case Management workflows
- Configure document templates and generation
- Build HR dashboards
- Implement HR criteria-based security
- Configure HR roles and ACLs

### Week 4: Review & Mock Exams

- Take [timed mock exams](/cis-hr/mock-exam) under real conditions
- Review weak areas based on results
- Re-read lifecycle event configurations
- **Target:** 80%+ consistently on practice tests

## Topics That Surprise Exam Takers

### 1. HR Criteria vs User Criteria

This is the #1 gotcha. **User criteria** is platform-wide (Service Portal, Knowledge). **HR criteria** is specific to HRSD and uses HR-specific attributes. They look similar but are configured differently and used in different contexts.

### 2. Document Templates & Generation

Many candidates underestimate this area. You need to know:
- How to create document templates
- How lifecycle events trigger document generation
- E-signature integration options
- Document security and retention policies

### 3. Employee Center vs Service Portal

Employee Center is the modern employee-facing experience. It's NOT just a rebranded Service Portal — it's a distinct application with its own configuration patterns. Know the differences.

### 4. Universal Request

Universal Request allows employees to submit requests without knowing which department handles them. Understanding how it routes to HR vs IT vs Facilities is a tested topic.

## Resources

### Free

- **Now Learning:** HRSD Fundamentals course
- **ServiceNow Docs:** HR Service Delivery documentation
- **PDI:** Activate HRSD plugin and practice
- **SNReady:** [81 CIS-HR practice questions](/cis-hr) (free + premium)

### Paid

- **ServiceNow instructor-led training** ($1,900 for a 2-day course, $2,700 for a 3-day course, exam attempt included)
- **SNReady Premium** — Full question bank with detailed explanations ($9)

## Exam Day Strategy

1. **Watch for "HR criteria" vs "user criteria"** — the exam loves this distinction
2. **Lifecycle event questions** are scenario-heavy — think through the full flow
3. **Security questions** often have "almost right" answers — read all options carefully
4. **Flag and return** — don't spend more than 2 minutes on any question
5. **Think employee-first** — many best-practice questions favor the employee experience

## Start Practicing

[Try Free CIS-HR Practice Questions →](/cis-hr/practice-questions)

[Take a Timed CIS-HR Mock Exam →](/cis-hr/mock-exam)
`
  },
  {
    slug: "free-servicenow-practice-questions-2026",
    title: "Free ServiceNow Practice Questions 2026: Every Certification Covered",
    description: "Access free ServiceNow practice questions for all 20 certifications — CSA, CAD, CIS-ITSM, CIS-Discovery, and more. No signup required. Start practicing now.",
    publishedAt: "2026-03-26",
    updatedAt: "2026-10-16",
    author: "SNReady Team",
    tags: ["free practice questions", "certifications", "CSA", "CAD", "CIS-ITSM", "study resources"],
    featured: true,
    readingTime: 8,
    content: `
## Free Practice Questions for Every ServiceNow Certification

Looking for free ServiceNow practice questions? You're in the right place. SNReady offers **free practice questions for all 20 ServiceNow certifications** — no signup, no credit card, no catch.

Here's the complete list with direct links.

## Foundation Certifications

### CSA — Certified System Administrator

The most popular ServiceNow certification. Our CSA questions cover all 8 exam domains:

- Platform Overview & Navigation
- User Administration & Security
- Database Administration
- Self-Service & Process Automation
- Introduction to Development
- Data Migration & Integration
- Collaboration & Reporting

**200+ questions** — all free, including timed mock exams

[Start Free CSA Practice Questions →](/csa/practice-questions)

### CAD — Certified Application Developer

For developers building on the ServiceNow platform:

- Scripting & Application Development
- Business Rules & Client Scripts
- REST API Integration
- UI Policies & Script Includes

**130 questions** — The largest question bank on the site

[Start Free CAD Practice Questions →](/cad/practice-questions)

## Implementation Specialist Certifications

### CIS-ITSM — IT Service Management

Covers incident, problem, change, and request management:

[Start Free CIS-ITSM Questions →](/cis-itsm/practice-questions)

### CIS-Discovery

Network discovery, pattern design, and CMDB integration:

[Start Free CIS-Discovery Questions →](/cis-discovery/practice-questions)

### CIS-CSM — Customer Service Management

Case management, customer portals, and CSM configuration:

[Start Free CIS-CSM Questions →](/cis-csm/practice-questions)

### CIS-HR — HR Service Delivery

Lifecycle events, HR case management, and employee experience:

[Start Free CIS-HR Questions →](/cis-hr/practice-questions)

### CIS-SAM — Software Asset Management

Software licensing, compliance, and asset lifecycle:

[Start Free CIS-SAM Questions →](/cis-sam/practice-questions)

### CIS-HAM — Hardware Asset Management

Hardware lifecycle, stockrooms, and asset tracking:

[Start Free CIS-HAM Questions →](/cis-ham/practice-questions)

### CIS-PA — Performance Analytics

Dashboards, indicators, and data collection:

[Start Free CIS-PA Questions →](/cis-pa/practice-questions)

### CIS-SM — Service Mapping

Service maps, patterns, and dependency views:

[Start Free CIS-SM Questions →](/cis-sm/practice-questions)

### CIS-EM — Event Management

Event processing, alert management, and integrations:

[Start Free CIS-EM Questions →](/cis-em/practice-questions)

### CIS-VR — Vulnerability Response

Vulnerability management, prioritization, and remediation:

[Start Free CIS-VR Questions →](/cis-vr/practice-questions)

### CIS-SIR — Security Incident Response

Security incidents, threat intelligence, and response playbooks:

[Start Free CIS-SIR Questions →](/cis-sir/practice-questions)

### CIS-RC — Risk & Compliance

GRC framework, risk management, and compliance:

[Start Free CIS-RC Questions →](/cis-rc/practice-questions)

### CIS-DF — Data Foundations (CMDB)

CMDB configuration, CSDM, data governance, and health:

**213 questions** — Our deepest question bank

[Start Free CIS-DF Questions →](/cis-df/practice-questions)

### CIS-FSM — Field Service Management

Work orders, scheduling, and dispatch:

[Start Free CIS-FSM Questions →](/cis-fsm/practice-questions)

### CIS-SP — Security Platform

Security operations platform configuration:

[Start Free CIS-SP Questions →](/cis-sp/practice-questions)

### CIS-SPM — Strategic Portfolio Management

Project and portfolio management:

[Start Free CIS-SPM Questions →](/cis-spm/practice-questions)

### CIS-TPRM — Third-Party Risk Management

Vendor risk assessment and management:

[Start Free CIS-TPRM Questions →](/cis-tprm/practice-questions)

### CPOA — Certified Platform Owner Advisor

Platform governance and strategy:

[Start Free CPOA Questions →](/cpoa/practice-questions)

## Why Free Practice Questions Matter

### 1. They Show You the Exam Format

ServiceNow exams use specific question styles — single-select, multi-select ("choose 2"), and negative questions ("which is NOT..."). Practicing with realistic questions eliminates format surprises on exam day.

### 2. They Reveal Knowledge Gaps

You don't know what you don't know until you test yourself. Free practice questions help you identify weak domains *before* you spend $300-$450 on the real exam.

### 3. They Build Confidence

Walking into the exam having already answered similar questions makes a real difference. You spend less time on anxiety and more time on actual problem-solving.

## How SNReady Practice Questions Are Different

### Written by Practitioners, Not AI Dumps

Every question is based on actual ServiceNow documentation and course content. We don't scrape brain dump sites. Our questions test real understanding, not memorization of leaked answers.

### Detailed Explanations

Every question includes:
- **Why the correct answer is right** — not just "A is correct"
- **Why each wrong answer is wrong** — understanding the reasoning
- **Key concepts** — what you should remember

### Matches Real Exam Format

- 35% multi-select questions (matching the actual exam ratio)
- 15% negative questions ("which is NOT...")
- Scenario-based questions that test application, not recall

## Free vs Premium

| Feature | Free | Premium ($9) |
|---------|------|-------------|
| Questions per cert | 15 per cert (CSA: every question) | Full question bank |
| Explanations | ✅ Full | ✅ Full |
| Timed mock exams | CSA only | ✅ |
| Domain breakdown | ❌ | ✅ |
| All 20 certifications | ✅ | ✅ |
| Price | $0 | $9 per cert, or $49 for all 19 paid certs |

**CSA is completely free, and $9 unlocks any other certification for life** (or $49 for all 19 paid certifications). That's less than 5% of what you'd pay for one exam attempt.

## Start Practicing Now

Pick your certification and start with the free questions. No signup required.

[Browse All Certifications →](/)

[Take a Free Timed CSA Mock Exam →](/csa/mock-exam)
`
  },
  {
    slug: "all-servicenow-certifications-complete-guide-2026",
    title: "All 28 ServiceNow Certifications Explained (2026 Complete Guide)",
    description: "Every ServiceNow certification in one place: requirements, costs, difficulty, career impact, and which ones to get first. Updated for 2026.",
    publishedAt: "2026-03-30",
    updatedAt: "2026-10-16",
    author: "SNReady Team",
    tags: ["certifications", "career", "study guide", "CSA", "CAD", "CIS"],
    featured: true,
    readingTime: 18,
    content: `
## How Many ServiceNow Certifications Are There?

As of 2026, ServiceNow offers **28+ certifications** across four levels: Foundational, Professional, Expert, and Specialist. They span administration, development, implementation, and architecture.

This guide covers every certification, who it's for, what it costs, and — most importantly — which ones actually matter for your career.

## The Certification Hierarchy

### Level 1: Foundational
| Certification | Full Name | Cost | Questions | Time |
|---|---|---|---|---|
| **[CSA](/csa)** | Certified System Administrator | $300 | 60 | 90 min |

CSA is the starting point for everyone. Period. Even if you want to be a developer or architect, you need CSA first. It's the prerequisite for almost everything else.

**Who it's for:** Anyone starting in ServiceNow — admins, developers, consultants, managers.

**Difficulty:** Moderate. Most people pass with 2-4 weeks of focused study. The exam tests practical platform knowledge: tables, forms, ACLs, workflows, import sets.

→ [Practice CSA Questions](/csa/practice-questions) | [How to pass the CSA exam](/blog/how-to-pass-servicenow-csa-first-time)

### Level 2: Professional — Application Development

| Certification | Full Name | Cost | Questions | Time |
|---|---|---|---|---|
| **[CAD](/cad)** | Certified Application Developer | $300 | 60 | 90 min |

CAD is the developer certification. If you write scripts, build apps, or work with APIs on ServiceNow, this is your cert.

**Who it's for:** Developers, technical consultants, anyone who touches code on the platform.

**Difficulty:** Hard. Requires solid JavaScript knowledge plus ServiceNow-specific scripting (Business Rules, Client Scripts, Script Includes, REST APIs).

→ [Practice CAD Questions](/cad/practice-questions) | [CSA vs CAD Comparison](/blog/csa-vs-cad-real-talk)

### Level 2: Professional — Implementation Specialist Certifications

These are the "CIS" certs — the bread and butter of ServiceNow consulting. Each one covers a specific product module.

#### IT Operations & Service Management

| Certification | Full Name | Domains | Practice |
|---|---|---|---|
| **[CIS-ITSM](/cis-itsm)** | IT Service Management | 7 | [Practice →](/cis-itsm/practice-questions) |
| **[CIS-Discovery](/cis-discovery)** | Discovery | 4 | [Practice →](/cis-discovery/practice-questions) |
| **[CIS-EM](/cis-em)** | Event Management | 6 | [Practice →](/cis-em/practice-questions) |
| **[CIS-SM](/cis-sm)** | Service Mapping | 6 | [Practice →](/cis-sm/practice-questions) |

**CIS-ITSM** is the most popular CIS cert and the most valuable for consultants. Incident, Problem, Change, and Request management are the core of what most companies use ServiceNow for.

**CIS-Discovery** and **CIS-SM** are paired — Discovery finds infrastructure, Service Mapping maps relationships. If you do ITOM work, get both.

#### Data & Configuration

| Certification | Full Name | Domains | Practice |
|---|---|---|---|
| **[CIS-DF](/cis-df)** | Data Foundations (CMDB) | 5 | [Practice →](/cis-df/practice-questions) |

CIS-DF replaced the old CIS-CMDB certification. It covers CMDB, CSDM, data integrity, and Health. Essential if you touch the CMDB — and everyone touches the CMDB.

→ [Practice CIS-DF Questions](/cis-df/practice-questions)

#### Customer & HR Service

| Certification | Full Name | Domains | Practice |
|---|---|---|---|
| **[CIS-CSM](/cis-csm)** | Customer Service Management | 5 | [Practice →](/cis-csm/practice-questions) |
| **[CIS-HR](/cis-hr)** | HR Service Delivery | 4 | [Practice →](/cis-hr/practice-questions) |
| **[CIS-FSM](/cis-fsm)** | Field Service Management | 5 | [Practice →](/cis-fsm/practice-questions) |

These are growing fast. CSM and HR are two of ServiceNow's fastest-growing product lines. If you specialize in either, the certification significantly boosts your rates.

#### Asset Management

| Certification | Full Name | Domains | Practice |
|---|---|---|---|
| **[CIS-SAM](/cis-sam)** | Software Asset Management | 5 | [Practice →](/cis-sam/practice-questions) |
| **[CIS-HAM](/cis-ham)** | Hardware Asset Management | 5 | [Practice →](/cis-ham/practice-questions) |

SAM and HAM are niche but valuable. Companies with large software/hardware inventories need people who can configure these modules. Less competition = higher rates.

#### Governance, Risk & Compliance

| Certification | Full Name | Domains | Practice |
|---|---|---|---|
| **[CIS-RC](/cis-rc)** | Risk & Compliance | 7 | [Practice →](/cis-rc/practice-questions) |
| **[CIS-VR](/cis-vr)** | Vulnerability Response | 5 | [Practice →](/cis-vr/practice-questions) |
| **[CIS-SIR](/cis-sir)** | Security Incident Response | 6 | [Practice →](/cis-sir/practice-questions) |
| **[CIS-TPRM](/cis-tprm)** | Third Party Risk Management | 6 | [Practice →](/cis-tprm/practice-questions) |

GRC and SecOps are where the money is in 2026. Security certifications command premium rates because the demand far outstrips supply.

#### Strategic Portfolio & Performance

| Certification | Full Name | Domains | Practice |
|---|---|---|---|
| **[CIS-SPM](/cis-spm)** | Strategic Portfolio Management | 9 | [Practice →](/cis-spm/practice-questions) |
| **[CIS-SP](/cis-sp)** | Service Provider | 5 | [Practice →](/cis-sp/practice-questions) |
| **[CIS-PA](/cis-pa)** | Performance Analytics | 6 | [Practice →](/cis-pa/practice-questions) |
| **[CPOA](/cpoa)** | Certified Pre-Sales & Operations Analyst | 6 | [Practice →](/cpoa/practice-questions) |

CIS-PA is underrated. Every customer wants dashboards and reports. Performance Analytics knowledge makes you more valuable on every project.

### Level 3: Expert & Specialist

ServiceNow also offers CTA (Certified Technical Architect) and CMA (Certified Master Architect) certifications. These require extensive experience and involve multi-day practical exams. They're the highest-earning certifications in the ecosystem but are out of scope for most people in their first few years.

## Which Certifications Should You Get? (Decision Framework)

### Just Starting Out
1. **CSA** — Non-negotiable. Get this first.
2. **CIS-ITSM** — The most universally useful CIS cert.
3. **CAD** — If you want to develop, not just configure.

### 2-3 Years In
4. **CIS-DF** — CMDB knowledge makes you dangerous (in a good way).
5. **Your specialization CIS** — CSM, HR, Discovery, etc., based on your project work.
6. **CIS-PA** — Everyone needs dashboards. This makes you the person who builds them.

### Career Accelerators
- **CIS-SIR + CIS-VR** — SecOps duo. Highest-paying niche.
- **CIS-SAM + CIS-HAM** — Asset management. Less competition.
- **CIS-SPM** — Project portfolio management. Earns trust with executives.

## Certification Costs: The Full Picture

| Item | Cost |
|---|---|
| Exam attempt (CSA/CAD) | $300 |
| Exam attempt (CIS) | $450 |
| Failed attempt | +$150 retake (CSA/CAD), +$225 (CIS) |
| On-demand courses | Free |
| Developer instance | Free |
| Total if you pass CSA first time | **$300** |
| Total if you fail CSA once | **$450** |

Prices are USD and exclude tax. Exam vouchers no longer exist: you unlock eligibility by completing the required course on ServiceNow University, register and pay there, and schedule through Pearson VUE. Retakes also come with waiting periods: 3 days before your 2nd attempt, 30 days before your 3rd, and 6 months before any later attempt.

**That's why practice tests matter.** A $9 investment in practice questions can save you $150 on a retake — and the wait.

## Delta Exams: Staying Current

ServiceNow releases a new version every 6 months (Vancouver, Washington DC, Xanadu, Yokohama, Zurich, Australia...). Your certification stays current for the release you passed on plus the next one. After that, you need to pass a delta exam.

Delta exams are:
- Shorter (30-40 questions)
- Focus only on new features in the latest release
- Check ServiceNow University for current delta exam requirements and any fees
- Must be completed within the maintenance window

**Don't let your cert lapse.** Delta exams are much easier than the full exam.

## How Long Does Each Certification Take?

Based on community feedback and our data:

| Certification | Study Time | Prerequisite |
|---|---|---|
| CSA | 2-4 weeks | None |
| CAD | 3-6 weeks | CSA |
| CIS-ITSM | 2-4 weeks | CSA + CIS-DF |
| CIS-DF | 3-5 weeks | CSA |
| CIS-Discovery | 2-4 weeks | CSA + CIS-DF |
| CIS-CSM | 2-4 weeks | CSA |
| CIS-HR | 2-3 weeks | CSA |
| Other CIS | 2-4 weeks | CSA (CIS-HAM, CIS-SAM, CIS-SM, CIS-VR, CIS-SIR also need CIS-DF) |

These assume 1-2 hours/day of study. Double it if you're starting from scratch.

## What Certified Professionals Earn

Based on our [salary database of 200+ entries](/salaries):

| Role | Median Salary (US) |
|---|---|
| ServiceNow Administrator (CSA) | $95,000 - $120,000 |
| ServiceNow Developer (CAD) | $110,000 - $140,000 |
| ServiceNow Consultant (CIS-*) | $120,000 - $160,000 |
| ServiceNow Architect (CTA) | $160,000 - $200,000+ |

Each additional certification typically adds $5,000-$15,000 to your market value. The ROI on a $300 exam is enormous.

→ [See full salary data](/salaries)

## Start Practicing Today

We have **100+ practice questions for all 20 certifications**, generated from official ServiceNow course content. Start with the free questions — no signup required.

| Your Goal | Start Here |
|---|---|
| First certification | [CSA Practice Questions](/csa/practice-questions) |
| Developer track | [CAD Practice Questions](/cad/practice-questions) |
| Consultant track | [CIS-ITSM Practice Questions](/cis-itsm/practice-questions) |
| Not sure yet | [Take our certification quiz](/quiz) |
| Create a study schedule | [Study Plan Generator](/study-plan) |
| Browse everything | [All Certifications](/certifications) |
`
  },
  {
    slug: "servicenow-csa-practice-test-200-questions-2026",
    title: "ServiceNow CSA Practice Test: 200 Questions to Pass the Exam (2026)",
    description: "The most comprehensive free CSA practice test available. 200 exam-quality questions across all 8 domains. See where you stand before spending $300.",
    publishedAt: "2026-03-31",
    updatedAt: "2026-10-16",
    author: "SNReady Team",
    tags: ["CSA", "practice test", "exam prep", "free questions"],
    featured: true,
    readingTime: 14,
    content: `
## Why 200 Questions Matters

Most ServiceNow CSA practice tests give you 40-60 questions. That's not enough to find your blind spots.

The real CSA exam has 60 questions covering 8 domains. If you only practice with 50 questions, you might never see a question on view rules, coalesce fields, or delegated administration — all of which appear on the real exam.

We built 200 questions because that's what it takes to genuinely prepare. You'll see every topic multiple times, in different formats, from different angles.

## What the Real CSA Exam Looks Like

Before you practice, know what you're preparing for:

| Aspect | Details |
|--------|---------|
| **Total questions** | 60 |
| **Time limit** | 90 minutes |
| **Passing score** | Not published (ServiceNow says it isn't always 70%) — aim for 80%+ on practice exams |
| **Question types** | Single choice, multi-select ("choose 2"), negative ("which is NOT") |
| **Cost** | $300 exam, $150 retake (USD, excluding tax) |
| **Format** | Registered in ServiceNow University, scheduled through Pearson VUE |

**The exam is not conceptual.** You won't see "What is an incident?" You'll see "Which field on the incident form determines the SLA calculation when the caller is a VIP?" Specificity matters.

## Domain Breakdown: Where to Focus

Our 200 questions mirror the official exam blueprint:

| Domain | Exam Weight | Our Questions | Focus Areas |
|--------|------------|---------------|-------------|
| User Interface & Navigation | 15% | 30 | Lists, filters, forms, views, Next Experience, favorites |
| User Administration & Security | 15% | 30 | ACLs, roles, groups, delegated admin, security settings |
| Database Administration | 12% | 24 | Table inheritance, import sets, transform maps, coalesce, field types |
| Self-Service & Automation | 15% | 30 | Service Catalog, Flow Designer, Knowledge Base, Record Producers |
| Incident Management | 12% | 24 | Lifecycle, priority matrix, SLAs, Major Incidents, assignment rules |
| Problem Management | 8% | 16 | Known Errors, root cause analysis, proactive vs reactive |
| Change Management | 10% | 20 | Standard/Normal/Emergency, CAB, conflict detection, rollback |
| Reporting & Dashboards | 13% | 26 | Report types, PA vs reports, scheduled reports, drill-down |

## Question Types You'll Face

The real exam uses several question formats. Our practice test includes all of them:

### 1. Single Choice (35%)
*"Which tool is used to define relationships between fields in an import set table and a target table?"*
- A. Data Source
- B. **Transform Map** ✓
- C. Update Set
- D. Import Log

### 2. Multi-Select "Choose 2" (20%)
*"Which two field types store references to records in other tables? (Choose 2)"*
- A. **Reference field** ✓
- B. **Glide List field** ✓
- C. String field
- D. Integer field

### 3. Negative Questions (15%)
*"Which statement about Next Experience UI is NOT true?"*
These test whether you can identify the incorrect statement among plausible options. Don't skip the "NOT" in the question.

### 4. Multi-Select "Choose 3" (15%)
*"What are the three types of change in ServiceNow's Change Management? (Choose 3)"*
These require knowing multiple correct answers — partial credit is typically not given.

### 5. Scenario-Based (15%)
*"A user reports that a reference field on a form is not displaying expected records. Which two actions should an administrator investigate?"*
These test your ability to apply knowledge to real situations.

## Topic Deep Dive: What Trips People Up

Based on hundreds of Reddit posts and exam feedback, here are the areas where candidates struggle most:

### 🔴 Import Sets & Transform Maps (Database Administration)
This is the #1 topic people underestimate. Know:
- The complete import process: Data Source → Import Set → Transform Map → Target Table
- What coalesce fields do (determine insert vs update)
- How to handle reference field mappings
- What happens when transforms fail

### 🔴 ACL Evaluation Order (User Administration)
ACLs use AND logic when multiple rules match. If you have a table-level ACL and a field-level ACL, BOTH must pass. This surprises people who expect "most specific wins."

### 🔴 Flow Designer vs Workflow (Self-Service)
Flow Designer is ServiceNow's current automation tool. Know:
- Triggers (record-based, scheduled, application)
- Actions vs Subflows
- It's no-code/low-code (no scripting required for most actions)

### 🟡 Change Types (Change Management)
Know the three types cold:
- **Standard**: Pre-approved, low-risk, uses templates
- **Normal**: Requires assessment and CAB approval
- **Emergency**: Fast-tracked for critical fixes

### 🟡 Problem vs Incident (Problem Management)
- Incident = restore service ASAP
- Problem = find root cause
- Known Error = root cause identified, workaround documented

## How to Use Our Practice Test

### Strategy 1: Full Mock Exam First
1. Go to [CSA Mock Exam](/csa/mock-exam)
2. Take the 60-question timed test (90 minutes)
3. See your domain-by-domain breakdown
4. Focus your study on domains below 70%

### Strategy 2: Domain-by-Domain Deep Dive
If you know your weak areas, go directly to that domain:
- [UI & Navigation Questions](/csa/practice-questions/ui-navigation)
- [User Administration Questions](/csa/practice-questions/user-administration)
- [Database Administration Questions](/csa/practice-questions/database-administration)
- [Self-Service & Automation Questions](/csa/practice-questions/self-service-automation)
- [Incident Management Questions](/csa/practice-questions/incident-management)
- [Problem Management Questions](/csa/practice-questions/problem-management)
- [Change Management Questions](/csa/practice-questions/change-management)
- [Reporting & Dashboards Questions](/csa/practice-questions/reporting-dashboards)

### Strategy 3: Spaced Repetition
1. Take all free questions first
2. Note which ones you got wrong
3. Review those topics in the [Admin Fundamentals course](https://nowlearning.servicenow.com)
4. Come back and take the practice test again in 3-5 days
5. Repeat until you're consistently above 85%

**Aim for 85%+ on practice questions.** The real exam adds pressure — budget a 10-15% performance drop.

## Common Mistakes to Avoid

### ❌ Studying only the course slides
The course teaches concepts. The exam tests application. You need hands-on time in a PDI.

### ❌ Skipping multi-select questions in practice
About 35% of the real exam is multi-select. If you only practice single-choice, you're unprepared for a third of the exam.

### ❌ Memorizing answers instead of understanding
Our questions have detailed explanations for every option — correct AND wrong. Read the wrong-answer explanations. They teach you why common mistakes are wrong.

### ❌ Ignoring Problem Management because it's only 8%
That's still 5 questions. Five easy questions if you know the material. Five lost points if you don't.

### ❌ Not timing yourself
90 minutes for 60 questions is 1.5 minutes per question. That's tight when multi-select questions need you to evaluate 5-6 options. Practice under time pressure.

## Ready to Start?

We have **200 CSA questions** — the most comprehensive practice test available for ServiceNow CSA, and every one of them is free. No signup, no paywall.

| Action | Link |
|--------|------|
| Start free CSA questions | [Free CSA Practice Questions](/csa/practice-questions) |
| Take a timed mock exam | [CSA Mock Exam](/csa/mock-exam) |
| See all 8 domain topics | [CSA Study Topics](/csa) |
| Create a study schedule | [Study Plan Generator](/study-plan) |
| Not sure CSA is right for you? | [Certification Quiz](/quiz) |

Every question includes full explanations. No brain dumps. No memorization. Just genuine exam preparation.
`
  },
  {
    slug: "servicenow-cis-itsm-practice-test-160-questions-2026",
    title: "CIS-ITSM Practice Test: 160 Questions to Pass the ServiceNow ITSM Exam (2026)",
    description: "The most comprehensive CIS-ITSM practice test available. 160 questions covering all 7 exam domains with detailed explanations. Free sample included.",
    publishedAt: "2026-04-01",
    updatedAt: "2026-10-16",
    author: "SNReady Team",
    tags: ["CIS-ITSM", "practice test", "exam prep", "ITSM"],
    featured: true,
    readingTime: 12,
    content: `
## Why CIS-ITSM Is the Hardest "Easy" Exam

You passed CSA. You've been working with Incident, Change, and Problem Management for months. CIS-ITSM should be a breeze, right?

Wrong. The CIS-ITSM exam has a **higher failure rate than most people expect** because it tests implementation knowledge, not just daily usage. You need to know *why* things are configured a certain way, not just *how* to use them.

The exam has **60 questions in 90 minutes**. ServiceNow doesn't publish the cut score (and says it isn't always 70%), so aim for 80%+ on practice exams. That leaves less room than it sounds — multi-select questions are all-or-nothing.

## What the CIS-ITSM Exam Actually Tests

The exam covers 7 domains. Here's how they break down:

| Domain | Weight | Our Questions |
|--------|--------|--------------|
| Incident Management | 20% | 28 questions |
| Change Management | 20% | 28 questions |
| Problem Management | 15% | 24 questions |
| Request Management | 15% | 22 questions |
| ITSM Overview | 10% | 18 questions |
| SLA Management | 10% | 17 questions |
| Reporting & Metrics | 10% | 17 questions |

That's **160 total practice questions** — far more than the 60 you'll see on exam day, giving you massive coverage.

## Domain Breakdown: What Catches People Off Guard

### Incident Management (20%)

This is your biggest domain. Everyone thinks they know incidents, but the exam goes deep:

- **Major Incident workflows** — Not just "it's a P1." How do communications work? What triggers the major incident process?
- **Parent-child relationships** — What happens to children when the parent resolves? What if the parent reopens?
- **SLA behavior** — Clock pausing on hold, priority changes mid-ticket, the exact color codes on the timeline
- **Universal Request** — Integration plugins and how incidents get created from different channels

**Sample question:** *An incident has Priority 3 with a running SLA. The priority changes to Priority 1. What happens to the existing SLA?*

If you hesitated, you need more practice on this domain.

### Change Management (20%)

Equal weight to Incident, but trickier:

- **Change types** — Standard, Normal, Emergency. Know what gets skipped for each.
- **CAB vs ECAB** — Different membership, different urgency, different process
- **Conflict detection** — Blackout windows, maintenance schedules, CI conflicts
- **Change models** — Pre-built templates that streamline standard changes

The exam loves asking about state transitions. A change goes through New → Assess → Authorize → Scheduled → Implement → Review → Closed. Know every transition and what blocks progression.

### Problem Management (15%)

The domain people study least and regret most:

- **Three lifecycle stages** — Detection & Logging, Investigation & Diagnosis, Resolution
- **Known Error Database** — When to create a Known Error, what gets auto-populated
- **Root Cause Analysis** — The two key questions RCA answers
- **Problem tasks** — How they relate to changes, who can create them

### Request Management (15%)

Not just "user wants something":

- **Service Catalog architecture** — Categories, catalog items, record producers, order guides
- **Request lifecycle** — The four stages and what happens at each
- **Fulfillment workflows** — Parallel vs sequential tasks, approval routing
- **Catalog task states** — What triggers closure, what blocks it

### ITSM Overview (10%)

Deceptively hard because it's broad:

- **ITSM tiers** — Standard vs Pro vs Enterprise. Know what's included in each.
- **CSDM** — The five domains and how they connect
- **Personas** — Who does what in the ServiceNow ITSM ecosystem
- **Now Mobile vs Now Agent** — Different apps for different users

### SLA Management (10%)

Technical and precise:

- **SLA types** — Response SLA vs Resolution SLA, when each starts and stops
- **Clock behavior** — Pausing, restarting, retroactive changes
- **Timeline colors** — Green, yellow, red, grey. Know the percentage thresholds.
- **OLA and UC** — Operational Level Agreements and Underpinning Contracts

### Reporting & Metrics (10%)

Often overlooked, but free points if you study:

- **Benchmarks** — What they measure, how they compare
- **ITSM Pro analytics** — Predictive Intelligence, Performance Analytics
- **Surveys** — Configuration, frequency controls, trigger conditions
- **Walk-up Experience** — The in-person service desk feature

## How to Use These 160 Questions

### Step 1: Take the Free Assessment
Start with our [free CIS-ITSM questions](/cis-itsm/practice-questions) — 29 questions across all domains. This gives you a baseline score without any commitment.

### Step 2: Identify Weak Domains
Look at which domains you scored lowest on. Typically:
- If you're a **daily ITSM user**, you'll struggle with Overview and Reporting (theoretical)
- If you're a **developer/admin**, you'll struggle with Change Management details
- If you're **new to ServiceNow**, start with ITSM Overview and SLA Management

### Step 3: Domain-Focused Practice
Work through questions one domain at a time. Read every explanation — even for questions you got right. The explanations teach you *why*, which is what the exam tests.

### Step 4: Timed Mock Exam
Once you're scoring 80%+ on individual domains, take a [timed mock exam](/cis-itsm/mock-exam). This simulates the real 90-minute pressure with randomized questions.

### Step 5: Review and Repeat
After each mock exam, review every wrong answer. The exam recycles similar concepts in different scenarios.

## Question Types You'll Face

Our practice test mirrors the real exam format:

### Single Choice (Most Common)
*"What is the primary purpose of..."* — One correct answer from four options.

### Multi-Select (Tricky)
*"Which of the following are true? (Choose two.)"* — Must select ALL correct answers. No partial credit on the real exam.

### Scenario-Based (Hardest)
*"A user reports X. Investigation shows Y. What should happen next?"* — Tests application of knowledge, not memorization.

### Negative Questions
*"Which is NOT a valid..."* — Read carefully. These trip up speed-readers.

## Common Mistakes That Cost People the Exam

### ❌ Studying only Incident and Change
Yes, they're 40% combined. But ignoring the other 60% means you need near-perfect scores on your strong domains. That's risky.

### ❌ Confusing Problem and Incident
The exam will deliberately blur the line. Remember: Incidents restore service. Problems find root causes. If a question says "prevent future occurrences," that's Problem Management.

### ❌ Not knowing SLA color codes
Green (0-50%), Yellow (50-75%), Red (75-100%), Grey (paused). The exam treats these as fundamental knowledge.

### ❌ Skipping the Delta content
ServiceNow updates the exam with each release. Our delta questions cover Zurich-specific changes that older study materials miss entirely.

### ❌ Relying on brain dumps
Memorized answers don't help when the exam rephrases questions. Understanding *why* an answer is correct lets you handle any variation.

## Ready to Start?

We have **160 CIS-ITSM questions** — the most comprehensive practice test available for this certification. Every question includes detailed explanations for both correct and incorrect answers.

| Action | Link |
|--------|------|
| Start free CIS-ITSM questions | [Free CIS-ITSM Practice Questions](/cis-itsm/practice-questions) |
| Take a timed mock exam | [CIS-ITSM Mock Exam](/cis-itsm/mock-exam) |
| See all 7 domain topics | [CIS-ITSM Study Topics](/cis-itsm) |
| Create a study schedule | [Study Plan Generator](/study-plan) |
| Not sure which cert to take? | [Certification Quiz](/quiz) |

Every question includes full explanations. No brain dumps. No memorization. Just genuine exam preparation that builds real understanding.
`
  },
  {
    slug: "servicenow-cad-practice-test-200-questions-2026",
    title: "ServiceNow CAD Practice Test: 200 Questions to Pass the Application Developer Exam (2026)",
    description: "200 CAD practice questions covering all 7 exam domains. Scripting, business rules, client scripts, REST APIs, and more — with full explanations.",
    publishedAt: "2026-04-02",
    updatedAt: "2026-10-16",
    author: "SNReady Team",
    tags: ["CAD", "practice test", "exam prep", "application developer"],
    featured: true,
    readingTime: 13,
    content: `
## Why 200 Questions Matters for the CAD Exam

The Certified Application Developer (CAD) exam is the coding exam in the ServiceNow certification path. It tests whether you can actually build things on the platform — business rules, client scripts, script includes, REST integrations, and scoped applications.

**The exam at a glance:**
- 60 questions, 90 minutes
- ServiceNow doesn't publish the cut score (and says it isn't always 70%) — aim for 80%+ on practice exams
- Multiple choice and multi-select
- Heavy on scripting scenarios
- $300 exam fee, $150 per retake (USD, excluding tax)

Unlike the CSA (which tests admin knowledge), the CAD tests your ability to write and debug code. You need to understand GlideRecord, GlideAjax, business rule timing, client-side vs server-side execution, and REST API patterns.

200 practice questions means you can take over 3 full mock exams without repeating a single question.

## What Our 200 Questions Cover

Our CAD question bank is distributed across all 7 exam domains:

| Domain | Questions | What's Tested |
|--------|-----------|---------------|
| [Application Development](/cad/practice-questions) | 53 | Scoped apps, update sets, tables, app scope, Studio |
| [Scripting & APIs](/cad/practice-questions) | 34 | GlideRecord, GlideSystem, GlideAjax, server vs client |
| [Business Rules](/cad/practice-questions) | 24 | Before/after/async/display, abort actions, current/previous |
| [Client Scripts](/cad/practice-questions) | 21 | onLoad, onChange, onSubmit, g_form, g_user |
| [UI Policies & Actions](/cad/practice-questions) | 21 | Visibility, mandatory, read-only, reverse if false |
| [Integration & REST APIs](/cad/practice-questions) | 21 | Table API, RESTMessageV2, auth methods, HTTP methods |
| [Script Includes](/cad/practice-questions) | 20 | AbstractAjaxProcessor, client-callable, reusability |

## The 5 Question Types You'll Face

### 1. Straight Knowledge Questions (~30%)
> "What does the 'Reverse if false' option do on a UI Policy?"

These test whether you know what platform features do. They're the easiest to study for.

### 2. Scenario-Based Questions (~25%)
> "A developer creates a before business rule that sets a field value, but it's not being saved. What is the most likely cause?"

These give you a situation and ask you to troubleshoot. You need real platform experience for these — not just memorized definitions.

### 3. Multi-Select (Choose 2 or 3) (~20%)
> "Which TWO authentication methods are supported by ServiceNow's inbound REST APIs?"

The real exam has a significant number of multi-select questions. Many practice tests skip these entirely. We don't.

### 4. Negative Questions (~15%)
> "Which of the following is NOT a valid g_form method?"

These trip people up because you need to identify the wrong answer. They test the boundaries of your knowledge.

### 5. Code Analysis (~10%)
> "A developer writes an onChange client script but it does not fire when the form loads. What should they add?"

These require you to read code or debug scenarios. The CAD exam has more of these than any other ServiceNow cert.

## Domain Deep Dive: Where People Fail

### Scripting & APIs — The Make-or-Break Domain
This domain tests your fundamental scripting knowledge. The most common mistakes:

- **Confusing server-side and client-side APIs** — g_form is client, GlideRecord is server. Mixing them up in the wrong context is the #1 error.
- **Not knowing GlideRecord query patterns** — addQuery vs addEncodedQuery, when to use get() vs query()
- **GlideAjax callback patterns** — The asynchronous nature trips up developers used to synchronous code

**Key APIs to know cold:**
- GlideRecord (query, insert, update, delete)
- GlideSystem (gs.info, gs.addInfoMessage, gs.getUser)
- GlideAjax (client-to-server communication)
- RESTMessageV2 (outbound REST calls)

### Business Rules — Timing Is Everything
The exam loves testing business rule timing:

| Timing | When It Runs | Key Fact |
|--------|-------------|----------|
| Before | Before DB operation | Changes to current auto-save |
| After | After DB operation | current.update() needed for changes |
| Async | After, in background | Does not block the user |
| Display | When form loads | Can add scratchpad data |

**Critical rule:** Never call current.update() in a before business rule. It causes double saves and recursion issues.

### Client Scripts — Know Your Events
- **onLoad** — Form opens (query or insert)
- **onChange** — Field value changes (does NOT fire on load by default)
- **onSubmit** — Form submitted (return false to cancel)
- **onCellEdit** — List view cell editing

The distinction between these events shows up in almost every CAD exam.

### REST Integration — HTTP Methods Matter
| Method | Table API Use |
|--------|---------------|
| GET | Read records |
| POST | Create records |
| PUT | Replace records |
| PATCH | Partial update |
| DELETE | Delete records |

Know sysparm_fields, sysparm_query, sysparm_display_value, and sysparm_limit.

## How to Use These 200 Questions

### Strategy 1: Domain-by-Domain Study (Recommended)
1. Start with [Scripting & APIs](/cad/practice-questions) — it's the foundation
2. Move to [Business Rules](/cad/practice-questions) — build on scripting knowledge
3. Then [Client Scripts](/cad/practice-questions) and [UI Policies](/cad/practice-questions)
4. [Script Includes](/cad/practice-questions) — ties server-side concepts together
5. [REST APIs](/cad/practice-questions) — integration patterns
6. Finish with [Application Development](/cad/practice-questions) — the big picture

### Strategy 2: Mock Exam Mode
Use our [Timed Mock Exam](/cad/mock-exam) to simulate real conditions:
- 60 random questions from all domains
- 90-minute timer
- No mid-exam feedback
- Domain-level score breakdown at the end

### Strategy 3: Weak Area Focus
Take a mock exam first. Identify your weakest 2-3 domains. Spend focused study time on those domains, then retest.

## CAD vs CSA: Key Differences

| Aspect | CSA | CAD |
|--------|-----|-----|
| Focus | Administration & configuration | Development & scripting |
| Coding Required | Minimal | Extensive |
| Difficulty | Entry-level | Intermediate |
| Study Time | 3-4 weeks | 4-6 weeks |
| Pass Rate | Higher | Lower |
| Practice Questions | [200 questions](/csa/practice-questions) | [200 questions](/cad/practice-questions) |

If you're deciding between the two, read our [CSA vs CAD comparison](/blog/csa-vs-cad-real-talk).

## Essential Study Resources

| Resource | Type | Cost |
|----------|------|------|
| [Application Development Fundamentals](https://nowlearning.servicenow.com) | Official course | Free |
| [Scripting in ServiceNow Fundamentals](https://nowlearning.servicenow.com) | Official course | Free |
| [Personal Developer Instance](https://developer.servicenow.com) | Hands-on practice | Free |
| [SNReady CAD Practice Questions](/cad/practice-questions) | 200 practice questions | Free / Premium |
| [ServiceNow Docs](https://docs.servicenow.com) | Reference | Free |
| [Study Plan Generator](/study-plan) | Personalized schedule | Free |

## Start Practicing Now

| What You Need | Where to Find It |
|--------------|-----------------|
| 200 CAD practice questions | [Start practicing →](/cad/practice-questions) |
| Full mock exam simulation | [Take mock exam →](/cad/mock-exam) |
| Personalized study plan | [Generate plan →](/study-plan) |
| Not sure which cert to take? | [Certification Quiz](/quiz) |

Every question includes detailed explanations for both correct and incorrect answers. No brain dumps. No shortcut memorization. Real understanding that translates to passing the exam and doing the job.
`
  },
  {
    slug: "snready-spring-2026-question-bank-expansion",
    title: "Biggest Question Bank Update: 50 New CPOA Questions + CSA Now at 214 Questions",
    description: "SNReady just dropped its largest content update. 50 new CPOA Technology questions covering MID Server upgrades, Hermes Messaging, and Instance Data Replication — plus CSA expanded to 214 questions.",
    publishedAt: "2026-05-04",
    updatedAt: "2026-10-16",
    author: "SNReady Team",
    tags: ["CPOA", "CSA", "practice questions", "MID Server", "Hermes", "certifications", "study guide"],
    featured: true,
    readingTime: 6,
    content: `
## What's New

Two major additions hit SNReady this week:

**CPOA — 50 new Technology domain questions.** The Certified Process Optimization Administrator exam just got significantly more coverage. These new questions target the topics that trip up the most people on the actual exam: MID Server upgrades, Hermes Messaging Service, Instance Data Replication (IDR), and Cloning.

**CSA — now 214 questions.** The Certified System Administrator question bank grew from 155 to 214 questions, covering Change Management, Incident Management, Database Administration, and more. That's a 38% increase.

Here's what each expansion covers.

## CPOA: 50 New Technology Questions

The CPOA (Certified Process Optimization Administrator) exam focuses on platform administration at an advanced level. The Technology domain covers MID Server infrastructure, messaging architecture, and data replication — concepts that appear frequently on the exam and are hard to practice without a real system.

### What's actually in the new questions:

**MID Server Upgrades (7 questions)**
- UI-based upgrades vs. command-line fallback procedures
- Pre-upgrade readiness checks and validation steps
- Troubleshooting failed or stuck MID Server upgrades
- Upgrading MID Server clusters without service disruption

**Hermes Messaging Service (8 questions)**
- How Hermes topics and namespaces work
- Configuring Kafka client connections to Hermes
- Security roles required for Hermes administration
- Producing and consuming messages between ServiceNow instances

**Instance Data Replication / IDR (14 questions)**
- Setting up producer and consumer instance configurations
- Discrete vs. mapped replication patterns
- Bidirectional replication configuration
- Monitoring replication health and diagnosing delays
- Data privacy and filtering in IDR

**Cloning (5 questions)**
- Post-clone validation steps and what to check first
- Common clone failures and how to resolve them
- What gets copied vs. what gets reset during a clone

**Mixed Platform Administration scenarios (16 questions)**
- Real-world admin situations combining MID Server, Hermes, and IDR
- Troubleshooting cascading platform issues

These questions were written from official ServiceNow documentation and validated against current CPOA exam blueprints. Every question includes full explanations for all answer choices — not just the correct one.

[Practice CPOA Questions →](/cpoa/practice-questions)

## CSA: 214 Questions (Up from 155)

The CSA exam bank expanded by 59 questions across four domains. These weren't filler — they target specific weak spots that study groups on Reddit and Discord consistently report.

**Change Management (+20 questions)**
- Change Advisory Board (CAB) Workbench configuration
- Change conflict detection (scheduling overlaps on the same CI)
- Standard vs. Normal vs. Emergency change workflows
- Post-failed-implementation documentation requirements
- Risk assessment and CAB approval logic

**Incident Management (+12 questions)**
- Major Incident parent-child ticket relationships
- SLA pause conditions (why timers stop in Pending state)
- Assignment Rules and automatic routing logic
- Priority calculation from Impact × Urgency matrix
- Reopening resolved incidents — correct state and workflow

**Database Administration (+10 questions)**
- Transform Map coalesce field behavior and duplicate prevention
- Reference field vs. Glide List field (one vs. many references)
- Import set staging table lifecycle
- Table inheritance and child table behavior
- Business Rule vs. calculated default for date arithmetic

**Reporting & Dashboards (+8 questions)**
- When to use a report vs. a dashboard
- Configuring data sources and filters
- Real-time dashboard updates for incident tracking

**Self-Service & Automation (+9 questions)**
- Service Catalog item variables and ordering logic
- Flow Designer triggers, actions, and error handling
- Record producer behavior and use cases

[CSA Free Practice Questions →](/csa/practice-questions)

## Why We Added These Specific Topics

We analyzed three data sources to decide what to add:

1. **ServiceNow exam blueprints** — topic weights tell you WHAT to study, but not which specific sub-topics appear most
2. **Reddit and Discord community feedback** — real exam reports from people who recently passed or failed
3. **ServiceNow documentation depth** — topics that are well-documented but don't have good question coverage elsewhere

MID Server upgrades and Hermes Messaging consistently came up as topics people felt unprepared for. These are infrastructure-level concepts that experienced admins learn through trial and error — but the exam tests them at a conceptual level you can master from practice questions.

## How the Questions Are Built

Every SNReady question goes through a pipeline:

1. **Source material** — ServiceNow official documentation, exam blueprints, and Now Learning course content
2. **Question drafting** — Multiple question types: single-choice, multi-select, negative (pick the wrong answer), and compound true/false
3. **Cognitive classification** — Each question tagged as Knowledge, Understanding, or Application level
4. **Explanation writing** — Full reasoning for every answer choice, including why wrong answers are wrong
5. **Schema validation** — Automated checks ensure JSON format correctness, no duplicate IDs, and proper field types
6. **Build verification** — The site won't deploy if any question file has structural errors

The result is questions that actually prepare you for exam conditions — not just questions that look similar to what you've seen before.

## What's Coming Next

We're currently working on expanding:

- **CIS-CISSM** — IT Service Management implementation questions
- **CAD** — Application Developer exam coverage
- **CPOA Process domain** — Flow Designer, App Engine, and process automation questions

Follow [@SNReady](https://twitter.com/snready) for release announcements. Or just check back — we update multiple times per week.

## Start Practicing

All new questions are live now on SNReady.com:

- [CPOA Free Practice Questions](/cpoa/practice-questions) — includes the 50 new Technology questions
- [CSA Free Practice Questions](/csa/practice-questions) — every question free
- [Timed CPOA Mock Exam](/cpoa/mock-exam) — simulate real exam conditions
- [Timed CSA Mock Exam](/csa/mock-exam) — 60 questions, 90 minutes, free

---
*Updated October 2026. All questions based on current ServiceNow exam blueprints.*
`
  },
];
export function getAllPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}
export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}
export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter(post => post.featured);
}
export function getPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter(post => post.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
}
export function getAllTags(): string[] {
  const tags = new Set<string>();
  blogPosts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
  return Array.from(tags).sort();
}
