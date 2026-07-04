import type { ReactNode } from "react";

interface AcademySectionProps {
  children: ReactNode;
  className?: string;
}

export function AcademySection({ children, className = "" }: AcademySectionProps) {
  return (
    <section className={`py-12 md:py-16 ${className}`}>
      {children}
    </section>
  );
}
