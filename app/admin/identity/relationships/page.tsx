import type { Metadata } from "next";
import { cookies }       from "next/headers";
import { createHash }    from "crypto";
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

function computeSessionToken(): string {
  return createHash("sha256")
    .update((process.env.ADMIN_SECRET ?? "") + "msr-ops-v1")
    .digest("hex");
}

function buildMkcIndex(): ReadonlyMap<string, FragranceKnowledge> {
  const index = new Map<string, FragranceKnowledge>();
  for (const f of mkcCatalogue) {
    index.set(f.slug, f);
  }
  return index;
}

export default async function RelationshipReviewQueuePage() {
  const cookieStore = await cookies();
  const session     = cookieStore.get("msr-ops-session")?.value;
  const isAuth      = !!session && session === computeSessionToken();

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
