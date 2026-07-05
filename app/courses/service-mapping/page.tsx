import { Metadata } from "next";
import Link from "next/link";

const canonicalPath = "/courses/service-mapping";

export const metadata: Metadata = {
  title: "ServiceNow Service Mapping Course for Architects",
  description:
    "A practical ServiceNow Service Mapping course for architects: application service design, CMDB alignment, discovery methods, MID Servers, credentials, patterns, CSDM, implementation phases, examples, visuals, and troubleshooting.",
  keywords: [
    "ServiceNow Service Mapping",
    "ServiceNow application service mapping",
    "ServiceNow ITOM architecture",
    "ServiceNow CMDB service mapping",
    "ServiceNow Discovery vs Service Mapping",
    "ServiceNow CSDM application services",
  ],
  alternates: {
    canonical: canonicalPath,
  },
  openGraph: {
    title: "ServiceNow Service Mapping Course for Architects",
    description:
      "Learn ServiceNow Service Mapping as an architectural discipline with practical examples, implementation tradeoffs, and visual service maps.",
    url: canonicalPath,
    type: "article",
  },
};

const officialSources = [
  {
    label: "Exploring Service Mapping",
    href: "https://www.servicenow.com/docs/r/xanadu/it-operations-management/service-mapping/service-mapping-get-started.html",
  },
  {
    label: "Service Mapping flow",
    href: "https://www.servicenow.com/docs/r/xanadu/it-operations-management/service-mapping/service-mapping-flow.html",
  },
  {
    label: "Prerequisites for top-down discovery",
    href: "https://www.servicenow.com/docs/r/xanadu/it-operations-management/service-mapping/prerequisites-service-mapping.html",
  },
  {
    label: "Verify Service Mapping readiness",
    href: "https://www.servicenow.com/docs/r/xanadu/it-operations-management/service-mapping/check-service-mapping-readiness-for-mapping.html",
  },
  {
    label: "Traversal rules in Service Mapping",
    href: "https://www.servicenow.com/docs/r/xanadu/it-operations-management/service-mapping/traversal-rules-service-mapping.html",
  },
  {
    label: "Service Mapping reference",
    href: "https://www.servicenow.com/docs/r/xanadu/it-operations-management/service-mapping/service-mapping-reference.html",
  },
];

const modules = [
  { href: "#what-it-is", title: "What Service Mapping is" },
  { href: "#problem", title: "The operational problem" },
  { href: "#discovery-cmdb", title: "Discovery, CMDB, and Service Mapping" },
  { href: "#concepts", title: "Core concepts architects must know" },
  { href: "#how-it-works", title: "How mapping works conceptually" },
  { href: "#strategy", title: "Designing a mapping strategy" },
  { href: "#csdm", title: "CSDM and application services" },
  { href: "#examples", title: "Real-world service maps" },
  { href: "#decisions", title: "Architecture decisions" },
  { href: "#implementation", title: "Implementation phases" },
  { href: "#mistakes", title: "Anti-patterns" },
  { href: "#troubleshooting", title: "Troubleshooting" },
  { href: "#modern", title: "Modern architectures" },
  { href: "#operations", title: "Operational value" },
  { href: "#metrics", title: "Measuring success" },
  { href: "#checklist", title: "Architect checklist" },
];

const conceptCards = [
  {
    title: "Application service",
    body: "The operational view of a running service: the web tiers, application runtimes, databases, middleware, cloud resources, integrations, and other CIs that together deliver a capability to users or another system.",
  },
  {
    title: "Entry point",
    body: "The place Service Mapping starts: a URL, host and port, load balancer VIP, application process, API endpoint, or other known access path that represents how the service is reached.",
  },
  {
    title: "MID Server",
    body: "The secure worker inside the customer network or cloud environment that reaches targets, runs discovery commands, and sends results back to the ServiceNow instance.",
  },
  {
    title: "Credentials",
    body: "Host credentials, applicative credentials, elevated Unix permissions, SNMP communities, cloud credentials, and specialized permissions that let patterns inspect technologies deeply enough to identify CIs and connections.",
  },
  {
    title: "Patterns",
    body: "The logic used to identify devices, applications, processes, configuration, and outbound connections. Out-of-box patterns cover many common technologies; custom patterns fill organization-specific gaps.",
  },
  {
    title: "Relationships",
    body: "The CMDB connections that make the map valuable: runs on, hosted on, depends on, connects to, contains, uses, and similar relationships. Relationship quality matters more than raw CI volume.",
  },
];

