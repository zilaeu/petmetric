-- Rich content mirror used by the Cloudflare API. Payloads are generated from
-- the reviewed MySQL catalogue and kept as JSON so nested editorial evidence
-- remains lossless in D1.
ALTER TABLE products ADD COLUMN payload_json TEXT;
CREATE TABLE IF NOT EXISTS research_content (
  slug TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_research_content_type ON research_content(type);
