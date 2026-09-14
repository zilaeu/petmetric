SET NAMES utf8mb4;

/*
  The catalog identity refresh in 040 temporarily limited published
  comparisons to four categories. The two verified water-fountain products
  survived the later catalog cleanup, but their comparison was deleted by
  051 after being marked unpublished. Restore that valid product pair.
*/
INSERT INTO comparisons
  (slug,category_id,product_a_id,product_b_id,product_a_name,product_b_name,verdict,home_verdict,views_count,read_time,updated_label,content_json,sort_order,is_featured,is_published)
VALUES
  ('petlibro-dockstream-2-vs-feelneedy-filterless',
   (SELECT id FROM categories WHERE slug='smart-water-fountains'),
   (SELECT id FROM products WHERE slug='petlibro-dockstream-2' AND is_published=TRUE),
   (SELECT id FROM products WHERE slug='feelneedy-filterless-water-fountain' AND is_published=TRUE),
   'PETLIBRO Dockstream 2 Smart Water Fountain',
   'FEELNEEDY Filterless Wastewater-Separation Fountain',
   'PETLIBRO emphasizes app-visible hydration trends and four-layer filtration; FEELNEEDY emphasizes filterless wastewater separation and cordless runtime. Neither listing alone establishes superior long-term hygiene.',
   'Choose PETLIBRO for app-visible hydration trends; choose FEELNEEDY for filterless, cordless operation.',
   0,'9 min read','Sep 2026',
   JSON_OBJECT(
     'matchType','feature-tradeoff',
     'matchLabel','Different approaches',
     'whyCompare','Both target owners who want fresher water with less daily attention, but use opposing filtration and monitoring strategies.',
     'decisionQuestion','Should you prioritize hydration data and filtration, or filterless cordless operation?'
   ),15,FALSE,TRUE)
ON DUPLICATE KEY UPDATE
  category_id=VALUES(category_id),product_a_id=VALUES(product_a_id),product_b_id=VALUES(product_b_id),
  product_a_name=VALUES(product_a_name),product_b_name=VALUES(product_b_name),verdict=VALUES(verdict),
  home_verdict=VALUES(home_verdict),read_time=VALUES(read_time),updated_label=VALUES(updated_label),
  content_json=VALUES(content_json),sort_order=VALUES(sort_order),is_published=TRUE;

DELETE FROM comparison_best_for
WHERE comparison_id=(SELECT id FROM comparisons WHERE slug='petlibro-dockstream-2-vs-feelneedy-filterless');

INSERT INTO comparison_best_for (comparison_id,pick_name,audience,sort_order) VALUES
  ((SELECT id FROM comparisons WHERE slug='petlibro-dockstream-2-vs-feelneedy-filterless'),
   'PETLIBRO Dockstream 2 Smart Water Fountain',
   'Owners who value app-visible drinking history, selectable flow modes, and a filtered water path.',1),
  ((SELECT id FROM comparisons WHERE slug='petlibro-dockstream-2-vs-feelneedy-filterless'),
   'FEELNEEDY Filterless Wastewater-Separation Fountain',
   'Owners who prioritize cordless placement, no replacement filters, and separate clean and wastewater tanks.',2);
