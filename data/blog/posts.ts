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
    slug: "servicenow-csa-exam-what-they-dont-tell-you",
    title: "The ServiceNow CSA Exam: What They Don't Tell You",
    description: "Beyond the official exam guide. Real insights on question patterns, time management, and the topics that trip people up on the CSA certification.",
    publishedAt: "2026-02-22",
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
