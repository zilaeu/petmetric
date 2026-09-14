/* Keep the homepage focused on reader decisions; disclosure details live on /disclosure/. */
SET NAMES utf8mb4;

UPDATE site_settings
SET setting_value = JSON_SET(
  setting_value,
  '$.description',
  'We turn product specifications, documented evidence, and ownership trade-offs into practical guidance for choosing pet technology that fits your pet and daily routine.'
)
WHERE setting_key = 'home';

UPDATE site_settings
SET setting_value = JSON_ARRAY(
  JSON_OBJECT('icon','🔬','title','Documented methods','body','Every research decision records the criteria, sources, and date.'),
  JSON_OBJECT('icon','📅','title','Dated and updated','body','Pages show a last-checked date and review schedule.'),
  JSON_OBJECT('icon','💬','title','Error correction','body','Readers can submit corrections for verification.'),
  JSON_OBJECT('icon','🎯','title','Practical conclusions','body','Every verdict explains who a product suits, the trade-offs that matter, and what to check before buying.')
)
WHERE setting_key = 'methodology';
