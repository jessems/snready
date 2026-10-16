// Body of /blog/how-to-pass-servicenow-csa-first-time. Replaces the old
// markdown post and absorbs two merged posts (301s in public/_redirects):
// /blog/servicenow-csa-exam-what-they-dont-tell-you and
// /blog/csa-exam-reddit-tips-that-actually-work.
// Every exam fact or product behaviour links to a source in lib/sources.ts.

import { BlueprintChart, Callout, Card, GuideSection, In, Misconception, Scenario, SourcesList, Src, Toc } from "@/components/guide/GuideParts";
import { StudyCluster } from "@/components/guide/StudyCluster";
import { SampleQuestions } from "@/components/SampleQuestions";
import { getBlueprint } from "@/lib/cert-sources";
import { getFreeQuestionsForCertification } from "@/lib/data";
import type { SourceKey } from "@/lib/sources";

function WhereDoesItBelongDiagram() {
  const branches = [
    { q: "Who may read or change the data?", a: "Access control (ACL)", tone: "fill-rose-100 stroke-rose-400 dark:fill-rose-950/40" },
    { q: "Must it hold for forms, lists and integrations?", a: "Business rule (server)", tone: "fill-amber-100 stroke-amber-400 dark:fill-amber-950/40" },
    { q: "Only about how the form looks or behaves?", a: "UI policy / client script", tone: "fill-violet-100 stroke-violet-400 dark:fill-violet-950/40" },
    { q: "Data arriving from a file or another system?", a: "Import set + transform map", tone: "fill-sky-100 stroke-sky-400 dark:fill-sky-950/40" },
    { q: "Configuration moving dev → prod?", a: "Update set", tone: "fill-zinc-100 stroke-zinc-400 dark:fill-zinc-900" },
    { q: "A request with approvals and tasks?", a: "Catalog item + Flow Designer", tone: "fill-emerald-100 stroke-emerald-500 dark:fill-emerald-950/40" },
  ];
  return (
    <figure className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <svg viewBox="0 0 720 400" role="img" aria-labelledby="csa-tree-title" className="h-auto w-full">
        <title id="csa-tree-title">Where does a CSA requirement belong? A decision guide</title>
        <rect x="250" y="8" width="220" height="40" rx="12" className="fill-zinc-900 dark:fill-zinc-100" />
        <text x="360" y="33" textAnchor="middle" className="fill-white text-[13px] font-bold dark:fill-zinc-900">Requirement in the question</text>
        {branches.map((branch, i) => {
          const y = 70 + i * 54;
          return (
            <g key={branch.a}>
              <line x1="360" y1="48" x2="360" y2={y + 20} className="stroke-zinc-300 dark:stroke-zinc-700" strokeWidth="1.5" />
              <line x1="360" y1={y + 20} x2="380" y2={y + 20} className="stroke-zinc-300 dark:stroke-zinc-700" strokeWidth="1.5" />
              <text x="345" y={y + 25} textAnchor="end" className="fill-zinc-700 text-[12.5px] dark:fill-zinc-300">{branch.q}</text>
              <rect x="380" y={y} width="300" height="40" rx="10" className={branch.tone} strokeWidth="1.5" />
              <text x="530" y={y + 25} textAnchor="middle" className="fill-zinc-900 text-[13px] font-semibold dark:fill-zinc-100">{branch.a}</text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
        Our study aid, built from the <Src k="docsAcl">ACL</Src>, <Src k="docsBusinessRules">business rules</Src>, <Src k="docsClientScripts">client scripts</Src>, <Src k="docsImportSets">import sets</Src>, <Src k="docsUpdateSets">update sets</Src> and <Src k="docsFlowDesigner">Flow Designer</Src> documentation. Real requirements often need two layers (an ACL plus a tidy form, for example).
      </figcaption>
    </figure>
  );
}

function BookingFlowDiagram() {
  const steps = [
    ["Prepare", "Courses, PDI, practice"],
    ["Register + pay", "ServiceNow University"],
    ["Schedule", "Pearson VUE, within 90 days"],
    ["Sit the exam", "Pearson VUE, SSO sign-in"],
    ["Retake if needed", "3 days, then 30 days, then 6 months"],
  ];
  return (
    <figure className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <svg viewBox="0 0 740 140" role="img" aria-labelledby="csa-booking-title" className="h-auto w-full">
        <title id="csa-booking-title">From preparation to retake: the 2026 CSA booking flow</title>
        <defs>
          <marker id="csa-book-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" className="fill-emerald-500" />
          </marker>
        </defs>
        {steps.map(([title, detail], i) => {
          const x = 10 + i * 148;
          return (
            <g key={title}>
              <rect x={x} y="30" width="132" height="76" rx="12" className={i === 4 ? "fill-amber-50 stroke-amber-400 dark:fill-amber-950/40" : "fill-emerald-50 stroke-emerald-400 dark:fill-emerald-950/40"} strokeWidth="1.5" />
              <text x={x + 66} y="60" textAnchor="middle" className="fill-zinc-900 text-[13px] font-bold dark:fill-zinc-100">{title}</text>
              {detail.split(", ").map((line, j) => (
                <text key={line} x={x + 66} y={80 + j * 15} textAnchor="middle" className="fill-zinc-600 text-[10.5px] dark:fill-zinc-400">{line}</text>
              ))}
              {i < steps.length - 1 && <line x1={x + 132} y1="68" x2={x + 146} y2="68" className="stroke-emerald-500" strokeWidth="2" markerEnd="url(#csa-book-arrow)" />}
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
        Process from the <Src k="examChanges2026">2026 exam changes summary</Src> on the ServiceNow Community.
      </figcaption>
    </figure>
  );
}

export const CSA_GUIDE_SOURCES: SourceKey[] = [
  "csaBlueprint", "welcomeCourse", "adminFundamentalsCourse", "csaPrepThread", "csaLengthThread",
  "examChanges2026", "voucherEligibilityThread", "cadVoucherThread", "cutScoreThread",
  "docsAcl", "docsBusinessRules", "docsClientScripts", "docsImportSets", "docsUpdateSets", "docsFlowDesigner",
  "docsServiceCatalog", "docsKnowledge", "docsSecurityCenter", "docsCmdb", "docsCsdm", "docsCsdmFoundation", "docsPlatformAnalytics",
];

export async function CsaGuidePost() {
  const blueprint = getBlueprint("csa");
  const sample = (await getFreeQuestionsForCertification("csa")).slice(0, 3);

  return (
    <div className="not-prose">
      <Toc
        items={[
          ["#blueprint", "Read the blueprint like a study budget"],
          ["#mental-model", "Learn where each requirement belongs"],
          ["#plan", "A preparation plan that survives contact with the exam"],
          ["#scenarios", "Practise on realistic scenarios"],
          ["#reading-questions", "How to read CSA-style questions"],
          ["#misconceptions", "Myths to drop"],
          ["#booking", "Booking, fees and retakes in 2026"],
          ["#practice", "Try some practice questions"],
          ["#sources", "Sources"],
        ]}
      />

      <div className="mt-8 space-y-5 text-lg leading-8 text-zinc-700 dark:text-zinc-300">
        <p>
          It is easy to prepare for the Certified System Administrator exam as if it were a navigation test, and then discover it behaves more like a design test: one that keeps asking where a requirement belongs and which tool is the right one. This guide is about preparing for the second kind of exam. It replaces our older posts on CSA &ldquo;insider tips&rdquo; and community advice, keeping what can be backed by ServiceNow&apos;s own sources and dropping the rest.
        </p>
        <p>
          If you want the architecture view of the platform first, read the <In href="/csa">CSA exam overview</In>. This post is the practical companion: what to study, in what order, how to practise, and how booking works in 2026.
        </p>
      </div>

      <GuideSection id="blueprint" eyebrow="Step 1" title="Read the blueprint like a study budget">
        <p>
          The <Src k="csaBlueprint">official CSA blueprint (KB0011554, January 2026)</Src> is the only authoritative list of what the exam covers. Its weights tell you where your study hours should go:
        </p>
        {blueprint && <BlueprintChart blueprint={blueprint} sourceKey="csaBlueprint" showObjectives={false} />}
        <p>
          A simple rule: spend your time roughly in proportion to these weights, then add extra for whichever domain you&apos;ve touched least at work. Database Management and Platform Security (30%) deserves the biggest block. It covers the data schema, access control, importing data, the CMDB and CSDM, Security Center and the shared responsibility model. Navigation (7%) deserves the smallest, because you&apos;ll pick most of it up while practising everything else.
        </p>
        <p>
          The blueprint names <Src k="welcomeCourse">Welcome to ServiceNow</Src> and <Src k="adminFundamentalsCourse">ServiceNow Administration Fundamentals</Src> as suggested courses. Work through them with the blueprint open, and tick off each objective only when you can explain it without notes.
        </p>
      </GuideSection>

      <GuideSection id="mental-model" eyebrow="Step 2" title="Learn where each requirement belongs">
        <p>
          The single most useful skill for CSA is placing a requirement in the right layer of the platform. The exam rarely asks &ldquo;what is a business rule?&rdquo; in isolation; it describes a situation and offers several tools that could all, at first glance, work.
        </p>
        <WhereDoesItBelongDiagram />
        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Visibility is not security">
            <p>
              Client scripts run on forms (and onCellEdit on lists), and the documentation says they &ldquo;are not meant to protect unwanted access to data&rdquo;; use ACLs or data policies to restrict sensitive fields (<Src k="docsClientScripts">Client scripts</Src>). If no ACL grants access, access is denied (<Src k="docsAcl">ACLs</Src>).
            </p>
          </Card>
          <Card title="Server rules cover every door">
            <p>
              Business rules run on the server and apply whether a record is reached through a form, a list or a web service, which is why a field often needs both a business rule and a client script (<Src k="docsBusinessRules">Business rules</Src>).
            </p>
          </Card>
          <Card title="Data in, configuration out">
            <p>
              Imports use a data source and need at least one transform map for any production table (<Src k="docsImportSets">Import sets</Src>). Update sets group configuration changes so you can build on non-production and move them as a unit (<Src k="docsUpdateSets">Update sets</Src>).
            </p>
          </Card>
          <Card title="Self-service is a stack">
            <p>
              A catalog is a collection of catalog items, and you can publish several for different audiences (<Src k="docsServiceCatalog">Service Catalog</Src>). Flow Designer automates approvals, tasks, notifications and record operations without code (<Src k="docsFlowDesigner">Flow Designer</Src>). Knowledge bases hold the self-help articles that deflect requests (<Src k="docsKnowledge">Knowledge Management</Src>).
            </p>
          </Card>
        </div>
      </GuideSection>

      <GuideSection id="plan" eyebrow="Step 3" title="A preparation plan that survives contact with the exam">
        <p>
          How long you need depends on where you start. A ServiceNow trainer answering on the Community in July 2026 suggested that someone who has completed the CSA training and has good hands-on experience can be ready in about 2&ndash;4 weeks, and recommended repeating the hands-on labs, practising in a Personal Developer Instance, reviewing the documentation, and focusing on understanding concepts rather than memorising questions (<Src k="csaPrepThread">source</Src>). Another reply in the same thread mentions six months of platform use as a common recommendation. Use that range honestly: if you have never administered an instance, plan for the longer end.
        </p>
        <ol className="list-decimal space-y-4 pl-6">
          <li>
            <strong>Map yourself against the blueprint.</strong> For each of the six domains, write down which objectives you&apos;ve done for real, which you&apos;ve only read about, and which are new. The &ldquo;new&rdquo; column becomes your study plan.
          </li>
          <li>
            <strong>Build it, don&apos;t just read it.</strong> For every objective, make the thing in a personal instance: an ACL that blocks a field, a business rule that sets a value, an import with a transform map, a catalog item with an approval flow, an update set moved between two scopes of work. You&apos;ll remember what you broke.
          </li>
          <li>
            <strong>Practise with explanations, not answer keys.</strong> When you miss a question, don&apos;t memorise the letter. Ask which layer the right answer lives in and why the distractor was tempting. Our <In href="/csa/practice-questions">free CSA practice questions</In> include explanations for this reason.
          </li>
          <li>
            <strong>Close the weakest domain last.</strong> In the final days, go back to the domain where your practice results are lowest and re-read its documentation pages. Then stop: last-minute cramming of new topics rarely helps.
          </li>
        </ol>
        <Callout title="On exam dumps">
          <p>
            Memorised dumps teach you answer letters, not the layer model above. We don&apos;t sell or recommend them. Practice questions are useful only if they make you explain the answer.
          </p>
        </Callout>
      </GuideSection>

      <GuideSection id="scenarios" eyebrow="Step 4" title="Practise on realistic scenarios">
        <p>These are illustrative scenarios, not exam questions. Work out your answer before reading the reasoning.</p>
        <div className="space-y-6">
          <Scenario
            industry="Higher education"
            title="A university wants students to solve password and Wi-Fi problems without opening tickets"
            situation="The service desk is flooded at the start of each term with the same handful of questions."
            reasoning={<>This is a self-service problem. Knowledge bases hold articles that let users help themselves instead of contacting the helpdesk (<Src k="docsKnowledge">source</Src>), and a catalog gives a structured front door for the requests that still need a person (<Src k="docsServiceCatalog">source</Src>).</>}
            examAngle="Recognising knowledge and catalog as the self-service pair."
          />
          <Scenario
            industry="Insurance"
            title="An insurer's security team asks how hardened the instance is"
            situation="Audit wants a view of which security settings are out of line with recommendations."
            reasoning={<>Security Center provides a centralised place for instance security tools, including a hardening compliance score, non-compliant settings to address, and a security scanner (<Src k="docsSecurityCenter">source</Src>). The blueprint lists Security Center under Database Management and Platform Security (<Src k="csaBlueprint">source</Src>).</>}
            examAngle="Knowing Security Center exists and what it is for."
          />
          <Scenario
            industry="Energy and utilities"
            title="A utility wants incidents to show which substation's equipment is affected"
            situation="Field equipment is tracked in spreadsheets, and incidents only have free-text locations."
            reasoning={<>Equipment belongs in the CMDB as configuration items, which can be populated by import sets among other methods (<Src k="docsCmdb">source</Src>). Locations are CSDM Foundation data that other records reference, and should be populated first (<Src k="docsCsdmFoundation">source</Src>).</>}
            examAngle="Connecting CMDB, CSDM foundation data and imports."
          />
          <Scenario
            industry="Logistics"
            title="Operations managers want to see whether backlog is improving week by week"
            situation="A list report shows today's open tasks, but leadership asks whether things are getting better."
            reasoning={<>A report answers a question about now. Indicators record a measurement at regular intervals, giving a trend, and Platform Analytics dashboards bring visualizations and filters together (<Src k="docsPlatformAnalytics">source</Src>).</>}
            examAngle="Choosing trend measurement over a point-in-time report."
          />
        </div>
      </GuideSection>

      <GuideSection id="reading-questions" eyebrow="Step 5" title="How to read CSA-style questions">
        <p>
          These habits come from working through scenario questions in general; they aren&apos;t official guidance, but they stop you giving away marks:
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Find the constraint first">
            <p>Scenario questions often bury the deciding detail (&ldquo;for all users&rdquo;, &ldquo;including integrations&rdquo;, &ldquo;without code&rdquo;) at the end. Underline it mentally before you look at the options.</p>
          </Card>
          <Card title="Watch for NOT and EXCEPT">
            <p>Negative questions reverse the usual logic. Re-read the stem after choosing an answer to check you answered the question asked.</p>
          </Card>
          <Card title="Treat each option as true or false">
            <p>When more than one answer is required, judge every option on its own against the scenario rather than looking for a matching pair.</p>
          </Card>
          <Card title="Prefer the platform's recommended tool">
            <p>When two tools could both work, the documentation often says which is preferred, for example Flow Designer over legacy workflows for new processes (<Src k="docsFlowDesigner">source</Src>).</p>
          </Card>
        </div>
      </GuideSection>

      <GuideSection id="misconceptions" eyebrow="Myths" title="Myths to drop">
        <div className="grid gap-4 md:grid-cols-2">
          <Misconception myth="&ldquo;Score 70% in practice and you'll pass.&rdquo;">
            ServiceNow doesn&apos;t disclose the cut score; each exam uses a predetermined cut score that isn&apos;t shared with candidates (<Src k="cutScoreThread">ServiceNow Community, Jul 2026</Src>). Aim to understand every miss rather than to hit a number.
          </Misconception>
          <Misconception myth="&ldquo;CSA is a navigation exam.&rdquo;">
            Navigation is 7% of the blueprint; Database Management and Platform Security is 30% (<Src k="csaBlueprint">blueprint</Src>).
          </Misconception>
          <Misconception myth="&ldquo;Finish the course and you get a voucher.&rdquo;">
            There are no vouchers since the move to Pearson VUE; the exam is paid for when you register (<Src k="voucherEligibilityThread">ServiceNow Community, Jul 2026</Src>).
          </Misconception>
          <Misconception myth="&ldquo;A UI policy can protect a field.&rdquo;">
            Form logic is not a security control; ACLs are (<Src k="docsClientScripts">Client scripts</Src>, <Src k="docsAcl">ACLs</Src>).
          </Misconception>
        </div>
      </GuideSection>

      <GuideSection id="booking" eyebrow="Logistics" title="Booking, fees and retakes in 2026">
        <BookingFlowDiagram />
        <ul className="list-disc space-y-3 pl-6">
          <li>
            <strong>Registration and delivery.</strong> Exams are registered and paid for in ServiceNow University and scheduled through Pearson VUE using SSO; exam vouchers no longer exist (<Src k="examChanges2026">source</Src>).
          </li>
          <li>
            <strong>Fee.</strong> The CSA exam costs $300 USD excluding tax, and a retake costs $150 (<Src k="examChanges2026">source</Src>). A Community moderator confirmed in July 2026 that you pay $300 plus taxes unless you completed instructor-led training (which includes one attempt) or your employer is a ServiceNow partner providing learning credits (<Src k="voucherEligibilityThread">source</Src>).
          </li>
          <li>
            <strong>Courses.</strong> On-demand courses are free; instructor-led training costs $2,700 for a 3-day course and includes the exam attempt (<Src k="examChanges2026">source</Src>). Sources differ on whether a course is mandatory before you can book: the January 2026 summary says completing the course unlocks eligibility, while a May 2026 reply describes recommended courses as &ldquo;not required but highly recommended&rdquo; (<Src k="cadVoucherThread">source</Src>). Check the registration page.
          </li>
          <li>
            <strong>Deadlines.</strong> Once registered, you must take the exam within 90 days or forfeit the attempt; payments are non-refundable, but rescheduling inside the allowed window is free (<Src k="examChanges2026">source</Src>).
          </li>
          <li>
            <strong>Retakes.</strong> Wait 3 days between the first and second attempt, 30 days before the third, and 6 months for every attempt after that (<Src k="examChanges2026">source</Src>).
          </li>
          <li>
            <strong>Length.</strong> A 2020 Community answer gives 60 questions in 90 minutes (<Src k="csaLengthThread">source</Src>). Confirm the current figure in the blueprint before exam day.
          </li>
        </ul>
        <p>
          For the full picture of what certification costs across CSA, CAD and the CIS exams, read <In href="/blog/servicenow-certification-cost-2026">ServiceNow certification cost in 2026</In>.
        </p>
      </GuideSection>

      <GuideSection id="practice" eyebrow="Practice" title="Try some free CSA practice questions">
        <p>
          Here are three questions from our free CSA bank. Every CSA question on SNReady is free; the full set is on the <In href="/csa/practice-questions">CSA practice questions page</In>.
        </p>
      </GuideSection>
      {sample.length > 0 && <SampleQuestions questions={sample} certSlug="csa" certName="CSA" />}
      <div className="mt-10">
        <StudyCluster certSlug="csa" currentPath="/blog/how-to-pass-servicenow-csa-first-time" />
      </div>

      <SourcesList keys={CSA_GUIDE_SOURCES} />
    </div>
  );
}
