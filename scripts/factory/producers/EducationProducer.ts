/**
 * Knowledge Factory — Education Producer
 *
 * Assigns educational metadata to a fragrance record.
 * Runs after RelationshipProducer — uses relationships to inform learning path.
 *
 * Input:  FactoryContext (reads currentRecord — post-composition, editorial, relationship)
 * Output: Partial<FragranceKnowledge> — only academy education fields:
 *           academyArticleIds, academyCategories, educationTags, learningPath
 *
 * Producer validation:
 *   EDU_ARTICLE_NOT_FOUND      — article slug not in academy catalogue (error)
 *   EDU_ARTICLE_DUPLICATE      — same article slug twice (error)
 *   EDU_CATEGORY_NOT_FOUND     — category slug not in approved list (error)
 *   EDU_CATEGORY_DUPLICATE     — same category slug twice (error)
 *   EDU_TAG_DUPLICATE          — duplicate education tag (error)
 *   EDU_LEARNING_PATH_INVALID  — learning path article not in academyArticleIds (error)
 *   EDU_ARTICLES_EMPTY         — no academy articles assigned (warning)
 *   EDU_CATEGORIES_EMPTY       — no academy categories assigned (warning)
 *   EDU_TAGS_EMPTY             — no education tags assigned (warning)
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
const PROMPT_NAME = "education";

// Approved vocabulary — mirrors the prompt to allow producer-level validation
const VALID_ARTICLE_SLUGS = new Set([
  "the-note-pyramid-explained",
  "guide-to-fragrance-families",
  "how-to-wear-fragrance",
  "what-makes-a-signature-scent",
  "choosing-your-season-scent",
  "how-to-layer-fragrances",
]);

const VALID_CATEGORY_SLUGS = new Set([
  "fragrance-fundamentals",
  "fragrance-families",
  "the-note-pyramid",
  "wear-and-application",
  "occasions-and-style",
  "scent-science",
]);

export class EducationProducer extends BaseProducer {
  readonly name    = "EducationProducer";
  readonly version = "1.0.0";

  private readonly registry = new PromptRegistry(PROMPT_DIR);

  protected buildPrompt(ctx: FactoryContext): GenerationTask {
    const producerCfg   = ctx.config.producers[this.name];
    const promptVersion = producerCfg?.promptVersion ?? "1.0.0";
    const prompt        = this.registry.load(PROMPT_NAME, promptVersion);

    const r = ctx.currentRecord;

    // Surface relationship context so the AI can suggest layering articles
    const relLines: string[] = [];
    if (r.relationships?.alternatives?.length) {
      relLines.push(`Alternatives: ${r.relationships.alternatives.join(", ")}`);
    }
    if (r.relationships?.wardrobePartners?.length) {
      relLines.push(`WardrobePartners: ${r.relationships.wardrobePartners.join(", ")}`);
    }
    const relContext = relLines.length > 0 ? relLines.join("\n") : "none identified";

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
      `Occasions: ${r.occasions.slice(0, 3).join(", ")}`,
      `RecommendedFor: ${r.recommendedFor.slice(0, 2).join("; ") || "not set"}`,
      ``,
      `Relationships:`,
      relContext,
      ``,
      `Assign educational metadata for this fragrance.`,
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
      temperature:    producerCfg?.temperature ?? 0.4,
      maxTokens:      producerCfg?.maxTokens   ?? 512,
      expectedFormat: "json",
      correlationId:  ctx.runId,
      metadata:       { slug: ctx.slug, collection: ctx.collection },
    };
  }

  protected parse(response: GenerationResponse, _ctx: FactoryContext): Partial<FragranceKnowledge> {
    const data = JSON.parse(response.content) as {
      academyCategories?:  unknown;
      academyArticleIds?:  unknown;
      educationTags?:      unknown;
      learningPath?:       unknown;
      knowledgeLevel?:     unknown;
      educationalSummary?: unknown;
      rationale?:          unknown;
    };

    const academyCategories = toStringArray(data.academyCategories);
    const academyArticleIds = toStringArray(data.academyArticleIds);
    const educationTags     = toStringArray(data.educationTags).map(t => t.toLowerCase().trim());
    const learningPath      = toStringArray(data.learningPath);

    const result: Partial<FragranceKnowledge> = {};
    if (academyCategories.length > 0) result.academyCategories = academyCategories;
    if (academyArticleIds.length > 0) result.academyArticleIds = academyArticleIds;
    if (educationTags.length > 0)     result.educationTags     = educationTags;
    if (learningPath.length > 0)      result.learningPath      = learningPath;

    return result;
  }

  protected validate(fields: Partial<FragranceKnowledge>, _ctx: FactoryContext): ProducerValidation {
    const errors:   string[] = [];
    const warnings: string[] = [];

    // ── Academy articles ──────────────────────────────────────────────────────
    const articles = fields.academyArticleIds ?? [];
    if (articles.length === 0) {
      warnings.push("EDU_ARTICLES_EMPTY — no academy articles assigned");
    } else {
      const seen = new Set<string>();
      for (const slug of articles) {
        if (!VALID_ARTICLE_SLUGS.has(slug)) {
          errors.push(`EDU_ARTICLE_NOT_FOUND — "${slug}" is not in the academy catalogue`);
        }
        if (seen.has(slug)) {
          errors.push(`EDU_ARTICLE_DUPLICATE — "${slug}" appears more than once in academyArticleIds`);
        }
        seen.add(slug);
      }
    }

    // ── Academy categories ────────────────────────────────────────────────────
    const categories = fields.academyCategories ?? [];
    if (categories.length === 0) {
      warnings.push("EDU_CATEGORIES_EMPTY — no academy categories assigned");
    } else {
      const seen = new Set<string>();
      for (const slug of categories) {
        if (!VALID_CATEGORY_SLUGS.has(slug)) {
          errors.push(`EDU_CATEGORY_NOT_FOUND — "${slug}" is not a valid academy category slug`);
        }
        if (seen.has(slug)) {
          errors.push(`EDU_CATEGORY_DUPLICATE — "${slug}" appears more than once in academyCategories`);
        }
        seen.add(slug);
      }
    }

    // ── Education tags ────────────────────────────────────────────────────────
    const tags = fields.educationTags ?? [];
    if (tags.length === 0) {
      warnings.push("EDU_TAGS_EMPTY — no education tags assigned");
    } else {
      const seen = new Set<string>();
      for (const tag of tags) {
        if (seen.has(tag)) {
          errors.push(`EDU_TAG_DUPLICATE — "${tag}" appears more than once in educationTags`);
        }
        seen.add(tag);
      }
    }

    // ── Learning path integrity ───────────────────────────────────────────────
    const lpath = fields.learningPath ?? [];
    if (lpath.length > 0 && articles.length > 0) {
      const articleSet = new Set(articles);
      for (const slug of lpath) {
        if (!articleSet.has(slug)) {
          errors.push(`EDU_LEARNING_PATH_INVALID — "${slug}" in learningPath is not in academyArticleIds`);
        }
      }
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
