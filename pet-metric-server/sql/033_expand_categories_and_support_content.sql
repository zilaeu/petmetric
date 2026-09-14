SET NAMES utf8mb4;

UPDATE site_settings SET setting_value=JSON_SET(setting_value,'$.description','We research automatic litter boxes, GPS trackers, smart feeders, pet cameras, smart water fountains, smart pet doors, and pet health monitors with documented methods, dated sources, and clear commercial disclosures.') WHERE setting_key='home';

INSERT INTO categories
  (slug,title,eyebrow,description,subtitle,product_count,comparison_count,price_range,top_pick,top_score,image_url,image_key,alt_text,updated_label,sort_order,is_published)
VALUES
  ('smart-pet-doors','Smart Pet Doors','Access technology','Connected and microchip pet doors compared on access control, fit, weather sealing, and reliability.','Choose by pet size and access reliability first. App history and schedules are useful only when the door remains safe, weather-resistant, and dependable.',3,'1','$170–$499','SureFlap Microchip Pet Door Connect',4.0,'https://images.unsplash.com/photo-1544568100-847a948585b9?w=900&h=600&fit=crop&auto=format','categories/smart-pet-doors.webp','Dog standing near a home doorway','Sep 2026',6,TRUE),
  ('pet-health-monitors','Pet Health Monitors','Wellness technology','Connected collars and home sensors compared on trend visibility, battery life, comfort, and subscription cost.','Health monitors can surface trends, but they do not diagnose illness. Compare wearability, data clarity, battery life, and the limits of each signal.',3,'1','$99–$249','PetPace Smart Collar',4.0,'https://images.unsplash.com/photo-1552053831-71594a27632d?w=900&h=600&fit=crop&auto=format','categories/pet-health-monitors.webp','Dog wearing a connected health collar','Sep 2026',7,TRUE)
ON DUPLICATE KEY UPDATE title=VALUES(title),eyebrow=VALUES(eyebrow),description=VALUES(description),subtitle=VALUES(subtitle),updated_label=VALUES(updated_label),sort_order=VALUES(sort_order),is_published=TRUE;

INSERT INTO category_criteria (category_id,title,description,icon,sort_order)
SELECT c.id,v.title,v.description,NULL,v.sort_order
FROM categories c
JOIN (
  SELECT 'smart-pet-doors' slug,'Pet and opening fit' title,'Match flap dimensions, pet weight, wall or door thickness, and installation requirements.' description,1 sort_order UNION ALL
  SELECT 'smart-pet-doors','Access reliability','Check recognition speed, lock behavior, manual override, and how the door behaves when power or connectivity fails.',2 UNION ALL
  SELECT 'smart-pet-doors','Weather and security','Compare sealing, draft control, locking strength, and resistance to unwanted animals.',3 UNION ALL
  SELECT 'smart-pet-doors','Power and connectivity','Compare batteries, alerts, hubs, Wi-Fi requirements, and offline schedule behavior.',4 UNION ALL
  SELECT 'pet-health-monitors','Wearability and fit','Confirm collar size, device weight, contact points, and whether continuous wear is realistic.',1 UNION ALL
  SELECT 'pet-health-monitors','Signals and limitations','Distinguish activity, sleep, temperature, pulse, breathing, and location trends from diagnostic claims.',2 UNION ALL
  SELECT 'pet-health-monitors','Battery and continuity','Long gaps in wear or charging can make trends harder to interpret.',3 UNION ALL
  SELECT 'pet-health-monitors','Data access and cost','Check subscription terms, export options, sharing, retention, and privacy controls.',4
) v ON v.slug=c.slug
WHERE NOT EXISTS (SELECT 1 FROM category_criteria cc WHERE cc.category_id=c.id AND cc.title=v.title);

INSERT INTO products
  (external_id,category_id,slug,name,brand,price,price_display,subscription,score,verdict,best_for,image_url,image_key,alt_text,merchant_name,merchant_url,updated_label,rank_order,is_featured,is_published)
