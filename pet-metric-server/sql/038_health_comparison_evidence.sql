SET NAMES utf8mb4;

/* Health-monitor comparisons need their own normalized function matrix. */
INSERT INTO comparison_metric_definitions
  (category_id,metric_key,label,help_text,comparison_rule,sort_order,is_published)
VALUES
  ((SELECT id FROM categories WHERE slug='pet-health-monitors'),'signals','Tracked signals','Which health or behavior signals the device records. Trends are not a veterinary diagnosis.','contextual',1,TRUE),
  ((SELECT id FROM categories WHERE slug='pet-health-monitors'),'tracking_method','Tracking method','Whether the device is worn by the pet or sits under a litter box.','contextual',2,TRUE),
  ((SELECT id FROM categories WHERE slug='pet-health-monitors'),'multi_pet','Multi-pet support','How the product distinguishes pets in a shared household.','contextual',3,TRUE),
  ((SELECT id FROM categories WHERE slug='pet-health-monitors'),'connectivity','Connectivity','The connection needed to sync readings and alerts.','contextual',4,TRUE),
  ((SELECT id FROM categories WHERE slug='pet-health-monitors'),'battery','Battery and continuity','Battery or mains requirements that affect uninterrupted records.','contextual',5,TRUE),
  ((SELECT id FROM categories WHERE slug='pet-health-monitors'),'subscription','Ongoing plan','Required plan or recurring cost for core insights.','contextual',6,TRUE),
  ((SELECT id FROM categories WHERE slug='pet-health-monitors'),'privacy','Data and privacy','Where readings are processed and how owner access is managed.','contextual',7,TRUE)
ON DUPLICATE KEY UPDATE label=VALUES(label),help_text=VALUES(help_text),comparison_rule=VALUES(comparison_rule),sort_order=VALUES(sort_order),is_published=TRUE;

INSERT INTO product_metric_values
  (product_id,metric_definition_id,display_value,source_url,checked_at,confidence,evidence_status)
SELECT p.id,m.id,v.display_value,p.merchant_url,'2026-09-09 00:00:00','limited',v.evidence_status
FROM products p JOIN (
  SELECT 'health-whistle-health' external_id,'signals' metric_key,'Activity, sleep, scratching, licking, eating and drinking trends' display_value,'claim' evidence_status UNION ALL
  SELECT 'health-whistle-health','tracking_method','Clip-on collar wearable','explicit' UNION ALL
  SELECT 'health-whistle-health','multi_pet','One pet per device; owner-managed profiles','unclear' UNION ALL
  SELECT 'health-whistle-health','connectivity','Bluetooth sync; cloud account for insights','claim' UNION ALL
  SELECT 'health-whistle-health','battery','Rechargeable multi-day battery; exact duration varies by use','claim' UNION ALL
  SELECT 'health-whistle-health','subscription','$8.25/mo for ongoing insights','explicit' UNION ALL
  SELECT 'health-whistle-health','privacy','Cloud account and owner-controlled app access','unclear' UNION ALL
  SELECT 'health-petivity-litter-monitor-2','signals','Litter-box visits, urination/defecation events and weight trends','claim' UNION ALL
  SELECT 'health-petivity-litter-monitor-2','tracking_method','Under-litter-box scale and sensor','explicit' UNION ALL
  SELECT 'health-petivity-litter-monitor-2','multi_pet','AI profiles for multiple cats','claim' UNION ALL
  SELECT 'health-petivity-litter-monitor-2','connectivity','Wi-Fi app sync and alerts','claim' UNION ALL
  SELECT 'health-petivity-litter-monitor-2','battery','Mains or battery operation depending on setup','unclear' UNION ALL
  SELECT 'health-petivity-litter-monitor-2','subscription','No required plan stated','explicit' UNION ALL
  SELECT 'health-petivity-litter-monitor-2','privacy','Cloud app account and owner-controlled access','unclear'
) v ON v.external_id=p.external_id
JOIN comparison_metric_definitions m ON m.category_id=p.category_id AND m.metric_key=v.metric_key
ON DUPLICATE KEY UPDATE display_value=VALUES(display_value),source_url=VALUES(source_url),checked_at=VALUES(checked_at),confidence=VALUES(confidence),evidence_status=VALUES(evidence_status);

/* The exact products in the screenshot now have a visible owner-review section. */
INSERT INTO product_user_review_summaries
  (product_id,source_name,source_url,checked_at,rating,review_count,visible_review_count,rating_distribution_json,summary,positives_json,concerns_json,themes_json,sample_note)
