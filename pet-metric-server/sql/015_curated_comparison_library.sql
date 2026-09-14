SET NAMES utf8mb4;

/*
  Comparison-library expansion checked 2026-09-07.

  Pairings are curated around a real buyer decision: direct alternatives,
  same-brand fit, premium versus value, or specialist versus generalist.
  The new water-fountain products and claims below were checked on their
  linked Amazon.com listings. Listing claims remain claims, not independent
  performance tests.
*/

INSERT INTO categories
  (slug,title,eyebrow,description,subtitle,product_count,comparison_count,price_range,top_pick,top_score,image_url,image_key,alt_text,updated_label,sort_order,is_published)
VALUES
  ('smart-water-fountains','Smart Water Fountains','Hydration technology',
   'Connected and automatic water fountains compared on water delivery, hygiene, maintenance, noise, consumables, and hydration insight.',
   'Compare the water path and cleaning workload first; app features matter only when the drinking surface stays hygienic and your pet will use it.',
   0,'0',NULL,NULL,NULL,'https://m.media-amazon.com/images/I/71Us-ricetL._AC_SX679_.jpg',NULL,
   'PETLIBRO Dockstream 2 smart cat water fountain','Sep 2026',5,TRUE)
ON DUPLICATE KEY UPDATE
  title=VALUES(title),eyebrow=VALUES(eyebrow),description=VALUES(description),subtitle=VALUES(subtitle),
  image_url=VALUES(image_url),alt_text=VALUES(alt_text),updated_label=VALUES(updated_label),sort_order=VALUES(sort_order),is_published=TRUE;

DELETE FROM category_criteria WHERE category_id=(SELECT id FROM categories WHERE slug='smart-water-fountains');
INSERT INTO category_criteria (category_id,title,description,icon,sort_order) VALUES
  ((SELECT id FROM categories WHERE slug='smart-water-fountains'),'Water path and hygiene','Check how clean and used water are handled, including stagnant-water and low-water behavior.',NULL,1),
  ((SELECT id FROM categories WHERE slug='smart-water-fountains'),'Cleaning workload','Count the parts, narrow channels, pump access, and frequency of full disassembly.',NULL,2),
  ((SELECT id FROM categories WHERE slug='smart-water-fountains'),'Filters and running cost','Compare replacement-filter schedules with filterless or wastewater-separation designs.',NULL,3),
  ((SELECT id FROM categories WHERE slug='smart-water-fountains'),'Capacity and power','Match tank size and corded or cordless runtime to the number of pets and time away.',NULL,4),
  ((SELECT id FROM categories WHERE slug='smart-water-fountains'),'Noise and pet acceptance','Pump, refill, bowl material, height, and water movement can affect whether a pet drinks.',NULL,5),
  ((SELECT id FROM categories WHERE slug='smart-water-fountains'),'Hydration data','Treat app intake data as a trend signal until measurement accuracy is independently verified.',NULL,6);

INSERT INTO products
  (external_id,category_id,slug,name,brand,price,price_display,subscription,score,amazon_rating,amazon_review_count,amazon_availability,commerce_checked_at,verdict,best_for,image_url,image_key,alt_text,merchant_name,merchant_url,updated_label,rank_order,is_featured,is_published)
