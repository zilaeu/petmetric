SET NAMES utf8mb4;

-- Give every product from the expansion a usable filter profile and review landing page.
INSERT INTO product_tags (product_id,tag,sort_order)
SELECT p.id,v.tag,v.sort_order FROM products p JOIN (
  SELECT 'petkit-pura-max-2' slug,'Premium globe' tag,1 sort_order UNION ALL SELECT 'petkit-pura-max-2','Odor control',2 UNION ALL
  SELECT 'catgenie-ai','Self-washing' ,1 UNION ALL SELECT 'catgenie-ai','Plumbed install',2 UNION ALL
  SELECT 'wopet-7l-smart-feeder','Large hopper',1 UNION ALL SELECT 'wopet-7l-smart-feeder','App optional',2 UNION ALL
  SELECT 'petsafe-smart-feed-2','App control',1 UNION ALL SELECT 'petsafe-smart-feed-2','Conveyor outlet',2 UNION ALL
  SELECT 'fi-series-3-smart-collar','LTE tracking',1 UNION ALL SELECT 'fi-series-3-smart-collar','Geofencing',2 UNION ALL
  SELECT 'pawscout-smarter-tracker','Lightweight',1 UNION ALL SELECT 'pawscout-smarter-tracker','Community coverage',2 UNION ALL
  SELECT 'eufy-pet-camera-s350','Pan and tilt',1 UNION ALL SELECT 'eufy-pet-camera-s350','Local storage',2 UNION ALL
  SELECT 'petkit-petwant-camera','Wide angle',1 UNION ALL SELECT 'petkit-petwant-camera','PETKIT ecosystem',2 UNION ALL
  SELECT 'pioneer-raindrop-stainless','Stainless steel',1 UNION ALL SELECT 'pioneer-raindrop-stainless','Wide drinking surface',2 UNION ALL
  SELECT 'catit-flower-stainless','Adjustable flow',1 UNION ALL SELECT 'catit-flower-stainless','Compact',2 UNION ALL
  SELECT 'petsafe-smartdoor-microchip','Selective access',1 UNION ALL SELECT 'petsafe-smartdoor-microchip','Schedules',2 UNION ALL
  SELECT 'sureflap-dualscan-connect','DualScan',1 UNION ALL SELECT 'sureflap-dualscan-connect','Multi-cat',2 UNION ALL
  SELECT 'whistle-health-monitor','Activity trends',1 UNION ALL SELECT 'whistle-health-monitor','Sleep tracking',2 UNION ALL
  SELECT 'petivity-smart-litter-monitor-2','Collar-free',1 UNION ALL SELECT 'petivity-smart-litter-monitor-2','Weight trends',2
) v ON v.slug=p.slug WHERE NOT EXISTS (SELECT 1 FROM product_tags t WHERE t.product_id=p.id AND t.tag=v.tag);