VALUES
  ('door-sureflap',(SELECT id FROM categories WHERE slug='smart-pet-doors'),'sureflap-microchip-pet-door-connect','SureFlap Microchip Pet Door Connect','Sure Petcare',249.00,'$249','Hub required; no mandatory plan',4.0,'Selective microchip access and curfew schedules are useful, while installation fit and hub placement need checking first.','Multi-pet homes needing selective access','https://images.unsplash.com/photo-1544568100-847a948585b9?w=700&h=520&fit=crop&auto=format','products/sureflap-connect.webp','SureFlap connected microchip pet door','Sure Petcare','https://www.surepetcare.com/','Sep 2026',1,TRUE,TRUE),
  ('door-petsafe',(SELECT id FROM categories WHERE slug='smart-pet-doors'),'petsafe-smartdoor-connected','PetSafe SmartDoor Connected','PetSafe',499.00,'$499','None required',3.8,'App schedules and selective entry suit larger pets, but price and installation footprint are substantial.','Dog owners who want app-managed access','https://images.unsplash.com/photo-1558788353-f76d92427f16?w=700&h=520&fit=crop&auto=format','products/petsafe-smartdoor-connected.webp','PetSafe connected smart pet door','PetSafe','https://www.petsafe.com/','Sep 2026',2,FALSE,TRUE),
  ('door-sureflap-cat',(SELECT id FROM categories WHERE slug='smart-pet-doors'),'sureflap-microchip-cat-flap','SureFlap Microchip Cat Flap','Sure Petcare',169.00,'$169','None required',3.7,'A simpler microchip-only cat flap for owners who need selective entry without an app or hub.','Cat owners wanting reliable selective entry','https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=700&h=520&fit=crop&auto=format','products/sureflap-microchip-cat-flap.webp','SureFlap microchip cat flap','Sure Petcare','https://www.surepetcare.com/','Sep 2026',3,FALSE,TRUE),
  ('health-petpace',(SELECT id FROM categories WHERE slug='pet-health-monitors'),'petpace-smart-collar','PetPace Smart Collar','PetPace',249.00,'$249','Monitoring plan required',4.0,'Continuous wellness trends cover more signals than activity-only collars, but comfort, plan cost, and veterinary interpretation matter.','Owners monitoring an older or recovering pet with veterinary guidance','https://images.unsplash.com/photo-1552053831-71594a27632d?w=700&h=520&fit=crop&auto=format','products/petpace-smart-collar.webp','PetPace smart pet health collar','PetPace','https://petpace.com/','Sep 2026',1,TRUE,TRUE),
  ('health-invoxia',(SELECT id FROM categories WHERE slug='pet-health-monitors'),'invoxia-smart-dog-collar','Invoxia Smart Dog Collar','Invoxia',149.00,'$149','Cellular plan may be required',3.8,'Location and wellness trends share one collar, with signal interpretation and regional service coverage requiring care.','Dog owners who want location and activity trends together','https://images.unsplash.com/photo-1558788353-f76d92427f16?w=700&h=520&fit=crop&auto=format','products/invoxia-smart-dog-collar.webp','Invoxia connected dog collar','Invoxia','https://www.invoxia.com/','Sep 2026',2,FALSE,TRUE),
  ('health-petivity',(SELECT id FROM categories WHERE slug='pet-health-monitors'),'petivity-smart-litter-box-monitor','Petivity Smart Litter Box Monitor','Petivity',99.00,'$99','None stated',3.7,'A non-wearable way to track litter-box weight and visit patterns, limited by placement and multi-cat identification.','Cat owners who prefer a non-wearable monitor','https://images.unsplash.com/photo-1574158622682-e40e69881006?w=700&h=520&fit=crop&auto=format','products/petivity-smart-litter-box-monitor.webp','Petivity smart litter box monitor','Petivity','https://www.petivity.com/','Sep 2026',3,FALSE,TRUE)
