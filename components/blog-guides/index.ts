// Blog posts whose body is a React component instead of markdown: the
// long-form, sourced guides with inline SVG diagrams. The markdown `content`
// of these posts in data/blog/posts.ts is empty.

import type { ComponentType } from "react";
import { CadGuidePost } from "./CadGuidePost";
import { CsaGuidePost } from "./CsaGuidePost";

export const BLOG_GUIDE_BODIES: Record<string, ComponentType> = {
  "how-to-pass-servicenow-csa-first-time": CsaGuidePost,
  "servicenow-cad-exam-complete-guide-2026": CadGuidePost,
};
