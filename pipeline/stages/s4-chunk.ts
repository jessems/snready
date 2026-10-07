// S4 Corpus normalize: pages → heading-sized chunks tagged with domains/objectives.
import fs from "node:fs";
import path from "node:path";
import { certFile, hash, log, paths, readJson, writeJsonl } from "../lib/io";
import type { Chunk, CorpusPage, SourceManifest } from "../lib/types";

const MIN_CHARS = 200;
const MAX_CHARS = 3000;

export function chunksFile(cert: string): string {
  return path.join(paths.work, "chunks", `${cert}.jsonl`);
}

/** Split on ## / ### headings, merge tiny sections forward, hard-split oversized ones on paragraphs. */
export function splitMarkdown(markdown: string): Array<{ heading: string; text: string }> {
  const body = markdown.replace(/^---\n[\s\S]*?\n---\n/, "");
  const sections: Array<{ heading: string; text: string }> = [];
  let heading = "";
  let buffer: string[] = [];
  const flush = () => {
    const text = buffer.join("\n").trim();
    if (text) sections.push({ heading, text });
    buffer = [];
  };
  for (const line of body.split("\n")) {
    const match = line.match(/^#{1,3}\s+(.*)/);
    if (match) {
      flush();
      heading = match[1].trim();
    }
    buffer.push(line);
  }
  flush();

  const merged: Array<{ heading: string; text: string }> = [];
  for (const section of sections) {
    const last = merged[merged.length - 1];
    if (last && last.text.length < MIN_CHARS) {
      last.text += "\n\n" + section.text;
    } else merged.push({ ...section });
  }

  return merged.flatMap((section) => {
    if (section.text.length <= MAX_CHARS) return [section];
    const parts: Array<{ heading: string; text: string }> = [];
    let current = "";
    for (const para of section.text.split(/\n\s*\n/)) {
      if (current && current.length + para.length > MAX_CHARS) {
        parts.push({ heading: section.heading, text: current.trim() });
        current = "";
      }
      current += para + "\n\n";
    }
    if (current.trim()) parts.push({ heading: section.heading, text: current.trim() });
    return parts;
  });
}

export function runChunk(cert: string): Chunk[] {
  const corpus = readJson<{ release: string; pages: CorpusPage[] }>(certFile(cert, "corpus.json"));
  const manifest = readJson<SourceManifest>(certFile(cert, "sources.json"));
  const seeds = new Map(manifest.docs.map((d) => [d.subpath, d]));
  const chunks: Chunk[] = [];

  for (const page of corpus.pages) {
    const file = path.join(paths.docsCache(corpus.release), `${page.subpath}.md`);
    if (!fs.existsSync(file)) continue;
    const seed = seeds.get(page.seedSubpath);
    for (const section of splitMarkdown(fs.readFileSync(file, "utf8"))) {
      if (section.text.length < MIN_CHARS) continue;
      chunks.push({
        chunkId: "c_" + hash(page.subpath + "\n" + section.text),
        cert,
        subpath: page.subpath,
        canonicalUrl: page.canonicalUrl,
        pageTitle: page.title,
        heading: section.heading,
        release: corpus.release,
        domainIds: seed?.domainIds ?? [],
        objectiveIds: seed?.objectiveIds ?? [],
        text: section.text,
      });
    }
  }

  writeJsonl(chunksFile(cert), chunks);
  const chars = chunks.reduce((n, c) => n + c.text.length, 0);
  log("s4", `${cert}: ${chunks.length} chunks, ${Math.round(chars / 1000)}k chars`);
  return chunks;
}
