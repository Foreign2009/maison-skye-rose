/**
 * Maison Concierge — Response Planner
 *
 * Interprets raw LLM output: extracts [PRODUCT:slug] and [ARTICLE:slug] markers,
 * falls back to retrieval context when the model omits markers, and generates
 * contextual follow-up suggestions based on the ConversationPlan.
 *
 * EP15-P2: planResponse now accepts ConversationPlan for richer follow-ups.
 */

import type { ConversationIntent, ConversationProfile } from "./types";
import type { RetrievalContext, AnchoredMeta } from "./contextBuilder";
import type { ConversationPlan }   from "./conversationPlanner";
import { TRUNCATION_FALLBACK }     from "./claudeClient";
import { fragrancesNamedIn }       from "./intentResolver";
import { mkcCatalogue }            from "../mkc/catalogue";

// ── Marker patterns ───────────────────────────────────────────────────────────

// EP-AI-C6-P3-R2 Repair A: character class extended to include apostrophe (U+0027).
// 11 canonical MKC slugs contain apostrophes (e.g. voyage-d'hermes-inspired).
// Audit of all 222 MKC slugs confirms only [a-z0-9'-] chars appear in slugs.
const PRODUCT_RE = /\[PRODUCT:([a-z0-9'-]+)\]/g;
const ARTICLE_RE = /\[ARTICLE:([a-z0-9-]+)\]/g;

// ── Precedence-2 bare-name matching helpers ───────────────────────────────────
// Allows "Chanel No. 5" in prose to match canonical "Chanel No 5 Inspired",
// and "CK One" to match "CK One Inspired", without false positives.

const PROSE_NAME_SUFFIXES = [" Inspired", " Eau de Parfum", " EDP", " Eau de Toilette", " EDT"];

function stripProseSuffix(name: string): string {
  const lower = name.toLowerCase();
  for (const s of PROSE_NAME_SUFFIXES) {
    if (lower.endsWith(s.toLowerCase())) return name.slice(0, -s.length);
  }
  return name;
}

// Removes periods and collapses whitespace so "No. 5" ≡ "No 5".
function normalizeForProseMatch(s: string): string {
  return s.toLowerCase().replace(/\./g, "").replace(/\s+/g, " ").trim();
}

// ── No-match deterministic response ──────────────────────────────────────────
// Builds the entire response content for a no-match anchored_refinement turn from
// AnchoredMeta alone. No model prose is retained — the entire content comes from
// catalogue metadata so false claims (invented scores, zero-dimension assertions,
// product markers) cannot survive regardless of what the model returned.
//
// Three separate paths:
//   null score   — comparison cannot be established; no score invented
//   boundary     — anchor is at the limit of the catalogue range
//   exclusion    — lower/higher options exist but are filtered by active preferences
function buildNoMatchResponse(meta: AnchoredMeta): string {
  const { anchorName, dimension, direction, anchorScore, catalogueBoundary } = meta;

  if (anchorScore === null) {
    return (
      `${anchorName} does not have a ${dimension} score in our catalogue, so a directional comparison cannot be made.` +
      ` Would you like to explore another fragrance characteristic instead?`
    );
  }

  const dirWord  = direction === "less" ? "lower"  : "higher";
  const limitEnd = direction === "less" ? "lowest" : "highest";

  if (catalogueBoundary) {
    return (
      `${anchorName} is already at the ${limitEnd} end of our ${dimension} range (${anchorScore}/5)` +
      ` — no fragrance in our catalogue scores ${dirWord} in ${dimension}.` +
      ` Would you like to explore another fragrance characteristic instead?`
    );
  }

  return (
    `No fragrance scores ${dirWord} in ${dimension} than ${anchorName} (${anchorScore}/5) within your current preferences` +
    ` — ${dirWord}-${dimension} options may exist in the catalogue but are excluded by your active filters.` +
    ` Would you like to relax one of your preferences, or explore another fragrance characteristic instead?`
  );
}

// ── Strict-match absence-claim post-processor ────────────────────────────────
// After callClaude, sweeps residual absence-implying phrases from strict-match
// anchored_refinement responses. The calibration instruction explicitly prohibits
// phrases like "without sweetness" and "zero sweetness", but model compliance
// is probabilistic — this sweep corrects residual phrases that survive.
//
// Relative wording: phrases are corrected to "lower/higher {dim} than {anchorName}"
// (verified by the actual rendered candidate scores), not to flat "low/high" labels
// that have no anchor reference. Score tag appended only when all rendered candidates
// share the same score — avoids false precision for mixed-score pools.
//
// Preserves valid negations ("not zero sweetness") and quoted customer preferences
// ("I want no sweetness"). Checks 16 chars before the match for negation/preference words.
//
// Inferred failure mechanism: the model may treat absence phrases as legitimate
// fragrance character descriptions rather than literal echoes of the banned text.
// This is a plausible inference from the observed failure pattern, not a verified
// internal model cause.

function extractDimScore(
  f: { sweetness: number; freshness: number; warmth: number; intensity: number },
  dim: string,
): number | null {
  const map: Record<string, number> = {
    sweetness: f.sweetness,
    freshness: f.freshness,
    warmth:    f.warmth,
    intensity: f.intensity,
  };
  return map[dim.toLowerCase()] ?? null;
}

// Preserves valid negations ("not without sweetness", "isn't no sweetness") and
// quoted customer preferences ("I want no sweetness", "since you prefer no sweetness").
// Checks 16 characters before the match — wide enough for "I want " (7 chars) and
// "seeking " (8 chars). Includes negation words and preference-intent verbs.
function isNegatedOrPreference(text: string, offset: number): boolean {
  const preceding = text.slice(Math.max(0, offset - 16), offset);
  return /\b(?:not|isn't|aren't|don't|doesn't|never|want|wants|wanted|wanting|prefer|prefers|preferred|seek|seeking|avoid|avoiding|avoids)\s*$/i
    .test(preceding);
}

function replaceUnlessNegated(text: string, pattern: RegExp, repl: string): string {
  return text.replace(pattern, (match, offset: number) => (isNegatedOrPreference(text, offset) ? match : repl));
}

function sanitiseAbsenceClaims(
  content:  string,
  meta:     AnchoredMeta,
  rendered: RetrievalContext["fragrances"],  // actual rendered candidates only
): string {
  const { anchorName, dimension, direction, anchorScore } = meta;
  const dim     = dimension.toLowerCase();
  const dirComp = direction === "less" ? "lower" : "higher";

  // Score from rendered candidates for this dimension.
  // A score tag is added only when EVERY rendered candidate contributes a valid,
  // finite, in-range score AND all values match.
  //
  // The guard requires scores.length === rendered.length so that candidates for which
  // extractDimScore returns null (unscored dimension, unknown field) are never silently
  // excluded from the set in a way that produces a falsely shared tag.
  // e.g. rendered=[sw1, null] → scores=[1] → 1 ≠ 2 (rendered.length) → no tag.
  const scores = rendered.flatMap((f) => {
    const v = extractDimScore(
      f as { sweetness: number; freshness: number; warmth: number; intensity: number },
      dim,
    );
    return v !== null ? [v] : [];
  });
  const allSame =
    rendered.length > 0 &&
    scores.length === rendered.length &&
    scores.every((s) => Number.isFinite(s) && s >= 1 && s <= 5 && s === scores[0]);
  const scoreTag = allSame ? ` (${scores[0]}/5)` : "";

  // "with lower sweetness (1/5) than Baccarat Rouge 540 Inspired"
  // scoreTag placed between dimension and "than" so (1/5) unambiguously
  // belongs to the candidates' score, not to the anchor fragrance.
  const withRelative = `with ${dirComp} ${dim}${scoreTag} than ${anchorName}`;
  // "lower sweetness (1/5) than Baccarat Rouge 540 Inspired"
  const bareRelative = `${dirComp} ${dim}${scoreTag} than ${anchorName}`;

  let result = content;

  // "without [any|the|its|…] sweetness" → "with lower sweetness than {anchor}(scoreTag)"
  // The optional group covers common articles and determiners ("the", "its", "that", "all",
  // "this", "a", "much") observed in live model output alongside "any" (already covered).
  result = replaceUnlessNegated(result, new RegExp(`without(?:\\s+(?:any|the|its|that|all|this|a|much))?\\s+${dim}\\b`, "gi"), withRelative);
  // "no sweetness" (word boundary) → "lower sweetness than {anchor}(scoreTag)"
  result = replaceUnlessNegated(result, new RegExp(`\\bno\\s+${dim}\\b`, "gi"), bareRelative);
  // "zero sweetness" → "lower sweetness than {anchor}(scoreTag)"
  result = replaceUnlessNegated(result, new RegExp(`\\bzero\\s+${dim}\\b`, "gi"), bareRelative);
  // "sweetness-free" → "lower-sweetness"
  result = replaceUnlessNegated(result, new RegExp(`\\b${dim}-free\\b`, "gi"), `${dirComp}-${dim}`);

  // Sweetness-specific sugar synonyms (also forbidden by calibration instruction)
  if (dim === "sweetness") {
    result = replaceUnlessNegated(result, /without(?:\s+(?:any|the|its|that|all|this|a|much))?\s+sugar\b/gi, withRelative);
    result = replaceUnlessNegated(result, /\bno\s+sugar\b/gi, bareRelative);
    result = replaceUnlessNegated(result, /\bsugar-?free\b/gi, `${dirComp}-sweetness`);
    result = replaceUnlessNegated(result, /\bsugarless\b/gi, `${dirComp}-sweetness`);
  }

  // Pass A: Fix "verb + with lower/higher" produced when "verb without X" is replaced by
  // "verb with lower X than Y". Verbs that take a direct object (not a prepositional "with")
  // produce grammatically awkward constructions: "carries with lower sweetness" should be
  // "carries lower sweetness".
  result = result.replace(
    /\b(carries|has|contains|maintains|retains|registers|sits|scores)\s+with\s+(lower|higher)\b/gi,
    "$1 $2",
  );

  // Pass B: Strip score notations immediately after the anchor name.
  // Model prose sometimes states the candidate's score after the absence claim
  // (e.g. "zero sweetness at 1/5", "without sweetness, scoring 1/5"). After the
  // main substitution the anchor name lands before these notations, producing
  // "than AnchorName at 1/5" which reads as the anchor's score — not the candidate's.
  // The scoreTag already in the repaired phrase carries the candidate's score.
  //
  // Exception: preserve when the stated score equals the anchor's own score —
  // "than AnchorName at 3/5" may legitimately identify the anchor itself.
  const escapedAnchor = anchorName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  result = result.replace(
    new RegExp(`(than\\s+${escapedAnchor})(,?\\s+(?:at|scoring|scored)\\s+)(\\d+\/5)`, "gi"),
    (_m, before, _sep, score) => {
      if (anchorScore !== null && score === `${anchorScore}/5`) return _m;
      return before;
    },
  );

  return result;
}

// ── Helpers for candidate-specific attribution in sanitiseEqualScoreClaims ────

const MAISON_SUFFIXES_LC = [" inspired", " eau de parfum", " edp", " eau de toilette", " edt"] as const;

function stripMaisonSuffixLc(name: string): string {
  for (const s of MAISON_SUFFIXES_LC) {
    if (name.endsWith(s)) return name.slice(0, -s.length);
  }
  return name;
}

// Returns the text between the nearest sentence boundaries (.!?\n) surrounding
// the match at [matchStart, matchStart+matchLen). Non-terminal punctuation
// (commas, hyphens, parentheses, em dashes) is not treated as a boundary.
function getSentenceContaining(text: string, matchStart: number, matchLen: number): string {
  let start = 0;
  for (let i = matchStart - 1; i >= 0; i--) {
    if (/[.!?\n]/.test(text[i])) { start = i + 1; break; }
  }
  while (start < matchStart && text[start] === " ") start++;

  let end = text.length;
  for (let i = matchStart + matchLen; i < text.length; i++) {
    if (/[.!?\n]/.test(text[i])) { end = i + 1; break; }
  }

  return text.slice(start, end);
}

// Returns the text between the nearest blank-line boundaries (\n\n) surrounding
// the match at [matchStart, matchStart+matchLen). Single-sentence content with
// no blank lines returns the entire string. Used for paragraph-level fallback
// when the claim's sentence contains no fragrance name.
function getParagraphContaining(text: string, matchStart: number, matchLen: number): string {
  let start = 0;
  for (let i = matchStart - 1; i >= 1; i--) {
    if (text[i] === "\n" && text[i - 1] === "\n") { start = i + 1; break; }
  }
  while (start < matchStart && (text[start] === " " || text[start] === "\n")) start++;

  let end = text.length;
  const afterMatch = matchStart + matchLen;
  for (let i = afterMatch; i < text.length - 1; i++) {
    if (text[i] === "\n" && text[i + 1] === "\n") { end = i; break; }
  }
  return text.slice(start, end);
}

// Returns the single rendered candidate named in a sentence, or null when zero
// or two-or-more are identified (ambiguous attribution). Matches on full canonical
// name and bare name (Maison suffix stripped). Bare names shorter than 5 chars are
// excluded — same threshold as planResponse Precedence-2 name matching.
function resolveNamedCandidate(
  sentence: string,
  rendered: RetrievalContext["fragrances"],
): RetrievalContext["fragrances"][number] | null {
  const sentLower = sentence.toLowerCase();
  const matched: RetrievalContext["fragrances"][number][] = [];
  for (const f of rendered) {
    const fullKey = f.name.toLowerCase();
    const bareKey = stripMaisonSuffixLc(fullKey);
    if (sentLower.includes(fullKey) || (bareKey.length >= 5 && sentLower.includes(bareKey))) {
      matched.push(f);
    }
  }
  return matched.length === 1 ? matched[0] : null;
}

// ── Adjacent duplicate fragrance-name collapse ───────────────────────────────
// The model sometimes writes a fragrance name beside its [PRODUCT:slug] marker in a
// form that is not byte-identical to the canonical name ("Beautiful by Estée Lauder
// Inspired" vs canonical "Beautiful by Estee Lauder Inspired"), or places the name
// after the marker. Step 0b only collapses an exact canonical name before the marker,
// so marker substitution then produces "Name Name". This pass collapses a fragrance
// name immediately repeated on the same line (spaces/tabs only between the two) into
// one canonical name. Matching ignores accents, case and apostrophe style. Later
// mentions, other separators and different fragrances are left unchanged.

function foldForNameMatch(ch: string): string {
  return ch.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[‘’]/g, "'").toLowerCase();
}

function collapseAdjacentDuplicateNames(
  content:    string,
  fragrances: RetrievalContext["fragrances"],
): string {
  let result = content;
  for (const f of fragrances) {
    const foldedName = [...f.name].map(foldForNameMatch).join("");
    const escaped    = foldedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pairRE     = new RegExp(`(?<![\\p{L}\\p{N}])${escaped}[ \\t\\u00a0]+${escaped}(?![\\p{L}\\p{N}])`, "u");
    for (;;) {
      // Fold per original character, keeping a map back to original indices.
      let folded = "";
      const origIndex: number[] = [];
      for (let i = 0; i < result.length; i++) {
        const fc = foldForNameMatch(result[i]);
        folded += fc;
        for (let k = 0; k < fc.length; k++) origIndex.push(i);
      }
      const m = pairRE.exec(folded);
      if (!m) break;
      const start = origIndex[m.index];
      const end   = origIndex[m.index + m[0].length - 1] + 1;
      result = result.slice(0, start) + f.name + result.slice(end);
    }
  }
  return result;
}

// ── "Amber warmth" absence-claim correction ──────────────────────────────────
// "Amber warmth" is not the same thing as total warmth: the catalogue scores overall
// warmth (e.g. Terre d'Hermes Inspired 3/5), but says nothing reliable about an amber
// note or accord — a missing amber entry in notes/family/profile does not prove absence.
// So no absence (or presence) of amber is ever asserted. "without any amber warmth" reads
// as a denial of warmth the catalogue scores; when the phrase is attributed to exactly one
// rendered fragrance NAMED in the same sentence (or, failing that, the same paragraph) and
// that fragrance has a valid warmth score, it is replaced with a positive, metadata-backed
// statement ("with warmth rated 3/5"). Unattributed or ambiguous wording, or a missing or
// invalid score, is left unchanged. Negations, preference verbs and anything inside quoted
// (straight or curly) text — typically the guest's own words — are preserved.

const foldText = (s: string): string => [...s].map(foldForNameMatch).join("");

// Folded full name plus bare name (Maison suffix stripped, ≥5 chars).
function nameKeysFor(name: string): string[] {
  const full = foldText(name);
  const bare = stripMaisonSuffixLc(full);
  return bare !== full && bare.length >= 5 ? [full, bare] : [full];
}

let catalogueNameKeys: string[] | null = null;
function allCatalogueNameKeys(): string[] {
  if (!catalogueNameKeys) {
    const keys = new Set<string>();
    for (const k of mkcCatalogue) for (const key of nameKeysFor(k.name)) keys.add(key);
    catalogueNameKeys = [...keys];
  }
  return catalogueNameKeys;
}

const isNameChar = (c: string | undefined): boolean => c !== undefined && /[\p{L}\p{N}]/u.test(c);

// Start indices where `key` occurs in `folded` as a whole name: bounded by non-letter/digit
// characters and not inside a longer catalogue name occurrence (so "light blue" does not
// match within "light blue pour homme inspired").
function wholeNameOccurrences(folded: string, key: string): number[] {
  const longer = allCatalogueNameKeys().filter((k) => k.length > key.length && k.includes(key));
  const out: number[] = [];
  for (let i = folded.indexOf(key); i >= 0; i = folded.indexOf(key, i + 1)) {
    if (isNameChar(folded[i - 1]) || isNameChar(folded[i + key.length])) continue;
    const insideLonger = longer.some((k) => {
      for (let j = k.indexOf(key); j >= 0; j = k.indexOf(key, j + 1)) {
        const s = i - j;
        if (s >= 0 && folded.startsWith(k, s) && !isNameChar(folded[s - 1]) && !isNameChar(folded[s + k.length])) return true;
      }
      return false;
    });
    if (!insideLonger) out.push(i);
  }
  return out;
}

// Same rules as resolveNamedCandidate, but accent/apostrophe-insensitive and whole-name.
function resolveNamedCandidateFolded(
  text:     string,
  rendered: RetrievalContext["fragrances"],
): RetrievalContext["fragrances"][number] | null {
  const folded = foldText(text);
  const matched = rendered.filter((f) => nameKeysFor(f.name).some((k) => wholeNameOccurrences(folded, k).length > 0));
  return matched.length === 1 ? matched[0] : null;
}

// True when `offset` falls inside an open quotation within its paragraph. Single quotes
// open only after whitespace/start/bracket, so apostrophes ("d'Hermes", "isn't") never
// count; a single quote closes only when not followed by a letter or digit.
function isInsideQuotedText(text: string, offset: number): boolean {
  const paraStart = text.lastIndexOf("\n\n", offset);
  const scopeStart = paraStart < 0 ? 0 : paraStart + 2;
  const scope = text.slice(scopeStart, offset);
  if (((scope.match(/"/g) ?? []).length) % 2 === 1) return true;
  if (scope.lastIndexOf("“") > scope.lastIndexOf("”")) return true;
  let singleOpen = false;
  for (let i = 0; i < scope.length; i++) {
    const ch = scope[i];
    const prev = i === 0 ? " " : scope[i - 1];
    // Look ahead in the full text: a quote just before `offset` is followed by the match itself.
    const next = text[scopeStart + i + 1] ?? " ";
    if (!singleOpen && (ch === "'" || ch === "‘") && /[\s(\[]/.test(prev) && !/\s/.test(next)) {
      singleOpen = true;
    } else if (singleOpen && (ch === "'" || ch === "’") && !/[\p{L}\p{N}]/u.test(next)) {
      singleOpen = false;
    }
  }
  return singleOpen;
}

function isQuotedOrNegated(text: string, offset: number): boolean {
  return isInsideQuotedText(text, offset) || isNegatedOrPreference(text, offset);
}

function correctAmberWarmthAbsenceClaims(
  content:  string,
  rendered: RetrievalContext["fragrances"],
): string {
  if (rendered.length === 0) return content;
  const patterns: Array<[RegExp, (score: number) => string]> = [
    [/\bwithout(?:\s+(?:any|the|its|that|all|this|a|much))?\s+amber\s+warmth\b/gi, (s) => `with warmth rated ${s}/5`],
    [/\b(?:no|zero)\s+amber\s+warmth\b/gi, (s) => `warmth rated ${s}/5`],
  ];
  let result = content;
  for (const [pattern, repl] of patterns) {
    result = result.replace(pattern, (match: string, offset: number, whole: string) => {
      if (isQuotedOrNegated(whole, offset)) return match;
      const candidate =
        resolveNamedCandidateFolded(getSentenceContaining(whole, offset, match.length), rendered) ??
        resolveNamedCandidateFolded(getParagraphContaining(whole, offset, match.length), rendered);
      const score = candidate?.warmth;
      if (typeof score !== "number" || !Number.isInteger(score) || score < 1 || score > 5) return match;
      return repl(score);
    });
  }
  return result;
}

// ── Unsupported "without gourmand sweetness" qualifier ───────────────────────
// Observed: "Cardamom and Chinese Pepper create warmth without gourmand sweetness." for
// Oud Wood, whose context text says "creating warmth without aggression" and never uses
// "gourmand"; its listed base notes include Tonka Bean and Vanilla. A low sweetness score
// establishes neither the presence nor the absence of gourmand character, and a missing
// "Gourmand" family entry is not evidence of absence. The trailing qualifier is removed,
// leaving the model's own preceding clause ("create warmth."). No score or attribution is
// introduced. Left unchanged when:
//   - any fragrance in context mentions "gourmand" in its prompt-visible fields (the
//     wording might be grounded there; this function does not attribute claims),
//   - no cards are rendered (no-match turns),
//   - the phrase is quoted, or its sentence contains a negation ("not", "never", "cannot",
//     "-n't" with a straight or curly apostrophe) or a guest-preference word,
//   - the phrase is not followed by a clause boundary (". , ; : ! ?" or line end), e.g.
//     "without gourmand sweetness or heaviness",
//   - the preceding word is a linking/function word whose removal would strand it
//     ("is without …", "and without …").
// Only the exact phrase "without [any] gourmand sweetness" is handled.

const GOURMAND_ABSENCE_RE =
  /(?<=[\p{L}\p{N})])\s+without\s+(?:any\s+)?gourmand\s+sweetness(?=[.,;:!?]|[ \t]*(?:\n|$))/giu;
const STRANDING_WORD_RE =
  /\b(?:is|are|was|were|be|been|being|remains?|stays?|feels?|seems?|smells?|leaves?|with|and|or|but|nor|of|for|from|to|that|which|who|not|never)\s*$/i;
const GOURMAND_PREFERENCE_RE =
  /\b(?:not|never|cannot|\w+n['’]t|want|wants|wanted|wanting|prefer|prefers|preferred|like|likes|love|loves|seek|seeking|avoid|avoids|avoiding|asked|looking\s+for|rather)\b/i;

function contextMentionsGourmand(f: RetrievalContext["fragrances"][number]): boolean {
  const visible = [f.description ?? "", f.mood ?? "", ...(f.recommendedFor ?? []).slice(0, 2), ...(f.family ?? [])];
  return visible.some((t) => /gourmand/i.test(t));
}

function correctGourmandAbsenceClaims(
  content:  string,
  context:  RetrievalContext["fragrances"],
  rendered: RetrievalContext["fragrances"],
): string {
  if (rendered.length === 0 || context.some(contextMentionsGourmand)) return content;
  return content.replace(GOURMAND_ABSENCE_RE, (match: string, offset: number, whole: string) => {
    const at = offset + match.search(/without/i);
    if (isInsideQuotedText(whole, at)) return match;
    const before = whole.slice(sentenceStartBefore(whole, offset), offset);
    if (STRANDING_WORD_RE.test(before) || GOURMAND_PREFERENCE_RE.test(before)) return match;
    return "";
  });
}

// ── Anchor-contrast absence claims ───────────────────────────────────────────
// Observed (BR540 "less sweet", post-543c0bb):
//   "It's confident and magnetic without any of the amber-tonka warmth that makes
//    Baccarat Rouge so indulgent."
//   "Cardamom and Oud create warmth and luxury without the caramel-vanilla sweetness of
//    Baccarat Rouge — it's polished and refined instead."
// The context supplies only the anchor's name and anchored score — no anchor notes — so
// descriptors attributed to the anchor ("amber-tonka", "caramel-vanilla", "indulgent") are
// not grounded, and "without" asserts an absence in the candidate that its own scores do
// not support (Sauvage warmth 3/5; Oud Wood sweetness 1/5 with Vanilla listed). The whole
// "without … <dimension> of/that makes <anchor> …" span is replaced with the catalogue
// relative claim, scores attached to the right fragrance:
//   → "with lower warmth (3/5) than Baccarat Rouge 540 Inspired (4/5)"
// Scope: strict anchored turns only; the dimension must be one of sweetness / warmth /
// freshness / intensity, and the phrase must explicitly reference the anchor (full name,
// bare name, or a bare-name prefix of ≥2 words) via "of", "in" or "that/which makes", then
// reach a clause boundary. At most two descriptor words before the dimension.
// Attribution: the single rendered candidate named in the sentence; if the sentence names
// none, the single rendered candidate named in its paragraph. Unchanged when more than one
// candidate is named, when the sentence names any other catalogue fragrance (e.g. a
// non-rendered subject), or — for the paragraph fallback — when the sentence also names the
// anchor outside the matched phrase (it may describe the anchor itself) or the paragraph
// names any catalogue fragrance other than the anchor and the resolved candidate.
// Left unchanged when: quoted; the sentence contains a negation or preference word; the
// candidate or anchor score is missing; the candidate is not lower than the anchor on that
// dimension; or the phrase does not reference the anchor. Other "without …" wording
// (e.g. "without aggression") is not touched.

function namedRenderedCandidates(
  text:     string,
  rendered: RetrievalContext["fragrances"],
): RetrievalContext["fragrances"] {
  const folded = foldText(text);
  return rendered.filter((f) => nameKeysFor(f.name).some((k) => wholeNameOccurrences(folded, k).length > 0));
}

// True when the sentence names a catalogue fragrance that is neither the anchor nor one of
// `named` (the rendered candidates found there) — e.g. a non-rendered fragrance as subject.
function namesOtherFragrance(sentence: string, anchorName: string, named: RetrievalContext["fragrances"]): boolean {
  const folded = foldText(sentence);
  const allowed = new Set([...nameKeysFor(anchorName), ...named.flatMap((f) => nameKeysFor(f.name))]);
  return allCatalogueNameKeys().some((key) => !allowed.has(key) && wholeNameOccurrences(folded, key).length > 0);
}

function anchorAliasPattern(anchorName: string): string {
  const full  = anchorName.toLowerCase();
  const bare  = stripMaisonSuffixLc(full);
  const words = bare.split(" ");
  const aliases = new Set([full, bare]);
  for (let n = words.length - 1; n >= 2; n--) aliases.add(words.slice(0, n).join(" "));
  return [...aliases]
    .sort((a, b) => b.length - a.length)
    .map((a) => a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s+"))
    .join("|");
}

function correctAnchorContrastAbsenceClaims(
  content:  string,
  meta:     AnchoredMeta,
  rendered: RetrievalContext["fragrances"],
): string {
  const { anchorDimScores } = meta;
  if (!anchorDimScores || rendered.length === 0) return content;
  const ref = `(?:${anchorAliasPattern(meta.anchorName)})\\b`;
  const anchorRef = new RegExp(`\\b${ref}`, "i");
  const re = new RegExp(
    `\\bwithout\\s+(?:any\\s+of\\s+)?(?:the\\s+|its\\s+)?(?:[a-z]+(?:-[a-z]+)*\\s+){0,2}` +
    `(sweetness|warmth|freshness|intensity)\\s+` +
    `(?:(?:of|in)\\s+${ref}|(?:that|which)\\s+makes?\\s+${ref}(?:\\s+(?:so\\s+|feel\\s+|very\\s+)?[a-z-]+)?)` +
    `(?=\\s*(?:[.,;:!?—–]|$))`,
    "gi",
  );
  return content.replace(re, (match: string, dimRaw: string, offset: number, whole: string) => {
    if (isInsideQuotedText(whole, offset)) return match;
    if (GOURMAND_PREFERENCE_RE.test(whole.slice(sentenceStartBefore(whole, offset), offset))) return match;

    const sentence   = getSentenceContaining(whole, offset, match.length);
    const inSentence = namedRenderedCandidates(sentence, rendered);
    if (namesOtherFragrance(sentence, meta.anchorName, inSentence)) return match;
    let pool = inSentence;
    if (pool.length === 0) {
      // Paragraph fallback (pronoun or note-led subject). Rejected when the sentence itself
      // names the anchor outside the matched phrase (it may be describing the anchor), or
      // when the paragraph names any other catalogue fragrance besides the resolved one.
      const end = offset + match.length;
      const outsideMatch = `${whole.slice(sentenceStartBefore(whole, offset), offset)} ${whole.slice(end, sentenceEndAfter(whole, end))}`;
      if (anchorRef.test(outsideMatch)) return match;
      const paragraph = getParagraphContaining(whole, offset, match.length);
      pool = namedRenderedCandidates(paragraph, rendered);
      if (pool.length === 1 && namesOtherFragrance(paragraph, meta.anchorName, pool)) return match;
    }
    if (pool.length !== 1) return match;

    const dim = dimRaw.toLowerCase();
    const candidateScore = extractDimScore(
      pool[0] as { sweetness: number; freshness: number; warmth: number; intensity: number },
      dim,
    );
    const anchorScore = anchorDimScores[dim];
    if (!validScore(candidateScore) || !validScore(anchorScore) || candidateScore >= anchorScore) return match;

    return `with lower ${dim} (${candidateScore}/5) than ${meta.anchorName} (${anchorScore}/5)`;
  });
}

// ── Strict-match "removal" claim correction ──────────────────────────────────
// "Oud Wood removes the sweetness almost entirely (1/5)": a 1/5 score supports lower
// sweetness than the anchor (e.g. Baccarat Rouge 540 Inspired 3/5), not near-total
// removal. On strict-match anchored_refinement turns with direction "less", removal
// verbs applied to the anchored dimension are rewritten as a relative claim with scores
// attached to the right fragrance:
//   "removes the sweetness almost entirely (1/5)"
//     → "has lower sweetness (1/5) than Baccarat Rouge 540 Inspired (3/5)"
// Attribution (conservative) — the claim is rewritten only when exactly one rendered
// candidate is grammatically tied to it within the same sentence:
//   finite verb:    "<Candidate> removes …"           (only whitespace between name and claim)
//   shared subject: "<Candidate> keeps some warmth (4/5) but removes …" — one "-s" verb, up
//                   to six plain words or "(n/5)" scores, then "but"; no conjunction, pronoun,
//                   relative word, punctuation or other fragrance name in between
//   gerund:         "<Candidate> is <adj>[ and <adj>], removing …"
// The candidate name must be a whole name (not inside a longer catalogue name) and must
// not be part of a coordinated subject ("A and <Candidate> …"). If the anchor is the tied
// subject, no candidate is tied, or more than one is, the claim is left unchanged —
// rendered cards and nearby names alone never establish the subject. The tied candidate's
// own score must be valid and below the anchor's.
// Adverb-first forms "almost/nearly/virtually/practically entirely/completely/totally
// removes …" are consumed whole; any other "-ly" adverb directly before the verb (e.g.
// "mostly removes") leaves the claim unchanged to avoid partial rewrites.
// An explicit comparison target later in the same sentence ("… than another fragrance")
// leaves the claim unchanged — no second comparison is inserted.
// Guarantee: a rewrite only ever uses the score of the single rendered candidate matched by
// the patterns above. Anything else is left as written, including: subjects that are not a
// rendered candidate (e.g. a non-rendered fragrance, which is never scored here), pronoun
// and plural subjects, constructions other than the three above (including a new subject
// after "but": "<Candidate> keeps … but <Other> removes …" is tied to <Other> only if <Other>
// is itself a rendered candidate directly before the verb), passive forms ("the
// sweetness is removed"), other verbs ("takes away", "cuts out"), claims followed by any
// "than …" in the same sentence (including anchor targets), and turns without strict
// anchored metadata. Negations, preference verbs and quoted text are kept.

function validScore(v: unknown): v is number {
  return typeof v === "number" && Number.isInteger(v) && v >= 1 && v <= 5;
}

function sentenceStartBefore(text: string, offset: number): number {
  for (let i = offset - 1; i >= 0; i--) {
    if (/[.!?\n]/.test(text[i])) return i + 1;
  }
  return 0;
}

function sentenceEndAfter(text: string, from: number): number {
  for (let i = from; i < text.length; i++) {
    if (/[.!?\n]/.test(text[i])) return i;
  }
  return text.length;
}

function sanitiseRemovalClaims(
  content:  string,
  meta:     AnchoredMeta,
  rendered: RetrievalContext["fragrances"],
): string {
  if (meta.direction !== "less" || !validScore(meta.anchorScore) || rendered.length === 0) return content;
  const dim         = meta.dimension.toLowerCase();
  const anchorScore = meta.anchorScore;
  const scoreOf = (f: RetrievalContext["fragrances"][number]) =>
    extractDimScore(f as { sweetness: number; freshness: number; warmth: number; intensity: number }, dim);

  const FINITE_LINK = /^\s+$/;
  const GERUND_LINK = /^\s+is\s+[a-z-]+(?:\s+and\s+[a-z-]+)?,\s+$/;
  const COORDINATED = /(?:\band|\bor|\bplus|&|\bas well as)\s+$/;
  // Shared subject: "<Name> keeps some warmth (4/5) but removes …" — one -s verb, a short
  // object of plain words / "(n/5)" scores, then "but". Anything that could introduce a new
  // subject or clause (conjunctions, pronouns, relatives, punctuation, another fragrance
  // name) breaks the tie.
  const SHARED_LINK = /^\s+[a-z]+s((?:\s+(?:[a-z-]+|\(\d\/5\))){1,6})\s+but\s+$/;
  const SHARED_STOP = /\b(?:and|or|nor|but|yet|so|while|whereas|although|though|because|than|it|this|that|these|those|which|who|whom|whose|he|she|they|one)\b/;
  const sharedObjectIsPlain = (object: string): boolean =>
    !SHARED_STOP.test(object) && !allCatalogueNameKeys().some((k) => wholeNameOccurrences(object, k).length > 0);

  const linksToClaim = (rest: string, finite: boolean): boolean => {
    if (!finite) return GERUND_LINK.test(rest);
    if (FINITE_LINK.test(rest)) return true;
    const shared = SHARED_LINK.exec(rest);
    return shared !== null && sharedObjectIsPlain(shared[1]);
  };

  // True when a whole-name occurrence of `name` is connected to the claim by an accepted link.
  const isTiedSubject = (prefix: string, name: string, finite: boolean): boolean =>
    nameKeysFor(name).some((key) =>
      wholeNameOccurrences(prefix, key).some((at) =>
        linksToClaim(prefix.slice(at + key.length), finite) && !COORDINATED.test(prefix.slice(0, at)),
      ),
    );

  const escDim = dim.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const removalRE = new RegExp(
    `(?:\\b(?:almost|nearly|virtually|practically)\\s+(?:entirely|completely|totally)\\s+)?` +
    `\\b(removes|remove|removing|strips|strip|stripping|eliminates|eliminate|eliminating)` +
    `(?:\\s+(?:away|out))?` +
    `\\s+(?:the\\s+|its\\s+|their\\s+|all\\s+(?:the\\s+|its\\s+)?|most\\s+of\\s+(?:the\\s+|its\\s+)?|much\\s+of\\s+(?:the\\s+|its\\s+)?)?` +
    `${escDim}` +
    `(?:\\s+(?:almost|nearly|virtually|practically|all\\s+but)?\\s*(?:entirely|completely|altogether|totally))?` +
    `(?:\\s*\\(\\d\\/5\\))?`,
    "gi",
  );

  return content.replace(removalRE, (match: string, verb: string, offset: number, whole: string) => {
    if (isQuotedOrNegated(whole, offset)) return match;

    const v = verb.toLowerCase();
    if (/^(remove|strip|eliminate)$/.test(v)) return match;                     // plural subject
    if (/\b\w+ly\s+$/i.test(whole.slice(Math.max(0, offset - 24), offset))) return match;  // unconsumed adverb

    const end = offset + match.length;
    if (/\bthan\b/i.test(whole.slice(end, sentenceEndAfter(whole, end)))) return match;    // explicit target

    // The claim must be grammatically tied to exactly one rendered candidate in this sentence.
    const prefix = foldText(whole.slice(sentenceStartBefore(whole, offset), offset));
    const finite = !v.endsWith("ing");
    if (isTiedSubject(prefix, meta.anchorName, finite)) return match;
    const tied = rendered.filter((f) => isTiedSubject(prefix, f.name, finite));
    if (tied.length !== 1) return match;

    const score = scoreOf(tied[0]);
    if (!validScore(score) || score >= anchorScore) return match;

    const lead = v.endsWith("ing") ? "with" : "has";
    return `${lead} lower ${dim} (${score}/5) than ${meta.anchorName} (${anchorScore}/5)`;
  });
}

// ── Equal-score comparative-claim post-processor ──────────────────────────────
// Corrects model claims of the form "higher/lower DIM (X/5)" when:
//   (a) the anchor's actual score for that dimension equals X (gate 2),
//   (b) the claim is not an explicit comparison against a non-anchor reference (gate 2b),
//   (c) the rendered candidate named in the claim's sentence is resolvable (gate 3), and
//   (d) that candidate's actual catalogue score also equals X (gate 4).
//
// Explicit-comparison guard (gate 2b): when "than X" follows the claim, correction proceeds
// only if X exactly matches the anchor's full name, bare name, or a bare-name word-prefix
// of ≥2 words. Compound ("than Baccarat Rouge and Sauvage"), partial ("than rouge") and
// unrelated ("than heavier ouds") targets leave the phrase unchanged. "than Baccarat Rouge"
// passes as a supported 2-word prefix of "Baccarat Rouge 540".
//
// Candidate-specific attribution (gate 3): the named fragrance within the claim's sentence
// is resolved via resolveNamedCandidate. When the sentence uses a pronoun ("It's a statement
// piece… higher warmth (4/5)"), a paragraph-level fallback is attempted: if exactly one
// rendered candidate is named in the surrounding paragraph (bounded by blank lines), that
// candidate is used. Zero or multiple paragraph-level matches remain unchanged (ambiguous).
// This prevents Oud Wood's warmth=4 from validating a claim attributed to Sauvage (warmth=3).
//
// Negation/preference guard: catches "not higher warmth" and auxiliary-not constructions
// ("does not offer higher warmth") within a 16-char preceding window.
//
// Scope: anchored_refinement turns with strictMatches=true and anchorDimScores available.
// Limitation: bare comparative phrases without a score tag (e.g. "offers higher warmth")
// are not corrected here — that residual path requires prompt-level guidance.
function sanitiseEqualScoreClaims(
  content:  string,
  meta:     AnchoredMeta,
  rendered: RetrievalContext["fragrances"],
): string {
  const { anchorDimScores } = meta;
  if (!anchorDimScores || rendered.length === 0) return content;

  // Restricted to the four dimensions handled by extractDimScore; versatility would
  // always produce null scores (extractDimScore doesn't map it), so it is excluded.
  const SCORED_DIMS = ["sweetness", "freshness", "warmth", "intensity"] as const;
  let result = content;

  for (const dim of SCORED_DIMS) {
    const anchorDimScore = anchorDimScores[dim];
    if (anchorDimScore === undefined) continue;                          // gate 1

    const input = result;
    result = input.replace(
      new RegExp(`\\b(?:higher|lower)\\s+(${dim})\\s*\\((\\d+)\\/5\\)`, "gi"),
      (match, dimension, statedScoreStr, offset) => {
        const statedScore = parseInt(statedScoreStr, 10);

        // Gate 2: anchor's actual score must equal the stated score.
        // A mismatch means this is a correct non-equal claim or a hallucination that does
        // not implicate equal-score confusion with the anchor.
        if (statedScore !== anchorDimScore) return match;               // gate 2

        // Gate 2b: explicit non-anchor comparison guard.
        // When "than X" is present, only proceed if X resolves to the anchor.
        // "than Baccarat Rouge" names the anchor and passes; all other targets block.
        const afterMatch = input.slice(offset + match.length, offset + match.length + 60);
        const thanM = /^[,\s]*than\s+(.{1,40})/i.exec(afterMatch);
        if (thanM) {
          const compareTarget  = thanM[1].toLowerCase().replace(/[.,;!?].*$/, "").trim();
          const anchorFullKey  = meta.anchorName.toLowerCase();
          const anchorBareKey  = stripMaisonSuffixLc(anchorFullKey);
          // Build explicit alias set: full name, bare name, and bare-name word-prefixes of ≥2 words.
          // "Baccarat Rouge" passes; compound "Baccarat Rouge and Sauvage" and partials do not.
          const anchorAliases  = new Set([anchorFullKey, anchorBareKey]);
          const bareWords      = anchorBareKey.split(" ");
          for (let n = bareWords.length - 1; n >= 2; n--) {
            anchorAliases.add(bareWords.slice(0, n).join(" "));
          }
          if (!anchorAliases.has(compareTarget)) return match;         // gate 2b
        }

        // Gate 3: resolve the single candidate named in this claim.
        // First attempt sentence-level attribution. When the sentence uses a pronoun
        // (no fragrance name), fall back to the surrounding paragraph (bounded by blank
        // lines): exactly one rendered candidate named there is sufficient. Zero or
        // multiple paragraph-level matches are ambiguous — leave unchanged.
        const sentence = getSentenceContaining(input, offset, match.length);
        let candidate = resolveNamedCandidate(sentence, rendered);
        if (!candidate) {
          const paragraph = getParagraphContaining(input, offset, match.length);
          candidate = resolveNamedCandidate(paragraph, rendered);
        }
        if (!candidate) return match;                                    // gate 3

        // Gate 4: that candidate's actual catalogue score must equal the stated score.
        // A mismatch means the model hallucinated the score or misattributed the claim.
        const candidateScore = extractDimScore(
          candidate as { sweetness: number; freshness: number; warmth: number; intensity: number },
          dim,
        );
        if (candidateScore !== statedScore) return match;               // gate 4

        // Negation/preference guard — 16-char preceding window.
        // (?:\s+\w+)? catches auxiliary-not: "does not offer higher warmth".
        const preceding = input.slice(Math.max(0, offset - 16), offset);
        if (
          /\b(?:not|isn't|aren't|don't|doesn't|never|want|wants|wanted|wanting|prefer|prefers|preferred|seek|seeking|avoid|avoiding|avoids)(?:\s+\w+)?\s*$/i
            .test(preceding)
        ) {
          return match;
        }
        return `the same ${dimension} (${statedScoreStr}/5)`;
      },
    );
  }
  return result;
}

// ── Contextual follow-up generation ──────────────────────────────────────────

// ── Static follow-up pools ────────────────────────────────────────────────────
// Baseline suggestions per intent. Profile-safe filtering runs at generation
// time — suggestions that would propose avoided or rejected directions are
// removed before the slice. Deterministic only: no additional LLM call.

// Fragrance-comparison chips: only meaningful with two or more fragrance cards on screen.
const COMPARE_THESE_CHIP  = "Compare these";
const WHICH_EVENINGS_CHIP = "Which is better for evenings?";

const STATIC_FOLLOW_UPS: Record<ConversationIntent, string[]> = {
  similar_to:          [COMPARE_THESE_CHIP, "Show me another option", "Find something fresher"],
  comparison:          ["Show me something different", WHICH_EVENINGS_CHIP],
  education:           ["Show fragrances in this family", "Teach me more"],
  occasion_search:     ["Find something subtler", "Show best sellers for this occasion"],
  seasonal:            ["Show year-round options", "Find something for cooler weather"],
  gift:                ["Show luxury gift options", "Find something for daily wear"],
  general_discovery:   ["Help me find my signature scent", "Show best sellers"],
  clarification:       ["Shop by occasion", "Help me explore families"],
  anchored_refinement: ["Show me more in this direction", COMPARE_THESE_CHIP, "Tell me more about this one"],
};

// Follow-up phrases that could inadvertently propose a direction the guest
// explicitly dislikes. We filter these out when we can detect a conflict.
const DIRECTION_KEYWORDS: Array<{ phrase: string; families: string[]; vibes: string[] }> = [
  { phrase: "something warmer",      families: ["oriental", "amber", "woody"], vibes: ["warm"] },
  { phrase: "for cooler weather",    families: ["oriental", "amber"],          vibes: ["warm", "cosy"] },
  { phrase: "luxury gift options",   families: [],                             vibes: [] },
  { phrase: "show best sellers",     families: [],                             vibes: [] },
  { phrase: "find something fresher",families: ["citrus", "aquatic", "green"], vibes: ["fresh"] },
  { phrase: "shop by occasion",      families: [],                             vibes: [] },
];

function isSuggestionSafe(
  suggestion:      string,
  avoidedFamilies: string[],
  avoidedNotes:    string[],
): boolean {
  const s = suggestion.toLowerCase();
  for (const { phrase, families } of DIRECTION_KEYWORDS) {
    if (s.includes(phrase.toLowerCase()) && families.length > 0) {
      if (families.some((fam) =>
        avoidedFamilies.some((af) => af.toLowerCase().includes(fam) || fam.includes(af.toLowerCase()))
      )) return false;
    }
  }
  // Crude note check: if the suggestion mentions a note the guest avoids
  for (const note of avoidedNotes) {
    if (note.length > 3 && s.includes(note.toLowerCase())) return false;
  }
  return true;
}

// Exact labels only — other "Compare …" chips (e.g. families, articles) are unaffected.
const FRAGRANCE_COMPARISON_CHIPS = new Set([COMPARE_THESE_CHIP, WHICH_EVENINGS_CHIP]);

export function requiresMultipleFragrances(chip: string): boolean {
  return FRAGRANCE_COMPARISON_CHIPS.has(chip.trim());
}

// Removes multi-fragrance chips when fewer than two distinct fragrance cards are shown.
// Article cards are not fragrances and must not be counted by callers.
export function suppressComparisonChips(chips: string[], distinctFragranceCount: number): string[] {
  return distinctFragranceCount >= 2 ? chips : chips.filter((c) => !requiresMultipleFragrances(c));
}

function generateFollowUps(
  plan:      ConversationPlan,
  intent:    ConversationIntent,
  hasRecs:   boolean,
  profile?:  ConversationProfile,
  recCount?: number,
): string[] {
  const avoidedFamilies = (profile?.avoidedFamilies?.value ?? []).map((f) => f.toLowerCase());
  const avoidedNotes    = (profile?.avoidedNotes?.value    ?? []).map((n) => n.toLowerCase());

  // Applied before the slice so a single-product response keeps a useful second chip.
  const filter = (suggestions: string[]): string[] =>
    (recCount === undefined ? suggestions : suppressComparisonChips(suggestions, recCount))
      .filter((s) => isSuggestionSafe(s, avoidedFamilies, avoidedNotes))
      .slice(0, 2);

  // Clarification turns — minimal, focused
  if (plan.requiresClarification) {
    return filter(["Shop by occasion", "Help me explore families"]);
  }

  // Comparison just completed — profile-neutral post-comparison suggestions
  if (plan.requiresComparison) {
    return filter(["Show me something different", "Find gifts", "Show best sellers"]);
  }

  // Cache-reuse path — customer already has recommendations
  if (plan.reuseRecommendations && hasRecs) {
    return filter([COMPARE_THESE_CHIP, "Show me another option", "Teach me more"]);
  }

  // Education completed
  if (plan.nextIntent === "education" || intent === "education") {
    return filter(["Show fragrances in this family", "Teach me more", "Find gifts"]);
  }

  // Consultation readiness gate fired — suggest discovery alternatives
  if (plan.consultationReadinessQuestion) {
    return filter(["Show me what's popular", "Help me explore by occasion"]);
  }

  // anchored_refinement with empty pool: product-referencing chips ("Compare these two",
  // "Show me more in this direction") make no sense when zero cards were returned.
  // Redirect toward adjacent dimensions or broader discovery instead.
  if (intent === "anchored_refinement" && !hasRecs) {
    // "Try a different direction" is honest: routes to new_search with no direction re-trigger.
    // "Explore the catalogue" is honest: routes to general_discovery using quality-ranked pool
    // (sortByQuality: bestSeller → overallScore → popularity). Does not promise a different anchor
    // is excluded — retrieval may still return the anchor since mentionedSlug persists in context.
    // "Explore a different family" was replaced because the pipeline cannot enforce a family
    // change from this chip text alone (no family signal in the message).
    return filter(["Try a different direction", "Explore the catalogue"]);
  }

  // Generic selection based on intent. Comparison chips are already suppressed by
  // filter() when fewer than 2 distinct cards are shown, for every intent.
  return filter(STATIC_FOLLOW_UPS[intent] ?? STATIC_FOLLOW_UPS.general_discovery);
}

// ── Deterministic comparison response ─────────────────────────────────────────

const COMPARISON_DIMS_META: Array<{ key: string; label: string }> = [
  { key: "sweetness",   label: "Sweetness"   },
  { key: "freshness",   label: "Freshness"   },
  { key: "warmth",      label: "Warmth"      },
  { key: "intensity",   label: "Intensity"   },
  { key: "versatility", label: "Versatility" },
];

// Resolves comparison candidates from RetrievalContext exactly once.
// undefined or empty comparisonCandidateSlugs means no resolved selection — returns [].
// Missing metadata must not promote supplementary retrieval fragrances into candidates.
function resolveComparisonCandidates(
  retrieval: RetrievalContext,
): RetrievalContext["fragrances"] {
  if (!retrieval.comparisonCandidateSlugs?.length) {
    return [];
  }
  const fragMap = new Map(retrieval.fragrances.map(f => [f.slug, f]));
  return retrieval.comparisonCandidateSlugs
    .map(slug => fragMap.get(slug))
    .filter((f): f is RetrievalContext["fragrances"][number] => f !== undefined);
}

// Builds the authoritative comparison response from catalogue data.
// Replaces model prose entirely for resolved comparison turns.
// Receives pre-resolved candidates from resolveComparisonCandidates.
//
// Dimensions shown:
//   - Explicit: those in focusDims (from retrieval.comparisonFocusDims)
//   - Implicit: top-3 by max spread across all candidates when none specified
//
// Missing numeric values are omitted, never substituted with 0.
// Candidate order matches the resolved-slug order. Occasions always included.
function buildDeterministicComparisonResponse(
  candidates: RetrievalContext["fragrances"],
  focusDims:  string[],
): string {
  // Select dimensions to show
  let dimsToShow: Array<{ key: string; label: string }>;
  if (focusDims.length > 0) {
    dimsToShow = COMPARISON_DIMS_META.filter((d) => focusDims.includes(d.key));
  } else {
    // No explicit request: top 3 by max spread across all candidate pairs
    const scored = COMPARISON_DIMS_META.map((d) => {
      let maxSpread = 0;
      for (let i = 0; i < candidates.length; i++) {
        for (let j = i + 1; j < candidates.length; j++) {
          const vi = (candidates[i] as Record<string, unknown>)[d.key];
          const vj = (candidates[j] as Record<string, unknown>)[d.key];
          if (typeof vi === "number" && typeof vj === "number") {
            maxSpread = Math.max(maxSpread, Math.abs(vi - vj));
          }
        }
      }
      return { key: d.key, label: d.label, maxSpread };
    });
    scored.sort((a, b) => b.maxSpread - a.maxSpread);
    dimsToShow = scored.slice(0, 3).map(({ key, label }) => ({ key, label }));
  }

  const rows = candidates.map((f) => {
    const fragRec = f as Record<string, unknown>;

    const scoreStr = dimsToShow
      .map(({ key, label }) => {
        const v = fragRec[key];
        return typeof v === "number" ? `${label.toLowerCase()} ${v}/5` : null;
      })
      .filter((s): s is string => s !== null)
      .join(", ");

    const occ = (fragRec.occasions as string[] | undefined)?.slice(0, 5).join(", ") ?? "";

    const parts = [
      scoreStr || null,
      occ ? `occasions: ${occ}` : null,
    ].filter((p): p is string => p !== null);

    return `${f.name}: ${parts.length > 0 ? parts.join(" · ") : "—"}`;
  });

  const followUp =
    focusDims.length === 1
      ? `Which ${focusDims[0]} level suits you best?`
      : focusDims.length > 1
      ? `Which of these fits what you had in mind?`
      : `Which character appeals most to you?`;

  // Each row is separated by \n\n so ConciergeMessage renders them as distinct paragraphs.
  return rows.join("\n\n") + "\n\n" + followUp;
}

// ── Public types ──────────────────────────────────────────────────────────────

export interface PlannedResponse {
  content:             string;
  recommendedSlugs:    string[];
  articleSlugs:        string[];
  followUpSuggestions: string[];
  intent:              ConversationIntent;
}

// ── Public API ────────────────────────────────────────────────────────────────

export function planResponse(
  rawContent: string,
  intent:     ConversationIntent,
  retrieval:  RetrievalContext,
  plan:       ConversationPlan,
  profile?:   ConversationProfile,
  explicitEntitySlug?: string, // the one fragrance the guest named in this message (W9-C4)
): PlannedResponse {
  // Capture before any mutation so the truncation-fallback guard below is reliable.
  const isTruncationFallback = rawContent === TRUNCATION_FALLBACK;

  const rawSlugs:    string[] = [];
  const articleSlugs: string[] = [];

  // Normalise typographic apostrophes inside product and article markers.
  // LLMs may emit U+2019 in slugs (e.g. terre-d'hermes) even when the context
  // used U+0027. PRODUCT_RE only matches U+0027; without this normalisation the
  // marker falls through to Repair B, which strips it and loses the name.
  rawContent = rawContent.replace(/\[(?:PRODUCT|ARTICLE):[^\]]+\]/g, (m) =>
    m.replace(/[‘’]/g, "'")
  );

  // Extract [PRODUCT:slug] markers and preserve the canonical name in prose.
  //
  // The model wraps product markers in **...** for emphasis: **[PRODUCT:slug]**.
  // ConciergeMessage renders content as a plain text node (no markdown processor),
  // so those asterisks appear as literal characters. Handling bold-wrapped and
  // non-bold forms as separate patterns removes the ** together with the marker,
  // preventing orphaned **** from appearing in the chat bubble.
  //
  // Valid slug (present in retrieval context) → replaced with the canonical name.
  // Unknown / disallowed slug                 → replaced with "" (whole construct
  //                                             removed; no marker leaked to UI).
  //
  // Slug collection pre-scan: capture slugs in text-appearance order before the
  // two replacement passes. The bold pass (Step 1) and non-bold pass (Step 2)
  // run in a fixed sequence; without a pre-scan a bold slug positioned after a
  // non-bold one in the text would still be pushed first, inverting first-mentioned
  // priority when cardTarget limits the selection to fewer cards than markers.
  // Step 0: Collapse **canonical name** [PRODUCT:slug] → [PRODUCT:slug].
  // Only collapses when the bold text matches that product's canonical name AND
  // the slug is present in the retrieval context (eligible this turn).
  // Unrelated bold prose and out-of-retrieval slugs are preserved unchanged so
  // Steps 1/2 handle or discard them cleanly without double-processing.
  rawContent = rawContent.replace(/\*\*([^*]+)\*\*\s*(\[PRODUCT:[a-z0-9'-]+\])/g, (_match, name: string, marker: string) => {
    const slug = marker.slice(9, -1); // '[PRODUCT:'.length === 9, strip trailing ']'
    const frag = retrieval.fragrances.find((f) => f.slug === slug);
    if (!frag) return _match;
    if (frag.name.toLowerCase().trim() !== name.trim().toLowerCase()) return _match;
    return marker;
  });

  // Step 0b: Collapse bare canonical-name [PRODUCT:slug] → [PRODUCT:slug].
  // On comparison turns the model often writes the name in prose and then
  // immediately emits a marker: "Sauvage Inspired [PRODUCT:sauvage-inspired]".
  // Step 2 would then substitute the marker with the name again, producing
  // "Sauvage Inspired Sauvage Inspired". Collapsing here prevents the duplicate.
  // Only fires when the name is immediately adjacent (optional whitespace only) —
  // legitimate mentions elsewhere in the same sentence are not affected.
  for (const frag of retrieval.fragrances) {
    const escapedName = frag.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const escapedSlug = frag.slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    rawContent = rawContent.replace(
      new RegExp(`${escapedName}\\s*(\\[PRODUCT:${escapedSlug}\\])`, "g"),
      "$1",
    );
  }

  {
    const slugScanRE = /\*\*\[PRODUCT:([a-z0-9'-]+)\]\*\*|\[PRODUCT:([a-z0-9'-]+)\]/g;
    let m: RegExpExecArray | null;
    while ((m = slugScanRE.exec(rawContent)) !== null) {
      const slug = m[1] ?? m[2];
      if (!rawSlugs.includes(slug)) rawSlugs.push(slug);
    }
  }
  // Step 1: bold-wrapped markers (**[PRODUCT:slug]**) — content replacement only.
  let content = rawContent.replace(/\*\*\[PRODUCT:([a-z0-9'-]+)\]\*\*/g, (_, slug: string) => {
    const frag = retrieval.fragrances.find((f) => f.slug === slug);
    return frag ? frag.name : "";
  });
  // Step 2: non-bold (or asymmetrically-wrapped) markers ([PRODUCT:slug])
  content = content.replace(PRODUCT_RE, (_, slug: string) => {
    const frag = retrieval.fragrances.find((f) => f.slug === slug);
    return frag ? frag.name : "";
  });

  // Extract [ARTICLE:slug] markers and preserve the canonical title in prose.
  // The model emits [ARTICLE:slug] without bold-wrapping per system prompt, but
  // bold-wrapped form is handled first for safety.
  //
  // Valid slug (present in retrieval context) → replaced with the article title;
  //                                             slug added to articleSlugs for card.
  // Unknown / out-of-retrieval slug           → replaced with "" (removed cleanly);
  //                                             slug NOT added to articleSlugs so
  //                                             formatResponse cannot render a card
  //                                             by resolving it against academyCatalogue.
  //
  // Step 1: bold-wrapped markers (**[ARTICLE:slug]**) — treated as a unit.
  content = content.replace(/\*\*\[ARTICLE:([a-z0-9-]+)\]\*\*/g, (_, slug: string) => {
    const article = retrieval.articles.find((a) => a.slug === slug);
    if (article) {
      if (!articleSlugs.includes(slug)) articleSlugs.push(slug);
      return article.title;
    }
    return "";
  });
  // Step 2: non-bold (or asymmetrically-wrapped) markers ([ARTICLE:slug])
  content = content.replace(ARTICLE_RE, (_, slug: string) => {
    const article = retrieval.articles.find((a) => a.slug === slug);
    if (article) {
      if (!articleSlugs.includes(slug)) articleSlugs.push(slug);
      return article.title;
    }
    return "";
  });

  // Repair B: final safety sweep — strip any residual internal control markers not
  // matched by the primary parsers (e.g. apostrophe-slug variants missed by PRODUCT_RE
  // before the R2 fix, unknown slugs, markdown-adjacent forms). Uses [^\]]* to catch
  // any slug content. Must run after primary extraction so valid slugs are already
  // captured and only unresolved syntax remains.
  content = content
    .replace(/\[PRODUCT:[^\]]*\]/g, "")
    .replace(/\[ARTICLE:[^\]]*\]/g, "");

  // Repair C: strip residual **bold** emphasis markers.
  // The system prompt prohibits bold and single-asterisk emphasis, but model
  // compliance is probabilistic — on comparison turns the model uses **Name**
  // as a visual section heading per fragrance. These characters are not processed
  // by a Markdown renderer and appear literally in the chat bubble.
  // The enclosed text is preserved; only the paired ** delimiters are removed.
  // Must run after Repair B so no marker syntax (e.g. **[PRODUCT:...]**) remains
  // to be mis-matched — those are already resolved or stripped by Steps 0–2.
  content = content.replace(/\*\*([^*\n]+)\*\*/g, "$1");

  // Repair D: strip residual *italic* single-asterisk emphasis markers.
  // Catches cases like "sweetness *and* its warmth" where the model emphasises
  // a word or phrase with *word* or *multi-word phrase*.
  //
  // Pattern: /(?<!\w)\*(\S[^*\n]*\S|\S)\*(?!\w)/g
  //
  // (?<!\w)  — opening * must NOT be preceded by a word character (letter,
  //            digit, _). This protects "2*3*4" (multiplication) and
  //            "name*slug*" from matching — the * is adjacent to a word char.
  //
  // \S       — content after opening * must start with a non-whitespace char.
  //            This protects "2 * 3 * 4" (spaced multiplication) and
  //            "* item" (bullet prefix) — the content starts with a space.
  //
  // [^*\n]*  — allows multi-word content but stops at * or newline.
  //
  // (\S...\S|\S) — inner group matches either multi-char (start and end both
  //            non-whitespace) or exactly one non-whitespace character.
  //
  // (?!\w)   — closing * must NOT be followed by a word character. This
  //            allows the closing * to sit before punctuation (comma, period)
  //            without requiring a space after emphasis.
  //
  // Unmatched asterisks (bullet prefixes "* item") are not affected because:
  //   (a) the content immediately after * is a space (fails the \S check), or
  //   (b) there is no closing * on the same line.
  // Runs after Repair C so any **bold** double-markers are already gone.
  content = content.replace(/(?<!\w)\*(\S[^*\n]*\S|\S)\*(?!\w)/g, "$1");

  // Repair E: collapse a fragrance name immediately repeated on the same line
  // (accent/case/apostrophe-insensitive) left by marker substitution.
  content = collapseAdjacentDuplicateNames(content, retrieval.fragrances);

  if (articleSlugs.length === 0 && retrieval.articles.length > 0) {
    retrieval.articles.slice(0, 2).forEach((a) => articleSlugs.push(a.slug));
  }

  // ── Product card resolution (EP-AI-C4 A2 fix) ────────────────────────────────
  // Product cards must refer only to fragrances actually in the current retrieval
  // context. Precedence (Founder-approved):
  //   1. Valid [PRODUCT:slug] markers restricted to current retrieval candidates
  //   2. Exact product-name matches in prose, restricted to current candidates
  //   3. Deterministic single candidate when retrieval holds exactly one fragrance
  //   4. No card — never render speculative or unvalidated product cards
  //
  // PROHIBITED: arbitrary first-N fallback, catalogue-wide matching, unknown slugs.

  const validFragranceSlugs = new Set(retrieval.fragrances.map((f) => f.slug));

  // Precedence 1: valid markers
  let finalSlugs: string[] = rawSlugs.filter((s) => validFragranceSlugs.has(s));

  if (finalSlugs.length === 0) {
    // Precedence 2: product-name match in prose — full canonical name OR bare name (suffix-stripped),
    // both normalized for punctuation ("No. 5" ≡ "No 5"). Minimum 5-char bare name to avoid
    // false positives from very short product identifiers.
    const normContent = normalizeForProseMatch(content);
    const nameMatched = retrieval.fragrances
      .filter((f) => {
        if (normContent.includes(normalizeForProseMatch(f.name))) return true;
        const bare = stripProseSuffix(f.name);
        return bare !== f.name && bare.length >= 5 && normContent.includes(normalizeForProseMatch(bare));
      })
      .map((f) => f.slug);

    if (nameMatched.length > 0) {
      finalSlugs = nameMatched;
    } else if (retrieval.fragrances.length === 1) {
      // Precedence 3: single deterministic candidate (single-best intent)
      finalSlugs = [retrieval.fragrances[0].slug];
    }
    // Precedence 4: no card (finalSlugs stays [])
  }

  // Named single-product enquiry (W9-C4): when the guest named exactly one fragrance and
  // this is a product-education turn, that fragrance's card leads — provided it is in the
  // governed retrieval context and the reply is about it: the reply names it under any
  // form the resolver recognises ("Wonderlust", "Ani"), or names no other fragrance from
  // the context (note words such as "grapefruit" that are also catalogue names elsewhere
  // do not count). Precedence 2 alone missed replies that use a short name or no name
  // without a marker. Discovery, comparison and general education turns are unaffected.
  if (
    explicitEntitySlug &&
    intent === "education" &&
    !plan.requiresComparison &&
    !isTruncationFallback &&
    validFragranceSlugs.has(explicitEntitySlug)
  ) {
    const named = fragrancesNamedIn(content);
    const namesOtherCandidate = named.some((s) => s !== explicitEntitySlug && validFragranceSlugs.has(s));
    if (named.includes(explicitEntitySlug) || !namesOtherCandidate) {
      finalSlugs = [explicitEntitySlug, ...finalSlugs.filter((s) => s !== explicitEntitySlug)];
    }
  }

  // EP-AI-C6-P3-R2: Server-side card guarantee (Repair D — deterministic fill).
  // cardTarget is set on retrieval by buildContext (via computeCardTarget) before
  // this function is called. Two directions:
  //   Over-emission: LLM emits more valid markers than target → cap to target.
  //   Under-emission: LLM emits fewer valid markers but governed context has enough → fill.
  // Invariant: model-selected valid cards come first; deterministic fill preserves
  // governed candidate order. Never fabricates products; only uses retrieval.fragrances.
  const cardTarget = retrieval.cardTarget ?? null;
  if (cardTarget !== null) {
    if (finalSlugs.length > cardTarget) {
      finalSlugs = finalSlugs.slice(0, cardTarget);
    } else if (finalSlugs.length < cardTarget && retrieval.fragrances.length >= cardTarget) {
      for (const f of retrieval.fragrances) {
        if (finalSlugs.length >= cardTarget) break;
        if (!finalSlugs.includes(f.slug)) finalSlugs.push(f.slug);
      }
    }
  }

  // ── Deterministic comparison replacement ──────────────────────────────────────
  // Replace model prose entirely for resolved, non-clarification comparison turns.
  // Card resolution above has already run — finalSlugs is settled before this fires.
  // Model-generated scores, qualitative rankings (present/intimate), and
  // absence-of-sweetness inferences are discarded; response built from catalogue data.
  // Triggered from plan/candidates, not from content.
  // Guards:
  //   !isTruncationFallback      — explicit; retry message passes through unchanged
  //   !plan.requiresClarification — when the planner still needs to ask the guest a
  //                                  question, the model's clarification prose survives
  // Resolve candidates once; guard and builder use the identical list.
  // Returns [] when comparisonCandidateSlugs is absent or empty — missing
  // metadata means no authoritative candidates; guard fails, model prose preserved.
  const resolvedCandidates = resolveComparisonCandidates(retrieval);
  if (
    plan.requiresComparison &&
    !plan.requiresClarification &&
    resolvedCandidates.length >= 2 &&
    !isTruncationFallback
  ) {
    content = buildDeterministicComparisonResponse(
      resolvedCandidates,
      retrieval.comparisonFocusDims ?? [],
    );
  }

  // No-match anchored_refinement post-processor:
  // Replace the entire content with a deterministic response built from AnchoredMeta.
  // No model prose is retained — invented scores, zero-dimension claims, product markers,
  // and extra questions are discarded regardless of what the model returned.
  if (retrieval.anchoredMeta && !retrieval.anchoredMeta.strictMatches) {
    finalSlugs = [];
    content = buildNoMatchResponse(retrieval.anchoredMeta);
  }

  // Strict-match anchored_refinement: post-process residual absence-implying phrases.
  // The calibration instruction prohibits "without sweetness", "zero sweetness", etc.
  // but model compliance is probabilistic. This sweep corrects residual phrases using
  // relative wording validated against rendered candidates only — not the full pool.
  // Applied after marker processing so product name substitutions are already done.
  if (intent === "anchored_refinement" && retrieval.anchoredMeta?.strictMatches === true) {
    const renderedCandidates = retrieval.fragrances.filter((f) => finalSlugs.includes(f.slug));
    content = correctAnchorContrastAbsenceClaims(content, retrieval.anchoredMeta, renderedCandidates);
    content = sanitiseAbsenceClaims(content, retrieval.anchoredMeta, renderedCandidates);
    content = sanitiseRemovalClaims(content, retrieval.anchoredMeta, renderedCandidates);
    content = sanitiseEqualScoreClaims(content, retrieval.anchoredMeta, renderedCandidates);
  }

  // Replace "without any amber warmth" with the attributed rendered fragrance's actual warmth
  // score. Runs on every turn type; no-op when no cards are rendered.
  content = correctAmberWarmthAbsenceClaims(
    content,
    retrieval.fragrances.filter((f) => finalSlugs.includes(f.slug)),
  );

  // Remove an unsupported trailing "without gourmand sweetness" qualifier (see function comment).
  content = correctGourmandAbsenceClaims(
    content,
    retrieval.fragrances,
    retrieval.fragrances.filter((f) => finalSlugs.includes(f.slug)),
  );

  const hasRecs             = retrieval.fragrances.length > 0;
  const followUpSuggestions = generateFollowUps(plan, intent, hasRecs, profile, new Set(finalSlugs).size).slice(0, 2);

  return {
    // Normalise line endings, collapse excess spaces/tabs (not newlines),
    // cap 3+ consecutive newlines to 2 so paragraph breaks are preserved.
    content:          content.replace(/\r\n/g, "\n").replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n").trim(),
    recommendedSlugs: finalSlugs,
    articleSlugs,
    followUpSuggestions,
    intent,
  };
}
