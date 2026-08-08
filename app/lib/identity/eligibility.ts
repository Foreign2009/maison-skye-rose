/**
 * Maison Identity Platform — Knowledge Eligibility Gate
 *
 * Answers the single question: is an identity record eligible for Knowledge
 * Platform operations (content generation, product enrichment, publishing)?
 *
 * Contract: only "verified" identities are eligible. Candidates, pending-review,
 * disputed, deprecated, and rejected identities must never drive Knowledge
 * Platform output — editorial human approval is the prerequisite.
 *
 * This is a pure function. It reads no external state and makes no decisions
 * about what the Knowledge Platform should do with eligible records. Integration
 * into the Knowledge Factory is deferred to EP5-P4.
 *
 * Constitutional anchor: IDENTITY PRECEDES KNOWLEDGE. AI MAY PRODUCE EVIDENCE.
 * HUMANS APPROVE INSTITUTIONAL TRUTH.
 */

import type { IdentityRecord } from "./types";

export function isIdentityKnowledgeEligible(record: IdentityRecord): boolean {
  return record.status === "verified";
}
