/**
 * Knowledge Factory — Build Verifier
 *
 * Runs `npm run build` after a promotion to confirm the application compiles
 * correctly with the newly added native record.
 *
 * The build must pass before promotion is considered complete.
 * If the build fails, the PromotionManager reverts all writes.
 */

import { execSync } from "child_process";
import path from "path";

const ROOT = process.cwd();

export interface BuildResult {
  success: boolean;
  output:  string;
}

export function verifyBuild(): BuildResult {
  try {
    const output = execSync("npm run build", {
      cwd:      ROOT,
      encoding: "utf-8",
      stdio:    "pipe",
    });
    return { success: true, output: output ?? "" };
  } catch (err: unknown) {
    const output = err instanceof Error && "stdout" in err
      ? String((err as NodeJS.ErrnoException & { stdout?: string }).stdout ?? "")
      : "";
    return { success: false, output };
  }
}
