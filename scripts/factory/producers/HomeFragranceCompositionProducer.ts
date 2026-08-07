/**
 * Knowledge Factory — Home Fragrance Composition Producer
 *
 * Enriches the olfactory notes pyramid for a home fragrance product.
 *
 * Input:  HomeFragranceFactoryContext
 * Reads:  name, range, productType, profile, season, mood,
 *         scaffoldRecord.notes, currentRecord.notes
 * Output: Partial<HomeFragranceKnowledge> — only { notes: { top, heart, base } }
 *
 * Home fragrance composition does NOT use personal fragrance evaporation
 * semantics. No "skin", "wearer", "drydown", or "15–30 minutes" language.
 * The prompt describes ambient diffusion character: opening scent impression,
 * sustained ambient accord, and base lingering character.
 *
 * Producer validation (pre-merge, not a duplicate of the MKC validator):
 *   HF_COMP_NOTES_MISSING        — notes object absent (error)
 *   HF_COMP_NOTES_TOP_MIN        — top requires ≥ 2 (error)
 *   HF_COMP_NOTES_TOP_MAX        — top requires ≤ 4 (error) [EP4-P3CR]
 *   HF_COMP_NOTES_HEART_MIN      — heart requires ≥ 2 (error)
 *   HF_COMP_NOTES_HEART_MAX      — heart requires ≤ 4 (error) [EP4-P3CR]
 *   HF_COMP_NOTES_BASE_MIN       — base requires ≥ 2 (error)
 *   HF_COMP_NOTES_BASE_MAX       — base requires ≤ 4 (error) [EP4-P3CR]
 *   HF_COMP_EMPTY_NOTE           — empty string in any tier (error)
 *   HF_COMP_INTRA_TIER_DUPLICATE — duplicate within same tier (error)
 *   HF_COMP_CROSS_TIER_DUPLICATE — note appears in multiple tiers (error) [EP4-P3CR: promoted from warning]
 *   HF_COMP_CAPITALISATION        — note not Title Case (warning)
 *
 * Runtime JSON parsing (EP4-P3CR):
 *   parse() validates the AI response structurally before constructing fields.
 *   Structural violations throw, causing HomeFragranceBaseProducer to return
 *   status "failed" — not silently accepted or auto-corrected.
 *
 *   Missing tier (top/heart/base absent from root):
 *     → HF_COMP_PARSE_TIER_MISSING — throw (failed)
 *   Tier is not an array:
 *     → HF_COMP_PARSE_TIER_NOT_ARRAY — throw (failed)
 *   Array element is not a string:
 *     → HF_COMP_PARSE_TIER_NON_STRING — throw (failed)
 *   Root is not a non-null object:
 *     → HF_COMP_PARSE_INVALID_ROOT — throw (failed)
 *
 *   Unknown extra root keys are ignored.
 *   AI output is never silently corrected.
 */

import path from "path";
import { HomeFragranceBaseProducer } from "../core/HomeFragranceBaseProducer";
import { PromptRegistry }            from "../core/PromptRegistry";
import type {
  HomeFragranceFactoryContext,
  HomeFragranceKnowledge,
  GenerationTask,
  GenerationResponse,
  ProducerValidation,
} from "../core/types";

const PROMPT_DIR  = path.join(process.cwd(), "scripts", "factory", "prompts");
const PROMPT_NAME = "home-fragrance/composition";

export class HomeFragranceCompositionProducer extends HomeFragranceBaseProducer {
  readonly name    = "HomeFragranceCompositionProducer";
  readonly version = "1.0.0";

  private readonly registry = new PromptRegistry(PROMPT_DIR);

  protected buildPrompt(ctx: HomeFragranceFactoryContext): GenerationTask {
    const producerCfg   = ctx.config.producers[this.name];
    const promptVersion = producerCfg?.promptVersion ?? "1.0.0";
    const prompt        = this.registry.load(PROMPT_NAME, promptVersion);

    const scaffold = ctx.scaffoldRecord;
    const current  = ctx.currentRecord;

    const userMessage = [
      `Product:     ${ctx.name}`,
      `Range:       ${ctx.range}`,
      `Type:        ${ctx.productType}`,
      `Profile:     ${current.profile}`,
      `Season:      ${current.season}`,
      `Mood:        ${current.mood}`,
      ``,
      `Scaffold notes (may be incomplete — enrich to minimum 2 per tier):`,
      `  Top:   ${scaffold.notes.top.join(", ")   || "none"}`,
      `  Heart: ${scaffold.notes.heart.join(", ") || "none"}`,
      `  Base:  ${scaffold.notes.base.join(", ")  || "none"}`,
      ``,
      `Generate a complete and authentic home fragrance notes pyramid.`,
    ].join("\n");

    const providerName = producerCfg?.providerName ?? ctx.config.defaultProvider;
    const modelId      = producerCfg?.modelId
      ?? ctx.config.providers[providerName]?.modelId
      ?? "claude-haiku-4-5-20251001";

    return {
      producerName:   this.name,
      promptName:     PROMPT_NAME,
      promptVersion,
      providerName,
      modelId,
      systemPrompt:   prompt.content,
      userMessage,
      temperature:    producerCfg?.temperature ?? 0.7,
      maxTokens:      producerCfg?.maxTokens   ?? 512,
      expectedFormat: "json",
      correlationId:  ctx.runId,
      metadata:       { slug: ctx.slug, range: ctx.range },
    };
  }

