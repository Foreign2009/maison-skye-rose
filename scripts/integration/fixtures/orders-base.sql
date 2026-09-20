-- ─────────────────────────────────────────────────────────────────────────────
-- LOCAL DEV ONLY — base orders schema for integration testing.
-- DO NOT apply to production.  Production already owns this table.
--
-- SCHEMA ASSUMPTIONS (unverified against production)
-- ────────────────────────────────────────────────────
-- 1. id column type: this fixture uses BIGSERIAL.
--    Earlier production evidence suggests UUID (gen_random_uuid()).
--    All API routes (handleOrder, handleGetConfirmation, PATCH) address rows
--    exclusively by order_ref (TEXT UNIQUE) — the id column is never read or
--    returned by application code.  The type difference does not affect
--    integration-test validity or idempotency behaviour.
--
-- 2. INSERT policy: the production database is assumed to grant INSERT to the
--    anon role (public) via RLS policy, because the production POST handler
--    uses the anon Supabase client for insertOrder calls.  This fixture adds
--    an equivalent policy so the test OrderDb adapter can mirror that path.
--    If production uses a different policy name or condition, update this file
--    and re-run `npx supabase db reset` — no application code change needed.
--
-- 3. Column set: derived from insertOrder (route.ts) + PATCH + GET handlers.
--    Additional columns present in production but not referenced by any API
--    route would not affect test results.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS orders (
  -- id: BIGSERIAL here; production may use UUID. Unused by all API routes.
  id                   BIGSERIAL      PRIMARY KEY,
  order_ref            TEXT           NOT NULL UNIQUE,
  customer_name        TEXT           NOT NULL,
  phone                TEXT           NOT NULL,
  address              TEXT,
  province             TEXT           NOT NULL,
  items                JSONB          NOT NULL DEFAULT '[]',
  subtotal             NUMERIC(10,2)  NOT NULL DEFAULT 0,
  vat                  NUMERIC(10,2)  NOT NULL DEFAULT 0,
  delivery             NUMERIC(10,2)  NOT NULL DEFAULT 0,
  total                NUMERIC(10,2)  NOT NULL DEFAULT 0,
  payment_status       TEXT           NOT NULL DEFAULT 'awaiting_payment',
  status_history       JSONB          NOT NULL DEFAULT '[]',
  discovery_context    JSONB,
  notes                TEXT,
  tracking_number      TEXT,
  payment_confirmed_at TIMESTAMPTZ,
  dispatched_at        TIMESTAMPTZ,
  delivered_at         TIMESTAMPTZ,
  cancelled_at         TIMESTAMPTZ,
  created_at           TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- RLS: enabled with two policies mirroring assumed production behaviour.
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- INSERT: anon role may create orders (assumed production policy).
-- The production POST handler uses the anon Supabase client for inserts.
-- Without this policy, anon-key inserts are blocked by RLS and handleOrder
-- returns a 500 insert error, which is a false negative for integration tests.
-- DO block makes this idempotent: safe to re-run bootstrap on an existing DB.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
     WHERE tablename = 'orders' AND policyname = 'anon_insert_orders'
  ) THEN
    CREATE POLICY "anon_insert_orders"
      ON orders FOR INSERT TO anon
      WITH CHECK (true);
  END IF;
END
$$;

-- SELECT: no public policy — the anon client cannot read orders.
-- All order reads go through the service_role admin client.
-- The RLS denial integration check verifies this: anon SELECT returns zero rows.
