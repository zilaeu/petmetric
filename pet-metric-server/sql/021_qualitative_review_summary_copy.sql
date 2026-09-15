/* Demote counting language now that the UI presents qualitative pros and issues. */
SET NAMES utf8mb4;

UPDATE product_user_review_summaries s
JOIN products p ON p.id=s.product_id
SET s.themes_json=JSON_SET(s.themes_json,'$[0].label','Portion size can need calibration'),
    s.sample_note='Based on 12 relevant featured reviews visible across the U.S. and international sections of the Amazon.com product page on 2026-09-07. One accessory-only review was excluded. Amazon groups colors, sizes, and configurations on one listing, so this summary describes only the reviews read—not every experience represented by all 10,218 ratings.'
WHERE p.external_id='B09S8WMJY9';

UPDATE product_user_review_summaries s
JOIN products p ON p.id=s.product_id
SET s.sample_note='Based on 12 featured reviews visible across the U.S. and international sections of the Amazon.com product page on 2026-09-07. Amazon selects these reviews rather than PetMetricus drawing a random sample, so this summary describes only the reviews read—not every experience represented by all 6,411 ratings.'
WHERE p.external_id='B00VIXRB6O';
