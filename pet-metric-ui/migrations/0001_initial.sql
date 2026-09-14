CREATE TABLE IF NOT EXISTS categories (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  product_count INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  category_slug TEXT NOT NULL,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  price_cents INTEGER,
  subscription TEXT,
  score REAL,
  verdict TEXT NOT NULL,
  best_for TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (category_slug) REFERENCES categories(slug)
);

CREATE TABLE IF NOT EXISTS research_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  read_time TEXT NOT NULL,
  checked_at TEXT NOT NULL,
  image_key TEXT,
  accent TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS correction_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  url TEXT,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  status TEXT NOT NULL DEFAULT 'new'
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_slug);
CREATE INDEX IF NOT EXISTS idx_research_type ON research_items(type);

INSERT OR IGNORE INTO categories (slug, name, description, icon, product_count, updated_at) VALUES
('automatic-litter-boxes', 'Automatic litter boxes', 'Safety, cleaning, odor control and the real cost of multi-cat ownership.', 'litter', 12, 'Sep 3, 2026'),
('smart-pet-feeders', 'Smart pet feeders', 'Portion accuracy, jam resistance, schedules and dependable backup power.', 'feeder', 8, 'Sep 2, 2026'),
('gps-pet-trackers', 'GPS pet trackers', 'Live location, escape alerts, battery life and subscription tradeoffs.', 'tracker', 9, 'Sep 2, 2026'),
('pet-cameras', 'Pet cameras', 'Useful alerts, clear two-way audio and privacy without surprise fees.', 'camera', 7, 'Aug 29, 2026');

INSERT OR IGNORE INTO research_items (slug, title, excerpt, type, category, read_time, checked_at, accent) VALUES
('litter-robot-5-vs-petkit-purobot-ultra', 'Litter-Robot 5 vs. PETKIT Purobot Ultra', 'Two premium litter boxes, compared on safety, cleanup, app reliability and long-term cost.', 'Comparison', 'Automatic litter boxes', '11 min read', 'Sep 3, 2026', 'orange'),
('best-gps-trackers-for-escape-prone-dogs', 'Best GPS trackers for escape-prone dogs', 'Fast alerts matter more than a long feature list. These are the models we would shortlist.', 'Best pick', 'GPS trackers', '9 min read', 'Sep 2, 2026', 'green'),
('petlibro-feeder-not-dispensing', 'PETLIBRO feeder not dispensing? Start here', 'A safe, ordered checklist for common jams, schedule issues and power problems.', 'Troubleshooting', 'Smart feeders', '6 min read', 'Aug 31, 2026', 'blue');

INSERT OR IGNORE INTO products (slug, category_slug, name, brand, price_cents, subscription, score, verdict, best_for, updated_at) VALUES
('litter-robot-4', 'automatic-litter-boxes', 'Litter-Robot 4', 'Whisker', 69900, 'Optional $12.49/mo', 4.3, 'The most reliable automatic litter box we have researched, with strong app-based health monitoring.', 'Multi-cat households (2–4 cats)', 'Aug 2026'),
('petkit-pura-max', 'automatic-litter-boxes', 'PETKIT PURA MAX', 'PETKIT', 39900, 'None required', 3.9, 'A solid mid-range option with competitive features at nearly half the Litter-Robot price.', 'Budget-conscious single-cat owners', 'Aug 2026'),
('petsafe-scoopfree-ultra', 'automatic-litter-boxes', 'PetSafe ScoopFree Ultra', 'PetSafe', 17900, '$28–35/mo crystal trays', 3.6, 'Best entry price; crystal trays mean strong odor control but higher monthly costs.', 'Single-cat owners preferring crystal litter', 'Jul 2026'),
('tractive-gps', 'gps-pet-trackers', 'Tractive GPS', 'Tractive', 4999, '$12.99/mo', 4.1, 'The easier fit for owners who want frequent live updates and international coverage.', 'Traveling dog owners', 'Aug 2026'),
('fi-series-3', 'gps-pet-trackers', 'Fi Series 3', 'Fi', 14900, '$8.25/mo', 4.0, 'A strong US-only option when battery life and a lighter collar matter more.', 'US-based owners with escape-prone dogs', 'Aug 2026');
