// Long-form, sourced section of the /cpoa hub. Every product behaviour or
// exam fact links to a source in lib/sources.ts.

import { BlueprintChart, Callout, Card, GuideSection, In, Misconception, Scenario, SourcesList, Src, Toc } from "@/components/guide/GuideParts";
import { ExamLogistics, logisticsSourceKeys } from "@/components/guide/ExamLogistics";
import { StudyCluster } from "@/components/guide/StudyCluster";
import { getBlueprint } from "@/lib/cert-sources";
import type { SourceKey } from "@/lib/sources";

function OperatingModelDiagram({ weights }: { weights: Record<string, number> }) {
  const nodes = [
    { name: "Strategy", x: 370, y: 40 },
    { name: "People", x: 600, y: 120 },
    { name: "Process", x: 600, y: 260 },
    { name: "Technology", x: 370, y: 340 },
    { name: "Data", x: 140, y: 260 },
    { name: "ServiceNow Governance", x: 140, y: 120 },
  ];
  return (
    <figure className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <svg viewBox="0 0 740 390" role="img" aria-labelledby="cpoa-model-title" className="h-auto w-full">
        <title id="cpoa-model-title">The six CPOA blueprint domains around the platform owner</title>
        {nodes.map((node) => (
          <line key={`l-${node.name}`} x1="370" y1="190" x2={node.x} y2={node.y} className="stroke-zinc-300 dark:stroke-zinc-700" strokeWidth="2" />
        ))}
        <circle cx="370" cy="190" r="70" className="fill-zinc-900 dark:fill-zinc-100" />
        <text x="370" y="186" textAnchor="middle" className="fill-white text-[15px] font-bold dark:fill-zinc-900">Platform</text>
        <text x="370" y="206" textAnchor="middle" className="fill-white text-[15px] font-bold dark:fill-zinc-900">owner</text>
        {nodes.map((node) => (
          <g key={node.name}>
            <rect x={node.x - 95} y={node.y - 26} width="190" height="52" rx="14" className="fill-emerald-100 stroke-emerald-500 dark:fill-emerald-950/50" strokeWidth="1.5" />
            <text x={node.x} y={node.y - 4} textAnchor="middle" className="fill-emerald-950 text-[13px] font-bold dark:fill-emerald-100">{node.name}</text>
            <text x={node.x} y={node.y + 15} textAnchor="middle" className="fill-emerald-800 text-[12px] dark:fill-emerald-300">{weights[node.name] !== undefined ? `${weights[node.name]}%` : ""}</text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
        Domain names and weights from the <Src k="cpoaBlueprint">CPOA blueprint</Src>. The layout is our own way of showing that every domain answers to the same role.
      </figcaption>
    </figure>
  );
}

function InstanceLandscapeDiagram() {
  const instances = [
    { x: 20, name: "Development", note: "build, ATF" },
    { x: 270, name: "Test / UAT", note: "ATF, acceptance" },
    { x: 520, name: "Production", note: "no ATF runs" },
  ];
  return (
    <figure className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <svg viewBox="0 0 720 220" role="img" aria-labelledby="cpoa-landscape-title" className="h-auto w-full">
        <title id="cpoa-landscape-title">A three-instance landscape: promotion forward, clone backward</title>
        <defs>
          <marker id="cpoa-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" className="fill-zinc-500" />
          </marker>
        </defs>
        {instances.map((inst) => (
          <g key={inst.name}>
            <rect x={inst.x} y="70" width="180" height="70" rx="14" className="fill-sky-50 stroke-sky-400 dark:fill-sky-950/40" strokeWidth="1.5" />
            <text x={inst.x + 90} y="100" textAnchor="middle" className="fill-sky-950 text-[14px] font-bold dark:fill-sky-100">{inst.name}</text>
            <text x={inst.x + 90} y="122" textAnchor="middle" className="fill-sky-800 text-[12px] dark:fill-sky-300">{inst.note}</text>
          </g>
        ))}
        <line x1="200" y1="90" x2="268" y2="90" className="stroke-zinc-500" strokeWidth="2" markerEnd="url(#cpoa-arrow)" />
        <line x1="450" y1="90" x2="518" y2="90" className="stroke-zinc-500" strokeWidth="2" markerEnd="url(#cpoa-arrow)" />
        <text x="360" y="40" textAnchor="middle" className="fill-zinc-700 text-[12px] font-semibold dark:fill-zinc-300">Configuration and apps promoted forward (update sets, app deployment)</text>
        <path d="M610 140 C 560 200, 160 200, 110 142" className="stroke-amber-500" strokeWidth="2" fill="none" markerEnd="url(#cpoa-arrow)" strokeDasharray="6 4" />
        <text x="360" y="208" textAnchor="middle" className="fill-amber-700 text-[12px] font-semibold dark:fill-amber-300">Clone copies data and metadata from production to non-production</text>
      </svg>
      <figcaption className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
        From the <Src k="docsUpdateSets">update sets</Src>, <Src k="docsClone">Instance Clone</Src> and <Src k="docsAtf">ATF</Src> documentation. Instance names are illustrative.
      </figcaption>
    </figure>
  );
}

export function CpoaDeepDive() {
  const blueprint = getBlueprint("cpoa");
  const weights = Object.fromEntries((blueprint?.domains ?? []).map((d) => [d.name, d.weight]));
  const sourceKeys: SourceKey[] = [
    "cpoaBlueprint", "welcomeCourse", "adminFundamentalsCourse", "platformImplementationCourse",
    "docsUpgrade", "docsClone", "docsAtf", "docsUpdateSets", "docsDelegatedDev", "docsCmdb", "docsDomainSeparation", "docsPlatformAnalytics",
    "cpoaExamThread",
    ...logisticsSourceKeys("cpoa"),
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="py-10">
        <Toc
          items={[
            ["#cpoa-blueprint", "What the CPOA exam tests"],
            ["#cpoa-architecture", "How the platform-owner role fits together"],
            ["#cpoa-scenarios", "Worked industry scenarios"],
            ["#cpoa-misconceptions", "Common misconceptions"],
            ["#cpoa-logistics", "Exam logistics"],
            ["#cpoa-practice", "Practice questions"],
            ["#sources", "Sources"],
          ]}
        />
        <p className="mt-8 text-lg leading-8 text-zinc-700 dark:text-zinc-300">
          The Certified Platform Owner Associate exam is about running ServiceNow as a product inside an organisation. The questions aren&apos;t about configuring a form; they are about who decides what gets built, how changes reach production safely, how upgrades and clones are planned, how licences are governed, and how the platform proves its value. This page lays out that operating model, maps it to the official blueprint, and works through the trade-offs a platform owner faces in different industries.
        </p>
      </div>

      <GuideSection id="cpoa-blueprint" eyebrow="Blueprint" title="What the CPOA exam tests">
        <p>
          The <Src k="cpoaBlueprint">CPOA blueprint (KB0012914, updated November 2025)</Src> has six domains with uneven weights:
        </p>
        {blueprint && <BlueprintChart blueprint={blueprint} sourceKey="cpoaBlueprint" />}
        <p>
          Technology (22.9%) and Strategy (21.4%) lead, but People and Process together make up 31.4%. Many objectives start with &ldquo;Given a scenario&rdquo;: resolving conflicting tool requests from IT and Security, choosing a code promotion method, deciding where development for a requirement should happen. Governance covers licensing: the artefacts and channels used for licences and subscriptions, and the characteristics of licence types such as fulfiller, user and capacity.
        </p>
        <p>
          The blueprint&apos;s recommended reading is long and includes <Src k="welcomeCourse">Welcome to ServiceNow</Src>, <Src k="adminFundamentalsCourse">ServiceNow Administration Fundamentals</Src> and <Src k="platformImplementationCourse">ServiceNow Platform Implementation</Src>, plus shorter courses on Now Create, ATF, user acceptance testing, organisational change management, licensing and roadmaps. On the ServiceNow Community, a contributor who says they are an item writer for the exam advised that most questions are based on the training content, with perhaps one or two scenario-based questions that ask you to apply it (<Src k="cpoaExamThread">ServiceNow Community, 2026</Src>).
        </p>
      </GuideSection>

      <GuideSection id="cpoa-architecture" eyebrow="Mental model" title="How the platform-owner role fits together">
        <OperatingModelDiagram weights={weights} />
        <p>
          Think of the six domains as six conversations the platform owner has to lead. Strategy is the roadmap and technical governance. People is the community of champions, stakeholders and conflicting demands. Process is how a requirement becomes a deployed change. Technology is the instance landscape: upgrades, clones, support. Data is the health and use of platform data. ServiceNow Governance is licensing and the commercial relationship.
        </p>
        <InstanceLandscapeDiagram />
        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Promotion moves forward">
            <p>
              Update sets group configuration changes so you can build on non-production and move them as a unit to other instances (<Src k="docsUpdateSets">Update sets</Src>). Delegated development lets non-admin users build or deploy specific applications with application-specific permissions, which matters when the platform owner wants many teams building without handing out admin (<Src k="docsDelegatedDev">Delegated development</Src>).
            </p>
          </Card>
          <Card title="Clone moves backward">
            <p>
              Instance Clone copies data and metadata from a source instance to a target, typically from production to a non-production instance, and supports custom clone profiles (<Src k="docsClone">Instance Clone</Src>). The blueprint asks when exclusions or data preservers are required (<Src k="cpoaBlueprint">blueprint</Src>): the question is what must <em>not</em> be overwritten on the target.
            </p>
          </Card>
          <Card title="Upgrades are planned, then tested">
            <p>
              Upgrade Console brings upgrade tools, information and guided setup into the instance, including a section on managing upgrade risks (<Src k="docsUpgrade">Upgrade management</Src>). ATF exists to check that an instance still works after a change such as an upgrade, and ServiceNow says to run tests only on non-production instances (<Src k="docsAtf">ATF</Src>).
            </p>
          </Card>
          <Card title="Value needs measurement over time">
            <p>
              Reports answer a question now. Performance Analytics indicators record a measurement at regular intervals so you can see a trend, and Platform Analytics brings visualizations, dashboards and KPI details together (<Src k="docsPlatformAnalytics">Platform Analytics</Src>). The blueprint&apos;s Data domain asks when reporting or Performance Analytics should be used and why.
            </p>
          </Card>
        </div>
        <Callout title="The platform owner's question">
          <p>
            &ldquo;What decision does this require, who should make it, and which platform mechanism makes it repeatable?&rdquo; Most CPOA scenarios are answered by naming the governance step first and the tool second.
          </p>
        </Callout>
      </GuideSection>

      <GuideSection id="cpoa-scenarios" eyebrow="Worked scenarios" title="Industry scenarios">
        <p>These are illustrative situations, not real exam questions.</p>
        <div className="space-y-6">
          <Scenario
            industry="Retail"
            title="A retailer must upgrade before peak season without breaking store operations"
            situation="Store incident and request flows are business-critical in the last quarter. The upgrade has to land before the change freeze."
            reasoning={<>Refresh the test instance from production with a clone so testing reflects real data and configuration (<Src k="docsClone">source</Src>), plan the upgrade with Upgrade Console&apos;s risk guidance (<Src k="docsUpgrade">source</Src>), and run ATF suites on the non-production instance after the upgrade (<Src k="docsAtf">source</Src>). The platform owner&apos;s job is the sequence and the go/no-go decision.</>}
            examAngle="Knowing the order (clone, upgrade non-production, test, then production) and that ATF doesn't run in production."
          />
          <Scenario
            industry="Shared services"
            title="A shared-service centre runs ServiceNow for several subsidiaries that must not see each other's data"
            situation="Each subsidiary wants its own processes and reports; regulators require the data to stay apart."
            reasoning={<>Domain separation lets a service provider split data, processes and reports into logical domains and control who can see each (<Src k="docsDomainSeparation">source</Src>). It is a significant architecture decision, which is why it appears among the blueprint&apos;s recommended courses (Domain Separation Basics).</>}
            examAngle="Recognising when separation is a platform design question rather than an ACL tweak."
          />
          <Scenario
            industry="Public sector"
            title="Several departments want to build their own small apps"
            situation="Demand outstrips the central team. Departments have capable staff but the platform owner can't give everyone admin."
            reasoning={<>Delegated development grants per-application developer and deployment rights without admin (<Src k="docsDelegatedDev">source</Src>). The governance work around it (standards, review, promotion path) is what the blueprint&apos;s Process and Strategy objectives probe, including where development for a requirement should happen.</>}
            examAngle="Scaling development through governance rather than through more admins."
          />
          <Scenario
            industry="Financial services"
            title="The board asks whether the platform investment is paying off"
            situation="Leadership wants evidence, not anecdotes, and wants to see whether things are improving."
            reasoning={<>A one-off report shows a snapshot; indicators collected at regular intervals show a trend (<Src k="docsPlatformAnalytics">source</Src>). The blueprint&apos;s Data domain asks for value-driven metrics and when to use reporting versus Performance Analytics (<Src k="cpoaBlueprint">source</Src>).</>}
            examAngle="Choosing trend measurement for value conversations."
          />
        </div>
      </GuideSection>

      <GuideSection id="cpoa-misconceptions" eyebrow="Misconceptions" title="Common CPOA misconceptions">
        <div className="grid gap-4 md:grid-cols-2">
          <Misconception myth="&ldquo;CPOA is a technical admin exam.&rdquo;">
            Technology is 22.9% of the blueprint; People and Process together are 31.4%, and Strategy another 21.4% (<Src k="cpoaBlueprint">CPOA blueprint</Src>).
          </Misconception>
          <Misconception myth="&ldquo;A clone is just a copy, so nothing can go wrong.&rdquo;">
            Clone copies data and metadata onto the target (<Src k="docsClone">Instance Clone</Src>), which is exactly why the blueprint asks when exclusions or data preservers are needed.
          </Misconception>
          <Misconception myth="&ldquo;Run ATF in production to be sure.&rdquo;">
            The ATF documentation says to run tests only on development, test and other non-production instances (<Src k="docsAtf">ATF</Src>).
          </Misconception>
          <Misconception myth="&ldquo;You need 70% to pass.&rdquo;">
            The cut score is predetermined and not shared with candidates (<Src k="cutScoreThread">ServiceNow Community, Jul 2026</Src>).
          </Misconception>
        </div>
      </GuideSection>

      <GuideSection id="cpoa-logistics" eyebrow="Logistics" title="CPOA exam logistics in 2026">
        <ExamLogistics certSlug="cpoa" />
      </GuideSection>

      <GuideSection id="cpoa-practice" eyebrow="Practice" title="Practise the platform owner's judgement">
        <p>
          Try the free sample questions further down this page, then continue with <In href="/cpoa/practice-questions">CPOA practice questions by topic</In>. For every scenario, name the decision first and the tool second.
        </p>
        <StudyCluster certSlug="cpoa" currentPath="/cpoa" />
      </GuideSection>

      <SourcesList keys={sourceKeys} />
    </div>
  );
}
