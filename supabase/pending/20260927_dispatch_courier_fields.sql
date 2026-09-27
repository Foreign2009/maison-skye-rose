-- DISPATCH-P12: Courier name and tracking URL columns
-- ─────────────────────────────────────────────────────
-- Migration: 20260927_dispatch_courier_fields
-- Branch:    refinement/storefront-p1
--
-- DO NOT apply to production without founder authorisation.
--
-- Purpose
-- ───────
-- Stores the courier name and an optional tracking URL alongside the existing
-- tracking_number so the full dispatch notification message can be regenerated
-- from saved order data after a page refresh.
--
-- Both columns are nullable. Orders created before this migration have NULL in
-- both columns. The admin dispatch workflow requires both courier_name and
-- tracking_number when marking an order as Dispatched; tracking_url is optional
-- and must be a valid https:// URL when supplied.
--
-- Rollback
-- ────────
-- This is a DESTRUCTIVE operation requiring explicit founder authorisation.
--
--   ALTER TABLE orders
--     DROP COLUMN IF EXISTS courier_name,
--     DROP COLUMN IF EXISTS tracking_url;

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS courier_name TEXT,
  ADD COLUMN IF NOT EXISTS tracking_url TEXT;
