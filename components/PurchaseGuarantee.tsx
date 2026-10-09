import { INDIVIDUAL_GUARANTEE_TITLE, INDIVIDUAL_GUARANTEE_COPY, INDIVIDUAL_GUARANTEE_SCOPE } from "@/lib/purchase-guarantee";

export default function PurchaseGuarantee({ compact = false }: { compact?: boolean }) {
  return <aside className={`purchase-guarantee ${compact ? "purchase-guarantee-compact" : ""}`} aria-label="Individual certification money-back guarantee">
    <strong>{INDIVIDUAL_GUARANTEE_TITLE}</strong>
    <p>{INDIVIDUAL_GUARANTEE_COPY}</p>
    <small>{INDIVIDUAL_GUARANTEE_SCOPE}</small>
  </aside>;
}
