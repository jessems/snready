// Long-form, sourced section of the /cis-df hub. Every product behaviour or
// exam fact links to a source in lib/sources.ts.

import { BlueprintChart, Callout, Card, GuideSection, In, Misconception, Scenario, SourcesList, Src, Toc } from "@/components/guide/GuideParts";
import { ExamLogistics, logisticsSourceKeys } from "@/components/guide/ExamLogistics";
import { StudyCluster } from "@/components/guide/StudyCluster";
import { getBlueprint, getCisDfPrerequisiteCerts } from "@/lib/cert-sources";
import type { SourceKey } from "@/lib/sources";

function DataPipelineDiagram() {
  const sources = ["Discovery", "IntegrationHub ETL", "Import sets", "External CMDB", "Manual entry"];
  return (
    <figure className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <svg viewBox="0 0 760 300" role="img" aria-labelledby="df-pipeline-title" className="h-auto w-full">
        <title id="df-pipeline-title">How data flows into, through and out of the CMDB, mapped to the CIS-DF domains</title>
        {sources.map((source, i) => (
          <g key={source}>
            <rect x="10" y={20 + i * 52} width="150" height="40" rx="10" className="fill-sky-50 stroke-sky-400 dark:fill-sky-950/40" />
            <text x="85" y={45 + i * 52} textAnchor="middle" className="fill-sky-900 text-[12px] font-semibold dark:fill-sky-200">{source}</text>
            <line x1="160" y1={40 + i * 52} x2="200" y2="150" className="stroke-zinc-300 dark:stroke-zinc-600" strokeWidth="1.5" />
          </g>
        ))}
        <rect x="200" y="105" width="130" height="90" rx="14" className="fill-violet-100 stroke-violet-400 dark:fill-violet-950/40" strokeWidth="1.5" />
        <text x="265" y="140" textAnchor="middle" className="fill-violet-900 text-[14px] font-bold dark:fill-violet-200">IRE</text>
        <text x="265" y="160" textAnchor="middle" className="fill-violet-900 text-[11px] dark:fill-violet-300">identify +</text>
        <text x="265" y="175" textAnchor="middle" className="fill-violet-900 text-[11px] dark:fill-violet-300">reconcile</text>
        <line x1="330" y1="150" x2="370" y2="150" className="stroke-zinc-500" strokeWidth="2" />
        <rect x="370" y="85" width="150" height="130" rx="14" className="fill-emerald-100 stroke-emerald-500 dark:fill-emerald-950/40" strokeWidth="1.5" />
        <text x="445" y="125" textAnchor="middle" className="fill-emerald-900 text-[15px] font-bold dark:fill-emerald-200">CMDB</text>
        <text x="445" y="148" textAnchor="middle" className="fill-emerald-900 text-[11px] dark:fill-emerald-300">classes (CI Class</text>
        <text x="445" y="164" textAnchor="middle" className="fill-emerald-900 text-[11px] dark:fill-emerald-300">Manager), CIs,</text>
        <text x="445" y="180" textAnchor="middle" className="fill-emerald-900 text-[11px] dark:fill-emerald-300">relationships</text>
        <line x1="520" y1="120" x2="570" y2="80" className="stroke-zinc-500" strokeWidth="2" />
        <line x1="520" y1="180" x2="570" y2="220" className="stroke-zinc-500" strokeWidth="2" />
        <rect x="570" y="30" width="180" height="90" rx="14" className="fill-amber-50 stroke-amber-400 dark:fill-amber-950/40" />
        <text x="660" y="58" textAnchor="middle" className="fill-amber-900 text-[14px] font-bold dark:fill-amber-200">Govern</text>
        <text x="660" y="80" textAnchor="middle" className="fill-amber-900 text-[11px] dark:fill-amber-300">Health, Data Manager,</text>
        <text x="660" y="96" textAnchor="middle" className="fill-amber-900 text-[11px] dark:fill-amber-300">de-duplication</text>
        <rect x="570" y="180" width="180" height="90" rx="14" className="fill-rose-50 stroke-rose-300 dark:fill-rose-950/40" />
        <text x="660" y="210" textAnchor="middle" className="fill-rose-900 text-[14px] font-bold dark:fill-rose-200">Insight</text>
        <text x="660" y="232" textAnchor="middle" className="fill-rose-900 text-[11px] dark:fill-rose-300">queries, maps,</text>
        <text x="660" y="248" textAnchor="middle" className="fill-rose-900 text-[11px] dark:fill-rose-300">reporting</text>
        <text x="85" y="292" textAnchor="middle" className="fill-zinc-500 text-[11px] font-semibold">Ingest (19%)</text>
        <text x="265" y="225" textAnchor="middle" className="fill-zinc-500 text-[11px] font-semibold">Configuration (15%)</text>
        <text x="445" y="240" textAnchor="middle" className="fill-zinc-500 text-[11px] font-semibold">CSDM shapes the model (11%)</text>
        <text x="660" y="140" textAnchor="middle" className="fill-zinc-500 text-[11px] font-semibold">35%</text>
        <text x="660" y="290" textAnchor="middle" className="fill-zinc-500 text-[11px] font-semibold">20%</text>
      </svg>
      <figcaption className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
        Population methods from the <Src k="docsCmdb">CMDB documentation</Src>; domain weights from the <Src k="cisDfBlueprint">CIS-DF blueprint</Src>. A mental model, not an official diagram.
      </figcaption>
    </figure>
  );
}

