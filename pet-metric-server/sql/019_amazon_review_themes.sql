/* Replace broad pros/cons bullets with recurring, count-backed review themes. */
SET NAMES utf8mb4;

ALTER TABLE product_user_review_summaries
  ADD COLUMN themes_json JSON NULL AFTER concerns_json;

UPDATE product_user_review_summaries s
JOIN products p ON p.id=s.product_id
SET s.visible_review_count=12,
    s.sample_note=CASE p.external_id
      WHEN 'B09S8WMJY9' THEN 'Based on 12 relevant featured reviews visible across the U.S. and international sections of the Amazon.com product page on 2026-09-07. One accessory-only review was excluded. Amazon groups colors, sizes, and configurations on one listing, so theme counts are limited to this visible sample and are not frequencies across all 10,218 ratings.'
      WHEN 'B00VIXRB6O' THEN 'Based on 12 featured reviews visible across the U.S. and international sections of the Amazon.com product page on 2026-09-07. Amazon selects these reviews rather than PetMetric drawing a random sample, so theme counts apply only to the reviews read—not all 6,411 ratings.'
      ELSE s.sample_note
    END,
    s.themes_json = CASE p.external_id
  WHEN 'B09S8WMJY9' THEN JSON_ARRAY(
    JSON_OBJECT('label','Portion settings are widely discussed','mentions',9,'kind','mixed','detail','9 of 12 reviews discuss portion size or consistency. Owners like the flexible schedule, but several measure early servings or want finer increments for their kibble and pet.'),
    JSON_OBJECT('label','App setup and scheduled feeding','mentions',8,'kind','positive','detail','8 of 12 reviews describe connecting the feeder, setting meal times, or changing portions as easy or convenient after setup.'),
    JSON_OBJECT('label','Alerts add reassurance','mentions',5,'kind','positive','detail','5 of 12 reviews mention low-food, blockage, offline, camera, or indicator alerts as useful feedback when the owner is away.'),
    JSON_OBJECT('label','Reliability and support are uneven','mentions',3,'kind','concern','detail','3 of 12 reviews describe a motor or power-port failure and then discuss replacement parts or customer-service response.'),
    JSON_OBJECT('label','Voice and dispensing noise','mentions',2,'kind','concern','detail','2 of 12 reviews specifically call out the grinding or food-drop sound, or describe the recorded speaker as quiet or unclear.'),
    JSON_OBJECT('label','Lid and bowl details matter','mentions',2,'kind','concern','detail','2 of 12 reviews mention awkward lid-lock handling or replacing the metal bowl because of its size or noise.')
  )
  WHEN 'B00VIXRB6O' THEN JSON_ARRAY(
    JSON_OBJECT('label','Reliable scheduled meals','mentions',12,'kind','positive','detail','All 12 visible reviews describe scheduled feeding as dependable or useful, including accounts updated after five and eight years of service.'),
    JSON_OBJECT('label','Portion control supports feeding routines','mentions',11,'kind','positive','detail','11 of 12 reviews discuss measured portions, smaller meals, or slow feeding; several connect the routine with less begging, overeating, or vomiting in their household.'),
    JSON_OBJECT('label','Programming depends on the manual','mentions',11,'kind','mixed','detail','11 of 12 reviews discuss setup or programming. Several call it easy with the instructions, while others say the button combinations are counter-intuitive.'),
    JSON_OBJECT('label','The supplied bowl and chute shape feeding','mentions',8,'kind','concern','detail','8 of 12 reviews mention the oversized or noisy bowl, awkward clearance for smaller bowls, food scatter, or owners making a tray or ramp.'),
    JSON_OBJECT('label','Large hopper and offline operation help travel','mentions',7,'kind','positive','detail','7 of 12 reviews value the large food reservoir, battery operation, and no-Wi-Fi schedule for vacations or busy days.'),
    JSON_OBJECT('label','Pets may tip or reach the outlet','mentions',4,'kind','concern','detail','4 of 12 reviews describe cats bumping, tipping, or reaching toward the food path and using a board, tray, or barrier to stabilize access.')
  )
  ELSE JSON_ARRAY()
END
WHERE p.external_id IN ('B09S8WMJY9','B00VIXRB6O');
