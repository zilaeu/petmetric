SET NAMES utf8mb4;

ALTER TABLE products
  ADD COLUMN amazon_rating DECIMAL(2,1) NULL AFTER score,
  ADD COLUMN amazon_review_count INT UNSIGNED NULL AFTER amazon_rating,
  ADD COLUMN amazon_availability VARCHAR(80) NULL AFTER amazon_review_count,
  ADD COLUMN commerce_checked_at DATETIME NULL AFTER amazon_availability;

CREATE TABLE product_source_facts (
  product_id BIGINT UNSIGNED NOT NULL,
  source_name VARCHAR(80) NOT NULL,
  source_url VARCHAR(1000) NOT NULL,
  checked_at DATETIME NOT NULL,
  facts_json JSON NOT NULL,
  PRIMARY KEY (product_id, source_name),
  CONSTRAINT fk_product_source_facts_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

UPDATE products SET
  price=CASE external_id
    WHEN 'B0FFF2Y8R9' THEN 749.00 WHEN 'B0GTM9P94B' THEN 519.99
    WHEN 'B0GD69KW7J' THEN 434.58 WHEN 'B0D4GHS7V6' THEN 340.00
    WHEN 'B07WZPJ2LW' THEN 129.99 WHEN 'B0D6Z4L6BW' THEN 55.30
    WHEN 'B0G52NY6HZ' THEN 62.30 WHEN 'B0H6GGW9RH' THEN 99.00
    WHEN 'B0C75D8QZ9' THEN 49.99 WHEN 'B09S8WMJY9' THEN 71.99
    WHEN 'B0CFFKWYH6' THEN 99.99 WHEN 'B00VIXRB6O' THEN 82.99
    WHEN 'B09LD2CD1L' THEN 43.99 WHEN 'B09GDQZLD1' THEN 184.00
    WHEN 'B0CBK46PSZ' THEN 79.99 WHEN 'B0856W45VL' THEN 49.99
    WHEN 'B08R59YH7W' THEN 32.98 ELSE NULL END,
  price_display=CASE external_id
    WHEN 'B0FFF2Y8R9' THEN '$749.00' WHEN 'B0GTM9P94B' THEN '$519.99'
    WHEN 'B0GD69KW7J' THEN '$434.58' WHEN 'B0D4GHS7V6' THEN '$340.00'
    WHEN 'B07WZPJ2LW' THEN '$129.99' WHEN 'B0D6Z4L6BW' THEN '$55.30'
    WHEN 'B0G52NY6HZ' THEN '$62.30' WHEN 'B0H6GGW9RH' THEN '$99.00'
    WHEN 'B0C75D8QZ9' THEN '$49.99' WHEN 'B09S8WMJY9' THEN '$71.99'
    WHEN 'B0CFFKWYH6' THEN '$99.99' WHEN 'B00VIXRB6O' THEN '$82.99'
    WHEN 'B09LD2CD1L' THEN '$43.99' WHEN 'B09GDQZLD1' THEN '$184.00'
    WHEN 'B0CBK46PSZ' THEN '$79.99' WHEN 'B0856W45VL' THEN '$49.99'
    WHEN 'B08R59YH7W' THEN '$32.98' ELSE 'See current price on Amazon' END,
  amazon_rating=CASE external_id
    WHEN 'B0FFF2Y8R9' THEN 4.4 WHEN 'B0GTM9P94B' THEN 4.2
    WHEN 'B0GD69KW7J' THEN 2.9 WHEN 'B0D4GHS7V6' THEN 3.7
    WHEN 'B07WZPJ2LW' THEN 4.1 WHEN 'B0D6Z4L6BW' THEN 3.8
    WHEN 'B0G52NY6HZ' THEN 4.2 WHEN 'B0H6GGW9RH' THEN 4.6
    WHEN 'B0C75D8QZ9' THEN 3.8 WHEN 'B09S8WMJY9' THEN 4.1
    WHEN 'B0CFFKWYH6' THEN 4.5 WHEN 'B00VIXRB6O' THEN 4.2
    WHEN 'B09LD2CD1L' THEN 4.4 WHEN 'B09GDQZLD1' THEN 4.3
    WHEN 'B0CBK46PSZ' THEN 5.0 WHEN 'B0856W45VL' THEN 4.4
    WHEN 'B08R59YH7W' THEN 4.4 ELSE NULL END,
  amazon_review_count=CASE external_id
    WHEN 'B0FFF2Y8R9' THEN 375 WHEN 'B0GTM9P94B' THEN 409
    WHEN 'B0GD69KW7J' THEN 3 WHEN 'B0D4GHS7V6' THEN 570
    WHEN 'B07WZPJ2LW' THEN 10734 WHEN 'B0D6Z4L6BW' THEN 5216
    WHEN 'B0G52NY6HZ' THEN 107 WHEN 'B0H6GGW9RH' THEN 10
    WHEN 'B0C75D8QZ9' THEN 4234 WHEN 'B09S8WMJY9' THEN 10212
    WHEN 'B0CFFKWYH6' THEN 512 WHEN 'B00VIXRB6O' THEN 6410
    WHEN 'B09LD2CD1L' THEN 12432 WHEN 'B09GDQZLD1' THEN 8957
    WHEN 'B0CBK46PSZ' THEN 1 WHEN 'B0856W45VL' THEN 21464
    WHEN 'B08R59YH7W' THEN 81656 ELSE NULL END,
  amazon_availability=CASE WHEN external_id IN ('B0GX2P4R8Y','B0CBK46PSZ') THEN NULL ELSE 'In Stock' END,
  commerce_checked_at='2026-09-05 16:42:00',
  subscription=CASE external_id
    WHEN 'B0D6Z4L6BW' THEN 'Required; plans start at $5/month'
    WHEN 'B0G52NY6HZ' THEN 'Required; plans start at $5/month'
    WHEN 'B0C75D8QZ9' THEN 'Required; plans start at $5/month'
    WHEN 'B0H6GGW9RH' THEN '12-month Silver included for eligible new/free members'
    WHEN 'B09GDQZLD1' THEN 'Not required for core features'
    ELSE NULL END
WHERE external_id REGEXP '^B[A-Z0-9]{9}$';

INSERT INTO product_source_facts (product_id,source_name,source_url,checked_at,facts_json)
SELECT id,'Amazon',merchant_url,'2026-09-05 16:42:00',CASE external_id
  WHEN 'B0FFF2Y8R9' THEN JSON_ARRAY(JSON_OBJECT('label','Listing','value','Litter-Robot 4 supply bundle'),JSON_OBJECT('label','Connectivity','value','Wi-Fi enabled'),JSON_OBJECT('label','Included','value','OdorTrap refills, liners, wipes and carbon filters'))
  WHEN 'B0GTM9P94B' THEN JSON_ARRAY(JSON_OBJECT('label','Design','value','Large open-top'),JSON_OBJECT('label','Camera','value','AI-camera waste analysis'),JSON_OBJECT('label','Tracking','value','Multi-cat recognition and usage tracking'))
  WHEN 'B0GD69KW7J' THEN JSON_ARRAY(JSON_OBJECT('label','Design','value','Open-top'),JSON_OBJECT('label','Included','value','Airstep'),JSON_OBJECT('label','Air care','value','2-in-1 air purifier'))
  WHEN 'B0D4GHS7V6' THEN JSON_ARRAY(JSON_OBJECT('label','Cleaning','value','Self-cleaning'),JSON_OBJECT('label','Color','value','White'))
  WHEN 'B0GX2P4R8Y' THEN JSON_ARRAY(JSON_OBJECT('label','Cleaning','value','Self-cleaning'),JSON_OBJECT('label','Model','value','Scooper Luxury Pro-X'))
  WHEN 'B07WZPJ2LW' THEN JSON_ARRAY(JSON_OBJECT('label','Cleaning','value','Self-cleaning'),JSON_OBJECT('label','Litter system','value','Crystal tray'),JSON_OBJECT('label','Design','value','Uncovered'))
  WHEN 'B0D6Z4L6BW' THEN JSON_ARRAY(JSON_OBJECT('label','Tracking','value','Live GPS'),JSON_OBJECT('label','Safety','value','Virtual fence'),JSON_OBJECT('label','Monitoring','value','Vital signs and bark monitoring'))
  WHEN 'B0G52NY6HZ' THEN JSON_ARRAY(JSON_OBJECT('label','Tracking','value','Live GPS'),JSON_OBJECT('label','Battery','value','Up to 6 weeks (listing claim)'),JSON_OBJECT('label','Monitoring','value','Heart and respiratory rate'))
  WHEN 'B0H6GGW9RH' THEN JSON_ARRAY(JSON_OBJECT('label','Tracking','value','Live location'),JSON_OBJECT('label','Alerts','value','Escape alerts'),JSON_OBJECT('label','Battery','value','Up to 14 days (listing claim)'))
  WHEN 'B0C75D8QZ9' THEN JSON_ARRAY(JSON_OBJECT('label','Pet','value','Cats 6.5 lb+'),JSON_OBJECT('label','Tracking','value','Real-time location'),JSON_OBJECT('label','Battery','value','Up to 5 days (listing claim)'))
  WHEN 'B09S8WMJY9' THEN JSON_ARRAY(JSON_OBJECT('label','Capacity','value','5 L'),JSON_OBJECT('label','Schedule','value','Up to 10 meals/day'),JSON_OBJECT('label','Connectivity','value','5 GHz Wi-Fi'))
  WHEN 'B0CFFKWYH6' THEN JSON_ARRAY(JSON_OBJECT('label','Camera','value','1080p with night vision'),JSON_OBJECT('label','Connectivity','value','2.4 GHz Wi-Fi'),JSON_OBJECT('label','Audio','value','Two-way audio and meal call'))
  WHEN 'B00VIXRB6O' THEN JSON_ARRAY(JSON_OBJECT('label','Capacity','value','24 cups'),JSON_OBJECT('label','Control','value','Programmable'),JSON_OBJECT('label','Schedule','value','Up to 12 meals/day'))
  WHEN 'B09LD2CD1L' THEN JSON_ARRAY(JSON_OBJECT('label','Capacity','value','4 L'),JSON_OBJECT('label','Food','value','Dry food'),JSON_OBJECT('label','Control','value','Programmable portion control'))
  WHEN 'B09GDQZLD1' THEN JSON_ARRAY(JSON_OBJECT('label','View','value','360° rotating live view'),JSON_OBJECT('label','Audio','value','Two-way audio'),JSON_OBJECT('label','Interaction','value','Treat toss'))
  WHEN 'B0CBK46PSZ' THEN JSON_ARRAY(JSON_OBJECT('label','Resolution','value','1080p HD'),JSON_OBJECT('label','Audio','value','Two-way audio'),JSON_OBJECT('label','Interaction','value','Treat dispenser'))
  WHEN 'B0856W45VL' THEN JSON_ARRAY(JSON_OBJECT('label','Movement','value','Pan and tilt'),JSON_OBJECT('label','Use','value','Indoor dog/pet camera'))
  WHEN 'B08R59YH7W' THEN JSON_ARRAY(JSON_OBJECT('label','Resolution','value','1080p HD'),JSON_OBJECT('label','Night vision','value','Color night vision'),JSON_OBJECT('label','Audio','value','Two-way audio'))
  ELSE JSON_ARRAY() END
FROM products WHERE external_id REGEXP '^B[A-Z0-9]{9}$'
ON DUPLICATE KEY UPDATE source_url=VALUES(source_url),checked_at=VALUES(checked_at),facts_json=VALUES(facts_json);