VALUES
  ('B0FDKQGRCK',(SELECT id FROM categories WHERE slug='smart-water-fountains'),'petlibro-dockstream-2',
   'PETLIBRO Dockstream 2 Smart Water Fountain','PETLIBRO',NULL,'See current price on Amazon',NULL,NULL,4.2,17199,NULL,'2026-09-07 00:00:00',
   'A connected 3 L fountain that emphasizes hydration trends, selectable flow modes, and four-layer filtration; filter cost and app accuracy still need independent verification.',
   'Owners who value hydration history and app-visible drinking trends',
   'https://m.media-amazon.com/images/I/71Us-ricetL._AC_SX679_.jpg',NULL,'PETLIBRO Dockstream 2 smart water fountain','Amazon','https://www.amazon.com/dp/B0FDKQGRCK','Sep 2026',1,TRUE,TRUE),
  ('B0F9FC7JYD',(SELECT id FROM categories WHERE slug='smart-water-fountains'),'feelneedy-filterless-water-fountain',
   'FEELNEEDY Filterless Wastewater-Separation Fountain','FEELNEEDY',NULL,'See current price on Amazon',NULL,NULL,4.0,1462,NULL,'2026-09-07 00:00:00',
   'A 3.5 L cordless fountain that replaces filters with separate clean and wastewater tanks; the six-month runtime and hygiene benefits are listing claims, not independent test results.',
   'Owners prioritizing filterless operation, cordless placement, and lower consumable cost',
   'https://m.media-amazon.com/images/I/61h6AIoARIL._AC_SY300_SX300_QL70_FMwebp_.jpg',NULL,'FEELNEEDY filterless cat water fountain','Amazon','https://www.amazon.com/dp/B0F9FC7JYD','Sep 2026',2,FALSE,TRUE)
ON DUPLICATE KEY UPDATE
  external_id=VALUES(external_id),category_id=VALUES(category_id),name=VALUES(name),brand=VALUES(brand),price=VALUES(price),
  price_display=VALUES(price_display),subscription=VALUES(subscription),amazon_rating=VALUES(amazon_rating),amazon_review_count=VALUES(amazon_review_count),
  amazon_availability=VALUES(amazon_availability),commerce_checked_at=VALUES(commerce_checked_at),verdict=VALUES(verdict),best_for=VALUES(best_for),
  image_url=VALUES(image_url),alt_text=VALUES(alt_text),merchant_name=VALUES(merchant_name),merchant_url=VALUES(merchant_url),
  updated_label=VALUES(updated_label),rank_order=VALUES(rank_order),is_featured=VALUES(is_featured),is_published=TRUE;

DELETE pt FROM product_tags pt JOIN products p ON p.id=pt.product_id
WHERE p.slug IN ('petlibro-dockstream-2','feelneedy-filterless-water-fountain');
INSERT INTO product_tags (product_id,tag,sort_order) VALUES
  ((SELECT id FROM products WHERE slug='petlibro-dockstream-2'),'3 L tank',1),
  ((SELECT id FROM products WHERE slug='petlibro-dockstream-2'),'App hydration trends',2),
  ((SELECT id FROM products WHERE slug='petlibro-dockstream-2'),'Four-layer filter',3),
  ((SELECT id FROM products WHERE slug='feelneedy-filterless-water-fountain'),'3.5 L clean-water tank',1),
  ((SELECT id FROM products WHERE slug='feelneedy-filterless-water-fountain'),'Filterless',2),
  ((SELECT id FROM products WHERE slug='feelneedy-filterless-water-fountain'),'Cordless',3);

