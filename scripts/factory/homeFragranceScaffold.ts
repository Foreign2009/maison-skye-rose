/**
 * Knowledge Factory — Home Fragrance Scaffold
 *
 * Derives all truthful deterministic fields from a HomeFragranceIntake.
 * Returns a HomeFragranceScaffoldOutput — a type containing only fields
 * that are genuinely derivable from home fragrance supplier data.
 *
 * Architectural boundary (EP4-P2R):
 *   FragranceKnowledge cannot honestly represent home fragrance because it
 *   carries fragrance-specific required fields (collection, gender, projection,
 *   scentCharacter, prices/images keyed "5ml"/"10ml"/"30ml") that have no
 *   truthful home fragrance equivalents.
 *
 *   HomeFragranceScaffoldOutput is the honest boundary. EP4-P3 will introduce
 *   HomeFragranceKnowledge and enable AI producer enrichment.
 *
 * No AI generation occurs in this scaffolder.
 */

import type { HomeFragranceIntake } from "./types";
import { deriveSlug }               from "./core/deriveSlug";

// ── Output type ───────────────────────────────────────────────────────────────

export interface HomeFragranceScaffoldOutput {
  readonly id:          string;
  readonly slug:        string;
  readonly brand:       string;
  readonly name:        string;
  readonly category:    "home-fragrance";
  readonly productType: "candle" | "diffuser" | "room-spray";
  readonly range:       string;
  readonly subtitle:    string;
  readonly profile:     string;
  readonly season:      string;
  readonly mood:        string;
  readonly notes: {
    readonly top:   string[];
    readonly heart: string[];
    readonly base:  string[];
  };
  readonly prices:   Record<string, number>;
  readonly images:   Record<string, string>;
  readonly bestSeller: boolean;
  readonly newArrival: boolean;
}

// ── Scaffolder ────────────────────────────────────────────────────────────────

export function scaffoldHomeFragrance(intake: HomeFragranceIntake): HomeFragranceScaffoldOutput {
  const slug = deriveSlug(intake.title);

  return {
    id:          slug,
    slug,
    brand:       "Maison Skye & Rose",
    name:        intake.title,
    category:    "home-fragrance",
    productType: intake.productType,
    range:       intake.range,
    subtitle:    intake.subtitle,
    profile:     intake.profile,
    season:      intake.season,
    mood:        intake.mood,
    notes: {
      top:   intake.notes.slice(0, 1),
      heart: intake.notes.slice(1, 2),
      base:  intake.notes.slice(2),
    },
    prices:     intake.prices,
    images:     intake.images,
    bestSeller: intake.bestSeller,
    newArrival: intake.newArrival,
  };
}
