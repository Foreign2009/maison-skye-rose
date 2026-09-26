"use client";

import { useEffect, useRef, useCallback } from "react";
import Link            from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X }    from "lucide-react";

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
  { href: "/admin/identity/relationships",     label: "Relationship Review"     },
] as const;

// Returns the single nav item href that best matches the current pathname.
// When multiple items share a prefix (e.g. /admin/identity and
// /admin/identity/relationships both match /admin/identity/relationships),
// the longest href wins so only one item is ever selected.
function findMostSpecificMatch(pathname: string): string | null {
  let bestHref: string | null = null;
  let bestLength = -1;
  for (const { href } of NAV_ITEMS) {
    const matches =
      href === "/admin"
        ? pathname === "/admin"
        : pathname === href || pathname.startsWith(href + "/");
    if (matches && href.length > bestLength) {
      bestHref = href;
      bestLength = href.length;
    }
  }
  return bestHref;
}

export default function AdminNavigation() {
  const pathname       = usePathname();
  const dialogRef      = useRef<HTMLDialogElement>(null);
  const prevOverflowRef = useRef("");

  // Open: preserve existing overflow, lock scroll, open as modal dialog.
  // showModal() places the element in the top layer — it receives native
  // focus containment, Escape handling, and ::backdrop.
  const openDrawer = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    prevOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
  }, []);

  // Close: dialog.close() fires the native "close" event, which the useEffect
  // listener below uses to restore body overflow. The browser natively returns
  // focus to the element that called showModal().
  const closeDrawer = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || !dialog.open) return;
    dialog.close();
  }, []);

  // Auto-close when a Link navigation completes (pathname has changed).
  useEffect(() => {
    closeDrawer();
  }, [pathname, closeDrawer]);

  // Restore body overflow whenever the dialog closes — whether by
  // dialog.close(), native Escape, or programmatic dismissal.
  // The native <dialog> "close" event does not bubble, so we register
  // directly on the element rather than relying on React's onClose prop.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const restore = () => {
      document.body.style.overflow = prevOverflowRef.current;
    };
    dialog.addEventListener("close", restore);
    return () => dialog.removeEventListener("close", restore);
  }, []);

  const activeHref = findMostSpecificMatch(pathname);

  return (
    <>
      {/* Hamburger trigger — visible at all widths */}
      <button
        type="button"
        onClick={openDrawer}
        aria-label="Open navigation menu"
        aria-haspopup="dialog"
        className="flex h-11 w-11 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
      >
        <Menu size={20} aria-hidden="true" />
      </button>

      {/*
        Native <dialog> with showModal() provides:
          • Focus containment within the element (no manual Tab trap needed)
          • Escape key closes automatically (fires native "close" event)
          • ::backdrop rendered natively in the top layer
          • Focus return to the opener on close (browser-managed)
        Reset browser dialog defaults via inline style; position as a side
        drawer with fixed left-0 top-0.
      */}
      <dialog
        ref={dialogRef}
        aria-label="Admin navigation"
        style={{ height: "100dvh", maxHeight: "100dvh", margin: 0, padding: 0, border: "none" }}
        className="fixed left-0 top-0 w-72 max-w-[85vw] bg-[#4f4a52] shadow-2xl [&::backdrop]:bg-black/50 print:hidden focus:outline-none"
      >
        <div className="flex h-full flex-col">

          {/* Drawer header */}
          <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <p className="text-[9px] uppercase tracking-[0.5em] text-[#d89ca4]">Internal</p>
              <p className="text-sm font-black uppercase tracking-widest text-white">Navigation</p>
            </div>
            <button
              type="button"
              onClick={closeDrawer}
              aria-label="Close navigation menu"
              className="flex h-11 w-11 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          {/* Nav items — overflow-y-auto allows scrolling on short screens */}
          <nav aria-label="Admin destinations" className="flex-1 overflow-y-auto px-3 py-3">
            {NAV_ITEMS.map(({ href, label }) => {
              const isMostSpecific = href === activeHref;
              // aria-current="page" only when we are on this exact route.
              const isExactPage    = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={closeDrawer}
                  aria-current={isExactPage ? "page" : undefined}
                  className={`flex min-h-[44px] items-center rounded-xl px-4 py-2 text-sm transition ${
                    isMostSpecific && isExactPage
                      ? // Exact current page: filled highlight
                        "bg-white/15 font-bold text-white"
                      : isMostSpecific
                      ? // Parent section of a detail route: distinguished but navigable
                        "font-semibold text-white underline-offset-2 decoration-white/40 underline"
                      : // Inactive
                        "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </dialog>
    </>
  );
}
