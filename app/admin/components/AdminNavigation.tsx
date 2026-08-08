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
  { href: "/admin/executive-report",           label: "Executive Report"        },
  { href: "/admin/identity",                   label: "Identity Review"         },
] as const;

// /admin is the only root item — matched exactly to avoid active-for-all-sub-routes.
// All other items use startsWith so /admin/identity/[id] shows Identity Review as active.
function isActive(href: string, pathname: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function AdminNavigation() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-4">
      {NAV_ITEMS.map(({ href, label }) =>
        isActive(href, pathname) ? (
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
