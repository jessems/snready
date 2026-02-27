import { redirect } from "next/navigation";
import { getCertificationSlugs } from "@/lib/data";

interface PageProps {
  params: Promise<{ cert: string }>;
}

export function generateStaticParams() {
  return getCertificationSlugs().map((slug) => ({ cert: slug }));
}

// Redirect old /free-questions/[cert] to /[cert]/practice-questions
export default async function FreeQuestionsCertRedirect({ params }: PageProps) {
  const { cert } = await params;
  redirect(`/${cert}/practice-questions`);
}