function HealthTreeDiagram() {
  const kpis = [
    { x: 20, title: "Correctness", metrics: ["Orphan", "Stale", "Duplicate"] },
    { x: 270, title: "Completeness", metrics: ["Required fields", "Recommended fields"] },
    { x: 520, title: "Compliance", metrics: ["Audit results"] },
  ];
  return (
    <figure className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <svg viewBox="0 0 740 250" role="img" aria-labelledby="df-health-title" className="h-auto w-full">
        <title id="df-health-title">CMDB Health KPIs and their metrics</title>
        <rect x="270" y="10" width="200" height="44" rx="12" className="fill-zinc-900 dark:fill-zinc-100" />
        <text x="370" y="38" textAnchor="middle" className="fill-white text-[14px] font-bold dark:fill-zinc-900">CMDB Health</text>
        {kpis.map((kpi) => (
          <g key={kpi.title}>
            <line x1="370" y1="54" x2={kpi.x + 100} y2="90" className="stroke-zinc-400" strokeWidth="1.5" />
            <rect x={kpi.x} y="90" width="200" height="40" rx="10" className="fill-emerald-100 stroke-emerald-500 dark:fill-emerald-950/40" />
            <text x={kpi.x + 100} y="115" textAnchor="middle" className="fill-emerald-900 text-[13px] font-bold dark:fill-emerald-200">{kpi.title}</text>
            {kpi.metrics.map((metric, i) => (
              <g key={metric}>
                <rect x={kpi.x + 20} y={145 + i * 34} width="160" height="28" rx="8" className="fill-zinc-50 stroke-zinc-300 dark:fill-zinc-900 dark:stroke-zinc-700" />
                <text x={kpi.x + 100} y={164 + i * 34} textAnchor="middle" className="fill-zinc-700 text-[12px] dark:fill-zinc-300">{metric}</text>
              </g>
            ))}
          </g>
        ))}
      </svg>
      <figcaption className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
        KPIs and metrics as listed in <Src k="docsCmdbHealth">CMDB Health KPIs and metrics</Src>. Relationship health (duplicate, orphan and stale relationships) is reported separately.
      </figcaption>
    </figure>
  );
}

function CsdmDomainsDiagram() {
  const phases = ["Ideation & Strategy", "Design & Planning", "Build & Integration", "Service Delivery", "Service Consumption"];
  return (
    <figure className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <svg viewBox="0 0 740 170" role="img" aria-labelledby="df-csdm-title" className="h-auto w-full">
        <title id="df-csdm-title">CSDM domains along the service life cycle, resting on the Foundation domain</title>
        {phases.map((phase, i) => (
          <g key={phase}>
            <path d={`M${10 + i * 146} 20 h126 l14 30 l-14 30 h-126 l14 -30 z`} className="fill-emerald-100 stroke-emerald-500 dark:fill-emerald-950/40" />
            <text x={80 + i * 146} y="55" textAnchor="middle" className="fill-emerald-900 text-[11.5px] font-semibold dark:fill-emerald-200">{phase}</text>
          </g>
        ))}
        <rect x="10" y="105" width="720" height="50" rx="12" className="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-900" />
        <text x="370" y="128" textAnchor="middle" className="fill-zinc-900 text-[13px] font-bold dark:fill-zinc-100">Foundation</text>
        <text x="370" y="146" textAnchor="middle" className="fill-zinc-600 text-[11px] dark:fill-zinc-400">companies, locations, groups, users, products, life-cycle values</text>
      </svg>
      <figcaption className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
        Domains and Foundation contents from <Src k="docsCsdmFoundation">Foundation domain in the CSDM model</Src>.
      </figcaption>
    </figure>
  );
}

