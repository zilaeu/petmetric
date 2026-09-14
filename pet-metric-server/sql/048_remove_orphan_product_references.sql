/* Ensure every published page only names products present in the published list. */
SET NAMES utf8mb4;

/* Rewrite legacy copy after the ASIN identity cleanup. */
UPDATE comparisons
SET verdict='Whisker Litter-Robot 4 is the more established rotating option; Neakasa M1 Plus offers an open-top design with a different cat-fit trade-off.',
    home_verdict='Litter-Robot 4 for a mature rotating workflow; Neakasa for an open-top entry.'
WHERE slug='litter-robot-4-vs-neakasa-m1-plus' AND is_published=TRUE;

UPDATE comparisons
SET verdict='Both products are Tractive GPS trackers; the decision is device size, battery profile, and intended dog fit.',
    home_verdict='Choose the DOG 6 for standard dog fit; choose the XL model for larger dogs and longer battery intervals.'
WHERE slug='tractive-gps-vs-fi-series-3' AND is_published=TRUE;

UPDATE comparisons
SET verdict='PETLIBRO Granary emphasizes connected portion control; VOLUAS keeps scheduled feeding simple at a lower hardware price.',
    home_verdict='PETLIBRO for connected control; VOLUAS for straightforward scheduled meals.'
WHERE slug='petlibro-granary-vs-arf-pets-feeder' AND is_published=TRUE;

UPDATE comparisons
SET verdict='Life360 combines GPS, escape alerts, and activity features; Tractive XL focuses on long-battery GPS tracking for larger dogs.',
    home_verdict='Life360 for a broader care app; Tractive XL for long-battery GPS tracking.'
WHERE slug='life360-vs-tractive-xl-smart-dog' AND is_published=TRUE;

/* Keep embedded comparison metadata in sync with the same visible names. */
UPDATE comparisons
SET content_json = REPLACE(CAST(content_json AS CHAR), 'Fi Series 3', 'Tractive DOG 6 Smart GPS Tracker'),
    product_a_name = CASE WHEN product_a_id=(SELECT id FROM products WHERE slug='fi-series-3') THEN 'Tractive DOG 6 Smart GPS Tracker' ELSE product_a_name END,
    product_b_name = CASE WHEN product_b_id=(SELECT id FROM products WHERE slug='fi-series-3') THEN 'Tractive DOG 6 Smart GPS Tracker' ELSE product_b_name END
WHERE is_published=TRUE AND CAST(content_json AS CHAR) LIKE '%Fi Series 3%';

UPDATE comparisons
SET content_json = REPLACE(CAST(content_json AS CHAR), 'Arf Pets Feeder', 'VOLUAS Automatic Cat Feeder')
WHERE is_published=TRUE AND CAST(content_json AS CHAR) LIKE '%Arf Pets Feeder%';

UPDATE comparisons
SET content_json = REPLACE(CAST(content_json AS CHAR), 'Whistle GO Explore', 'Life360 Pet GPS Tracker')
WHERE is_published=TRUE AND CAST(content_json AS CHAR) LIKE '%Whistle GO Explore%';

UPDATE best_picks
SET content_json = REPLACE(CAST(content_json AS CHAR), 'Fi Series 3', 'Tractive DOG 6 Smart GPS Tracker')
WHERE is_published=TRUE AND CAST(content_json AS CHAR) LIKE '%Fi Series 3%';

UPDATE categories
SET top_pick='Tractive DOG 6 Smart GPS Tracker'
WHERE slug='gps-pet-trackers' AND is_published=TRUE;

/* Remove child rows belonging to unpublished comparisons/picks/guides. */
DELETE cb FROM comparison_best_for cb LEFT JOIN comparisons c ON c.id=cb.comparison_id WHERE c.id IS NULL OR c.is_published=FALSE;
DELETE cc FROM comparison_criteria cc LEFT JOIN comparisons c ON c.id=cc.comparison_id WHERE c.id IS NULL OR c.is_published=FALSE;
DELETE ts FROM troubleshooting_steps ts LEFT JOIN troubleshooting_guides tg ON tg.id=ts.guide_id WHERE tg.id IS NULL OR tg.is_published=FALSE;

/* Hard guardrail: no published relation may point at an unpublished product. */
UPDATE product_reviews r JOIN products p ON p.id=r.product_id SET r.is_published=FALSE WHERE p.is_published=FALSE;
DELETE t FROM product_tags t JOIN products p ON p.id=t.product_id WHERE p.is_published=FALSE;
DELETE s FROM product_specs s JOIN products p ON p.id=s.product_id WHERE p.is_published=FALSE;
DELETE f FROM product_source_facts f JOIN products p ON p.id=f.product_id WHERE p.is_published=FALSE;
DELETE m FROM product_metric_values m JOIN products p ON p.id=m.product_id WHERE p.is_published=FALSE;
DELETE u FROM product_user_review_summaries u JOIN products p ON p.id=u.product_id WHERE p.is_published=FALSE;
