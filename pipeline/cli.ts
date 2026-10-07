#!/usr/bin/env npx tsx
// Question generation pipeline CLI. See pipeline/README.md and docs/question-pipeline.md.
//   npx tsx pipeline/cli.ts <command> --cert=csa [--domain=csa.d5] [--limit=N]
import { runBlueprint } from "./stages/s1-blueprint";
import { runSources } from "./stages/s2-sources";
import { runScrapeDocs } from "./stages/s3-scrape-docs";
import { runChunk } from "./stages/s4-chunk";
import { runFactIngest, runFactPackets } from "./stages/s5-facts";
import { runSamples } from "./stages/s6a-samples";
import { runObserved } from "./stages/s7-observed";
import { acceptArchetype, runClassifyIngest, runClassifyPackets, runDistribution } from "./stages/s8-analysis";
import { runTemplateIngest, runTemplatePackets } from "./stages/s8b-templates";
import { runObservedPlan, runPlan } from "./stages/s9-plan";
import { runGroundIngest, runGroundPackets } from "./stages/s8f-ground";
import { runInstantiate } from "./stages/s10-instantiate";
import { runWriteIngest, runWritePackets } from "./stages/s11-write";
import { runPublish, runReview } from "./stages/s13-publish";
import { acceptTemplate, runParameterizeIngest, runParameterizePackets } from "./stages/s8e-parameterize";
import { packetStatus } from "./lib/packets";

type Args = { cert: string; domain?: string; limit?: number; id?: string; target?: number; write?: boolean; variants?: number; restructures?: number };
type Command = { stage: string; describe: string; run: (args: Args) => unknown };

const commands: Record<string, Command> = {
  blueprint: { stage: "S1", describe: "cert-sources.csv → blueprint.json", run: ({ cert }) => runBlueprint(cert) },
  sources: { stage: "S2", describe: "blueprint → doc seeds (+ docs search for uncovered objectives)", run: ({ cert }) => runSources(cert) },
  "scrape-docs": { stage: "S3a", describe: "crawl doc seeds from the markdown mirror", run: ({ cert }) => runScrapeDocs(cert) },
  chunk: { stage: "S4", describe: "pages → tagged chunks", run: ({ cert }) => runChunk(cert) },
  "facts:packets": { stage: "S5", describe: "chunks → fact-extraction packets [--domain= --limit=]", run: ({ cert, domain, limit }) => runFactPackets(cert, { domain, limit }) },
  "facts:ingest": { stage: "S5", describe: "validate packet outputs → facts.json", run: ({ cert }) => runFactIngest(cert) },
  samples: { stage: "S6a", describe: "official sample items from cached blueprints → quarantine samples [--cert=all]", run: ({ cert }) => runSamples(cert) },
  observed: { stage: "S7", describe: "bank + samples + dumps → quarantined observed corpus", run: ({ cert }) => runObserved(cert) },
  "classify:packets": { stage: "S8a", describe: "observed items → classification packets (quarantine)", run: ({ cert }) => runClassifyPackets(cert) },
  "classify:ingest": { stage: "S8a", describe: "classifications + archetype proposals", run: ({ cert }) => runClassifyIngest(cert) },
  "archetypes:accept": {
    stage: "S8a",
    describe: "move a reviewed proposal into the archetype registry --id=",
    run: ({ cert, id }) => acceptArchetype(cert, id ?? ""),
  },
  "templates:packets": { stage: "S8b", describe: "archetypes + observed examples → template packet (quarantine)", run: ({ cert }) => runTemplatePackets(cert.split(",")) },
  "templates:ingest": { stage: "S8b", describe: "validate templates → data/pipeline/templates.json", run: () => runTemplateIngest() },
  distribution: { stage: "S8c", describe: "classifications → distribution.json", run: ({ cert }) => runDistribution(cert) },
  "parameterize:packets": { stage: "S8e", describe: "classified items → template + bindings packets (quarantine)", run: ({ cert }) => runParameterizePackets(cert) },
  "parameterize:ingest": { stage: "S8e", describe: "check mappings → parameterization.json (+ template proposals)", run: ({ cert }) => runParameterizeIngest(cert) },
  "templates:accept": { stage: "S8e", describe: "promote a proposed template --id=", run: ({ id }) => acceptTemplate(id ?? "") },
  "ground:packets": { stage: "S8f", describe: "official items → docs-grounding packets (quarantine)", run: ({ cert }) => runGroundPackets(cert) },
  "ground:ingest": { stage: "S8f", describe: "validate docs facts for official items, link them", run: ({ cert }) => runGroundIngest(cert) },
  "plan:observed": {
    stage: "S9",
    describe: "derive from official items: --variants=N same template, --restructures=M same fact",
    run: ({ cert, variants, restructures }) => runObservedPlan(cert, { variants: variants ?? 2, restructures: restructures ?? 2 }),
  },
  plan: { stage: "S9", describe: "weights × distribution × available facts → plan.json [--target=60]", run: ({ cert, target }) => runPlan(cert, target ?? 60) },
  instantiate: { stage: "S10", describe: "plan → deterministic drafts.json", run: ({ cert }) => runInstantiate(cert) },
  "write:packets": { stage: "S11", describe: "drafts → writer packets", run: ({ cert }) => runWritePackets(cert) },
  "write:ingest": { stage: "S12", describe: "validate written questions → generated.json", run: ({ cert }) => runWriteIngest(cert) },
  review: { stage: "S13", describe: "generated.json → review.md", run: ({ cert }) => runReview(cert) },
  publish: { stage: "S13", describe: "generated → data/questions via topic-map.json [--write]", run: ({ cert, write }) => runPublish(cert, Boolean(write)) },
  status: {
    stage: "-",
    describe: "agent packet status per stage",
    run: ({ cert }) => {
      for (const stage of ["facts", "classify", "templates", "parameterize", "ground", "write"]) {
        const { pending, done } = packetStatus(stage, stage === "templates" ? "all" : cert);
        if (pending.length || done.length) console.log(`${stage.padEnd(10)} done ${done.length}, pending ${pending.length}: ${pending.join(" ")}`);
      }
    },
  },
};

function parseArgs(argv: string[]): { command: string; args: Args } {
  const [command, ...rest] = argv;
  const flags = Object.fromEntries(
    rest.filter((a) => a.startsWith("--")).map((a) => {
      const [key, value] = a.slice(2).split("=");
      return [key, value ?? "true"];
    })
  );
  return {
    command,
    args: {
      cert: flags.cert ?? "csa",
      domain: flags.domain,
      limit: flags.limit ? Number(flags.limit) : undefined,
      id: flags.id,
      target: flags.target ? Number(flags.target) : undefined,
      write: flags.write === "true",
      variants: flags.variants ? Number(flags.variants) : undefined,
      restructures: flags.restructures ? Number(flags.restructures) : undefined,
    },
  };
}

async function main() {
  const { command, args } = parseArgs(process.argv.slice(2));
  const entry = commands[command];
  if (!entry) {
    console.log("Usage: npx tsx pipeline/cli.ts <command> --cert=<slug>\n");
    for (const [name, c] of Object.entries(commands)) console.log(`  ${name.padEnd(22)} ${c.stage.padEnd(5)} ${c.describe}`);
    process.exit(command ? 1 : 0);
  }
  await entry.run(args);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