ON DUPLICATE KEY UPDATE category_id=VALUES(category_id),name=VALUES(name),brand=VALUES(brand),price=VALUES(price),price_display=VALUES(price_display),subscription=VALUES(subscription),score=VALUES(score),verdict=VALUES(verdict),best_for=VALUES(best_for),image_url=VALUES(image_url),image_key=VALUES(image_key),alt_text=VALUES(alt_text),merchant_name=VALUES(merchant_name),merchant_url=VALUES(merchant_url),updated_label=VALUES(updated_label),rank_order=VALUES(rank_order),is_featured=VALUES(is_featured),is_published=TRUE;

INSERT INTO comparisons
  (slug,category_id,product_a_id,product_b_id,product_a_name,product_b_name,verdict,views_count,read_time,updated_label,content_json,sort_order,is_featured,is_published)
VALUES
  ('sureflap-connect-vs-petsafe-smartdoor',(SELECT id FROM categories WHERE slug='smart-pet-doors'),(SELECT id FROM products WHERE slug='sureflap-microchip-pet-door-connect'),(SELECT id FROM products WHERE slug='petsafe-smartdoor-connected'),'SureFlap Microchip Pet Door Connect','PetSafe SmartDoor Connected','SureFlap emphasizes microchip-led selective access for smaller pets; PetSafe emphasizes a larger connected door and app-managed schedules. Installation fit is the first decision.',0,'8 min read','Sep 2026',JSON_OBJECT('matchType','direct-alternatives','matchLabel','Direct alternatives','whyCompare','Both manage selective pet access with connected schedules.','decisionQuestion','Which door fits your pet, opening, and preferred access workflow?'),17,FALSE,TRUE),
  ('petpace-vs-invoxia-smart-collar',(SELECT id FROM categories WHERE slug='pet-health-monitors'),(SELECT id FROM products WHERE slug='petpace-smart-collar'),(SELECT id FROM products WHERE slug='invoxia-smart-dog-collar'),'PetPace Smart Collar','Invoxia Smart Dog Collar','PetPace emphasizes continuous wellness signals; Invoxia combines location and activity trends. Neither should be treated as a diagnostic replacement for veterinary care.',0,'8 min read','Sep 2026',JSON_OBJECT('matchType','feature-tradeoff','matchLabel','Different approaches','whyCompare','Both turn collar data into ongoing pet trends but prioritize different signals.','decisionQuestion','Do you need broader wellness monitoring or location plus everyday activity trends?'),18,FALSE,TRUE)
ON DUPLICATE KEY UPDATE category_id=VALUES(category_id),product_a_id=VALUES(product_a_id),product_b_id=VALUES(product_b_id),product_a_name=VALUES(product_a_name),product_b_name=VALUES(product_b_name),verdict=VALUES(verdict),content_json=VALUES(content_json),updated_label=VALUES(updated_label),sort_order=VALUES(sort_order),is_published=TRUE;

INSERT INTO comparison_best_for (comparison_id,pick_name,audience,sort_order)
SELECT x.id,v.pick_name,v.audience,v.sort_order FROM comparisons x JOIN (
  SELECT 'sureflap-connect-vs-petsafe-smartdoor' slug,'SureFlap Microchip Pet Door Connect' pick_name,'Best fit for cats and small pets needing microchip-based selective entry.' audience,1 sort_order UNION ALL
  SELECT 'sureflap-connect-vs-petsafe-smartdoor','PetSafe SmartDoor Connected','Best fit for larger dogs when the opening and installation requirements are met.',2 UNION ALL
  SELECT 'petpace-vs-invoxia-smart-collar','PetPace Smart Collar','Best fit when a veterinarian is helping interpret broader wellness trends.',1 UNION ALL
  SELECT 'petpace-vs-invoxia-smart-collar','Invoxia Smart Dog Collar','Best fit when location and daily activity are the main priorities.',2
) v ON v.slug=x.slug WHERE NOT EXISTS (SELECT 1 FROM comparison_best_for b WHERE b.comparison_id=x.id AND b.pick_name=v.pick_name);