DELETE ps FROM product_specs ps JOIN products p ON p.id=ps.product_id
WHERE p.slug IN ('petlibro-dockstream-2','feelneedy-filterless-water-fountain');
INSERT INTO product_specs (product_id,spec_key,label,value,sort_order) VALUES
  ((SELECT id FROM products WHERE slug='petlibro-dockstream-2'),'capacity','Capacity','3 L / 101 oz',1),
  ((SELECT id FROM products WHERE slug='petlibro-dockstream-2'),'connectivity','Hydration data','App monitoring with drinking history and trends; 5 GHz connectivity stated',2),
  ((SELECT id FROM products WHERE slug='petlibro-dockstream-2'),'water_flow','Water delivery','Continuous or timed flow modes selected in the app',3),
  ((SELECT id FROM products WHERE slug='petlibro-dockstream-2'),'filtration','Filtration','Four-layer filtration',4),
  ((SELECT id FROM products WHERE slug='petlibro-dockstream-2'),'material','Drinking surface','Stainless-steel tray',5),
  ((SELECT id FROM products WHERE slug='petlibro-dockstream-2'),'maintenance','Maintenance','Detachable tank and pump-free water-area design',6),
  ((SELECT id FROM products WHERE slug='petlibro-dockstream-2'),'noise','Noise','Whisper-quiet claim; no decibel figure stated',7),
  ((SELECT id FROM products WHERE slug='petlibro-dockstream-2'),'warranty','Warranty','2 years',8),
  ((SELECT id FROM products WHERE slug='petlibro-dockstream-2'),'consumables','Consumables','PETLIBRO replacement filters recommended',9),
  ((SELECT id FROM products WHERE slug='feelneedy-filterless-water-fountain'),'capacity','Capacity','3.5 L clean-water tank',1),
  ((SELECT id FROM products WHERE slug='feelneedy-filterless-water-fountain'),'water_flow','Water delivery','Separate clean and wastewater tanks with timed stale-water discharge',2),
  ((SELECT id FROM products WHERE slug='feelneedy-filterless-water-fountain'),'filtration','Filtration','No replaceable filter; wastewater separation instead',3),
  ((SELECT id FROM products WHERE slug='feelneedy-filterless-water-fountain'),'power','Cordless runtime','2,000 mAh USB-C battery; up to 180 days claimed',4),
  ((SELECT id FROM products WHERE slug='feelneedy-filterless-water-fountain'),'material','Drinking surface','304 stainless-steel bowl; plastic clean/waste tanks',5),
  ((SELECT id FROM products WHERE slug='feelneedy-filterless-water-fountain'),'maintenance','Maintenance','Detachable parts; three-minute deep-clean claim',6),
  ((SELECT id FROM products WHERE slug='feelneedy-filterless-water-fountain'),'noise','Noise','30 dB motor claim; 30–35 dB during refill',7),
  ((SELECT id FROM products WHERE slug='feelneedy-filterless-water-fountain'),'consumables','Consumables','No replacement filters claimed',8);

INSERT INTO product_source_facts (product_id,source_name,source_url,checked_at,facts_json)
VALUES
  ((SELECT id FROM products WHERE slug='petlibro-dockstream-2'),'Amazon','https://www.amazon.com/dp/B0FDKQGRCK','2026-09-07 00:00:00',
   JSON_ARRAY(JSON_OBJECT('label','Capacity','value','3 L / 101 oz'),JSON_OBJECT('label','Hydration data','value','App history and drinking trends'),JSON_OBJECT('label','Water delivery','value','Continuous or timed flow'),JSON_OBJECT('label','Filtration','value','Four-layer filter'),JSON_OBJECT('label','Warranty','value','2 years'))),
  ((SELECT id FROM products WHERE slug='feelneedy-filterless-water-fountain'),'Amazon','https://www.amazon.com/dp/B0F9FC7JYD','2026-09-07 00:00:00',
   JSON_ARRAY(JSON_OBJECT('label','Capacity','value','3.5 L clean-water tank'),JSON_OBJECT('label','Water system','value','Separate clean and wastewater tanks'),JSON_OBJECT('label','Filtration','value','No replaceable filter'),JSON_OBJECT('label','Cordless runtime','value','Up to 180 days claimed'),JSON_OBJECT('label','Noise','value','30 dB motor claim; 30–35 dB refill')))
ON DUPLICATE KEY UPDATE source_url=VALUES(source_url),checked_at=VALUES(checked_at),facts_json=VALUES(facts_json);

INSERT INTO comparison_metric_definitions
  (category_id,metric_key,label,help_text,comparison_rule,sort_order,is_published)
