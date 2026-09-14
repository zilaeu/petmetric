SET NAMES utf8mb4;

UPDATE products SET merchant_name='Amazon'
WHERE category_id IN (SELECT id FROM categories WHERE slug IN ('pet-grooming-tools','pet-waste-cleanup','pet-walking-safety'))
  AND merchant_url LIKE 'https://www.amazon.com/%';

UPDATE product_reviews r JOIN products p ON p.id=r.product_id
SET r.source_count=1
WHERE p.category_id IN (SELECT id FROM categories WHERE slug IN ('pet-grooming-tools','pet-waste-cleanup','pet-walking-safety'));

UPDATE site_settings
SET setting_value=JSON_SET(setting_value,'$.description','We research cat and dog products across feeding, hydration, litter, grooming, waste cleanup, walking safety, tracking, and monitoring with dated sources and clear commercial disclosures.')
WHERE setting_key='home';
