// Body of /blog/servicenow-cad-exam-complete-guide-2026. Every exam fact or
// product behaviour links to a source in lib/sources.ts.

import { BlueprintChart, Callout, Card, GuideSection, In, Misconception, Scenario, SourcesList, Src, Toc } from "@/components/guide/GuideParts";
import { StudyCluster } from "@/components/guide/StudyCluster";
import { SampleQuestions } from "@/components/SampleQuestions";
import { getBlueprint } from "@/lib/cert-sources";
import { getFreeQuestionsForCertification } from "@/lib/data";
import type { SourceKey } from "@/lib/sources";

function RecordLifecycleDiagram() {
  const client = [
    { x: 20, label: "onLoad", note: "form renders" },
    { x: 140, label: "onChange", note: "field changes" },
    { x: 260, label: "onSubmit", note: "false cancels" },
  ];
  const server = [
    { x: 380, label: "before", note: "pre-write" },
    { x: 470, label: "DB write", note: "", db: true },
    { x: 560, label: "after", note: "post-write" },
    { x: 650, label: "async", note: "scheduled job" },
  ];
  return (
    <figure className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <svg viewBox="0 0 760 210" role="img" aria-labelledby="cad-life-title" className="h-auto w-full">
        <title id="cad-life-title">What runs when a user edits and saves a record on a form</title>
        <rect x="10" y="20" width="350" height="150" rx="14" className="fill-violet-50 stroke-violet-300 dark:fill-violet-950/30" />
        <text x="185" y="44" textAnchor="middle" className="fill-violet-900 text-[13px] font-bold dark:fill-violet-200">Browser: client scripts</text>
        <rect x="370" y="20" width="380" height="150" rx="14" className="fill-amber-50 stroke-amber-300 dark:fill-amber-950/30" />
        <text x="560" y="44" textAnchor="middle" className="fill-amber-900 text-[13px] font-bold dark:fill-amber-200">Server: business rules</text>
        {[...client, ...server].map((step) => (
          <g key={step.label}>
            <rect x={step.x} y="70" width={"db" in step ? 80 : 100} height="56" rx="10" className={"db" in step ? "fill-zinc-800 dark:fill-zinc-200" : "fill-white stroke-zinc-300 dark:fill-zinc-900 dark:stroke-zinc-700"} />
            <text x={step.x + ("db" in step ? 40 : 50)} y="96" textAnchor="middle" className={"db" in step ? "fill-white text-[12px] font-bold dark:fill-zinc-900" : "fill-zinc-900 text-[13px] font-bold dark:fill-zinc-100"}>{step.label}</text>
            {step.note && <text x={step.x + 50} y="114" textAnchor="middle" className="fill-zinc-500 text-[10.5px] dark:fill-zinc-400">{step.note}</text>}
          </g>
        ))}
        <text x="380" y="155" className="fill-zinc-500 text-[10.5px] dark:fill-zinc-400">display rules run before the form is shown, after data is read</text>
      </svg>
      <figcaption className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
        Order and behaviour from the <Src k="docsClientScripts">client scripts</Src> and <Src k="docsBusinessRules">business rules</Src> documentation. Async rules run through a scheduled job, and their order isn&apos;t guaranteed when several update the same record.
      </figcaption>
    </figure>
  );
}

