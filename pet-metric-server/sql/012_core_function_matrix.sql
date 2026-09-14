SET NAMES utf8mb4;

UPDATE products
SET external_id='B0BH6MD3DJ',
    name='Whisker Litter-Robot 4',
    merchant_url='https://www.amazon.com/dp/B0BH6MD3DJ',
    price=NULL,
    price_display='See current price on Amazon',
    amazon_rating=NULL,
    amazon_review_count=NULL,
    amazon_availability=NULL,
    subscription=NULL
WHERE slug='litter-robot-4';

UPDATE product_source_facts psf
JOIN products p ON p.id=psf.product_id
SET psf.source_url=p.merchant_url
WHERE p.slug='litter-robot-4' AND psf.source_name='Amazon';

INSERT INTO comparison_metric_definitions
  (category_id, metric_key, label, help_text, comparison_rule, sort_order, is_published)
VALUES
((SELECT id FROM categories WHERE slug='automatic-litter-boxes'),'automatic_cleaning','Automatic cleaning','How the product separates and contains waste after use.','contextual',1,TRUE),
((SELECT id FROM categories WHERE slug='automatic-litter-boxes'),'design','Product structure','Open-top, globe and enclosed structures affect cat acceptance and usable space.','contextual',2,TRUE),
((SELECT id FROM categories WHERE slug='automatic-litter-boxes'),'ai_camera','AI camera','Whether a camera is present and what the listing says it analyses.','contextual',3,TRUE),
((SELECT id FROM categories WHERE slug='automatic-litter-boxes'),'waste_classification','Urine / stool classification','Whether the product claims to visually distinguish waste types or stool condition.','contextual',4,TRUE),
((SELECT id FROM categories WHERE slug='automatic-litter-boxes'),'multi_cat_tracking','Multi-cat identification','How many cats can be distinguished and how identification works.','contextual',5,TRUE),
((SELECT id FROM categories WHERE slug='automatic-litter-boxes'),'health_monitoring','Health monitoring','Health signals recorded by the device; this is not a veterinary diagnosis.','contextual',6,TRUE),
((SELECT id FROM categories WHERE slug='automatic-litter-boxes'),'app_control','App controls','Cleaning, records, alerts and device controls available in the app.','contextual',7,TRUE),
((SELECT id FROM categories WHERE slug='automatic-litter-boxes'),'camera_view','Camera viewing','Whether live view or recorded video is stated.','contextual',8,TRUE),
((SELECT id FROM categories WHERE slug='automatic-litter-boxes'),'odor_control','Odor control','Physical odor-control method and any consumables required.','contextual',9,TRUE),
((SELECT id FROM categories WHERE slug='automatic-litter-boxes'),'safety_system','Safety protection','Sensors and stop mechanisms described by the manufacturer.','contextual',10,TRUE),
((SELECT id FROM categories WHERE slug='automatic-litter-boxes'),'leak_protection','Leak protection','Structures intended to contain urine or litter leakage.','contextual',11,TRUE),
((SELECT id FROM categories WHERE slug='automatic-litter-boxes'),'waste_capacity','Waste capacity','Stated waste-bin volume or estimated interval for one cat.','contextual',12,TRUE),
((SELECT id FROM categories WHERE slug='automatic-litter-boxes'),'minimum_cat_weight','Minimum cat weight','Minimum weight required for automatic mode; verify before use with kittens.','contextual',13,TRUE),
((SELECT id FROM categories WHERE slug='automatic-litter-boxes'),'litter_compatibility','Accessories and consumables','Compatible litter plus proprietary bags, filters or optional consumables.','contextual',14,TRUE),
((SELECT id FROM categories WHERE slug='automatic-litter-boxes'),'after_sales','Returns and warranty','Return period and warranty explicitly stated by the seller or manufacturer.','contextual',15,TRUE),
((SELECT id FROM categories WHERE slug='automatic-litter-boxes'),'key_proposition','Main proposition','The most substantive functional positioning supported by the available material.','contextual',16,TRUE)
ON DUPLICATE KEY UPDATE
  label=VALUES(label), help_text=VALUES(help_text), comparison_rule=VALUES(comparison_rule),
  sort_order=VALUES(sort_order), is_published=VALUES(is_published);

UPDATE comparison_metric_definitions
SET is_published=FALSE
WHERE category_id=(SELECT id FROM categories WHERE slug='automatic-litter-boxes')
  AND metric_key='cleaning_system';

INSERT INTO product_metric_values
  (product_id, metric_definition_id, display_value, source_url, checked_at, confidence, evidence_status)
