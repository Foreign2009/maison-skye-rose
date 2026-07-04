import type { ReactNode } from "react";

interface AcademyBadgeProps {
  children: ReactNode;
  variant?: "default" | "featured" | "category" | "beginner";
  className?: string;
}

const VARIANT_STYLES: Record<NonNullable<AcademyBadgeProps["variant"]>, string> = {
  default:   "bg-[#f5f1f6] text-[#4f4a52]/60",
  featured:  "bg-[#fdf6f7] text-[#d89ca4] border border-[#d89ca4]/30",
  category:  "bg-transparent text-[#d89ca4]",
  beginner:  "bg-[#f0f4f0] text-[#6a8a6a]",
};

export function AcademyBadge({ children, variant = "default", className = "" }: AcademyBadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-0.5 text-[10px] font-semibold tracking-widest uppercase ${VARIANT_STYLES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
