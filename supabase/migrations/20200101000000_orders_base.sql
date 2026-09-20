-- LOCAL DEV ONLY — base orders schema for integration testing.
-- Production already has this table. This migration makes the local stack
-- usable for integration tests without pulling the full remote schema.
-- DO NOT apply to production.

CREATE TABLE IF NOT EXISTS orders (
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

-- RLS: no public reads. All order access goes through the service_role
-- admin client. Anonymous clients receive no rows.
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