INSERT INTO product_specs (product_id,spec_key,label,value,sort_order)
SELECT p.id,v.spec_key,v.label,v.value,v.sort_order FROM products p JOIN (
  SELECT 'petkit-pura-max-2' slug,'cat_count' spec_key,'Cats' label,'1–3 cats' value,1 sort_order UNION ALL SELECT 'petkit-pura-max-2','litter_type','Litter','Clumping',2 UNION ALL SELECT 'petkit-pura-max-2','app','Connectivity','App',3 UNION ALL SELECT 'petkit-pura-max-2','noise','Noise','Quiet cycle',4 UNION ALL
  SELECT 'catgenie-ai','cat_count','Cats','1–3 cats',1 UNION ALL SELECT 'catgenie-ai','litter_type','Litter','Washable granules',2 UNION ALL SELECT 'catgenie-ai','app','Connectivity','Wi-Fi app',3 UNION ALL SELECT 'catgenie-ai','installation','Install','Plumbing required',4 UNION ALL
  SELECT 'wopet-7l-smart-feeder','capacity','Capacity','7 L hopper',1 UNION ALL SELECT 'wopet-7l-smart-feeder','accuracy','Accuracy','Standard portions',2 UNION ALL SELECT 'wopet-7l-smart-feeder','camera','Camera','Optional camera model',3 UNION ALL SELECT 'wopet-7l-smart-feeder','power','Power','Backup battery',4 UNION ALL
  SELECT 'petsafe-smart-feed-2','capacity','Capacity','5 L hopper',1 UNION ALL SELECT 'petsafe-smart-feed-2','accuracy','Accuracy','Conveyor portions',2 UNION ALL SELECT 'petsafe-smart-feed-2','app','Connectivity','Wi-Fi app',3 UNION ALL SELECT 'petsafe-smart-feed-2','power','Power','Backup battery',4 UNION ALL
  SELECT 'fi-series-3-smart-collar','coverage','Coverage','LTE coverage',1 UNION ALL SELECT 'fi-series-3-smart-collar','battery','Battery','Up to 3 months',2 UNION ALL SELECT 'fi-series-3-smart-collar','tracking','Tracking','Live location',3 UNION ALL SELECT 'fi-series-3-smart-collar','waterproof','Water resistance','Waterproof collar',4 UNION ALL
  SELECT 'pawscout-smarter-tracker','coverage','Coverage','Bluetooth + community',1 UNION ALL SELECT 'pawscout-smarter-tracker','battery','Battery','Several weeks',2 UNION ALL SELECT 'pawscout-smarter-tracker','weight','Weight','Lightweight',3 UNION ALL SELECT 'pawscout-smarter-tracker','subscription','Plan','Optional',4 UNION ALL
  SELECT 'eufy-pet-camera-s350','field_of_view','View','Pan and tilt',1 UNION ALL SELECT 'eufy-pet-camera-s350','resolution','Resolution','4K sensor',2 UNION ALL SELECT 'eufy-pet-camera-s350','storage','Storage','Local SD storage',3 UNION ALL SELECT 'eufy-pet-camera-s350','audio','Audio','Two-way audio',4 UNION ALL
  SELECT 'petkit-petwant-camera','field_of_view','View','Wide angle',1 UNION ALL SELECT 'petkit-petwant-camera','resolution','Resolution','1080p HD',2 UNION ALL SELECT 'petkit-petwant-camera','storage','Storage','Cloud plan optional',3 UNION ALL SELECT 'petkit-petwant-camera','audio','Audio','Two-way audio',4 UNION ALL
  SELECT 'pioneer-raindrop-stainless','capacity','Capacity','60 oz',1 UNION ALL SELECT 'pioneer-raindrop-stainless','material','Top','Stainless steel',2 UNION ALL SELECT 'pioneer-raindrop-stainless','pump','Pump','Quiet pump',3 UNION ALL SELECT 'pioneer-raindrop-stainless','app','Connectivity','No app',4 UNION ALL
  SELECT 'catit-flower-stainless','capacity','Capacity','100 oz',1 UNION ALL SELECT 'catit-flower-stainless','material','Top','Stainless steel',2 UNION ALL SELECT 'catit-flower-stainless','flow','Flow','3 settings',3 UNION ALL SELECT 'catit-flower-stainless','app','Connectivity','No app',4 UNION ALL
  SELECT 'petsafe-smartdoor-microchip','access','Access','Microchip + app',1 UNION ALL SELECT 'petsafe-smartdoor-microchip','opening','Opening','Medium pet opening',2 UNION ALL SELECT 'petsafe-smartdoor-microchip','weather','Weather','Weather sealed',3 UNION ALL SELECT 'petsafe-smartdoor-microchip','power','Power','Battery powered',4 UNION ALL
  SELECT 'sureflap-dualscan-connect','access','Access','DualScan microchip',1 UNION ALL SELECT 'sureflap-dualscan-connect','opening','Opening','Cat-sized opening',2 UNION ALL SELECT 'sureflap-dualscan-connect','permissions','Permissions','Per-cat in/out',3 UNION ALL SELECT 'sureflap-dualscan-connect','hub','Connectivity','Hub optional',4 UNION ALL
  SELECT 'whistle-health-monitor','signals','Signals','Activity + sleep',1 UNION ALL SELECT 'whistle-health-monitor','battery','Battery','Multi-day battery',2 UNION ALL SELECT 'whistle-health-monitor','weight','Fit','Collar wearable',3 UNION ALL SELECT 'whistle-health-monitor','subscription','Plan','Required for insights',4 UNION ALL
  SELECT 'petivity-smart-litter-monitor-2','signals','Signals','Visits + weight',1 UNION ALL SELECT 'petivity-smart-litter-monitor-2','cats','Cats','Multi-cat profiles',2 UNION ALL SELECT 'petivity-smart-litter-monitor-2','fit','Fit','Under-box sensor',3 UNION ALL SELECT 'petivity-smart-litter-monitor-2','subscription','Plan','None required',4
) v ON v.slug=p.slug WHERE NOT EXISTS (SELECT 1 FROM product_specs s WHERE s.product_id=p.id AND s.spec_key=v.spec_key AND s.value=v.value);

INSERT INTO product_reviews (product_id,summary,gallery_json,quick_specs_json,strengths_json,limitations_json,sections_json,research_date,price_checked_date,next_review_label,source_count)
SELECT p.id,
  CONCAT(p.name,' is a ',LOWER(p.verdict),' PetMetric review focuses on setup, daily reliability, ongoing cost, and the fit for ',LOWER(p.best_for),'.'),
  JSON_ARRAY(p.image_url),
  JSON_ARRAY(JSON_OBJECT('label','Price','value',COALESCE(p.price_display,'See current listing')),JSON_OBJECT('label','Subscription','value',COALESCE(p.subscription,'Not stated')),JSON_OBJECT('label','PetMetric score','value',CONCAT(COALESCE(p.score,'—'),' / 5')),JSON_OBJECT('label','Best for','value',p.best_for)),
  JSON_ARRAY(CONCAT('Clear fit for ',LOWER(p.best_for)), 'Published price and ownership trade-offs are called out explicitly.'),
  JSON_ARRAY('Real-world fit, app behavior, and availability can vary by household.', 'Recheck current price, stock, and compatibility before purchase.'),
  JSON_ARRAY(JSON_OBJECT('title','What it is','body',p.verdict),JSON_OBJECT('title','Best for','body',p.best_for),JSON_OBJECT('title','Ownership notes','body',CONCAT('Plan for ',LOWER(COALESCE(p.subscription,'routine maintenance and setup checks')),'.'))),
  '2026-09-09','2026-09-09','December 2026',NULL
FROM products p
WHERE p.slug IN ('petkit-pura-max-2','catgenie-ai','wopet-7l-smart-feeder','petsafe-smart-feed-2','fi-series-3-smart-collar','pawscout-smarter-tracker','eufy-pet-camera-s350','petkit-petwant-camera','pioneer-raindrop-stainless','catit-flower-stainless','petsafe-smartdoor-microchip','sureflap-dualscan-connect','whistle-health-monitor','petivity-smart-litter-monitor-2')
ON DUPLICATE KEY UPDATE summary=VALUES(summary),gallery_json=VALUES(gallery_json),quick_specs_json=VALUES(quick_specs_json),strengths_json=VALUES(strengths_json),limitations_json=VALUES(limitations_json),sections_json=VALUES(sections_json),research_date=VALUES(research_date),price_checked_date=VALUES(price_checked_date),next_review_label=VALUES(next_review_label);
