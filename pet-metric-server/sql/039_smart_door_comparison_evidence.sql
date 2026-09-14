SET NAMES utf8mb4;

INSERT INTO comparison_metric_definitions
  (category_id,metric_key,label,help_text,comparison_rule,sort_order,is_published)
VALUES
  ((SELECT id FROM categories WHERE slug='smart-pet-doors'),'access_method','Access method','How the door identifies an allowed pet.','contextual',1,TRUE),
  ((SELECT id FROM categories WHERE slug='smart-pet-doors'),'multi_pet','Multi-pet permissions','Whether separate pets can have individual entry and exit rules.','contextual',2,TRUE),
  ((SELECT id FROM categories WHERE slug='smart-pet-doors'),'opening_fit','Opening and pet fit','Match the clear opening to the pet, wall, and installation location.','contextual',3,TRUE),
  ((SELECT id FROM categories WHERE slug='smart-pet-doors'),'weather_security','Weather and security','Sealing, lock behavior, and resistance to unwanted entry.','contextual',4,TRUE),
  ((SELECT id FROM categories WHERE slug='smart-pet-doors'),'connectivity','Connectivity and alerts','App, hub, and notification requirements.','contextual',5,TRUE),
  ((SELECT id FROM categories WHERE slug='smart-pet-doors'),'power','Power and fallback','Battery, mains, and manual override behavior.','contextual',6,TRUE)
ON DUPLICATE KEY UPDATE label=VALUES(label),help_text=VALUES(help_text),comparison_rule=VALUES(comparison_rule),sort_order=VALUES(sort_order),is_published=TRUE;

INSERT INTO product_metric_values
  (product_id,metric_definition_id,display_value,source_url,checked_at,confidence,evidence_status)
SELECT p.id,m.id,v.display_value,p.merchant_url,'2026-09-09 00:00:00','limited',v.evidence_status
FROM products p JOIN (
  SELECT 'door-sureflap' external_id,'access_method' metric_key,'Microchip recognition' display_value,'explicit' evidence_status UNION ALL
  SELECT 'door-sureflap','multi_pet','Individual registered-pet access','claim' UNION ALL SELECT 'door-sureflap','opening_fit','Cat / small-pet opening','claim' UNION ALL SELECT 'door-sureflap','weather_security','Selective entry with locking flap','claim' UNION ALL SELECT 'door-sureflap','connectivity','Hub and app alerts','claim' UNION ALL SELECT 'door-sureflap','power','Battery powered with fallback lock','claim' UNION ALL
  SELECT 'door-petsafe-smartdoor','access_method','SmartKey / app-connected access','claim' UNION ALL SELECT 'door-petsafe-smartdoor','multi_pet','Schedules for registered pets','claim' UNION ALL SELECT 'door-petsafe-smartdoor','opening_fit','Medium pet opening; installation fit required','claim' UNION ALL SELECT 'door-petsafe-smartdoor','weather_security','Weather-sealed flap','claim' UNION ALL SELECT 'door-petsafe-smartdoor','connectivity','Wi-Fi app alerts','claim' UNION ALL SELECT 'door-petsafe-smartdoor','power','Battery powered','claim' UNION ALL
  SELECT 'door-petsafe','access_method','Connected SmartDoor access','claim' UNION ALL SELECT 'door-petsafe','multi_pet','Registered-pet permissions','claim' UNION ALL SELECT 'door-petsafe','opening_fit','Medium pet opening','claim' UNION ALL SELECT 'door-petsafe','weather_security','Weather seal and lock','claim' UNION ALL SELECT 'door-petsafe','connectivity','App-connected','claim' UNION ALL SELECT 'door-petsafe','power','Battery / mains options','claim' UNION ALL
  SELECT 'door-hightech','access_method','Collar-key recognition','explicit' UNION ALL SELECT 'door-hightech','multi_pet','Collar-key access for registered pets','claim' UNION ALL SELECT 'door-hightech','opening_fit','Large-dog motorized opening','claim' UNION ALL SELECT 'door-hightech','weather_security','Motorized lock and flap','claim' UNION ALL SELECT 'door-hightech','connectivity','Local collar-key control; app not required','explicit' UNION ALL SELECT 'door-hightech','power','Powered motor with manual override','claim' UNION ALL
  SELECT 'door-sureflap-dualscan','access_method','DualScan microchip recognition','explicit' UNION ALL SELECT 'door-sureflap-dualscan','multi_pet','Separate in/out permissions per cat','claim' UNION ALL SELECT 'door-sureflap-dualscan','opening_fit','Cat-sized opening','claim' UNION ALL SELECT 'door-sureflap-dualscan','weather_security','Selective access and locking flap','claim' UNION ALL SELECT 'door-sureflap-dualscan','connectivity','Hub optional; app alerts','claim' UNION ALL SELECT 'door-sureflap-dualscan','power','Battery powered','claim'
) v ON v.external_id=p.external_id
JOIN comparison_metric_definitions m ON m.category_id=p.category_id AND m.metric_key=v.metric_key
ON DUPLICATE KEY UPDATE display_value=VALUES(display_value),source_url=VALUES(source_url),checked_at=VALUES(checked_at),confidence=VALUES(confidence),evidence_status=VALUES(evidence_status);
