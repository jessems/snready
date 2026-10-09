import type { Metadata } from "next";
import StudyRoom from "@/components/StudyRoom";
import { getAllCertifications, getTotalQuestionCount, getPricingSummary, isCertificationReady, isCertificationFree } from "@/lib/data";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  const featured = ["csa", "cis-df", "cad", "cis-itsm", "cis-csm", "cis-discovery"];
  const courses = getAllCertifications().map(cert => ({
    slug: cert.slug,
    name: cert.name,
    fullName: cert.fullName,
    count: getTotalQuestionCount(cert.slug),
    ready: isCertificationReady(cert.slug),
    free: isCertificationFree(cert.slug),
  })).sort((a, b) => {
    const rank = (slug: string) => featured.includes(slug) ? featured.indexOf(slug) : featured.length;
    return rank(a.slug) - rank(b.slug) || a.name.localeCompare(b.name);
  });
  return <StudyRoom courses={courses} summary={getPricingSummary()} />;
}
