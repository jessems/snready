import { redirect } from "next/navigation";
import { getCertificationSlugs } from "@/lib/data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getCertificationSlugs().map((slug) => ({ slug }));
}

// Redirect old /certifications/[slug]/free-questions to /[slug]/practice-questions
export default async function CertFreeQuestionsRedirect({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/${slug}/practice-questions`);
}
