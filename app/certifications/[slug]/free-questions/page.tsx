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

export default async function CertificationFreeQuestionsRedirect({ params }: Props) {
  const { slug } = await params;
  redirect(`/free-questions/${slug}`);
}
