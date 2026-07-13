/**
 * Knowledge Factory — Promotion Queue
 *
 * View of approved review records that are ready for promotion.
 * Does not execute promotions — that belongs to PromotionTransaction.
 */

import { getByStatus as getReviewByStatus } from "../review/ReviewRegistry";
import { findPromotionRecord } from "./PromotionRegistry";

const SEP = "═".repeat(62);
const DIV = "─".repeat(62);

export function printPromotionQueue(): void {
  const approved = getReviewByStatus("approved");

  if (approved.length === 0) {
    console.log(`\n  No approved records awaiting promotion.`);
    console.log(`  Run: npm run mkc:review -- --approve <slug> --reviewer <name> --reason "..."`);
    console.log();
    return;
  }

  // Partition by promotion state
  const notYetPromoted = approved.filter(r => {
    const p = findPromotionRecord(r.slug);
    return p?.status !== "promoted";
  });

  const alreadyPromoted = approved.filter(r => {
    const p = findPromotionRecord(r.slug);
    return p?.status === "promoted";
  });

  console.log(`\n${SEP}`);
  console.log(`  Promotion Queue`);
  console.log(`${SEP}`);
  console.log(`  Ready to promote   ${String(notYetPromoted.length).padStart(3)}`);
  console.log(`  Already promoted   ${String(alreadyPromoted.length).padStart(3)}`);
  console.log(`${SEP}`);

  if (notYetPromoted.length > 0) {
    console.log(`\n  READY FOR PROMOTION`);
    console.log(DIV);
    for (const r of notYetPromoted) {
      const reviewer = r.reviewer ? `  reviewed by ${r.reviewer}` : "";
      console.log(`  ○  ${r.name.padEnd(42)}  ${r.validationStatus}${reviewer}`);
    }
  }

  if (alreadyPromoted.length > 0) {
    console.log(`\n  ALREADY PROMOTED`);
    console.log(DIV);
    for (const r of alreadyPromoted) {
      const p = findPromotionRecord(r.slug);
      const completedAt = p?.completedAt
        ? `  promoted ${new Date(p.completedAt).toLocaleDateString()}`
        : "";
      console.log(`  ✓  ${r.name.padEnd(42)}${completedAt}`);
    }
  }

  console.log();
  if (notYetPromoted.length > 0) {
    console.log(`  To promote one record:`);
    console.log(`    npm run mkc:promote -- --slug <slug> --operator <name>`);
    console.log();
    console.log(`  To promote all ready records:`);
    console.log(`    npm run mkc:promote -- --all --operator <name>`);
  }
  console.log(`\n${SEP}`);
}
