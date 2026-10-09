import Link from "next/link";
import type { CertificationWithReadiness } from "@/types";
import { isFreeCertification } from "@/lib/free-certs";

export default function CertificationCard({ certification: cert }: { certification: CertificationWithReadiness }) {
  const free = isFreeCertification(cert.slug) || cert.allQuestionsFree;
  const content = <>
    <div className="cert-index-meta"><span>{cert.slug.startsWith("cis-") ? "Specialist" : cert.level === "expert" ? "Expert" : "Platform"}</span><span>{cert.isReady ? free ? "Free to study" : "$9 lifetime" : "Coming soon"}</span></div>
    <h3>{cert.name}</h3><p>{cert.fullName}</p>
    <div className="cert-index-details"><span>{cert.examDetails.questionCount} questions · {cert.examDetails.duration} min</span><span>{cert.examDetails.passingScore}% passing score</span></div>
    <div className="cert-index-bottom"><span>{cert.isReady ? `${cert.totalQuestions}+ practice questions` : "In preparation"}</span>{cert.isReady && <span>Start studying</span>}</div>
  </>;
  return cert.isReady ? <Link href={`/${cert.slug}`} className={`cert-index-card ${free ? "cert-index-free" : ""}`}>{content}</Link> : <div className="cert-index-card cert-index-coming">{content}</div>;
}
