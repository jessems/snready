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
    slug: "csa-exam-reddit-tips-that-actually-work",
    title: "I Analyzed 50+ Reddit CSA Posts: Here's What Actually Works",
    description: "Consolidated wisdom from r/servicenow: what worked for people who passed, what failed for those who didn't, and the patterns that predict success.",
    publishedAt: "2026-02-22",
    author: "SNReady Team",
    tags: ["CSA", "Reddit", "study tips", "exam prep"],
    featured: true,
    readingTime: 12,
    content: `
## Why I Did This

Every week, someone posts in r/servicenow: "Tips for CSA exam?" or "Just failed CSA, help!"

The advice is scattered across hundreds of threads spanning years. Some tips contradict others. Some are outdated.

I went through 50+ Reddit posts about CSA exam preparation — success stories, failure posts, and advice threads — and consolidated everything into patterns.

Here's what actually predicts success.

## The Single Most Important Resource

**The ebook wins. Overwhelmingly.**

From the people who passed:

> "I solely used the ebook, your flash cards, and like 15 questions from a random GitHub. Studied less than a week and passed."

> "Knowing everything in the ebook is 100% enough to pass."

> "Use the course videos and labs to augment your learning but if you read the ebook front to back and can recall it, you'll pass with flying colors."

> "It covers absolutely everything you'll ever need to pass the exam. Like it's not even funny how detailed it is."

From people who failed:

> "I spent alot more time on basic platform stuff but not on the items that were 30% off the exam."

The pattern is clear: **people who read the entire ebook thoroughly pass. People who skim it or skip sections fail.**

### How to Use the Ebook

Reddit's best advice on ebook study:

1. **Read it front to back** — Don't skip sections thinking they're not on the exam
2. **Pay attention to colored blocks and bold text** — These highlight testable content
3. **Take notes** — Write things down, don't just read
4. **Multiple passes** — Read it at least twice

> "Go through the book multiple times and take notes of the colored blocks and paragraphs with bold."

## The Lab Debate: How Many Times?

Labs are universally recommended. The debate is how much repetition.

**Conservative view (2-3 times):**
> "Overview the content, write notes from the ebook also and do the labs 2-3 times and the exam will be a breeze."

**Aggressive view (20+ times):**
> "Repeat the simulator and activities 20+ times. I did this and aced the test."

**The pattern:** People who did labs until they could do them from memory without thinking passed easily. The exact number doesn't matter — what matters is reaching automaticity.

> "Do the labs and then... do the labs again. Get a PDI and play with your own scenarios."

**Key insight:** The labs teach you WHERE things are in the platform. Many exam questions test navigation and location, not just concepts.

## Practice Tests: The Controversial Topic

Reddit is split on practice tests. Here's the nuanced truth:

### What Works

**SkillCertPro** is mentioned positively most often:
> "SkillCert Pro exam dumps. $20 for ~600 questions and I passed CSA 10 days after."

> "I found that around half of the questions were already on skillcertpro."

**Repeating until mastery:**
> "Each day I took all 5 tests, studied the questions I got wrong and why I got them wrong, then take it again. Repeat until I got 100%."

### What Doesn't Work

**Udemy courses get mixed reviews:**
> "Udemy resources suck. I get Udemy for free through my company and while I love it for a lot of other things, for ServiceNow it's useless."

> "Udemy is horrible for CSA. Do not study that!!"

BUT some found Udemy practice tests (not courses) useful:
> "I kept repeating them until I consistently scored 85%+ and they really helped."

**ExamTopics with caveats:**
> "Always read the comments and community votes, refer to your manual to cross-check validity of the answer."

The answers on ExamTopics are often wrong. Use it to see question formats, not to memorize answers.

### The Real Practice Test Strategy

From someone who failed twice then passed:

> "Instead of trying to memorize the questions try to know why the other options are the incorrect questions."

This is the key insight. Practice tests work when you use them to learn concepts, not memorize answers. If you can't explain why each wrong answer is wrong, you haven't learned the material.

## Time Investment: What's Realistic?

**Fast passes (less than 2 weeks):**
> "I passed the CSA exam with less than a week of study." (With ITSM background)

> "I just passed 1 hour ago! Studied less than a week and passed." (Ebook + flashcards only)

**Typical timeline (2-4 weeks):**
> "Just passed the CSA exam with few weeks of studying."

**Longer timelines:**
> "Third time, I paid for practice tests... I studied about 3 hours a day for 2 weeks before the exam."

**The pattern:** People with ITSM background or Atlassian experience pass faster. Complete beginners need 3-4 weeks minimum.

**Warning sign:** If you're bombing practice tests after 2 weeks, you're probably skipping the ebook. Go back to fundamentals.

## What Actually Appears on the Exam

Reddit insights on exam content:

### Confirmed Topics (Multiple People)

**Database Management** is a weak spot:
> "Database management seems to be my struggle and I have redone that section twice now."

**Table Builder** appears despite not being in ebook:
> "Try also to take a look at the Table Builder. It wasn't covered in the ebook but I got 3 questions about it."

**Import Sets and Transform Maps** heavily tested:
> Multiple mentions of coalesce fields being confusing

### Exam Characteristics

**Easier than practice tests:**
> "The actual exam is much easier than those practice exams."

> "I thought I was ready to attempt the mock exam from Udemy and I got a whopping 42%... this was a turning point."

**Tricky wording:**
> "The exam has some stupidly worded questions."

**Scenario-based:**
> "CSA exam was tough, it is more on scenario based."

## Failure Patterns: What Doesn't Work

From people who failed:

### Pattern 1: Skipping the Ebook
> "I spent alot more time on basic platform stuff but not on the items that were 30% off the exam."

The exam tests specific content. Random YouTube isn't enough.

### Pattern 2: Memorizing Without Understanding
> "I can tell when we hire contractors with CSA's who only studied the answers."

Memorizing brain dump answers leads to confident wrong answers.

### Pattern 3: Not Doing Labs
> "Any tips How to Pass without elab practice?" — From someone who just passed and knows you need labs

The labs teach navigation. Skipping them means struggling with "where is this" questions.

### Pattern 4: Wrong Resources
> "Second time I tried many free practice tests I found online, and failed by 1 point."

Random internet tests often have wrong answers and outdated content.

## The Winning Formula

Based on 50+ Reddit posts, here's what consistently works:

### Phase 1: Foundation (Week 1)
- Read entire ebook front to back
- Take notes on colored blocks and bold text
- Don't skip any sections

### Phase 2: Hands-On (Week 2)
- Complete all labs
- Get a PDI and experiment beyond the labs
- Repeat labs until you can do them without thinking

### Phase 3: Practice (Week 3)
- Take practice tests (SkillCertPro or similar)
- For every wrong answer, understand WHY it's wrong
- Repeat until scoring 85%+ consistently

### Phase 4: Polish (Days Before)
- Review exam blueprint
- Re-read weak sections
- Do knowledge checks one more time

### Exam Day
- Read questions carefully — watch for tricky wording
- The actual exam is easier than most practice tests
- If you did the work, you'll pass

## The Uncomfortable Truth

From someone who passed after multiple failures:

> "I know a guy who had to take the test 4 times and who is a very good dev now."

Failing isn't the end. But failing repeatedly while using the same approach is insanity.

If you failed:
1. Did you read the entire ebook? Really?
2. Did you do the labs until they were automatic?
3. Did you understand why answers were wrong, or just memorize?

Be honest. Then fix the gap.

## What Makes This Different from Brain Dumps

Brain dumps give you answers. This gives you a process.

The process:
- Ebook teaches concepts
- Labs teach navigation
- Practice tests reveal gaps
- Understanding (not memorizing) prepares you for scenario questions

Brain dumps fail because the exam has scenario questions that require thinking. You can't memorize your way through "A user reports X, what's the most likely cause?"

## Start Practicing

Reddit advice is valuable, but you need to apply it.

Our practice questions are derived from official ServiceNow course content — the same source as the ebook. Every explanation tells you why answers are right AND wrong.

[Start CSA Practice Questions →](/csa/practice-questions)

---

*Sources: 50+ posts from r/servicenow spanning 2022-2026*
`
  },
  {
    slug: "why-servicenow-brain-dumps-will-fail-you",
    title: "Why ServiceNow Brain Dumps Will Fail You (And What Actually Works)",
    description: "Brain dump sites like ExamTopics promise easy CSA certification. Here's why they backfire — and the approach that actually prepares you for real ServiceNow work.",
    publishedAt: "2026-02-23",
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
- 70% to pass (42/60)

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
    slug: "servicenow-csa-exam-what-they-dont-tell-you",
    title: "The ServiceNow CSA Exam: What They Don't Tell You",
    description: "Beyond the official exam guide. Real insights on question patterns, time management, and the topics that trip people up on the CSA certification.",
    publishedAt: "2026-02-25",
    author: "SNReady Team",
    tags: ["CSA", "exam tips", "strategy"],
    featured: true,
    readingTime: 10,
    content: `
## The Official Guide Isn't Enough

ServiceNow's exam guide tells you the domains and weightings:

| Domain | Weight |
|--------|--------|
| Database Administration | 20% |
| User Administration & Security | 15% |
| UI & Navigation | 15% |
| Self-Service & Automation | 15% |
| Reporting & Dashboards | 10% |
| Change Management | 10% |
| Incident Management | 10% |
| Problem Management | 5% |

That's helpful but incomplete. Here's what they don't tell you.

## Question Patterns You'll Actually See

### Pattern 1: The "Which is NOT" Question

> "Which of the following is NOT a valid state for an Incident record?"

These reverse questions trip people up. You're looking for four correct things and one wrong thing. Your brain is trained to find the right answer, not the wrong one.

**Strategy:** Physically cover the "NOT" with your finger, identify what IS correct, then pick what's left.

### Pattern 2: The Multi-Select Ambiguity

> "Which statements are true about Business Rules? (Choose two.)"

Sometimes it's "Choose two." Sometimes it's "Choose all that apply." The difference matters.

"Choose two" = exactly 2 answers are correct
"Choose all that apply" = could be 2, 3, or 4 correct

**Strategy:** For "Choose all that apply," evaluate each option independently. For "Choose two," find the two MOST correct (some wrong options might seem partially true).

### Pattern 3: The Scenario That Buries the Lead

> "An administrator creates a new field on the Incident table called 'Risk Level' with a dropdown of Low, Medium, High. They create a UI Policy to make the field mandatory when Priority is 1 - Critical. A user reports they can submit P1 incidents without filling in Risk Level. The UI Policy is active and the condition is configured correctly. What is most likely causing this issue?"

The setup is 50 words. The actual question is hidden at the end. Most people start panicking because they're still processing the scenario.

**Strategy:** Read the LAST sentence first. Know what you're looking for. THEN read the setup to find the answer.

### Pattern 4: The "Best Practice" Question

> "What is the recommended approach for..."

ServiceNow has official best practices for almost everything. These questions test if you know them.

Examples:
- Best practice for Business Rules: avoid GlideRecord queries in display rules
- Best practice for notifications: use event-based, not record-based
- Best practice for ACLs: most restrictive at table level

**Strategy:** When you see "recommended" or "best practice," think about what ServiceNow officially suggests in their documentation, not what "works."

## The Topics That Trip People Up

### 1. Dictionary Overrides

"What's a dictionary override used for?"

Most people know fields have attributes (mandatory, read-only, default values). Fewer know that on extended tables, you can override these attributes WITHOUT changing the parent.

Real-world example: The Task table has a State field. Incident extends Task. You want State to be mandatory on Incidents but not on all Tasks.

Answer: Dictionary override on the Incident table's State field.

### 2. Coalesce Fields in Import Sets

"If coalesce finds a match, what happens?"

This confuses people because it sounds like merge/upsert logic from databases.

Simple rule:
- Match found → UPDATE existing record
- No match → INSERT new record

Coalesce fields define what counts as a "match." It's NOT about merging data. It's about deciding whether to update or insert.

### 3. The Difference Between Similar Things

The exam loves testing distinctions:

- **UI Policy vs. Client Script:** Both run on the client, both can change form behavior. UI Policy is no-code, runs on form load + field change. Client Script is coded, offers more control and event types (onChange, onSubmit, onLoad, onCellEdit).

- **Business Rule vs. Script Include:** Both are server-side scripts. Business Rule runs automatically when records are modified. Script Include is a reusable function you call explicitly.

- **Global vs. Scoped App:** Global runs everywhere, can access everything, harder to control. Scoped runs in isolation, must request cross-scope access, easier to package and share.

### 4. ACL Evaluation Order

"How does ServiceNow evaluate ACLs?"

This is nuanced:

1. Object-level (table + field) → must pass
2. Row-level → if no ACL exists, row access allowed
3. Field-level → if no ACL exists, field access follows row

And the matching logic:
- More specific ACLs override less specific
- Multiple matching ACLs: ALL must pass
- No matching ACL: access DENIED (not allowed)

## Time Management

90 minutes. 60 questions. That's 90 seconds per question.

Sounds tight, but it's generous if you manage it right.

**First pass (45 min):** Answer everything you know immediately. Flag anything that requires thought. Don't solve hard problems.

**Second pass (30 min):** Return to flagged questions. Now you have time to think.

**Final pass (15 min):** Review flagged questions one more time. Change answers ONLY if you find an actual error, not just second-guessing.

Most people fail time management because they freeze on early hard questions. Don't. Flag it and move on.

## The Day Before

Don't cram. Seriously.

If you don't know it the day before, you won't know it the day of. Last-minute memorization creates anxiety without creating competence.

**Do this instead:**
- Review your notes casually
- Get 8 hours of sleep
- Lay out everything you need (ID, test confirmation)
- Accept that you're as prepared as you're going to be

## The Day Of

- Arrive 15 minutes early
- Use the restroom before you start
- Read each question fully (including all options)
- Trust your first instinct unless you find an actual error
- Use the flag feature — don't fight hard questions early
- Don't panic if you hit questions you've never seen (some are experimental/unscored)

## Practice Questions That Actually Help

Most practice tests train you to recognize keywords and pattern-match to answers. That works for easy questions but fails on scenario-based ones.

Good practice should make you think like the exam. Every question should have:
- A clear explanation of why the correct answer is correct
- An explanation of why each wrong answer is wrong
- A connection to actual platform behavior

That's how you prepare for scenario questions — by building mental models, not by memorizing answer patterns.

[Take CSA Practice Questions →](/csa/practice-questions)
`
  },
  {
    slug: "servicenow-certification-worth-it-2026",
    title: "Is ServiceNow Certification Worth It in 2026? A Realistic Analysis",
    description: "Cutting through the hype. When ServiceNow certification pays off, when it doesn't, and how to make the investment worthwhile.",
    publishedAt: "2026-02-26",
    author: "SNReady Team",
    tags: ["career", "certifications", "salary"],
    readingTime: 9,
    content: `
## The Question Nobody Wants to Answer Honestly

Every certification site tells you ServiceNow certs are valuable. Of course they do — they sell cert prep.

Here's a more honest answer: **It depends on where you're starting from.**

## When Certification Pays Off

### Scenario 1: Breaking Into ServiceNow

You're in IT but not ServiceNow. You want in.

**Certification: Worth it.**

Here's the math:
- CSA exam: $210
- Study time: 40-80 hours
- Entry ServiceNow roles: $80K-100K
- General IT support roles: $50K-70K

That's a $20K-30K salary jump for a $210 exam. Even if you include $500 in study materials and 2 months of evening study, the ROI is exceptional.

**Catch:** You still need to get hired. Certification opens doors but doesn't guarantee entry. You'll also need:
- A PDI with some configuration work to show
- Basic understanding of ITSM concepts
- Soft skills for interviews

### Scenario 2: Already Working in ServiceNow Without Cert

You've been doing ServiceNow admin work for a year. No certification.

**Certification: Probably worth it.**

Your experience matters more than the cert. But:
- Some employers require certification for promotions
- Some clients require certified resources
- Some recruiters filter for "CSA required"

If you're happy in your current role and don't need the cert for advancement, maybe it's optional. But if you ever want to switch jobs, the cert removes friction.

### Scenario 3: Moving from CSA to CIS Specializations

You have CSA. Should you get CIS-ITSM, CIS-CSM, etc.?

**Depends on your specialization.**

If you work exclusively in ITSM implementations, CIS-ITSM validates that specialization. It can command a premium for specialized work.

But if you're a generalist admin who touches multiple modules, additional CIS certs may not add much value. One or two specializations is plenty.

### Scenario 4: Going for CTA

You want to be a Technical Architect.

**Certification: Required, but not sufficient.**

CTA requires CSA + CAD + passing the CTA exam (which is brutal). But having the certs alone doesn't make you an architect.

You need years of complex project experience. The certification validates knowledge; the projects validate judgment.

## When Certification Doesn't Pay Off

### If you're collecting certs without using them

Some people get CSA, CAD, CIS-ITSM, CIS-CSM, CIS-HR... and work in a role that only uses CSA skills.

Those extra certs aren't worthless, but they're also not generating returns. The investment in time and exam fees could have gone toward:
- Actual project experience
- Adjacent skills (integration, reporting, automation)
- Building your own ServiceNow projects/content

**One cert you use > Five certs you don't.**

### If you're using brain dumps to pass

Let's be blunt: if you memorize brain dumps and pass, you have a certification you can't back up with skills.

When you get into a role and can't do the work, either:
- You struggle and eventually get fired
- You struggle and eventually learn the real skills (wasting months)
- Your employer discovers you faked competence

The certification only has value if you can DO what it claims you can do.

### If your employer pays anyway

Some companies pay for everything: training, exams, study time.

**Still worth getting**, but the ROI calculation changes. The cost to you is near-zero, so even a modest career benefit makes it worthwhile.

## The ROI Numbers

Let's be concrete:

**CSA Certification Costs:**
- Exam: $210
- Study materials: $0-500 (can be free via Now Learning)
- Time: 40-80 hours

**CSA Certification Benefits:**
- Entry salary bump: $15K-30K/year
- Easier job searching (passes recruiter filters)
- Access to ServiceNow partner network (some require certified staff)

**Payback period:** 1-3 months if you're getting a new job. Infinite if you're already employed and don't need it.

**CAD Additional Value:**
- Exam: $210
- Study time: 60-100 additional hours
- Developer role premium: $20K-40K over admin roles

**CIS Certifications:**
- Exam: $315 each
- Specialization premium: Varies ($10K-20K for in-demand specialties)
- Diminishing returns after 2-3 CIS certs

## Making the Investment Worthwhile

If you're going to certify, maximize the return:

### 1. Learn for the job, not just the exam

Use your PDI. Build things. Break things. Fix things.

The exam tests knowledge. The job tests competence. If you only study for the exam, you'll pass the exam and fail the job.

### 2. Stack strategically

CSA first (universal requirement)
CAD if you're technical (significant premium)
One CIS for your specialty (proves depth)

That's three certifications maximum for most people. Adding more has diminishing returns unless your role specifically requires them.

### 3. Keep current

ServiceNow certs are version-specific. When a new release comes out, you need the delta exam to maintain certification.

This isn't a one-time investment. Factor in ongoing maintenance.

### 4. Document your projects

Certification opens doors. Portfolio wins jobs.

Build things in your PDI that demonstrate actual capability:
- A custom application
- An integration with an external system
- A reporting dashboard

Screenshots and GitHub repos beat certification alone.

## The Bottom Line

ServiceNow certification is worth it when:
- You're breaking into ServiceNow (CSA = ticket to entry)
- You need it for advancement/clients (validation requirement)
- You're pursuing architect path (required for CTA)

It's not worth it when:
- You're collecting certs you won't use
- You're cramming brain dumps without learning
- You're over-certifying for your actual role

The investment is modest ($200-300 per cert). The time is more significant (40-100 hours per cert). Choose certifications that open doors you actually want to walk through.

[Start Your CSA Prep →](/csa)
`
  },
  {
    slug: "cis-itsm-implementation-exam-reality",
    title: "CIS-ITSM: The Implementation Exam That Trips Up CSA Holders",
    description: "You passed CSA. You work with ITSM daily. You should breeze through CIS-ITSM, right? Here's why that assumption gets people.",
    publishedAt: "2026-02-27",
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
- 70% to pass (42/60)
- Multi-select exists (choose 2, choose all that apply)
- Scenario-based questions are common
- Questions assume CSA knowledge (they won't explain what an ACL is)

**Prerequisite:** CSA is required. You can't register for CIS-ITSM without it.

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
    slug: "best-servicenow-practice-tests-2026",
    title: "Best ServiceNow Practice Tests in 2026: A Brutally Honest Comparison",
    description: "Comparing SNReady, ExamTopics, SkillCertPro, Udemy, and Now Learning for ServiceNow certification prep. Which one is actually worth your money?",
    publishedAt: "2026-03-02",
    author: "SNReady Team",
    tags: ["practice tests", "exam prep", "comparison", "certification"],
    featured: true,
    readingTime: 10,
    content: `
Searching for ServiceNow practice tests is a minefield. Brain dump sites mixed with legitimate resources, unclear pricing, and a lot of "trust me bro" advice on Reddit.

I've used or researched every major option. Here's what actually works in 2026.

## TL;DR: The Quick Comparison

| Platform | Ethics | Questions | Mock Exams | Price | Verdict |
|----------|--------|-----------|------------|-------|---------|
| **SNReady** | ✅ | 1,350+ | ✅ | $9/cert | Best overall |
| ExamTopics | ❌ Brain dumps | 1,000+ | ❌ | $40/mo | Risky |
| SkillCertPro | ⚠️ Unclear | 500-600 | ✅ | $15-25 | Budget option |
| Udemy | ✅ | Varies | ❌ | $13-100 | Learning, not practice |
| Now Learning | ✅ | 10-20/course | ❌ | Free | Essential but insufficient |

## 1. SNReady (That's Us — Yes, We're Biased)

**What it is:** Practice test platform built specifically for ServiceNow certifications.

**The honest pitch:**

We built SNReady because the alternatives are either:
- Brain dump sites that risk your certification
- Video courses with minimal practice questions
- Scattered free resources of varying quality

**What you get:**
- 1,350+ questions across 20 certifications
- Timed mock exams matching real conditions
- Domain-based progress tracking
- 35+ free questions per cert (no account required)
- $9 per certification (one-time)

**The weaknesses:**
- No video content (we assume you've done Now Learning)
- Newer platform (fewer reviews than established players)
- Some certifications have fewer questions than others

**Best for:** People who've finished Now Learning courses and need serious exam practice.

[Try Free Questions →](/free-questions)

---

## 2. ExamTopics — The Elephant in the Room

**What it is:** Crowd-sourced "practice tests" where users post questions they remember from real exams.

**Let's be clear:** ExamTopics is a brain dump site. The questions are memorized from actual certification exams and shared. This is:

1. **Against the ServiceNow Certification Agreement** — You agreed not to do this when you registered
2. **Detectable** — ServiceNow monitors for brain dump patterns
3. **Punishable** — Certifications can be revoked

From Reddit:
> "My friend got his CSA revoked 6 months later. They do check."

**The appeal:** Free tier lets you see questions (with ads). Large database. Community voting on answers.

**The problems:**
- Many answers are wrong despite voting
- You're memorizing, not learning
- You're risking your certification and career reputation

**The verdict:** If you use ExamTopics and get caught, you lose your cert AND have to explain the gap in your credentials. The risk isn't worth it.

[Compare: SNReady vs ExamTopics →](/vs/examtopics)

---

## 3. SkillCertPro — The Reddit Favorite

**What it is:** Practice test provider with ServiceNow question banks.

**Why Reddit likes it:**
> "SkillCertPro for $20 and I passed CSA 10 days later"

> "Around half the questions were similar to what I saw on the exam"

**The concerns:**
- Question sourcing isn't transparent
- Some reported incorrect answers
- Interface feels dated
- No domain-based tracking

**Pricing:** $15-25 per certification (lifetime access)

**The verdict:** Budget-friendly and probably fine, but the unclear question sourcing is a yellow flag. It's possible they're using dumps or scraped content.

[Compare: SNReady vs SkillCertPro →](/vs/skillcertpro)

---

## 4. Udemy ServiceNow Courses

**What it is:** Video courses for ServiceNow certifications.

**Best for:** Learning concepts, not practicing for exams.

**Top courses:**
- "ServiceNow CSA Training" (various instructors)
- "ServiceNow Developer Training"

**The reality:**
- Practice questions are an afterthought (maybe 50-100)
- Quality varies wildly by instructor
- No exam simulation
- Content can be outdated

**Pricing:** $13-100 per course (frequent sales)

**The verdict:** Use Udemy to learn concepts. Use dedicated practice test platforms for exam prep. They complement each other.

From Reddit:
> "Udemy resources suck. I get Udemy for free through my company and while I love it for a lot of other things, for ServiceNow it's useless."

[Compare: SNReady vs Udemy →](/vs/udemy)

---

## 5. ServiceNow Now Learning (Official)

**What it is:** ServiceNow's official training platform with required certification courses.

**The mandatory baseline:** You MUST complete Now Learning courses before taking certification exams. This isn't optional.

**What's included:**
- Official course content
- Hands-on labs
- Simulators
- 10-20 knowledge check questions per course

**The limitation:** The practice questions don't simulate exam conditions. There's no timed mock exam. You can't focus on weak areas.

**Pricing:** Free (certification exams cost $210-315)

**The verdict:** Essential for learning, insufficient for practice. Use Now Learning first, then add dedicated practice tests.

[Compare: SNReady vs Now Learning →](/vs/servicenow-nowlearning)

---

## The Winning Strategy for 2026

Based on what actually works:

### Step 1: Now Learning (Required)
Complete the official courses. Do the labs. Read the ebook thoroughly.

### Step 2: Hands-on Practice
Get a PDI (Personal Developer Instance). Practice what you learned.

### Step 3: Dedicated Practice Tests
Use SNReady or similar to:
- Take timed mock exams
- Identify weak domains
- Build exam stamina

### Step 4: Gap Analysis
Review wrong answers. Go back to the ebook for weak areas. Repeat until you're consistently scoring 80%+.

---

## What About Free Options?

**GitHub repositories:** Some exist, but quality varies wildly. Many are outdated or have incorrect answers.

**Quizlet flashcards:** Useful for terminology, not for scenario-based questions.

**Reddit question threads:** Scattered and often quickly deleted (ServiceNow monitors).

**The truth:** Free resources can supplement paid options, but they shouldn't be your primary study method.

---

## My Recommendation (Yes, It's SNReady)

I built SNReady because I went through this process myself and was frustrated by the options:

- Brain dumps felt wrong and risky
- Video courses didn't have enough practice questions
- Now Learning's knowledge checks didn't simulate the real exam
- Free resources were scattered and unreliable

SNReady isn't perfect — we don't have video content, and some certifications have more questions than others. But we offer:

1. **Ethical questions** based on official content (no brain dumps)
2. **Real exam simulation** with timed mock exams
3. **Domain tracking** so you know where to focus
4. **Transparent pricing** at $9 per certification

Try the free questions first. If they help, the paid version has more.

[Try SNReady Free →](/free-questions)

---

## FAQ

**Q: Is ExamTopics safe to use?**

No. It's a brain dump site. ServiceNow can detect patterns and revoke certifications. The risk isn't worth it.

**Q: How many practice questions do I need?**

Quality over quantity. 60-100 well-written questions with good explanations beat 500 questionable dumps.

**Q: Can I pass with just Now Learning?**

The courses give you knowledge. Practice tests give you exam skills. Most successful candidates use both.

**Q: What if I'm on a tight budget?**

Use Now Learning thoroughly (free), do all the labs, and try SNReady's free questions. If you need more, $9 is less than a retake fee.

**Q: When should I take a practice test?**

After completing the official course and doing hands-on practice. Don't use practice tests as your learning tool — use them to test your learning.
`
  },
  {
    slug: "servicenow-certification-requirements-complete-guide",
    title: "ServiceNow Certification Requirements 2026: Complete Guide (Costs, Prerequisites, Steps)",
    description: "Everything you need to know about ServiceNow certification requirements in 2026. Exam costs, prerequisites, formats, and step-by-step registration process.",
    publishedAt: "2026-03-01",
    author: "SNReady Team",
    tags: ["certification", "requirements", "guide", "exam costs"],
    readingTime: 8,
    content: `
Want a ServiceNow certification but confused by the requirements? This guide covers everything: costs, prerequisites, exam formats, and exactly how to register.

## ServiceNow Certification Costs (2026)

| Certification Type | Exam Cost | Retake Cost |
|-------------------|-----------|-------------|
| CSA (System Administrator) | $210 | $210 |
| CAD (Application Developer) | $210 | $210 |
| CIS (Implementation Specialist) | $315 | $315 |
| CTA (Technical Architect) | Varies | Varies |

**Important:** Delta exams (for recertification after new releases) are typically $100-150.

### What's Included

Your exam fee covers:
- One exam attempt
- Online proctoring (Webassessor)
- Digital badge upon passing
- Verification on ServiceNow's website

### What's NOT Included

- Study materials (free via Now Learning)
- Retakes (pay full price again)
- Physical certificate (digital only)

---

## Prerequisites by Certification Type

### CSA (Entry-Level)

**Official prerequisites:** None required.

**Recommended:**
- 6-12 months hands-on ServiceNow experience
- Completion of ServiceNow Fundamentals course
- Access to a PDI (Personal Developer Instance)

**Reality check:** You CAN register without experience, but passing without hands-on time is very difficult.

### CAD (Developer)

**Official prerequisites:** CSA certification required.

**Recommended:**
- 1-2 years development experience
- Strong JavaScript fundamentals
- GlideRecord API familiarity
- Application development experience

### CIS Certifications (Implementation Specialist)

**Official prerequisites:** CSA certification required for most CIS exams.

**Recommended:**
- 1-2 years implementing the specific module
- Real project experience
- Understanding of best practices

### CTA (Technical Architect)

**Official prerequisites:**
- CSA certification
- Two CIS certifications (any)
- Significant project experience

**Format:** Multi-stage assessment including documentation review and presentation.

---

## Exam Formats

### Standard Proctored Exam

Most certifications use this format:

- **Questions:** 60 multiple choice
- **Time:** 90 minutes
- **Passing score:** 70% (42/60)
- **Proctoring:** Online via Webassessor
- **Results:** Immediate (pass/fail)

### Question Types

1. **Single select** — Choose the best answer
2. **Multi-select** — "Choose 2" or "Choose all that apply"
3. **Scenario-based** — Given a situation, what would you do?

---

## Step-by-Step Registration Process

### Step 1: Create a Now Learning Account

Go to [nowlearning.servicenow.com](https://nowlearning.servicenow.com) and create an account.

- Use your business email if available
- Complete your profile

### Step 2: Complete Required Courses

Navigate to the certification you want and check the "Learning Path."

- Complete all required courses
- Watch all videos
- Do all hands-on labs
- Pass knowledge checks

### Step 3: Verify Prerequisites

For CAD/CIS: Ensure your CSA certification is active and linked to your account.

### Step 4: Register for the Exam

1. Go to the Credentials section on Now Learning
2. Find your certification
3. Click "Register for Exam"
4. You'll be redirected to Webassessor
5. Schedule your exam date/time
6. Pay the exam fee

### Step 5: Prepare Your Testing Environment

Online proctoring requirements:
- Quiet, private room
- Webcam and microphone
- Stable internet connection
- Government-issued ID
- Clear desk (no notes, phones, etc.)

---

## Study Timeline Recommendations

### CSA (First Certification)

| Experience Level | Study Time |
|-----------------|------------|
| No SN experience | 8-12 weeks |
| Some platform use | 4-6 weeks |
| Daily SN user | 2-4 weeks |

### CAD (Developer)

| Experience Level | Study Time |
|-----------------|------------|
| No development background | 8-10 weeks |
| JavaScript experience | 4-6 weeks |
| SN development experience | 2-3 weeks |

### CIS (Implementation Specialist)

| Experience Level | Study Time |
|-----------------|------------|
| No module experience | 6-8 weeks |
| Uses module daily | 3-4 weeks |
| Implements the module | 2-3 weeks |

---

## Common Mistakes to Avoid

### 1. Rushing the Registration

Don't register until you've completed the courses AND done hands-on practice. The $210-315 fee isn't refundable.

### 2. Underestimating Hands-On Requirements

Reading the ebook isn't enough. You need to practice in a PDI or sandbox environment.

### 3. Skipping the Labs

Labs teach you WHERE things are in the platform. Many exam questions test navigation, not just concepts.

### 4. Relying on Brain Dumps

ServiceNow monitors for brain dump patterns. Certifications can be revoked. It's not worth the risk.

### 5. Ignoring Delta Exams

Certifications expire with new releases. Budget time and money for delta exams or you'll lose your credentials.

---

## Maintaining Your Certification

### Release Cycle

ServiceNow releases two major versions per year:
- First letter alphabetically (e.g., Xanadu, Yokohama)
- Your cert is tied to a release

### Delta Window

When a new release drops, you have ~3 months to take the delta exam:
- Typically 10-20 questions
- $100-150 cost
- Covers what's new in the release

### What Happens If You Don't Delta

Your certification becomes "inactive." You can still list it on your resume with the release version (e.g., "CSA - Yokohama"), but it won't be current.

---

## Next Steps

1. **Create your Now Learning account** — [nowlearning.servicenow.com](https://nowlearning.servicenow.com)
2. **Complete the required courses** — Don't skip the labs
3. **Practice with a PDI** — [developer.servicenow.com](https://developer.servicenow.com)
4. **Take practice tests** — [SNReady Free Questions →](/free-questions)
5. **Register when ready** — Schedule with buffer time

Good luck!
`
  },
  {
    slug: "how-to-pass-cad-in-30-days",
    title: "How to Pass the ServiceNow CAD Exam in 30 Days: A Realistic Study Plan",
    description: "A week-by-week study plan to pass the ServiceNow Certified Application Developer (CAD) exam in 30 days. Includes daily focus areas and practice strategies.",
    publishedAt: "2026-03-01",
    author: "SNReady Team",
    tags: ["CAD", "study plan", "developer", "certification"],
    readingTime: 9,
    content: `
30 days to CAD certification. Is it realistic? Yes — if you have the right background and follow a structured plan.

## Before You Start: Prerequisites Check

**You need:**
- ✅ Active CSA certification
- ✅ Basic JavaScript knowledge (functions, objects, arrays)
- ✅ ServiceNow platform familiarity
- ✅ 2-3 hours daily study time
- ✅ Access to a PDI (developer.servicenow.com)

**If you're missing JavaScript:** Add 1-2 weeks of JavaScript fundamentals first.

---

## The 30-Day Plan

### Week 1: Scripting Fundamentals (Days 1-7)

**Focus:** GlideRecord API and server-side scripting

**Daily breakdown:**

**Day 1-2:** GlideRecord Basics
- addQuery, get, next, hasNext
- Creating, updating, deleting records
- Building queries with conditions

**Day 3-4:** GlideRecord Advanced
- Encoded queries
- GlideAggregate for counts/sums
- Join queries

**Day 5-6:** Business Rules
- When they fire (before, after, async)
- Current vs previous object
- Script structure and best practices

**Day 7:** Practice + Review
- Build 3 business rules in your PDI
- Take a scripting practice quiz

**Key resources:**
- Now Learning: Scripting in ServiceNow Fundamentals
- PDI hands-on practice

---

### Week 2: Client-Side Scripting (Days 8-14)

**Focus:** Client scripts, UI policies, UI actions

**Daily breakdown:**

**Day 8-9:** Client Scripts
- Types: onLoad, onChange, onSubmit, onCellEdit
- GlideForm (g_form) API
- When to use client vs server scripting

**Day 10-11:** UI Policies
- When UI policies beat client scripts
- Reverse if false
- Script-based conditions

**Day 12-13:** UI Actions
- Client-side vs server-side
- Condition fields
- Confirmation dialogs

**Day 14:** Practice + Review
- Build 5 client scripts for common scenarios
- Take a client-side practice quiz

**Common exam scenarios:**
- "Make a field mandatory when another field equals X"
- "Hide a section based on user role"
- "Show confirmation before closing a task"

---

### Week 3: Application Development (Days 15-21)

**Focus:** Building custom applications

**Daily breakdown:**

**Day 15-16:** Application Scopes
- Global vs scoped applications
- Why scopes matter
- Cross-scope access

**Day 17-18:** Tables and Forms
- Table creation best practices
- Form design patterns
- Related lists

**Day 19-20:** Service Portal Basics
- Widgets and pages
- Angular in Service Portal
- Server/client script communication

**Day 21:** Practice + Review
- Build a simple scoped app in your PDI
- Take an application development practice quiz

---

### Week 4: Integration and Final Prep (Days 22-30)

**Focus:** REST APIs, Script Includes, exam readiness

**Daily breakdown:**

**Day 22-23:** Script Includes
- Creating reusable code
- Calling Script Includes from different contexts
- Scoped Script Includes

**Day 24-25:** REST APIs
- Inbound vs outbound
- REST API Explorer
- Scripted REST APIs

**Day 26:** Flow Designer
- When to use Flow Designer vs scripts
- Actions and triggers
- Debugging flows

**Day 27-28:** Full Practice Exams
- Take timed mock exams
- Review every wrong answer
- Identify weak areas

**Day 29:** Gap Review
- Revisit weak topics
- Re-read ebook sections
- Light practice questions

**Day 30:** Exam Day
- Light review only
- Get good sleep
- Trust your preparation

---

## Key Topics by Exam Weight

Based on the CAD exam blueprint:

| Domain | Weight | Your Priority |
|--------|--------|---------------|
| Scripting | ~25% | High |
| Application Development | ~20% | High |
| Business Rules | ~15% | High |
| REST APIs | ~15% | Medium |
| Client Scripts | ~10% | Medium |
| UI Policies/Actions | ~10% | Medium |
| Script Includes | ~5% | Lower |

---

## Common Pitfalls

### 1. Memorizing Without Understanding

The exam tests whether you know WHEN to use something, not just WHAT it is.

❌ "A Business Rule runs on the server"
✅ "Use a before Business Rule to set field values before the database insert"

### 2. Skipping Hands-On Practice

You'll see questions like:

> "A developer needs to prevent a record from being saved if a field is empty. The requirement must work even if JavaScript is disabled. What should they use?"

If you've never built this in a PDI, you'll struggle to answer quickly.

### 3. Ignoring GlideRecord Syntax

GlideRecord questions are nearly guaranteed. Know the syntax cold:

\`\`\`javascript
var gr = new GlideRecord('incident');
gr.addQuery('state', 1);
gr.query();
while (gr.next()) {
    gs.info(gr.number);
}
\`\`\`

### 4. Confusing Client vs Server Context

Know what's available where:

| Server-Side | Client-Side |
|-------------|-------------|
| GlideRecord | GlideForm (g_form) |
| current | g_user |
| GlideSystem (gs) | GlideAjax |

---

## Exam Day Tips

1. **Time management:** 60 questions in 90 minutes = 1.5 min/question. Flag and move on if stuck.

2. **Read carefully:** "Choose 2" means exactly 2. "All that apply" could be 1-4.

3. **Watch for absolutes:** Answers with "always" or "never" are often wrong.

4. **Trust your first instinct:** If you've prepared, your gut is usually right.

5. **Use elimination:** Remove obviously wrong answers first.

---

## What If I Don't Pass?

It happens. The CAD pass rate isn't published, but anecdotally it's 60-70% on first attempt.

**If you fail:**
1. Review your score report (it shows weak domains)
2. Focus study on those areas
3. Do more hands-on practice
4. Retake in 2-4 weeks

---

## Ready to Start?

[Practice CAD Questions →](/cad/practice-questions)

[Full CAD Study Guide →](/cad)
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
