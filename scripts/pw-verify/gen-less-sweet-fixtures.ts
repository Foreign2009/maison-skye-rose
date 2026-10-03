/**
 * Less-Sweet Fallback Fix — Fixture Generator
 *
 * Generates deterministic concierge response fixtures for the no-match
 * anchored refinement case (anchor at catalogue minimum sweetness).
 *
 * Uses a mock model output (no LLM call). Runs through the patched
 * planResponse + formatResponse pipeline to produce the FormattedResponse
 * that the Playwright spec will intercept.
 *
 * Run: npx tsx scripts/pw-verify/gen-less-sweet-fixtures.ts
 */

import path from "path";
import fs   from "fs";
import { mkcCatalogue }   from "../../app/lib/mkc/catalogue";
import { planRetrieval }  from "../../app/lib/concierge/retrievalPlanner";
import { planResponse }   from "../../app/lib/concierge/responsePlanner";
import { formatResponse } from "../../app/lib/concierge/responseFormatter";
import type { ResolvedIntent }    from "../../app/lib/concierge/intentResolver";
import type { ConversationPlan }  from "../../app/lib/concierge/conversationPlanner";
import type { ConversationState } from "../../app/lib/concierge/types";

const ANCHORED_INTENT: ResolvedIntent = {
  intent: "anchored_refinement", signals: {}, entitySlug: undefined, compareSlug: [],
};
const ANCHOR_PLAN: ConversationPlan = {
  action: "anchored_refinement", reason: "fixture", requiresRetrieval: true,
  requiresComparison: false, requiresClarification: false,
  reuseRecommendations: false, nextIntent: "anchored_refinement",
};
const EMPTY_CONTEXT: ConversationState = {
  sessionId: "fixture", turns: [], context: {},
};

// ── Scenario E: No-match anchored refinement (catalogue boundary) ──────────────

const minSweet = Math.min(...mkcCatalogue.map(k => k.sweetness ?? 5));
const anchor   = mkcCatalogue.find(k => (k.sweetness ?? 5) <= minSweet);
if (!anchor) {
  console.error("ABORT: no min-sweetness anchor found in runtime catalogue");
  process.exit(1);
}

const retrieval = planRetrieval(
  ANCHORED_INTENT, EMPTY_CONTEXT, undefined, undefined, undefined, null, undefined,
  "like that but less sweet", anchor.slug,
);

if (retrieval.fragrances.length !== 0) {
  console.error(`ABORT: expected empty pool for anchor ${anchor.slug} (sweetness=${anchor.sweetness}), got ${retrieval.fragrances.length}`);
  process.exit(1);
}

// Mock model output for the no-match case: honest explanation + clarifying question.
// Does NOT mention any fragrance name or emit any [PRODUCT:slug] markers.
const mockModelOutput =
  `${anchor.name} already sits at the lower end of our sweetness range in the catalogue — ` +
  `no fragrance with a lower sweetness profile exists in our current collection. ` +
  `Would you like to explore a different dimension instead, such as lighter intensity or lower warmth?`;

const planned   = planResponse(mockModelOutput, "anchored_refinement", retrieval, ANCHOR_PLAN);
const formatted = formatResponse(planned);

// Verify the pipeline produces zero cards before saving
if (formatted.fragrances.length !== 0) {
  console.error(`ABORT: formatResponse produced ${formatted.fragrances.length} cards for zero-match retrieval`);
  process.exit(1);
}

// ── Write fixtures ─────────────────────────────────────────────────────────────

const OUT_DIR  = path.join(__dirname, "fixtures");
const OUT_FILE = path.join(OUT_DIR, "concierge-less-sweet.json");
fs.mkdirSync(OUT_DIR, { recursive: true });

const fixtures = {
  scenarioE: {
    ...formatted,
    sessionUpdates: {
      selectedSlug: anchor.slug,  // anchor preserved
    },
    // Metadata carried for test assertions
    _meta: {
      anchorSlug:        anchor.slug,
      anchorName:        anchor.name,
      anchorSweetness:   anchor.sweetness,
      strictMatches:     retrieval.anchoredMeta?.strictMatches,
      catalogueBoundary: retrieval.anchoredMeta?.catalogueBoundary,
    },
  },
};

fs.writeFileSync(OUT_FILE, JSON.stringify(fixtures, null, 2), "utf8");

console.log(`✓  Fixture written: ${OUT_FILE}`);
console.log(`   Anchor: ${anchor.name} (sweetness=${anchor.sweetness})`);
console.log(`   strictMatches: ${retrieval.anchoredMeta?.strictMatches}`);
console.log(`   catalogueBoundary: ${retrieval.anchoredMeta?.catalogueBoundary}`);
console.log(`   fragrances in response: ${formatted.fragrances.length}`);
console.log(`   content preview: "${formatted.content.slice(0, 80)}..."`);
