/* Align the visible identity and dependent editorial chain with each ASIN. */
SET NAMES utf8mb4;

/* This ASIN/image pair could not be independently tied to the old CATLINK row. */
UPDATE products SET is_published = FALSE WHERE slug = 'catlink-luxury-pro-x';

UPDATE products SET name='Whisker Litter-Robot 4 Supply Bundle', brand='Whisker', alt_text='Whisker Litter-Robot 4 Supply Bundle — Amazon listing image' WHERE slug='litter-robot-4';
UPDATE products SET name='PETLIBRO Luma Automatic Litter Box', brand='PETLIBRO', alt_text='PETLIBRO Luma Automatic Litter Box — Amazon listing image' WHERE slug='petkit-pura-x';
UPDATE products SET name='Neakasa M1 Plus with Airstep', brand='Neakasa', alt_text='Neakasa M1 Plus with Airstep — Amazon listing image' WHERE slug='petkit-pura-max';
UPDATE products SET name='PetSafe ScoopFree SmartSpin', brand='PetSafe', alt_text='PetSafe ScoopFree SmartSpin — Amazon listing image' WHERE slug='litter-robot-3-connect';
UPDATE products SET name='PetSafe ScoopFree Crystal Pro Legacy', brand='PetSafe', alt_text='PetSafe ScoopFree Crystal Pro Legacy — Amazon listing image' WHERE slug='petsafe-scoopfree-ultra';
UPDATE products SET name='Tractive DOG 6 Smart GPS Tracker', brand='Tractive', alt_text='Tractive DOG 6 Smart GPS Tracker — Amazon listing image' WHERE slug='fi-series-3';
UPDATE products SET name='Tractive XL Smart Dog GPS Tracker', brand='Tractive', alt_text='Tractive XL Smart Dog GPS Tracker — Amazon listing image' WHERE slug='tractive-gps-dog-4';
UPDATE products SET name='Life360 Pet GPS Tracker', brand='Life360', alt_text='Life360 Pet GPS Tracker — Amazon listing image' WHERE slug='whistle-go-explore';
UPDATE products SET name='Tractive Smart Cat GPS Tracker', brand='Tractive', alt_text='Tractive Smart Cat GPS Tracker — Amazon listing image' WHERE slug='jiobit-smart-tag';
UPDATE products SET name='PETKIT YumShare Solo Automatic Feeder with Camera', brand='PETKIT', alt_text='PETKIT YumShare Solo Automatic Feeder with Camera — Amazon listing image' WHERE slug='petkit-fresh-element-infinity';
UPDATE products SET name='VOLUAS Automatic Cat Feeder', brand='VOLUAS', alt_text='VOLUAS Automatic Cat Feeder — Amazon listing image' WHERE slug='arf-pets-feeder';
UPDATE products SET name='Petcube Bites 2 Lite Cam Bundle', brand='Petcube', alt_text='Petcube Bites 2 Lite Cam Bundle — Amazon listing image' WHERE slug='petcube-bites-2';

/* Retire editorial detail written for a different product identity. */
DELETE t FROM product_tags t JOIN products p ON p.id=t.product_id
WHERE p.slug IN ('petkit-pura-x','petkit-pura-max','litter-robot-3-connect','catlink-luxury-pro-x','fi-series-3','tractive-gps-dog-4','whistle-go-explore','petkit-fresh-element-infinity','arf-pets-feeder','petcube-bites-2');

DELETE s FROM product_specs s JOIN products p ON p.id=s.product_id
WHERE p.slug IN ('petkit-pura-x','petkit-pura-max','litter-robot-3-connect','catlink-luxury-pro-x','fi-series-3','tractive-gps-dog-4','whistle-go-explore','petkit-fresh-element-infinity','arf-pets-feeder','petcube-bites-2');

UPDATE product_reviews r JOIN products p ON p.id=r.product_id
SET r.is_published=FALSE
WHERE p.slug IN ('petkit-pura-x','petkit-pura-max','litter-robot-3-connect','catlink-luxury-pro-x','fi-series-3','tractive-gps-dog-4','whistle-go-explore','petkit-fresh-element-infinity','arf-pets-feeder','petcube-bites-2');

/* Hide any dependent content that still references an unpublished product. */
UPDATE comparisons x
LEFT JOIN products a ON a.id=x.product_a_id
LEFT JOIN products b ON b.id=x.product_b_id
SET x.is_published=FALSE
WHERE (a.id IS NOT NULL AND a.is_published=FALSE)
   OR (b.id IS NOT NULL AND b.is_published=FALSE);

UPDATE best_picks bp JOIN products p ON p.id=bp.pick_product_id
SET bp.is_published=FALSE
WHERE p.is_published=FALSE;

UPDATE troubleshooting_guides tg JOIN products p ON p.id=tg.product_id
SET tg.is_published=FALSE
WHERE p.is_published=FALSE;

/* Keep names in valid dependent rows sourced from the same product table. */
UPDATE comparisons x JOIN products a ON a.id=x.product_a_id SET x.product_a_name=a.name;
UPDATE comparisons x JOIN products b ON b.id=x.product_b_id SET x.product_b_name=b.name;
UPDATE best_picks bp JOIN products p ON p.id=bp.pick_product_id SET bp.pick_name=p.name;
UPDATE troubleshooting_guides tg JOIN products p ON p.id=tg.product_id SET tg.product_name=p.name;
