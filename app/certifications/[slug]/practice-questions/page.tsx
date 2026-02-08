import { redirect } from 'next/navigation';
import { getCertificationSlugs } from '@/lib/data';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getCertificationSlugs().map((slug) => ({
    slug,
  }));
}

export default async function CertificationPracticeQuestionsRedirect({ params }: Props) {
  const { slug } = await params;
  redirect(`/practice-questions/${slug}`);
}
