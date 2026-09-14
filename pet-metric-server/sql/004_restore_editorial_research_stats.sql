-- Only productCategories is relational data. The remaining values describe
-- editorial coverage beyond the records currently imported into this database.
INSERT INTO site_settings (setting_key, setting_value)
VALUES ('research_stats', JSON_OBJECT('productsResearched', 103, 'latestUpdate', 'Sep 2026', 'sourceCitations', 412))
ON DUPLICATE KEY UPDATE setting_value = JSON_SET(
  setting_value,
  '$.productsResearched', 103,
  '$.latestUpdate', 'Sep 2026',
  '$.sourceCitations', 412
);

UPDATE site_settings
SET setting_value = JSON_REMOVE(setting_value, '$.productCategories')
WHERE setting_key = 'research_stats';
