/*
  Amazon customer-review snapshots

  These records summarize only the review content visible on the linked
  Amazon.com product page at the checked date. They are not PetMetricus tests,
  and they must not be presented as an analysis of every rating on a listing.
*/
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS product_user_review_summaries (
  product_id BIGINT UNSIGNED NOT NULL,
  source_name VARCHAR(100) NOT NULL DEFAULT 'Amazon.com',
  source_url VARCHAR(500) NOT NULL,
  checked_at DATE NOT NULL,
  rating DECIMAL(2,1) NULL,
  review_count INT UNSIGNED NULL,
  visible_review_count INT UNSIGNED NOT NULL DEFAULT 0,
  rating_distribution_json JSON NULL,
  summary TEXT NOT NULL,
  positives_json JSON NOT NULL,
  concerns_json JSON NOT NULL,
  sample_note TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (product_id),
  CONSTRAINT fk_user_review_summary_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

INSERT INTO product_user_review_summaries
  (product_id,source_name,source_url,checked_at,rating,review_count,visible_review_count,rating_distribution_json,summary,positives_json,concerns_json,sample_note)
SELECT id,'Amazon.com','https://www.amazon.com/dp/B09S8WMJY9','2026-09-07',4.1,10218,8,
  JSON_OBJECT('5',66,'4',11,'3',5,'2',4,'1',14),
  'The visible reviews most often describe a convenient app-controlled feeding routine with flexible schedules and useful status alerts. The clearest reservations concern durability or support when a unit fails, plus practical details such as dispensing noise, the voice speaker, lid handling, and portion consistency with different kibble.',
  JSON_ARRAY(
    'Owners repeatedly describe app setup, meal scheduling, and portion changes as straightforward once connected.',
    'Scheduled feeding is credited with making busy days and early mornings easier while keeping pets on a repeatable routine.',
    'Low-food, blockage, offline, and desiccant reminders are highlighted as useful reassurance when the owner is away.',
    'Several reviewers value the hopper capacity, compact footprint, and the ability to tailor meal timing and size.'
  ),
  JSON_ARRAY(
    'Some reviewers report a motor, power-port, or complete-unit failure after months of use and mixed experiences obtaining support.',
    'Food hitting the bowl and the dispensing mechanism can be audible; one reviewer also found the recorded-voice speaker quiet and unclear.',
    'The lid-lock position and custom voice setup can take trial and error.',
    'Portion output can vary with setup and kibble shape, so owners may need to measure initial servings and watch for jams.'
  ),
  'Based on 8 U.S. top reviews visible on the Amazon.com product page on 2026-09-07, not all 10,218 ratings. Amazon groups colors, sizes, and configurations on one listing, and some visible reviews reference a camera-equipped variant rather than the selected 5L feeder.'
FROM products WHERE external_id='B09S8WMJY9'
ON DUPLICATE KEY UPDATE
  source_name=VALUES(source_name),source_url=VALUES(source_url),checked_at=VALUES(checked_at),rating=VALUES(rating),review_count=VALUES(review_count),
  visible_review_count=VALUES(visible_review_count),rating_distribution_json=VALUES(rating_distribution_json),summary=VALUES(summary),
  positives_json=VALUES(positives_json),concerns_json=VALUES(concerns_json),sample_note=VALUES(sample_note);

INSERT INTO product_user_review_summaries
  (product_id,source_name,source_url,checked_at,rating,review_count,visible_review_count,rating_distribution_json,summary,positives_json,concerns_json,sample_note)
SELECT id,'Amazon.com','https://www.amazon.com/dp/B00VIXRB6O','2026-09-07',4.2,6411,8,
  JSON_OBJECT('5',65,'4',17,'3',7,'2',4,'1',7),
  'The visible reviews emphasize dependable scheduled feeding, a large hopper, and portion control without relying on Wi-Fi. Recurring tradeoffs are an unintuitive control panel, clock drift on battery power, and a bowl or dispenser layout that some cat owners modify for easier, quieter feeding.',
  JSON_ARRAY(
    'Multiple owners describe dependable scheduled feeding, including accounts of five to eight years of service.',
    'Small scheduled portions are credited with reducing begging, overeating, and food-related vomiting in some households.',
    'The large hopper and battery operation are valued for travel and for continuing meals without a network connection.',
    'Reviewers often praise the secure food storage and conveyor-based portioning once the feeder is set up and primed.'
  ),
  JSON_ARRAY(
    'The button combinations are frequently described as counter-intuitive, making the manual important when changing a schedule.',
    'Some owners report that the clock gradually loses time when the feeder runs on batteries.',
    'The supplied bowl can feel oversized or noisy for cats, and the dispenser clearance makes smaller replacement bowls awkward.',
    'Determined cats may tip, bump, or reach into the outlet, and the conveyor needs to be primed after filling or tipping.'
  ),
  'Based on 8 U.S. top reviews visible on the Amazon.com product page on 2026-09-07, not all 6,411 ratings. Featured reviews are selected by Amazon rather than sampled by PetMetricus, so themes indicate issues to investigate, not their frequency across all owners.'
FROM products WHERE external_id='B00VIXRB6O'
ON DUPLICATE KEY UPDATE
  source_name=VALUES(source_name),source_url=VALUES(source_url),checked_at=VALUES(checked_at),rating=VALUES(rating),review_count=VALUES(review_count),
  visible_review_count=VALUES(visible_review_count),rating_distribution_json=VALUES(rating_distribution_json),summary=VALUES(summary),
  positives_json=VALUES(positives_json),concerns_json=VALUES(concerns_json),sample_note=VALUES(sample_note);

UPDATE products
SET amazon_rating=4.1, amazon_review_count=10218
WHERE external_id='B09S8WMJY9';

UPDATE products
SET amazon_rating=4.2, amazon_review_count=6411
WHERE external_id='B00VIXRB6O';