VALUES
  ((SELECT id FROM categories WHERE slug='smart-water-fountains'),'capacity','Water capacity','Compare refill frequency, freshness, and the number of pets served—not capacity alone.','contextual',1,TRUE),
  ((SELECT id FROM categories WHERE slug='smart-water-fountains'),'hydration_tracking','Hydration tracking','What intake data is shown and whether measurement accuracy has been independently verified.','contextual',2,TRUE),
  ((SELECT id FROM categories WHERE slug='smart-water-fountains'),'water_delivery','Water delivery system','How fresh water reaches the bowl and how used or stagnant water is handled.','contextual',3,TRUE),
  ((SELECT id FROM categories WHERE slug='smart-water-fountains'),'filtration','Filtration or separation','Filter media and replacement schedule, or the alternative method used to manage debris and stale water.','contextual',4,TRUE),
  ((SELECT id FROM categories WHERE slug='smart-water-fountains'),'cordless_runtime','Power and cordless runtime','Whether placement requires a cable and the runtime claimed for battery operation.','contextual',5,TRUE),
  ((SELECT id FROM categories WHERE slug='smart-water-fountains'),'material','Food-contact material','Material of the drinking surface and water-contact components.','contextual',6,TRUE),
  ((SELECT id FROM categories WHERE slug='smart-water-fountains'),'maintenance','Cleaning and maintenance','Parts, channels, pump access, and stated cleaning workload.','contextual',7,TRUE),
  ((SELECT id FROM categories WHERE slug='smart-water-fountains'),'noise','Noise','Stated operating noise and any louder refill or pump events.','contextual',8,TRUE),
  ((SELECT id FROM categories WHERE slug='smart-water-fountains'),'warranty','Warranty','Warranty explicitly stated on the checked listing.','contextual',9,TRUE),
  ((SELECT id FROM categories WHERE slug='smart-water-fountains'),'ongoing_consumables','Ongoing consumables','Required filters or proprietary parts that affect annual ownership cost.','contextual',10,TRUE)
ON DUPLICATE KEY UPDATE label=VALUES(label),help_text=VALUES(help_text),comparison_rule=VALUES(comparison_rule),sort_order=VALUES(sort_order),is_published=TRUE;

INSERT INTO product_metric_values
  (product_id,metric_definition_id,display_value,numeric_value,source_url,checked_at,confidence,evidence_status)
SELECT p.id,m.id,f.display_value,f.numeric_value,p.merchant_url,'2026-09-07 00:00:00','limited',f.evidence_status
FROM products p
JOIN (
  SELECT 'B0FDKQGRCK' asin,'capacity' metric_key,'3 L / 101 oz' display_value,3.0 numeric_value,'explicit' evidence_status UNION ALL
  SELECT 'B0FDKQGRCK','hydration_tracking','App records intake history, preferred drinking times and trends',NULL,'claim' UNION ALL
  SELECT 'B0FDKQGRCK','water_delivery','Continuous or timed flow modes selected in the app',NULL,'explicit' UNION ALL
  SELECT 'B0FDKQGRCK','filtration','Four-layer filtration for fur, heavy metals and odors',NULL,'claim' UNION ALL
  SELECT 'B0FDKQGRCK','material','Stainless-steel drinking tray',NULL,'explicit' UNION ALL
  SELECT 'B0FDKQGRCK','maintenance','Detachable 3 L tank; pump-free water-area design reduces submerged parts',NULL,'claim' UNION ALL
  SELECT 'B0FDKQGRCK','noise','Whisper-quiet claim; no decibel figure stated',NULL,'claim' UNION ALL
  SELECT 'B0FDKQGRCK','warranty','2-year warranty stated',2.0,'explicit' UNION ALL
  SELECT 'B0FDKQGRCK','ongoing_consumables','PETLIBRO official replacement filters recommended',NULL,'explicit' UNION ALL
  SELECT 'B0F9FC7JYD','capacity','3.5 L clean-water tank; listing claims 3–9 days',3.5,'claim' UNION ALL
  SELECT 'B0F9FC7JYD','water_delivery','Separate clean and wastewater tanks with timed stale-water discharge',NULL,'claim' UNION ALL
  SELECT 'B0F9FC7JYD','filtration','No replaceable filter; wastewater separation instead',NULL,'explicit' UNION ALL
  SELECT 'B0F9FC7JYD','cordless_runtime','2,000 mAh USB-C battery; up to 180 days claimed',180.0,'claim' UNION ALL
  SELECT 'B0F9FC7JYD','material','304 stainless-steel bowl; plastic clean/waste tanks',NULL,'explicit' UNION ALL
  SELECT 'B0F9FC7JYD','maintenance','Detachable parts; three-minute deep-clean claim',NULL,'claim' UNION ALL
  SELECT 'B0F9FC7JYD','noise','30 dB motor claim; 30–35 dB during refill',30.0,'claim' UNION ALL
  SELECT 'B0F9FC7JYD','ongoing_consumables','No replacement filters claimed',NULL,'claim'
) f ON f.asin=p.external_id
JOIN comparison_metric_definitions m ON m.category_id=p.category_id AND m.metric_key=f.metric_key
ON DUPLICATE KEY UPDATE display_value=VALUES(display_value),numeric_value=VALUES(numeric_value),source_url=VALUES(source_url),
  checked_at=VALUES(checked_at),confidence=VALUES(confidence),evidence_status=VALUES(evidence_status);

