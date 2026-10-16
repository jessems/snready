// Long-form, sourced section of the /cad hub. Every product behaviour or exam
// fact links to a source in lib/sources.ts.

import { BlueprintChart, Callout, Card, GuideSection, In, Misconception, Scenario, SourcesList, Src, Toc } from "@/components/guide/GuideParts";
import { ExamLogistics, logisticsSourceKeys } from "@/components/guide/ExamLogistics";
import { StudyCluster } from "@/components/guide/StudyCluster";
import { getBlueprint } from "@/lib/cert-sources";
import type { SourceKey } from "@/lib/sources";

export function ScopedAppDiagram() {
  const inside = [
    { x: 150, y: 70, label: "Tables + data model" },
    { x: 330, y: 70, label: "Forms + client scripts" },
    { x: 150, y: 130, label: "Business rules" },
    { x: 330, y: 130, label: "Script includes" },
    { x: 150, y: 190, label: "ACLs" },
    { x: 330, y: 190, label: "Flows + properties" },
  ];
  return (
    <figure className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <svg viewBox="0 0 720 300" role="img" aria-labelledby="cad-scope-title" className="h-auto w-full">
        <title id="cad-scope-title">A scoped application and what crosses its boundary</title>
        <rect x="130" y="20" width="370" height="240" rx="18" className="fill-emerald-50 stroke-emerald-500 dark:fill-emerald-950/40" strokeWidth="2" strokeDasharray="8 5" />
        <text x="315" y="48" textAnchor="middle" className="fill-emerald-900 text-[14px] font-bold dark:fill-emerald-200">Application scope (namespace)</text>
        {inside.map((item) => (
          <g key={item.label}>
            <rect x={item.x} y={item.y} width="160" height="44" rx="10" className="fill-white stroke-emerald-300 dark:fill-zinc-900 dark:stroke-emerald-800" />
            <text x={item.x + 80} y={item.y + 27} textAnchor="middle" className="fill-zinc-800 text-[12px] font-semibold dark:fill-zinc-100">{item.label}</text>
          </g>
        ))}
        <rect x="560" y="40" width="150" height="60" rx="12" className="fill-zinc-100 stroke-zinc-300 dark:fill-zinc-900 dark:stroke-zinc-700" />
        <text x="635" y="66" textAnchor="middle" className="fill-zinc-900 text-[12px] font-bold dark:fill-zinc-100">Other applications</text>
        <text x="635" y="84" textAnchor="middle" className="fill-zinc-600 text-[11px] dark:fill-zinc-400">need explicit access</text>
        <line x1="500" y1="80" x2="558" y2="70" className="stroke-rose-400" strokeWidth="2" />
        <rect x="560" y="140" width="150" height="60" rx="12" className="fill-zinc-100 stroke-zinc-300 dark:fill-zinc-900 dark:stroke-zinc-700" />
        <text x="635" y="166" textAnchor="middle" className="fill-zinc-900 text-[12px] font-bold dark:fill-zinc-100">External systems</text>
        <text x="635" y="184" textAnchor="middle" className="fill-zinc-600 text-[11px] dark:fill-zinc-400">REST, imports</text>
        <line x1="500" y1="170" x2="558" y2="170" className="stroke-sky-500" strokeWidth="2" />
        <rect x="10" y="110" width="100" height="60" rx="12" className="fill-zinc-100 stroke-zinc-300 dark:fill-zinc-900 dark:stroke-zinc-700" />
        <text x="60" y="136" textAnchor="middle" className="fill-zinc-900 text-[12px] font-bold dark:fill-zinc-100">Developers</text>
        <text x="60" y="154" textAnchor="middle" className="fill-zinc-600 text-[11px] dark:fill-zinc-400">delegated</text>
        <line x1="110" y1="140" x2="130" y2="140" className="stroke-violet-500" strokeWidth="2" />
        <text x="315" y="285" textAnchor="middle" className="fill-zinc-500 text-[11px] dark:fill-zinc-400">Source control and deployment move the whole scope between instances</text>
      </svg>
      <figcaption className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
        A mental model built from the <Src k="docsAppScope">application scope</Src> and <Src k="docsDelegatedDev">delegated development</Src> documentation, not an official diagram.
      </figcaption>
    </figure>
  );
}