INSERT INTO comparison_criteria (comparison_id,label,product_a_value,product_b_value,winner,sort_order)
SELECT x.id,v.label,v.a_value,v.b_value,v.winner,v.sort_order FROM comparisons x JOIN (
  SELECT 'sureflap-connect-vs-petsafe-smartdoor' slug,'Primary access method' label,'Microchip recognition' a_value,'Connected collar key' b_value,'tie' winner,1 sort_order UNION ALL
  SELECT 'sureflap-connect-vs-petsafe-smartdoor','Best pet fit','Cats and smaller pets','Medium and large dogs','tie',2 UNION ALL
  SELECT 'sureflap-connect-vs-petsafe-smartdoor','Connected control','Hub and app','Wi-Fi and app','tie',3 UNION ALL
  SELECT 'petpace-vs-invoxia-smart-collar','Primary focus','Continuous wellness trends','Location and activity trends','tie',1 UNION ALL
  SELECT 'petpace-vs-invoxia-smart-collar','Veterinary context','Especially important','Important for abnormal trends','tie',2 UNION ALL
  SELECT 'petpace-vs-invoxia-smart-collar','Location tracking','Not the primary function','Included where service is supported','b',3
) v ON v.slug=x.slug WHERE NOT EXISTS (SELECT 1 FROM comparison_criteria c WHERE c.comparison_id=x.id AND c.label=v.label);

INSERT INTO best_picks
  (slug,category_id,category_label,title,pick_product_id,pick_name,budget,tradeoff,image_url,image_key,content_json,sort_order,is_published)
VALUES
  ('best-smart-pet-door-selective-entry',(SELECT id FROM categories WHERE slug='smart-pet-doors'),'Smart Pet Doors','Best smart pet door for selective entry',(SELECT id FROM products WHERE slug='sureflap-microchip-pet-door-connect'),'SureFlap Microchip Pet Door Connect','$249 plus compatible hub','Best for compatible smaller pets; confirm opening dimensions before purchase.',(SELECT image_url FROM categories WHERE slug='smart-pet-doors'),'best-picks/selective-entry-door.webp',JSON_OBJECT('why','Microchip recognition can admit selected pets without an extra collar key','notFor','Large dogs or openings outside the supported dimensions'),11,TRUE),
  ('best-pet-health-monitor-vet-guided-trends',(SELECT id FROM categories WHERE slug='pet-health-monitors'),'Health Monitors','Best pet health monitor for vet-guided trends',(SELECT id FROM products WHERE slug='petpace-smart-collar'),'PetPace Smart Collar','$249 plus monitoring plan','Broad signals require comfortable continuous wear and professional interpretation.',(SELECT image_url FROM categories WHERE slug='pet-health-monitors'),'best-picks/vet-guided-health.webp',JSON_OBJECT('why','Broader continuous wellness signals than activity-only trackers','notFor','Owners seeking diagnosis from an app or avoiding subscriptions'),12,TRUE),
  ('best-non-wearable-cat-health-monitor',(SELECT id FROM categories WHERE slug='pet-health-monitors'),'Health Monitors','Best non-wearable cat health monitor',(SELECT id FROM products WHERE slug='petivity-smart-litter-box-monitor'),'Petivity Smart Litter Box Monitor','$99','Useful litter-box trends depend on stable placement and reliable cat identification.',(SELECT image_url FROM categories WHERE slug='pet-health-monitors'),'best-picks/non-wearable-cat-monitor.webp',JSON_OBJECT('why','Tracks weight and litter-box visits without asking a cat to wear a device','notFor','Homes where multiple cats cannot be distinguished reliably'),13,TRUE)
