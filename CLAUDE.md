# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Run production server
npm run lint     # Run ESLint
```

## Architecture

This is a Next.js 16 project using the App Router pattern with React 19. It's a ServiceNow certification practice test platform (SNReady).

**Data Layer:**
- `data/certifications.json` - All certification metadata (25+ ServiceNow certs)
- `data/topics/[cert]-topics.json` - Topic definitions per certification (currently only CSA)
- `data/questions/[cert]/[topic].json` - Question banks per topic (JSON with `isFree` flag)
- `lib/data.ts` - Central data access layer with helpers for certifications, topics, questions

**Key Data Flow:**
Questions are dynamically imported via `getQuestionsForTopic(certSlug, topicSlug)` which loads from `@/data/questions/{cert}/{topic}.json`. The `isFree` flag determines free vs premium content.

**Route Structure:**
- `/` - Homepage with certification grid
- `/certifications/[slug]` - Certification detail page
- `/[certification]/questions/[topic]` - Topic question list
- `/[certification]/questions/[topic]/[questionId]` - Individual question page
- `/certifications/category/[category]` - Category landing pages
- `/compare/[slug]` - Certification comparison pages

**Components:**
- `components/Quiz*.tsx` - Quiz engine (Quiz, QuizQuestion, QuizProgress, QuizNavigation, QuizResults)
- `components/CertificationCard.tsx` - Certification display card with readiness status
- `components/QuestionCard.tsx` - Individual question display

**Types:**
- `types/index.ts` - Main types (Certification, Topic, Question, CertificationCategory)
- `types/quiz.ts` - Legacy quiz types (being migrated)

## Adding New Certifications

1. Add certification metadata to `data/certifications.json`
2. Create topics file: `data/topics/[cert-slug]-topics.json`
3. Add questions: `data/questions/[cert-slug]/[topic-slug].json`
4. Register topics in `lib/data.ts` topicsMap

## TypeScript Configuration

- Strict mode enabled
- Import alias: `@/*` maps to project root (e.g., `import { Component } from "@/components/Component"`)

## Styling

- Tailwind CSS 4.x for all styling
- CSS variables defined in `globals.css` for theming
- Dark mode support via `prefers-color-scheme`
- Primary color: emerald (buttons, accents)

## Deployment

- **Hosting:** Cloudflare Pages (static export)
- **Repository:** https://github.com/jessems/snready
- **Deploy:** Push to `main` triggers GitHub Actions workflow (`.github/workflows/deploy.yml`)
- **Secrets required:** `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