  protected parse(
    response: GenerationResponse,
    _ctx:     HomeFragranceFactoryContext,
  ): Partial<HomeFragranceKnowledge> {
    // AI output is an untrusted runtime boundary.
    // Validate structure before constructing any producer fields.
    const rawData: unknown = JSON.parse(response.content);

    if (rawData === null || typeof rawData !== "object" || Array.isArray(rawData)) {
      throw new Error(
        "HF_COMP_PARSE_INVALID_ROOT — composition response root must be a non-null, non-array object",
      );
    }

    const obj = rawData as Record<string, unknown>;

    return {
      notes: {
        top:   parseStringArray(obj["top"],   "top"),
        heart: parseStringArray(obj["heart"], "heart"),
        base:  parseStringArray(obj["base"],  "base"),
      },
    };
  }

  protected validate(
    fields: Partial<HomeFragranceKnowledge>,
    _ctx:   HomeFragranceFactoryContext,
  ): ProducerValidation {
    const errors:   string[] = [];
    const warnings: string[] = [];
    const notes = fields.notes;

    if (!notes) {
      errors.push("HF_COMP_NOTES_MISSING — notes object absent from producer output");
      return { errors, warnings };
    }

    // ── Minimum notes per tier ───────────────────────────────────────────────
    if (notes.top.length   < 2) errors.push(`HF_COMP_NOTES_TOP_MIN   — top notes require ≥ 2 (got ${notes.top.length})`);
    if (notes.heart.length < 2) errors.push(`HF_COMP_NOTES_HEART_MIN — heart notes require ≥ 2 (got ${notes.heart.length})`);
    if (notes.base.length  < 2) errors.push(`HF_COMP_NOTES_BASE_MIN  — base notes require ≥ 2 (got ${notes.base.length})`);

    // ── Maximum notes per tier (prompt specifies 2–4) ────────────────────────
    if (notes.top.length   > 4) errors.push(`HF_COMP_NOTES_TOP_MAX   — top notes require ≤ 4 (got ${notes.top.length})`);
    if (notes.heart.length > 4) errors.push(`HF_COMP_NOTES_HEART_MAX — heart notes require ≤ 4 (got ${notes.heart.length})`);
    if (notes.base.length  > 4) errors.push(`HF_COMP_NOTES_BASE_MAX  — base notes require ≤ 4 (got ${notes.base.length})`);

    // ── Empty note values ────────────────────────────────────────────────────
    const all   = [...notes.top, ...notes.heart, ...notes.base];
    const empty = all.filter(n => !n.trim());
    if (empty.length > 0) {
      errors.push(`HF_COMP_EMPTY_NOTE — ${empty.length} empty note value(s) found`);
    }

    // ── Intra-tier duplicates ────────────────────────────────────────────────
    for (const [tier, tNotes] of [
      ["top",   notes.top],
      ["heart", notes.heart],
      ["base",  notes.base],
    ] as const) {
      const d = withinTierDuplicates(tNotes);
      if (d.length > 0) errors.push(`HF_COMP_INTRA_TIER_DUPLICATE — duplicate in ${tier}: ${d.join(", ")}`);
    }

    // ── Cross-tier duplicates (EP4-P3CR: promoted from warning to error) ─────
    // A note appearing in multiple tiers is invalid composition output.
    // Do not silently remove duplicates — report the defect truthfully.
    const crossDupes = crossTierDuplicates(notes.top, notes.heart, notes.base);
    if (crossDupes.length > 0) {
      errors.push(`HF_COMP_CROSS_TIER_DUPLICATE — note(s) appear in multiple tiers: ${crossDupes.join(", ")}`);
    }

    // ── Capitalisation quality ───────────────────────────────────────────────
    const lowercase = all.filter(n => n.length > 0 && /^[a-z]/.test(n));
    if (lowercase.length > 0) {
      warnings.push(`HF_COMP_CAPITALISATION — notes should be Title Case: ${lowercase.join(", ")}`);
    }

    return { errors, warnings };
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Validates and extracts a string array from an untrusted parsed JSON value.
 *
 * Policy (EP4-P3CR preferred conservative policy):
 *   - Missing key (undefined/null): structural failure → throws.
 *     All three tiers are required fields in the approved schema.
 *   - Non-array value: structural failure → throws.
 *   - Non-string array element: structural failure → throws.
 *   - Valid array of strings: trims and filters empty values.
 *
 * Unknown extra root keys on the parent object are ignored by the caller.
 */
function parseStringArray(value: unknown, tierName: string): string[] {
  if (value === undefined || value === null) {
    throw new Error(
      `HF_COMP_PARSE_TIER_MISSING — required tier "${tierName}" is absent in AI response`,
    );
  }
  if (!Array.isArray(value)) {
    throw new Error(
      `HF_COMP_PARSE_TIER_NOT_ARRAY — "${tierName}" must be an array (got ${typeof value})`,
    );
  }
  for (let i = 0; i < value.length; i++) {
    if (typeof value[i] !== "string") {
      throw new Error(
        `HF_COMP_PARSE_TIER_NON_STRING — "${tierName}[${i}]" must be a string (got ${typeof value[i]})`,
      );
    }
  }
  return (value as string[]).map(n => n.trim()).filter(Boolean);
}

function withinTierDuplicates(notes: string[]): string[] {
  const seen = new Set<string>();
  const dupes: string[] = [];
  for (const n of notes) {
    const k = n.toLowerCase();
    if (seen.has(k)) dupes.push(n);
    else seen.add(k);
  }
  return dupes;
}

function crossTierDuplicates(...tiers: string[][]): string[] {
  const seen  = new Set<string>();
  const dupes = new Set<string>();
  for (const tier of tiers) {
    for (const n of tier) {
      const k = n.toLowerCase();
      if (seen.has(k)) dupes.add(n);
      seen.add(k);
    }
  }
  return [...dupes];
}
