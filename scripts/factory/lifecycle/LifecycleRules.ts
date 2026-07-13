/**
 * Knowledge Lifecycle Manager — Detection Rules
 *
 * Pure functions. Each rule receives pre-loaded data and returns a
 * LifecycleJob if the condition is detected, null otherwise.
 *
 * No I/O — the LifecycleScanner is responsible for loading all data
 * and passing it into these functions.
 */

import type { LifecycleJob, LifecycleReason } from "./LifecycleJob";
import {
  REASON_SEVERITY, REASON_ACTION,
} from "./LifecycleJob";
import type { FactoryLogEntry, StageEntry } from "../types";
import type { ReviewRecord }  from "../review/ReviewState";
import type { PromotionRecord } from "../promotion/PromotionRegistry";

type Collection = "Skye" | "Rose" | "Elite";

// ── Job factory ───────────────────────────────────────────────────────────────

function makeJob(
  slug:    string,
  name:    string,
  coll:    Collection,
  reason:  LifecycleReason,
  details: string,
): LifecycleJob {
  return {
    id:                `${slug}::${reason}`,
    slug,
    name,
    collection:        coll,
    reason,
    severity:          REASON_SEVERITY[reason],
    recommendedAction: REASON_ACTION[reason],
    detectedAt:        new Date().toISOString(),
    details,
  };
}

// ── Semver helpers ────────────────────────────────────────────────────────────

