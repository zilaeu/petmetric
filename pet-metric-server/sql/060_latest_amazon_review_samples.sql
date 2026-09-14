/*
  Review-level snapshots used to build comparison-page owner summaries.

  Summaries marked `latest_desc` must be generated only from review rows
  ordered by reviewed_at descending, capped at 50 per product. When Amazon
  exposes fewer than 50 reviews, every available review is used.
*/
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS product_user_reviews (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  source_name VARCHAR(100) NOT NULL DEFAULT 'Amazon.com',
  source_review_id VARCHAR(100) NOT NULL,
  source_url VARCHAR(500) NOT NULL,
  rating DECIMAL(2,1) NULL,
  title TEXT NULL,
  body MEDIUMTEXT NOT NULL,
  reviewed_at DATE NULL,
  variant VARCHAR(500) NULL,
  verified_purchase BOOLEAN NOT NULL DEFAULT FALSE,
  captured_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_product_source_review (product_id, source_review_id),
  KEY idx_product_reviewed_at (product_id, reviewed_at, id),
  CONSTRAINT fk_user_review_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE product_user_review_summaries
  ADD COLUMN sample_method VARCHAR(50) NULL AFTER visible_review_count,
  ADD COLUMN sample_target_count INT UNSIGNED NULL AFTER sample_method,
  ADD COLUMN sample_newest_review_at DATE NULL AFTER sample_target_count,
  ADD COLUMN sample_oldest_review_at DATE NULL AFTER sample_newest_review_at,
  ADD COLUMN generated_at TIMESTAMP NULL AFTER sample_oldest_review_at;

