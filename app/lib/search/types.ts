/**
 * Unified Search & Knowledge Retrieval — Type Definitions
 *
 * SearchDocument is the canonical retrieval primitive for the entire platform.
 * It is the future contract for the Maison AI Concierge retrieval layer.
 *
 * Sources → SearchDocument:
 *   MKC (FragranceKnowledge[])       → type: "fragrance"
 *   Discovery (CollectionSpec[])     → type: "collection"
 *   Academy  (AcademyArticle[])      → type: "article"
 *
 * AI Concierge retrieval path (future):
 *   SearchDocument → RetrievalDocument → AI context injection
 */

export type SearchDocumentType = "fragrance" | "collection" | "article";

export interface SearchDocument {
  // ── Identity ────────────────────────────────────────────────────────────────
  id:    string;              // "fragrance:{slug}" | "collection:{id}" | "article:{slug}"
  type:  SearchDocumentType;
  slug:  string;

  // ── Display ─────────────────────────────────────────────────────────────────
  title:        string;
  subtitle?:    string;
  description?: string;
  image?:       string;       // Product URL for fragrances; emoji for collections/articles

  // ── Search surface ──────────────────────────────────────────────────────────
  titleTokens: string[];      // Lowercase tokens for prefix matching
  keywords:    string[];      // Flat, lowercase: family, notes, occasions, tags, education
  synonyms?:   string[];      // Alternative names (future: brand aliases, style aliases)
  aliases?:    string[];      // Shorthand identifiers (future: abbreviations, nicknames)

  // ── Fragrance-specific ───────────────────────────────────────────────────────
  family?:    string[];
  notes?:     string[];       // Flat: [...top, ...heart, ...base]
  occasions?: string[];
  season?:    string;

  // ── Academy-specific ─────────────────────────────────────────────────────────
  category?:      string;     // AcademyCategory
  educationTags?: string[];
  topics?:        string[];
  readTime?:      number;     // Minutes

  // ── Ranking ─────────────────────────────────────────────────────────────────
  popularity?:  number;       // 0–100; MKC popularity field
  searchWeight: number;       // Pre-computed base score applied before query scoring

  // ── Navigation ──────────────────────────────────────────────────────────────
  href: string;               // /product/{slug} | /discover/{id} | /academy/{slug}
}

export interface SearchMatch {
  document:      SearchDocument;
  score:         number;
  matchedFields: string[];    // e.g. ["title:exact", "family:intent", "keywords"]
}

export interface SearchGroup {
  type:       SearchDocumentType;
  label:      string;         // "Fragrances" | "Collections" | "Learn"
  matches:    SearchMatch[];
  totalCount: number;         // Total matches before limit; enables "+N more" display
}

export interface SearchQuery {
  raw:        string;
  normalized: string;
  tokens:     string[];
}

// ── AI Concierge retrieval contract ───────────────────────────────────────────
// RetrievalDocument is the future interface for AI context injection.
// It is produced from SearchDocument by toRetrievalDocuments() in searchEngine.ts.
// Do not add model-specific fields here; keep it provider-neutral.

export interface RetrievalDocument {
  id:             string;
  type:           SearchDocumentType;
  title:          string;
  slug:           string;
  href:           string;
  relevanceScore: number;
  metadata:       Record<string, unknown>;
}

export interface SearchIndex {
  version:     number;
  generatedAt: string;
  documents:   SearchDocument[];
}