const industryExamples = [
  {
    title: "Ecommerce checkout",
    summary:
      "A customer-facing checkout service depends on CDN routing, load balancers, web and app tiers, inventory APIs, payment gateways, fraud scoring, queues, and an order database. Service Mapping helps architects see why a database patch, expiring certificate, or payment gateway outage can stop revenue in minutes.",
    components: ["CDN", "Load balancer", "Web tier", "Checkout API", "Inventory API", "Payment gateway", "Fraud service", "Message queue", "Order DB"],
    lesson:
      "The interesting part is not that these components exist. The interesting part is the direction of dependency and which shared services are in the critical path of completing an order.",
  },
  {
    title: "Hospital patient portal",
    summary:
      "A patient portal may depend on SSO, scheduling, lab results, EHR integrations, FHIR or HL7 interfaces, notification services, and databases that live in different network zones. The map supports incident triage and helps avoid risky changes during clinical operating windows.",
    components: ["Patient URL", "SSO", "Portal app", "EHR adapter", "FHIR API", "Scheduling", "Lab results", "SMS/email", "Clinical DB"],
    lesson:
      "Healthcare maps need strong validation from application owners because a technically small dependency can carry patient-care or compliance impact.",
  },
  {
    title: "Banking payment platform",
    summary:
      "A digital payments service may touch mobile channels, payment orchestration, fraud engines, message buses, core banking, key management, external payment networks, and audit stores. Architecture decisions here focus on resilience, change risk, and proving operational dependency awareness.",
    components: ["Mobile/API gateway", "Payment API", "Fraud engine", "Message bus", "Core banking", "HSM/KMS", "External network", "Ledger DB"],
    lesson:
      "For regulated services, a partial map is useful for discovery work but dangerous if leaders treat it as complete operational truth.",
  },
  {
    title: "Internal HR and payroll",
    summary:
      "Internal services can still have high business impact. HR self-service may depend on SSO, HR SaaS, payroll providers, document storage, scheduled integrations, email, reporting databases, and batch jobs that run outside business hours.",
    components: ["Employee portal", "SSO", "HR SaaS", "Payroll provider", "Docs", "Batch jobs", "Email", "Reporting DB"],
    lesson:
      "Architects should map batch dependencies and external SaaS boundaries deliberately; otherwise the service looks healthy until the overnight payroll integration fails.",
  },
  {
    title: "Manufacturing shop-floor integration",
    summary:
      "A plant integration service may combine MES, PLC or edge gateways, local servers, data historians, ERP integration, segmented networks, and cloud analytics. Direct access may be constrained by OT safety rules, so MID Server placement and credential strategy become architectural decisions, not administration details.",
    components: ["Plant network", "Edge gateway", "MES", "Historian", "Integration server", "ERP", "Cloud analytics", "Monitoring"],
    lesson:
      "In OT environments, the best architecture may intentionally map less deeply but with stronger validation and clearer dependency documentation.",
  },
];

const antiPatterns = [
  ["Mapping everything first", "Start with a small set of critical services where dependency visibility will change incident, change, or resilience decisions."],
  ["Treating the first map as truth", "Treat the initial map as a hypothesis. Review it with application owners and operations teams before operationalizing it."],
  ["Ignoring service ownership", "Define who owns the service, who validates the map, and who approves future corrections before mapping at scale."],
  ["Weak credential strategy", "Plan host, applicative, SNMP, cloud, and elevated permissions by environment and security zone before blaming the tool."],
  ["Overusing manual relationships", "Manual corrections are sometimes necessary, but too many manual links become stale architecture debt."],
  ["Measuring CI count", "Measure relationship accuracy, map freshness, validated services, and usefulness in incidents and changes instead."],
  ["Skipping CSDM alignment", "Use Service Mapping to support a governed service model, not to create a parallel taxonomy nobody understands."],
  ["Forgetting shared services", "Identity, DNS, API gateways, queues, certificates, and network services often explain real outages better than the main app server."],
];

