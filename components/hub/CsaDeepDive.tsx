// Long-form, sourced section of the /csa hub. Rendered by app/[slug]/page.tsx
// between the exam facts and the practice sections. Every product behaviour
// or exam fact links to a source in lib/sources.ts.

import { BlueprintChart, Callout, Card, GuideSection, In, Misconception, Scenario, SourcesList, Src, Toc } from "@/components/guide/GuideParts";
import { ExamLogistics, logisticsSourceKeys } from "@/components/guide/ExamLogistics";
import { StudyCluster } from "@/components/guide/StudyCluster";
import { getBlueprint } from "@/lib/cert-sources";
import type { SourceKey } from "@/lib/sources";

function PlatformLayersDiagram() {
  const layers = [
    { y: 10, title: "Experience", detail: "Next Experience UI, lists, forms, portals, Service Catalog", fill: "fill-sky-100 dark:fill-sky-950", stroke: "stroke-sky-400" },
    { y: 80, title: "Form logic (browser)", detail: "Client scripts and UI policies: shape what the user sees", fill: "fill-violet-100 dark:fill-violet-950", stroke: "stroke-violet-400" },
    { y: 150, title: "Server logic", detail: "Business rules and flows: run whatever the entry point", fill: "fill-amber-100 dark:fill-amber-950", stroke: "stroke-amber-400" },
    { y: 220, title: "Access control", detail: "ACLs decide who can read or write tables, fields, records", fill: "fill-rose-100 dark:fill-rose-950", stroke: "stroke-rose-400" },
    { y: 290, title: "Data", detail: "Tables, the CMDB, and the CSDM model on top of it", fill: "fill-emerald-100 dark:fill-emerald-950", stroke: "stroke-emerald-500" },
  ];
  return (
    <figure className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <svg viewBox="0 0 720 370" role="img" aria-labelledby="csa-layers-title" className="h-auto w-full">
        <title id="csa-layers-title">How a CSA-level change travels through the platform layers</title>
        {layers.map((layer) => (
          <g key={layer.title}>
            <rect x="20" y={layer.y} width="500" height="56" rx="12" className={`${layer.fill} ${layer.stroke}`} strokeWidth="1.5" />
            <text x="40" y={layer.y + 24} className="fill-zinc-900 text-[15px] font-bold dark:fill-zinc-50">{layer.title}</text>
            <text x="40" y={layer.y + 44} className="fill-zinc-600 text-[12px] dark:fill-zinc-300">{layer.detail}</text>
          </g>
        ))}
        <rect x="560" y="10" width="150" height="160" rx="12" className="fill-zinc-50 stroke-zinc-300 dark:fill-zinc-900 dark:stroke-zinc-700" strokeWidth="1.5" />
        <text x="635" y="40" textAnchor="middle" className="fill-zinc-900 text-[13px] font-bold dark:fill-zinc-50">Data in</text>
        <text x="635" y="62" textAnchor="middle" className="fill-zinc-600 text-[12px] dark:fill-zinc-300">Import sets</text>
        <text x="635" y="80" textAnchor="middle" className="fill-zinc-600 text-[12px] dark:fill-zinc-300">+ transform maps</text>
        <path d="M560 120 C 540 200, 540 280, 522 318" className="stroke-emerald-500" strokeWidth="2" fill="none" markerEnd="url(#csa-arrow)" />
        <rect x="560" y="200" width="150" height="150" rx="12" className="fill-zinc-50 stroke-zinc-300 dark:fill-zinc-900 dark:stroke-zinc-700" strokeWidth="1.5" />
        <text x="635" y="230" textAnchor="middle" className="fill-zinc-900 text-[13px] font-bold dark:fill-zinc-50">Config out</text>
        <text x="635" y="252" textAnchor="middle" className="fill-zinc-600 text-[12px] dark:fill-zinc-300">Update sets move</text>
        <text x="635" y="270" textAnchor="middle" className="fill-zinc-600 text-[12px] dark:fill-zinc-300">configuration</text>
        <text x="635" y="288" textAnchor="middle" className="fill-zinc-600 text-[12px] dark:fill-zinc-300">dev → test → prod</text>
        <defs>
          <marker id="csa-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" className="fill-emerald-500" />
          </marker>
        </defs>
      </svg>
      <figcaption className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
        A simplified mental model, not an official ServiceNow diagram. The point: the further down a control sits, the more entry points it covers.
      </figcaption>
    </figure>
  );
}

