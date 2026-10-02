/**
 * Concierge Render Verification — Fixture Generator
 *
 * Runs planResponse + formatResponse (the patched pipeline, no LLM call) against
 * known raw LLM outputs and writes the resulting JSON to
 * scripts/pw-verify/fixtures/concierge-render.json
 *
 * The Playwright spec reads that file and returns it via page.route() so the
 * real Next.js Concierge UI can be exercised against deterministic output.
 *
 * Run: npx tsx scripts/pw-verify/gen-concierge-fixtures.ts
 */

import fs   from "fs";
import path from "path";
import { planResponse } from "../../app/lib/concierge/responsePlanner";
import { formatResponse } from "../../app/lib/concierge/responseFormatter";
import { mkcCatalogue }  from "../../app/lib/mkc/catalogue";
import { academyCatalogue } from "../../app/lib/academy/catalogue";
import type { RetrievalContext } from "../../app/lib/concierge/contextBuilder";
import type { ConversationPlan } from "../../app/lib/concierge/conversationPlanner";

const PLAN: ConversationPlan = {
  action: "new_search",
  requiresRetrieval: true,
  requiresClarification: false,
  requiresComparison: false,
  reuseRecommendations: false,
  nextIntent: "similar_to",
} as ConversationPlan;

function makeRetrieval(
  slugs: string[],
  articleSlugs: string[] = [],
  cardTarget?: number,
): RetrievalContext {
  const fragrances = slugs
    .map((s) => mkcCatalogue.find((f) => f.slug === s))
    .filter((f): f is NonNullable<typeof f> => !!f);

  const articles = articleSlugs
    .map((s) => academyCatalogue.find((a) => a.slug === s))
    .filter((a): a is NonNullable<typeof a> => !!a);

  return {
    fragrances,
    articles,
    collectionName: "Elite",
    cardTarget: cardTarget ?? slugs.length,
  } as unknown as RetrievalContext;
}

const STUB_SESSION_UPDATES = {
  selectedSlug:          null,
  lastArticleSlug:       null,
  lastCollection:        "Elite",
  comparisonSlugs:       [],
  profile:               null,
  consultationPlan:      null,
  clarificationTurnCount: 0,
};

// ── Scenario A: single product, bold marker ──────────────────────────────────
const retrievalA = makeRetrieval(["wood-sage-sea-salt-inspired"]);
const plannedA   = planResponse(
  "I'd recommend **[PRODUCT:wood-sage-sea-salt-inspired]** — it has a coastal, mineral freshness.",
  "similar_to", retrievalA, PLAN,
);
const formattedA = formatResponse(plannedA);

// ── Scenario B: two products, both bold markers ───────────────────────────────
const retrievalB = makeRetrieval(["wood-sage-sea-salt-inspired", "sauvage-inspired"]);
const plannedB   = planResponse(
  "Two great options: **[PRODUCT:wood-sage-sea-salt-inspired]** for freshness and **[PRODUCT:sauvage-inspired]** for bold presence.",
  "comparison", retrievalB, { ...PLAN, requiresComparison: true },
);
const formattedB = formatResponse(plannedB);

// ── Scenario C: article marker + product ─────────────────────────────────────
const retrievalC = makeRetrieval(
  ["wood-sage-sea-salt-inspired"],
  ["the-note-pyramid-explained"],
);
const plannedC = planResponse(
  "You might find [ARTICLE:the-note-pyramid-explained] helpful. For your profile I'd suggest **[PRODUCT:wood-sage-sea-salt-inspired]**.",
  "education", retrievalC, { ...PLAN, nextIntent: "education" },
);
const formattedC = formatResponse(plannedC);

// ── Scenario D: mixed-marker order — non-bold before bold, cardTarget=1 ──────
const retrievalD = makeRetrieval(
  ["wood-sage-sea-salt-inspired", "sauvage-inspired"],
  [], 1,
);
const plannedD = planResponse(
  "I'd suggest [PRODUCT:wood-sage-sea-salt-inspired] for everyday and **[PRODUCT:sauvage-inspired]** for special occasions.",
  "similar_to", retrievalD, PLAN,
);
const formattedD = formatResponse(plannedD);

// ── Write fixture file ────────────────────────────────────────────────────────

const fixtures = {
  scenarioA: { ...formattedA, sessionUpdates: STUB_SESSION_UPDATES },
  scenarioB: { ...formattedB, sessionUpdates: STUB_SESSION_UPDATES },
  scenarioC: { ...formattedC, sessionUpdates: STUB_SESSION_UPDATES },
  scenarioD: { ...formattedD, sessionUpdates: STUB_SESSION_UPDATES },
};

// Assertions before writing — fail fast if planner output is already wrong
function check(label: string, value: boolean): void {
  if (!value) {
    console.error(`[FAIL] ${label}`);
    process.exit(1);
  }
  console.log(`[OK]   ${label}`);
}

check("A: content has canonical name",         formattedA.content.includes("Wood Sage Sea Salt Inspired"));
check("A: no marker in content",               !formattedA.content.includes("[PRODUCT:"));
check("A: no orphaned ****",                   !formattedA.content.includes("****"));
check("A: fragrance card present",             formattedA.fragrances.length === 1);
check("A: card href correct",                  formattedA.fragrances[0].href === "/product/wood-sage-sea-salt-inspired");

check("B: first product name in content",      formattedB.content.includes("Wood Sage Sea Salt Inspired"));
check("B: second product name in content",     formattedB.content.includes("Sauvage Inspired"));
check("B: no marker in content",               !formattedB.content.includes("[PRODUCT:"));
check("B: two fragrance cards",                formattedB.fragrances.length === 2);
check("B: first card href",                    formattedB.fragrances[0].href === "/product/wood-sage-sea-salt-inspired");
check("B: second card href",                   formattedB.fragrances[1].href === "/product/sauvage-inspired");

check("C: article title in content",           formattedC.content.includes("The Note Pyramid Explained"));
check("C: product name in content",            formattedC.content.includes("Wood Sage Sea Salt Inspired"));
check("C: no ARTICLE marker in content",       !formattedC.content.includes("[ARTICLE:"));
check("C: article card present",               formattedC.articles.length === 1);
check("C: article card href",                  formattedC.articles[0].href === "/academy/the-note-pyramid-explained");
check("C: article card title matches",         formattedC.articles[0].title === "The Note Pyramid Explained");

check("D: both names in content",              formattedD.content.includes("Wood Sage Sea Salt Inspired") && formattedD.content.includes("Sauvage Inspired"));
check("D: first-mentioned selected (cardTarget=1)", formattedD.fragrances.length === 1 && formattedD.fragrances[0].slug === "wood-sage-sea-salt-inspired");

const outDir  = path.join(__dirname, "fixtures");
const outFile = path.join(outDir, "concierge-render.json");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(fixtures, null, 2));

console.log(`\nFixtures written to ${outFile}`);
console.log("All generator checks passed.");
