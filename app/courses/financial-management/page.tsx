import { Metadata } from "next";
import Link from "next/link";

const canonicalPath = "/courses/financial-management";

export const metadata: Metadata = {
  title: "ServiceNow Financial Management Course for Architects",
  description:
    "A practical ServiceNow Financial Management course for architects: cost models, IT shared services, allocation rules, application TCO, showback, SPM/APM alignment, implementation phases, examples, visuals, and governance.",
  keywords: [
    "ServiceNow Financial Management",
    "ServiceNow ITFM architecture",
    "ServiceNow cost model",
    "ServiceNow application TCO",
    "ServiceNow showback",
    "ServiceNow Strategic Portfolio Management financials",
    "ServiceNow APM financial management",
  ],
  alternates: {
    canonical: canonicalPath,
  },
  openGraph: {
    title: "ServiceNow Financial Management Course for Architects",
    description:
      "Learn ServiceNow Financial Management as an architecture discipline: cost transparency, allocation models, TCO, showback, governance, and rollout strategy.",
    url: canonicalPath,
    type: "article",
  },
};

const officialSources = [
  {
    label: "Financial Management for licensed SPM users",
    href: "https://www.servicenow.com/docs/r/xanadu/it-business-management/financial-management/financial-management-spm.html",
  },
  {
    label: "Financial Management for licensed APM users",
    href: "https://www.servicenow.com/docs/r/xanadu/it-business-management/financial-management/financial-management-apm.html",
  },
  {
    label: "Use cost analysis to view the allocation of amount",
    href: "https://www.servicenow.com/docs/r/xanadu/it-business-management/financial-management/financial-management-cost-analysis.html",
  },
  {
    label: "Financial reporting in Application Portfolio Management",
    href: "https://www.servicenow.com/docs/r/xanadu/it-business-management/application-portfolio-management/financial-reporting.html",
  },
  {
    label: "Financial planning workbench",
    href: "https://www.servicenow.com/docs/r/xanadu/it-business-management/strategic-portfolio-management/financial-planning-workbench.html",
  },
];

const modules = [
  { href: "#what-it-is", title: "What Financial Management is" },
  { href: "#architects-care", title: "Why architects care" },
  { href: "#core-model", title: "The cost model mental model" },
  { href: "#data-foundation", title: "Data foundation" },
  { href: "#allocation", title: "Allocation and rollup design" },
  { href: "#apm-spm", title: "APM and SPM scenarios" },
  { href: "#examples", title: "Real-world examples" },
  { href: "#decisions", title: "Architecture decisions" },
  { href: "#implementation", title: "Implementation phases" },
  { href: "#governance", title: "Governance model" },
  { href: "#mistakes", title: "Anti-patterns" },
  { href: "#troubleshooting", title: "Troubleshooting" },
  { href: "#metrics", title: "Measuring success" },
  { href: "#checklist", title: "Architect checklist" },
];

const conceptCards = [
  {
    title: "Cost model",
    body: "The financial structure that decides which spend enters the model, which segment accounts receive it, and which rules roll that spend from buckets to services, applications, portfolios, or business units.",
  },
  {
    title: "Cost bucket",
    body: "A container for spend categories such as compute, storage, network, service desk, security, database, end-user compute, IT management, or application run costs.",
  },
  {
    title: "Segment account",
    body: "A target dimension that receives cost: business applications, service offerings, IT shared services, business units, departments, or other architecture-defined account layers.",
  },
  {
    title: "Allocation metric",
    body: "The weighting logic used to distribute shared cost. Examples include active users, server count through CI relationships, subscribers, service offering weights, business-unit headcount, or custom consumption data.",
  },
  {
    title: "Showback",
    body: "A transparency practice that shows consumers what their services or applications cost without necessarily charging them directly. It changes behavior by making cost visible and explainable.",
  },
  {
    title: "Application TCO",
    body: "The total cost of ownership for a business application, including direct application spend and allocated portions of shared infrastructure, support, security, and operational services.",
  },
];

