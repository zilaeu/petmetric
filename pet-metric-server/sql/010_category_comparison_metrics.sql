SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS comparison_metric_definitions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  category_id BIGINT UNSIGNED NOT NULL,
  metric_key VARCHAR(100) NOT NULL,
  label VARCHAR(160) NOT NULL,
  help_text TEXT NULL,
  comparison_rule ENUM('contextual','higher','lower') NOT NULL DEFAULT 'contextual',
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (id),
  UNIQUE KEY uq_comparison_metric_category_key (category_id, metric_key),
  KEY idx_comparison_metric_category_sort (category_id, is_published, sort_order),
  CONSTRAINT fk_comparison_metric_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS product_metric_values (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  metric_definition_id BIGINT UNSIGNED NOT NULL,
  display_value VARCHAR(255) NOT NULL,
  numeric_value DECIMAL(12,3) NULL,
  source_url VARCHAR(1000) NULL,
  checked_at DATETIME NULL,
  confidence ENUM('limited','moderate','high') NOT NULL DEFAULT 'limited',
  PRIMARY KEY (id),
  UNIQUE KEY uq_product_metric_value (product_id, metric_definition_id),
  KEY idx_product_metric_product (product_id),
  CONSTRAINT fk_product_metric_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_product_metric_definition FOREIGN KEY (metric_definition_id) REFERENCES comparison_metric_definitions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO comparison_metric_definitions (category_id,metric_key,label,help_text,comparison_rule,sort_order) VALUES
((SELECT id FROM categories WHERE slug='automatic-litter-boxes'),'design','Design','Open and enclosed designs suit different cats; this is contextual, not a universal winner.','contextual',1),
((SELECT id FROM categories WHERE slug='automatic-litter-boxes'),'cleaning_system','Cleaning system','How waste is separated and collected.','contextual',2),
((SELECT id FROM categories WHERE slug='automatic-litter-boxes'),'multi_cat_tracking','Multi-cat tracking','Whether the listing states that individual cats or visits can be distinguished.','contextual',3),
((SELECT id FROM categories WHERE slug='automatic-litter-boxes'),'minimum_cat_weight','Minimum cat weight / kitten safety','Verify the manufacturer minimum before enabling automatic cycles.','contextual',4),
((SELECT id FROM categories WHERE slug='automatic-litter-boxes'),'litter_compatibility','Litter compatibility','Unsupported litter may reduce cleaning performance or damage the unit.','contextual',5),
((SELECT id FROM categories WHERE slug='automatic-litter-boxes'),'safety_system','Safety sensors and anti-pinch design','Must be verified from manufacturer safety documentation.','contextual',6),

((SELECT id FROM categories WHERE slug='gps-pet-trackers'),'tracking_mode','Location tracking','The type of live or real-time location capability stated by the listing.','contextual',1),
((SELECT id FROM categories WHERE slug='gps-pet-trackers'),'virtual_fence','Virtual fence / escape alerts','Whether the listing states that boundary alerts are available.','contextual',2),
((SELECT id FROM categories WHERE slug='gps-pet-trackers'),'battery_claim','Battery claim','Manufacturer or listing claim; real battery life varies with signal and live mode.','contextual',3),
((SELECT id FROM categories WHERE slug='gps-pet-trackers'),'pet_fit','Pet size and fit','Device and attachment must safely fit the intended pet.','contextual',4),
((SELECT id FROM categories WHERE slug='gps-pet-trackers'),'waterproofing','Waterproof rating','Verify the stated IP rating before swimming or prolonged water exposure.','contextual',5),
((SELECT id FROM categories WHERE slug='gps-pet-trackers'),'coverage','Coverage and network','Coverage in the owner’s actual area matters more than nominal feature count.','contextual',6),

((SELECT id FROM categories WHERE slug='smart-pet-feeders'),'capacity','Food capacity','Choose for refill frequency and food freshness, not simply the largest hopper.','contextual',1),
((SELECT id FROM categories WHERE slug='smart-pet-feeders'),'meal_schedule','Scheduled meals','Maximum scheduled meals stated by the listing.','contextual',2),
((SELECT id FROM categories WHERE slug='smart-pet-feeders'),'connectivity','Connectivity','Check router compatibility and whether schedules continue offline.','contextual',3),
((SELECT id FROM categories WHERE slug='smart-pet-feeders'),'camera','Camera','Camera availability and stated resolution when present.','contextual',4),
((SELECT id FROM categories WHERE slug='smart-pet-feeders'),'portion_control','Portion control','Stated controls do not prove dispensing accuracy with every kibble shape.','contextual',5),
((SELECT id FROM categories WHERE slug='smart-pet-feeders'),'backup_power','Backup power','Verify how long schedules continue during an outage.','contextual',6),

((SELECT id FROM categories WHERE slug='pet-cameras'),'resolution','Video resolution','Stated capture resolution; image quality also depends on optics and lighting.','contextual',1),
((SELECT id FROM categories WHERE slug='pet-cameras'),'coverage','Room coverage','Fixed, pan/tilt, and 360-degree designs cover different spaces.','contextual',2),
((SELECT id FROM categories WHERE slug='pet-cameras'),'night_vision','Night vision','Whether night vision is stated and whether it is color or monochrome.','contextual',3),
((SELECT id FROM categories WHERE slug='pet-cameras'),'two_way_audio','Two-way audio','Some pets find remote voices reassuring; others may become more anxious.','contextual',4),
((SELECT id FROM categories WHERE slug='pet-cameras'),'treat_interaction','Treat interaction','Check treat dimensions and supervise initial use.','contextual',5),
((SELECT id FROM categories WHERE slug='pet-cameras'),'storage_privacy','Storage and privacy controls','Verify local/cloud storage, encryption, retention, and privacy-shutter options.','contextual',6)
ON DUPLICATE KEY UPDATE label=VALUES(label),help_text=VALUES(help_text),comparison_rule=VALUES(comparison_rule),sort_order=VALUES(sort_order),is_published=TRUE;

INSERT INTO product_metric_values (product_id,metric_definition_id,display_value,source_url,checked_at,confidence)
SELECT p.id,m.id,v.display_value,p.merchant_url,p.commerce_checked_at,'limited'
FROM products p
JOIN (
  SELECT 'B0GTM9P94B' asin,'design' metric_key,'Large open-top' display_value UNION ALL
  SELECT 'B0GTM9P94B','multi_cat_tracking','Multi-cat recognition and usage tracking' UNION ALL
  SELECT 'B0GD69KW7J','design','Open-top' UNION ALL
  SELECT 'B0D4GHS7V6','cleaning_system','Self-cleaning' UNION ALL
  SELECT 'B0GX2P4R8Y','cleaning_system','Self-cleaning' UNION ALL
  SELECT 'B07WZPJ2LW','cleaning_system','Self-cleaning crystal tray' UNION ALL
  SELECT 'B07WZPJ2LW','design','Uncovered' UNION ALL
  SELECT 'B07WZPJ2LW','litter_compatibility','Crystal tray system' UNION ALL
  SELECT 'B0D6Z4L6BW','tracking_mode','Live GPS' UNION ALL
  SELECT 'B0D6Z4L6BW','virtual_fence','Virtual fence stated' UNION ALL
  SELECT 'B0G52NY6HZ','tracking_mode','Live GPS' UNION ALL
  SELECT 'B0G52NY6HZ','battery_claim','Up to 6 weeks (listing claim)' UNION ALL
  SELECT 'B0H6GGW9RH','tracking_mode','Live location' UNION ALL
  SELECT 'B0H6GGW9RH','virtual_fence','Escape alerts stated' UNION ALL
  SELECT 'B0H6GGW9RH','battery_claim','Up to 14 days (listing claim)' UNION ALL
  SELECT 'B0C75D8QZ9','tracking_mode','Real-time location' UNION ALL
  SELECT 'B0C75D8QZ9','battery_claim','Up to 5 days (listing claim)' UNION ALL
  SELECT 'B0C75D8QZ9','pet_fit','Cats 6.5 lb+' UNION ALL
  SELECT 'B09S8WMJY9','capacity','5 L' UNION ALL
  SELECT 'B09S8WMJY9','meal_schedule','Up to 10 meals/day' UNION ALL
  SELECT 'B09S8WMJY9','connectivity','5 GHz Wi-Fi stated' UNION ALL
  SELECT 'B0CFFKWYH6','connectivity','2.4 GHz Wi-Fi' UNION ALL
  SELECT 'B0CFFKWYH6','camera','1080p with night vision' UNION ALL
  SELECT 'B00VIXRB6O','capacity','24 cups' UNION ALL
  SELECT 'B00VIXRB6O','meal_schedule','Up to 12 meals/day' UNION ALL
  SELECT 'B00VIXRB6O','portion_control','Programmable' UNION ALL
  SELECT 'B09LD2CD1L','capacity','4 L' UNION ALL
  SELECT 'B09LD2CD1L','portion_control','Programmable portion control' UNION ALL
  SELECT 'B09GDQZLD1','coverage','360° rotating live view' UNION ALL
  SELECT 'B09GDQZLD1','two_way_audio','Yes' UNION ALL
  SELECT 'B09GDQZLD1','treat_interaction','Treat toss' UNION ALL
  SELECT 'B0CBK46PSZ','resolution','1080p HD' UNION ALL
  SELECT 'B0CBK46PSZ','two_way_audio','Yes' UNION ALL
  SELECT 'B0CBK46PSZ','treat_interaction','Treat dispenser' UNION ALL
  SELECT 'B0856W45VL','coverage','Pan and tilt' UNION ALL
  SELECT 'B08R59YH7W','resolution','1080p HD' UNION ALL
  SELECT 'B08R59YH7W','night_vision','Color night vision' UNION ALL
  SELECT 'B08R59YH7W','two_way_audio','Yes'
) v ON v.asin=p.external_id
JOIN comparison_metric_definitions m ON m.category_id=p.category_id AND m.metric_key=v.metric_key
ON DUPLICATE KEY UPDATE display_value=VALUES(display_value),source_url=VALUES(source_url),checked_at=VALUES(checked_at),confidence=VALUES(confidence);
