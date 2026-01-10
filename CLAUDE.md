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

This is a Next.js 16 project using the App Router pattern with React 19.

**Directory Structure:**
- `app/` - Next.js App Router directory (routes, layouts, pages)
- `app/layout.tsx` - Root layout with Geist font configuration
- `app/page.tsx` - Home page component
- `app/globals.css` - Global styles with Tailwind CSS
- `public/` - Static assets

**Key Patterns:**
- React Server Components by default (add `"use client"` for client components)
- File-based routing in `app/` directory
- API routes go in `app/api/` directory

## TypeScript Configuration

- Strict mode enabled
- Import alias: `@/*` maps to project root (e.g., `import { Component } from "@/app/components/Component"`)

## Styling

- Tailwind CSS 4.x for all styling
- CSS variables defined in `globals.css` for theming
- Dark mode support via `prefers-color-scheme`

## Deployment

- **Hosting:** Cloudflare Pages
- **Repository:** https://github.com/jessems/snready
- **Deploy:** Push to `main` triggers GitHub Actions workflow (`.github/workflows/deploy.yml`)
- **Secrets required:** `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
