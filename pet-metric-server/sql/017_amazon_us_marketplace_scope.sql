/*
  Commerce research scope

  PetMetric uses Amazon.com as its only Amazon marketplace. Commerce snapshots
  (price, rating, review count, stock and delivery) are checked with the delivery
  country set to the United States. The country is stored with the snapshot so
  values from another regional marketplace or delivery destination are never
  mixed into the same comparison.
*/
SET NAMES utf8mb4;

ALTER TABLE products
  ADD COLUMN marketplace_domain VARCHAR(100) NOT NULL DEFAULT 'amazon.com' AFTER merchant_url,
  ADD COLUMN delivery_country_code CHAR(2) NOT NULL DEFAULT 'US' AFTER marketplace_domain;

ALTER TABLE product_source_facts
  ADD COLUMN marketplace_domain VARCHAR(100) NOT NULL DEFAULT 'amazon.com' AFTER source_url,
  ADD COLUMN delivery_country_code CHAR(2) NOT NULL DEFAULT 'US' AFTER marketplace_domain;

ALTER TABLE product_metric_values
  ADD COLUMN marketplace_domain VARCHAR(100) NOT NULL DEFAULT 'amazon.com' AFTER source_url,
  ADD COLUMN delivery_country_code CHAR(2) NOT NULL DEFAULT 'US' AFTER marketplace_domain;

UPDATE products
SET merchant_name='Amazon.com',
    merchant_url=CONCAT('https://www.amazon.com/dp/', external_id),
    marketplace_domain='amazon.com',
    delivery_country_code='US'
WHERE external_id REGEXP '^B[A-Z0-9]{9}$';

UPDATE product_source_facts sf
JOIN products p ON p.id=sf.product_id
SET sf.source_url=p.merchant_url,
    sf.marketplace_domain='amazon.com',
    sf.delivery_country_code='US'
WHERE p.external_id REGEXP '^B[A-Z0-9]{9}$';

UPDATE product_metric_values mv
JOIN products p ON p.id=mv.product_id
SET mv.source_url=p.merchant_url,
    mv.marketplace_domain='amazon.com',
    mv.delivery_country_code='US'
WHERE p.external_id REGEXP '^B[A-Z0-9]{9}$';

INSERT INTO site_settings (setting_key,setting_value) VALUES
('commerce_scope',JSON_OBJECT(
  'marketplace','Amazon.com',
  'marketplaceDomain','amazon.com',
  'deliveryCountry','United States',
  'deliveryCountryCode','US',
  'currency','USD',
  'note','Price, rating, review count, availability and delivery are captured from Amazon.com with delivery set to the United States.'
))
ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value);