ON DUPLICATE KEY UPDATE title=VALUES(title),pick_product_id=VALUES(pick_product_id),pick_name=VALUES(pick_name),budget=VALUES(budget),tradeoff=VALUES(tradeoff),content_json=VALUES(content_json),sort_order=VALUES(sort_order),is_published=TRUE;

INSERT INTO troubleshooting_guides
  (slug,category_id,product_id,product_name,problem,title,description,difficulty,estimated_time,views_count,updated_label,content_json,sort_order,is_published)
VALUES
  ('sureflap-pet-door-not-recognizing-chip',(SELECT id FROM categories WHERE slug='smart-pet-doors'),(SELECT id FROM products WHERE slug='sureflap-microchip-pet-door-connect'),'SureFlap Microchip Pet Door Connect','Pet door does not recognize a registered microchip','SureFlap pet door not recognizing a microchip','Check registration, approach position, batteries, and the tunnel area before repeating the learn sequence.','Easy fix','15 min',0,'Sep 2026',JSON_OBJECT('safety','Keep the manual lock available so a pet is not trapped during testing.'),12,TRUE),
  ('petsafe-smartdoor-offline',(SELECT id FROM categories WHERE slug='smart-pet-doors'),(SELECT id FROM products WHERE slug='petsafe-smartdoor-connected'),'PetSafe SmartDoor Connected','SmartDoor appears offline in the app','PetSafe SmartDoor offline','Separate door power, Wi-Fi reach, account pairing, and app status before resetting saved access rules.','Moderate','20 min',0,'Sep 2026',JSON_OBJECT('safety','Use the manual lock state recommended by PetSafe while connectivity is unavailable.'),13,TRUE),
  ('petpace-collar-not-syncing',(SELECT id FROM categories WHERE slug='pet-health-monitors'),(SELECT id FROM products WHERE slug='petpace-smart-collar'),'PetPace Smart Collar','Collar data has stopped syncing','PetPace collar not syncing','Confirm charge, fit, gateway status, and recent timestamps without treating missing app data as proof of a health change.','Moderate','20 min',0,'Sep 2026',JSON_OBJECT('safety','Contact a veterinarian about symptoms regardless of whether the collar is syncing.'),14,TRUE),
  ('petivity-monitor-wrong-cat-weight',(SELECT id FROM categories WHERE slug='pet-health-monitors'),(SELECT id FROM products WHERE slug='petivity-smart-litter-box-monitor'),'Petivity Smart Litter Box Monitor','Weight is assigned to the wrong cat','Petivity assigning weight to the wrong cat','Check placement, profile ranges, overlapping visits, and recent baseline weights before editing pet assignments.','Easy fix','15 min',0,'Sep 2026',JSON_OBJECT('safety','Unexpected weight loss or litter-box changes should be discussed with a veterinarian.'),15,TRUE),
  ('petkit-eversweet-pump-not-running',(SELECT id FROM categories WHERE slug='smart-water-fountains'),(SELECT id FROM products WHERE slug='petkit-eversweet-3'),'PETKIT Eversweet 3','Pump is not moving water','PETKIT Eversweet pump not running','Check water level, power, impeller debris, and reassembly in a safe order.','Easy fix','15 min',0,'Sep 2026',JSON_OBJECT('safety','Disconnect power before removing or cleaning the pump.'),16,TRUE),
  ('catit-pixi-not-connecting',(SELECT id FROM categories WHERE slug='smart-water-fountains'),(SELECT id FROM products WHERE slug='catit-pixi-smart-fountain'),'Catit PIXI Smart Fountain','Fountain will not connect to the app','Catit PIXI app connection problem','Verify supported Wi-Fi, phone permissions, pairing state, and router distance before resetting the fountain.','Moderate','20 min',0,'Sep 2026',JSON_OBJECT('safety','Keep fresh water available in a separate bowl during setup.'),17,TRUE)
