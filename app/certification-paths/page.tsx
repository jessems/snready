import { Metadata } from "next";
import Link from "next/link";
import { TeamByline } from "@/components/TeamByline";
import { BlueprintChart, Callout, Card, GuideSection, In, Misconception, Scenario, SourcesList, Src, Toc } from "@/components/guide/GuideParts";
import { getBlueprint, getCisDfPrerequisiteCerts } from "@/lib/cert-sources";
import { getCertificationBySlug, isCertificationFree, isCertificationReady } from "@/lib/data";
import { authorJsonLd } from "@/lib/author";
import { LAST_REVIEWED_ISO } from "@/lib/site-facts";
import type { SourceKey } from "@/lib/sources";

export const metadata: Metadata = {
  title: "ServiceNow Certification Paths 2026: Which Exam Comes Next",
  description:
    "How ServiceNow certifications fit together in 2026: CSA, CAD and CPOA on the platform side, CIS-Data Foundations as the required gate for seven CIS exams, every blueprint with its heaviest domain, and sourced fees and retake rules.",
  keywords: [
    "ServiceNow certification path",
    "ServiceNow certification list",
    "ServiceNow certification order",
    "which ServiceNow certification first",
    "CIS-DF prerequisite",
  ],
  alternates: {
    canonical: "/certification-paths",
  },
  openGraph: {
    title: "ServiceNow Certification Paths 2026",
    description: "Which ServiceNow certification comes next, with the official blueprints and the CIS-DF prerequisite rule.",
    url: "/certification-paths",
    type: "article",
  },
};

// Tracks are our grouping; prerequisite rules come from cert-sources.csv
// (blueprints and exam registration pages) and the 2026 Community summary.
const PLATFORM_CERTS = ["csa", "cad", "cpoa"];
const OTHER_CIS = ["cis-csm", "cis-fsm", "cis-hr", "cis-em", "cis-rc", "cis-tprm", "cis-spm", "cis-sp", "cis-pa"];

/** cert-sources.csv code ("CIS-Discovery") → site slug ("cis-discovery"). */
function codeToSlug(code: string): string {
  return code.toLowerCase();
}

