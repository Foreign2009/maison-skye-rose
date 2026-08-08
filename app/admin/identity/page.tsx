import type { Metadata } from "next";
import { cookies }       from "next/headers";
import { createHash }    from "crypto";
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

// Not exported — "use server" constraint; page.tsx defines its own copy.
function computeSessionToken(): string {
  return createHash("sha256")
    .update((process.env.ADMIN_SECRET ?? "") + "msr-ops-v1")
    .digest("hex");
}

type EditorialFile = { entries: CampaignEntry[] };

export default async function IdentityReviewQueuePage() {
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
  const queue   = service.getReviewQueue(undefined, editorial.entries);

  return <IdentityReviewList queue={queue} />;
}