ON DUPLICATE KEY UPDATE category_id=VALUES(category_id),product_id=VALUES(product_id),product_name=VALUES(product_name),problem=VALUES(problem),title=VALUES(title),description=VALUES(description),difficulty=VALUES(difficulty),estimated_time=VALUES(estimated_time),updated_label=VALUES(updated_label),content_json=VALUES(content_json),sort_order=VALUES(sort_order),is_published=TRUE;

INSERT INTO troubleshooting_steps (guide_id,instruction,sort_order)
SELECT g.id,v.instruction,v.sort_order FROM troubleshooting_guides g JOIN (
  SELECT 'sureflap-pet-door-not-recognizing-chip' slug,'Install fresh batteries and confirm the low-battery indicator is clear.' instruction,1 sort_order UNION ALL
  SELECT 'sureflap-pet-door-not-recognizing-chip','Confirm the pet is registered and approaching through the center of the tunnel.',2 UNION ALL
  SELECT 'sureflap-pet-door-not-recognizing-chip','Clean the tunnel and sensor area with the manufacturer-approved method.',3 UNION ALL
  SELECT 'sureflap-pet-door-not-recognizing-chip','Repeat the documented learn sequence once, then contact support if recognition still fails.',4 UNION ALL
  SELECT 'petsafe-smartdoor-offline','Confirm the door has power and responds to its local controls.',1 UNION ALL
  SELECT 'petsafe-smartdoor-offline','Check that the configured Wi-Fi network is available at the installation point.',2 UNION ALL
  SELECT 'petsafe-smartdoor-offline','Restart the app and door once without deleting pet access rules.',3 UNION ALL
  SELECT 'petsafe-smartdoor-offline','Re-pair only after recording the existing access schedule.',4 UNION ALL
  SELECT 'petpace-collar-not-syncing','Check collar charge and the timestamp of the last successful reading.',1 UNION ALL
  SELECT 'petpace-collar-not-syncing','Confirm the collar fit follows the manufacturer guidance.',2 UNION ALL
  SELECT 'petpace-collar-not-syncing','Check gateway power, network access, and account status.',3 UNION ALL
  SELECT 'petpace-collar-not-syncing','Contact PetPace support if a charged collar still sends no readings.',4 UNION ALL
  SELECT 'petivity-monitor-wrong-cat-weight','Confirm the monitor is level and centered under the litter box.',1 UNION ALL
  SELECT 'petivity-monitor-wrong-cat-weight','Review each cat profile and recent baseline weight.',2 UNION ALL
  SELECT 'petivity-monitor-wrong-cat-weight','Check whether two cats entered close together.',3 UNION ALL
  SELECT 'petivity-monitor-wrong-cat-weight','Correct the assignment only after verifying the matching visit.',4 UNION ALL
  SELECT 'petkit-eversweet-pump-not-running','Disconnect power and confirm the tank is filled to the required level.',1 UNION ALL
  SELECT 'petkit-eversweet-pump-not-running','Remove the pump cover and clear hair or debris from the impeller.',2 UNION ALL
  SELECT 'petkit-eversweet-pump-not-running','Reassemble the water path and confirm every connector is seated.',3 UNION ALL
  SELECT 'petkit-eversweet-pump-not-running','Run one supervised test; replace the pump if it remains silent.',4 UNION ALL
  SELECT 'catit-pixi-not-connecting','Confirm the phone is using the supported Wi-Fi band.',1 UNION ALL
  SELECT 'catit-pixi-not-connecting','Move the fountain closer to the router for pairing.',2 UNION ALL
  SELECT 'catit-pixi-not-connecting','Restart the app and enter pairing mode once.',3 UNION ALL
  SELECT 'catit-pixi-not-connecting','Reset only after saving any maintenance history you need.',4
) v ON v.slug=g.slug
WHERE NOT EXISTS (SELECT 1 FROM troubleshooting_steps s WHERE s.guide_id=g.id AND s.instruction=v.instruction);