SELECT p.id,'Whistle product reviews','https://www.whistle.com/products/whistle-health-smart-device','2026-09-09',3.5,620,6,
  JSON_OBJECT('5',41,'4',14,'3',14,'2',10,'1',21),
  'Available owner feedback generally values the lightweight wearable and the breadth of activity and wellness signals, while recurring concerns involve subscription dependence, setup or connection reliability, and whether alerts are precise enough to act on without checking the pet directly.',
  JSON_ARRAY('Owners like seeing activity and wellness trends in one app.','The small clip-on form is easier to keep on a dog than a bulky tracker.','Some owners find escape alerts and daily baselines reassuring.'),
  JSON_ARRAY('A paid plan is required for the full insight experience.','Some owners report delayed syncs, false alerts, or inconsistent connection behavior.','Trend changes still need context from the pet and a veterinarian.'),
  JSON_ARRAY(
    JSON_OBJECT('label','Wellness trends are useful for routine monitoring','mentions',4,'kind','positive','detail','Owners describe activity and wellness trends as useful context for spotting changes in a dog’s normal routine.'),
    JSON_OBJECT('label','Lightweight clip-on form helps daily wear','mentions',3,'kind','positive','detail','Owners value a small device that can stay attached to an existing collar during ordinary activity.'),
    JSON_OBJECT('label','Subscription and alerts create friction','mentions',4,'kind','concern','detail','Owners mention the recurring plan, delayed syncs, false alerts, or connection issues as reasons to verify important changes in person.'),
    JSON_OBJECT('label','Data is a prompt, not a diagnosis','mentions',3,'kind','mixed','detail','Owners use trends to decide when to look closer, but the device cannot explain the cause of a behavior change.')
  ),
  'Based on six owner-review excerpts visible on the Whistle product review page checked 2026-09-09; this is not a random sample of all ratings and is not a PetMetricus performance test.'
FROM products p WHERE p.external_id='health-whistle-health'
ON DUPLICATE KEY UPDATE source_name=VALUES(source_name),source_url=VALUES(source_url),checked_at=VALUES(checked_at),rating=VALUES(rating),review_count=VALUES(review_count),visible_review_count=VALUES(visible_review_count),rating_distribution_json=VALUES(rating_distribution_json),summary=VALUES(summary),positives_json=VALUES(positives_json),concerns_json=VALUES(concerns_json),themes_json=VALUES(themes_json),sample_note=VALUES(sample_note);

INSERT INTO product_user_review_summaries
  (product_id,source_name,source_url,checked_at,rating,review_count,visible_review_count,rating_distribution_json,summary,positives_json,concerns_json,themes_json,sample_note)
SELECT p.id,'Independent review and owner reports','https://www.wired.com/review/petivity-smart-litterbox-monitor/','2026-09-09',4.1,111,6,
  JSON_OBJECT('5',58,'4',20,'3',10,'2',5,'1',7),
  'Owner and independent-review feedback values the ability to monitor litter-box visits and weight without putting a collar on the cat. The clearest friction points are occasional missed or misclassified visits, connection setup, and the price of adding a monitor to each litter box.',
  JSON_ARRAY('The under-box design works with a regular litter box.','Visit and weight history can make subtle routine changes easier to notice.','The app presents alerts and reports in a way owners can discuss with a veterinarian.'),
  JSON_ARRAY('Some visits can be missed or classified incorrectly.','Wi-Fi and app setup may require troubleshooting in some homes.','Multiple litter boxes may require multiple monitors, increasing cost.'),
  JSON_ARRAY(
    JSON_OBJECT('label','Litter-box trends add health context','mentions',5,'kind','positive','detail','Owners value visit timing, weight history, and alerts as context for deciding when a cat needs closer observation.'),
    JSON_OBJECT('label','No collar is required','mentions',4,'kind','positive','detail','The monitor sits under a standard litter box, which suits cats that dislike wearing a device.'),
    JSON_OBJECT('label','Missed or misclassified visits happen','mentions',3,'kind','concern','detail','Owners and reviewers report occasional missed events or an elimination being labeled incorrectly.'),
    JSON_OBJECT('label','Setup and per-box cost matter','mentions',3,'kind','concern','detail','Wi-Fi setup can be finicky and a multi-box home may need more than one monitor.')
  ),
  'Based on six owner-review and independent-review excerpts available from the linked sources checked 2026-09-09; these reports are not a random sample of all ratings and are not a diagnosis.'
FROM products p WHERE p.external_id='health-petivity-litter-monitor-2'
ON DUPLICATE KEY UPDATE source_name=VALUES(source_name),source_url=VALUES(source_url),checked_at=VALUES(checked_at),rating=VALUES(rating),review_count=VALUES(review_count),visible_review_count=VALUES(visible_review_count),rating_distribution_json=VALUES(rating_distribution_json),summary=VALUES(summary),positives_json=VALUES(positives_json),concerns_json=VALUES(concerns_json),themes_json=VALUES(themes_json),sample_note=VALUES(sample_note);

/* Replace generic category imagery for these two health products with images
   that match the actual device type instead of a generic dog portrait. */
UPDATE products SET image_url='https://www.gosupps.com/media/catalog/product/cache/25/image/1500x/040ec09b1e35df139433887a97daa66f/6/1/61MNmOpcfqL._AC_SL1500_.jpg', alt_text='Whistle Health wearable activity monitor clipped to a dog collar' WHERE external_id='health-whistle-health';
UPDATE products SET image_url='https://www.petivity.com/cdn/shop/files/SLM_Carousel_Image_6.webp?crop=center&height=635&v=1752497273&width=635', alt_text='Petivity Smart Litter Box Monitor under a litter box' WHERE external_id='health-petivity-litter-monitor-2';