/* Add high-intent pairings from products already in the verified catalog. */
INSERT INTO comparisons
  (slug,category_id,product_a_id,product_b_id,product_a_name,product_b_name,verdict,home_verdict,views_count,read_time,updated_label,content_json,sort_order,is_featured,is_published)
VALUES
  ('petlibro-luma-vs-neakasa-m1-plus',(SELECT id FROM categories WHERE slug='automatic-litter-boxes'),(SELECT id FROM products WHERE slug='petkit-pura-x'),(SELECT id FROM products WHERE slug='petkit-pura-max'),'PETLIBRO Luma Automatic Litter Box','Neakasa M1 Plus','Two premium open-top automatic litter boxes with different levels of camera-led health data, odor control, and published safety detail.',NULL,0,'9 min read','Sep 2026',JSON_OBJECT('matchType','direct-alternatives','matchLabel','Direct alternatives','whyCompare','Both are premium open-top automatic litter boxes aimed at owners concerned about cat acceptance and usable interior space.','decisionQuestion','Is camera-led health insight worth prioritizing over a simpler open-top cleaning system?'),2,FALSE,TRUE),
  ('litter-robot-4-vs-petsafe-smartspin',(SELECT id FROM categories WHERE slug='automatic-litter-boxes'),(SELECT id FROM products WHERE slug='litter-robot-4'),(SELECT id FROM products WHERE slug='litter-robot-3-connect'),'Whisker Litter-Robot 4','PetSafe ScoopFree SmartSpin','Both use rotating self-cleaning workflows, but their app detail, consumables, safety documentation, and current pricing need to be weighed together.',NULL,0,'9 min read','Sep 2026',JSON_OBJECT('matchType','direct-alternatives','matchLabel','Direct alternatives','whyCompare','These are enclosed rotating automatic litter boxes competing for the same premium self-cleaning use case.','decisionQuestion','Which rotating litter-box ecosystem better fits your cat and maintenance routine?'),4,FALSE,TRUE),
  ('life360-vs-tractive-smart-dog',(SELECT id FROM categories WHERE slug='gps-pet-trackers'),(SELECT id FROM products WHERE slug='whistle-go-explore'),(SELECT id FROM products WHERE slug='fi-series-3'),'Life360 Pet GPS Tracker for Dogs','Tractive Smart Dog GPS Tracker','A direct dog-tracker decision involving escape alerts, network coverage, battery claims, subscription terms, and health features.',NULL,0,'8 min read','Sep 2026',JSON_OBJECT('matchType','direct-alternatives','matchLabel','Direct alternatives','whyCompare','Both target dog owners who need live location and escape alerts in a subscription-backed tracker.','decisionQuestion','Which tracker offers the better coverage, battery, and subscription fit for your dog?'),7,FALSE,TRUE),
  ('petlibro-granary-vs-petkit-camera-feeder',(SELECT id FROM categories WHERE slug='smart-pet-feeders'),(SELECT id FROM products WHERE slug='petlibro-granary'),(SELECT id FROM products WHERE slug='petkit-fresh-element-infinity'),'PETLIBRO Granary 5L Automatic Feeder','PETKIT Automatic Feeder with Camera','Two connected feeders with different hopper capacity, camera emphasis, portion evidence, and Wi-Fi requirements.',NULL,0,'8 min read','Sep 2026',JSON_OBJECT('matchType','direct-alternatives','matchLabel','Direct alternatives','whyCompare','Both are app-connected automatic feeders for owners who want remote visibility and scheduling.','decisionQuestion','Should you prioritize hopper capacity and scheduling evidence or the competing camera-led workflow?'),9,FALSE,TRUE),
  ('petlibro-granary-vs-petsafe-simply-feed',(SELECT id FROM categories WHERE slug='smart-pet-feeders'),(SELECT id FROM products WHERE slug='petlibro-granary'),(SELECT id FROM products WHERE slug='petsafe-healthy-pet-simply-feed'),'PETLIBRO Granary 5L Automatic Feeder','PetSafe Healthy Pet Simply Feed','This comparison tests whether app connectivity is more valuable than a mature offline scheduling workflow and larger stated capacity.',NULL,0,'8 min read','Sep 2026',JSON_OBJECT('matchType','feature-tradeoff','matchLabel','Different approaches','whyCompare','Both automate meals, but one emphasizes connectivity while the other emphasizes standalone scheduling.','decisionQuestion','Do you need remote control, or is dependable offline meal scheduling the better fit?'),11,FALSE,TRUE),
  ('furbo-360-vs-eufy-e220',(SELECT id FROM categories WHERE slug='pet-cameras'),(SELECT id FROM products WHERE slug='furbo-360'),(SELECT id FROM products WHERE slug='eufy-pet-camera-e220'),'Furbo 360 Dog Camera','eufy Security Indoor Cam E220','A pet-specific camera with treat interaction faces a general indoor camera with pan/tilt coverage and a different storage model.',NULL,0,'8 min read','Sep 2026',JSON_OBJECT('matchType','specialist-vs-generalist','matchLabel','Specialist vs generalist','whyCompare','Many owners decide between a dedicated pet camera and a less expensive indoor security camera.','decisionQuestion','Are pet-specific alerts and treat interaction worth choosing over a general indoor camera?'),13,FALSE,TRUE),
  ('furbo-360-vs-wyze-cam-v3',(SELECT id FROM categories WHERE slug='pet-cameras'),(SELECT id FROM products WHERE slug='furbo-360'),(SELECT id FROM products WHERE slug='wyze-cam-v3'),'Furbo 360 Dog Camera','WYZE Cam v3','The premium pet-camera workflow is compared with a low-cost general camera that emphasizes basic video, night vision, and cloud clips.',NULL,0,'8 min read','Sep 2026',JSON_OBJECT('matchType','premium-vs-value','matchLabel','Premium vs value','whyCompare','Both can check on a pet remotely, but their price, coverage, interaction, and pet-specific functions differ sharply.','decisionQuestion','Which premium pet-camera functions are genuinely worth paying for?'),14,FALSE,TRUE),
  ('petlibro-dockstream-2-vs-feelneedy-filterless',(SELECT id FROM categories WHERE slug='smart-water-fountains'),(SELECT id FROM products WHERE slug='petlibro-dockstream-2'),(SELECT id FROM products WHERE slug='feelneedy-filterless-water-fountain'),'PETLIBRO Dockstream 2 Smart Water Fountain','FEELNEEDY Filterless Wastewater-Separation Fountain','PETLIBRO emphasizes app-visible hydration trends and four-layer filtration; FEELNEEDY emphasizes filterless wastewater separation and cordless runtime. Neither listing alone establishes superior long-term hygiene.',NULL,0,'9 min read','Sep 2026',JSON_OBJECT('matchType','feature-tradeoff','matchLabel','Different approaches','whyCompare','Both target owners who want fresher water with less daily attention, but use opposing filtration and monitoring strategies.','decisionQuestion','Should you prioritize hydration data and filtration, or filterless cordless operation?'),15,TRUE,TRUE)
