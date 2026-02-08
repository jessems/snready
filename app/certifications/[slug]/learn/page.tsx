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

export default async function CertificationLearnRedirect({ params }: Props) {
  // Redirect to the main learn page (cert-specific learn pages coming soon)
  redirect(`/learn`);
}
