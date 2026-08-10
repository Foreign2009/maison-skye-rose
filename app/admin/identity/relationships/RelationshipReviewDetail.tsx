"use client";

/**
 * EP6-P5C — Relationship Review Detail Client Component
 *
 * The founder relationship review workstation.
 *
 * ARCHITECTURAL CONSTRAINTS:
 * - No filesystem imports.
 * - No direct persistence access.
 * - No reproduction of transition or governance logic.
 * - All mutations delegate exclusively to Server Actions in ./actions.ts,
 *   which delegate to RelationshipEditorialService.
 * - Overlap score is labelled "Repository evidence — not editorial truth" throughout.
 * - No confidence scores, approval probabilities, or AI recommendations.
 * - One founder decision at a time. No bulk actions.
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
  approveRelationshipAction,
  rejectRelationshipAction,
  deferRelationshipAction,
} from "./actions";

import type { RelationshipUnitCurrentState } from "@/app/lib/identity/editorial/relationship/RelationshipEditorialService";
import type {
  RelationshipGovernanceState,
  RelationshipEditorialResult,
} from "@/app/lib/identity/editorial/relationship/types";
import type { FragranceKnowledge } from "@/app/lib/mkc/types";

// ── Display helpers ───────────────────────────────────────────────────────────

const GOV_COLOURS: Record<RelationshipGovernanceState, string> = {
  PENDING:          "bg-blue-100 text-blue-800",
  DEFERRED:         "bg-amber-100 text-amber-800",
  FOUNDER_APPROVED: "bg-green-100 text-green-800",
  FOUNDER_REJECTED: "bg-red-100 text-red-700",
  RESEARCH_BLOCKED: "bg-gray-100 text-gray-500",
};

const GOV_LABELS: Record<RelationshipGovernanceState, string> = {
  PENDING:          "Pending Review",
  DEFERRED:         "Deferred",
  FOUNDER_APPROVED: "Founder Approved",
  FOUNDER_REJECTED: "Founder Rejected",
  RESEARCH_BLOCKED: "Research Blocked",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-ZA", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ── Shared form helpers ───────────────────────────────────────────────────────

const inputClass    = "w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-[#4f4a52] focus:outline-none focus:ring-2 focus:ring-[#4f4a52]/20 disabled:opacity-50";
const textareaClass = "w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-[#4f4a52] focus:outline-none focus:ring-2 focus:ring-[#4f4a52]/20 disabled:opacity-50 resize-y min-h-[72px]";

function FormLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#4f4a52]/50">
      {children}{required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d89ca4]">
      {label}
    </h3>
  );
}

function FieldRow({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex gap-4 py-1.5">
      <span className="w-32 shrink-0 text-[11px] font-medium text-[#4f4a52]/40">{label}</span>
      <span className={`text-sm text-[#4f4a52] ${mono ? "font-mono text-xs" : ""}`}>
        {value ?? <span className="text-[#4f4a52]/25">—</span>}
      </span>
    </div>
  );
}

// ── Fragrance context panel ───────────────────────────────────────────────────

function FragrancePanel({ label, slug, fragrance }: {
  label:     string;
  slug:      string;
  fragrance: FragranceKnowledge | null;
}) {
  if (!fragrance) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <SectionHeader label={label} />
        <p className="text-sm text-[#4f4a52]/40 font-mono">{slug}</p>
        <p className="mt-2 text-xs text-amber-600">Fragrance not found in MKC. Slug may be stale.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6">
      <SectionHeader label={label} />
      <div className="mb-3">
        <p className="text-base font-bold text-[#4f4a52]">{fragrance.name}</p>
        {fragrance.subtitle && (
          <p className="text-sm text-[#4f4a52]/60">{fragrance.subtitle}</p>
        )}
        <div className="mt-1 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#4f4a52]/10 px-2 py-0.5 text-[10px] font-medium text-[#4f4a52]">
            {fragrance.collection}
          </span>
          <span className="rounded-full bg-[#4f4a52]/10 px-2 py-0.5 text-[10px] font-medium text-[#4f4a52]">
            {fragrance.gender}
          </span>
        </div>
      </div>
      <div className="divide-y divide-gray-50">
        <FieldRow label="Family"        value={fragrance.family.join(", ")} />
        <FieldRow label="Scent"         value={fragrance.scentCharacter} />
        <FieldRow label="Profile"       value={fragrance.profile} />
        {fragrance.notes.top.length > 0 && (
          <FieldRow label="Top Notes"   value={fragrance.notes.top.join(", ")} />
        )}
        {fragrance.notes.heart.length > 0 && (
          <FieldRow label="Heart Notes" value={fragrance.notes.heart.join(", ")} />
        )}
        {fragrance.notes.base.length > 0 && (
          <FieldRow label="Base Notes"  value={fragrance.notes.base.join(", ")} />
        )}
        {fragrance.mood && (
          <div className="py-2">
            <p className="text-[11px] font-medium text-[#4f4a52]/40 mb-1">Mood</p>
            <p className="text-xs text-[#4f4a52]/70 italic">{fragrance.mood}</p>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Action panel types ────────────────────────────────────────────────────────

type ActiveAction = "approve" | "reject" | "defer" | null;
type ActionFeedback =
  | { kind: "success"; message: string }
  | { kind: "error";   message: string }
  | { kind: "stale";   message: string };

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  unitState:  RelationshipUnitCurrentState;
  fragranceA: FragranceKnowledge | null;
  fragranceB: FragranceKnowledge | null;
  reviewId:   string;
}

export default function RelationshipReviewDetail({ unitState, fragranceA, fragranceB, reviewId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { unit, governanceState, status, latestEntry } = unitState;

  // Stale-write protection: the governance state at page load time is the token.
  // Passed with every action submission so the service can detect concurrent changes.
  const expectedGovernanceState = governanceState;

  const [isStale,      setIsStale]      = useState(false);
  const [activeAction, setActiveAction] = useState<ActiveAction>(null);
  const [feedback,     setFeedback]     = useState<ActionFeedback | null>(null);
  const [actor,        setActor]        = useState("");
  const [reason,       setReason]       = useState("");
  const [founderNotes, setFounderNotes] = useState("");

  // Action eligibility
  const canAct = unit.requiresFounderDecision &&
    (governanceState === "PENDING" || governanceState === "DEFERRED");
  const canDefer   = canAct && governanceState === "PENDING";
  const isBlocked  = !unit.requiresFounderDecision;
  const isTerminal = governanceState === "FOUNDER_APPROVED" || governanceState === "FOUNDER_REJECTED";

  function handleResult(result: RelationshipEditorialResult) {
    if (result.success) {
      setFeedback({ kind: "success", message: "Decision recorded." });
      setActiveAction(null);
      setActor("");
      setReason("");
      setFounderNotes("");
      router.refresh();
    } else if (result.kind === "stale-review") {
      setIsStale(true);
      setFeedback({ kind: "stale", message: result.message });
    } else {
      setFeedback({ kind: "error", message: result.message });
    }
  }

  function openAction(action: ActiveAction) {
    setActiveAction(action);
    setFeedback(null);
  }

  function submitApprove() {
    if (!actor.trim())  { setFeedback({ kind: "error", message: "Actor is required." }); return; }
    if (!reason.trim()) { setFeedback({ kind: "error", message: "Reason is required for approval." }); return; }
    startTransition(async () => {
      const result = await approveRelationshipAction({
        reviewId,
        actor:                  actor.trim(),
        reason:                 reason.trim(),
        founderNotes:           founderNotes.trim() || undefined,
        expectedGovernanceState,
      });
      handleResult(result);
    });
  }

  function submitReject() {
    if (!actor.trim())  { setFeedback({ kind: "error", message: "Actor is required." }); return; }
    if (!reason.trim()) { setFeedback({ kind: "error", message: "Reason is required for rejection." }); return; }
    startTransition(async () => {
      const result = await rejectRelationshipAction({
        reviewId,
        actor:                  actor.trim(),
        reason:                 reason.trim(),
        founderNotes:           founderNotes.trim() || undefined,
        expectedGovernanceState,
      });
      handleResult(result);
    });
  }

  function submitDefer() {
    if (!actor.trim())  { setFeedback({ kind: "error", message: "Actor is required." }); return; }
    if (!reason.trim()) { setFeedback({ kind: "error", message: "Reason is required for deferral." }); return; }
    startTransition(async () => {
      const result = await deferRelationshipAction({
        reviewId,
        actor:                  actor.trim(),
        reason:                 reason.trim(),
        founderNotes:           founderNotes.trim() || undefined,
        expectedGovernanceState,
      });
      handleResult(result);
    });
  }

  function ActorField() {
    return (
      <div>
        <FormLabel required>Actor (audit label)</FormLabel>
        <input
          type="text"
          value={actor}
          onChange={(e) => setActor(e.target.value)}
          placeholder="e.g. founder, your initials, or session label"
          className={inputClass}
          disabled={isPending}
        />
      </div>
    );
  }

  function ReasonField({ placeholder }: { placeholder: string }) {
    return (
      <div>
        <FormLabel required>Reason</FormLabel>
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

  function NotesField() {
    return (
      <div>
        <FormLabel>Founder Notes (optional)</FormLabel>
        <textarea
          value={founderNotes}
          onChange={(e) => setFounderNotes(e.target.value)}
          placeholder="Additional context for the audit record..."
          className={textareaClass}
          disabled={isPending}
        />
      </div>
    );
  }

  function ActionButtons({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) {
    return (
      <div className="mt-3 flex items-center gap-3">
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
          onClick={() => setActiveAction(null)}
          disabled={isPending}
          className="rounded-full border border-gray-200 px-5 py-2 text-xs text-[#4f4a52]/60 transition hover:text-[#4f4a52]"
        >
          Cancel
        </button>
      </div>
    );
  }

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
          <Link href="/admin/identity/relationships" className="hover:text-[#d89ca4]">
            Relationship Review Queue
          </Link>
          <span>/</span>
          <span className="font-mono text-[#4f4a52] text-[10px]">{reviewId}</span>
        </nav>
      </div>

      {/* Stale banner */}
      {isStale && (
        <div className="border-b border-amber-200 bg-amber-50 px-6 py-4">
          <div className="mx-auto flex max-w-[1200px] items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-amber-800">
                This unit changed after you opened it.
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

      <main className="mx-auto w-full max-w-[1200px] px-6 py-10">

        {/* Page header */}
        <div className="mb-8 flex items-start justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#d89ca4]">Relationship Review</p>
            <h1 className="mt-1 text-xl font-black text-[#4f4a52]">
              {unit.pairType === "alternatives"    ? "Alternative Pair" :
               unit.pairType === "wardrobePartners" ? "Wardrobe Partner Pair" :
               "Evolution Pair"}
            </h1>
            <p className="mt-0.5 font-mono text-[11px] text-[#4f4a52]/40">{unit.reviewId}</p>
          </div>
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${GOV_COLOURS[governanceState]}`}>
            {GOV_LABELS[governanceState]}
          </span>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Left — fragrance context + evidence */}
          <div className="space-y-8 lg:col-span-2">

            {/* Fragrance A */}
            <FragrancePanel label="Fragrance A" slug={unit.slugA} fragrance={fragranceA} />

            {/* Fragrance B */}
            <FragrancePanel label="Fragrance B" slug={unit.slugB} fragrance={fragranceB} />

            {/* Evidence */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <SectionHeader label="Relationship Evidence" />
              <div className="mb-3 rounded-xl bg-amber-50 px-4 py-3 ring-1 ring-amber-200">
                <p className="text-[11px] font-semibold text-amber-800">
                  Repository evidence — not editorial truth
                </p>
                <p className="mt-0.5 text-[10px] text-amber-700">
                  Overlap score reflects catalogue metadata similarity only. It does not confirm
                  relationship correctness, editorial value, or founder approval probability.
                </p>
              </div>
              <div className="divide-y divide-gray-50">
                <div className="flex items-center justify-between py-2">
                  <span className="text-[11px] font-medium text-[#4f4a52]/40">Overlap Score</span>
                  <span className="font-mono text-lg font-black text-[#4f4a52]">
                    {unit.auditEvidence.overlapScore}
                  </span>
                </div>
                {unit.auditEvidence.familyOverlap.length > 0 && (
                  <FieldRow
                    label="Family Overlap"
                    value={
                      <div className="flex flex-wrap gap-1">
                        {unit.auditEvidence.familyOverlap.map(f => (
                          <span key={f} className="rounded-full bg-[#4f4a52]/10 px-2 py-0.5 text-[10px]">{f}</span>
                        ))}
                      </div>
                    }
                  />
                )}
                <FieldRow
                  label="Scent Character"
                  value={
                    unit.auditEvidence.scentCharacterMatch
                      ? <span className="text-green-700 font-medium text-xs">Matches</span>
                      : <span className="text-red-600 text-xs">Differs</span>
                  }
                />
                <FieldRow
                  label="Gender"
                  value={
                    unit.auditEvidence.genderMatch
                      ? <span className="text-green-700 font-medium text-xs">Matches</span>
                      : <span className="text-red-600 text-xs">Differs</span>
                  }
                />
                <FieldRow
                  label="Collection"
                  value={
                    unit.auditEvidence.collectionMatch
                      ? <span className="text-green-700 font-medium text-xs">Same collection</span>
                      : <span className="text-[#4f4a52]/40 text-xs">Different collections</span>
                  }
                />
                {unit.auditEvidence.topNoteOverlap.length > 0 && (
                  <FieldRow
                    label="Top Note Overlap"
                    value={unit.auditEvidence.topNoteOverlap.join(", ")}
                  />
                )}
                {unit.auditEvidence.baseNoteOverlap.length > 0 && (
                  <FieldRow
                    label="Base Note Overlap"
                    value={unit.auditEvidence.baseNoteOverlap.join(", ")}
                  />
                )}
              </div>

              {/* Evidence limitations */}
              {unit.evidenceLimitations.length > 0 && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-[10px] font-semibold uppercase tracking-wider text-[#4f4a52]/40 hover:text-[#4f4a52]">
                    Evidence Limitations ({unit.evidenceLimitations.length})
                  </summary>
                  <ul className="mt-2 space-y-1">
                    {unit.evidenceLimitations.map((l, i) => (
                      <li key={i} className="text-xs text-[#4f4a52]/50 font-mono">{l}</li>
                    ))}
                  </ul>
                </details>
              )}

              {/* Blocking reason */}
              {unit.blockingReason && (
                <div className="mt-4 rounded-xl bg-gray-50 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#4f4a52]/40 mb-1">
                    Blocking Reason
                  </p>
                  <p className="text-xs text-[#4f4a52]/70">{unit.blockingReason}</p>
                </div>
              )}
            </section>

            {/* Governance metadata */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <SectionHeader label="Governance" />
              <div className="divide-y divide-gray-50">
                <FieldRow label="Canonical State"     value={unit.currentCanonicalState} />
                <FieldRow label="Provenance"          value={unit.proposalProvenance} />
                <FieldRow label="Governance State"    value={GOV_LABELS[governanceState]} />
                <FieldRow label="Status"              value={status} />
                <FieldRow label="Requires Decision"   value={unit.requiresFounderDecision ? "Yes" : "No"} />
                <FieldRow label="Requires Research"   value={unit.requiresExternalResearch ? "Yes" : "No"} />
                <FieldRow label="Created"             value={formatDate(unit.createdAt)} />
              </div>
              {latestEntry && (
                <div className="mt-4 rounded-xl bg-gray-50 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#4f4a52]/40 mb-2">
                    Latest Decision
                  </p>
                  <div className="divide-y divide-gray-100">
                    <FieldRow label="Decision"   value={latestEntry.decision.replace("FOUNDER_", "").replace("_", " ")} />
                    <FieldRow label="Actor"      value={latestEntry.actor} />
                    <FieldRow label="Reason"     value={latestEntry.reason} />
                    {latestEntry.founderNotes && (
                      <FieldRow label="Notes"    value={latestEntry.founderNotes} />
                    )}
                    <FieldRow label="Decided"    value={formatDate(latestEntry.decidedAt)} />
                    <FieldRow label="Transaction" value={latestEntry.transactionId} mono />
                  </div>
                </div>
              )}
            </section>

          </div>{/* /left column */}

          {/* Right — actions */}
          <div className="space-y-6">

            {/* Feedback */}
            {feedback && (
              <div className={`rounded-2xl border p-4 ${
                feedback.kind === "success" ? "border-green-200 bg-green-50" :
                feedback.kind === "stale"   ? "border-amber-200 bg-amber-50" :
                                              "border-red-200 bg-red-50"
              }`}>
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-semibold ${
                    feedback.kind === "success" ? "text-green-800" :
                    feedback.kind === "stale"   ? "text-amber-800" :
                                                  "text-red-800"
                  }`}>
                    {feedback.message}
                  </p>
                  <button onClick={() => setFeedback(null)} className="shrink-0 text-xs text-gray-400 hover:text-gray-600">
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Research blocked */}
            {isBlocked && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6">
                <SectionHeader label="Research Blocked" />
                <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-gray-200">
                  <p className="text-sm font-semibold text-gray-700">No decision available</p>
                  <p className="mt-1 text-xs text-gray-500">
                    This evolution relationship requires external authoritative confirmation
                    before a founder decision can be made. No action is available in this
                    review cycle.
                  </p>
                </div>
              </section>
            )}

            {/* Terminal state */}
            {isTerminal && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6">
                <SectionHeader label="Decision Recorded" />
                <div className={`rounded-xl p-4 ring-1 ${
                  governanceState === "FOUNDER_APPROVED"
                    ? "bg-green-50 ring-green-200"
                    : "bg-red-50 ring-red-200"
                }`}>
                  <p className={`text-sm font-semibold ${
                    governanceState === "FOUNDER_APPROVED" ? "text-green-800" : "text-red-800"
                  }`}>
                    {governanceState === "FOUNDER_APPROVED"
                      ? "Founder confirmed this relationship."
                      : "Founder rejected this relationship."}
                  </p>
                  {governanceState === "FOUNDER_REJECTED" && (
                    <p className="mt-1 text-xs text-red-700">
                      Founder rejection recorded. Canonical relationship removal has not
                      yet been executed. The relationship remains in MKC pending a
                      separately authorised canonical remediation episode.
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* Action panel */}
            {canAct && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6">
                <SectionHeader label="Founder Decision" />

                {isStale && (
                  <p className="mb-4 text-xs text-amber-700">
                    Decisions are disabled until you reload the record.
                  </p>
                )}

                {governanceState === "DEFERRED" && (
                  <div className="mb-4 rounded-xl bg-amber-50 p-3 ring-1 ring-amber-200">
                    <p className="text-xs text-amber-800">
                      This unit was previously deferred. You may now approve or reject it.
                    </p>
                  </div>
                )}

                <div className="space-y-3">

                  {/* APPROVE */}
                  <div>
                    <button
                      onClick={() => openAction(activeAction === "approve" ? null : "approve")}
                      disabled={isPending || isStale}
                      className="w-full rounded-xl bg-green-600 px-4 py-2.5 text-left text-xs font-bold text-white transition hover:bg-green-700 disabled:opacity-40"
                    >
                      Approve Relationship
                    </button>
                    {activeAction === "approve" && (
                      <div className="mt-3 space-y-3 rounded-xl bg-green-50 p-4 ring-1 ring-green-200">
                        <p className="text-[10px] text-green-800 font-semibold">
                          Approve: confirm this relationship is editorially correct and should remain in the catalogue.
                        </p>
                        <ActorField />
                        <ReasonField placeholder="Why should this relationship exist in the catalogue?" />
                        <NotesField />
                        <ActionButtons onSubmit={submitApprove} submitLabel="Confirm Approval" />
                      </div>
                    )}
                  </div>

                  {/* DEFER (only from PENDING) */}
                  {canDefer && (
                    <div>
                      <button
                        onClick={() => openAction(activeAction === "defer" ? null : "defer")}
                        disabled={isPending || isStale}
                        className="w-full rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-left text-xs font-bold text-amber-800 transition hover:bg-amber-100 disabled:opacity-40"
                      >
                        Defer for Later
                      </button>
                      {activeAction === "defer" && (
                        <div className="mt-3 space-y-3 rounded-xl bg-gray-50 p-4">
                          <p className="text-[10px] text-[#4f4a52]/50">
                            Deferred units can be approved or rejected in a later session.
                          </p>
                          <ActorField />
                          <ReasonField placeholder="Why is this pair being deferred?" />
                          <NotesField />
                          <ActionButtons onSubmit={submitDefer} submitLabel="Defer Unit" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* REJECT */}
                  <div className="border-t border-gray-100 pt-3">
                    <button
                      onClick={() => openAction(activeAction === "reject" ? null : "reject")}
                      disabled={isPending || isStale}
                      className="w-full rounded-xl border border-red-300 bg-red-50 px-4 py-2.5 text-left text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-40"
                    >
                      Reject Relationship
                    </button>
                    {activeAction === "reject" && (
                      <div className="mt-3 space-y-3 rounded-xl bg-red-50 p-4 ring-1 ring-red-200">
                        <p className="text-[10px] font-semibold text-red-700">
                          Rejection records that the founder determined this relationship
                          should not exist. Canonical relationship removal has not yet been
                          executed — the pair remains in MKC pending a separately authorised
                          canonical remediation episode.
                        </p>
                        <ActorField />
                        <ReasonField placeholder="Why should this relationship be removed from the catalogue?" />
                        <NotesField />
                        <ActionButtons onSubmit={submitReject} submitLabel="Confirm Rejection" />
                      </div>
                    )}
                  </div>

                </div>
              </section>
            )}

          </div>{/* /right column */}
        </div>
      </main>
    </div>
  );
}
