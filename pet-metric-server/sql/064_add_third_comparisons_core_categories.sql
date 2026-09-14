SET NAMES utf8mb4;
UPDATE categories SET comparison_count='3' WHERE slug IN ('pet-grooming-tools','pet-waste-cleanup','pet-walking-safety');

INSERT INTO comparisons (slug,category_id,product_a_id,product_b_id,product_a_name,product_b_name,verdict,read_time,updated_label,content_json,sort_order,is_featured,is_published)
VALUES
('oneisall-vs-furminator-grooming',(SELECT id FROM categories WHERE slug='pet-grooming-tools'),(SELECT id FROM products WHERE slug='oneisall-quiet-dog-clippers'),(SELECT id FROM products WHERE slug='furminator-undercoat-deshedding-tool'),'Oneisall Quiet Dog Clippers','FURminator Undercoat deShedding Tool','A clipper changes coat length; a de-shedding tool removes loose undercoat. Choose by the actual grooming problem, not by tool popularity.','7 min read','Sep 2026',JSON_OBJECT('decisionQuestion','Do you need trimming or loose-hair reduction?'),46,FALSE,TRUE),
('weewee-pads-vs-litter-genie',(SELECT id FROM categories WHERE slug='pet-waste-cleanup'),(SELECT id FROM products WHERE slug='wee-wee-pads-xxl'),(SELECT id FROM products WHERE slug='litter-genie-plus'),'WEE WEE XXL Training Pads','Litter Genie Plus Pail','Pads manage where liquid lands; the pail manages how scooped litter is stored. They belong to different cleanup workflows.','6 min read','Sep 2026',JSON_OBJECT('decisionQuestion','Is the main failure leakage or indoor storage of scooped waste?'),47,FALSE,TRUE),
('ruffwear-vs-kurgo-harness',(SELECT id FROM categories WHERE slug='pet-walking-safety'),(SELECT id FROM products WHERE slug='ruffwear-front-range-harness'),(SELECT id FROM products WHERE slug='kurgo-enhanced-strength-tru-fit'),'Ruffwear Front Range Harness','Kurgo Enhanced Strength Tru-Fit Smart Harness','Ruffwear is an everyday walking-first harness; Kurgo adds a stronger travel and vehicle-use context.','7 min read','Sep 2026',JSON_OBJECT('decisionQuestion','Is everyday walking or walk-plus-travel the priority?'),48,FALSE,TRUE)
ON DUPLICATE KEY UPDATE category_id=VALUES(category_id),product_a_id=VALUES(product_a_id),product_b_id=VALUES(product_b_id),verdict=VALUES(verdict),content_json=VALUES(content_json),updated_label=VALUES(updated_label),is_published=TRUE;

INSERT INTO comparison_best_for (comparison_id,pick_name,audience,sort_order)
SELECT c.id,v.pick_name,v.audience,v.sort_order FROM comparisons c JOIN (
SELECT 'oneisall-vs-furminator-grooming' slug,'Oneisall Quiet Dog Clippers' pick_name,'Owners who need coat length control.' audience,1 sort_order UNION ALL SELECT 'oneisall-vs-furminator-grooming','FURminator Undercoat deShedding Tool','Owners who need loose-hair reduction.',2 UNION ALL
SELECT 'weewee-pads-vs-litter-genie','WEE WEE XXL Training Pads','Indoor dog routines managing liquid accidents.',1 UNION ALL SELECT 'weewee-pads-vs-litter-genie','Litter Genie Plus Pail','Cat homes managing daily scooping indoors.',2 UNION ALL
SELECT 'ruffwear-vs-kurgo-harness','Ruffwear Front Range Harness','Everyday walking comfort.',1 UNION ALL SELECT 'ruffwear-vs-kurgo-harness','Kurgo Enhanced Strength Tru-Fit Smart Harness','Walking plus vehicle-travel routines.',2
) v ON v.slug=c.slug WHERE NOT EXISTS (SELECT 1 FROM comparison_best_for x WHERE x.comparison_id=c.id AND x.pick_name=v.pick_name);

INSERT INTO comparison_criteria (comparison_id,label,product_a_value,product_b_value,winner,sort_order)
SELECT c.id,v.label,v.a_value,v.b_value,v.winner,v.sort_order FROM comparisons c JOIN (
SELECT 'oneisall-vs-furminator-grooming' slug,'Primary job' label,'Trim coat length' a_value,'Reduce loose undercoat' b_value,'tie' winner,1 sort_order UNION ALL SELECT 'oneisall-vs-furminator-grooming','Pet tolerance','Motor noise and heat','Pressure and brushing feel','tie',2 sort_order UNION ALL
SELECT 'weewee-pads-vs-litter-genie','Mess type' label,'Liquid on a surface' a_value,'Scooped waste indoors' b_value,'tie' winner,1 sort_order UNION ALL SELECT 'weewee-pads-vs-litter-genie','Recurring supplies','Disposable pads','Refill film','tie',2 sort_order UNION ALL
SELECT 'ruffwear-vs-kurgo-harness','Primary context' label,'Everyday walks' a_value,'Walks plus travel' b_value,'tie' winner,1 sort_order UNION ALL SELECT 'ruffwear-vs-kurgo-harness','Fit priority','Walking comfort' a_value,'Adjustment and vehicle context' b_value,'tie' winner,2 sort_order
) v ON v.slug=c.slug WHERE NOT EXISTS (SELECT 1 FROM comparison_criteria x WHERE x.comparison_id=c.id AND x.label=v.label);
