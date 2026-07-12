/**
 * Knowledge Factory — Relationship Producer
 *
 * Generates graph relationship edges for a fragrance record.
 * Uses the native catalogue to identify alternatives, wardrobe partners,
 * and evolution lineage.
 *
 * Input:  FactoryContext (reads currentRecord + nativeFragrances)
 * Output: Partial<FragranceKnowledge> — only { relationships }
 *
 * Producer validation:
 *   REL_SELF_LINK         — target slug is the record's own slug (error)
 *   REL_SLUG_NOT_FOUND    — target not in native registry (error)
 *   REL_DUPLICATE_EDGE    — same slug listed twice in same type (error)
 *   REL_NO_RELATIONSHIPS  — no edges above confidence threshold (warning)
 */

import path from "path";
import { BaseProducer }   from "../core/BaseProducer";
import { PromptRegistry } from "../core/PromptRegistry";
import type {
  FactoryContext,
  GenerationTask,
  GenerationResponse,
  FragranceKnowledge,
  ProducerValidation,
} from "../core/types";

const PROMPT_DIR  = path.join(process.cwd(), "scripts", "factory", "prompts");
const PROMPT_NAME = "relationships";

const CONFIDENCE_THRESHOLD  = 0.6;
const MAX_ALTERNATIVES      = 3;
const MAX_WARDROBE_PARTNERS = 3;
const MAX_EVOLUTIONS        = 3;

const ALLOWED_TYPES = new Set(["alternative", "wardrobePartner", "evolutionOf", "evolution"]);

interface RelationshipEdge {
  type:       string;
  slug:       string;
  confidence: number;
  rationale:  string;
}

function isEdge(v: unknown): v is RelationshipEdge {
  if (typeof v !== "object" || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.type       === "string" &&
    typeof o.slug       === "string" &&
    typeof o.confidence === "number" &&
    typeof o.rationale  === "string"
  );
}

export class RelationshipProducer extends BaseProducer {
  readonly name    = "RelationshipProducer";
  readonly version = "1.0.0";

  private readonly registry = new PromptRegistry(PROMPT_DIR);

  protected buildPrompt(ctx: FactoryContext): GenerationTask {
    const producerCfg   = ctx.config.producers[this.name];
    const promptVersion = producerCfg?.promptVersion ?? "1.0.0";
    const prompt        = this.registry.load(PROMPT_NAME, promptVersion);

    const r         = ctx.currentRecord;
    const catalogue = buildCatalogueContext(ctx.nativeFragrances, ctx.slug);

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
      `Vibe: ${r.vibe.slice(0, 5).join(", ")}`,
      ``,
      `Available catalogue (${ctx.catalogueSize} records):`,
      catalogue,
      ``,
      `Generate relationship graph edges for this fragrance using only the slugs above.`,
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
      temperature:    producerCfg?.temperature ?? 0.3,
      maxTokens:      producerCfg?.maxTokens   ?? 1024,
      expectedFormat: "json",
      correlationId:  ctx.runId,
      metadata:       { slug: ctx.slug, collection: ctx.collection },
    };
  }

  protected parse(response: GenerationResponse, _ctx: FactoryContext): Partial<FragranceKnowledge> {
    const data = JSON.parse(response.content) as { relationships?: unknown[] };
    const raw  = Array.isArray(data.relationships) ? data.relationships : [];

    const alternatives:     string[] = [];
    const wardrobePartners: string[] = [];
    let   evolutionOf:      string | undefined;
    const evolutions:       string[] = [];

    for (const item of raw) {
      if (!isEdge(item))                          continue;
      if (!ALLOWED_TYPES.has(item.type))          continue;
      if (item.confidence < CONFIDENCE_THRESHOLD) continue;
      if (!item.slug.trim())                      continue;

      switch (item.type) {
        case "alternative":     alternatives.push(item.slug);     break;
        case "wardrobePartner": wardrobePartners.push(item.slug); break;
        case "evolutionOf":     evolutionOf = item.slug;           break;
        case "evolution":       evolutions.push(item.slug);        break;
      }
    }

    const relationships: FragranceKnowledge["relationships"] = {};
    if (evolutionOf !== undefined)    relationships.evolutionOf      = evolutionOf;
    if (evolutions.length > 0)        relationships.evolutions       = evolutions.slice(0, MAX_EVOLUTIONS);
    if (alternatives.length > 0)      relationships.alternatives     = alternatives.slice(0, MAX_ALTERNATIVES);
    if (wardrobePartners.length > 0)  relationships.wardrobePartners = wardrobePartners.slice(0, MAX_WARDROBE_PARTNERS);

    if (Object.keys(relationships).length === 0) return {};
    return { relationships };
  }

  protected validate(fields: Partial<FragranceKnowledge>, ctx: FactoryContext): ProducerValidation {
    const errors:   string[] = [];
    const warnings: string[] = [];
    const rel = fields.relationships;

    if (!rel) {
      warnings.push("REL_NO_RELATIONSHIPS — no relationship edges met the confidence threshold (0.6)");
      return { errors, warnings };
    }

    const known = ctx.nativeFragrances;
    const self  = ctx.slug;

    function checkArray(type: string, slugs: string[]): void {
      const seen = new Set<string>();
      for (const slug of slugs) {
        if (slug === self) {
          errors.push(`REL_SELF_LINK — ${type}: "${slug}" is a self-reference`);
        } else if (!known.has(slug)) {
          errors.push(`REL_SLUG_NOT_FOUND — ${type}: "${slug}" not in native registry`);
        }
        if (seen.has(slug)) {
          errors.push(`REL_DUPLICATE_EDGE — ${type}: "${slug}" is duplicated`);
        }
        seen.add(slug);
      }
    }

    if (rel.evolutionOf !== undefined) {
      if (rel.evolutionOf === self) {
        errors.push(`REL_SELF_LINK — evolutionOf: "${rel.evolutionOf}" is a self-reference`);
      } else if (!known.has(rel.evolutionOf)) {
        errors.push(`REL_SLUG_NOT_FOUND — evolutionOf: "${rel.evolutionOf}" not in native registry`);
      }
    }

    if (rel.evolutions?.length)       checkArray("evolutions",       rel.evolutions);
    if (rel.alternatives?.length)     checkArray("alternatives",     rel.alternatives);
    if (rel.wardrobePartners?.length) checkArray("wardrobePartners", rel.wardrobePartners);

    return { errors, warnings };
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildCatalogueContext(
  catalogue: ReadonlyMap<string, FragranceKnowledge>,
  excludeSlug: string,
): string {
  const lines: string[] = [];
  for (const [slug, r] of catalogue) {
    if (slug === excludeSlug) continue;
    const family = r.family.join("/");
    const top    = r.notes.top.slice(0, 2).join(", ");
    lines.push(`${slug} | ${r.gender} | ${family} | ${r.profile} | top: ${top}`);
  }
  return lines.join("\n");
}