const industryExamples = [
  {
    title: "Banking application portfolio rationalization",
    summary:
      "A bank wants to compare the cost of three payment platforms before consolidating them. Financial Management can allocate shared compute, database, monitoring, security, and service desk costs to business applications so Enterprise Architecture can compare cost, risk, usage, and business capability coverage together.",
    components: ["Business applications", "Payment capabilities", "Compute", "Database", "Security", "Service desk", "Active users", "TCO dashboard"],
    lesson:
      "The architecture problem is not simply calculating a number. It is designing a cost model credible enough that application owners accept it when it challenges their roadmap.",
  },
  {
    title: "Healthcare shared service showback",
    summary:
      "A hospital system wants transparency into the cost of patient portal, scheduling, lab integration, and clinical reporting services. Shared services such as identity, network, storage, security, and monitoring must be allocated to service offerings without implying false precision.",
    components: ["Service offerings", "Patient services", "Identity", "Network", "Storage", "Monitoring", "Subscribers", "Allocation maps"],
    lesson:
      "In regulated environments, explainability matters. A less granular model that executives trust is often better than a mathematically clever model nobody can defend.",
  },
  {
    title: "Manufacturing plant technology budgeting",
    summary:
      "A manufacturer needs to understand the run cost of MES, shop-floor integrations, data historians, and ERP interfaces across plants. Architects must decide whether to allocate costs by plant, business unit, application, service offering, asset count, or a hybrid of these dimensions.",
    components: ["Plants", "MES", "Historians", "ERP integrations", "Network zones", "Business units", "Headcount", "Consumption weights"],
    lesson:
      "The unit of accountability determines the model. If plant leaders control demand, plant-level dimensions matter. If application owners control roadmaps, application TCO matters.",
  },
  {
    title: "SaaS portfolio cost transparency",
    summary:
      "An enterprise has many SaaS subscriptions with overlapping capabilities. ServiceNow can help relate software spend, business applications, capabilities, owners, and consumers so finance and architecture teams can target redundancy without treating every SaaS invoice as isolated procurement data.",
    components: ["SaaS contracts", "Business capabilities", "Owners", "User counts", "Business units", "Renewals", "Application portfolio"],
    lesson:
      "Financial Management becomes more valuable when it is connected to portfolio decisions, not when it is treated as a back-office reporting exercise.",
  },
  {
    title: "Public sector service accountability",
    summary:
      "A government agency wants to show the cost of citizen-facing digital services. Shared network, hosting, identity, accessibility testing, security operations, and support costs must roll into services in a way that can be explained to program owners and auditors.",
    components: ["Citizen services", "Programs", "Identity", "Hosting", "Security", "Support", "Audit", "Showback reports"],
    lesson:
      "The model must support defensible governance: source data, allocation rationale, approvals, and versioned assumptions matter as much as the dashboard.",
  },
];

const antiPatterns = [
  ["Starting with dashboards", "Dashboards expose the model; they do not create trust. Start with decision questions, data ownership, allocation logic, and governance."],
  ["Using one allocation method for everything", "Equal allocation is easy but often misleading. Use different metrics where consumption patterns differ enough to matter."],
  ["Pretending precision equals accuracy", "A four-decimal allocation can still be wrong if the source data, relationship data, or business assumptions are weak."],
  ["Ignoring CSDM and portfolio structure", "Financial Management should reinforce the service and application model, not create a parallel taxonomy used only by finance."],
  ["Loading GL data too early", "If segment accounts and allocation rules are immature, importing more financial data just produces more controversial reports."],
  ["No owner for allocation exceptions", "Architects need a process for disputes, corrections, overrides, and evidence. Otherwise the first contested report kills adoption."],
  ["Confusing showback with chargeback", "Showback teaches and creates transparency. Chargeback changes budgets and behavior. Do not introduce chargeback-level consequences before the model is trusted."],
  ["Measuring success by records created", "Measure cost explainability, allocation coverage, decision adoption, dispute rate, and whether portfolio decisions actually use the outputs."],
];

