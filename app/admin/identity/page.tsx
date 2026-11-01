import type { Metadata } from "next";
import { hasAdminSession } from "@/app/lib/admin/session";
import { redirect }      from "next/navigation";
import { readFileSync }  from "fs";
import path              from "path";
import {
  IdentityEditorialService,
  PRODUCTION_CLOCK,
  createProductionRepository,
} from "@/app/lib/identity/editorial";
import type { CampaignEntry } from "@/app/lib/identity/editorial";
import IdentityReviewList from "./IdentityReviewList";

export const metadata: Metadata = {
  title:  "Identity Review | Maison Skye & Rose",
  robots: { index: false, follow: false },
};

type EditorialFile = { entries: CampaignEntry[] };

export default async function IdentityReviewQueuePage() {
  const isAuth      = await hasAdminSession();

  if (!isAuth) redirect("/admin");

  const editorialPath = path.join(
    process.cwd(),
    "app/lib/identity/data/campaigns/mid-year-2026-editorial.json",
  );
  const editorial = JSON.parse(readFileSync(editorialPath, "utf-8")) as EditorialFile;

  const service = new IdentityEditorialService(createProductionRepository(), PRODUCTION_CLOCK);
  const queue   = service.getReviewQueue(undefined, editorial.entries);

  return <IdentityReviewList queue={queue} />;
}
