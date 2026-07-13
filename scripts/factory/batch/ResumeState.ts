/**
 * Knowledge Factory — Resume State
 *
 * Persists interrupted batch progress to .resume-state.json.
 * Enables --resume to skip records already completed in a previous run.
 *
 * The file is written after each record completes and cleared when the
 * batch finishes with no failures. Interrupted runs leave the file in
 * place so the next --resume run can skip completed work.
 */

import { existsSync, readFileSync, writeFileSync, unlinkSync } from "fs";
import path from "path";

export interface ResumeStateData {
  batchId:   string;
  startedAt: string;
  total:     number;
  completed: string[];   // slugs that generated successfully
  failed:    string[];   // slugs that failed (candidates for retry)
}

const STATE_PATH = path.join(
  process.cwd(), "scripts", "factory", "batch", ".resume-state.json"
);

export function saveResumeState(state: ResumeStateData): void {
  try {
    writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + "\n", "utf-8");
  } catch {
    // Non-terminal: resume state is best-effort
  }
}

export function loadResumeState(): ResumeStateData | null {
  if (!existsSync(STATE_PATH)) return null;
  try {
    return JSON.parse(readFileSync(STATE_PATH, "utf-8")) as ResumeStateData;
  } catch {
    return null;
  }
}

export function updateResumeState(slug: string, success: boolean): void {
  const state = loadResumeState();
  if (!state) return;

  if (success) {
    if (!state.completed.includes(slug)) state.completed.push(slug);
    state.failed = state.failed.filter(s => s !== slug);
  } else {
    if (!state.failed.includes(slug)) state.failed.push(slug);
  }

  saveResumeState(state);
}

export function clearResumeState(): void {
  if (existsSync(STATE_PATH)) {
    try { unlinkSync(STATE_PATH); } catch { /* ignore */ }
  }
}
