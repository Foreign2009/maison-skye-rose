/**
 * Knowledge Factory — Composition Producer
 *
 * Generates the notes pyramid (top, heart, base) for a fragrance.
 *
 * Input:  FactoryContext (reads displayFrag + scaffoldRecord.notes)
 * Output: Partial<FragranceKnowledge> — only { notes: { top, heart, base } }
 *
 * Modes:
 *   NORMAL MODE        — AI generates a complete notes pyramid (≥ 2 per tier)
 *   EVIDENCE-LOCK MODE — AI generation is bypassed; governed scaffold notes pass
 *                        through unchanged. Triggered when scaffoldRecord.notesEvidenceLocked
 *                        is true. Producer returns "skipped"; merger preserves scaffold notes.
 *
 * Producer validation (NORMAL MODE only — not run in evidence-lock mode):
 *   COMP_NOTES_MISSING        — notes object absent
 *   COMP_NOTES_TOP_MIN        — top requires ≥ 2
 *   COMP_NOTES_HEART_MIN      — heart requires ≥ 2
 *   COMP_NOTES_BASE_MIN       — base requires ≥ 2
 *   COMP_EMPTY_NOTE           — empty string in any tier (error)
 *   COMP_INTRA_TIER_DUPLICATE — duplicate within same tier (error)
 *   COMP_CROSS_TIER_DUPLICATE — note appears in multiple tiers (warning)
 *   COMP_CAPITALISATION       — note not Title Case (warning)
 */

import path from "path";
import { BaseProducer }   from "../core/BaseProducer";
import { PromptRegistry } from "../core/PromptRegistry";
import type {
  FactoryContext,
  GenerationTask,
  GenerationResponse,
  FragranceKnowledge,
  PreCheckResult,
  ProducerValidation,
} from "../core/types";

const PROMPT_DIR  = path.join(process.cwd(), "scripts", "factory", "prompts");
const PROMPT_NAME = "composition-producer";

export class CompositionProducer extends BaseProducer {
  readonly name    = "CompositionProducer";
  readonly version = "1.0.0";

  private readonly registry = new PromptRegistry(PROMPT_DIR);

  protected override preCheck(ctx: FactoryContext): PreCheckResult {
    if (ctx.scaffoldRecord.notesEvidenceLocked === true) {
      return { pass: false, reason: "EVIDENCE_LOCK — governed notes preserved from scaffold; AI generation bypassed" };
    }
    return { pass: true };
  }

  protected buildPrompt(ctx: FactoryContext): GenerationTask {
    const producerCfg   = ctx.config.producers[this.name];
    const promptVersion = producerCfg?.promptVersion ?? "1.0.0";
    const prompt        = this.registry.load(PROMPT_NAME, promptVersion);

    const f        = ctx.displayFrag;
    const scaffold = ctx.scaffoldRecord;

    const userMessage = [
      `Fragrance: ${f.title}`,
      `Collection: ${f.collection}`,
      `Profile:    ${f.profile}`,
      `Season:     ${f.season}`,
      `Mood:       ${f.mood}`,
      ``,
      `Scaffold notes (may be incomplete — enrich to minimum 2 per tier):`,
      `  Top:   ${scaffold.notes.top.join(", ")   || "none"}`,
      `  Heart: ${scaffold.notes.heart.join(", ") || "none"}`,
      `  Base:  ${scaffold.notes.base.join(", ")  || "none"}`,
      ``,
      `Generate a complete and authentic notes pyramid.`,
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
      metadata:       { slug: ctx.slug, collection: ctx.collection },
    };
  }

  protected parse(response: GenerationResponse, _ctx: FactoryContext): Partial<FragranceKnowledge> {
    const data = JSON.parse(response.content) as { top?: unknown; heart?: unknown; base?: unknown };
    return {
      notes: {
        top:   toNotes(data.top),
        heart: toNotes(data.heart),
        base:  toNotes(data.base),
      },
    };
  }

  protected validate(fields: Partial<FragranceKnowledge>, _ctx: FactoryContext): ProducerValidation {
    const errors:   string[] = [];
    const warnings: string[] = [];
    const notes = fields.notes;

    if (!notes) {
      errors.push("COMP_NOTES_MISSING — notes object absent from producer output");
      return { errors, warnings };
    }

    if (notes.top.length   < 2) errors.push(`COMP_NOTES_TOP_MIN   — top notes require ≥ 2 (got ${notes.top.length})`);
    if (notes.heart.length < 2) errors.push(`COMP_NOTES_HEART_MIN — heart notes require ≥ 2 (got ${notes.heart.length})`);
    if (notes.base.length  < 2) errors.push(`COMP_NOTES_BASE_MIN  — base notes require ≥ 2 (got ${notes.base.length})`);

    const all   = [...notes.top, ...notes.heart, ...notes.base];
    const empty = all.filter(n => !n.trim());
    if (empty.length > 0) {
      errors.push(`COMP_EMPTY_NOTE — ${empty.length} empty note value(s) found`);
    }

    for (const [tier, tNotes] of [["top", notes.top], ["heart", notes.heart], ["base", notes.base]] as const) {
      const d = withinTierDuplicates(tNotes);
      if (d.length > 0) errors.push(`COMP_INTRA_TIER_DUPLICATE — duplicate in ${tier}: ${d.join(", ")}`);
    }

    const crossDupes = crossTierDuplicates(notes.top, notes.heart, notes.base);
    if (crossDupes.length > 0) {
      warnings.push(`COMP_CROSS_TIER_DUPLICATE — note(s) appear in multiple tiers: ${crossDupes.join(", ")}`);
    }

    const lowercase = all.filter(n => n.length > 0 && /^[a-z]/.test(n));
    if (lowercase.length > 0) {
      warnings.push(`COMP_CAPITALISATION — notes should be Title Case: ${lowercase.join(", ")}`);
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
