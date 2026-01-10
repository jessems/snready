import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b border-[var(--border)]">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--accent)] flex items-center justify-center">
            <span className="text-white font-bold text-sm">SN</span>
          </div>
          <span className="font-semibold text-lg text-[var(--text-primary)]">
            SNReady
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-[var(--accent)] bg-[var(--accent-light)] px-3 py-1.5 rounded-full">
            Beta
          </span>
        </div>
      </div>
    </header>
  );
}
