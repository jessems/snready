import Link from "next/link";
import type { ReactNode } from "react";
import { listPipelineCerts, loadCert, privateDataEnabled } from "@/lib/pipeline-audit";
import { PrivateNotice } from "../ui";
import { CertTabs } from "./CertTabs";

export const dynamicParams = false;

export function generateStaticParams() {
  return listPipelineCerts().map((cert) => ({ cert }));
}

export default async function CertLayout({ children, params }: { children: ReactNode; params: Promise<{ cert: string }> }) {
  const { cert } = await params;
  const { blueprint } = loadCert(cert);
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/admin/pipeline" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
          ← All certifications
        </Link>
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{cert.toUpperCase()} · pipeline audit</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Blueprint {blueprint?.spec?.kb} ({blueprint?.spec?.updated}) · docs release {blueprint?.release} · {blueprint?.examItemCount} exam items
            </p>
          </div>
          <div className="max-w-md">
            <PrivateNotice available={privateDataEnabled} />
          </div>
        </div>
        <CertTabs cert={cert} />
        {children}
      </div>
    </div>
  );
}
