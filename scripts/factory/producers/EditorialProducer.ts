/**
 * Knowledge Factory — Editorial Producer
 *
 * Generates editorial copy in the Maison Skye & Rose brand voice.
 * Requires CompositionProducer output in context.currentRecord.notes.
 *
 * Input:  FactoryContext (reads currentRecord.notes from composition output)
 * Output: Partial<FragranceKnowledge> — only { description, subtitle }
 *
 * Producer validation (pre-merge, not a duplicate of MKC validator):
 *   EDIT_DESCRIPTION_REQUIRED  — description must not be empty (error)
 *   EDIT_DESCRIPTION_TOO_SHORT — minimum 80 characters (error)
 *   EDIT_DESCRIPTION_TOO_LONG  — maximum 500 characters (error)
 *   EDIT_SUBTITLE_MISSING      — subtitle not returned (warning — scaffold retained)
 *   EDIT_SUBTITLE_TOO_LONG     — maximum 60 characters (warning)
 *   EDIT_FORBIDDEN_TERM        — luxury vocabulary violation (error)
 *   EDIT_EMPTY_DESCRIPTION     — empty string guard (error)
 *   EDIT_EMPTY_SUBTITLE        — empty string guard (warning)
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
const PROMPT_NAME = "editorial";

const MIN_DESCRIPTION_LENGTH = 80;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_SUBTITLE_LENGTH    = 60;

const FORBIDDEN_TERMS = [
  // Origin / mass-market references (v1.0.0)
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
  // Performance / longevity claims (v1.1.0)
  "long-lasting",
  "long lasting",
  "lasts",
  "lingers",
  "endures",
  "stays with you",
  "all-day",
  "all day",
  "throughout the day",
  "sillage",
  "beast mode",
  "beast",
  "projects",
  "fills the room",
  "follows you",
  "announces your presence",
  "exceptional longevity",
  "incredible performance",
  "strong performance",
];

export class EditorialProducer extends BaseProducer {
  readonly name    = "EditorialProducer";
  readonly version = "1.0.0";

  private readonly registry = new PromptRegistry(PROMPT_DIR);

  protected buildPrompt(ctx: FactoryContext): GenerationTask {
    const producerCfg   = ctx.config.producers[this.name];
    const promptVersion = producerCfg?.promptVersion ?? "1.1.0";
    const prompt        = this.registry.load(PROMPT_NAME, promptVersion);

    const f      = ctx.displayFrag;
    const record = ctx.currentRecord;   // has composition notes at this point in the pipeline

    const noteLines = [
      `  Top:   ${record.notes.top.join(", ")   || "not yet set"}`,
      `  Heart: ${record.notes.heart.join(", ") || "not yet set"}`,
      `  Base:  ${record.notes.base.join(", ")  || "not yet set"}`,
    ].join("\n");

    const userMessage = [
      `Fragrance: ${f.title}`,
      `Collection: ${record.collection}`,
      `Profile:    ${f.profile}`,
      `Season:     ${f.season}`,
      `Mood:       ${f.mood}`,
      ``,
      `Notes pyramid:`,
      noteLines,
      ``,
      `Current subtitle: "${record.subtitle ?? f.subtitle ?? ""}"`,
      ``,
      `Write the editorial description and subtitle for this fragrance.`,
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
      metadata:       { slug: ctx.slug, collection: ctx.collection },
    };
  }

  protected parse(response: GenerationResponse, _ctx: FactoryContext): Partial<FragranceKnowledge> {
    const data = JSON.parse(response.content) as { description?: unknown; subtitle?: unknown };

    const description = typeof data.description === "string" ? data.description.trim() : "";
    const subtitle    = typeof data.subtitle    === "string" ? data.subtitle.trim()    : "";

    const result: Partial<FragranceKnowledge> = {};
    if (description) result.description = description;
    if (subtitle)    result.subtitle    = subtitle;

    return result;
  }

  protected validate(fields: Partial<FragranceKnowledge>, _ctx: FactoryContext): ProducerValidation {
    const errors:   string[] = [];
    const warnings: string[] = [];

    // ── Description ──────────────────────────────────────────────────────────
    const desc = fields.description ?? "";

    if (fields.description === "") {
      errors.push("EDIT_EMPTY_DESCRIPTION — description is an empty string");
    } else if (!desc) {
      errors.push("EDIT_DESCRIPTION_REQUIRED — description was not returned by the producer");
    } else {
      if (desc.length < MIN_DESCRIPTION_LENGTH) {
        errors.push(`EDIT_DESCRIPTION_TOO_SHORT — minimum ${MIN_DESCRIPTION_LENGTH} chars (got ${desc.length})`);
      }
      if (desc.length > MAX_DESCRIPTION_LENGTH) {
        errors.push(`EDIT_DESCRIPTION_TOO_LONG — maximum ${MAX_DESCRIPTION_LENGTH} chars (got ${desc.length})`);
      }
    }

    // ── Subtitle ─────────────────────────────────────────────────────────────
    const sub = fields.subtitle ?? "";

    if (fields.subtitle === "") {
      warnings.push("EDIT_EMPTY_SUBTITLE — subtitle is an empty string; scaffold subtitle will be retained");
    } else if (!sub) {
      warnings.push("EDIT_SUBTITLE_MISSING — subtitle not returned; scaffold subtitle will be retained");
    } else if (sub.length > MAX_SUBTITLE_LENGTH) {
      warnings.push(`EDIT_SUBTITLE_TOO_LONG — recommended max ${MAX_SUBTITLE_LENGTH} chars (got ${sub.length})`);
    }

    // ── Luxury vocabulary guard ───────────────────────────────────────────────
    const combined = `${desc} ${sub}`.toLowerCase();
    for (const term of FORBIDDEN_TERMS) {
      if (combined.includes(term)) {
        errors.push(`EDIT_FORBIDDEN_TERM — "${term}" must not appear in editorial copy`);
      }
    }

    return { errors, warnings };
  }
}
