-- Use the leading published product image as the category cover so the
-- category label and the visual always describe the same product family.
UPDATE categories c
SET image_url = (
  SELECT p.image_url
  FROM products p
  WHERE p.category_id = c.id
    AND p.is_published = TRUE
    AND p.image_url IS NOT NULL
  ORDER BY p.rank_order, p.id
  LIMIT 1
),
image_key = NULL
WHERE c.is_published = TRUE;
