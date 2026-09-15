-- Amazon.com US primary-offer snapshot captured from the exact ASIN pages on
-- 2026-09-14. No coupon, financing, used, recommendation-card, or alternate
-- seller price is used. Petcube B0CBK46PSZ showed no primary offer, so its
-- price remains NULL and the observed status is recorded explicitly.

UPDATE products SET price=184.00, price_display='$184.00', amazon_availability='In Stock',
  commerce_checked_at='2026-09-14 00:00:00', marketplace_domain='amazon.com', delivery_country_code='US', updated_label='Sep 2026'
WHERE external_id='B09GDQZLD1';

UPDATE products SET price=NULL, price_display=NULL, amazon_availability='No primary offer shown',
  commerce_checked_at='2026-09-14 00:00:00', marketplace_domain='amazon.com', delivery_country_code='US', updated_label='Sep 2026'
WHERE external_id='B0CBK46PSZ';

UPDATE products SET amazon_availability='In Stock', commerce_checked_at='2026-09-14 00:00:00', marketplace_domain='amazon.com', delivery_country_code='US', updated_label='Sep 2026'
WHERE external_id IN (
  'B0FDKQGRCK', 'B0F9FC7JYD', 'B00EVBXI5S', 'B07MZDTG76', 'B0DJ3JR93D',
  'B004GWSIJ8', 'B099HBMZ67', 'B01LZDV5X3', 'B019W0OH48', 'B0CLB3VFB8',
  'B004IQ6EZ2', 'B0B1F73ZTS', 'B0064ACNLO'
);