const implementationPhases = [
  {
    title: "Frame the decisions",
    detail:
      "Name the decisions Financial Management must improve: application rationalization, service pricing, budget planning, cloud optimization, vendor renewals, portfolio prioritization, or accountability for shared services.",
  },
  {
    title: "Define the financial architecture",
    detail:
      "Choose cost models, buckets, segment layers, account sources, and fiscal periods. Decide where ServiceNow will be authoritative and where it will consume data from finance systems.",
  },
  {
    title: "Validate source data",
    detail:
      "Review business applications, service offerings, business units, departments, users, CI relationships, ownership, and shared services before making financial reports visible.",
  },
  {
    title: "Design allocation metrics",
    detail:
      "Select weighting logic by cost type: active users for app consumption, server count or compute for infrastructure, subscribers for service offerings, headcount for business units, and allocation maps for known consumption.",
  },
  {
    title: "Run a pilot model",
    detail:
      "Pick a small set of services or applications with motivated owners. Run the model, inspect cost lines, compare against expectations, and document disputed assumptions.",
  },
  {
    title: "Operationalize governance",
    detail:
      "Publish definitions, source ownership, refresh cadence, exception handling, approval checkpoints, and dashboard usage expectations. Then expand only when the pilot model survives executive review.",
  },
];

const troubleshootingSteps = [
  "Confirm which decision the report is supposed to support; vague cost curiosity leads to vague model design.",
  "Trace one dollar from source spend through bucket, segment account, metric, allocation line, rollup, and report.",
  "Validate that business applications, service offerings, users, business units, and CI relationships are current enough for allocation use.",
  "Check whether equal allocation is being used because it is correct or simply because no one supplied consumption data.",
  "Compare generated cost lines against the workbench view and historical fiscal periods before changing rules for the current model.",
  "Review whether allocation disputes are about bad math, bad data, missing ownership, or disagreement about accountability.",
  "Test dashboards with actual service owners and finance stakeholders before presenting them as executive truth.",
  "Decide which exceptions deserve model changes and which should remain documented business assumptions.",
];

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-slate-200 py-14 dark:border-slate-800">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl">{title}</h2>
      <div className="mt-6 space-y-5 text-lg leading-8 text-slate-700 dark:text-slate-300">{children}</div>
    </section>
  );
}

function Callout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-slate-800 shadow-sm dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-slate-200">
      <h3 className="text-lg font-semibold text-emerald-950 dark:text-emerald-100">{title}</h3>
      <div className="mt-3 text-base leading-7">{children}</div>
    </div>
  );
}

