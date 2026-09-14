SET NAMES utf8mb4;

UPDATE product_specs ps
JOIN products p ON p.id=ps.product_id
SET ps.value='Up to 10 cats'
WHERE p.external_id='B0GTM9P94B' AND ps.spec_key='cat_count';

UPDATE product_specs ps
JOIN products p ON p.id=ps.product_id
SET ps.value='Up to 4 cats'
WHERE p.external_id='B0BH6MD3DJ' AND ps.spec_key='cat_count';
