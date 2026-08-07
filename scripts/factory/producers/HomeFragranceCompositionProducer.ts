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
 *   HF_COMP_NOTES_HEART_MIN      — heart requires ≥ 2 (error)
 *   HF_COMP_NOTES_BASE_MIN       — base requires ≥ 2 (error)
 *   HF_COMP_EMPTY_NOTE           — empty string in any tier (error)
 *   HF_COMP_INTRA_TIER_DUPLICATE — duplicate within same tier (error)
 *   HF_COMP_CROSS_TIER_DUPLICATE — note appears in multiple tiers (warning)
 *   HF_COMP_CAPITALISATION        — note not Title Case (warning)
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
    const data = JSON.parse(response.content) as {
      top?: unknown;
      heart?: unknown;
      base?: unknown;
    };

    return {
      notes: {
        top:   toNotes(data.top),
        heart: toNotes(data.heart),
        base:  toNotes(data.base),
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

    if (notes.top.length   < 2) errors.push(`HF_COMP_NOTES_TOP_MIN   — top notes require ≥ 2 (got ${notes.top.length})`);
    if (notes.heart.length < 2) errors.push(`HF_COMP_NOTES_HEART_MIN — heart notes require ≥ 2 (got ${notes.heart.length})`);
    if (notes.base.length  < 2) errors.push(`HF_COMP_NOTES_BASE_MIN  — base notes require ≥ 2 (got ${notes.base.length})`);

    const all   = [...notes.top, ...notes.heart, ...notes.base];
    const empty = all.filter(n => !n.trim());
    if (empty.length > 0) {
      errors.push(`HF_COMP_EMPTY_NOTE — ${empty.length} empty note value(s) found`);
    }

    for (const [tier, tNotes] of [
      ["top",   notes.top],
      ["heart", notes.heart],
      ["base",  notes.base],
    ] as const) {
      const d = withinTierDuplicates(tNotes);
      if (d.length > 0) errors.push(`HF_COMP_INTRA_TIER_DUPLICATE — duplicate in ${tier}: ${d.join(", ")}`);
    }

    const crossDupes = crossTierDuplicates(notes.top, notes.heart, notes.base);
    if (crossDupes.length > 0) {
      warnings.push(`HF_COMP_CROSS_TIER_DUPLICATE — note(s) appear in multiple tiers: ${crossDupes.join(", ")}`);
    }

    const lowercase = all.filter(n => n.length > 0 && /^[a-z]/.test(n));
    if (lowercase.length > 0) {
      warnings.push(`HF_COMP_CAPITALISATION — notes should be Title Case: ${lowercase.join(", ")}`);
    }

    return { errors, warnings };
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toNotes(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string")
    .map(n => n.trim())
    .filter(Boolean);
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
