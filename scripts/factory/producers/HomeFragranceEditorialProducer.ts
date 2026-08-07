/**
 * Knowledge Factory — Home Fragrance Editorial Producer
 *
 * Produces or refines editorial copy for a home fragrance product.
 *
 * Input:  HomeFragranceFactoryContext (post-composition: currentRecord has enriched notes)
 * Reads:  name, range, productType, profile, season, mood,
 *         currentRecord.notes, currentRecord.subtitle
 * Output: Partial<HomeFragranceKnowledge> — only { description?, subtitle? }
 *
 * Home fragrance editorial does NOT use personal-wear language.
 * No "skin", "wearer", "wear", "application", "personal occasions".
 * Copy describes ambient space and sensory environment.
 *
 * Producer validation (pre-merge):
 *   HF_EDIT_DESCRIPTION_REQUIRED  — description not returned (error)
 *   HF_EDIT_DESCRIPTION_TOO_SHORT — minimum 80 characters (error)
 *   HF_EDIT_DESCRIPTION_TOO_LONG  — maximum 500 characters (error)
 *   HF_EDIT_EMPTY_DESCRIPTION     — empty string guard (error)
 *   HF_EDIT_SUBTITLE_MISSING      — subtitle not returned (warning — scaffold retained)
 *   HF_EDIT_SUBTITLE_TOO_LONG     — maximum 60 characters (warning)
 *   HF_EDIT_FORBIDDEN_TERM        — luxury vocabulary violation (error)
 *
 * Runtime JSON parsing (EP4-P3CR):
 *   parse() validates the AI response structurally before constructing fields.
 *   Structural violations throw, causing HomeFragranceBaseProducer to return
 *   status "failed".
 *
 *   Root is not a non-null object:
 *     → HF_EDIT_PARSE_INVALID_ROOT — throw (failed)
 *   description key exists but is not a string:
 *     → HF_EDIT_PARSE_DESCRIPTION_TYPE — throw (failed)
 *   subtitle key exists but is not a string:
 *     → HF_EDIT_PARSE_SUBTITLE_TYPE — throw (failed)
 *
 *   Unknown extra root keys are ignored.
 *
 *   An empty object {} parses successfully (description and subtitle both absent).
 *   In that case validate() reports HF_EDIT_DESCRIPTION_REQUIRED → degraded.
 *   This preserves the distinction:
 *     Malformed JSON or invalid type → failed
 *     Structurally valid but insufficient content → degraded
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
const PROMPT_NAME = "home-fragrance/editorial";

const MIN_DESCRIPTION_LENGTH = 80;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_SUBTITLE_LENGTH    = 60;

const FORBIDDEN_TERMS = [
  "inspired by",
  "dupe",
  "cheap",
  "affordable",
  "budget",
  "copy of",
  "knockoff",
  "imitation",
  "fake",
  "just like",
  "similar to",
  "reminiscent of",
];

export class HomeFragranceEditorialProducer extends HomeFragranceBaseProducer {
  readonly name    = "HomeFragranceEditorialProducer";
  readonly version = "1.0.0";

  private readonly registry = new PromptRegistry(PROMPT_DIR);

  protected buildPrompt(ctx: HomeFragranceFactoryContext): GenerationTask {
    const producerCfg   = ctx.config.producers[this.name];
    const promptVersion = producerCfg?.promptVersion ?? "1.0.0";
    const prompt        = this.registry.load(PROMPT_NAME, promptVersion);

    const record = ctx.currentRecord;

    const noteLines = [
      `  Top:   ${record.notes.top.join(", ")   || "not yet set"}`,
      `  Heart: ${record.notes.heart.join(", ") || "not yet set"}`,
      `  Base:  ${record.notes.base.join(", ")  || "not yet set"}`,
    ].join("\n");

    const userMessage = [
      `Product:          ${ctx.name}`,
      `Range:            ${ctx.range}`,
      `Type:             ${ctx.productType}`,
      `Profile:          ${record.profile}`,
      `Season:           ${record.season}`,
      `Mood:             ${record.mood}`,
      ``,
      `Notes pyramid:`,
      noteLines,
      ``,
      `Current subtitle: "${record.subtitle ?? ""}"`,
      ``,
      `Write the editorial description and subtitle for this home fragrance product.`,
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
      temperature:    producerCfg?.temperature ?? 0.8,
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
        "HF_EDIT_PARSE_INVALID_ROOT — editorial response root must be a non-null, non-array object",
      );
    }

    const obj = rawData as Record<string, unknown>;

    // description and subtitle are optional — absent is valid (validate() reports degraded).
    // But if a key is present, it must be a string. A number or array is a structural failure.
    if (obj["description"] !== undefined && typeof obj["description"] !== "string") {
      throw new Error(
        `HF_EDIT_PARSE_DESCRIPTION_TYPE — "description" must be a string (got ${typeof obj["description"]})`,
      );
    }
    if (obj["subtitle"] !== undefined && typeof obj["subtitle"] !== "string") {
      throw new Error(
        `HF_EDIT_PARSE_SUBTITLE_TYPE — "subtitle" must be a string (got ${typeof obj["subtitle"]})`,
      );
    }

    const description = typeof obj["description"] === "string" ? (obj["description"] as string).trim() : "";
    const subtitle    = typeof obj["subtitle"]    === "string" ? (obj["subtitle"]    as string).trim() : "";

    const result: Partial<HomeFragranceKnowledge> = {};
    if (description) result.description = description;
    if (subtitle)    result.subtitle    = subtitle;

    return result;
  }

  protected validate(
    fields: Partial<HomeFragranceKnowledge>,
    _ctx:   HomeFragranceFactoryContext,
  ): ProducerValidation {
    const errors:   string[] = [];
    const warnings: string[] = [];

    // ── Description ──────────────────────────────────────────────────────────
    const desc = fields.description ?? "";

    if (fields.description === "") {
      errors.push("HF_EDIT_EMPTY_DESCRIPTION — description is an empty string");
    } else if (!desc) {
      errors.push("HF_EDIT_DESCRIPTION_REQUIRED — description was not returned by the producer");
    } else {
      if (desc.length < MIN_DESCRIPTION_LENGTH) {
        errors.push(`HF_EDIT_DESCRIPTION_TOO_SHORT — minimum ${MIN_DESCRIPTION_LENGTH} chars (got ${desc.length})`);
      }
      if (desc.length > MAX_DESCRIPTION_LENGTH) {
        errors.push(`HF_EDIT_DESCRIPTION_TOO_LONG — maximum ${MAX_DESCRIPTION_LENGTH} chars (got ${desc.length})`);
      }
    }

    // ── Subtitle ─────────────────────────────────────────────────────────────
    const sub = fields.subtitle ?? "";

    if (fields.subtitle === "") {
      warnings.push("HF_EDIT_EMPTY_SUBTITLE — subtitle is an empty string; scaffold subtitle will be retained");
    } else if (!sub) {
      warnings.push("HF_EDIT_SUBTITLE_MISSING — subtitle not returned; scaffold subtitle will be retained");
    } else if (sub.length > MAX_SUBTITLE_LENGTH) {
      warnings.push(`HF_EDIT_SUBTITLE_TOO_LONG — recommended max ${MAX_SUBTITLE_LENGTH} chars (got ${sub.length})`);
    }

    // ── Luxury vocabulary guard ───────────────────────────────────────────────
    const combined = `${desc} ${sub}`.toLowerCase();
    for (const term of FORBIDDEN_TERMS) {
      if (combined.includes(term)) {
        errors.push(`HF_EDIT_FORBIDDEN_TERM — "${term}" must not appear in editorial copy`);
      }
    }

    return { errors, warnings };
  }
}
