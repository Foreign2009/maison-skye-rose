"use client";

import { useEffect } from "react";
import { useSearchUI } from "../context/SearchUIContext";
import { trackSearchOpened } from "../lib/analytics";
import { pushEscape, popEscape, isTopEscape } from "../lib/escapeStack";
import SearchOverlay from "./SearchOverlay";

/**
 * GlobalSearch — mounted once in layout.tsx.
 *
 * Responsibilities:
 *   • Registers global keyboard listeners for /, Ctrl+K, ⌘+K, Escape
 *   • Reads open/close state from SearchUIContext
 *   • Renders SearchOverlay (which portals its own backdrop and panel)
 *
 * The Navbar search icon is wired separately via useSearchUI().openSearch().
 */
export default function GlobalSearch() {
  const { searchOpen, openSearch, closeSearch } = useSearchUI();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // / — open search when not typing in an input
      if (
        e.key === "/" &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement) &&
        !(e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        e.preventDefault();
        openSearch();
        trackSearchOpened({ trigger: "keyboard-slash" });
        return;
      }

      // Ctrl+K / ⌘+K
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        openSearch();
        trackSearchOpened({ trigger: "keyboard-ctrl-k" });
        return;
      }

      // Escape — close only when this is the topmost overlay
      if (e.key === "Escape" && searchOpen && isTopEscape("search")) {
        closeSearch();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen, openSearch, closeSearch]);

  // Register/deregister in the escape stack when open state changes
  useEffect(() => {
    if (searchOpen) {
      pushEscape("search");
      return () => popEscape("search");
    }
  }, [searchOpen]);

  return <SearchOverlay isOpen={searchOpen} onClose={closeSearch} />;
}
