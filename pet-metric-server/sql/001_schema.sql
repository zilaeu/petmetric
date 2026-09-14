SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE IF NOT EXISTS categories (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(100) NOT NULL,
  title VARCHAR(160) NOT NULL,
  eyebrow VARCHAR(160) NOT NULL,
  description TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  product_count INT UNSIGNED NOT NULL DEFAULT 0,
  comparison_count VARCHAR(20) NOT NULL DEFAULT '0',
  price_range VARCHAR(50) NULL,
  top_pick VARCHAR(160) NULL,
  top_score DECIMAL(2,1) NULL,
  image_url VARCHAR(1000) NULL,
  image_key VARCHAR(255) NULL,
  alt_text VARCHAR(255) NULL,
  updated_label VARCHAR(50) NOT NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_slug (slug),
  KEY idx_categories_published_sort (is_published, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS category_criteria (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  category_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(160) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(20) NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_category_criteria_category_sort (category_id, sort_order),
  CONSTRAINT fk_category_criteria_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS products (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  external_id VARCHAR(50) NULL,
  category_id BIGINT UNSIGNED NOT NULL,
  slug VARCHAR(140) NOT NULL,
  name VARCHAR(180) NOT NULL,
  brand VARCHAR(120) NOT NULL,
  price DECIMAL(10,2) NULL,
  price_display VARCHAR(80) NULL,
  subscription VARCHAR(160) NULL,
  score DECIMAL(2,1) NULL,
  verdict TEXT NOT NULL,
  best_for TEXT NOT NULL,
  image_url VARCHAR(1000) NULL,
  image_key VARCHAR(255) NULL,
  alt_text VARCHAR(255) NULL,
  merchant_name VARCHAR(120) NULL,
  merchant_url VARCHAR(1000) NULL,
  updated_label VARCHAR(50) NOT NULL,
  rank_order INT UNSIGNED NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_products_slug (slug),
  KEY idx_products_category_published_rank (category_id, is_published, rank_order),
  KEY idx_products_price (price),
  KEY idx_products_score (score),
  FULLTEXT KEY ft_products_search (name, brand, verdict, best_for),
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS product_tags (
  product_id BIGINT UNSIGNED NOT NULL,
  tag VARCHAR(100) NOT NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id, tag),
  CONSTRAINT fk_product_tags_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS product_specs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  spec_key VARCHAR(100) NULL,
  label VARCHAR(120) NULL,
  value VARCHAR(255) NOT NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_product_specs_product_sort (product_id, sort_order),
  KEY idx_product_specs_filter (spec_key, value),
  CONSTRAINT fk_product_specs_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS product_reviews (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  summary TEXT NULL,
  gallery_json JSON NULL,
  quick_specs_json JSON NULL,
  strengths_json JSON NULL,
  limitations_json JSON NULL,
  sections_json JSON NULL,
  research_date DATE NULL,
  price_checked_date DATE NULL,
  next_review_label VARCHAR(80) NULL,
  source_count INT UNSIGNED NULL,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (id),
  UNIQUE KEY uq_product_reviews_product (product_id),
  CONSTRAINT fk_product_reviews_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS comparisons (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(180) NOT NULL,
  category_id BIGINT UNSIGNED NOT NULL,
  product_a_id BIGINT UNSIGNED NULL,
  product_b_id BIGINT UNSIGNED NULL,
  product_a_name VARCHAR(180) NOT NULL,
  product_b_name VARCHAR(180) NOT NULL,
  verdict TEXT NOT NULL,
  home_verdict TEXT NULL,
  views_count INT UNSIGNED NOT NULL DEFAULT 0,
  read_time VARCHAR(50) NULL,
  updated_label VARCHAR(50) NOT NULL,
  content_json JSON NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_comparisons_slug (slug),
  KEY idx_comparisons_category_published_sort (category_id, is_published, sort_order),
  KEY idx_comparisons_popular (views_count),
  CONSTRAINT fk_comparisons_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  CONSTRAINT fk_comparisons_product_a FOREIGN KEY (product_a_id) REFERENCES products(id) ON DELETE SET NULL,
  CONSTRAINT fk_comparisons_product_b FOREIGN KEY (product_b_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS comparison_best_for (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  comparison_id BIGINT UNSIGNED NOT NULL,
  pick_name VARCHAR(180) NOT NULL,
  audience TEXT NOT NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_comparison_best_for_sort (comparison_id, sort_order),
  CONSTRAINT fk_comparison_best_for_comparison FOREIGN KEY (comparison_id) REFERENCES comparisons(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS comparison_criteria (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  comparison_id BIGINT UNSIGNED NOT NULL,
  label VARCHAR(180) NOT NULL,
  product_a_value VARCHAR(255) NOT NULL,
  product_b_value VARCHAR(255) NOT NULL,
  winner ENUM('a', 'b', 'tie') NOT NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_comparison_criteria_sort (comparison_id, sort_order),
  CONSTRAINT fk_comparison_criteria_comparison FOREIGN KEY (comparison_id) REFERENCES comparisons(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS best_picks (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(180) NOT NULL,
  category_id BIGINT UNSIGNED NOT NULL,
  category_label VARCHAR(120) NOT NULL,
  title VARCHAR(255) NOT NULL,
  pick_product_id BIGINT UNSIGNED NULL,
  pick_name VARCHAR(180) NOT NULL,
  budget VARCHAR(160) NOT NULL,
  tradeoff TEXT NOT NULL,
  image_url VARCHAR(1000) NULL,
  image_key VARCHAR(255) NULL,
  content_json JSON NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_best_picks_slug (slug),
  KEY idx_best_picks_category_published_sort (category_id, is_published, sort_order),
  CONSTRAINT fk_best_picks_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  CONSTRAINT fk_best_picks_product FOREIGN KEY (pick_product_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS guides (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(180) NOT NULL,
  category_id BIGINT UNSIGNED NOT NULL,
  category_label VARCHAR(120) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  read_time VARCHAR(50) NOT NULL,
  updated_label VARCHAR(50) NOT NULL,
  image_url VARCHAR(1000) NULL,
  image_key VARCHAR(255) NULL,
  content_json JSON NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_guides_slug (slug),
  KEY idx_guides_category_published_sort (category_id, is_published, sort_order),
  FULLTEXT KEY ft_guides_search (title, description),
  CONSTRAINT fk_guides_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS troubleshooting_guides (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(180) NOT NULL,
  category_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NULL,
  product_name VARCHAR(180) NOT NULL,
  problem VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  difficulty VARCHAR(50) NOT NULL,
  estimated_time VARCHAR(50) NOT NULL,
  views_count INT UNSIGNED NOT NULL DEFAULT 0,
  updated_label VARCHAR(50) NOT NULL,
  content_json JSON NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_troubleshooting_slug (slug),
  KEY idx_troubleshooting_category_published_sort (category_id, is_published, sort_order),
  FULLTEXT KEY ft_troubleshooting_search (product_name, problem, title, description),
  CONSTRAINT fk_troubleshooting_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  CONSTRAINT fk_troubleshooting_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS troubleshooting_steps (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  guide_id BIGINT UNSIGNED NOT NULL,
  instruction TEXT NOT NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_troubleshooting_steps_sort (guide_id, sort_order),
  CONSTRAINT fk_troubleshooting_steps_guide FOREIGN KEY (guide_id) REFERENCES troubleshooting_guides(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS content_pages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(120) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  content_json JSON NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_content_pages_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS site_settings (
  setting_key VARCHAR(120) NOT NULL,
  setting_value JSON NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
