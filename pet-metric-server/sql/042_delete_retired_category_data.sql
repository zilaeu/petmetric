SET NAMES utf8mb4;

/* Permanent removal: these categories and every dependent record are no
   longer part of the catalog. Delete children first to satisfy foreign keys. */
DELETE t FROM troubleshooting_steps t JOIN troubleshooting_guides g ON g.id=t.guide_id JOIN categories c ON c.id=g.category_id WHERE c.slug IN ('smart-pet-doors','pet-health-monitors');
DELETE t FROM product_tags t JOIN products p ON p.id=t.product_id JOIN categories c ON c.id=p.category_id WHERE c.slug IN ('smart-pet-doors','pet-health-monitors');
DELETE s FROM product_specs s JOIN products p ON p.id=s.product_id JOIN categories c ON c.id=p.category_id WHERE c.slug IN ('smart-pet-doors','pet-health-monitors');
DELETE r FROM product_reviews r JOIN products p ON p.id=r.product_id JOIN categories c ON c.id=p.category_id WHERE c.slug IN ('smart-pet-doors','pet-health-monitors');
DELETE b FROM comparison_best_for b JOIN comparisons x ON x.id=b.comparison_id JOIN categories c ON c.id=x.category_id WHERE c.slug IN ('smart-pet-doors','pet-health-monitors');
DELETE cr FROM comparison_criteria cr JOIN comparisons x ON x.id=cr.comparison_id JOIN categories c ON c.id=x.category_id WHERE c.slug IN ('smart-pet-doors','pet-health-monitors');
DELETE t FROM troubleshooting_guides t JOIN categories c ON c.id=t.category_id WHERE c.slug IN ('smart-pet-doors','pet-health-monitors');
DELETE g FROM guides g JOIN categories c ON c.id=g.category_id WHERE c.slug IN ('smart-pet-doors','pet-health-monitors');
DELETE b FROM best_picks b JOIN categories c ON c.id=b.category_id WHERE c.slug IN ('smart-pet-doors','pet-health-monitors');
DELETE x FROM comparisons x JOIN categories c ON c.id=x.category_id WHERE c.slug IN ('smart-pet-doors','pet-health-monitors');
DELETE p FROM products p JOIN categories c ON c.id=p.category_id WHERE c.slug IN ('smart-pet-doors','pet-health-monitors');
DELETE cc FROM category_criteria cc JOIN categories c ON c.id=cc.category_id WHERE c.slug IN ('smart-pet-doors','pet-health-monitors');
DELETE m FROM comparison_metric_definitions m JOIN categories c ON c.id=m.category_id WHERE c.slug IN ('smart-pet-doors','pet-health-monitors');
DELETE FROM categories WHERE slug IN ('smart-pet-doors','pet-health-monitors');
