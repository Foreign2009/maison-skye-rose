"use client";

import Link            from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin",                            label: "Operations"              },
  { href: "/admin/briefing",                   label: "Briefing"                },
  { href: "/admin/intelligence",               label: "Intelligence"            },
  { href: "/admin/recommendation-performance", label: "Performance"             },
  { href: "/admin/customer-intelligence",      label: "Customer Intelligence"   },
  { href: "/admin/commerce-intelligence",      label: "Commerce Intelligence"   },
  { href: "/admin/executive-operations",       label: "Executive Operations"    },
  { href: "/admin/operations",                 label: "Unified Operations"      },
  { href: "/admin/alerts",                     label: "Alerts"                  },
  { href: "/admin/alert-center",               label: "Alert Center"            },
  { href: "/admin/executive-digest",           label: "Executive Digest"        },
  { href: "/admin/executive-briefing",         label: "Executive Briefing"      },
  { href: "/admin/executive-report",           label: "Executive Report"        },
  { href: "/admin/executive-report-center",    label: "Executive Report Center" },
] as const;

export default function AdminNavigation() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-4">
      {NAV_ITEMS.map(({ href, label }) =>
        pathname === href ? (
          <span key={href} className="text-xs font-bold text-white">
            {label}
          </span>
        ) : (
          <Link key={href} href={href} className="text-xs text-white/60 transition hover:text-white">
            {label}
          </Link>
        )
      )}
    </nav>
  );
}