export function CisDfDeepDive() {
  const blueprint = getBlueprint("cis-df");
  const prerequisiteFor = getCisDfPrerequisiteCerts();
  const sourceKeys: SourceKey[] = [
    "cisDfBlueprint", "welcomeCourse", "adminFundamentalsCourse", "platformImplementationCourse", "cmdbFundamentalsCourse", "cmdbHealthDeepDiveCourse",
    "docsCmdb", "docsCiClassManager", "docsIre", "docsCmdbHealth", "docsDataManager", "docsDedup", "docsCsdm", "docsCsdmFoundation",
    ...logisticsSourceKeys("cis-df"),
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="py-10">
        <Toc
          items={[
            ["#df-blueprint", "What the CIS-DF exam tests"],
            ["#df-architecture", "How CMDB data fits together"],
            ["#df-scenarios", "Worked industry scenarios"],
            ["#df-misconceptions", "Common misconceptions"],
            ["#df-logistics", "Exam logistics and prerequisites"],
            ["#df-practice", "Practice questions"],
            ["#sources", "Sources"],
          ]}
        />
        <p className="mt-8 text-lg leading-8 text-zinc-700 dark:text-zinc-300">
          CIS-Data Foundations is an exam about trust. Anyone can load configuration items into a CMDB; the hard part is deciding which source is allowed to say what, keeping the data correct as the estate changes, and shaping it so other teams can use it. That is why the exam&apos;s heaviest domain is Govern, not Ingest. This page explains how the pieces connect, from data sources through identification and reconciliation to health and CSDM, and why it now matters for the whole CIS track.
        </p>
      </div>

      <GuideSection id="df-blueprint" eyebrow="Blueprint" title="What the CIS-DF exam tests">
        <p>
          The <Src k="cisDfBlueprint">CIS-Data Foundations blueprint (KB0012913, updated November 2025)</Src> has five domains:
        </p>
        {blueprint && <BlueprintChart blueprint={blueprint} sourceKey="cisDfBlueprint" />}
        <p>
          Govern alone is 35%: the six metrics behind the CMDB health score, Data Manager, the goals of CMDB governance and the roles involved. Insight (20%) covers the business value of the CMDB and how to query it. Ingest (19%) is about choosing an ingestion method and avoiding technical debt. Configuration (15%) is CI Class Manager, IRE and multisource CMDB. CSDM Fundamentals (11%) closes it out. A candidate who passed in February 2026 wrote on the ServiceNow Community that CSDM shouldn&apos;t be skipped just because its weight is low (<Src k="cisDfExperience">source</Src>).
        </p>
        <p>
          Recommended courses on the blueprint include <Src k="platformImplementationCourse">ServiceNow Platform Implementation</Src>, <Src k="cmdbFundamentalsCourse">CMDB Fundamentals</Src> and <Src k="cmdbHealthDeepDiveCourse">CMDB Health Deep Dive</Src>, alongside the CMDB simulators listed on the credential path.
        </p>
      </GuideSection>

      <GuideSection id="df-architecture" eyebrow="Mental model" title="How CMDB data fits together">
        <DataPipelineDiagram />
        <p>
          <strong>Many doors in.</strong> CIs can arrive through Discovery, IntegrationHub ETL or import sets for third-party data, integration with an external CMDB, or manual entry (<Src k="docsCmdb">CMDB</Src>). Ingest questions are usually about choosing between those doors and keeping the result upgradeable.
        </p>
        <p>
          <strong>One gatekeeper.</strong> The Identification and Reconciliation Engine applies identification rules, reconciliation rules and data source rules to incoming data before it reaches the CMDB. It works by allowing only authoritative data sources to write, updates a CI only if the incoming last-discovered time is newer than the one stored, identifies dependent CIs within their parent&apos;s context, and holds incomplete payloads as partial payloads until matching data arrives, deleting them after 90 days (<Src k="docsIre">IRE</Src>).
        </p>
        <p>
          <strong>Classes define the shape.</strong> CI Class Manager is where you view and edit class definitions centrally, set one identification rule per class, define reconciliation and data refresh rules, and configure the health settings for a class: mandatory and recommended fields, orphan and staleness rules (<Src k="docsCiClassManager">CI Class Manager</Src>).
        </p>
        <HealthTreeDiagram />
        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Health is three KPIs">
            <p>
              CMDB Health aggregates Correctness (orphan, stale and duplicate CIs), Completeness (missing required and recommended fields) and Compliance (the most recent audit results). In the base system, all KPIs and metrics are included (<Src k="docsCmdbHealth">CMDB Health</Src>).
            </p>
          </Card>
          <Card title="Governance acts on the findings">
            <p>
              CMDB Data Manager handles bulk life-cycle operations such as deletion, archival and attestation through policies (<Src k="docsDataManager">Data Manager</Src>). Duplicates found by IRE are grouped into de-duplication tasks and merged into one retained main CI, in bulk through dashboard templates or one at a time with the Duplicate CI Remediator (<Src k="docsDedup">De-duplication</Src>).
            </p>
          </Card>
        </div>
        <CsdmDomainsDiagram />
        <p>
          <strong>CSDM gives the data meaning.</strong> ServiceNow describes CSDM as the data model admins should follow when setting up products that use the CMDB (<Src k="docsCsdm">CSDM</Src>). The Foundation domain holds the base reference data (companies, departments, locations, groups, users, products) that must be populated before you use ServiceNow products, and the other domains follow the service life cycle from ideation to consumption (<Src k="docsCsdmFoundation">Foundation domain</Src>).
        </p>
        <Callout title="Architect's shorthand">
          <p>
            IRE decides <em>who may write</em>. CI Class Manager decides <em>what a CI is</em>. Health measures <em>whether it&apos;s still true</em>. Data Manager and de-duplication <em>fix what isn&apos;t</em>. CSDM decides <em>what it means to the business</em>. For how mapped application services land in this model, see the <In href="/courses/service-mapping">Service Mapping course for architects</In>.
          </p>
        </Callout>
      </GuideSection>

      <GuideSection id="df-scenarios" eyebrow="Worked scenarios" title="Industry scenarios">
        <p>These are illustrative situations, not real exam questions.</p>
        <div className="space-y-6">
          <Scenario
            industry="Managed services"
            title="Two tools keep overwriting each other's server attributes"
            situation="A provider runs Discovery and also imports server data from an endpoint management tool. Operating system versions flip back and forth between the two."
            reasoning={<>This is a reconciliation problem. IRE is designed to let only authoritative sources write particular attributes, and it uses the last-discovered time so older data doesn&apos;t overwrite newer data (<Src k="docsIre">source</Src>). The fix is to decide which source is authoritative per class and attribute and configure reconciliation rules, typically in CI Class Manager (<Src k="docsCiClassManager">source</Src>).</>}
            examAngle="Telling identification (is this the same CI?) apart from reconciliation (who may update which attribute?)."
          />
          <Scenario
            industry="Healthcare"
            title="After a hospital merger, every server appears twice"
            situation="Two CMDBs were combined. Incident teams now see duplicate CIs and can't tell which one carries the real relationships."
            reasoning={<>IRE detects duplicates and groups them into de-duplication tasks; remediation merges each set into one retained main CI, choosing which attributes, relationships and related items to keep, in bulk or one task at a time (<Src k="docsDedup">source</Src>). The Duplicate metric in CMDB Health shows whether the problem is shrinking (<Src k="docsCmdbHealth">source</Src>).</>}
            examAngle="Knowing the remediation path for duplicates, and which health metric tracks them."
          />
          <Scenario
            industry="Retail"
            title="Closed stores still have hundreds of active CIs"
            situation="Store closures were never reflected in the CMDB. Reports overstate the estate, and change teams waste time on assets that no longer exist."
            reasoning={<>Staleness is a Correctness metric (<Src k="docsCmdbHealth">source</Src>), and staleness rules are set per class in CI Class Manager (<Src k="docsCiClassManager">source</Src>). Data Manager policies then handle the bulk life-cycle work such as archival or deletion (<Src k="docsDataManager">source</Src>). Measuring and acting are separate steps, and the exam often asks which tool does which.</>}
            examAngle="Connecting a health metric to the governance tool that acts on it."
          />
          <Scenario
            industry="Banking"
            title="Application owners disagree about what an &ldquo;application&rdquo; is"
            situation="Architects talk about products in planning, operations talks about running services, and the CMDB has a bit of both in the wrong places."
            reasoning={<>CSDM separates the life cycle into domains, from Design &amp; Planning through Build &amp; Integration to Service Delivery and Service Consumption, all resting on Foundation data (<Src k="docsCsdmFoundation">source</Src>). Agreeing which domain a record belongs to is the first governance decision, and the blueprint&apos;s CSDM objectives ask exactly how to work with stakeholders to map CIs to the correct domain (<Src k="cisDfBlueprint">source</Src>).</>}
            examAngle="Using CSDM domains to settle where a record belongs."
          />
        </div>
      </GuideSection>

      <GuideSection id="df-misconceptions" eyebrow="Misconceptions" title="Common CIS-DF misconceptions">
        <div className="grid gap-4 md:grid-cols-2">
          <Misconception myth="&ldquo;CIS-DF is a Discovery exam.&rdquo;">
            Discovery is one ingestion method among several (<Src k="docsCmdb">CMDB</Src>). The blueprint gives Govern 35% and Ingest 19% (<Src k="cisDfBlueprint">blueprint</Src>).
          </Misconception>
          <Misconception myth="&ldquo;More sources means a better CMDB.&rdquo;">
            IRE exists to let only authoritative sources write to the CMDB (<Src k="docsIre">IRE</Src>). Unreconciled sources produce flip-flopping attributes and duplicates.
          </Misconception>
          <Misconception myth="&ldquo;Health is one number.&rdquo;">
            It aggregates three KPIs, each built from its own metrics, and relationship health is reported separately (<Src k="docsCmdbHealth">CMDB Health</Src>).
          </Misconception>
          <Misconception myth="&ldquo;CIS-DF is optional for the other CIS exams.&rdquo;">
            Several CIS exams now require CIS-DF first (<Src k="examChanges2026">ServiceNow Community, Jan 2026</Src>). See the list below.
          </Misconception>
        </div>
      </GuideSection>

      <GuideSection id="df-logistics" eyebrow="Logistics" title="CIS-DF logistics and the prerequisite rule">
        <ExamLogistics certSlug="cis-df" />
        <p>
          CIS-DF is a mandatory prerequisite for {prerequisiteFor.join(", ")} (per our <Src k="cisDfBlueprint">blueprint</Src> source data and the <Src k="examChanges2026">2026 Community summary</Src>). If you are heading for any of those, CIS-DF comes first. The <In href="/certification-paths">ServiceNow certification paths</In> page shows where it sits in each track.
        </p>
        <p>
          The same February 2026 Community post describes three question styles on the exam: single answer, two correct answers, and match-the-following (<Src k="cisDfExperience">source</Src>). That is one candidate&apos;s report, so treat the mix as indicative.
        </p>
      </GuideSection>

      <GuideSection id="df-practice" eyebrow="Practice" title="Practise the decisions, not the definitions">
        <p>
          Start with the free sample questions further down this page, then work through <In href="/cis-df/practice-questions">CIS-DF practice questions by topic</In> and the <In href="/cis-df/study-guide">CIS-DF study guide</In>. For each scenario, name the tool that <em>measures</em> the problem and the tool that <em>fixes</em> it.
        </p>
        <StudyCluster certSlug="cis-df" currentPath="/cis-df" />
      </GuideSection>

      <SourcesList keys={sourceKeys} />
    </div>
  );
}
