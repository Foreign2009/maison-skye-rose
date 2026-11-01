"use server";

/**
 * EP5-P3C — Identity Review Server Actions
 *
 * SERVER-ONLY MODULE.
 * Thin authenticated wrappers around the existing IdentityEditorialService.
 * These actions contain NO editorial business logic of their own.
 * All governance is delegated exclusively to IdentityEditorialService.
 *
 * Auth boundary: every action checks the admin session cookie FIRST.
 * This is required because Server Actions are independently callable —
 * a protected page route alone does not secure them.
 *
 * StaleReviewError is caught here and returned as a serialisable EditorialResult
 * so the client can surface it without a 500.
 */

import { revalidatePath } from "next/cache";
import { hasAdminSession } from "@/app/lib/admin/session";
import {
  IdentityEditorialService,
  PRODUCTION_CLOCK,
  createProductionRepository,
  StaleReviewError,
} from "@/app/lib/identity/editorial";
import type {
  EditorialResult,
  VerifyInput,
  CorrectCanonicalInput,
  ConfirmAliasInput,
  RequestMoreResearchInput,
  ElevateInput,
  RejectInput,
  DisputeInput,
} from "@/app/lib/identity/editorial";

// ── Auth ──────────────────────────────────────────────────────────────────────

// Runs before the service (and its ledger repository) is constructed.
async function assertAuth(): Promise<void> {
  if (!(await hasAdminSession())) {
    throw new Error("Unauthorized: admin authentication required.");
  }
}

// ── Service factory ───────────────────────────────────────────────────────────

function makeService(): IdentityEditorialService {
  return new IdentityEditorialService(createProductionRepository(), PRODUCTION_CLOCK);
}

// ── Stale-review error normalisation ─────────────────────────────────────────

function catchStale(err: unknown): EditorialResult {
  if (err instanceof StaleReviewError) {
    return { success: false, kind: "stale-review", message: err.message };
  }
  // Unexpected errors propagate — Next.js renders a 500 page.
  throw err;
}

// ── Revalidation ─────────────────────────────────────────────────────────────

function revalidateIdentityPages(): void {
  // Clears the cache for both /admin/identity (queue) and /admin/identity/[id] (detail).
  revalidatePath("/admin/identity", "layout");
}

// ── Actions ───────────────────────────────────────────────────────────────────

export async function verifyIdentityAction(input: VerifyInput): Promise<EditorialResult> {
  await assertAuth();
  const service = makeService();
  try {
    const result = service.verifyIdentity(input);
    if (result.success) revalidateIdentityPages();
    return result;
  } catch (err) {
    return catchStale(err);
  }
}

export async function correctCanonicalAction(input: CorrectCanonicalInput): Promise<EditorialResult> {
  await assertAuth();
  const service = makeService();
  try {
    const result = service.correctCanonical(input);
    if (result.success) revalidateIdentityPages();
    return result;
  } catch (err) {
    return catchStale(err);
  }
}

export async function confirmAliasAction(input: ConfirmAliasInput): Promise<EditorialResult> {
  await assertAuth();
  const service = makeService();
  try {
    const result = service.confirmAlias(input);
    if (result.success) revalidateIdentityPages();
    return result;
  } catch (err) {
    return catchStale(err);
  }
}

export async function requestMoreResearchAction(input: RequestMoreResearchInput): Promise<EditorialResult> {
  await assertAuth();
  const service = makeService();
  try {
    const result = service.requestMoreResearch(input);
    if (result.success) revalidateIdentityPages();
    return result;
  } catch (err) {
    return catchStale(err);
  }
}

export async function elevateAction(input: ElevateInput): Promise<EditorialResult> {
  await assertAuth();
  const service = makeService();
  try {
    const result = service.elevate(input);
    if (result.success) revalidateIdentityPages();
    return result;
  } catch (err) {
    return catchStale(err);
  }
}

export async function rejectIdentityAction(input: RejectInput): Promise<EditorialResult> {
  await assertAuth();
  const service = makeService();
  try {
    const result = service.rejectIdentity(input);
    if (result.success) revalidateIdentityPages();
    return result;
  } catch (err) {
    return catchStale(err);
  }
}

export async function disputeIdentityAction(input: DisputeInput): Promise<EditorialResult> {
  await assertAuth();
  const service = makeService();
  try {
    const result = service.disputeIdentity(input);
    if (result.success) revalidateIdentityPages();
    return result;
  } catch (err) {
    return catchStale(err);
  }
}