const troubleshootingSteps = [
  "Confirm the service boundary and entry point.",
  "Confirm DNS, routing, firewall paths, and load balancer behavior from the MID Server network zone.",
  "Validate host, applicative, SNMP, cloud, and elevated credentials against the actual technology stack.",
  "Check whether horizontal Discovery has recently found the expected hosts, load balancers, and cloud resources.",
  "Review pattern behavior for unrecognized applications, generic application CIs, and missing outbound connections.",
  "Look for CI identification problems that create duplicates instead of reconciling to existing records.",
  "Validate the resulting relationships with application owners and operations SMEs.",
  "Decide whether custom patterns, traversal rules, tags, or deliberately modeled external dependencies are needed.",
];

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-slate-200 py-14 dark:border-slate-800">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-400">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl">{title}</h2>
      <div className="mt-6 space-y-5 text-lg leading-8 text-slate-700 dark:text-slate-300">{children}</div>
    </section>
  );
}

function Callout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-6 text-slate-800 shadow-sm dark:border-cyan-900/70 dark:bg-cyan-950/30 dark:text-slate-200">
      <h3 className="text-lg font-semibold text-cyan-950 dark:text-cyan-100">{title}</h3>
      <div className="mt-3 text-base leading-7">{children}</div>
    </div>
  );
}

