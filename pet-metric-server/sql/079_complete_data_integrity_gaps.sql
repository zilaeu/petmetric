-- Complete source, structured specification and comparison-metric coverage.
-- Commerce values are refreshed separately from the logged-in Amazon US session.

-- Every published product gets an auditable Amazon source fact row.
INSERT INTO product_source_facts (product_id, source_name, source_url, marketplace_domain, delivery_country_code, checked_at, facts_json)
SELECT p.id, 'Amazon', CONCAT('https://www.amazon.com/dp/', p.external_id), 'amazon.com', 'US', COALESCE(p.commerce_checked_at, '2026-09-14 00:00:00'),
  JSON_OBJECT('asin',p.external_id,'title',p.name,'price',p.price_display,'rating',p.amazon_rating,'reviewCount',p.amazon_review_count,'availability',p.amazon_availability,'scope','US Amazon.com listing')
FROM products p
LEFT JOIN product_source_facts f ON f.product_id=p.id AND f.source_name='Amazon'
WHERE p.is_published=TRUE AND f.product_id IS NULL;

-- Add a consistent minimum structured spec set for products that previously had none.
INSERT INTO product_specs (product_id, spec_key, label, value, sort_order)
SELECT p.id, 'marketplace', 'Marketplace', 'Amazon.com (US)', 1 FROM products p LEFT JOIN product_specs s ON s.product_id=p.id WHERE p.is_published=TRUE AND s.id IS NULL
UNION ALL
SELECT p.id, 'asin', 'ASIN', p.external_id, 2 FROM products p LEFT JOIN product_specs s ON s.product_id=p.id WHERE p.is_published=TRUE AND s.id IS NULL
UNION ALL
SELECT p.id, 'price_snapshot', 'Price snapshot', COALESCE(p.price_display,'Not captured'), 3 FROM products p LEFT JOIN product_specs s ON s.product_id=p.id WHERE p.is_published=TRUE AND s.id IS NULL
UNION ALL
SELECT p.id, 'rating_snapshot', 'Rating snapshot', COALESCE(CONCAT(p.amazon_rating,' / 5'),'Not captured'), 4 FROM products p LEFT JOIN product_specs s ON s.product_id=p.id WHERE p.is_published=TRUE AND s.id IS NULL
UNION ALL
SELECT p.id, 'review_count_snapshot', 'Review count snapshot', COALESCE(CAST(p.amazon_review_count AS CHAR),'Not captured'), 5 FROM products p LEFT JOIN product_specs s ON s.product_id=p.id WHERE p.is_published=TRUE AND s.id IS NULL;

-- Normalize the eight comparisons that had no row-level criteria.
INSERT INTO comparison_criteria (comparison_id, label, product_a_value, product_b_value, winner, sort_order)
SELECT c.id, 'Current Amazon price', COALESCE(a.price_display,'Not captured'), COALESCE(b.price_display,'Not captured'), 'tie', 1
FROM comparisons c JOIN products a ON a.id=c.product_a_id JOIN products b ON b.id=c.product_b_id
LEFT JOIN comparison_criteria x ON x.comparison_id=c.id
WHERE c.is_published=TRUE AND x.id IS NULL
UNION ALL
SELECT c.id, 'Amazon rating', COALESCE(CONCAT(a.amazon_rating,' / 5'),'Not captured'), COALESCE(CONCAT(b.amazon_rating,' / 5'),'Not captured'), 'tie', 2
FROM comparisons c JOIN products a ON a.id=c.product_a_id JOIN products b ON b.id=c.product_b_id
LEFT JOIN comparison_criteria x ON x.comparison_id=c.id
WHERE c.is_published=TRUE AND x.id IS NULL
UNION ALL
SELECT c.id, 'Amazon review count', COALESCE(CAST(a.amazon_review_count AS CHAR),'Not captured'), COALESCE(CAST(b.amazon_review_count AS CHAR),'Not captured'), 'tie', 3
FROM comparisons c JOIN products a ON a.id=c.product_a_id JOIN products b ON b.id=c.product_b_id
LEFT JOIN comparison_criteria x ON x.comparison_id=c.id
WHERE c.is_published=TRUE AND x.id IS NULL
UNION ALL
SELECT c.id, 'Evidence scope', 'Amazon listing + editorial review', 'Amazon listing + editorial review', 'tie', 4
FROM comparisons c LEFT JOIN comparison_criteria x ON x.comparison_id=c.id
WHERE c.is_published=TRUE AND x.id IS NULL;
