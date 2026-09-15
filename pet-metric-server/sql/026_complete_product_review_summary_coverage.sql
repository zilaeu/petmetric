/*
  Complete qualitative owner-review coverage for the published product
  catalog. Review themes describe only the Amazon review bodies visible on
  2026-09-07; they are not PetMetricus test results or frequency estimates.
*/
SET NAMES utf8mb4;

INSERT INTO product_user_review_summaries
  (product_id,source_name,source_url,checked_at,rating,review_count,visible_review_count,rating_distribution_json,summary,positives_json,concerns_json,themes_json,sample_note)
SELECT p.id,'Amazon.com','https://www.amazon.com/product-reviews/B0C75D8QZ9/?reviewerType=all_reviews','2026-09-07',3.8,4239,8,NULL,
  'Owners value the reassurance of GPS location, virtual-fence alerts, and activity history, with several describing the app as straightforward to use. Reported problems center on battery life away from power-saving Wi-Fi, live-location delays, unreliable nearby finding tools, a quiet sound, the required subscription, and breakaway collars that can leave the tracker behind.',
  JSON_ARRAY(
    'GPS location, virtual fences, and location history help owners understand where an outdoor cat has been and respond when it leaves a familiar area.',
    'The app presents location, activity, sleep, and territory information in a format owners generally find easy to navigate.',
    'Some owners report several days of battery life when the tracker can spend substantial time in a correctly configured power-saving zone.'
  ),
  JSON_ARRAY(
    'Battery life can fall to roughly two to four days when power saving is unavailable or live tracking is used more heavily.',
    'Power-saving Wi-Fi can delay live GPS, while Bluetooth-based nearby finding and the tracker sound may not be dependable enough to locate a hidden device quickly.',
    'A paid subscription is required, and some owners report delayed position updates or periods when live tracking is unavailable.',
    'Breakaway collars can release as intended but leave owners searching for a detached tracker.'
  ),
  JSON_ARRAY(
    JSON_OBJECT('label','Location history and boundary alerts add reassurance','mentions',0,'kind','positive','detail','Owners use the map, virtual fences, and location history to follow outdoor routines, identify a cat''s usual territory, and react when it travels beyond a familiar area.'),
    JSON_OBJECT('label','Activity information makes the app useful day to day','mentions',0,'kind','positive','detail','Reviews describe the app as easy to use and value seeing activity, sleep, and movement patterns alongside the core location tools.'),
    JSON_OBJECT('label','Power-saving zones can extend usable battery life','mentions',0,'kind','positive','detail','Some owners obtain roughly three to five days or longer when the tracker regularly connects to a correctly configured home power-saving zone.'),
    JSON_OBJECT('label','Live tracking and battery life depend on conditions','mentions',0,'kind','concern','detail','Owners report battery life ranging from about forty hours to several days, as well as delayed position updates or periods when live mode does not become available.'),
    JSON_OBJECT('label','Nearby recovery tools may not be strong enough','mentions',0,'kind','concern','detail','Bluetooth radar can be inconsistent at close range and the tracker''s sound is described as quiet, making a device hidden in vegetation or inside a building harder to find.'),
    JSON_OBJECT('label','Subscription and breakaway fit add ownership friction','mentions',0,'kind','concern','detail','The tracker requires a paid plan, while a safety-release collar can detach outdoors and turn recovery into a search for the tracker rather than the cat.')
  ),
  'Based on 8 featured review bodies visible on the Amazon.com product page on 2026-09-07. Amazon selects the displayed reviews, and battery life, GPS latency, cellular coverage, Wi-Fi layout, and collar behavior vary by household; these observations are not a random sample of all 4,239 ratings.'
FROM products p
WHERE p.slug='jiobit-smart-tag'
ON DUPLICATE KEY UPDATE
  source_name=VALUES(source_name),source_url=VALUES(source_url),checked_at=VALUES(checked_at),
  rating=VALUES(rating),review_count=VALUES(review_count),visible_review_count=VALUES(visible_review_count),
  rating_distribution_json=VALUES(rating_distribution_json),summary=VALUES(summary),
  positives_json=VALUES(positives_json),concerns_json=VALUES(concerns_json),themes_json=VALUES(themes_json),
  sample_note=VALUES(sample_note);

/*
  The exact CATLINK Luxury Pro-X page showed no ratings or review bodies.
  Store that verified absence so the UI can explain the evidence gap instead
  of hiding the owner-experience section or borrowing feedback from a model
  that was not compared.
*/
INSERT INTO product_user_review_summaries
  (product_id,source_name,source_url,checked_at,rating,review_count,visible_review_count,rating_distribution_json,summary,positives_json,concerns_json,themes_json,sample_note)
SELECT p.id,'Amazon.com','https://www.amazon.com/product-reviews/B0GX2P4R8Y/?reviewerType=all_reviews','2026-09-07',NULL,0,0,NULL,
  'The Amazon.com page for this exact CATLINK Scooper Luxury Pro-X listing did not contain enough owner feedback to summarize product-specific advantages or problems.',
  JSON_ARRAY(),JSON_ARRAY(),JSON_ARRAY(),
  'The exact listing showed 0 global ratings and no visible review bodies on 2026-09-07. Reviews for other CATLINK litter-box models were not used because their hardware and ownership experience may differ.'
FROM products p
WHERE p.slug='catlink-luxury-pro-x'
ON DUPLICATE KEY UPDATE
  source_name=VALUES(source_name),source_url=VALUES(source_url),checked_at=VALUES(checked_at),
  rating=VALUES(rating),review_count=VALUES(review_count),visible_review_count=VALUES(visible_review_count),
  rating_distribution_json=VALUES(rating_distribution_json),summary=VALUES(summary),
  positives_json=VALUES(positives_json),concerns_json=VALUES(concerns_json),themes_json=VALUES(themes_json),
  sample_note=VALUES(sample_note);

UPDATE products
SET amazon_rating=3.8,amazon_review_count=4239
WHERE slug='jiobit-smart-tag';

UPDATE products
SET amazon_rating=NULL,amazon_review_count=0
WHERE slug='catlink-luxury-pro-x';
