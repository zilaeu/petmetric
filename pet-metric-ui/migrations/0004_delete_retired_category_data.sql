DELETE FROM products WHERE category_slug IN ('smart-pet-doors','pet-health-monitors');
DELETE FROM research_items WHERE category IN ('Smart Pet Doors','Pet Health Monitors');
DELETE FROM categories WHERE slug IN ('smart-pet-doors','pet-health-monitors');
