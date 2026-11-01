import type { Metadata } from "next";
import { hasAdminSession } from "@/app/lib/admin/session";
import { redirect, notFound } from "next/navigation";

import { RelationshipEditorialService } from "@/app/lib/identity/editorial/relationship/RelationshipEditorialService";
import {
  createProductionQueueRepository,
  createProductionLedgerRepository,
  RELATIONSHIP_PRODUCTION_CLOCK,
} from "@/app/lib/identity/editorial/relationship/persistence";
import { mkcCatalogue } from "@/app/lib/mkc/catalogue";
import type { FragranceKnowledge } from "@/app/lib/mkc/types";

import RelationshipReviewDetail from "../RelationshipReviewDetail";

export const metadata: Metadata = {
  title:  "Relationship Review Detail | Maison Skye & Rose",
  robots: { index: false, follow: false },
};

function buildMkcIndex(): ReadonlyMap<string, FragranceKnowledge> {
  const index = new Map<string, FragranceKnowledge>();
  for (const f of mkcCatalogue) {
    index.set(f.slug, f);
  }
  return index;
}

export default async function RelationshipReviewDetailPage({
  params,
}: {
  params: Promise<{ reviewId: string }>;
}) {
  const { reviewId: encodedId } = await params;
  const reviewId = decodeURIComponent(encodedId);

  const isAuth      = await hasAdminSession();

  if (!isAuth) redirect("/admin");

  const mkcIndex = buildMkcIndex();
  const service  = new RelationshipEditorialService(
    createProductionQueueRepository(),
    createProductionLedgerRepository(),
    mkcIndex,
    RELATIONSHIP_PRODUCTION_CLOCK,
  );

  const unitState = service.getReviewUnit(reviewId);

  if (!unitState) notFound();

  const fragranceA = mkcIndex.get(unitState.unit.slugA) ?? null;
  const fragranceB = mkcIndex.get(unitState.unit.slugB) ?? null;

  // key={governanceState+updatedAt} remounts the client component after mutations.
  const stateKey = `${unitState.governanceState}-${unitState.latestEntry?.decidedAt ?? unitState.unit.createdAt}`;

  return (
    <RelationshipReviewDetail
      key={stateKey}
      unitState={unitState}
      fragranceA={fragranceA}
      fragranceB={fragranceB}
      reviewId={reviewId}
    />
  );
}
