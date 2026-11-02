import type { Metadata } from "next";

// The page is a client component and can't export metadata itself.
export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: true },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
