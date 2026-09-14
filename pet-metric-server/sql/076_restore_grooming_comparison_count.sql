SET NAMES utf8mb4;

INSERT INTO comparisons (slug,category_id,product_a_id,product_b_id,product_a_name,product_b_name,verdict,read_time,updated_label,content_json,sort_order,is_featured,is_published)
VALUES ('oneisall-vs-furminator-grooming',(SELECT id FROM categories WHERE slug='pet-grooming-tools'),(SELECT id FROM products WHERE slug='oneisall-quiet-dog-clippers'),(SELECT id FROM products WHERE slug='furminator-undercoat-deshedding-tool'),'Oneisall Low Noise Dog Clippers Grooming Kit','FURminator Undercoat deShedding Tool for Large Dogs','These are often confused because both are marketed for grooming, but a clipper changes coat length while a de-shedding tool removes loose undercoat. They are not direct substitutes.','7 min read','Sep 2026',JSON_OBJECT('decisionQuestion','Are you solving coat-length control or loose-hair reduction?','scope','The checked variants are Oneisall B01HRSZRXM and FURminator B07MZDTG76.','controversy','Neither tool safely resolves every mat or every coat; pressure, skin visibility, pet tolerance, and the actual job decide the outcome.','decisionRule','Choose Oneisall for supervised trimming; choose FURminator for the documented large-dog, long-hair undercoat workflow.','evidenceNote','Listing facts are linked to the checked Amazon.com product pages.'),46,FALSE,TRUE)
ON DUPLICATE KEY UPDATE product_a_id=VALUES(product_a_id),product_b_id=VALUES(product_b_id),product_a_name=VALUES(product_a_name),product_b_name=VALUES(product_b_name),verdict=VALUES(verdict),content_json=VALUES(content_json),is_published=TRUE;

INSERT INTO comparison_best_for (comparison_id,pick_name,audience,sort_order)
SELECT c.id,v.pick_name,v.audience,v.sort_order FROM comparisons c JOIN (
  SELECT 'Oneisall Low Noise Dog Clippers Grooming Kit' pick_name,'Owners who need supervised coat-length control.' audience,1 sort_order UNION ALL
  SELECT 'FURminator Undercoat deShedding Tool for Large Dogs','Owners with a large, long-haired dog and loose-undercoat shedding.',2
) v WHERE c.slug='oneisall-vs-furminator-grooming'
AND NOT EXISTS (SELECT 1 FROM comparison_best_for x WHERE x.comparison_id=c.id AND x.pick_name=v.pick_name);

INSERT INTO comparison_criteria (comparison_id,label,product_a_value,product_b_value,winner,sort_order)
SELECT c.id,v.label,v.a_value,v.b_value,v.winner,v.sort_order FROM comparisons c JOIN (
  SELECT 'Primary job' label,'Trim coat length' a_value,'Reduce loose undercoat' b_value,'tie' winner,1 sort_order UNION ALL
  SELECT 'Fit boundary','Routine trims on a brushed coat','Large dogs over 50 lb with long hair','tie',2 UNION ALL
  SELECT 'Main maintenance','Clean/rinse blade and guards','Weekly use and clean tool after brushing','tie',3
) v WHERE c.slug='oneisall-vs-furminator-grooming'
AND NOT EXISTS (SELECT 1 FROM comparison_criteria x WHERE x.comparison_id=c.id AND x.label=v.label);
