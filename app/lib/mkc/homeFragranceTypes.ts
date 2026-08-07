/**
 * Maison Knowledge Catalogue — Home Fragrance Knowledge Model
 *
 * HomeFragranceKnowledge is the canonical record type for all home fragrance
 * products (candles, diffusers, room sprays).
 *
 * Design constraint (EP4-P2R / EP4-P3):
 *   This type is deliberately separate from FragranceKnowledge. The two types
 *   share no structural relationship by design. Personal-fragrance fields
 *   (collection, gender, projection, scentCharacter, family, occasions,
 *   intelligence metrics) are absent because they have no truthful home
 *   fragrance equivalent and must never be fabricated.
 *
 *   HomeFragranceKnowledge is NOT assignable to FragranceKnowledge — TypeScript's
 *   structural type system enforces this: HomeFragranceKnowledge lacks the
 *   required fields collection, gender, projection, and scentCharacter.
 */

// ── Home Fragrance Knowledge record ───────────────────────────────────────────

export type HomeFragranceKnowledge = {

  // ── Identity ──────────────────────────────────────────────────────────────────
  id:            string;
  slug:          string;
  brand:         string;
  name:          string;
  category:      "home-fragrance";
  productType:   "candle" | "diffuser" | "room-spray";
  range:         string;
  catalogVersion?: string;
  status?:       string;

  // ── Composition ───────────────────────────────────────────────────────────────
  profile: string;
  season:  string;
  mood:    string;
  notes: {
    top:   string[];
    heart: string[];
    base:  string[];
  };

  // ── Editorial ─────────────────────────────────────────────────────────────────
  // subtitle is always derived from intake (required at scaffold).
  // description is AI-generated (EP4-P3C); absent until then.
  subtitle:     string;
  description?: string;

  // ── Discovery ─────────────────────────────────────────────────────────────────
  // Populated as empty arrays at scaffold (EP4-P3A).
  // AI-enriched by HomeFragranceDiscoveryProducer (EP4-P4).
  // occasions is intentionally absent — home fragrance uses roomContexts (EP4-P4).
  vibe:           string[];
  seasons:        string[];
  signatureStyle: string[];
  recommendedFor: string[];

  // ── Merchandising ─────────────────────────────────────────────────────────────
  // Record<string, ...> uses home fragrance size labels (e.g. "150g", "500ml").
  // The fragrance size contract ("5ml"/"10ml"/"30ml") does not apply here.
  prices:     Record<string, number>;
  images:     Record<string, string>;
  bestSeller: boolean;
  newArrival: boolean;

};
