/**
 * escapeStack — registration-order-independent Escape ownership.
 *
 * Overlays call pushEscape(id) when they open and popEscape(id) when they close.
 * Only the overlay at the top of the stack should act on an Escape keypress.
 * The last overlay to push is treated as the visually topmost one.
 */
const stack: string[] = [];

export function pushEscape(id: string): void {
  // Re-opening moves to top rather than duplicating
  const idx = stack.indexOf(id);
  if (idx !== -1) stack.splice(idx, 1);
  stack.push(id);
}

export function popEscape(id: string): void {
  const idx = stack.indexOf(id);
  if (idx !== -1) stack.splice(idx, 1);
}

export function isTopEscape(id: string): boolean {
  return stack.length > 0 && stack[stack.length - 1] === id;
}