export function WhereCodeRunsDiagram() {
  const columns = [
    { x: 10, title: "Browser", items: ["onLoad", "onChange", "onSubmit", "onCellEdit (lists)"], fill: "fill-violet-50 dark:fill-violet-950/40", stroke: "stroke-violet-400" },
    { x: 250, title: "Server", items: ["Business rules: before / after / async / display", "Script includes (loaded on demand)", "Flows and subflows"], fill: "fill-amber-50 dark:fill-amber-950/40", stroke: "stroke-amber-400" },
    { x: 490, title: "Integration edge", items: ["Scripted REST API resources", "Versioned URIs (v1, v2)", "REST_Endpoint ACLs", "Import sets"], fill: "fill-sky-50 dark:fill-sky-950/40", stroke: "stroke-sky-400" },
  ];
  return (
    <figure className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <svg viewBox="0 0 720 230" role="img" aria-labelledby="cad-runs-title" className="h-auto w-full">
        <title id="cad-runs-title">Where CAD-level code runs</title>
        {columns.map((col) => (
          <g key={col.title}>
            <rect x={col.x} y="10" width="220" height="200" rx="14" className={`${col.fill} ${col.stroke}`} strokeWidth="1.5" />
            <text x={col.x + 110} y="38" textAnchor="middle" className="fill-zinc-900 text-[15px] font-bold dark:fill-zinc-50">{col.title}</text>
            {col.items.map((item, i) => (
              <text key={item} x={col.x + 16} y={70 + i * 34} className="fill-zinc-700 text-[11.5px] dark:fill-zinc-300">{`• ${item}`}</text>
            ))}
          </g>
        ))}
        <path d="M230 120 L250 120" className="stroke-zinc-500" strokeWidth="2" />
        <text x="240" y="112" textAnchor="middle" className="fill-zinc-500 text-[10px]">GlideAjax</text>
        <path d="M470 120 L490 120" className="stroke-zinc-500" strokeWidth="2" />
      </svg>
      <figcaption className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
        Built from the <Src k="docsClientScripts">client scripts</Src>, <Src k="docsBusinessRules">business rules</Src>, <Src k="docsScriptIncludes">script includes</Src> and <Src k="docsScriptedRest">scripted REST API</Src> documentation.
      </figcaption>
    </figure>
  );
}

export const CAD_CONCEPT_SOURCES: SourceKey[] = [
  "docsAppScope", "docsClientScripts", "docsBusinessRules", "docsScriptIncludes", "docsAcl",
  "docsFlowDesigner", "docsScriptedRest", "docsImportSets", "docsDelegatedDev", "docsAtf",
];

