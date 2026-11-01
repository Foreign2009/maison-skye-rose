import type { Metadata } from "next";
import { hasAdminSession } from "@/app/lib/admin/session";
import { redirect }      from "next/navigation";

import { RelationshipEditorialService } from "@/app/lib/identity/editorial/relationship/RelationshipEditorialService";
import {
  createProductionQueueRepository,
  createProductionLedgerRepository,
  RELATIONSHIP_PRODUCTION_CLOCK,
} from "@/app/lib/identity/editorial/relationship/persistence";
import { mkcCatalogue } from "@/app/lib/mkc/catalogue";
import type { FragranceKnowledge } from "@/app/lib/mkc/types";

import RelationshipReviewList from "./RelationshipReviewList";

export const metadata: Metadata = {
  title:  "Relationship Review | Maison Skye & Rose",
  robots: { index: false, follow: false },
};

function buildMkcIndex(): ReadonlyMap<string, FragranceKnowledge> {
  const index = new Map<string, FragranceKnowledge>();
  for (const f of mkcCatalogue) {
    index.set(f.slug, f);
  }
  return index;
}

export default async function RelationshipReviewQueuePage() {
  const isAuth      = await hasAdminSession();

  if (!isAuth) redirect("/admin");

  const service = new RelationshipEditorialService(
    createProductionQueueRepository(),
    createProductionLedgerRepository(),
    buildMkcIndex(),
    RELATIONSHIP_PRODUCTION_CLOCK,
  );

  const queue    = service.getReviewQueue();
  const progress = service.getProgress();

  return <RelationshipReviewList queue={queue} progress={progress} />;
}
