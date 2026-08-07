/**
 * Knowledge Factory — Slug Derivation (re-export)
 *
 * The canonical implementation now lives in app/lib/mkc/deriveSlug.ts so that
 * both the factory pipeline and app/lib/mkc validators resolve from one source.
 *
 * All existing factory imports (intake, scaffold, DashboardService, BatchQueue,
 * LifecycleScanner, index) continue to work unchanged through this re-export.
 *
 * Algorithm: lowercase + collapse whitespace to hyphens.
 * Do not change without verifying all derived slugs remain identical.
 */

export { deriveSlug } from "../../../app/lib/mkc/deriveSlug";
