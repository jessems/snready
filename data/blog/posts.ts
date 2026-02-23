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
    slug: "csa-vs-cad-real-talk",
    title: "CSA or CAD First? Real Talk From Someone Who's Done Both",
    description: "Skip the generic advice. Here's the actual decision framework for choosing between ServiceNow CSA and CAD certifications based on your background and goals.",
    publishedAt: "2026-02-22",
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