ON DUPLICATE KEY UPDATE category_id=VALUES(category_id),product_a_id=VALUES(product_a_id),product_b_id=VALUES(product_b_id),
  product_a_name=VALUES(product_a_name),product_b_name=VALUES(product_b_name),verdict=VALUES(verdict),home_verdict=VALUES(home_verdict),
  read_time=VALUES(read_time),updated_label=VALUES(updated_label),content_json=VALUES(content_json),sort_order=VALUES(sort_order),
  is_featured=VALUES(is_featured),is_published=VALUES(is_published);

/* Classify and re-order the existing high-value pairings. */
UPDATE comparisons SET sort_order=1,is_featured=TRUE,content_json=JSON_SET(COALESCE(content_json,JSON_OBJECT()),'$.matchType','direct-alternatives','$.matchLabel','Direct alternatives','$.whyCompare','These flagship automatic litter boxes compete for the same premium buyer but use open-top camera-led and rotating-globe approaches.','$.decisionQuestion','Which flagship cleaning and health-monitoring workflow better fits your cats?') WHERE slug='petlibro-luma-vs-litter-robot-4';
UPDATE comparisons SET sort_order=3,content_json=JSON_SET(COALESCE(content_json,JSON_OBJECT()),'$.matchType','direct-alternatives','$.matchLabel','Direct alternatives','$.whyCompare','Both are premium automatic litter boxes with different open-top and rotating-globe structures.','$.decisionQuestion','Which premium automatic litter box creates the better daily workflow?') WHERE slug='litter-robot-4-vs-petkit-pura-max';
UPDATE comparisons SET sort_order=5,content_json=JSON_SET(COALESCE(content_json,JSON_OBJECT()),'$.matchType','premium-vs-value','$.matchLabel','Premium vs value','$.whyCompare','This is a deliberate premium-versus-basic comparison for owners deciding whether a connected rotating system justifies the added cost.','$.decisionQuestion','Which premium functions justify moving beyond a basic crystal-tray system?') WHERE slug='litter-robot-4-vs-petsafe-scoopfree';
UPDATE comparisons SET sort_order=6,content_json=JSON_SET(COALESCE(content_json,JSON_OBJECT()),'$.matchType','same-brand-fit','$.matchLabel','Same-brand fit','$.whyCompare','Both trackers use the Tractive ecosystem; the real decision is device size, battery, waterproofing, and intended dog fit.','$.decisionQuestion','Which Tractive size and battery profile fits your dog?') WHERE slug='tractive-gps-vs-fi-series-3';
UPDATE comparisons SET sort_order=8,content_json=JSON_SET(COALESCE(content_json,JSON_OBJECT()),'$.matchType','direct-alternatives','$.matchLabel','Direct alternatives','$.whyCompare','Both are subscription-backed dog trackers competing on live location, escape alerts, health signals, and coverage.','$.decisionQuestion','Which dog tracker fits your coverage and health-monitoring priorities?') WHERE slug='whistle-go-explore-vs-tractive-gps';
UPDATE comparisons SET sort_order=10,content_json=JSON_SET(COALESCE(content_json,JSON_OBJECT()),'$.matchType','premium-vs-value','$.matchLabel','Premium vs value','$.whyCompare','Both automate dry-food schedules, while price, connectivity, portion evidence, and camera functions create the buying tension.','$.decisionQuestion','Which feeder functions are worth paying more for?') WHERE slug='petlibro-granary-vs-arf-pets-feeder';
UPDATE comparisons SET sort_order=12,content_json=JSON_SET(COALESCE(content_json,JSON_OBJECT()),'$.matchType','direct-alternatives','$.matchLabel','Direct alternatives','$.whyCompare','Both are pet-specific cameras with two-way audio and treat interaction at different price and coverage levels.','$.decisionQuestion','Which pet-camera interaction and coverage model better fits your home?') WHERE slug='furbo-360-vs-petcube-bites-2';

UPDATE site_settings
SET setting_value=JSON_SET(setting_value,'$.description','We research automatic litter boxes, GPS trackers, smart feeders, pet cameras, and smart water fountains with documented methods, dated sources, and clear commercial disclosures.')
WHERE setting_key='home';
