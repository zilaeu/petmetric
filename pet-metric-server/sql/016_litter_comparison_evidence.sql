SET NAMES utf8mb4;

/* Amazon.com listing bullets checked 2026-09-07. */

INSERT INTO product_source_facts (product_id,source_name,source_url,checked_at,facts_json)
VALUES
  ((SELECT id FROM products WHERE external_id='B0GD69KW7J'),'Amazon','https://www.amazon.com/dp/B0GD69KW7J','2026-09-07 00:00:00',
   JSON_ARRAY(JSON_OBJECT('label','Structure','value','Open-top'),JSON_OBJECT('label','Waste bin','value','11.2 L; 7–14 days claimed'),JSON_OBJECT('label','Litter capacity','value','7.2 L'),JSON_OBJECT('label','Odor system','value','Air purifier with three airflow modes'),JSON_OBJECT('label','Filter interval','value','Replace every 2–3 months'))),
  ((SELECT id FROM products WHERE external_id='B0D4GHS7V6'),'Amazon','https://www.amazon.com/dp/B0D4GHS7V6','2026-09-07 00:00:00',
   JSON_ARRAY(JSON_OBJECT('label','Cleaning','value','SmartSpin sifting into sealed waste drawer'),JSON_OBJECT('label','Health data','value','Weight and litter-box usage in PetSafe Pet Companion app'),JSON_OBJECT('label','Connectivity','value','2.4 GHz Wi-Fi'),JSON_OBJECT('label','Cat fit','value','Cats up to 25 lb'),JSON_OBJECT('label','Litter','value','Clumping or non-clumping litter')))
ON DUPLICATE KEY UPDATE source_url=VALUES(source_url),checked_at=VALUES(checked_at),facts_json=VALUES(facts_json);

DELETE ps FROM product_specs ps JOIN products p ON p.id=ps.product_id
WHERE p.external_id IN ('B0GD69KW7J','B0D4GHS7V6')
  AND ps.spec_key IN ('waste_capacity','litter_capacity','filter_interval','connectivity','cat_fit','litter_compatibility');

INSERT INTO product_specs (product_id,spec_key,label,value,sort_order) VALUES
  ((SELECT id FROM products WHERE external_id='B0GD69KW7J'),'waste_capacity','Waste bin','11.2 L; 7–14 days claimed',10),
  ((SELECT id FROM products WHERE external_id='B0GD69KW7J'),'litter_capacity','Litter capacity','7.2 L',11),
  ((SELECT id FROM products WHERE external_id='B0GD69KW7J'),'filter_interval','Air filter','Replace every 2–3 months; sooner for more than two cats',12),
  ((SELECT id FROM products WHERE external_id='B0D4GHS7V6'),'connectivity','Connectivity','2.4 GHz Wi-Fi and PetSafe Pet Companion app',10),
  ((SELECT id FROM products WHERE external_id='B0D4GHS7V6'),'cat_fit','Cat fit','Cats up to 25 lb; entrance 12 in from the ground',11),
  ((SELECT id FROM products WHERE external_id='B0D4GHS7V6'),'litter_compatibility','Litter compatibility','Clumping or non-clumping litter; premium clumping recommended',12);

INSERT INTO product_metric_values
  (product_id,metric_definition_id,display_value,numeric_value,source_url,checked_at,confidence,evidence_status)
SELECT p.id,m.id,f.display_value,f.numeric_value,p.merchant_url,'2026-09-07 00:00:00','limited',f.evidence_status
FROM products p
JOIN (
  SELECT 'B0GD69KW7J' asin,'automatic_cleaning' metric_key,'Self-cleaning cycle with Pull & Wrap waste sealing' display_value,NULL numeric_value,'explicit' evidence_status UNION ALL
  SELECT 'B0GD69KW7J','design','Open-top structure with integrated step and air purifier',NULL,'explicit' UNION ALL
  SELECT 'B0GD69KW7J','odor_control','Air purifier captures odor, fur and litter dust; three airflow modes; filter replacement every 2–3 months',NULL,'claim' UNION ALL
  SELECT 'B0GD69KW7J','waste_capacity','11.2 L waste bin and 7.2 L litter capacity; 7–14 days claimed',11.2,'claim' UNION ALL
  SELECT 'B0GD69KW7J','key_proposition','Open-top acceptance with integrated step and air-purifier workflow',NULL,'claim' UNION ALL
  SELECT 'B0D4GHS7V6','automatic_cleaning','SmartSpin sifts clumps into a sealed waste drawer; up to two weeks hands-free claimed',NULL,'claim' UNION ALL
  SELECT 'B0D4GHS7V6','design','Rotating enclosed litter-box structure with a low 12-inch entrance',NULL,'explicit' UNION ALL
  SELECT 'B0D4GHS7V6','health_monitoring','App reports weight updates and litter-box usage',NULL,'explicit' UNION ALL
  SELECT 'B0D4GHS7V6','app_control','PetSafe Pet Companion app with real-time health data; 2.4 GHz Wi-Fi required',NULL,'explicit' UNION ALL
  SELECT 'B0D4GHS7V6','odor_control','Sealed waste drawer and deodorizer; up to 4x better odor control claimed',NULL,'claim' UNION ALL
  SELECT 'B0D4GHS7V6','safety_system','Listing says the unit is built with cat safety in mind, but does not detail the sensor combination',NULL,'claim' UNION ALL
  SELECT 'B0D4GHS7V6','waste_capacity','Listing claims up to two weeks of hands-free cleaning; no bin volume stated',NULL,'claim' UNION ALL
  SELECT 'B0D4GHS7V6','litter_compatibility','Compatible with clumping or non-clumping litter; premium clumping litter recommended',NULL,'explicit' UNION ALL
  SELECT 'B0D4GHS7V6','key_proposition','Rotating self-cleaning workflow with app-visible weight and usage data',NULL,'claim'
) f ON f.asin=p.external_id
JOIN comparison_metric_definitions m ON m.category_id=p.category_id AND m.metric_key=f.metric_key
ON DUPLICATE KEY UPDATE display_value=VALUES(display_value),numeric_value=VALUES(numeric_value),source_url=VALUES(source_url),
  checked_at=VALUES(checked_at),confidence=VALUES(confidence),evidence_status=VALUES(evidence_status);