function StackVisual() {
  const layers = [
    ["Business outcome", "Sell products, treat patients, process payroll"],
    ["Business service", "Customer checkout, patient portal, payroll service"],
    ["Application service", "Runtime service map with owners and criticality"],
    ["Application components", "Web, app, APIs, queues, batch, integrations"],
    ["Technology foundation", "Hosts, containers, databases, cloud, network, storage"],
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="space-y-3">
        {layers.map(([title, detail], index) => (
          <div key={title} className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-cyan-50 p-4 dark:border-slate-800 dark:from-slate-900 dark:to-cyan-950/30" style={{ marginLeft: `${index * 14}px` }}>
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-600 text-sm font-bold text-white">{index + 1}</span>
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

function ComparisonVisual() {
  const columns = [
    { title: "Discovery", answer: "What infrastructure and applications exist?", items: ["Finds CIs", "Uses MID Servers", "Populates CMDB", "Often horizontal"] },
    { title: "CMDB", answer: "What do we know and trust about those CIs?", items: ["Stores CIs", "Stores relationships", "Uses IRE", "Supports governance"] },
    { title: "Service Mapping", answer: "Which CIs support this service, and how?", items: ["Builds application services", "Maps dependencies", "Supports impact", "Needs validation"] },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {columns.map((column) => (
        <div key={column.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h3 className="text-xl font-bold text-slate-950 dark:text-white">{column.title}</h3>
          <p className="mt-2 text-sm font-medium text-cyan-700 dark:text-cyan-300">{column.answer}</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
            {column.items.map((item) => (
              <li key={item} className="flex gap-2"><span className="text-cyan-600">●</span>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function FlowVisual() {
  const steps = ["Entry point", "MID Server", "Credentials", "Patterns", "CIs", "Relationships", "Validated map"];
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
      <div className="grid gap-3 md:grid-cols-7">
        {steps.map((step, index) => (
          <div key={step} className="relative rounded-2xl bg-white/10 p-4 text-center ring-1 ring-white/15">
            <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400 text-sm font-bold text-slate-950">{index + 1}</div>
            <p className="text-sm font-semibold">{step}</p>
            {index < steps.length - 1 && <span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-cyan-300 md:block">→</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ServiceMapVisual({ title, nodes }: { title: string; nodes: string[] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <h3 className="text-lg font-bold text-slate-950 dark:text-white">{title}</h3>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {nodes.map((node, index) => (
          <div key={node} className="relative rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            <span className="absolute -top-2 -left-2 flex h-7 w-7 items-center justify-center rounded-full bg-cyan-600 text-xs font-bold text-white">{index + 1}</span>
            {node}
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Read this left-to-right as a simplified dependency chain. Real maps branch, merge, and include shared services.</p>
    </div>
  );
}

function MatrixVisual() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
        {["Business criticality", "Operational pain", "Technical complexity", "Mapping feasibility"].map((item) => (
          <div key={item} className="rounded-2xl bg-cyan-50 p-4 font-semibold text-cyan-950 dark:bg-cyan-950/40 dark:text-cyan-100">{item}</div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
        Prioritize services that score high in business value and operational pain but are feasible enough to validate. Avoid starting with the most politically complex service in the company.
      </div>
    </div>
  );
}

function RoadmapVisual() {
  const phases = ["Foundation", "Service selection", "Initial mapping", "Validation", "Remediation", "Operationalization"];
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="space-y-4">
        {phases.map((phase, index) => (
          <div key={phase} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white dark:bg-white dark:text-slate-950">{index + 1}</span>
              {index < phases.length - 1 && <span className="h-8 w-px bg-slate-300 dark:bg-slate-700" />}
            </div>
            <div className="pt-2">
              <p className="font-semibold text-slate-950 dark:text-white">{phase}</p>
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
            <p className="text-sm font-bold text-cyan-700 dark:text-cyan-300">Check {index + 1}</p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ServiceMappingCoursePage() {
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "ServiceNow Service Mapping Course for Architects",
    description:
      "A practical course explaining ServiceNow Service Mapping for architects, including application service modeling, CMDB alignment, discovery methods, implementation strategy, troubleshooting, and real-world examples.",
    provider: {
      "@type": "Organization",
      name: "SNReady",
      sameAs: "https://snready.com",
    },
  };

  return (
    <div className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />

      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 text-white dark:border-slate-800">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,#22d3ee_0,transparent_28%),radial-gradient(circle_at_80%_10%,#38bdf8_0,transparent_22%),radial-gradient(circle_at_50%_90%,#0f766e_0,transparent_24%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">ServiceNow architecture course</p>
            <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">ServiceNow Service Mapping, explained for architects</h1>
            <p className="mt-6 text-xl leading-9 text-slate-200 md:text-2xl">
              Learn how Service Mapping turns infrastructure data into service context: what it is, how it works, how to design a mapping strategy, and how to avoid the traps that make maps untrusted.
            </p>
            <div className="mt-8 grid gap-3 text-sm text-slate-200 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">Built for ServiceNow architects and implementation consultants</div>
              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">Visual, practical, and grounded in real service examples</div>
              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">Based on official ServiceNow docs and implementation best practices</div>
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
                <a key={module.href} href={module.href} className="block rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-cyan-50 hover:text-cyan-800 dark:text-slate-300 dark:hover:bg-cyan-950/40 dark:hover:text-cyan-200">
                  {module.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <article className="min-w-0">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-lg leading-8 text-slate-700 dark:text-slate-300">
              Service Mapping is easy to describe badly. People often say it is a way to draw application dependency maps. That is not wrong, but it undersells the work. In a mature ServiceNow environment, Service Mapping is the bridge between technical discovery and operational decision-making. It connects CIs to application services so incident managers, change managers, event teams, service owners, and architects can reason about service impact instead of staring at isolated servers and databases.
            </p>
            <p className="mt-5 text-lg leading-8 text-slate-700 dark:text-slate-300">
              This course is intentionally practical. It is not a click-by-click configuration manual. Instead, it teaches the mental model an architect needs before designing a rollout, challenging a vendor proposal, reviewing a failed map, or explaining why a CMDB with many CIs still cannot answer a simple question: what breaks if this component fails?
            </p>
          </section>

          <Section id="what-it-is" eyebrow="Module 1" title="What Service Mapping is">
            <p>
              Service Mapping discovers and maintains maps of application services. An application service is the operational representation of a running service: the infrastructure, applications, integrations, databases, cloud resources, network dependencies, and other CIs that work together to deliver something useful. The value is not just a pretty picture. The value is service context.
            </p>
            <p>
              Official ServiceNow documentation describes Service Mapping as discovering application services and building maps of devices, applications, configuration profiles, and their interconnections. It relies on Discovery and MID Servers, uses methods such as pattern-based, tag-based, traffic-based, and Predictive Intelligence-assisted discovery, and makes mapped data visible to capabilities such as Event Management, Dependency Views, and Application Portfolio Management.
            </p>
            <StackVisual />
            <Callout title="Architect mental model">
              Think of Service Mapping as living architecture documentation backed by discovered evidence. The tool can discover a lot, but architects still define service boundaries, decide what level of dependency matters, align the result to CSDM, and make sure service owners validate the map.
            </Callout>
          </Section>

          <Section id="problem" eyebrow="Module 2" title="The problem Service Mapping solves">
            <p>
              Most organizations have more inventory than understanding. They know servers exist. They may know software is installed. They may have monitoring alerts. But when a database is patched, a firewall rule changes, a certificate expires, or a load balancer pool drains, they still struggle to answer: which business services are impacted?
            </p>
            <p>
              Traditional horizontal discovery is excellent at finding things. It tells you there are Linux servers, Windows servers, database instances, application servers, network devices, and cloud resources. But a service outage rarely cares about your asset inventory boundaries. A checkout outage might involve an app server, a fraud API, a message queue, a payment provider, DNS, and an identity provider. A patient portal issue may start with SSO, not the portal code. A payroll failure may be caused by a scheduled integration nobody remembered to document.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 dark:border-rose-900/60 dark:bg-rose-950/20">
                <h3 className="font-bold text-rose-950 dark:text-rose-100">Without service context</h3>
                <ul className="mt-3 space-y-2 text-base leading-7 text-rose-900 dark:text-rose-200">
                  <li>Teams see isolated CIs and noisy alerts.</li>
                  <li>Change risk is guessed from tribal knowledge.</li>
                  <li>Major incident bridges spend time asking who owns what.</li>
                  <li>Architecture diagrams drift away from reality.</li>
                </ul>
              </div>
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900/60 dark:bg-emerald-950/20">
                <h3 className="font-bold text-emerald-950 dark:text-emerald-100">With trusted service maps</h3>
                <ul className="mt-3 space-y-2 text-base leading-7 text-emerald-900 dark:text-emerald-200">
                  <li>Teams see which services depend on a CI.</li>
                  <li>Changes can be assessed against upstream and downstream impact.</li>
                  <li>Events and incidents can be correlated to service health.</li>
                  <li>Architecture conversations start from discovered evidence.</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section id="discovery-cmdb" eyebrow="Module 3" title="Discovery, CMDB, and Service Mapping">
            <p>
              Architects must separate three related ideas. Discovery finds CIs and technical details. The CMDB stores CIs and relationships with governance, identification, reconciliation, and lifecycle expectations. Service Mapping organizes discovered and known CIs into application services so the organization understands service dependency and impact.
            </p>
            <ComparisonVisual />
            <p>
              Service Mapping does not magically fix a weak CMDB. If the environment has duplicate CIs, poor naming, missing ownership, bad lifecycle states, incomplete Discovery coverage, or unclear service taxonomy, the map will inherit those weaknesses. Service Mapping can reveal CMDB problems faster, but revealing a problem is not the same as solving it.
            </p>
            <p>
              A good architect designs Service Mapping as part of the wider CMDB and CSDM operating model. That means thinking about CI classes, relationship types, identification rules, reconciliation sources, ownership, service boundaries, and operational use cases before celebrating the first visual map.
            </p>
          </Section>

          <Section id="concepts" eyebrow="Module 4" title="Core concepts architects must know">
            <p>
              The vocabulary matters because many failed implementations are really alignment failures. One team says application, another means business application, another means application service, and operations only cares about what wakes them up at 2 AM. Service Mapping lives in that ambiguity, so architects need clear definitions.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {conceptCards.map((card) => (
                <div key={card.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <h3 className="text-xl font-bold text-slate-950 dark:text-white">{card.title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-700 dark:text-slate-300">{card.body}</p>
                </div>
              ))}
            </div>
            <p>
              Entry points deserve special attention. In real life, teams often provide an imprecise URL or a friendly application name and expect a perfect service map. Architects should ask: how do users reach the service? Is traffic terminated at a CDN, WAF, load balancer, API gateway, or reverse proxy? Is the first real internal dependency a virtual IP, a container ingress, an app process, or a message endpoint? A wrong entry point can make an accurate tool produce the wrong map.
            </p>
          </Section>

          <Section id="how-it-works" eyebrow="Module 5" title="How Service Mapping works conceptually">
            <p>
              Conceptually, Service Mapping starts with a definition of the service and one or more entry points. A MID Server reaches into the relevant network or cloud environment. Credentials and patterns allow inspection of hosts, applications, processes, configuration, and connections. CIs are identified or created in the CMDB. Relationships are built. Then humans review and refine the result.
            </p>
            <FlowVisual />
            <p>
              ServiceNow documentation distinguishes horizontal discovery from top-down mapping. Horizontal discovery finds infrastructure and applications as standalone objects. Top-down mapping follows dependencies from a service perspective so teams can understand how components affect the service instance. Service Mapping can use patterns, tags, traffic-based mapping, and Predictive Intelligence-assisted approaches depending on the environment and licensed capabilities.
            </p>
            <p>
              The human review loop is not optional. Official workflow guidance includes administrator setup, bulk or individual mapping, error resolution, administrator review, application service owner review, feedback, fine-tuning, approval, and finalization with access and attributes such as criticality. That is a governance workflow, not just a scan button.
            </p>
          </Section>

          <Section id="strategy" eyebrow="Module 6" title="Designing a Service Mapping strategy">
            <p>
              Do not start by asking, how do we map everything? Start by asking, where would better dependency visibility change decisions? Service Mapping is most valuable when the map will be used: incident impact, change risk, event correlation, resilience planning, application rationalization, or compliance evidence.
            </p>
            <MatrixVisual />
            <p>
              A practical first wave usually includes a small number of services with visible business impact, cooperative service owners, known pain, and enough discovery readiness to succeed. A revenue-generating checkout service, a high-incident internal portal, or a regulated payment platform can make a better pilot than a sprawling legacy ecosystem where nobody agrees who owns the service.
            </p>
            <Callout title="Good service selection criteria">
              Look for high incident volume, high change volume, revenue or compliance importance, executive visibility, known dependency confusion, and engaged application owners. Avoid services where mapping is politically important but operationally unusable because nobody will validate or maintain it.
            </Callout>
          </Section>

          <Section id="csdm" eyebrow="Module 7" title="Service Mapping and CSDM">
            <p>
              CSDM gives ServiceNow customers a shared language for service data. Service Mapping should support that model rather than create an isolated technical map collection. In practical terms, architects need to understand how a mapped application service relates to business applications, business services, technical services, service offerings, owners, and operational processes.
            </p>
            <p>
              A helpful shorthand is this: CSDM provides the language, CMDB stores the records, Discovery populates technical reality, and Service Mapping connects technical reality to service context. If those layers disagree, operational users lose trust. If they align, ServiceNow becomes much more useful for incident, change, event, resilience, and portfolio work.
            </p>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <div className="grid gap-3 md:grid-cols-5">
                {["Business application", "Application service", "Mapped CIs", "Operational processes", "Service insight"].map((item, index) => (
                  <div key={item} className="rounded-2xl bg-slate-50 p-4 text-center text-sm font-semibold dark:bg-slate-900">
                    <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-600 text-white">{index + 1}</div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Section id="examples" eyebrow="Module 8" title="Real-world architecture scenarios">
            <p>
              The examples below are simplified, but they reflect the kinds of architectural conversations Service Mapping should create. The point is not to memorize the components. The point is to learn how to think about service boundaries, shared dependencies, external integrations, and validation.
            </p>
            <div className="space-y-8">
              {industryExamples.map((example) => (
                <div key={example.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <h3 className="text-2xl font-bold text-slate-950 dark:text-white">{example.title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-700 dark:text-slate-300">{example.summary}</p>
                  <div className="mt-5"><ServiceMapVisual title={`${example.title} simplified dependency map`} nodes={example.components} /></div>
                  <p className="mt-4 rounded-2xl bg-cyan-50 p-4 text-base leading-7 text-cyan-950 dark:bg-cyan-950/30 dark:text-cyan-100">{example.lesson}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="decisions" eyebrow="Module 9" title="Common Service Mapping architecture decisions">
            <p>
              Service Mapping projects force design decisions. The tool cannot decide what your organization means by a service. It cannot decide how deep a map should go, which shared dependencies deserve representation, when manual modeling is acceptable, or who owns accuracy. Architects make those calls with stakeholders.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["What counts as a service?", "A checkout flow might be one service, or checkout, payment, inventory, and order management might be separate services. Choose boundaries based on ownership and operational decisions, not only system diagrams."],
                ["How deep should maps go?", "Mapping every dependency can create noise. Mapping too shallow hides risk. Decide the depth needed for incident, change, event, and resilience use cases."],
                ["How are shared services modeled?", "Identity, DNS, API gateways, queues, load balancers, monitoring, and databases may support many services. Model them consistently or impact analysis becomes confusing."],
                ["How much manual correction is acceptable?", "Manual links can be useful for SaaS, external vendors, or constrained environments. But if manual modeling becomes the default, map freshness will collapse."],
                ["Who owns accuracy?", "The ITOM team can run mapping, but application owners and service owners must validate meaning. Ownership must be explicit before production use."],
                ["What is good enough?", "A service map is never perfect. Define acceptable accuracy, known gaps, validation date, and the decisions the map is trusted to support."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <h3 className="text-xl font-bold text-slate-950 dark:text-white">{title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-700 dark:text-slate-300">{body}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="implementation" eyebrow="Module 10" title="Implementation phases">
            <p>
              A strong rollout is phased. ServiceNow readiness guidance highlights MID Server configuration, IP ranges, application and capability settings, credentials, load balancer discovery, recent horizontal discovery, NetFlow or VPC Flow Logs for traffic-based discovery, Cloud Discovery for IaaS, and Service Mapping Plus for some Predictive Intelligence scenarios. Architects should translate those checks into a project plan.
            </p>
            <RoadmapVisual />
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["1. Foundation readiness", "Confirm Discovery activation and coverage, CMDB health, MID Server placement, network reachability, credentials, IP ranges, cloud discovery needs, and ownership standards."],
                ["2. Service selection", "Choose services with clear business value, cooperative owners, known entry points, and explicit success criteria."],
                ["3. Initial mapping", "Define entry points, run mapping, review discovered CIs, identify missing dependencies, and document assumptions."],
                ["4. Validation", "Have application owners, service owners, operations, security, and infrastructure SMEs review the map against known architecture and operational reality."],
                ["5. Remediation", "Fix credentials, missing Discovery coverage, generic applications, duplicate CIs, pattern gaps, traversal rule issues, and wrong relationships."],
                ["6. Operationalization", "Use maps in incident, change, event, resilience, and architecture reviews. Define freshness checks and ownership for ongoing corrections."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <h3 className="text-xl font-bold text-slate-950 dark:text-white">{title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-700 dark:text-slate-300">{body}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="mistakes" eyebrow="Module 11" title="Common mistakes and anti-patterns">
            <p>
              Most Service Mapping failures are not caused by one missing checkbox. They come from treating mapping as a technical scan instead of an architecture and governance practice. The map may be technically generated but organizationally untrusted.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {antiPatterns.map(([bad, better]) => (
                <div key={bad} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-rose-600 dark:text-rose-400">Anti-pattern</p>
                  <h3 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">{bad}</h3>
                  <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">Better approach</p>
                  <p className="mt-2 text-base leading-7 text-slate-700 dark:text-slate-300">{better}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="troubleshooting" eyebrow="Module 12" title="Troubleshooting Service Mapping problems">
            <p>
              When a map fails, do not immediately jump to custom patterns. Walk the chain. Is the service boundary clear? Is the entry point correct? Can the MID Server reach it? Do credentials work? Has Discovery recently found related infrastructure? Are the expected technologies supported by patterns? Are CIs reconciling correctly? Are relationships semantically right?
            </p>
            <TroubleshootingVisual />
            <p>
              A map that stops too early often points to reachability, credentials, or pattern recognition. A map that includes irrelevant dependencies often points to boundary issues, shared dependency modeling, or traffic interpretation. Duplicate CIs point back to identification and reconciliation. Generic application CIs usually mean Service Mapping could see something running but could not identify it specifically enough.
            </p>
          </Section>

          <Section id="modern" eyebrow="Module 13" title="Service Mapping in modern architectures">
            <p>
              Modern environments make Service Mapping more valuable and harder. Cloud resources, SaaS platforms, containers, Kubernetes, serverless functions, API gateways, service meshes, message brokers, zero-trust networks, and third-party dependencies do not always behave like classic three-tier applications. The architect must decide where discovered mapping ends and explicit modeling begins.
            </p>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <div className="grid gap-3 md:grid-cols-4">
                {["Cloud IaaS/PaaS", "Containers", "API gateways", "Queues", "SaaS", "Identity", "Serverless", "External vendors"].map((item) => (
                  <div key={item} className="rounded-2xl bg-slate-50 p-4 text-center text-sm font-semibold dark:bg-slate-900">{item}</div>
                ))}
              </div>
            </div>
            <p>
              For example, a Kubernetes-hosted service may need infrastructure discovery, cloud discovery, cluster context, ingress understanding, API dependencies, and owner validation. A SaaS dependency may not be discoverable through MID Server commands at all, but it may still be operationally critical. The right answer is not always deeper automated discovery. Sometimes it is a clearly modeled external dependency with ownership, criticality, and review cadence.
            </p>
          </Section>

          <Section id="operations" eyebrow="Module 14" title="How Service Mapping supports IT operations">
            <p>
              Service Mapping should improve decisions. In incident management, it helps teams see which services may be impacted by a failed component. In change management, it helps assess downstream risk. In Event Management, mapped services can help correlate technical events to service health. In architecture, it reveals hidden dependencies, legacy components, and shared platforms that were invisible in static diagrams.
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                ["Incident", "What service is affected and who should join the bridge?"],
                ["Change", "Which application services depend on the CI being changed?"],
                ["Event", "How do technical alerts roll up to service impact?"],
                ["Architecture", "Which hidden dependencies increase resilience or modernization risk?"],
              ].map(([title, body]) => (
                <div key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <h3 className="text-xl font-bold text-slate-950 dark:text-white">{title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-700 dark:text-slate-300">{body}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="metrics" eyebrow="Module 15" title="Measuring Service Mapping success">
            <p>
              Bad metrics reward noisy maps. Good metrics reward trusted service intelligence. Count mapped services, but do not stop there. Track which maps are validated, how fresh they are, which critical services are covered, how many duplicate or generic CIs remain, and whether maps are actually used in incidents, changes, and operational reviews.
            </p>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  "Critical services mapped",
                  "Application owner validation rate",
                  "Relationship accuracy from SME review",
                  "Map freshness and recomputation health",
                  "Reduction in unknown incident impact",
                  "Change records using dependency context",
                  "Duplicate CI reduction for mapped services",
                  "Time to identify affected services",
                ].map((metric) => (
                  <div key={metric} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                    <span className="h-3 w-3 rounded-full bg-cyan-500" />
                    <span className="text-base font-medium text-slate-700 dark:text-slate-300">{metric}</span>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Section id="checklist" eyebrow="Module 16" title="Architect checklist">
            <p>
              Use this checklist before approving a Service Mapping rollout or declaring a service map operationally trusted.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                "Service boundary, owner, and purpose are clear.",
                "Entry points reflect how users and systems actually reach the service.",
                "MID Servers are placed in the right network and cloud zones.",
                "Host, applicative, SNMP, cloud, and elevated credentials are planned and tested.",
                "Horizontal Discovery coverage is recent enough to support mapping.",
                "CMDB identification and reconciliation issues are understood.",
                "CSDM alignment is documented for application services and related records.",
                "Application owners have reviewed and approved the map or documented gaps.",
                "Shared services and external dependencies are modeled consistently.",
                "Incident, change, event, or resilience processes know how to use the map.",
                "Manual relationships have owners and review cadence.",
                "Metrics focus on trust, freshness, and operational usefulness, not only CI count.",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 text-base leading-7 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                  <span className="mr-2 text-cyan-600">✓</span>{item}
                </div>
              ))}
            </div>
          </Section>

          <section className="border-t border-slate-200 py-14 dark:border-slate-800">
            <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Final mental model</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Service Mapping is service intelligence, not just dependency drawing</h2>
              <p className="mt-5 text-lg leading-8 text-slate-200">
                The best Service Mapping programs start small, validate aggressively, and connect maps to real operational processes. They treat maps as living architecture, not one-time documentation. The tool can discover components and relationships, but architects make the result meaningful by defining service boundaries, aligning to CSDM, validating with owners, and deciding how the map will be used when something changes or breaks.
              </p>
            </div>
          </section>

          <section className="border-t border-slate-200 py-14 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Sources and further reading</h2>
            <p className="mt-3 text-base leading-7 text-slate-700 dark:text-slate-300">
              This course is based on official ServiceNow documentation, locally available ServiceNow course/source material, and practical implementation patterns. Start with these ServiceNow docs for the product-specific details.
            </p>
            <ul className="mt-5 grid gap-3 md:grid-cols-2">
              {officialSources.map((source) => (
                <li key={source.href} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                  <Link href={source.href} className="font-semibold text-cyan-700 hover:text-cyan-900 dark:text-cyan-300 dark:hover:text-cyan-100">
                    {source.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </article>
      </div>
    </div>
  );
}
