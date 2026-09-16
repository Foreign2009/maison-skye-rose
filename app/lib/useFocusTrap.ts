import { useEffect } from "react";

const FOCUSABLE = [
  "button:not([disabled])",
  "input:not([disabled])",
  "textarea:not([disabled])",
  "select:not([disabled])",
  "a[href]",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

/**
 * Traps Tab and Shift+Tab within a container while active.
 * Prevents focus from escaping the modal to content behind it.
 */
export function useFocusTrap(
  ref: { current: HTMLElement | null },
  active: boolean,
): void {
  useEffect(() => {
    if (!active || !ref.current) return;
    const container = ref.current;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const nodes = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last  = nodes[nodes.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [ref, active]);
}
