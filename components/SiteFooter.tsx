import Link from "next/link";
import { getPricingSummary } from "@/lib/data";

const groups = [
  { title: "Study", links: [["/csa", "CSA"], ["/cad", "CAD"], ["/cis-df", "Data Foundations"], ["/cis-itsm", "IT Service Management"], ["/certifications", "All certifications"]] },
  { title: "Find your way", links: [["/study-guide", "Study guides"], ["/study-plan", "Build a study plan"], ["/certification-paths", "Career paths"], ["/compare", "Compare certifications"], ["/salaries", "Salaries"]] },
  { title: "Reference", links: [["/resources", "Free resources"], ["/blog", "From the blog"], ["/version-diff", "Release changes"], ["/pricing", "Pricing"], ["/vs", "Compare study options"], ["mailto:jesse@snready.com", "Contact"]] },
];

export default function SiteFooter() {
  const summary = getPricingSummary();
  return <footer className="site-footer">
    <div className="site-footer-grid">
      <div><Link href="/" className="brand-wordmark" aria-label="SNReady home">snready<span aria-hidden="true" /></Link><p>Made for the work before exam day.</p><p>{summary.readyCount} certifications. {summary.totalQuestions.toLocaleString("en-US")} questions. One place to practice.</p></div>
      {groups.map(group => <div key={group.title}><h2>{group.title}</h2><nav aria-label={group.title}>{group.links.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}</nav></div>)}
    </div>
    <div className="site-footer-note"><span>Independent study resource. Not affiliated with ServiceNow.</span><Link href="/practice-questions">Make the next attempt count.</Link></div>
  </footer>;
}
