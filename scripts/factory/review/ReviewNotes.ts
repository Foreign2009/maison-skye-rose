/**
 * Knowledge Factory — Review Notes
 *
 * Manages section-specific reviewer notes on a draft.
 * Notes can be resolved after the underlying issue is addressed.
 *
 * Sections: composition | discovery | relationships | education |
 *           intelligence | merchandising | general
 */

import { findRecord, updateRecord } from "./ReviewRegistry";
import { logReviewAction }          from "./ReviewLogger";
import type { ReviewNote }          from "./ReviewState";

function generateNoteId(): string {
  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function addNote(
  slug:     string,
  reviewer: string,
  section:  string,
  noteText: string,
): ReviewNote | null {
  const record = findRecord(slug);
  if (!record) {
    console.error(`[review] No record found for slug: ${slug}`);
    return null;
  }

  const note: ReviewNote = {
    id:        generateNoteId(),
    reviewer,
    timestamp: new Date().toISOString(),
    section,
    note:      noteText,
    resolved:  false,
  };

  updateRecord(slug, { notes: [...record.notes, note] });
  logReviewAction("note_added", slug, reviewer, `[${section}] ${noteText}`);
  console.log(`[review] Note added to ${slug} (${section})  id:${note.id}`);
  return note;
}

export function resolveNote(slug: string, noteId: string, reviewer: string): boolean {
  const record = findRecord(slug);
  if (!record) {
    console.error(`[review] No record found for slug: ${slug}`);
    return false;
  }

  const target = record.notes.find(n => n.id === noteId);
  if (!target) {
    console.error(`[review] Note ${noteId} not found on ${slug}`);
    return false;
  }

  const updatedNotes = record.notes.map(n =>
    n.id === noteId ? { ...n, resolved: true } : n,
  );

  updateRecord(slug, { notes: updatedNotes });
  logReviewAction("note_resolved", slug, reviewer, `noteId:${noteId}`);
  console.log(`[review] Note ${noteId} resolved on ${slug}`);
  return true;
}

export function getNotes(slug: string): ReviewNote[] {
  return findRecord(slug)?.notes ?? [];
}

export function getUnresolvedNotes(slug: string): ReviewNote[] {
  return getNotes(slug).filter(n => !n.resolved);
}

export function printNotes(slug: string): void {
  const notes = getNotes(slug);
  if (notes.length === 0) {
    console.log(`[review] No notes on ${slug}`);
    return;
  }

  const DIV = "─".repeat(56);
  console.log(`\n  Notes — ${slug}`);
  console.log(DIV);
  for (const n of notes) {
    const resolved = n.resolved ? "  [resolved]" : "";
    console.log(`  ${n.id}${resolved}`);
    console.log(`  Reviewer: ${n.reviewer}  Section: ${n.section}  ${n.timestamp.slice(0, 10)}`);
    console.log(`  ${n.note}`);
    console.log();
  }
}
