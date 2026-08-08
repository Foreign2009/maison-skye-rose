"use client";

/**
 * EP5-P3C — Identity Review Detail Client Component
 *
 * The human editorial workstation. Displays the full identity record and allows
 * the reviewer to execute the seven EP5-P3B editorial actions.
 *
 * ARCHITECTURAL CONSTRAINTS:
 * - No filesystem imports (fs, path).
 * - No persistence.ts imports.
 * - No identity-registry.json access.
 * - No reproduction of verification, transition, or collision rules.
 * - All mutations delegate exclusively to the Server Actions in ./actions.ts,
 *   which in turn delegate to IdentityEditorialService.
 */

import {
  useState,
  useTransition,
} from "react";
import { useRouter }   from "next/navigation";
import Link            from "next/link";
import AdminNavigation from "@/app/admin/components/AdminNavigation";
import { logoutAction } from "@/app/admin/actions";
import {
  verifyIdentityAction,
  correctCanonicalAction,
  confirmAliasAction,
  requestMoreResearchAction,
  elevateAction,
  rejectIdentityAction,
  disputeIdentityAction,
} from "./actions";
import type {
  IdentityReviewDetail,
  EditorialResult,
  CorrectCanonicalInput,
} from "@/app/lib/identity/editorial";
import type {
  IdentityStatus,
  MarketedGender,
  AliasType,
} from "@/app/lib/identity/types";

// ── Display helpers ───────────────────────────────────────────────────────────

const STATUS_LABELS: Record<IdentityStatus, string> = {
  "candidate":      "Candidate",
  "pending-review": "Pending Review",
  "verified":       "Verified",
  "disputed":       "Disputed",
  "deprecated":     "Deprecated",
  "rejected":       "Rejected",
};

const STATUS_COLOURS: Record<IdentityStatus, string> = {
  "candidate":      "bg-amber-100 text-amber-800",
  "pending-review": "bg-blue-100 text-blue-800",
  "verified":       "bg-green-100 text-green-800",
  "disputed":       "bg-orange-100 text-orange-800",
  "deprecated":     "bg-gray-100 text-gray-500",
  "rejected":       "bg-red-100 text-red-700",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-ZA", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ── Action panel types ────────────────────────────────────────────────────────

type ActiveAction =
  | "verify"
  | "correct-canonical"
  | "confirm-alias"
  | "request-more-research"
  | "elevate"
  | "reject"
  | "dispute"
  | null;

type LaunchYearMode  = "keep" | "set" | "clear";
type GenderMode      = "keep" | "set" | "clear";

type ActionFeedback =
  | { kind: "success"; message: string }
  | { kind: "error";   message: string; collision?: { existingId: string } }
  | { kind: "no-op";   message: string };

// ── Section header ────────────────────────────────────────────────────────────

function SectionHeader({ label }: { label: string }) {
  return (
    <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d89ca4]">
      {label}
    </h3>
  );
}

// ── Field row ─────────────────────────────────────────────────────────────────

function FieldRow({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex gap-4 py-1.5">
      <span className="w-36 shrink-0 text-[11px] font-medium text-[#4f4a52]/40">{label}</span>
      <span className={`text-sm text-[#4f4a52] ${mono ? "font-mono text-xs" : ""}`}>
        {value ?? <span className="text-[#4f4a52]/25">—</span>}
      </span>
    </div>
  );
}

// ── Form label ────────────────────────────────────────────────────────────────

function FormLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#4f4a52]/50">
      {children}{required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-[#4f4a52] focus:outline-none focus:ring-2 focus:ring-[#4f4a52]/20 disabled:opacity-50";

const textareaClass =
  "w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-[#4f4a52] focus:outline-none focus:ring-2 focus:ring-[#4f4a52]/20 disabled:opacity-50 resize-y min-h-[80px]";

const selectClass =
  "w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-[#4f4a52] focus:outline-none focus:ring-2 focus:ring-[#4f4a52]/20 disabled:opacity-50";

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  detail:     IdentityReviewDetail;
  identityId: string;
}

export default function IdentityReviewDetail({ detail, identityId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // ── Stale state ──────────────────────────────────────────────────────────
  const [isStale, setIsStale] = useState(false);

  // ── Action panel ─────────────────────────────────────────────────────────
  const [activeAction, setActiveAction] = useState<ActiveAction>(null);

  // ── Feedback ─────────────────────────────────────────────────────────────
  const [feedback, setFeedback] = useState<ActionFeedback | null>(null);

  // ── Shared inputs ─────────────────────────────────────────────────────────
  const [actor,  setActor]  = useState("");
  const [reason, setReason] = useState("");

  // ── Correct-canonical inputs ──────────────────────────────────────────────
  const [ccName,          setCcName]          = useState("");
  const [ccBrand,         setCcBrand]         = useState("");
  const [ccYearMode,      setCcYearMode]      = useState<LaunchYearMode>("keep");
  const [ccYearValue,     setCcYearValue]     = useState("");
  const [ccGenderMode,    setCcGenderMode]    = useState<GenderMode>("keep");
  const [ccGenderValue,   setCcGenderValue]   = useState<MarketedGender>("female");

  // ── Confirm-alias inputs ──────────────────────────────────────────────────
  const [aliasValue, setAliasValue] = useState("");
  const [aliasType,  setAliasType]  = useState<AliasType>("supplier");

  const { record, campaignEntry, verificationEligible, verificationBlockers, canonicalCollisionWarning } = detail;
  const status = record.status;

  // ── Action eligibility ────────────────────────────────────────────────────
  const canVerify               = status === "pending-review" || status === "disputed";
  const canCorrectCanonical     = status !== "rejected" && status !== "deprecated";
  const canConfirmAlias         = status !== "rejected" && status !== "deprecated";
  const canRequestMoreResearch  = status === "pending-review";
  const canElevate              = status === "candidate";
  const canReject               = status === "candidate" || status === "pending-review" || status === "disputed";
  const canDispute              = status === "verified";
  const hasAnyAction            = canVerify || canCorrectCanonical || canConfirmAlias || canRequestMoreResearch || canElevate || canReject || canDispute;

  // ── Result handling ───────────────────────────────────────────────────────
  function handleResult(result: EditorialResult) {
    if (result.success) {
      setFeedback({ kind: "success", message: "Change saved." });
      setActiveAction(null);
      setActor("");
      setReason("");
      router.refresh();
    } else if (result.kind === "stale-review") {
      setIsStale(true);
    } else if (result.kind === "no-op") {
      setFeedback({ kind: "no-op", message: "No changes detected — all fields were identical." });
    } else if (result.kind === "canonical-collision" || result.kind === "alias-collision") {
      setFeedback({
        kind: "error",
        message: result.message,
        collision: result.collision ? { existingId: result.collision.existingId } : undefined,
      });
    } else {
      setFeedback({ kind: "error", message: result.message });
    }
  }

  function clearFeedback() { setFeedback(null); }

  function openAction(action: ActiveAction) {
    setActiveAction(action);
    setFeedback(null);
  }

  // ── Action submit handlers ────────────────────────────────────────────────

  function submitVerify() {
    if (!actor.trim()) { setFeedback({ kind: "error", message: "Actor is required." }); return; }
    startTransition(async () => {
      const result = await verifyIdentityAction({
        identityId,
        actor: actor.trim(),
        expectedUpdatedAt: record.updatedAt,
        ...(reason.trim() ? { reason: reason.trim() } : {}),
      });
      handleResult(result);
    });
  }

  function submitCorrectCanonical() {
    if (!actor.trim()) { setFeedback({ kind: "error", message: "Actor is required." }); return; }

    const yearField: { launchYear?: number | null } =
      ccYearMode === "clear" ? { launchYear: null } :
      ccYearMode === "set" && ccYearValue.trim() ? { launchYear: parseInt(ccYearValue, 10) } :
      {};

    if ("launchYear" in yearField && typeof yearField.launchYear === "number" && isNaN(yearField.launchYear)) {
      setFeedback({ kind: "error", message: "Launch year must be a valid number." });
      return;
    }

    const genderField: { marketedGender?: MarketedGender | null } =
      ccGenderMode === "clear" ? { marketedGender: null } :
      ccGenderMode === "set"   ? { marketedGender: ccGenderValue } :
      {};

    const input: CorrectCanonicalInput = {
      identityId,
      actor: actor.trim(),
      expectedUpdatedAt: record.updatedAt,
      ...(reason.trim()  ? { reason: reason.trim() }           : {}),
      ...(ccName.trim()  ? { canonicalName: ccName.trim() }   : {}),
      ...(ccBrand.trim() ? { canonicalBrand: ccBrand.trim() } : {}),
      ...yearField,
      ...genderField,
    };

    startTransition(async () => {
      const result = await correctCanonicalAction(input);
      handleResult(result);
    });
  }

  function submitConfirmAlias() {
    if (!actor.trim()) { setFeedback({ kind: "error", message: "Actor is required." }); return; }
    if (!aliasValue.trim()) { setFeedback({ kind: "error", message: "Alias value is required." }); return; }
    startTransition(async () => {
      const result = await confirmAliasAction({
        identityId,
        actor: actor.trim(),
        expectedUpdatedAt: record.updatedAt,
        aliasValue: aliasValue.trim(),
        aliasType,
        ...(reason.trim() ? { reason: reason.trim() } : {}),
      });
      handleResult(result);
    });
  }

  function submitRequestMoreResearch() {
    if (!actor.trim())  { setFeedback({ kind: "error", message: "Actor is required." }); return; }
    if (!reason.trim()) { setFeedback({ kind: "error", message: "Reason is required for this action." }); return; }
    startTransition(async () => {
      const result = await requestMoreResearchAction({
        identityId,
        actor: actor.trim(),
        expectedUpdatedAt: record.updatedAt,
        reason: reason.trim(),
      });
      handleResult(result);
    });
  }

  function submitElevate() {
    if (!actor.trim())  { setFeedback({ kind: "error", message: "Actor is required." }); return; }
    if (!reason.trim()) { setFeedback({ kind: "error", message: "Reason is required for this action." }); return; }
    startTransition(async () => {
      const result = await elevateAction({
        identityId,
        actor: actor.trim(),
        expectedUpdatedAt: record.updatedAt,
        reason: reason.trim(),
      });
      handleResult(result);
    });
  }

  function submitReject() {
    if (!actor.trim())  { setFeedback({ kind: "error", message: "Actor is required." }); return; }
    if (!reason.trim()) { setFeedback({ kind: "error", message: "Reason is required for rejection." }); return; }
    startTransition(async () => {
      const result = await rejectIdentityAction({
        identityId,
        actor: actor.trim(),
        expectedUpdatedAt: record.updatedAt,
        reason: reason.trim(),
      });
      handleResult(result);
    });
  }

  function submitDispute() {
    if (!actor.trim())  { setFeedback({ kind: "error", message: "Actor is required." }); return; }
    if (!reason.trim()) { setFeedback({ kind: "error", message: "Reason is required to dispute a verified identity." }); return; }
    startTransition(async () => {
      const result = await disputeIdentityAction({
        identityId,
        actor: actor.trim(),
        expectedUpdatedAt: record.updatedAt,
        reason: reason.trim(),
      });
      handleResult(result);
    });
  }

  // ── Shared form fields ────────────────────────────────────────────────────
  function ActorField() {
    return (
      <div>
        <FormLabel required>Actor (audit label)</FormLabel>
        <input
          type="text"
          value={actor}
          onChange={(e) => setActor(e.target.value)}
          placeholder="e.g. admin@maison, your initials, or a session label"
          className={inputClass}
          disabled={isPending}
        />
      </div>
    );
  }

  function ReasonField({ required: req = false, placeholder = "Reason for this change..." }: { required?: boolean; placeholder?: string }) {
    return (
      <div>
        <FormLabel required={req}>Reason</FormLabel>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={placeholder}
          className={textareaClass}
          disabled={isPending}
        />
      </div>
    );
  }

  function ActionButtons({ onSubmit, submitLabel, onCancel }: {
    onSubmit: () => void;
    submitLabel: string;
    onCancel: () => void;
  }) {
    return (
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isPending || isStale}
          className="rounded-full bg-[#4f4a52] px-5 py-2 text-xs font-bold text-white transition hover:bg-black disabled:opacity-40"
        >
          {isPending ? "Saving…" : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="rounded-full border border-gray-200 px-5 py-2 text-xs text-[#4f4a52]/60 transition hover:text-[#4f4a52]"
        >
          Cancel
        </button>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f7f5]">

      {/* Header */}
      <header className="flex items-center justify-between bg-[#4f4a52] px-6 py-4">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-[9px] uppercase tracking-[0.5em] text-[#d89ca4]">Internal</p>
            <p className="text-sm font-black uppercase tracking-widest text-white">Maison Operations</p>
          </div>
          <AdminNavigation />
        </div>
        <form action={logoutAction}>
          <button type="submit" className="text-xs text-white/60 transition hover:text-white">
            Sign Out
          </button>
        </form>
      </header>

      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-white px-6 py-3">
        <nav className="flex items-center gap-2 text-xs text-[#4f4a52]/50">
          <Link href="/admin/identity" className="hover:text-[#d89ca4]">Identity Review Queue</Link>
          <span>/</span>
          <span className="font-mono text-[#4f4a52]">{identityId}</span>
        </nav>
      </div>

      {/* Stale banner */}
      {isStale && (
        <div className="border-b border-amber-200 bg-amber-50 px-6 py-4">
          <div className="mx-auto flex max-w-[1200px] items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-amber-800">
                This identity changed after you opened it.
              </p>
              <p className="mt-0.5 text-xs text-amber-700">
                Reload the record before making another editorial decision.
              </p>
            </div>
            <button
              onClick={() => { setIsStale(false); router.refresh(); }}
              className="rounded-full bg-amber-800 px-4 py-2 text-xs font-bold text-white transition hover:bg-amber-900"
            >
              Reload Record
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="mx-auto w-full max-w-[1200px] px-6 py-10">

        {/* Page header */}
        <div className="mb-8 flex items-start justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#d89ca4]">Identity Review</p>
            <h1 className="mt-1 text-2xl font-black text-[#4f4a52]">
              {record.canonicalIdentity.canonicalName}
            </h1>
            {record.canonicalIdentity.canonicalBrand && (
              <p className="mt-0.5 text-sm text-[#4f4a52]/60">{record.canonicalIdentity.canonicalBrand}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="font-mono text-xs text-[#4f4a52]/40">{record.id}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLOURS[status]}`}>
              {STATUS_LABELS[status]}
            </span>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Left column — identity data */}
          <div className="space-y-8 lg:col-span-2">

            {/* IDENTITY */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <SectionHeader label="Identity" />
              <div className="divide-y divide-gray-50">
                <FieldRow label="MIP ID"    value={record.id} mono />
                <FieldRow label="Status"    value={<span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${STATUS_COLOURS[status]}`}>{STATUS_LABELS[status]}</span>} />
                <FieldRow label="Category"  value={record.canonicalIdentity.category} />
                <FieldRow label="Updated"   value={formatDate(record.updatedAt)} />
                <FieldRow label="Created"   value={formatDate(record.createdAt)} />
              </div>
            </section>

            {/* CURRENT CANONICAL IDENTITY */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <SectionHeader label="Current Canonical Identity" />
              <div className="divide-y divide-gray-50">
                <FieldRow label="Canonical Name"  value={record.canonicalIdentity.canonicalName} />
                <FieldRow label="Canonical Brand" value={record.canonicalIdentity.canonicalBrand} />
                <FieldRow label="Launch Year"     value={record.canonicalIdentity.launchYear} />
                <FieldRow label="Marketed Gender" value={record.canonicalIdentity.marketedGender} />
              </div>
            </section>

            {/* RESEARCH PROPOSAL */}
            {campaignEntry && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6">
                <SectionHeader label="Research Proposal" />
                <div className="divide-y divide-gray-50">
                  {campaignEntry.researchCanonicalProposal && (
                    <FieldRow label="Proposed Name"    value={campaignEntry.researchCanonicalProposal} />
                  )}
                  {campaignEntry.proposedCanonicalBrand && (
                    <FieldRow label="Proposed Brand"   value={campaignEntry.proposedCanonicalBrand} />
                  )}
                  <FieldRow label="Rec. Action"        value={campaignEntry.recommendedAction} />
                  <FieldRow label="Research Confidence" value={
                    <span className={
                      campaignEntry.researchConfidence === "high"   ? "font-medium text-green-700" :
                      campaignEntry.researchConfidence === "medium" ? "font-medium text-amber-700" :
                      campaignEntry.researchConfidence === "low"    ? "font-medium text-red-600"   :
                      "text-gray-400"
                    }>
                      {campaignEntry.researchConfidence}
                    </span>
                  } />
                  <FieldRow label="Possible Name Issue" value={
                    campaignEntry.possibleNameIssue
                      ? <span className="font-medium text-red-600">⚠ Yes</span>
                      : <span className="text-gray-400">No</span>
                  } />
                  {campaignEntry.researchNotes && (
                    <div className="py-2">
                      <p className="mb-1 text-[11px] font-medium text-[#4f4a52]/40">Research Notes</p>
                      <p className="text-sm text-[#4f4a52]/70">{campaignEntry.researchNotes}</p>
                    </div>
                  )}
                  {campaignEntry.nameIssueExplanation && (
                    <div className="py-2">
                      <p className="mb-1 text-[11px] font-medium text-[#4f4a52]/40">Name Issue Explanation</p>
                      <p className="text-sm text-red-700">{campaignEntry.nameIssueExplanation}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* SUPPLIER PROVENANCE */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <SectionHeader label="Supplier Provenance" />
              {record.supplierIdentities.length === 0 ? (
                <p className="text-sm text-[#4f4a52]/30">No supplier identities recorded.</p>
              ) : (
                <div className="space-y-4">
                  {record.supplierIdentities.map((si, i) => (
                    <div key={i} className="rounded-xl bg-gray-50 p-4">
                      <p className="text-sm font-semibold text-[#4f4a52]">{si.supplierName}</p>
                      <div className="mt-2 divide-y divide-gray-100">
                        {si.supplierCategory   && <FieldRow label="Category"  value={si.supplierCategory} />}
                        {si.supplierCode       && <FieldRow label="Code"      value={si.supplierCode} mono />}
                        {si.supplierBrand      && <FieldRow label="Brand"     value={si.supplierBrand} />}
                        {si.supplierId         && <FieldRow label="Supplier ID" value={si.supplierId} mono />}
                        {si.sourceReference    && <FieldRow label="Reference" value={si.sourceReference} mono />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* EVIDENCE */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <SectionHeader label="Evidence" />
              {record.evidence.length === 0 ? (
                <p className="text-sm text-[#4f4a52]/30">No evidence recorded.</p>
              ) : (
                <div className="space-y-4">
                  {record.evidence.map((ev) => (
                    <div key={ev.evidenceId} className="rounded-xl bg-gray-50 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-[#4f4a52]">{ev.sourceName}</p>
                        <span className="shrink-0 rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                          {ev.type}
                        </span>
                      </div>
                      <div className="mt-2 divide-y divide-gray-100">
                        {ev.observedValue    && <FieldRow label="Observed"   value={ev.observedValue} />}
                        {ev.notes            && <FieldRow label="Notes"      value={ev.notes} />}
                        {ev.sourceReference  && <FieldRow label="Reference"  value={ev.sourceReference} mono />}
                        {ev.createdAt        && <FieldRow label="Recorded"   value={formatDate(ev.createdAt)} />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ALIASES */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <SectionHeader label="Aliases" />
              {record.aliases.length === 0 ? (
                <p className="text-sm text-[#4f4a52]/30">No aliases recorded.</p>
              ) : (
                <div className="divide-y divide-gray-50">
                  {record.aliases.map((a, i) => (
                    <div key={i} className="flex items-center justify-between gap-4 py-2">
                      <span className="text-sm text-[#4f4a52]">{a.value}</span>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">{a.type}</span>
                        {a.verified && (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] text-green-700">verified</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* CONFIDENCE */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <SectionHeader label="Confidence (Read-only)" />
              <div className="divide-y divide-gray-50">
                <FieldRow label="Score"           value={`${record.confidence.score} / 100`} />
                <div className="py-2">
                  <p className="mb-1 text-[11px] font-medium text-[#4f4a52]/40">Basis</p>
                  <p className="text-sm text-[#4f4a52]/70">{record.confidence.basis}</p>
                </div>
                {record.confidence.lastEvaluatedAt && (
                  <FieldRow label="Last Evaluated" value={formatDate(record.confidence.lastEvaluatedAt)} />
                )}
              </div>
              <p className="mt-3 text-[10px] text-[#4f4a52]/30">
                Confidence is managed by the platform scoring engine. Editorial actions do not modify it.
              </p>
            </section>

            {/* HISTORY */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <SectionHeader label="Audit History" />
              {record.history.length === 0 ? (
                <p className="text-sm text-[#4f4a52]/30">No history recorded.</p>
              ) : (
                <div className="space-y-3">
                  {[...record.history].reverse().map((h, i) => (
                    <div key={i} className="rounded-xl bg-gray-50 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <span className="rounded-full bg-[#4f4a52]/10 px-2.5 py-0.5 text-[10px] font-medium text-[#4f4a52]">
                          {h.event}
                        </span>
                        <span className="text-[10px] text-[#4f4a52]/40 whitespace-nowrap">
                          {formatDate(h.timestamp)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-[#4f4a52]/80">{h.summary}</p>
                      {h.actor && (
                        <p className="mt-1 text-[11px] text-[#4f4a52]/40">by {h.actor}</p>
                      )}
                      {h.previousValue && (
                        <p className="mt-1 text-[10px] text-gray-400">
                          <span className="font-medium">Before:</span> {h.previousValue}
                        </p>
                      )}
                      {h.nextValue && (
                        <p className="mt-0.5 text-[10px] text-gray-400">
                          <span className="font-medium">After:</span> {h.nextValue}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>{/* /left column */}

          {/* Right column — actions */}
          <div className="space-y-6">

            {/* VERIFICATION ELIGIBILITY */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <SectionHeader label="Verification Eligibility" />
              {canVerify ? (
                verificationEligible ? (
                  <div className="rounded-xl bg-green-50 p-3 ring-1 ring-green-200">
                    <p className="text-sm font-semibold text-green-800">Eligible for verification</p>
                    {canonicalCollisionWarning && (
                      <p className="mt-1 text-xs text-amber-700">⚠ {canonicalCollisionWarning}</p>
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl bg-red-50 p-3 ring-1 ring-red-200">
                    <p className="mb-2 text-xs font-semibold text-red-800">Cannot verify — blockers:</p>
                    <ul className="space-y-1">
                      {verificationBlockers.map((b, i) => (
                        <li key={i} className="text-xs text-red-700">• {b}</li>
                      ))}
                    </ul>
                  </div>
                )
              ) : (
                <p className="text-xs text-[#4f4a52]/40">
                  Verification is not available for status &ldquo;{status}&rdquo;.
                </p>
              )}
            </section>

            {/* CANONICAL COLLISION WARNING */}
            {canonicalCollisionWarning && !canVerify && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs font-semibold text-amber-800">⚠ Canonical collision warning</p>
                <p className="mt-1 text-xs text-amber-700">{canonicalCollisionWarning}</p>
              </div>
            )}

            {/* FEEDBACK */}
            {feedback && (
              <div className={`rounded-2xl border p-4 ${
                feedback.kind === "success" ? "border-green-200 bg-green-50" :
                feedback.kind === "no-op"   ? "border-blue-200 bg-blue-50"   :
                                              "border-red-200 bg-red-50"
              }`}>
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-semibold ${
                    feedback.kind === "success" ? "text-green-800" :
                    feedback.kind === "no-op"   ? "text-blue-800"  :
                                                  "text-red-800"
                  }`}>
                    {feedback.message}
                  </p>
                  <button
                    onClick={clearFeedback}
                    className="shrink-0 text-xs text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                {feedback.kind === "error" && feedback.collision && (
                  <p className="mt-2 text-xs text-red-700">
                    Conflicting identity:{" "}
                    <Link
                      href={`/admin/identity/${feedback.collision.existingId}`}
                      className="font-medium underline hover:text-red-900"
                    >
                      {feedback.collision.existingId}
                    </Link>
                  </p>
                )}
              </div>
            )}

            {/* EDITORIAL ACTIONS */}
            {hasAnyAction ? (
              <section className="rounded-2xl border border-gray-200 bg-white p-6">
                <SectionHeader label="Editorial Actions" />

                {isStale && (
                  <p className="mb-4 text-xs text-amber-700">
                    Editorial actions are disabled until you reload the record.
                  </p>
                )}

                <div className="space-y-3">

                  {/* VERIFY */}
                  {canVerify && (
                    <div>
                      <button
                        onClick={() => openAction(activeAction === "verify" ? null : "verify")}
                        disabled={isPending || isStale || !verificationEligible}
                        className="w-full rounded-xl bg-green-600 px-4 py-2.5 text-left text-xs font-bold text-white transition hover:bg-green-700 disabled:opacity-40"
                        title={!verificationEligible ? "Verification blocked — see blockers above" : undefined}
                      >
                        Verify Identity
                      </button>
                      {!verificationEligible && (
                        <p className="mt-1 text-[10px] text-red-500">
                          Verification blocked — resolve blockers above first.
                        </p>
                      )}
                      {activeAction === "verify" && (
                        <div className="mt-3 space-y-3 rounded-xl bg-gray-50 p-4">
                          <ActorField />
                          <ReasonField placeholder="Optional: reason for verification" />
                          <ActionButtons
                            onSubmit={submitVerify}
                            submitLabel="Confirm Verify"
                            onCancel={() => setActiveAction(null)}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* CORRECT CANONICAL */}
                  {canCorrectCanonical && (
                    <div>
                      <button
                        onClick={() => openAction(activeAction === "correct-canonical" ? null : "correct-canonical")}
                        disabled={isPending || isStale}
                        className="w-full rounded-xl bg-[#4f4a52] px-4 py-2.5 text-left text-xs font-bold text-white transition hover:bg-black disabled:opacity-40"
                      >
                        Correct Canonical Identity
                      </button>
                      {activeAction === "correct-canonical" && (
                        <div className="mt-3 space-y-3 rounded-xl bg-gray-50 p-4">
                          <p className="text-[10px] text-[#4f4a52]/50">
                            Leave fields blank to keep the current value.
                            Correction does not automatically verify — that remains a separate decision.
                          </p>
                          <ActorField />
                          <div>
                            <FormLabel>Canonical Name</FormLabel>
                            <input type="text" value={ccName} onChange={(e) => setCcName(e.target.value)}
                              placeholder={`Current: ${record.canonicalIdentity.canonicalName}`}
                              className={inputClass} disabled={isPending} />
                          </div>
                          <div>
                            <FormLabel>Canonical Brand</FormLabel>
                            <input type="text" value={ccBrand} onChange={(e) => setCcBrand(e.target.value)}
                              placeholder={record.canonicalIdentity.canonicalBrand ? `Current: ${record.canonicalIdentity.canonicalBrand}` : "Add brand"}
                              className={inputClass} disabled={isPending} />
                          </div>
                          <div>
                            <FormLabel>Launch Year</FormLabel>
                            <select value={ccYearMode} onChange={(e) => setCcYearMode(e.target.value as LaunchYearMode)}
                              className={selectClass} disabled={isPending}>
                              <option value="keep">Keep current{record.canonicalIdentity.launchYear ? ` (${record.canonicalIdentity.launchYear})` : " (none)"}</option>
                              <option value="set">Set to…</option>
                              <option value="clear">Clear (remove)</option>
                            </select>
                            {ccYearMode === "set" && (
                              <input type="number" value={ccYearValue} onChange={(e) => setCcYearValue(e.target.value)}
                                placeholder="e.g. 1995" min={1900} max={2100}
                                className={`${inputClass} mt-2`} disabled={isPending} />
                            )}
                          </div>
                          <div>
                            <FormLabel>Marketed Gender</FormLabel>
                            <select value={ccGenderMode} onChange={(e) => setCcGenderMode(e.target.value as GenderMode)}
                              className={selectClass} disabled={isPending}>
                              <option value="keep">Keep current{record.canonicalIdentity.marketedGender ? ` (${record.canonicalIdentity.marketedGender})` : " (none)"}</option>
                              <option value="set">Set to…</option>
                              <option value="clear">Clear (remove)</option>
                            </select>
                            {ccGenderMode === "set" && (
                              <select value={ccGenderValue} onChange={(e) => setCcGenderValue(e.target.value as MarketedGender)}
                                className={`${selectClass} mt-2`} disabled={isPending}>
                                <option value="female">Female</option>
                                <option value="male">Male</option>
                                <option value="unisex">Unisex</option>
                                <option value="shared">Shared</option>
                              </select>
                            )}
                          </div>
                          <ReasonField placeholder="Why is this correction needed?" />
                          <ActionButtons
                            onSubmit={submitCorrectCanonical}
                            submitLabel="Save Correction"
                            onCancel={() => setActiveAction(null)}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* CONFIRM ALIAS */}
                  {canConfirmAlias && (
                    <div>
                      <button
                        onClick={() => openAction(activeAction === "confirm-alias" ? null : "confirm-alias")}
                        disabled={isPending || isStale}
                        className="w-full rounded-xl bg-[#4f4a52] px-4 py-2.5 text-left text-xs font-bold text-white transition hover:bg-black disabled:opacity-40"
                      >
                        Confirm Alias
                      </button>
                      {activeAction === "confirm-alias" && (
                        <div className="mt-3 space-y-3 rounded-xl bg-gray-50 p-4">
                          <p className="text-[10px] text-[#4f4a52]/50">
                            Aliases must be entered explicitly. Supplier names are never automatically converted.
                          </p>
                          <ActorField />
                          <div>
                            <FormLabel required>Alias Value</FormLabel>
                            <input type="text" value={aliasValue} onChange={(e) => setAliasValue(e.target.value)}
                              placeholder="Exact alias string"
                              className={inputClass} disabled={isPending} />
                          </div>
                          <div>
                            <FormLabel required>Alias Type</FormLabel>
                            <select value={aliasType} onChange={(e) => setAliasType(e.target.value as AliasType)}
                              className={selectClass} disabled={isPending}>
                              <option value="supplier">Supplier (name used in catalogue or invoice)</option>
                              <option value="common">Common (well-known shorthand)</option>
                              <option value="historical">Historical (former official name)</option>
                              <option value="regional">Regional (specific market or language)</option>
                              <option value="editorial">Editorial (Maison editorial copy)</option>
                              <option value="search">Search (discovery variant)</option>
                            </select>
                          </div>
                          <ReasonField placeholder="Why is this alias being confirmed?" />
                          <ActionButtons
                            onSubmit={submitConfirmAlias}
                            submitLabel="Confirm Alias"
                            onCancel={() => setActiveAction(null)}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* REQUEST MORE RESEARCH */}
                  {canRequestMoreResearch && (
                    <div>
                      <button
                        onClick={() => openAction(activeAction === "request-more-research" ? null : "request-more-research")}
                        disabled={isPending || isStale}
                        className="w-full rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-left text-xs font-bold text-amber-800 transition hover:bg-amber-100 disabled:opacity-40"
                      >
                        Request More Research
                      </button>
                      {activeAction === "request-more-research" && (
                        <div className="mt-3 space-y-3 rounded-xl bg-gray-50 p-4">
                          <p className="text-[10px] text-[#4f4a52]/50">
                            Returns this identity to Candidate status for additional research.
                          </p>
                          <ActorField />
                          <ReasonField required placeholder="What additional research is needed?" />
                          <ActionButtons
                            onSubmit={submitRequestMoreResearch}
                            submitLabel="Return to Candidate"
                            onCancel={() => setActiveAction(null)}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* ELEVATE */}
                  {canElevate && (
                    <div>
                      <button
                        onClick={() => openAction(activeAction === "elevate" ? null : "elevate")}
                        disabled={isPending || isStale}
                        className="w-full rounded-xl border border-blue-300 bg-blue-50 px-4 py-2.5 text-left text-xs font-bold text-blue-800 transition hover:bg-blue-100 disabled:opacity-40"
                      >
                        Elevate to Pending Review
                      </button>
                      {activeAction === "elevate" && (
                        <div className="mt-3 space-y-3 rounded-xl bg-gray-50 p-4">
                          <p className="text-[10px] text-[#4f4a52]/50">
                            Promotes this candidate for editorial review.
                          </p>
                          <ActorField />
                          <ReasonField required placeholder="Why is this candidate ready for review?" />
                          <ActionButtons
                            onSubmit={submitElevate}
                            submitLabel="Elevate to Pending Review"
                            onCancel={() => setActiveAction(null)}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* DISPUTE (verified only — kept separate from destructive actions) */}
                  {canDispute && (
                    <div className="border-t border-gray-100 pt-3">
                      <button
                        onClick={() => openAction(activeAction === "dispute" ? null : "dispute")}
                        disabled={isPending || isStale}
                        className="w-full rounded-xl border border-orange-300 bg-orange-50 px-4 py-2.5 text-left text-xs font-bold text-orange-800 transition hover:bg-orange-100 disabled:opacity-40"
                      >
                        Dispute Verified Identity
                      </button>
                      {activeAction === "dispute" && (
                        <div className="mt-3 space-y-3 rounded-xl bg-gray-50 p-4">
                          <p className="text-[10px] text-[#4f4a52]/50">
                            Opens this verified identity for re-evaluation. The identity will return to a disputed state.
                          </p>
                          <ActorField />
                          <ReasonField required placeholder="What is the dispute about?" />
                          <ActionButtons
                            onSubmit={submitDispute}
                            submitLabel="Mark as Disputed"
                            onCancel={() => setActiveAction(null)}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* REJECT (destructive — separated visually) */}
                  {canReject && (
                    <div className="border-t border-gray-100 pt-3">
                      <button
                        onClick={() => openAction(activeAction === "reject" ? null : "reject")}
                        disabled={isPending || isStale}
                        className="w-full rounded-xl border border-red-300 bg-red-50 px-4 py-2.5 text-left text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-40"
                      >
                        Reject Identity
                      </button>
                      {activeAction === "reject" && (
                        <div className="mt-3 space-y-3 rounded-xl bg-red-50 p-4 ring-1 ring-red-200">
                          <p className="text-[10px] font-semibold text-red-700">
                            Rejection is consequential. This marks the identity as a non-entity or unresolvable.
                          </p>
                          <ActorField />
                          <ReasonField required placeholder="Why is this identity being rejected?" />
                          <ActionButtons
                            onSubmit={submitReject}
                            submitLabel="Reject Identity"
                            onCancel={() => setActiveAction(null)}
                          />
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </section>
            ) : (
              <section className="rounded-2xl border border-gray-200 bg-white p-6">
                <SectionHeader label="Editorial Actions" />
                <p className="text-sm text-[#4f4a52]/40">
                  No editorial actions are available for status &ldquo;{status}&rdquo;.
                </p>
              </section>
            )}

          </div>{/* /right column */}
        </div>{/* /grid */}
      </main>
    </div>
  );
}
