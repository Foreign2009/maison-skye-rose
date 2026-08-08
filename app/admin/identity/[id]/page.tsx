import type { Metadata } from "next";
import { cookies }       from "next/headers";
import { createHash }    from "crypto";
import { redirect, notFound } from "next/navigation";
import { readFileSync }  from "fs";
import path              from "path";
import {
  IdentityEditorialService,
  PRODUCTION_CLOCK,
  createProductionRepository,
} from "@/app/lib/identity/editorial";
import type { CampaignEntry } from "@/app/lib/identity/editorial";
import IdentityReviewDetail from "../IdentityReviewDetail";

export const metadata: Metadata = {
  title:  "Identity Detail | Maison Skye & Rose",
  robots: { index: false, follow: false },
};

function computeSessionToken(): string {
  return createHash("sha256")
    .update((process.env.ADMIN_SECRET ?? "") + "msr-ops-v1")
    .digest("hex");
}

type EditorialFile = { entries: CampaignEntry[] };

export default async function IdentityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cookieStore = await cookies();
  const session     = cookieStore.get("msr-ops-session")?.value;
  const isAuth      = !!session && session === computeSessionToken();

  if (!isAuth) redirect("/admin");

  const editorialPath = path.join(
    process.cwd(),
    "app/lib/identity/data/campaigns/mid-year-2026-editorial.json",
  );
  const editorial = JSON.parse(readFileSync(editorialPath, "utf-8")) as EditorialFile;

  const service = new IdentityEditorialService(createProductionRepository(), PRODUCTION_CLOCK);
  const detail  = service.getIdentityReview(id, editorial.entries);

  if (!detail) notFound();

  // key={updatedAt} causes React to remount the client component after
  // each successful mutation → resets all local state cleanly.
  return (
    <IdentityReviewDetail
      key={detail.record.updatedAt}
      detail={detail}
      identityId={id}
    />
  );
}
