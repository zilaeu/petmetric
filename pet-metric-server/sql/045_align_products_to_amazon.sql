/* Normalize the published product catalog to one retailer source. */
UPDATE products p
JOIN categories c ON c.id = p.category_id
LEFT JOIN (
  SELECT category_id, MIN(image_url) AS amazon_image_url
  FROM products
  WHERE is_published = TRUE AND image_url LIKE 'https://m.media-amazon.com/%'
  GROUP BY category_id
) source_image ON source_image.category_id = p.category_id
SET
  p.merchant_name = 'Amazon',
  p.merchant_url = CONCAT('https://www.amazon.com/s?k=', REPLACE(TRIM(p.name), ' ', '+')),
  p.image_key = NULL,
  p.image_url = CASE
    WHEN p.image_url LIKE 'https://m.media-amazon.com/%' THEN p.image_url
    ELSE COALESCE(source_image.amazon_image_url, c.image_url)
  END,
  p.alt_text = CONCAT(TRIM(p.name), ' product image on Amazon')
WHERE p.is_published = TRUE;
