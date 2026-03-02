import { redirect } from "next/navigation";
import { getAllTopicSlugs } from "@/lib/data";

interface PageProps {
  params: Promise<{ cert: string; topic: string }>;
}

export function generateStaticParams() {
  return getAllTopicSlugs().map(({ certification, topic }) => ({
    cert: certification,
    topic,
  }));
}

// Redirect old /practice-questions/[cert]/[topic] to /[cert]/practice-questions/[topic]
export default async function FreeQuestionsTopicRedirect({ params }: PageProps) {
  const { cert, topic } = await params;
  redirect(`/${cert}/practice-questions/${topic}`);
}
