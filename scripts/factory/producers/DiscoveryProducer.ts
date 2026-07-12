/**
 * Knowledge Factory — Discovery Producer
 *
 * Generates discovery intelligence for a fragrance record.
 * Runs after EducationProducer — uses the full enriched record.
 *
 * Input:  FactoryContext (reads currentRecord — post-composition, editorial, relationship, education)
 * Output: Partial<FragranceKnowledge> — only discovery fields:
 *           recommendedFor, signatureStyle, vibe, occasions, seasons
 *
 * Producer validation:
 *   DISC_RECOMMENDED_FOR_MIN       — fewer than 2 recommendedFor values (error)
 *   DISC_RECOMMENDED_FOR_DUPLICATE — duplicate recommendedFor value (error)
 *   DISC_VIBE_EMPTY                — no vibe tags returned (warning)
 *   DISC_OCCASIONS_EMPTY           — no occasions returned (warning)
 *   DISC_SIGNATURE_STYLE_EMPTY     — no signatureStyle values returned (warning)
 *   DISC_SUMMARY_MISSING           — discoverySummary absent or empty (warning)
 */

import nodePath from "path";
import { BaseProducer }   from "../core/BaseProducer";
import { PromptRegistry } from "../core/PromptRegistry";
import type {
  FactoryContext,
  GenerationTask,
  GenerationResponse,
  FragranceKnowledge,
  ProducerValidation,
} from "../core/types";

const PROMPT_DIR  = nodePath.join(process.cwd(), "scripts", "factory", "prompts");
const PROMPT_NAME = "discovery";

export class DiscoveryProducer extends BaseProducer {
  readonly name    = "DiscoveryProducer";
  readonly version = "1.0.0";

  private readonly registry = new PromptRegistry(PROMPT_DIR);

  // Stores discoverySummary between parse() and validate() — both called in the
  // same run() invocation, so instance state is safe across these two methods.
  private lastDiscoverySummary = "";

  protected buildPrompt(ctx: FactoryContext): GenerationTask {
    const producerCfg   = ctx.config.producers[this.name];
    const promptVersion = producerCfg?.promptVersion ?? "1.0.0";
    const prompt        = this.registry.load(PROMPT_NAME, promptVersion);

    const r = ctx.currentRecord;

    // Surface existing scaffold discovery values so AI refines rather than replaces
    const existingVibe      = r.vibe.slice(0, 6).join(", ")           || "none";
    const existingOccasions = r.occasions.slice(0, 5).join(", ")      || "none";
    const existingSeasons   = r.seasons.join(", ")                    || "none";
    const existingStyle     = r.signatureStyle.join(", ")             || "none";

    // Surface relationship context
    const relLines: string[] = [];
    if (r.relationships?.alternatives?.length) {
      relLines.push(`Alternatives: ${r.relationships.alternatives.join(", ")}`);
    }
    if (r.relationships?.wardrobePartners?.length) {
      relLines.push(`WardrobePartners: ${r.relationships.wardrobePartners.join(", ")}`);
    }
    const relContext = relLines.length > 0 ? relLines.join("\n") : "none identified";

    // Surface education tags for character cross-referencing
    const eduTags = (r.educationTags ?? []).slice(0, 8).join(", ") || "none";

    const descPreview = r.description
      ? r.description.slice(0, 200) + (r.description.length > 200 ? "..." : "")
      : "not set";

    const userMessage = [
      `Fragrance: ${r.name}`,
      `Slug: ${ctx.slug}`,
      `Collection: ${r.collection}`,
      `Gender: ${r.gender}`,
      `Family: ${r.family.join(", ")}`,
      `Profile: ${r.profile}`,
      `Season: ${r.season}`,
      `ScentCharacter: ${r.scentCharacter}`,
      `Projection: ${r.projection}`,
      `Notes:`,
      `  Top:   ${r.notes.top.join(", ")   || "none"}`,
      `  Heart: ${r.notes.heart.join(", ") || "none"}`,
      `  Base:  ${r.notes.base.join(", ")  || "none"}`,
      ``,
      `Mood: ${r.mood}`,
      ``,
      `Editorial:`,
      `  Subtitle:    ${r.subtitle ?? "not set"}`,
      `  Description: ${descPreview}`,
      ``,
      `Current discovery values (refine, do not ignore):`,
      `  Vibe:           ${existingVibe}`,
      `  Occasions:      ${existingOccasions}`,
      `  Seasons:        ${existingSeasons}`,
      `  SignatureStyle: ${existingStyle}`,
      ``,
      `Education tags: ${eduTags}`,
      ``,
      `Relationships:`,
      relContext,
      ``,
      `Generate discovery intelligence for this fragrance.`,
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
      temperature:    producerCfg?.temperature ?? 0.5,
      maxTokens:      producerCfg?.maxTokens   ?? 768,
      expectedFormat: "json",
      correlationId:  ctx.runId,
      metadata:       { slug: ctx.slug, collection: ctx.collection },
    };
  }

