SET NAMES utf8mb4;

UPDATE categories SET is_published=FALSE
WHERE slug IN ('smart-pet-doors','pet-health-monitors');

UPDATE products SET is_published=FALSE
WHERE category_id IN (SELECT id FROM categories WHERE slug IN ('smart-pet-doors','pet-health-monitors'));

UPDATE comparisons SET is_published=FALSE
WHERE category_id IN (SELECT id FROM categories WHERE slug IN ('smart-pet-doors','pet-health-monitors'));

UPDATE best_picks SET is_published=FALSE
WHERE category_id IN (SELECT id FROM categories WHERE slug IN ('smart-pet-doors','pet-health-monitors'));

UPDATE guides SET is_published=FALSE
WHERE category_id IN (SELECT id FROM categories WHERE slug IN ('smart-pet-doors','pet-health-monitors'));

UPDATE troubleshooting_guides SET is_published=FALSE
WHERE category_id IN (SELECT id FROM categories WHERE slug IN ('smart-pet-doors','pet-health-monitors'));