SELECT p.id, m.id, facts.display_value, p.merchant_url, COALESCE(p.commerce_checked_at, NOW()), facts.confidence, facts.evidence_status
FROM products p
JOIN (
  SELECT 'B0GTM9P94B' asin,'automatic_cleaning' metric_key,'Automatically cleans after each use and seals collected waste' display_value,'moderate' confidence,'explicit' evidence_status UNION ALL
  SELECT 'B0GTM9P94B','design','Open-top structure','moderate','explicit' UNION ALL
  SELECT 'B0GTM9P94B','ai_camera','Included; analyses waste condition, visit frequency and habits','limited','claim' UNION ALL
  SELECT 'B0GTM9P94B','waste_classification','Brand claims recognition of urine, stool, solid stool and loose stool','limited','claim' UNION ALL
  SELECT 'B0GTM9P94B','multi_cat_tracking','Identifies and records data for up to 10 cats','limited','claim' UNION ALL
  SELECT 'B0GTM9P94B','health_monitoring','Waste analysis, visit frequency, weight trends and abnormal alerts','limited','claim' UNION ALL
  SELECT 'B0GTM9P94B','app_control','Cleaning, sleep mode, usage records, video and alerts','moderate','explicit' UNION ALL
  SELECT 'B0GTM9P94B','camera_view','Live or recorded video stated','moderate','explicit' UNION ALL
  SELECT 'B0GTM9P94B','odor_control','Built-in fan and carbon deodorizer; brand claims 97% odor reduction','limited','claim' UNION ALL
  SELECT 'B0GTM9P94B','safety_system','Vision, weight and infrared sensors; cycle pauses when a cat is detected','limited','claim' UNION ALL
  SELECT 'B0GTM9P94B','leak_protection','Side barrier and waterproof mat design','moderate','explicit' UNION ALL
  SELECT 'B0GTM9P94B','waste_capacity','2.9 gal / 11 L; brand claims up to about 14 days for one cat','limited','claim' UNION ALL
  SELECT 'B0GTM9P94B','minimum_cat_weight','Not clearly stated on the checked material','limited','unclear' UNION ALL
  SELECT 'B0GTM9P94B','litter_compatibility','Compatible with clumping clay, tofu and mixed litter','moderate','explicit' UNION ALL
  SELECT 'B0GTM9P94B','after_sales','Checked listing states a 30-day return window','limited','explicit' UNION ALL
  SELECT 'B0GTM9P94B','key_proposition','AI-assisted waste analysis, camera and identification for up to 10 cats','limited','claim' UNION ALL

  SELECT 'B0BH6MD3DJ','automatic_cleaning','Patented sifting cycle separates clumps into a sealed waste drawer','moderate','explicit' UNION ALL
  SELECT 'B0BH6MD3DJ','design','Rotating globe with a relatively enclosed entrance','moderate','explicit' UNION ALL
  SELECT 'B0BH6MD3DJ','ai_camera','Camera is not clearly stated on the checked listing','limited','unclear' UNION ALL
  SELECT 'B0BH6MD3DJ','waste_classification','Visual urine / stool classification is not clearly stated','limited','unclear' UNION ALL
  SELECT 'B0BH6MD3DJ','multi_cat_tracking','Designed for up to 4 cats; records cats by weight','moderate','explicit' UNION ALL
  SELECT 'B0BH6MD3DJ','health_monitoring','Weight, usage and litter-box activity records','moderate','explicit' UNION ALL
  SELECT 'B0BH6MD3DJ','app_control','Cleaning controls, litter and waste levels, health data and weight','moderate','explicit' UNION ALL
  SELECT 'B0BH6MD3DJ','camera_view','Camera viewing is not stated','limited','unclear' UNION ALL
  SELECT 'B0BH6MD3DJ','odor_control','Carbon filter; optional OdorTrap consumables','moderate','explicit' UNION ALL
  SELECT 'B0BH6MD3DJ','safety_system','Cat detection and cycle-safety mechanisms stated; exact sensor combination not detailed here','limited','explicit' UNION ALL
  SELECT 'B0BH6MD3DJ','leak_protection','Leak-control structure is not a primary claim on the checked material','limited','unclear' UNION ALL
  SELECT 'B0BH6MD3DJ','waste_capacity','Sealed waste drawer; no clear day estimate on the checked listing','limited','unclear' UNION ALL
  SELECT 'B0BH6MD3DJ','minimum_cat_weight','Automatic mode requires cats to weigh at least 3 lb / about 1.4 kg','moderate','explicit' UNION ALL
  SELECT 'B0BH6MD3DJ','litter_compatibility','Uses liners and carbon filters; some OdorTrap consumables are sold separately','moderate','explicit' UNION ALL
  SELECT 'B0BH6MD3DJ','after_sales','1-year WhiskerCare warranty and 90-day in-home trial stated','moderate','explicit' UNION ALL
  SELECT 'B0BH6MD3DJ','key_proposition','Mature globe-sifting system, established cleaning workflow and brand support','moderate','explicit'
) facts ON facts.asin=p.external_id
JOIN comparison_metric_definitions m ON m.category_id=p.category_id AND m.metric_key=facts.metric_key
ON DUPLICATE KEY UPDATE
  display_value=VALUES(display_value), source_url=VALUES(source_url), checked_at=VALUES(checked_at),
  confidence=VALUES(confidence), evidence_status=VALUES(evidence_status);

INSERT INTO comparisons
  (slug, category_id, product_a_id, product_b_id, product_a_name, product_b_name, verdict,
   home_verdict, views_count, read_time, updated_label, content_json, sort_order, is_featured, is_published)
VALUES
  ('petlibro-luma-vs-litter-robot-4',
   (SELECT id FROM categories WHERE slug='automatic-litter-boxes'),
   (SELECT id FROM products WHERE external_id='B0GTM9P94B'),
   (SELECT id FROM products WHERE external_id='B0BH6MD3DJ'),
   'PETLIBRO Luma Automatic Litter Box', 'Whisker Litter-Robot 4',
   'Luma emphasizes camera-based waste and multi-cat analysis; Litter-Robot 4 emphasizes a mature globe-sifting workflow and established support.',
   'Luma for camera-led health signals; Litter-Robot 4 for a mature cleaning ecosystem.',
   0, '10 min read', 'Sep 2026', JSON_OBJECT('method','Core functions and implementation differences'), 1, TRUE, TRUE)
ON DUPLICATE KEY UPDATE
  product_a_id=VALUES(product_a_id), product_b_id=VALUES(product_b_id),
  product_a_name=VALUES(product_a_name), product_b_name=VALUES(product_b_name),
  verdict=VALUES(verdict), home_verdict=VALUES(home_verdict), read_time=VALUES(read_time),
  updated_label=VALUES(updated_label), content_json=VALUES(content_json), is_featured=VALUES(is_featured), is_published=VALUES(is_published);
