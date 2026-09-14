/* Published pages are the public catalog. Remove retired rows so stale
   products cannot reappear through an admin query, cache, or fallback join. */
SET FOREIGN_KEY_CHECKS = 1;

/* Retired editorial pages and their child rows are no longer part of the
   product list or public navigation. */
DELETE FROM comparisons WHERE is_published = FALSE;
DELETE FROM best_picks WHERE is_published = FALSE;
DELETE FROM troubleshooting_guides WHERE is_published = FALSE;
DELETE FROM product_reviews WHERE is_published = FALSE;

/* Product detail tables use ON DELETE CASCADE; deleting the retired catalog
   rows also removes their tags, specs, sources, metrics, and review summaries. */
DELETE FROM products WHERE is_published = FALSE;