export function CadDeepDive() {
  const blueprint = getBlueprint("cad");
  const sourceKeys: SourceKey[] = ["cadBlueprint", "welcomeCourse", "developerSite", ...CAD_CONCEPT_SOURCES, ...logisticsSourceKeys("cad")];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="py-10">
        <Toc
          items={[
            ["#cad-blueprint", "What the CAD exam tests"],
            ["#cad-architecture", "How a scoped app fits together"],
            ["#cad-scenarios", "Worked industry scenarios"],
            ["#cad-misconceptions", "Common misconceptions"],
            ["#cad-logistics", "Exam logistics"],
            ["#cad-practice", "Practice questions"],
            ["#sources", "Sources"],
          ]}
        />
        <p className="mt-8 text-lg leading-8 text-zinc-700 dark:text-zinc-300">
          The Certified Application Developer exam is less about writing clever JavaScript and more about knowing where code should live. A ServiceNow application is a scoped bundle of tables, forms, server logic, access rules, automation and integrations. The exam asks you to place each requirement in the right part of that bundle and to protect the bundle from everything outside it. This page builds that mental model, maps it to the official blueprint, and works through scenarios from different industries.
        </p>
      </div>

      <GuideSection id="cad-blueprint" eyebrow="Blueprint" title="What the CAD exam tests">
        <p>
          The <Src k="cadBlueprint">CAD exam blueprint (KB0011498, updated January 2026)</Src> splits the exam into six domains. Four of them carry 20% each, so no single area lets you skip the others.
        </p>
        {blueprint && <BlueprintChart blueprint={blueprint} sourceKey="cadBlueprint" />}
        <p>
          Read the objectives closely and a pattern appears: almost every domain mixes a <em>design</em> decision with an <em>implementation</em> skill. &ldquo;Determine if an application is a good fit with ServiceNow&rdquo; sits next to &ldquo;design and implement a data model&rdquo;. &ldquo;Use Application Scope to protect application artifacts&rdquo; sits next to &ldquo;use GlideSystem methods to script security&rdquo;. Managing Applications asks about Delegated Development and the ServiceNow Git integration, which are about how teams work, not about syntax.
        </p>
        <p>
          The blueprint points to the <Src k="welcomeCourse">Welcome to ServiceNow</Src> course and to the <Src k="developerSite">ServiceNow Developer site</Src> as resources. If you haven&apos;t passed CSA, start with the <In href="/csa">CSA exam overview</In>: CAD assumes you already understand the platform layers it covers.
        </p>
      </GuideSection>

      <GuideSection id="cad-architecture" eyebrow="Mental model" title="How a scoped application fits together">
        <ScopedAppDiagram />
        <p>
          <strong>Scope is the boundary.</strong> Application scoping protects applications by &ldquo;identifying and restricting access to application files and data&rdquo;. A scoped app can access and change its own tables and business logic, while other applications need explicit permission, and each app gets a namespace identifier that prevents naming conflicts. ServiceNow recommends scoped apps for new tables, and runtime access settings decide whether API or web service calls can run against an application table (<Src k="docsAppScope">Application scope</Src>).
        </p>
        <p>
          <strong>Code lives where it runs.</strong> Client scripts run in the browser on forms: onLoad when the form renders, onChange when a field changes, onSubmit when the form is submitted (returning false cancels it), and onCellEdit when a list cell is edited (<Src k="docsClientScripts">Client scripts</Src>). Business rules run on the server before or after the database operation, asynchronously, or on display (<Src k="docsBusinessRules">Business rules</Src>). Script includes hold reusable server-side functions and classes; they load only when requested, which is why they are preferred over global business rules, and Glide AJAX-enabled script includes can be called from client scripts but are private by default (<Src k="docsScriptIncludes">Script includes</Src>).
        </p>
        <WhereCodeRunsDiagram />
        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Security is evaluated, not hoped for">
            <p>
              An ACL has a decision type (Allow-If or Deny-Unless), the object it secures, the operation, and conditions: roles, security attributes, data conditions and scripts. A user must pass all conditions of a matching ACL; if nothing grants access, access is denied. ACLs can target objects in their own scope, and wildcard table rules are only allowed in global (<Src k="docsAcl">Access Control Lists</Src>).
            </p>
          </Card>
          <Card title="Automation has a preferred tool">
            <p>
              ServiceNow recommends Flow Designer over legacy workflows for new process flows in almost all cases, and over business rules unless specific sequencing or immediate database logic is needed. For IntegrationHub, the guidance is one spoke per integration system (<Src k="docsFlowDesigner">Flow Designer</Src>).
            </p>
          </Card>
          <Card title="External data enters through defined doors">
            <p>
              Inbound files go through import sets and transform maps (<Src k="docsImportSets">Import sets</Src>). Custom endpoints are Scripted REST APIs: each resource defines an HTTP method and a processing script, versions in the URI (such as v1) let you change an API without breaking existing integrations, and callers must satisfy at least one ACL of type REST_Endpoint (<Src k="docsScriptedRest">Scripted REST APIs</Src>).
            </p>
          </Card>
          <Card title="Teams, not just code">
            <p>
              Delegated development lets designated users without the admin role build or deploy applications, with permissions that are specific to each application (<Src k="docsDelegatedDev">Delegated development</Src>). The Automated Test Framework checks that an instance still works after a change, and ServiceNow says to run tests only on non-production instances (<Src k="docsAtf">ATF</Src>).
            </p>
          </Card>
        </div>
        <Callout title="The two questions to ask on every CAD scenario">
          <p>1. Where does this logic run: browser, server, or the integration edge?</p>
          <p>2. Who is allowed to touch it: this app, another scope, an external caller, or a delegated developer?</p>
        </Callout>
      </GuideSection>

      <GuideSection id="cad-scenarios" eyebrow="Worked scenarios" title="Industry scenarios, solved like a developer">
        <p>These are illustrative situations, not real exam questions.</p>
        <div className="space-y-6">
          <Scenario
            industry="Insurance"
            title="A claims app must read policy data owned by another team's application"
            situation="You are building a scoped claims-intake app. Adjusters need to see policy details that live in a different scoped application."
            reasoning={<>Scope means the other application&apos;s tables are not yours by default: other apps need explicit permission, which the owning application grants through its application and table settings (<Src k="docsAppScope">source</Src>). The design conversation is with the owning team about what access to grant, not a workaround in your own code.</>}
            examAngle="Cross-scope access is granted by the owner of the data, not assumed by the consumer."
          />
          <Scenario
            industry="Logistics"
            title="A shipment form must block impossible delivery dates, including from integrations"
            situation="Dispatchers enter shipments on a form, but a partner system also creates shipments through an API."
            reasoning={<>An onChange or onSubmit client script gives dispatchers instant feedback, and returning false from onSubmit cancels the submission (<Src k="docsClientScripts">source</Src>). It does nothing for the API path. A before business rule applies whether records arrive via forms, lists or web services (<Src k="docsBusinessRules">source</Src>), so the rule that must always hold goes on the server; the client script is a usability extra.</>}
            examAngle="Client-side validation for experience, server-side validation for integrity."
          />
          <Scenario
            industry="Telecom"
            title="A partner needs an endpoint to check order status"
            situation="A reseller wants to query order status from its own portal without seeing anything else in your instance."
            reasoning={<>A Scripted REST API gives you a purpose-built endpoint with its own resources and parameters, a version in the URI so you can evolve it safely, and REST_Endpoint ACLs the caller must satisfy (<Src k="docsScriptedRest">source</Src>). Exposing a narrow, versioned resource is a better answer than handing out broad table access.</>}
            examAngle="Choosing a scripted, versioned, ACL-protected endpoint for a custom integration."
          />
          <Scenario
            industry="Public sector"
            title="A department wants its own developers to maintain a small case app"
            situation="The central platform team doesn't want to give department staff the admin role, but the department needs to build and deploy changes to its own app."
            reasoning={<>Delegated development grants application-specific developer and deployment permissions without admin rights (<Src k="docsDelegatedDev">source</Src>). Pair it with ATF tests run on non-production instances so changes are checked before they move (<Src k="docsAtf">source</Src>).</>}
            examAngle="Delegated development as a governance tool, and ATF as a safety net outside production."
          />
        </div>
      </GuideSection>

      <GuideSection id="cad-misconceptions" eyebrow="Misconceptions" title="Common CAD misconceptions">
        <div className="grid gap-4 md:grid-cols-2">
          <Misconception myth="&ldquo;CAD is a JavaScript exam.&rdquo;">
            Scripting runs through several domains, but the blueprint weights design, UI, security and automation at 20% each, and managing applications (Delegated Development, Git integration) at 10% (<Src k="cadBlueprint">CAD blueprint</Src>).
          </Misconception>
          <Misconception myth="&ldquo;Business rules are the default way to automate.&rdquo;">
            ServiceNow recommends Flow Designer over business rules unless specific sequencing or immediate database logic is needed (<Src k="docsFlowDesigner">Flow Designer</Src>).
          </Misconception>
          <Misconception myth="&ldquo;A client-callable script include is open to everyone.&rdquo;">
            Glide AJAX-enabled script includes are private by default, so guests on public pages can&apos;t run them unless you change that (<Src k="docsScriptIncludes">Script includes</Src>).
          </Misconception>
          <Misconception myth="&ldquo;You need 70% to pass.&rdquo;">
            The cut score is predetermined and not shared with candidates (<Src k="cutScoreThread">ServiceNow Community, Jul 2026</Src>).
          </Misconception>
        </div>
      </GuideSection>

      <GuideSection id="cad-logistics" eyebrow="Logistics" title="CAD exam logistics in 2026">
        <ExamLogistics certSlug="cad" />
        <p>
          For a study plan built around these domains, read the <In href="/blog/servicenow-cad-exam-complete-guide-2026">CAD exam study guide on the blog</In>.
        </p>
      </GuideSection>

      <GuideSection id="cad-practice" eyebrow="Practice" title="Practise placing code in the right place">
        <p>
          Try the free sample questions further down this page, then continue with <In href="/cad/practice-questions">CAD practice questions by topic</In>. For each answer, say out loud where the code runs and who can reach it. If you can&apos;t, that topic needs another pass.
        </p>
        <StudyCluster certSlug="cad" currentPath="/cad" />
      </GuideSection>

      <SourcesList keys={sourceKeys} />
    </div>
  );
}
