import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AcademyBreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function AcademyBreadcrumbs({ items }: AcademyBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-[#4f4a52]/40">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            {index > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-[#d89ca4] transition-colors duration-150"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-[#4f4a52]/70" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
