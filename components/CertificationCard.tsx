import Link from "next/link";
import type { CertificationWithReadiness } from "@/types";
import { isFreeCertification } from "@/lib/free-certs";
import { CUT_SCORE_LABEL } from "@/lib/site-facts";

export default function CertificationCard({ certification: cert }: { certification: CertificationWithReadiness }) {
  const free = isFreeCertification(cert.slug) || cert.allQuestionsFree;
  const meta = <div className="cert-index-meta"><span>{cert.slug.startsWith("cis-") ? "Specialist" : cert.level === "expert" ? "Expert" : "Platform"}</span><span>{cert.isReady ? free ? "Free to study" : "$9 lifetime" : "Coming soon"}</span></div>;
  const details = <div className="cert-index-details"><span>{cert.examDetails.questionCount} questions · {cert.examDetails.duration} min</span><span>Cut score {CUT_SCORE_LABEL.toLowerCase()}</span></div>;
  if (!cert.isReady) {
    return <div className="cert-index-card cert-index-coming">{meta}<h3>{cert.name}</h3><p>{cert.fullName}</p>{details}<div className="cert-index-bottom"><span>In preparation</span></div></div>;
  }
  // Two links per card (exam guide and practice-questions hub), so the card is
  // a div rather than one wrapping link.
  return <div className={`cert-index-card ${free ? "cert-index-free" : ""}`}>
    {meta}
    <h3><Link href={`/${cert.slug}`}>{cert.name}</Link></h3><p>{cert.fullName}</p>
    {details}
    <div className="cert-index-bottom"><Link href={`/${cert.slug}`}>Exam guide</Link><Link href={`/${cert.slug}/practice-questions`}>{cert.totalQuestions} practice questions</Link></div>
  </div>;
}
