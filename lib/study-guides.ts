import fs from "node:fs";
import path from "node:path";
import { getCertificationSlugs } from "@/lib/data";

/**
 * Certs with a hand-written study guide (app/{cert}/study-guide/page.tsx).
 * Server-only: reads the app directory at build time.
 */
export function getStudyGuideSlugs(): string[] {
  const appDir = path.join(process.cwd(), "app");
  return getCertificationSlugs().filter((slug) =>
    fs.existsSync(path.join(appDir, slug, "study-guide", "page.tsx"))
  );
}
