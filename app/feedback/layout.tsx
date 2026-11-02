import type { Metadata } from "next";

// The page is a client component and can't export metadata itself.
export const metadata: Metadata = {
  title: "Feedback",
  robots: { index: false, follow: true },
};

export default function FeedbackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