function IntegrationChoiceDiagram() {
  const rows = [
    { need: "A file or another system's export lands in ServiceNow", tool: "Import set + transform map", src: "docsImportSets" as SourceKey },
    { need: "An external system calls into your app", tool: "Scripted REST API (versioned, REST_Endpoint ACL)", src: "docsScriptedRest" as SourceKey },
    { need: "A form needs server data without a page reload", tool: "GlideAjax → client-callable script include", src: "docsScriptIncludes" as SourceKey },
    { need: "A process reaches out to an external system", tool: "Flow Designer action in that system's spoke", src: "docsFlowDesigner" as SourceKey },
  ];
  return (
    <figure className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <svg viewBox="0 0 760 250" role="img" aria-labelledby="cad-int-title" className="h-auto w-full">
        <title id="cad-int-title">Choosing the integration mechanism</title>
        {rows.map((row, i) => {
          const y = 12 + i * 58;
          return (
            <g key={row.tool}>
              <rect x="10" y={y} width="340" height="44" rx="10" className="fill-zinc-50 stroke-zinc-300 dark:fill-zinc-900 dark:stroke-zinc-700" />
              <text x="24" y={y + 27} className="fill-zinc-800 text-[12px] dark:fill-zinc-200">{row.need}</text>
              <line x1="350" y1={y + 22} x2="400" y2={y + 22} className="stroke-emerald-500" strokeWidth="2" />
              <rect x="400" y={y} width="350" height="44" rx="10" className="fill-emerald-50 stroke-emerald-400 dark:fill-emerald-950/40" />
              <text x="414" y={y + 27} className="fill-emerald-900 text-[12px] font-semibold dark:fill-emerald-200">{row.tool}</text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
        From the <Src k="docsImportSets">import sets</Src>, <Src k="docsScriptedRest">Scripted REST API</Src>, <Src k="docsScriptIncludes">script includes</Src> and <Src k="docsFlowDesigner">Flow Designer</Src> documentation.
      </figcaption>
    </figure>
  );
}

export const CAD_GUIDE_SOURCES: SourceKey[] = [
  "cadBlueprint", "welcomeCourse", "developerSite",
  "docsAppScope", "docsClientScripts", "docsBusinessRules", "docsScriptIncludes", "docsAcl", "docsFlowDesigner",
  "docsScriptedRest", "docsImportSets", "docsDelegatedDev", "docsAtf",
  "examChanges2026", "cadVoucherThread", "cutScoreThread",
];

export async function CadGuidePost() {
  const blueprint = getBlueprint("cad");
  const sample = (await getFreeQuestionsForCertification("cad")).slice(0, 3);

  return (
    <div className="not-prose">
      <Toc
        items={[
          ["#blueprint", "The blueprint, domain by domain"],
          ["#runtime", "Know what runs when"],
          ["#integration", "Pick the right integration door"],
          ["#plan", "A study plan built on a real app"],
          ["#scenarios", "Worked scenarios"],
          ["#misconceptions", "Misconceptions that cost marks"],
          ["#logistics", "Booking, fees and retakes"],
          ["#practice", "Practice questions"],
          ["#sources", "Sources"],
        ]}
      />

      <div className="mt-8 space-y-5 text-lg leading-8 text-zinc-700 dark:text-zinc-300">
        <p>
          The Certified Application Developer exam rewards people who have built and shipped a scoped application, and it is unforgiving to people who have only read about one. The questions describe a requirement and ask where the logic belongs, who should be able to reach it, and how it gets to production. This guide shows how to prepare for that: what each blueprint domain really asks, the runtime model you need in your head, a study plan built around one real app, and the 2026 booking rules.
        </p>
        <p>
          For the architecture overview of a scoped app, start with the <In href="/cad">CAD exam overview</In>. If you haven&apos;t done CSA yet, the <In href="/csa">CSA exam overview</In> covers the platform layers CAD builds on.
        </p>
      </div>

      <GuideSection id="blueprint" eyebrow="Step 1" title="The blueprint, domain by domain">
        <p>
          The <Src k="cadBlueprint">CAD blueprint (KB0011498, January 2026)</Src> weights four domains at 20% and two at 10%:
        </p>
        {blueprint && <BlueprintChart blueprint={blueprint} sourceKey="cadBlueprint" showObjectives={false} />}
        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Designing and Creating an Application (20%)">
            <p>Is this a good fit for ServiceNow, what is the data model, which modules, and why scope it? Scope restricts access to application files and data, and ServiceNow recommends scoped apps for new tables (<Src k="docsAppScope">Application scope</Src>).</p>
          </Card>
          <Card title="Application User Interface (20%)">
            <p>Forms, fields, client- and server-side scripts, and record producers as an app&apos;s UI. Know the client script types and that they don&apos;t protect data (<Src k="docsClientScripts">Client scripts</Src>).</p>
          </Card>
          <Card title="Security and Restricting Access (20%)">
            <p>Restricting apps and modules, creating and debugging access controls, scripting security with GlideSystem, and using scope to protect artefacts. ACL evaluation, deny-by-default and scope rules come from <Src k="docsAcl">the ACL documentation</Src>.</p>
          </Card>
          <Card title="Application Automation (20%)">
            <p>Flow Designer and workflows, application properties, events, scheduled jobs, utility script includes, and email. Know when ServiceNow prefers Flow Designer over business rules (<Src k="docsFlowDesigner">Flow Designer</Src>).</p>
          </Card>
          <Card title="Working with External Data (10%)">
            <p>Importing CSV or Excel, and integrating with an external source using REST, including testing and debugging (<Src k="docsImportSets">Import sets</Src>, <Src k="docsScriptedRest">Scripted REST</Src>).</p>
          </Card>
          <Card title="Managing Applications (10%)">
            <p>Installing applications, Delegated Development for source code and code review, and the ServiceNow Git integration (<Src k="docsDelegatedDev">Delegated development</Src>).</p>
          </Card>
        </div>
        <p>
          The blueprint points to <Src k="welcomeCourse">Welcome to ServiceNow</Src>, Scripting in ServiceNow Fundamentals and Application Development Fundamentals as recommended courses, and to the <Src k="developerSite">ServiceNow Developer site</Src>.
        </p>
      </GuideSection>

      <GuideSection id="runtime" eyebrow="Step 2" title="Know what runs when">
        <p>
          Many CAD questions are timing questions in disguise. If you can picture what happens when a user opens a form, changes a field and clicks save, you can rule out most wrong answers.
        </p>
        <RecordLifecycleDiagram />
        <p>
          Client scripts run in the browser on forms; onSubmit can cancel the save by returning false (<Src k="docsClientScripts">source</Src>). Before business rules run after submission but before the database write, so changes they make are saved with the record; after rules run once the write has happened; async rules run through a scheduled job; display rules run before the form is shown (<Src k="docsBusinessRules">source</Src>). Script includes hold shared server code and load only when called, which is why they are preferred over global business rules (<Src k="docsScriptIncludes">source</Src>).
        </p>
        <Callout title="Rule of thumb">
          <p>
            Change the record you are saving? <em>Before</em> rule. React to the save, such as updating related records? <em>After</em> rule. Slow or non-urgent work? <em>Async</em>. Make data available to the form? <em>Display</em> rule or a client-callable script include.
          </p>
        </Callout>
      </GuideSection>

      <GuideSection id="integration" eyebrow="Step 3" title="Pick the right integration door">
        <IntegrationChoiceDiagram />
        <p>
          A Scripted REST API is a custom endpoint made of resources, each with an HTTP method and a script; you version it in the URI so existing integrations keep working, and callers must satisfy at least one REST_Endpoint ACL (<Src k="docsScriptedRest">source</Src>). Client-callable script includes are private by default, so guests on public pages can&apos;t run them unless you change that deliberately (<Src k="docsScriptIncludes">source</Src>). Runtime access settings on the application decide whether API or web service calls can run against its tables at all (<Src k="docsAppScope">source</Src>).
        </p>
      </GuideSection>

      <GuideSection id="plan" eyebrow="Step 4" title="A study plan built on a real app">
        <p>
          The most effective CAD preparation is to build one small scoped application end to end in a personal instance, touching every domain. Pick something concrete, such as an equipment-loan tracker, and work through it in this order:
        </p>
        <ol className="list-decimal space-y-4 pl-6">
          <li><strong>Design.</strong> Create the scoped app, two or three tables and the modules. Write down why each table is in your scope.</li>
          <li><strong>UI.</strong> Build the form, add onLoad and onChange client scripts, then a record producer as an alternative entry point.</li>
          <li><strong>Security.</strong> Add ACLs for a borrower role and a manager role, then test as each user. Try to break your own rules.</li>
          <li><strong>Automation.</strong> Add an approval flow in Flow Designer, an application property, and a script include used by a business rule.</li>
          <li><strong>External data.</strong> Import a spreadsheet of equipment, then expose a read-only Scripted REST endpoint for loan status.</li>
          <li><strong>Managing.</strong> Set up delegated development for a second user and add an ATF test you can run after changes, on your non-production instance (<Src k="docsAtf">ATF</Src>).</li>
        </ol>
        <p>
          Then switch to <In href="/cad/practice-questions">CAD practice questions</In>. Every miss should send you back to the part of your app where that concept lives.
        </p>
      </GuideSection>

      <GuideSection id="scenarios" eyebrow="Step 5" title="Worked scenarios">
        <p>Illustrative scenarios, not exam questions.</p>
        <div className="space-y-6">
          <Scenario
            industry="Healthcare"
            title="A patient-transport app must not let porters see clinical notes"
            situation="Porters need the pickup location and time; clinical staff need the full record. Both use the same table."
            reasoning={<>Field-level ACLs control read access for each role; hiding the field on the porter form is cosmetic (<Src k="docsAcl">source</Src>, <Src k="docsClientScripts">source</Src>). Keep the tables in the app&apos;s own scope so other applications need explicit permission (<Src k="docsAppScope">source</Src>).</>}
            examAngle="Field ACLs over form logic, inside a scoped app."
          />
          <Scenario
            industry="Manufacturing"
            title="Quality inspections need a supervisor sign-off and a notification"
            situation="A developer proposes an after business rule that creates approval records and sends email."
            reasoning={<>ServiceNow recommends Flow Designer over business rules unless specific sequencing or immediate database logic is required, and Flow Designer handles approvals, tasks and notifications without code (<Src k="docsFlowDesigner">source</Src>).</>}
            examAngle="Choosing Flow Designer for a human approval process."
          />
          <Scenario
            industry="Media"
            title="A partner integration needs a breaking change to a response format"
            situation="Two partners call your endpoint; one needs a new field structure, the other can't change yet."
            reasoning={<>Publish a new version of the Scripted REST API in the URI, so the existing integration keeps using the old version; if no version is marked default, the latest is used (<Src k="docsScriptedRest">source</Src>).</>}
            examAngle="API versioning instead of in-place changes."
          />
          <Scenario
            industry="Education"
            title="A school district's app keeps breaking after upgrades"
            situation="Each upgrade surfaces regressions that users report days later."
            reasoning={<>The Automated Test Framework exists to confirm the instance still works after changes such as upgrades, and tests should run only on non-production instances (<Src k="docsAtf">source</Src>).</>}
            examAngle="ATF as upgrade regression protection, outside production."
          />
        </div>
      </GuideSection>

      <GuideSection id="misconceptions" eyebrow="Myths" title="Misconceptions that cost marks">
        <div className="grid gap-4 md:grid-cols-2">
          <Misconception myth="&ldquo;Client scripts run on lists too.&rdquo;">
            Client scripts generally run on forms and search pages, not lists, with onCellEdit as the exception (<Src k="docsClientScripts">source</Src>).
          </Misconception>
          <Misconception myth="&ldquo;Async business rules run in a fixed order.&rdquo;">
            Async rules run through a scheduled job, and the order isn&apos;t guaranteed when several update the same record (<Src k="docsBusinessRules">source</Src>).
          </Misconception>
          <Misconception myth="&ldquo;A user must pass every matching ACL.&rdquo;">
            A user must pass all conditions within an ACL, but if several ACLs match at the same point, passing any one grants access (<Src k="docsAcl">source</Src>).
          </Misconception>
          <Misconception myth="&ldquo;Global scope is fine for new apps.&rdquo;">
            ServiceNow recommends scoped apps for new tables because global apps can unintentionally alter data (<Src k="docsAppScope">source</Src>).
          </Misconception>
        </div>
      </GuideSection>

      <GuideSection id="logistics" eyebrow="Logistics" title="Booking, fees and retakes in 2026">
        <ul className="list-disc space-y-3 pl-6">
          <li>Exams are registered and paid for in ServiceNow University and scheduled through Pearson VUE; vouchers no longer exist (<Src k="examChanges2026">source</Src>). A May 2026 Community reply for a CAD candidate confirms this and notes you have 90 days to schedule and complete the exam once registered (<Src k="cadVoucherThread">source</Src>).</li>
          <li>The CAD exam fee is $300 USD excluding tax; a retake is $150 (<Src k="examChanges2026">source</Src>).</li>
          <li>Retake waits: 3 days before the second attempt, 30 days before the third, then 6 months (<Src k="examChanges2026">source</Src>).</li>
          <li>The cut score isn&apos;t published; exams are scored against a predetermined cut score that isn&apos;t shared (<Src k="cutScoreThread">source</Src>).</li>
          <li>We haven&apos;t found a public ServiceNow source for the current CAD question count and time limit, so we don&apos;t quote one. Check the <Src k="cadBlueprint">blueprint</Src>.</li>
        </ul>
        <p>
          For costs across certifications, see <In href="/blog/servicenow-certification-cost-2026">ServiceNow certification cost in 2026</In>.
        </p>
      </GuideSection>

      <GuideSection id="practice" eyebrow="Practice" title="Try some free CAD practice questions">
        <p>
          Three free questions from our CAD bank are below. The rest, organised by blueprint area, are on the <In href="/cad/practice-questions">CAD practice questions page</In>.
        </p>
      </GuideSection>
      {sample.length > 0 && <SampleQuestions questions={sample} certSlug="cad" certName="CAD" />}
      <div className="mt-10">
        <StudyCluster certSlug="cad" currentPath="/blog/servicenow-cad-exam-complete-guide-2026" />
      </div>

      <SourcesList keys={CAD_GUIDE_SOURCES} />
    </div>
  );
}