  protected parse(response: GenerationResponse, _ctx: FactoryContext): Partial<FragranceKnowledge> {
    const data = JSON.parse(response.content) as {
      recommendedFor?:     unknown;
      signatureStyle?:     unknown;
      vibe?:               unknown;
      occasions?:          unknown;
      seasons?:            unknown;
      idealCustomer?:      unknown;
      shoppingIntent?:     unknown;
      discoverySummary?:   unknown;
      discoveryConfidence?: unknown;
    };

    const recommendedFor = toStringArray(data.recommendedFor);
    const signatureStyle = toStringArray(data.signatureStyle);
    const vibe           = toStringArray(data.vibe);
    const occasions      = toStringArray(data.occasions);
    const seasons        = toStringArray(data.seasons);

    // Store for validate() — idealCustomer, shoppingIntent, discoveryConfidence
    // are parsed for prompt quality but not written to FragranceKnowledge.
    this.lastDiscoverySummary =
      typeof data.discoverySummary === "string" ? data.discoverySummary.trim() : "";

    const result: Partial<FragranceKnowledge> = {};
    if (recommendedFor.length > 0) result.recommendedFor = recommendedFor;
    if (signatureStyle.length > 0) result.signatureStyle  = signatureStyle;
    if (vibe.length > 0)           result.vibe            = vibe;
    if (occasions.length > 0)      result.occasions       = occasions;
    if (seasons.length > 0)        result.seasons         = seasons;

    return result;
  }

  protected validate(fields: Partial<FragranceKnowledge>, _ctx: FactoryContext): ProducerValidation {
    const errors:   string[] = [];
    const warnings: string[] = [];

    // ── recommendedFor ────────────────────────────────────────────────────────────
    const recommended = fields.recommendedFor ?? [];
    if (recommended.length < 2) {
      errors.push(`DISC_RECOMMENDED_FOR_MIN — minimum 2 recommendedFor values required (found ${recommended.length})`);
    }
    if (recommended.length > 0) {
      const seen = new Set<string>();
      for (const val of recommended) {
        if (seen.has(val)) {
          const preview = val.length > 60 ? val.slice(0, 60) + "..." : val;
          errors.push(`DISC_RECOMMENDED_FOR_DUPLICATE — duplicate recommendedFor value: "${preview}"`);
        }
        seen.add(val);
      }
    }

    // ── vibe ──────────────────────────────────────────────────────────────────────
    if ((fields.vibe ?? []).length === 0) {
      warnings.push("DISC_VIBE_EMPTY — no vibe tags returned");
    }

    // ── occasions ─────────────────────────────────────────────────────────────────
    if ((fields.occasions ?? []).length === 0) {
      warnings.push("DISC_OCCASIONS_EMPTY — no occasions returned");
    }

    // ── signatureStyle ────────────────────────────────────────────────────────────
    if ((fields.signatureStyle ?? []).length === 0) {
      warnings.push("DISC_SIGNATURE_STYLE_EMPTY — no signatureStyle values returned");
    }

    // ── discoverySummary (prompt quality check — not written to FragranceKnowledge) ──
    if (!this.lastDiscoverySummary) {
      warnings.push("DISC_SUMMARY_MISSING — discoverySummary absent or empty");
    }

    return { errors, warnings };
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string")
    .map(s => s.trim())
    .filter(Boolean);
}
