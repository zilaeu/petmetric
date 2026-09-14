/* Remove unsupported editorial badges and normalize the date label. */
UPDATE products
SET is_featured=FALSE,
    updated_label='Sep 5, 2026'
WHERE external_id REGEXP '^B[A-Z0-9]{9}$'
  AND merchant_url LIKE 'https://www.amazon.com/dp/%';
