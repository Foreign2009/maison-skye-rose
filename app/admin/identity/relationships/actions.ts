"use server";

/**
 * EP6-P5C — Relationship Review Server Actions
 *
 * SERVER-ONLY MODULE.
 * Thin authenticated wrappers around RelationshipEditorialService.
 * These actions contain NO editorial business logic of their own.
 * All governance is delegated exclusively to RelationshipEditorialService.
 *
 * Auth boundary: every action checks the admin session cookie FIRST.
 * Server Actions are independently callable — page-level protection alone
 * does not secure them.
 *
 * Note: The MKC index is not required for mutation actions — it is only used
 * by the read projections (getReviewQueue, getReviewUnit) which are called
 * server-side in the page Server Components.
 */

import { cookies }        from "next/headers";
import { createHash }     from "crypto";
import { revalidatePath } from "next/cache";

import { RelationshipEditorialService } from "@/app/lib/identity/editorial/relationship/RelationshipEditorialService";
import {
  createProductionQueueRepository,
  createProductionLedgerRepository,
  RELATIONSHIP_PRODUCTION_CLOCK,
} from "@/app/lib/identity/editorial/relationship/persistence";

import type {
  ApproveRelationshipInput,
  RejectRelationshipInput,
  DeferRelationshipInput,
  RelationshipEditorialResult,
} from "@/app/lib/identity/editorial/relationship/types";

// ── Auth ──────────────────────────────────────────────────────────────────────

function computeSessionToken(): string {
  return createHash("sha256")
    .update((process.env.ADMIN_SECRET ?? "") + "msr-ops-v1")
    .digest("hex");
}

async function assertAuth(): Promise<void> {
  const cookieStore = await cookies();
  const session = cookieStore.get("msr-ops-session")?.value;
  if (!session || session !== computeSessionToken()) {
    throw new Error("Unauthorized: admin authentication required.");
  }
}

// ── Service factory ───────────────────────────────────────────────────────────

function makeService(): RelationshipEditorialService {
  // Mutation actions do not require the MKC index (only read projections do).
  // Pass an empty map — the service constructor accepts it, and _decide never uses it.
  return new RelationshipEditorialService(
    createProductionQueueRepository(),
    createProductionLedgerRepository(),
    new Map(),
    RELATIONSHIP_PRODUCTION_CLOCK,
  );
}

// ── Revalidation ─────────────────────────────────────────────────────────────

function revalidateRelationshipPages(): void {
  revalidatePath("/admin/identity/relationships", "layout");
}

// ── Actions ───────────────────────────────────────────────────────────────────

export async function approveRelationshipAction(
  input: ApproveRelationshipInput,
): Promise<RelationshipEditorialResult> {
  await assertAuth();
  const result = makeService().approveRelationship(input);
  if (result.success) revalidateRelationshipPages();
  return result;
}

export async function rejectRelationshipAction(
  input: RejectRelationshipInput,
): Promise<RelationshipEditorialResult> {
  await assertAuth();
  const result = makeService().rejectRelationship(input);
  if (result.success) revalidateRelationshipPages();
  return result;
}

export async function deferRelationshipAction(
  input: DeferRelationshipInput,
): Promise<RelationshipEditorialResult> {
  await assertAuth();
  const result = makeService().deferRelationship(input);
  if (result.success) revalidateRelationshipPages();
  return result;
}