function CostModelVisual() {
  const layers = [
    ["Spend sources", "Budget entries, invoices, GL extracts, cloud costs, labor assumptions"],
    ["Cost buckets", "Compute, storage, network, security, support, application run"],
    ["Allocation metrics", "Active users, subscribers, CI relationships, headcount, weights"],
    ["Segment accounts", "Applications, service offerings, business units, portfolios"],
    ["Decisions", "Showback, TCO, planning, rationalization, investment tradeoffs"],
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="space-y-3">
        {layers.map(([title, detail], index) => (
          <div key={title} className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-emerald-50 p-4 dark:border-slate-800 dark:from-slate-900 dark:to-emerald-950/30" style={{ marginLeft: `${index * 14}px` }}>
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">{index + 1}</span>
              <div>
                <p className="font-semibold text-slate-950 dark:text-white">{title}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AllocationVisual() {
  const steps = ["Spend", "Bucket", "Metric", "Weight", "Account", "Cost line", "Report"];
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
      <div className="grid gap-3 md:grid-cols-7">
        {steps.map((step, index) => (
          <div key={step} className="relative rounded-2xl bg-white/10 p-4 text-center ring-1 ring-white/15">
            <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400 text-sm font-bold text-slate-950">{index + 1}</div>
            <p className="text-sm font-semibold">{step}</p>
            {index < steps.length - 1 && <span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-emerald-300 md:block">→</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ComparisonVisual() {
  const columns = [
    { title: "Finance", answer: "Where did money go?", items: ["Budgets and actuals", "Fiscal periods", "GL discipline", "Accountability"] },
    { title: "Architecture", answer: "What does spend support?", items: ["Applications", "Services", "Capabilities", "Dependencies"] },
    { title: "ServiceNow FM", answer: "How should cost be explained?", items: ["Cost models", "Allocations", "Showback", "TCO dashboards"] },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {columns.map((column) => (
        <div key={column.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h3 className="text-xl font-bold text-slate-950 dark:text-white">{column.title}</h3>
          <p className="mt-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">{column.answer}</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
            {column.items.map((item) => (
              <li key={item} className="flex gap-2"><span className="text-emerald-600">●</span>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ScenarioVisual({ title, nodes }: { title: string; nodes: string[] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <h3 className="text-lg font-bold text-slate-950 dark:text-white">{title}</h3>
      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {nodes.map((node, index) => (
          <div key={node} className="relative rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            <span className="absolute -top-2 -left-2 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">{index + 1}</span>
            {node}
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Read this as a simplified cost story. Real models branch by fiscal period, source system, account layer, and governance rule.</p>
    </div>
  );
}

function RoadmapVisual() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="space-y-4">
        {implementationPhases.map((phase, index) => (
          <div key={phase.title} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white dark:bg-white dark:text-slate-950">{index + 1}</span>
              {index < implementationPhases.length - 1 && <span className="h-10 w-px bg-slate-300 dark:bg-slate-700" />}
            </div>
            <div className="pt-1">
              <p className="font-semibold text-slate-950 dark:text-white">{phase.title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{phase.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TroubleshootingVisual() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="grid gap-3 md:grid-cols-2">
        {troubleshootingSteps.map((step, index) => (
          <div key={step} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">Check {index + 1}</p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FinancialManagementCoursePage() {
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "ServiceNow Financial Management Course for Architects",
    description:
      "A practical course explaining ServiceNow Financial Management for architects, including cost models, allocation metrics, application TCO, SPM and APM financials, implementation strategy, governance, troubleshooting, and real-world examples.",
    provider: {
      "@type": "Organization",
      name: "SNReady",
      sameAs: "https://snready.com",
    },
  };

  return (
    <div className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />

      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white dark:border-slate-800">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,#34d399_0,transparent_28%),radial-gradient(circle_at_80%_10%,#10b981_0,transparent_22%),radial-gradient(circle_at_50%_90%,#0f766e_0,transparent_24%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-300">ServiceNow architecture course</p>
            <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">ServiceNow Financial Management, explained for architects</h1>
            <p className="mt-6 text-xl leading-9 text-slate-200 md:text-2xl">
              Learn how to design credible cost models, allocation rules, TCO views, and showback practices that connect IT spend to applications, services, portfolios, and business decisions.
            </p>
            <div className="mt-8 grid gap-3 text-sm text-slate-200 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">Built for ServiceNow architects, platform owners, and implementation consultants</div>
              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">Practical, visual, and focused on architecture decisions rather than clicks</div>
              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">Grounded in official ServiceNow Financial Management, APM, and SPM concepts</div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Course modules</h2>
            <nav className="mt-4 space-y-2">
              {modules.map((module) => (
                <a key={module.href} href={module.href} className="block rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 dark:text-slate-300 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-200">
                  {module.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <article className="min-w-0">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-lg leading-8 text-slate-700 dark:text-slate-300">
              Financial Management in ServiceNow is easy to underestimate because the phrase sounds like accounting. For architects, it is much more interesting: it is the discipline of translating technical architecture into financial accountability. It helps answer questions like which applications are expensive to run, which services consume shared infrastructure, which portfolios deserve investment, and which cost allocations are defensible enough to influence executive decisions.
            </p>
            <p className="mt-5 text-lg leading-8 text-slate-700 dark:text-slate-300">
              This course is not a click-by-click configuration manual. It teaches the architecture mental model behind ServiceNow Financial Management: how cost models work, how allocation metrics shape behavior, how APM and SPM financial views differ, and how to avoid building a beautiful dashboard that nobody trusts.
            </p>
          </section>

          <Section id="what-it-is" eyebrow="Module 1" title="What ServiceNow Financial Management is">
            <p>
              ServiceNow Financial Management helps organizations model, allocate, analyze, and communicate the cost of technology services and applications. In the ServiceNow ecosystem, it is closely connected to Strategic Portfolio Management, Enterprise Architecture, Application Portfolio Management, business applications, service offerings, IT shared services, cost buckets, fiscal periods, and allocation rules.
            </p>
            <p>
              Official ServiceNow documentation describes seeded cost models for licensed SPM and APM users. SPM users can use a Service Offering Costing model to allocate expenses and generate cost lines for services offered at each level. APM users can use a Business Application Costing model to evaluate the cost of business applications with prescribed metrics. Both models depend on the same architectural idea: costs should flow through a deliberate model, not just appear in a report.
            </p>
            <CostModelVisual />
            <Callout title="Architect mental model">
              Think of Financial Management as a translation layer between finance data and architecture data. Finance knows dollars. Architecture knows applications, services, capabilities, owners, users, and dependencies. The cost model decides how those worlds meet.
            </Callout>
          </Section>

          <Section id="architects-care" eyebrow="Module 2" title="Why architects should care about financial management">
            <p>
              Architects make tradeoffs. They choose whether to modernize, retire, consolidate, outsource, automate, or tolerate risk. Those decisions are incomplete without cost context. A technically elegant platform may be economically unsustainable. A legacy application may look cheap until shared support, database, security, storage, and incident effort are included. A cloud migration may reduce hardware spend while increasing operational, licensing, or observability cost.
            </p>
            <p>
              ServiceNow Financial Management gives architects a place to connect portfolio structure with financial reality. The goal is not to replace the finance system. The goal is to explain technology spend in terms the organization can act on: applications, services, portfolios, business units, owners, and demand drivers.
            </p>
            <ComparisonVisual />
            <p>
              The most important architectural shift is moving from “What did IT spend?” to “Which services and applications consumed the spend, why, and what decisions should change because of it?” That shift requires credible data, transparent assumptions, and governance around exceptions.
            </p>
          </Section>

          <Section id="core-model" eyebrow="Module 3" title="The cost model mental model">
            <p>
              A cost model is not just a ServiceNow configuration object. It is the organization&apos;s financial argument. It says which categories of cost exist, which account layers matter, which source tables define those accounts, how spend enters the model, how allocations are calculated, and which outputs are reliable enough for decisions.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {conceptCards.map((card) => (
                <div key={card.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <h3 className="text-xl font-bold text-slate-950 dark:text-white">{card.title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-400">{card.body}</p>
                </div>
              ))}
            </div>
            <p>
              In the Business Application Costing model, ServiceNow documentation describes cost buckets tied to the ITFM bucket table, IT shared service segment accounts sourced from the IT shared service table, business application segment accounts sourced from business application records, and business unit layers tied to business units. In the Service Offering Costing model, IT shared services can roll up to service offerings. These are more than table references; they are architecture choices about accountability.
            </p>
          </Section>

          <Section id="data-foundation" eyebrow="Module 4" title="The data foundation architects must validate">
            <p>
              Financial Management depends on data that often belongs to different teams. Finance owns budget and actual spend. Enterprise Architecture owns business application quality. Service owners own service offering meaning. CMDB and ITOM teams own CI and relationship quality. HR or identity teams may influence user, department, and business-unit counts. Procurement may own contract data. If those teams are not aligned, the cost model will expose political and data-quality problems quickly.
            </p>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <div className="grid gap-4 md:grid-cols-3">
                {["Business applications", "Service offerings", "IT shared services", "Business units", "Users and departments", "CI relationships", "Cost buckets", "Fiscal periods", "Allocation maps"].map((item) => (
                  <div key={item} className="rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-100">{item}</div>
                ))}
              </div>
            </div>
            <p>
              The architect&apos;s job is to decide what “good enough” means for each dataset. You do not need perfect CMDB maturity to start. You do need to know which allocation rules depend on CI relationships, which reports depend on active users, and which business decisions will be harmed if those inputs are stale.
            </p>
            <Callout title="Readiness question">
              Before building a model, ask: if an application owner disputes a cost number, can we trace the number to source spend, bucket, allocation metric, receiving account, and business assumption? If not, the model is not ready for executive use.
            </Callout>
          </Section>

          <Section id="allocation" eyebrow="Module 5" title="Allocation and rollup design">
            <p>
              Allocation is where architecture becomes behavior. If database costs are allocated equally across applications, teams have little reason to reduce consumption. If costs are allocated by active users, high-adoption applications may look expensive even if they are efficient. If infrastructure cost is allocated by server count, heavily virtualized or containerized architectures may be distorted. Every metric tells a story, and people will optimize for the story.
            </p>
            <AllocationVisual />
            <p>
              ServiceNow&apos;s prescribed metrics include examples such as allocating shared service cost to applications based on active user count, allocating application cost based on compute power through CI relationships, allocating to business unit based on headcount, allocating shared service cost to service offerings based on service offering weights, related CIs, or total subscribers. These are starting points, not universal answers.
            </p>
            <p>
              A good architect chooses allocation metrics by cost behavior. Some costs are fixed platform costs and should not pretend to vary with consumption. Some costs are driven by users, transactions, storage, compute, subscribers, or support volume. Some costs are strategic investments and should be explained separately rather than buried inside a run-cost model.
            </p>
          </Section>

          <Section id="apm-spm" eyebrow="Module 6" title="APM and SPM financial scenarios">
            <p>
              Financial Management means different things depending on the decision context. In Enterprise Architecture or APM, the common question is application total cost of ownership: what does this application cost when direct and allocated shared costs are considered? In SPM, the question may be whether portfolio investments, demands, projects, and service offerings are financially aligned to strategy and capacity.
            </p>
            <ScenarioVisual title="Application TCO cost story" nodes={["Finance spend", "IT shared services", "Allocation metrics", "Business application", "Capability map", "TCO dashboard", "Rationalization decision", "Roadmap action"]} />
            <p>
              For APM, Financial Management should support lifecycle and rationalization conversations: tolerate, invest, migrate, consolidate, retire. For SPM, it should support planning conversations: which investments deserve funding, which services consume budget, which initiatives exceed plan, and where demand should be reshaped.
            </p>
            <p>
              The architecture mistake is mixing these without intent. A business application TCO model, a service offering showback model, and a project financial planning model can share data, but they answer different questions and may need different account layers, metrics, owners, and review cadences.
            </p>
          </Section>

          <Section id="examples" eyebrow="Module 7" title="Real-world financial management examples">
            <div className="space-y-5">
              {industryExamples.map((example) => (
                <div key={example.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <h3 className="text-2xl font-bold text-slate-950 dark:text-white">{example.title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-400">{example.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {example.components.map((component) => (
                      <span key={component} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">{component}</span>
                    ))}
                  </div>
                  <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700 dark:bg-slate-900 dark:text-slate-300">{example.lesson}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="decisions" eyebrow="Module 8" title="Architecture decisions that shape the implementation">
            <p>
              Financial Management implementations succeed or fail on architectural decisions made before configuration begins. The most important decision is the accountable dimension: are you explaining cost by application, service offering, business unit, portfolio, project, product, capability, or some combination? Each option creates a different operating model.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["Granularity", "Model costs at the level where someone can act. Too high and it is vague; too low and it becomes expensive to maintain."],
                ["Source of spend", "Decide whether spend is entered directly, loaded from GL, imported from cloud tooling, or modeled from assumptions."],
                ["Allocation fairness", "Prefer explainable fairness over false precision. Document why each metric was chosen."],
                ["Historical stability", "Do not rewrite history casually. Cost analysis for prior periods should remain useful even as current rules evolve."],
                ["Ownership", "Name owners for source data, model rules, allocation disputes, dashboards, and executive signoff."],
                ["Integration boundary", "Define what ServiceNow calculates versus what remains in ERP, FP&A, procurement, or cloud cost tooling."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <h3 className="text-xl font-bold text-slate-950 dark:text-white">{title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-400">{body}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="implementation" eyebrow="Module 9" title="Implementation phases without click-by-click instructions">
            <p>
              Treat Financial Management as a business architecture rollout, not a widget deployment. A practical rollout starts with one or two decisions that matter, a constrained model scope, and a small group of stakeholders willing to validate uncomfortable numbers.
            </p>
            <RoadmapVisual />
            <p>
              The pilot should produce more than dashboards. It should produce a documented model: source data, buckets, account layers, metric definitions, refresh cadence, known limitations, dispute handling, and examples of decisions the model can support. If the pilot cannot survive scrutiny, expanding it will only create a larger trust problem.
            </p>
          </Section>

          <Section id="governance" eyebrow="Module 10" title="Governance: the hidden work that makes numbers trusted">
            <p>
              Financial reports have social consequences. Once cost is visible, teams will argue about fairness, ownership, missing consumption data, shared services, and whether the model punishes teams for architecture choices they inherited. That is normal. Governance turns those arguments into a controlled improvement loop rather than a reason to abandon the model.
            </p>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <div className="grid gap-4 md:grid-cols-2">
                {["Model owner", "Finance data steward", "Application owner", "Service owner", "CMDB/ITOM owner", "Portfolio owner", "Executive sponsor", "Dispute approver"].map((role) => (
                  <div key={role} className="rounded-2xl border border-slate-200 p-4 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-300">{role}</div>
                ))}
              </div>
            </div>
            <p>
              Good governance defines what can be changed, who approves it, how past periods are protected, how exceptions are documented, how dashboards are labeled, and when a model is mature enough to influence budgets. Without this, Financial Management becomes a report people screenshot when it supports their position and ignore when it does not.
            </p>
          </Section>

          <Section id="mistakes" eyebrow="Module 11" title="Common anti-patterns">
            <div className="space-y-3">
              {antiPatterns.map(([bad, better]) => (
                <div key={bad} className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:grid-cols-[240px_1fr]">
                  <div className="font-bold text-red-700 dark:text-red-300">{bad}</div>
                  <div className="text-base leading-7 text-slate-700 dark:text-slate-300">{better}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section id="troubleshooting" eyebrow="Module 12" title="Troubleshooting a model nobody trusts">
            <p>
              When stakeholders reject Financial Management outputs, do not start by defending the dashboard. Trace the number. A useful troubleshooting path follows the money from source data to cost line to report, then separates mathematical defects from data defects and governance disagreements.
            </p>
            <TroubleshootingVisual />
            <p>
              Cost analysis is valuable because it lets analysts inspect generated cost lines for a fiscal period, including bucket amount, amount allocated to accounts, and rolled-up amount across segments and accounts based on allocation engine results. Architects should use that transparency to explain the model, not hide behind summaries.
            </p>
          </Section>

          <Section id="metrics" eyebrow="Module 13" title="How to measure success">
            <p>
              Success is not a dashboard going live. Success is when decision-makers use cost transparency to make better decisions and the model is trusted enough to survive disagreement. Measure whether portfolio reviews include TCO, whether service owners understand showback, whether allocation disputes decline, whether poor source data gets remediated, and whether investment decisions change because cost is now visible.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["Coverage", "Percent of priority applications or service offerings with validated cost views."],
                ["Explainability", "Percent of reported cost that can be traced to documented source, metric, and assumption."],
                ["Adoption", "Number of portfolio, planning, or service reviews that use the model."],
                ["Dispute health", "Open allocation disputes, aging, root causes, and resolution rate."],
                ["Data improvement", "Issues found and fixed in applications, users, business units, and relationships."],
                ["Decision impact", "Retirements, consolidations, renegotiations, or investment shifts influenced by cost transparency."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <h3 className="text-lg font-bold text-slate-950 dark:text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{body}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="checklist" eyebrow="Module 14" title="Architect checklist">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <ul className="space-y-3 text-base leading-7 text-slate-700 dark:text-slate-300">
                <li>□ Name the business decisions Financial Management must improve.</li>
                <li>□ Choose the accountable dimensions: application, service offering, business unit, portfolio, project, or capability.</li>
                <li>□ Inventory the source data required for each allocation metric.</li>
                <li>□ Validate ownership and quality for business applications, service offerings, users, business units, and CI relationships.</li>
                <li>□ Document every cost bucket, allocation rule, metric, refresh cadence, and known limitation.</li>
                <li>□ Pilot with a narrow group of stakeholders before executive rollout.</li>
                <li>□ Use cost analysis to trace sample dollars through generated cost lines.</li>
                <li>□ Establish a dispute process before publishing showback dashboards.</li>
                <li>□ Keep chargeback consequences out until showback is trusted.</li>
                <li>□ Measure decision adoption, not just dashboard usage.</li>
              </ul>
            </div>
          </Section>

          <section className="border-t border-slate-200 py-14 dark:border-slate-800">
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Sources and further reading</h2>
            <p className="mt-4 text-lg leading-8 text-slate-700 dark:text-slate-300">
              This course is based on official ServiceNow documentation for Financial Management, Strategic Portfolio Management financials, Application Portfolio Management financial reporting, and implementation-oriented architecture practice.
            </p>
            <div className="mt-6 grid gap-3">
              {officialSources.map((source) => (
                <Link key={source.href} href={source.href} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-emerald-700 shadow-sm hover:border-emerald-300 hover:text-emerald-900 dark:border-slate-800 dark:bg-slate-950 dark:text-emerald-300 dark:hover:border-emerald-800 dark:hover:text-emerald-100">
                  {source.label} →
                </Link>
              ))}
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
