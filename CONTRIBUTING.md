# Contributing

**Project:** Maison Skye & Rose
**Related:** [CLAUDE.md](CLAUDE.md) · [ARCHITECTURE.md](ARCHITECTURE.md)

---

## Development Process

### 1. Understand Before Acting

Before touching any file:

1. Read the affected files in full
2. Read any files they import that are relevant
3. Understand the current behaviour completely
4. Identify all components that consume the same context or data

Never assume — always read.

### 2. Produce a Plan

Before writing code, produce a written plan:

- **Files to Modify** — list each file and why
- **Files NOT to Modify** — confirm exclusions explicitly
- **Current Behaviour** — describe what exists
- **Proposed Behaviour** — describe what will change
- **Risks** — what could break, what regressions are possible
- **Side Effects** — UI, performance, SEO, accessibility implications
- **Build Verification** — how success will be confirmed

### 3. Wait for Approval

Do not implement until the plan is reviewed and approved.

### 4. Implement

Modify only files listed in the approved plan.

If you discover a need to touch an unlisted file: stop and flag it. Do not silently expand scope.

### 5. Run the Build

```bash
npm run build
```

Never report a task as done without a clean build. Report:

- Build result (success/fail)
- TypeScript errors (none/list)
- Warnings (none/list)
- Pages generated (count)

### 6. Verify

Verify the implementation actually works:

- UI changes: test at 375px and 768px
- Context changes: verify CartContext, FavoritesContext behaviour manually
- SEO changes: check the page source for metadata
- Performance changes: describe what profiling would confirm

### 7. Commit

---

## Git Workflow

### Branch Strategy

TODO: Verify branching strategy from repository configuration.

Current development appears to occur on `main`.

### Commit Format

```
verb: short description under 72 characters
```

**Verb examples:** Improve · Optimize · Add · Fix · Remove · Refactor · Update

**Examples from history:**

```
Improve mobile PDP conversion experience
Optimize MiniCart checkout visibility and reward progress
Add per-product SEO metadata and Product JSON-LD
Fix favorites overwrite during initialization
Remove unoptimized images and incorrect priority flags
```

### Commit Rules

- One logical change per commit
- Never combine unrelated work in a single commit
- Always run `git status` before committing to review changed files
- Never commit: `.env.local`, `node_modules/`, `.next/`

---

## Coding Standards

### TypeScript

- Type everything explicitly
- No `any` without a documented reason
- Use the types defined in `app/data/types.ts` where applicable
- Prefer `interface` for object shapes passed as props
- Prefer `type` for unions, intersections, and utility types

### React

- Components: wrap in `memo()` where the component re-renders from parent but its props have not changed — `export default memo(ComponentName)`
- All event handlers: `useCallback()`
- All derived data: `useMemo()` when computation is non-trivial or the result is passed as a prop/context value
- Apply memoization only where it reduces actual rendering cost — do not memoize trivially cheap operations

### Images

- Never use `<img>` — always `next/image`
- Always provide `sizes` prop on `fill` layout images
- `priority` only for above-the-fold images (hero, first product in a carousel)
- Always provide meaningful `alt` text

### Styling

- Tailwind utility classes only — no CSS modules, no inline `style` objects except where required (e.g., dynamic progress bar widths)
- Mobile-first: base classes for mobile, `md:` prefix for desktop
- Use `clsx` or `tailwind-merge` for conditional class composition

### Next.js 16

- Read `AGENTS.md` before making any framework-level changes
- Consult `node_modules/next/dist/docs/` for API verification
- Never assume a Next.js API from training data is correct — verify against the installed version

---

## Testing

There is no automated test suite in the current project.

Manual verification is required for every change:

- [ ] Build passes: `npm run build`
- [ ] TypeScript clean: no errors in build output
- [ ] No new warnings in build output
- [ ] Feature works at 375px (mobile)
- [ ] Feature works at 768px+ (desktop)
- [ ] Cart add/remove behaviour unaffected (if context was touched)
- [ ] Favorites toggle behaviour unaffected (if context was touched)
- [ ] WhatsApp checkout message generates correctly (if cart logic was touched)

---

## Definition of Done

A task is complete only when all of the following are true:

- [ ] Plan approved before implementation began
- [ ] Implementation complete and matches the approved plan
- [ ] `npm run build` passes with zero TypeScript errors
- [ ] No new warnings introduced
- [ ] Mobile experience verified (375px)
- [ ] SEO unaffected (or intentionally improved)
- [ ] Performance reviewed (no new unmemoized expensive computations, no new `<img>` tags)
- [ ] Git commit created with meaningful message
- [ ] Summary provided describing what changed and what to watch for

If any item is unchecked, the task is not done.

---

## AI Collaboration Workflow

### Claude Code (Implementation)

Claude Code is the primary implementation agent. It reads files, produces plans, waits for approval, implements, runs builds, and commits.

**Key rules for Claude:**

1. Never edit without reading first
2. Always produce a plan with risks before coding
3. Never touch files outside the approved plan
4. Always run `npm run build` after implementation
5. Always update `CLAUDE.md` when a new rule or anti-pattern is discovered
6. Never commit without human approval

**CLAUDE.md** is the permanent AI operating manual. It is loaded at the start of every session. Every correction made to Claude's behaviour should be added to CLAUDE.md so it persists across sessions.

### ChatGPT (Planning & Review)

ChatGPT is used for:

- Architecture decisions and trade-off analysis
- SEO strategy and keyword planning
- Risk analysis before large changes
- Code review as a second opinion
- Conversion strategy and UX recommendations

Bring ChatGPT's recommendations into Claude sessions as pre-context to align both tools.

---

## Production Safety

The following must never be modified without explicit approval:

- `app/api/payfast/route.ts` — payment initialization
- `app/api/orders/route.ts` — order persistence
- `app/lib/supabase.ts` — database client
- `app/layout.tsx` — root layout and provider tree
- All `.env.local` values

Changes to these files must be flagged, planned, and reviewed before implementation.
