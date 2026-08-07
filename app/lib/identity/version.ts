/**
 * Maison Identity Platform — Version
 *
 * Single authoritative version constant for the Identity Platform.
 * Separate from FACTORY_VERSION — the Identity Platform has its own
 * schema lifecycle, independent of Knowledge Factory contract versions.
 *
 * Update when the IdentityRecord schema or registry contract changes
 * in a way that requires migration of persisted identity data.
 */

export const IDENTITY_PLATFORM_VERSION = "0.1.0";