function FormVsServerDiagram() {
  return (
    <figure className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <svg viewBox="0 0 720 230" role="img" aria-labelledby="csa-entry-title" className="h-auto w-full">
        <title id="csa-entry-title">Which logic runs for each way into a record</title>
        {[
          { y: 20, label: "User on a form" },
          { y: 90, label: "User editing a list" },
          { y: 160, label: "Integration via web service" },
        ].map((entry) => (
          <g key={entry.label}>
            <rect x="10" y={entry.y} width="200" height="48" rx="10" className="fill-zinc-100 stroke-zinc-300 dark:fill-zinc-900 dark:stroke-zinc-700" />
            <text x="110" y={entry.y + 29} textAnchor="middle" className="fill-zinc-900 text-[13px] font-semibold dark:fill-zinc-100">{entry.label}</text>
            <line x1="210" y1={entry.y + 24} x2="480" y2="114" className="stroke-zinc-300 dark:stroke-zinc-600" strokeWidth="2" />
          </g>
        ))}
        <rect x="250" y="20" width="160" height="48" rx="10" className="fill-violet-100 stroke-violet-400 dark:fill-violet-950" />
        <text x="330" y="40" textAnchor="middle" className="fill-violet-900 text-[12px] font-semibold dark:fill-violet-200">Client scripts / UI policies</text>
        <text x="330" y="58" textAnchor="middle" className="fill-violet-900 text-[11px] dark:fill-violet-300">forms only</text>
        <rect x="480" y="80" width="230" height="70" rx="12" className="fill-amber-100 stroke-amber-400 dark:fill-amber-950" />
        <text x="595" y="108" textAnchor="middle" className="fill-amber-900 text-[13px] font-bold dark:fill-amber-200">Business rules + ACLs</text>
        <text x="595" y="128" textAnchor="middle" className="fill-amber-900 text-[11px] dark:fill-amber-300">apply to every entry point</text>
      </svg>
      <figcaption className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
        Based on the <Src k="docsBusinessRules">business rules</Src> and <Src k="docsClientScripts">client scripts</Src> documentation: client-side logic runs on forms (client scripts don&apos;t run on lists, except onCellEdit), while business rules apply to forms, lists and web services alike.
      </figcaption>
    </figure>
  );
}

