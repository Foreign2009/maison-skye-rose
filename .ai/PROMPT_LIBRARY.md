# Prompt Library — Maison Skye & Rose

Reusable prompts for common workflows. Copy and adapt as needed.
Prompts are written for Claude Code unless otherwise noted.

---

## 1. Start a New Task

Use this at the beginning of any session with a defined goal.

```
Load .ai/AI_CONTEXT.md and .ai/CURRENT_TASK.md.

I want to [GOAL].

Before doing anything:
1. Read all affected files
2. Produce a plan in the required format (Files to Modify, Files NOT to Modify, Current Behaviour, Proposed Behaviour, Risks, Side Effects, Build Verification)
3. Wait for my approval before writing any code
```

---

## 2. Plan First (Before Any Code)

Force the plan format from CLAUDE.md before implementation starts.

```
Before writing any code, produce the full implementation plan:

## Files to Modify
## Files NOT to Modify
## Current Behaviour
## Proposed Behaviour
## Risks
## Side Effects
## Build Verification

End with: "Waiting for approval before editing."
```

---

## 3. Grill Me (Stress-Test a Plan)

Use this after producing a plan — ask Claude to challenge it before you approve it.

```
Before I approve this plan, grill me on it.

What assumptions are you making that could be wrong?
What edge cases in the cart, MiniCart, or checkout does this touch?
What regressions are possible in: cart persistence, wholesale pricing, reward tiers, WhatsApp checkout message, recently viewed, favorites recommendations?
What would break this at 375px?
Is there a simpler approach?
```

---

## 4. Elegant Rewrite

Use when an existing implementation works but is messy.

```
Read [FILE].

The current implementation works correctly. Do not change behaviour.
Propose a rewrite that:
- Reduces complexity
- Improves readability
- Removes duplication
- Keeps TypeScript types strict
- Does not introduce new dependencies

Produce the plan first. Wait for approval before rewriting.
```

---

## 5. Prove It Works

Use after implementation to verify correctness before committing.

```
The implementation is complete. Before I commit, prove it works.

Walk me through:
1. The exact user action that triggers this feature
2. What state changes in which context
3. What renders as a result
4. What is saved to localStorage (if anything)
5. What the WhatsApp message looks like (if this touches checkout)
6. What happens at the cart/reward/wholesale edge cases

If you cannot walk me through all of these confidently, stop and flag what is uncertain.
```

---

## 6. Debug a Specific Issue

Use when something is broken and you need systematic diagnosis.

```
[DESCRIBE THE BUG — what the user sees, when it happens, what it should do]

Read the relevant files and trace the issue:
1. What is the expected code path?
2. Where does the actual behaviour diverge from expected?
3. What is the root cause?
4. What is the minimal fix?
5. What else could the fix affect?

Do not guess. Read the source. Show me the exact line.
```

---

## 7. Cart Regression Check

Use any time CartContext, MiniCart, QuickAddModal, or ProductDetail is touched.

```
After this change, verify the following manually or by code trace:

Cart:
- [ ] Add to cart from ProductDetail — correct id (URL slug), correct size, quantity 1
- [ ] Add to cart from QuickAddModal — correct id (title-size), correct size, correct quantity
- [ ] Same product + same size from same source: quantity increases, no duplicate line
- [ ] Same product + different size: separate line item
- [ ] Cart persists across page refresh (localStorage)
- [ ] Cart does not blank out on first load (hydration guard working)

Wholesale:
- [ ] At 9 units: wholesale NOT active, retail prices shown
- [ ] At 10 units: wholesale IS active, flat prices (5ml R48, 10ml R77, 30ml R180)
- [ ] Delivery shows FREE when wholesale active

Rewards:
- [ ] Subtotal R399: no reward shown
- [ ] Subtotal R400: "1 Free 5ml Sample" unlocked
- [ ] Subtotal R1500: "Discovery Set" unlocked
- [ ] Subtotal R2000: "Discovery Set + Free Delivery"

WhatsApp message:
- [ ] Order lines format: "• {title} ({size}) x{qty} - R{price}"
- [ ] Reward section appears when reward is unlocked
- [ ] WHOLESALE ORDER header appears when wholesale active
- [ ] Total matches MiniCart total
```

---

## 8. Performance Audit

Use when touching components that render frequently (MiniCart, ProductCard, shop page).

```
Audit the performance impact of this change.

For every component touched:
1. What causes it to re-render?
2. Are all event handlers in useCallback?
3. Are all derived values in useMemo?
4. Is memo() applied where the component receives the same props from a frequently re-rendering parent?
5. Does any useMemo depend on a context value that re-creates on every render?
6. Are any images missing sizes props or using incorrect layout?

Report any regressions from the current memoization strategy.
```

---

## 9. SEO Check

Use when adding or modifying a page.

```
For [PAGE], verify the following SEO requirements:

- [ ] title tag — unique, descriptive, under 60 characters
- [ ] description — unique, includes relevant keywords, under 160 characters
- [ ] canonical URL — set correctly via alternates.canonical
- [ ] Open Graph title, description, image
- [ ] Twitter card — summary_large_image
- [ ] robots: index + follow (or intentionally noindex with reason)
- [ ] If product page: Product JSON-LD with Offer nodes

What is missing? What needs to be added?
```

---

## 10. Update CLAUDE.md

Use when a new rule, pattern, or anti-pattern has been discovered during a task.

```
Based on what we discovered during this task, propose an update to CLAUDE.md.

The new rule or pattern is: [DESCRIBE IT]
It belongs under section: [SECTION NAME]
It should be worded as a clear instruction, not a suggestion.

Show me the proposed addition. I will decide whether to merge it.
```

---

## 11. Pre-Commit Review

Use before every git commit.

```
Before I commit, review the staged changes:

1. Do the changes match only the approved plan?
2. Are there any unrelated edits accidentally included?
3. Are there any console.log statements, debug flags, or TODO comments left in?
4. Does the commit message accurately describe the change?
5. Is anything missing from the change that was part of the plan?

Run: git diff --staged

Report findings. I will confirm before committing.
```

---

## 12. ChatGPT Handoff

Use to brief ChatGPT on a decision or architecture question.

```
I am working on Maison Skye & Rose, a Next.js 16 App Router e-commerce platform for luxury fragrances in South Africa.

Tech stack: Next.js 16.2.6, React 19.2.4, TypeScript 5, Tailwind CSS 3, Supabase (anon key only), PayFast (sandbox).

Current primary checkout: WhatsApp. Secondary: PayFast.

Decision I need your analysis on: [DESCRIBE THE DECISION]

Key constraints:
- All product data is static TypeScript (fragrances.ts) — no CMS
- Cart uses React Context + localStorage
- No customer authentication
- 465+ fragrances across Skye, Rose, Elite collections
- Progressive reward tiers (R400/700/1000/1500/2000)
- Wholesale auto-activates at 10+ cart units

Please analyse: trade-offs, risks, and your recommendation.
```