function PathMapDiagram({ gated }: { gated: string[] }) {
  const gatedNames = gated.map((slug) => getCertificationBySlug(slug)?.name ?? slug.toUpperCase());
  const other = OTHER_CIS.map((slug) => getCertificationBySlug(slug)?.name ?? slug.toUpperCase());
  return (
    <figure className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <svg viewBox="0 0 760 430" role="img" aria-labelledby="paths-map-title" className="h-auto w-full">
        <title id="paths-map-title">ServiceNow certification map: platform exams, the CIS-DF gate, and other CIS exams</title>
        <defs>
          <marker id="paths-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" className="fill-emerald-600" />
          </marker>
        </defs>
        <text x="20" y="28" className="fill-zinc-500 text-[12px] font-bold uppercase tracking-widest">Platform</text>
        {[["CSA", "Administration"], ["CAD", "Application development"], ["CPOA", "Platform ownership"]].map(([name, role], i) => (
          <g key={name}>
            <rect x={20 + i * 160} y="40" width="145" height="58" rx="12" className="fill-sky-50 stroke-sky-400 dark:fill-sky-950/40" />
            <text x={92 + i * 160} y="66" textAnchor="middle" className="fill-sky-950 text-[14px] font-bold dark:fill-sky-100">{name}</text>
            <text x={92 + i * 160} y="85" textAnchor="middle" className="fill-sky-800 text-[11px] dark:fill-sky-300">{role}</text>
          </g>
        ))}
        <text x="20" y="140" className="fill-zinc-500 text-[12px] font-bold uppercase tracking-widest">Data foundations gate</text>
        <rect x="20" y="152" width="200" height="64" rx="12" className="fill-emerald-100 stroke-emerald-600 dark:fill-emerald-950/50" strokeWidth="2" />
        <text x="120" y="180" textAnchor="middle" className="fill-emerald-950 text-[14px] font-bold dark:fill-emerald-100">CIS-DF</text>
        <text x="120" y="199" textAnchor="middle" className="fill-emerald-800 text-[11px] dark:fill-emerald-300">CMDB and CSDM</text>
        {gatedNames.map((name, i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          const x = 290 + col * 118;
          const y = 140 + row * 62;
          return (
            <g key={name}>
              <line x1="220" y1="184" x2={x - 4} y2={y + 22} className="stroke-emerald-600" strokeWidth="1.5" markerEnd="url(#paths-arrow)" />
              <rect x={x} y={y} width="108" height="44" rx="10" className="fill-white stroke-emerald-400 dark:fill-zinc-900" />
              <text x={x + 54} y={y + 27} textAnchor="middle" className="fill-zinc-900 text-[12px] font-semibold dark:fill-zinc-100">{name}</text>
            </g>
          );
        })}
        <text x="20" y="300" className="fill-zinc-500 text-[12px] font-bold uppercase tracking-widest">Other CIS exams (no CIS-DF prerequisite in our source data)</text>
        {other.map((name, i) => {
          const col = i % 5;
          const row = Math.floor(i / 5);
          return (
            <g key={name}>
              <rect x={20 + col * 146} y={312 + row * 56} width="134" height="42" rx="10" className="fill-zinc-50 stroke-zinc-300 dark:fill-zinc-900 dark:stroke-zinc-700" />
              <text x={87 + col * 146} y={338 + row * 56} textAnchor="middle" className="fill-zinc-800 text-[12px] font-semibold dark:fill-zinc-200">{name}</text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
        Arrows show mandatory prerequisites only, from the CIS blueprints and exam registration pages recorded in our source data and the <Src k="examChanges2026">2026 Community summary</Src>. Everything else is a recommended order, not a rule.
      </figcaption>
    </figure>
  );
}

export default function CertificationPathsPage() {
  const gated = getCisDfPrerequisiteCerts().map(codeToSlug);
  const allSlugs = [...PLATFORM_CERTS, "cis-df", ...gated, ...OTHER_CIS];
  const rows = allSlugs
    .map((slug) => {
      const cert = getCertificationBySlug(slug);
      const blueprint = getBlueprint(slug);
      if (!cert || !blueprint || blueprint.domains.length === 0) return null;
      const top = [...blueprint.domains].sort((a, b) => b.weight - a.weight)[0];
      return { slug, cert, blueprint, top, gated: gated.includes(slug) };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);
  const dfBlueprint = getBlueprint("cis-df");

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "ServiceNow Certification Paths 2026: Which Exam Comes Next",
    dateModified: LAST_REVIEWED_ISO,
    author: authorJsonLd(),
    publisher: { "@type": "Organization", name: "SNReady", url: "https://snready.com" },
  };

  const sourceKeys: SourceKey[] = [
    "examChanges2026", "voucherEligibilityThread", "cutScoreThread",
    "csaBlueprint", "cadBlueprint", "cpoaBlueprint", "cisDfBlueprint",
    "docsCmdb", "docsIre", "docsCsdm", "docsAppScope", "docsDomainSeparation",
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <section className="border-b border-zinc-200 bg-gradient-to-b from-emerald-50 to-white py-14 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Certification paths</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl dark:text-white">ServiceNow certification paths in 2026</h1>
          <p className="mt-5 text-xl leading-8 text-zinc-600 dark:text-zinc-300">
            Which exam comes next depends on the layer of the platform you work in. This page maps the certifications to those layers, shows the one hard rule that now shapes the whole CIS track, and lists every blueprint so you can see what each exam really tests.
          </p>
          <TeamByline reviewed={LAST_REVIEWED_ISO} className="mt-5" />
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="py-10">
          <Toc
            items={[
              ["#map", "The map: platform, gate, specialisms"],
              ["#layers", "How the certifications fit the platform"],
              ["#blueprints", "Every blueprint at a glance"],
              ["#scenarios", "Paths for real roles"],
              ["#misconceptions", "Common misconceptions"],
              ["#logistics", "Fees, booking and retakes"],
              ["#practice", "Start practising"],
              ["#sources", "Sources"],
            ]}
          />
        </div>

        <GuideSection id="map" eyebrow="The map" title="Platform exams, the CIS-DF gate, and the specialisms">
          <p>
            ServiceNow&apos;s certifications fall into three groups. The <strong>platform exams</strong> (CSA, CAD and CPOA) test how the platform itself is administered, extended and owned. <strong>CIS-Data Foundations</strong> tests the CMDB and CSDM. The <strong>other CIS exams</strong> test the implementation of specific products.
          </p>
          <PathMapDiagram gated={gated} />
          <p>
            The rule that matters most in 2026: several CIS certifications now require CIS-DF as a mandatory prerequisite, and you must pass CIS-DF before attempting them (<Src k="examChanges2026">ServiceNow Community, Jan 2026</Src>). Our blueprint data lists those exams as {gated.map((slug) => getCertificationBySlug(slug)?.name ?? slug).join(", ")}. If any of them is your goal, CIS-DF is your next exam.
          </p>
        </GuideSection>

        <GuideSection id="layers" eyebrow="Mental model" title="How the certifications fit the platform">
          <p>
            A useful way to choose is to ask which layer of the platform you spend your week in. Each certification&apos;s blueprint concentrates on one of them.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <Card title="Configure the platform: CSA">
              <p>
                The CSA blueprint&apos;s largest domain is Database Management and Platform Security at 30%, covering data schema, access control, importing data, CMDB and CSDM (<Src k="csaBlueprint">CSA blueprint</Src>). Read the <In href="/csa">CSA exam overview</In>.
              </p>
            </Card>
            <Card title="Build on the platform: CAD">
              <p>
                CAD weights application design, UI, security and automation at 20% each (<Src k="cadBlueprint">CAD blueprint</Src>), all built around application scope, which restricts access to an app&apos;s files and data (<Src k="docsAppScope">Application scope</Src>). Read the <In href="/cad">CAD exam overview</In>.
              </p>
            </Card>
            <Card title="Govern the data: CIS-DF">
              <p>
                CIS-DF gives Govern 35% (<Src k="cisDfBlueprint">CIS-DF blueprint</Src>). It is about which sources may write to the CMDB, which IRE controls (<Src k="docsIre">IRE</Src>), and the CSDM model products share (<Src k="docsCsdm">CSDM</Src>). Read the <In href="/cis-df">CIS-Data Foundations exam overview</In>.
              </p>
            </Card>
            <Card title="Own the platform: CPOA">
              <p>
                CPOA spreads across Strategy, People, Process, Technology, Data and ServiceNow Governance, with Technology the largest at 22.9% (<Src k="cpoaBlueprint">CPOA blueprint</Src>). Read the <In href="/cpoa">CPOA exam overview</In>.
              </p>
            </Card>
          </div>
          <p>
            Why does CIS-DF sit under so many specialisms? Because ITSM, asset management, Discovery, Service Mapping and the security products all depend on CMDB data. The CMDB is where configuration items and their relationships live, populated by Discovery, integrations, imports or by hand (<Src k="docsCmdb">CMDB</Src>). A specialist who can&apos;t reason about that data will struggle with the products built on it.
          </p>
          {dfBlueprint && <BlueprintChart blueprint={dfBlueprint} sourceKey="cisDfBlueprint" showObjectives={false} />}
        </GuideSection>

        <GuideSection id="blueprints" eyebrow="Reference" title="Every blueprint at a glance">
          <p>
            Each row links to the official blueprint on Now Learning (sign-in required) and to our overview where we have one. &ldquo;Heaviest domain&rdquo; is the single largest weight in that blueprint.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Certification</th>
                  <th className="px-4 py-3 font-semibold">Blueprint</th>
                  <th className="px-4 py-3 font-semibold">Heaviest domain</th>
                  <th className="px-4 py-3 font-semibold">CIS-DF first?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 text-zinc-700 dark:divide-zinc-800 dark:text-zinc-300">
                {rows.map((row) => (
                  <tr key={row.slug}>
                    <td className="px-4 py-3">
                      <Link href={`/${row.slug}`} className="font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-2 dark:text-emerald-300">
                        {row.cert.name}
                      </Link>
                      <span className="block text-xs text-zinc-500">{row.cert.fullName}</span>
                    </td>
                    <td className="px-4 py-3">
                      <a href={row.blueprint.url} target="_blank" rel="noopener noreferrer" className="underline decoration-zinc-300 underline-offset-2 hover:text-emerald-700">
                        {row.blueprint.kb}
                      </a>
                      <span className="block text-xs text-zinc-500">updated {row.blueprint.updated}</span>
                    </td>
                    <td className="px-4 py-3">{row.top.name} ({row.top.weight}%)</td>
                    <td className="px-4 py-3">{row.gated ? <span className="font-semibold text-emerald-700 dark:text-emerald-300">Required</span> : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Blueprint numbers, dates and weights come from our transcription of the official blueprints (data/cert-sources). The Certified Technical Architect programme isn&apos;t listed because we don&apos;t have a sourced blueprint for it.
          </p>
        </GuideSection>

        <GuideSection id="scenarios" eyebrow="Worked paths" title="Paths for real roles">
          <p>
            These are illustrative roles, not rules. Fees are the 2026 figures from the <Src k="examChanges2026">Community summary</Src>: $300 for CSA or CAD and $450 for each CIS exam, excluding tax, assuming a first-time pass.
          </p>
          <div className="space-y-6">
            <Scenario
              industry="Healthcare"
              title="A hospital service-desk administrator who will own incident and change"
              situation="The administrator configures forms and catalog items today and is being asked to lead an ITSM redesign."
              reasoning={<>CSA builds the platform foundation; CIS-ITSM is the product exam, and it requires CIS-DF first (<Src k="examChanges2026">source</Src>). Path: CSA → CIS-DF → CIS-ITSM, $1,200 in exam fees. See the <In href="/cis-itsm">CIS-ITSM overview</In>.</>}
              examAngle="Planning CIS-DF in, not discovering the prerequisite at registration."
            />
            <Scenario
              industry="Banking"
              title="A developer building internal tools on the platform"
              situation="The developer writes scripts and builds small applications for operations teams."
              reasoning={<>CAD&apos;s blueprint is about scoped application design, UI, security and automation (<Src k="cadBlueprint">source</Src>). CSA first gives the platform vocabulary. Path: CSA → CAD, $600 in exam fees.</>}
              examAngle="Choosing the developer track when the job is building, not configuring."
            />
            <Scenario
              industry="Telecom"
              title="An operations engineer responsible for the CMDB and service maps"
              situation="The team runs Discovery and wants trustworthy application service maps for incident impact."
              reasoning={<>CIS-Discovery and CIS-SM both require CIS-DF (<Src k="examChanges2026">source</Src>), and both rely on the CMDB data CIS-DF governs. Path: CSA → CIS-DF → CIS-Discovery and/or CIS-SM. Our <In href="/courses/service-mapping">Service Mapping course for architects</In> covers the design side.</>}
              examAngle="Seeing CIS-DF as the foundation of the ITOM track."
            />
            <Scenario
              industry="Shared services"
              title="A platform owner running ServiceNow for several business units"
              situation="The role is about roadmap, demand, upgrades, licensing and value, and possibly separating business units' data."
              reasoning={<>CPOA&apos;s blueprint covers exactly that spread (<Src k="cpoaBlueprint">source</Src>), and domain separation is how a service provider splits data and processes into domains (<Src k="docsDomainSeparation">source</Src>). Path: CSA → CPOA.</>}
              examAngle="Choosing the operating-model exam over another product exam."
            />
            <Scenario
              industry="Retail"
              title="A customer service lead implementing case management"
              situation="The lead is moving customer support onto Customer Service Management."
              reasoning={<>CIS-CSM is the product exam, and our blueprint data lists no CIS-DF prerequisite for it. Path: CSA → CIS-CSM, $750 in exam fees. See the <In href="/cis-csm">CIS-CSM overview</In>.</>}
              examAngle="Knowing which CIS exams are gated and which aren't."
            />
          </div>
        </GuideSection>

        <GuideSection id="misconceptions" eyebrow="Misconceptions" title="Common path misconceptions">
          <div className="grid gap-4 md:grid-cols-2">
            <Misconception myth="&ldquo;CIS-DF is only for CMDB specialists.&rdquo;">
              It is a mandatory prerequisite for CIS-ITSM, CIS-HAM, CIS-SAM, CIS-Discovery, CIS-SM, CIS-VR and CIS-SIR (<Src k="examChanges2026">source</Src>).
            </Misconception>
            <Misconception myth="&ldquo;A course gives you a free voucher.&rdquo;">
              Vouchers no longer exist. On-demand courses are free but don&apos;t include an attempt; instructor-led training includes one (<Src k="examChanges2026">source</Src>).
            </Misconception>
            <Misconception myth="&ldquo;Every exam needs 70%.&rdquo;">
              ServiceNow doesn&apos;t publish cut scores; each exam is scored against a predetermined, unshared cut score (<Src k="cutScoreThread">source</Src>).
            </Misconception>
            <Misconception myth="&ldquo;You can retake straight away.&rdquo;">
              Waits are 3 days, then 30 days, then 6 months between attempts (<Src k="examChanges2026">source</Src>).
            </Misconception>
          </div>
        </GuideSection>

        <GuideSection id="logistics" eyebrow="Logistics" title="Fees, booking and retakes">
          <ul className="list-disc space-y-3 pl-6">
            <li>Register and pay in ServiceNow University; schedule through Pearson VUE with SSO (<Src k="examChanges2026">source</Src>).</li>
            <li>Exam fees: CSA, CAD and CAS $300; every CIS exam $450. Retakes: CSA, CAD and CPOA $150; CIS $225. All USD excluding tax (<Src k="examChanges2026">source</Src>).</li>
            <li>Instructor-led training: $1,900 (2 days) or $2,700 (3 days), first attempt included. On-demand courses: free, exam bought separately (<Src k="examChanges2026">source</Src>).</li>
            <li>Partner employers can provide learning credits (<Src k="voucherEligibilityThread">source</Src>).</li>
            <li>Take the exam within 90 days of registering; payments are non-refundable (<Src k="examChanges2026">source</Src>).</li>
          </ul>
          <Callout title="Budgeting a path">
            <p>
              Add up the exams on your path, then add one retake per exam as a contingency. The <In href="/blog/servicenow-certification-cost-2026">ServiceNow certification cost guide</In> has worked examples.
            </p>
          </Callout>
        </GuideSection>

        <GuideSection id="practice" eyebrow="Practice" title="Start practising for your next exam">
          <p>
            Pick the next exam on your path and try its questions. Every CSA question is free.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {["csa", "cis-df", "cad", "cpoa", "cis-itsm", "cis-csm"].filter((slug) => isCertificationReady(slug)).map((slug) => {
              const cert = getCertificationBySlug(slug);
              if (!cert) return null;
              return (
                <li key={slug}>
                  <Link href={`/${slug}/practice-questions`} className="block rounded-xl border border-zinc-200 bg-white p-4 font-semibold text-zinc-900 hover:border-emerald-300 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100">
                    {isCertificationFree(slug) ? `Free ${cert.name} practice questions` : `${cert.name} practice questions`}
                  </Link>
                </li>
              );
            })}
          </ul>
        </GuideSection>

        <SourcesList keys={sourceKeys} />
      </div>
    </>
  );
}