export function compareSemver(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

// ── Producer → prompt name mapping ────────────────────────────────────────────
// Keys are the producer class names as written in draft headers.

const PRODUCER_TO_PROMPT: Record<string, string> = {
  CompositionProducer:  "composition-producer",
  EditorialProducer:    "editorial",
  RelationshipProducer: "relationships",
  EducationProducer:    "education",
  DiscoveryProducer:    "discovery",
};

// ── Draft header parsers ──────────────────────────────────────────────────────

function parseDraftFactoryVersion(content: string): string | null {
  const m = content.match(/Factory version:\s+(\S+)/);
  return m ? m[1].trim() : null;
}

function parseDraftPromptVersions(content: string): Array<{ producer: string; version: string }> {
  const m = content.match(/Prompt versions:\s+(.+)/);
  if (!m) return [];
  return m[1].trim().split(/\s+/).flatMap(part => {
    const pm = part.match(/^(\w+)@(\d+\.\d+\.\d+)$/);
    return pm ? [{ producer: pm[1], version: pm[2] }] : [];
  });
}

function parseDraftValidationStatus(content: string): string | null {
  const m = content.match(/Validation status:\s+(PASS_WITH_WARNINGS|PASS|FAIL|UNKNOWN)/);
  return m ? m[1] : null;
}

// ── Section presence checkers ─────────────────────────────────────────────────
// Uses [\s\S] instead of dotall flag (ES2017 target).

function arrayIsPopulated(content: string, fieldPattern: RegExp): boolean {
  const m = content.match(fieldPattern);
  if (!m) return false;
  const raw = m[1].replace(/\s+/g, " ").trim();
  return raw !== "[]" && raw.length > 2;
}

function hasDiscovery(content: string): boolean {
  return (
    arrayIsPopulated(content, /recommendedFor\s*:\s*(\[[\s\S]+?\])/) ||
    arrayIsPopulated(content, /vibe\s*:\s*(\[[\s\S]+?\])/)
  );
}

function hasRelationships(content: string): boolean {
  if (!content.includes("relationships:")) return false;
  if (content.includes("(not populated)")) return false;
  return arrayIsPopulated(content, /alternatives\s*:\s*(\[[\s\S]+?\])/) ||
         arrayIsPopulated(content, /wardrobePartners\s*:\s*(\[[\s\S]+?\])/);
}

function hasEducation(content: string): boolean {
  return arrayIsPopulated(content, /educationTags\s*:\s*(\[[\s\S]+?\])/) ||
         arrayIsPopulated(content, /academyArticleIds\s*:\s*(\[[\s\S]+?\])/);
}

// ── Individual rules ──────────────────────────────────────────────────────────

export function checkFactoryVersionDrift(
  slug:    string,
  name:    string,
  coll:    Collection,
  content: string | null,
  currentFactoryVersion: string,
): LifecycleJob | null {
  if (!content) return null;
  const draftVer = parseDraftFactoryVersion(content);
  if (!draftVer) return null;
  if (compareSemver(draftVer, currentFactoryVersion) >= 0) return null;
  return makeJob(slug, name, coll, "factory_version_drift",
    `Draft factory version ${draftVer} < current ${currentFactoryVersion}`);
}

export function checkPromptVersionDrift(
  slug:    string,
  name:    string,
  coll:    Collection,
  content: string | null,
  latestPromptVersions: Map<string, string>,
): LifecycleJob | null {
  if (!content) return null;
  const draftVersions = parseDraftPromptVersions(content);
  if (draftVersions.length === 0) return null;

  const drifted: string[] = [];
  for (const { producer, version } of draftVersions) {
    const promptName = PRODUCER_TO_PROMPT[producer];
    if (!promptName) continue;
    const latest = latestPromptVersions.get(promptName);
    if (!latest) continue;
    if (compareSemver(version, latest) < 0) {
      drifted.push(`${producer}@${version} < ${latest}`);
    }
  }

  if (drifted.length === 0) return null;
  return makeJob(slug, name, coll, "prompt_version_drift",
    `Prompt drift: ${drifted.join("; ")}`);
}

export function checkRejectedReview(
  slug:   string,
  name:   string,
  coll:   Collection,
  record: ReviewRecord | null,
): LifecycleJob | null {
  if (!record || record.status !== "rejected") return null;
  const reason = record.decision?.reason ?? "no reason provided";
  return makeJob(slug, name, coll, "rejected_review",
    `Rejected by ${record.reviewer ?? "reviewer"}: "${reason}"`);
}

export function checkNeedsRegeneration(
  slug:   string,
  name:   string,
  coll:   Collection,
  record: ReviewRecord | null,
): LifecycleJob | null {
  if (!record || record.status !== "needs_regeneration") return null;
  const reason = record.decision?.reason ?? "no reason provided";
  return makeJob(slug, name, coll, "needs_regeneration",
    `Flagged by ${record.reviewer ?? "reviewer"}: "${reason}"`);
}

export function checkFailedPromotion(
  slug:   string,
  name:   string,
  coll:   Collection,
  record: PromotionRecord | null,
): LifecycleJob | null {
  if (!record || (record.status !== "failed" && record.status !== "rolled_back")) return null;
  return makeJob(slug, name, coll, "failed_promotion",
    `Promotion ${record.status}: ${record.error ?? "unknown error"}`);
}

export function checkFailedGeneration(
  slug:  string,
  name:  string,
  coll:  Collection,
  entry: FactoryLogEntry | null,
): LifecycleJob | null {
  if (!entry) return null;
  const failedStage = entry.stages.find(
    (s: StageEntry) =>
      s.status === "fail" &&
      ["composition", "editorial", "relationships", "education", "discovery"].includes(s.stage),
  );
  if (!failedStage) return null;
  return makeJob(slug, name, coll, "failed_generation",
    `Stage "${failedStage.stage}" failed: ${failedStage.message ?? "no message"}`);
}

export function checkMissingDraft(
  slug:       string,
  name:       string,
  coll:       Collection,
  draftExists: boolean,
  isNative:   boolean,
): LifecycleJob | null {
  if (isNative || draftExists) return null;
  return makeJob(slug, name, coll, "missing_draft",
    "No draft file exists. Record has not been generated.");
}

export function checkMissingDiscovery(
  slug:    string,
  name:    string,
  coll:    Collection,
  content: string | null,
): LifecycleJob | null {
  if (!content) return null;
  if (hasDiscovery(content)) return null;
  return makeJob(slug, name, coll, "missing_discovery",
    "Draft is missing discovery fields (recommendedFor, vibe, occasions).");
}

export function checkMissingRelationships(
  slug:    string,
  name:    string,
  coll:    Collection,
  content: string | null,
): LifecycleJob | null {
  if (!content) return null;
  if (hasRelationships(content)) return null;
  return makeJob(slug, name, coll, "missing_relationships",
    "Draft is missing relationship edges (alternatives, wardrobePartners).");
}

export function checkMissingEducation(
  slug:    string,
  name:    string,
  coll:    Collection,
  content: string | null,
): LifecycleJob | null {
  if (!content) return null;
  if (hasEducation(content)) return null;
  return makeJob(slug, name, coll, "missing_education",
    "Draft is missing education fields (educationTags, academyArticleIds).");
}

export function checkValidationRegression(
  slug:    string,
  name:    string,
  coll:    Collection,
  content: string | null,
  entry:   FactoryLogEntry | null,
): LifecycleJob | null {
  // Check draft header first
  if (content) {
    const status = parseDraftValidationStatus(content);
    if (status === "FAIL") {
      return makeJob(slug, name, coll, "validation_regression",
        "Draft header reports FAIL validation status.");
    }
  }
  // Fall back to factory-log
  if (entry?.validationStatus === "FAIL") {
    return makeJob(slug, name, coll, "validation_regression",
      "Factory log reports FAIL validation status.");
  }
  return null;
}

// ── Apply all rules to a single record ────────────────────────────────────────

export interface RuleInput {
  slug:                 string;
  name:                 string;
  collection:           Collection;
  isNative:             boolean;
  draftExists:          boolean;
  draftContent:         string | null;
  factoryEntry:         FactoryLogEntry | null;
  reviewRecord:         ReviewRecord | null;
  promotionRecord:      PromotionRecord | null;
  latestPromptVersions: Map<string, string>;
  currentFactoryVersion: string;
}

export function applyAllRules(input: RuleInput): LifecycleJob[] {
  const {
    slug, name, collection: coll,
    isNative, draftExists, draftContent,
    factoryEntry, reviewRecord, promotionRecord,
    latestPromptVersions, currentFactoryVersion,
  } = input;

  // Native records don't need lifecycle work
  if (isNative) return [];

  const candidates = [
    checkRejectedReview(slug, name, coll, reviewRecord),
    checkNeedsRegeneration(slug, name, coll, reviewRecord),
    checkFailedPromotion(slug, name, coll, promotionRecord),
    checkFailedGeneration(slug, name, coll, factoryEntry),
    checkValidationRegression(slug, name, coll, draftContent, factoryEntry),
    checkFactoryVersionDrift(slug, name, coll, draftContent, currentFactoryVersion),
    checkPromptVersionDrift(slug, name, coll, draftContent, latestPromptVersions),
    checkMissingDraft(slug, name, coll, draftExists, isNative),
    checkMissingDiscovery(slug, name, coll, draftContent),
    checkMissingRelationships(slug, name, coll, draftContent),
    checkMissingEducation(slug, name, coll, draftContent),
  ];

  return candidates.filter((j): j is LifecycleJob => j !== null);
}
