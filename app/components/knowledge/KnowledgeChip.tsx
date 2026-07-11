// default: secondary attributes (family, profile, season) — bg-[#f5f1eb] text-[#7b7480]
// bordered: editorial attributes (occasions, signatureStyle, bestFor) — bg-[#f9f7f4] text-[#4f4a52]
// href: renders as navigable Link with accent hover (Fragrance Connections chips)

import Link from "next/link";

const variants = {
  default:  "bg-[#f5f1eb] px-2.5 py-1 text-[11px] font-semibold text-[#7b7480]",
  bordered: "border border-[#ede8e1] bg-[#f9f7f4] px-3 py-1.5 text-xs font-semibold text-[#4f4a52]",
};

interface KnowledgeChipProps {
  label:    string;
  variant?: "default" | "bordered";
  href?:    string;
}

export function KnowledgeChip({ label, variant = "default", href }: KnowledgeChipProps) {
  const base    = `rounded-full ${variants[variant]}`;
  const hovered = href ? " transition hover:border-[#d89ca4] hover:text-[#d89ca4]" : "";

  if (href) {
    return (
      <Link href={href} className={`${base}${hovered}`}>
        {label}
      </Link>
    );
  }
  return <span className={base}>{label}</span>;
}
