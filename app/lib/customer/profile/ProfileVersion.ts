/**
 * Customer Intelligence — Profile Version
 *
 * Numeric literal type allows exhaustive narrowing in future migration
 * handlers without string coercion risk.
 */

export type ProfileVersion = 1;

export const CURRENT_PROFILE_VERSION: ProfileVersion = 1;