export function CsaDeepDive() {
  const blueprint = getBlueprint("csa");
  const sourceKeys: SourceKey[] = [
    "csaBlueprint", "welcomeCourse", "adminFundamentalsCourse",
    "docsClientScripts", "docsBusinessRules", "docsAcl", "docsImportSets", "docsUpdateSets",
    "docsServiceCatalog", "docsKnowledge", "docsFlowDesigner", "docsCmdb", "docsCsdm", "docsCsdmFoundation",
    "docsSecurityCenter", "docsPlatformAnalytics", "csaPrepThread",
    ...logisticsSourceKeys("csa"),
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="py-10">
        <Toc
          items={[
            ["#csa-blueprint", "What the CSA exam tests"],
            ["#csa-architecture", "How the platform fits together"],
            ["#csa-scenarios", "Worked industry scenarios"],
            ["#csa-misconceptions", "Common misconceptions"],
            ["#csa-logistics", "Exam logistics"],
            ["#csa-practice", "Practice questions"],
            ["#sources", "Sources"],
          ]}
        />
        <p className="mt-8 text-lg leading-8 text-zinc-700 dark:text-zinc-300">
          The Certified System Administrator exam is usually described as the &ldquo;entry&rdquo; ServiceNow certification, which makes people underestimate it. The blueprint doesn&apos;t test whether you can find a menu. It tests whether you understand where a piece of behaviour belongs: in the form, on the server, in an access rule, in the data model, or in a package of configuration that moves between instances. This page explains that model, maps it to the official domains, and walks through the kind of scenarios the exam builds its questions around.
        </p>
      </div>

      <GuideSection id="csa-blueprint" eyebrow="Blueprint" title="What the CSA exam tests">
        <p>
          ServiceNow publishes the CSA domains and their weights in the <Src k="csaBlueprint">CSA exam blueprint (KB0011554, updated January 2026)</Src>. Six domains make up the exam:
        </p>
        {blueprint && <BlueprintChart blueprint={blueprint} sourceKey="csaBlueprint" />}
        <p>
          Two things stand out. First, <strong>Database Management and Platform Security is 30%</strong>, the largest domain by far. It groups the data schema, application and access control, importing data, the CMDB and CSDM, Security Center and the shared responsibility model. Second, <strong>Platform Overview and Navigation is only 7%</strong>. If your preparation has mostly been clicking around the UI, you have prepared for the smallest slice of the exam.
        </p>
        <p>
          The blueprint lists <Src k="welcomeCourse">Welcome to ServiceNow</Src> and <Src k="adminFundamentalsCourse">ServiceNow Administration Fundamentals</Src> as suggested courses. Use the blueprint objectives as your checklist: if you can&apos;t explain an objective to a colleague, that is your next study block.
        </p>
      </GuideSection>

      <GuideSection id="csa-architecture" eyebrow="Mental model" title="How the platform concepts fit together">
        <p>
          Most CSA questions become easier once you stop treating features as a list and start treating them as layers. Each layer answers a different question, and the exam regularly offers a correct-sounding answer from the wrong layer.
        </p>
        <PlatformLayersDiagram />
        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Form logic is for experience">
            <p>
              Client scripts run in the browser. The documentation says they generally run on forms and search pages and not on lists (except onCellEdit), and states that &ldquo;client scripts are not meant to protect unwanted access to data&rdquo; (<Src k="docsClientScripts">Client scripts</Src>). Use them, and UI policies, to make a form helpful, not to secure it.
            </p>
          </Card>
          <Card title="Server logic is for consistency">
            <p>
              A business rule is a server-side script that runs when records are displayed, inserted, updated, deleted or queried, and it applies consistently whether the record is reached through a form, a list or a web service (<Src k="docsBusinessRules">Business rules</Src>). That is why a rule that must always hold belongs on the server.
            </p>
          </Card>
          <Card title="Access control is its own layer">
            <p>
              ACLs control access to tables, fields, records and REST endpoints. If no ACL grants access, access is denied, and creating or changing ACLs requires the security_admin role (<Src k="docsAcl">Access Control Lists</Src>).
            </p>
          </Card>
          <Card title="The data model carries meaning">
            <p>
              The CMDB stores configuration items and how they relate, and it can be populated by Discovery, IntegrationHub ETL or import sets, an external CMDB, or by hand (<Src k="docsCmdb">CMDB</Src>). CSDM is the data model ServiceNow says admins should follow when they set up products that use the CMDB (<Src k="docsCsdm">CSDM</Src>).
            </p>
          </Card>
        </div>
        <p>
          Two flows cross those layers. <strong>Data comes in</strong> through import sets: a data source defines what is imported, and every import into a production table needs at least one transform map (<Src k="docsImportSets">Import sets</Src>). <strong>Configuration moves out</strong> through update sets: a group of configuration changes you build on a non-production instance and move as a unit to other instances, with collisions resolved before you commit (<Src k="docsUpdateSets">Update sets</Src>).
        </p>
        <FormVsServerDiagram />
        <p>
          The self-service domain (20%) sits on top of all this. Service Catalog is a collection of catalog items, and you can publish several catalogs for different audiences (<Src k="docsServiceCatalog">Service Catalog</Src>). Knowledge bases hold articles for self-help and troubleshooting (<Src k="docsKnowledge">Knowledge Management</Src>). Flow Designer lets process owners automate approvals, tasks, notifications and record operations without code, and ServiceNow recommends it over legacy workflows for new processes in almost all cases (<Src k="docsFlowDesigner">Flow Designer</Src>). The collaboration domain adds reporting: Platform Analytics visualizations replace Core UI reports and Performance Analytics widgets, and indicators record a measurement at regular intervals so you can see trends (<Src k="docsPlatformAnalytics">Platform Analytics</Src>).
        </p>
        <Callout title="The question to ask on every scenario">
          <p>
            &ldquo;Which layer owns this?&rdquo; Hiding a field for a role is experience. Preventing a role from reading a field is access control. Setting a value whatever the entry point is server logic. Getting 400 rows from a spreadsheet into a table is data in. Getting a new form layout from dev to prod is configuration out.
          </p>
        </Callout>
      </GuideSection>

      <GuideSection id="csa-scenarios" eyebrow="Worked scenarios" title="Industry scenarios, solved at the right layer">
        <p>
          These are illustrative situations, not real exam questions. Each shows the reasoning an administrator should apply and the distinction the exam is probing.
        </p>
        <div className="space-y-6">
          <Scenario
            industry="Healthcare"
            title="A hospital wants nurses to stop seeing a diagnosis field on a shared request form"
            situation="Ward staff and the clinical systems team both use the same request table. The team asks you to hide a sensitive field from nurses. Someone suggests a UI policy because it is quick to configure."
            reasoning={<>A UI policy or client script would hide the field on the form, but the documentation is explicit that client scripts are not a data-protection mechanism and don&apos;t run on lists (<Src k="docsClientScripts">source</Src>). A field-level ACL controls access whatever the entry point (<Src k="docsAcl">source</Src>). The right design is both: an ACL for protection, plus form logic only if the layout needs tidying.</>}
            examAngle="Whether you can tell visibility (experience layer) apart from access (security layer)."
          />
          <Scenario
            industry="Retail"
            title="A retailer needs 400 store locations loaded every week from a spreadsheet"
            situation="The property team maintains store data in a spreadsheet and wants ServiceNow to stay in sync without anyone re-typing it."
            reasoning={<>This is an import problem, not a scripting problem. A data source defines what to import, a transform map maps it into the target table, and imports can be scheduled to run at a regular interval (<Src k="docsImportSets">source</Src>). Locations belong to the CSDM Foundation domain, the base reference data other domains depend on (<Src k="docsCsdmFoundation">source</Src>), so getting them right early saves clean-up later.</>}
            examAngle="Knowing the import set → transform map path, and that imports into production tables need a transform map."
          />
          <Scenario
            industry="Banking"
            title="A bank changes an approval process in development and must promote it safely"
            situation="Change control requires that nothing is configured directly in production. A new catalog form and its approval flow were built in the development instance."
            reasoning={<>Update sets are the platform&apos;s mechanism for grouping configuration changes and moving them between instances, and batched update sets let you preview and commit several together (<Src k="docsUpdateSets">source</Src>). The exam angle is about sequencing: build in non-production, move the configuration as a unit, and resolve collisions before committing.</>}
            examAngle="Understanding what an update set is for and where development should happen."
          />
          <Scenario
            industry="Manufacturing"
            title="A plant wants equipment requests approved by the line manager, then routed to maintenance"
            situation="Today requests arrive by email and get lost. The plant wants a catalog item, an approval, a task for maintenance and a notification to the requester."
            reasoning={<>A catalog item gives the request a structured front door (<Src k="docsServiceCatalog">source</Src>). The approval, task and notification are exactly what Flow Designer is described as automating without code, and ServiceNow recommends it over legacy workflows for new processes (<Src k="docsFlowDesigner">source</Src>). A business rule would be the wrong tool for a multi-step human process.</>}
            examAngle="Picking the low-code automation tool for a process, and the catalog for the request intake."
          />
        </div>
      </GuideSection>

      <GuideSection id="csa-misconceptions" eyebrow="Misconceptions" title="Common CSA misconceptions">
        <div className="grid gap-4 md:grid-cols-2">
          <Misconception myth="&ldquo;You need 70% to pass.&rdquo;">
            ServiceNow does not publish the cut score. Each exam is scored against a predetermined cut score that is not shared with candidates (<Src k="cutScoreThread">ServiceNow Community, Jul 2026</Src>).
          </Misconception>
          <Misconception myth="&ldquo;CSA is mostly navigation.&rdquo;">
            Navigation is 7% of the blueprint; Database Management and Platform Security is 30% (<Src k="csaBlueprint">CSA blueprint</Src>).
          </Misconception>
          <Misconception myth="&ldquo;Hiding a field secures it.&rdquo;">
            Client scripts are &ldquo;not meant to protect unwanted access to data&rdquo;; use ACLs or data policies to restrict sensitive fields (<Src k="docsClientScripts">Client scripts</Src>).
          </Misconception>
          <Misconception myth="&ldquo;I need an exam voucher first.&rdquo;">
            Vouchers ended when exams moved to Pearson VUE; exams are now registered and paid for in ServiceNow University (<Src k="examChanges2026">ServiceNow Community, Jan 2026</Src>).
          </Misconception>
        </div>
      </GuideSection>

      <GuideSection id="csa-logistics" eyebrow="Logistics" title="CSA exam logistics in 2026">
        <ExamLogistics certSlug="csa" />
        <p>
          On timing: a ServiceNow trainer on the Community suggests that, with the training done and good hands-on practice, 2&ndash;4 weeks of focused revision can be enough, and recommends practising in a Personal Developer Instance and focusing on concepts rather than memorising questions (<Src k="csaPrepThread">ServiceNow Community, Jul 2026</Src>). For a full plan, read <In href="/blog/how-to-pass-servicenow-csa-first-time">how to pass the CSA exam on your first attempt</In>, and for what the whole journey costs, <In href="/blog/servicenow-certification-cost-2026">ServiceNow certification cost in 2026</In>.
        </p>
      </GuideSection>

      <GuideSection id="csa-practice" eyebrow="Practice" title="Test yourself on the right layer">
        <p>
          Every CSA question on SNReady is free. Try the sample questions further down this page, then work through <In href="/csa/practice-questions">all free CSA practice questions by topic</In>. When you get one wrong, ask which layer the correct answer lives in. That habit transfers to questions you haven&apos;t seen.
        </p>
        <StudyCluster certSlug="csa" currentPath="/csa" />
      </GuideSection>

      <SourcesList keys={sourceKeys} />
    </div>
  );
}
