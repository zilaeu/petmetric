/*
  Replace the search-link/borrowed-image catalog with a small, auditable set
  of Amazon detail-page listings.  A product is published only when its ASIN
  and its Amazon-hosted listing image are known together.  Rows that came
  from the earlier placeholder expansion remain in the database for history,
  but are unpublished rather than shown with a misleading image or link.
*/
SET NAMES utf8mb4;

/* Retire rows whose previous image/link pair was inferred or was a search URL. */
UPDATE products
SET is_published = FALSE
WHERE slug NOT IN (
  'litter-robot-4', 'petkit-pura-x', 'petkit-pura-max',
  'litter-robot-3-connect', 'catlink-luxury-pro-x', 'petsafe-scoopfree-ultra',
  'fi-series-3', 'tractive-gps-dog-4', 'whistle-go-explore', 'jiobit-smart-tag',
  'petlibro-granary', 'petkit-fresh-element-infinity',
  'petsafe-healthy-pet-simply-feed', 'arf-pets-feeder', 'furbo-360',
  'petcube-bites-2', 'eufy-pet-camera-e220', 'wyze-cam-v3',
  'petlibro-dockstream-2', 'feelneedy-filterless-water-fountain'
);

/* One concrete Amazon ASIN and one listing image per published product. */
UPDATE products SET
  external_id = CASE slug
    WHEN 'litter-robot-4' THEN 'B0FFF2Y8R9'
    WHEN 'petkit-pura-x' THEN 'B0GTM9P94B'
    WHEN 'petkit-pura-max' THEN 'B0GD69KW7J'
    WHEN 'litter-robot-3-connect' THEN 'B0D4GHS7V6'
    WHEN 'catlink-luxury-pro-x' THEN 'B0GX2P4R8Y'
    WHEN 'petsafe-scoopfree-ultra' THEN 'B07WZPJ2LW'
    WHEN 'fi-series-3' THEN 'B0D6Z4L6BW'
    WHEN 'tractive-gps-dog-4' THEN 'B0G52NY6HZ'
    WHEN 'whistle-go-explore' THEN 'B0H6GGW9RH'
    WHEN 'jiobit-smart-tag' THEN 'B0C75D8QZ9'
    WHEN 'petlibro-granary' THEN 'B09S8WMJY9'
    WHEN 'petkit-fresh-element-infinity' THEN 'B0CFFKWYH6'
    WHEN 'petsafe-healthy-pet-simply-feed' THEN 'B00VIXRB6O'
    WHEN 'arf-pets-feeder' THEN 'B09LD2CD1L'
    WHEN 'furbo-360' THEN 'B09GDQZLD1'
    WHEN 'petcube-bites-2' THEN 'B0CBK46PSZ'
    WHEN 'eufy-pet-camera-e220' THEN 'B0856W45VL'
    WHEN 'wyze-cam-v3' THEN 'B08R59YH7W'
    WHEN 'petlibro-dockstream-2' THEN 'B0FDKQGRCK'
    WHEN 'feelneedy-filterless-water-fountain' THEN 'B0F9FC7JYD'
  END,
  merchant_name = 'Amazon',
  merchant_url = CONCAT('https://www.amazon.com/dp/', CASE slug
    WHEN 'litter-robot-4' THEN 'B0FFF2Y8R9'
    WHEN 'petkit-pura-x' THEN 'B0GTM9P94B'
    WHEN 'petkit-pura-max' THEN 'B0GD69KW7J'
    WHEN 'litter-robot-3-connect' THEN 'B0D4GHS7V6'
    WHEN 'catlink-luxury-pro-x' THEN 'B0GX2P4R8Y'
    WHEN 'petsafe-scoopfree-ultra' THEN 'B07WZPJ2LW'
    WHEN 'fi-series-3' THEN 'B0D6Z4L6BW'
    WHEN 'tractive-gps-dog-4' THEN 'B0G52NY6HZ'
    WHEN 'whistle-go-explore' THEN 'B0H6GGW9RH'
    WHEN 'jiobit-smart-tag' THEN 'B0C75D8QZ9'
    WHEN 'petlibro-granary' THEN 'B09S8WMJY9'
    WHEN 'petkit-fresh-element-infinity' THEN 'B0CFFKWYH6'
    WHEN 'petsafe-healthy-pet-simply-feed' THEN 'B00VIXRB6O'
    WHEN 'arf-pets-feeder' THEN 'B09LD2CD1L'
    WHEN 'furbo-360' THEN 'B09GDQZLD1'
    WHEN 'petcube-bites-2' THEN 'B0CBK46PSZ'
    WHEN 'eufy-pet-camera-e220' THEN 'B0856W45VL'
    WHEN 'wyze-cam-v3' THEN 'B08R59YH7W'
    WHEN 'petlibro-dockstream-2' THEN 'B0FDKQGRCK'
    WHEN 'feelneedy-filterless-water-fountain' THEN 'B0F9FC7JYD'
  END),
  image_url = CASE slug
    WHEN 'litter-robot-4' THEN 'https://m.media-amazon.com/images/I/71pk1UePo5L._AC_SL1500_.jpg'
    WHEN 'petkit-pura-x' THEN 'https://m.media-amazon.com/images/I/81nxgFOhbaL._AC_SL1500_.jpg'
    WHEN 'petkit-pura-max' THEN 'https://m.media-amazon.com/images/I/61x7NLY5aJL._AC_SL1500_.jpg'
    WHEN 'litter-robot-3-connect' THEN 'https://m.media-amazon.com/images/I/71zjCU8jhgL._AC_SL1500_.jpg'
    WHEN 'catlink-luxury-pro-x' THEN 'https://m.media-amazon.com/images/X/dawp/M/0dawphqWNPSExCa._AC_UL436_FMjpg_.png'
    WHEN 'petsafe-scoopfree-ultra' THEN 'https://m.media-amazon.com/images/I/818ZKgTzS1L._AC_SL1500_.jpg'
    WHEN 'fi-series-3' THEN 'https://m.media-amazon.com/images/I/71rGP5YET1L._AC_SL1500_.jpg'
    WHEN 'tractive-gps-dog-4' THEN 'https://m.media-amazon.com/images/I/71RhFkAumdL._AC_SL1500_.jpg'
    WHEN 'whistle-go-explore' THEN 'https://m.media-amazon.com/images/I/61k3Ihy6dtL._AC_SL1500_.jpg'
    WHEN 'jiobit-smart-tag' THEN 'https://m.media-amazon.com/images/I/71VvBl+rFkL._AC_SL1500_.jpg'
    WHEN 'petlibro-granary' THEN 'https://m.media-amazon.com/images/I/71g1HcpaAzL._AC_SL1500_.jpg'
    WHEN 'petkit-fresh-element-infinity' THEN 'https://m.media-amazon.com/images/I/616LotB-n1L._AC_SL1500_.jpg'
    WHEN 'petsafe-healthy-pet-simply-feed' THEN 'https://m.media-amazon.com/images/I/71ml5Ys-7nL._AC_SL1500_.jpg'
    WHEN 'arf-pets-feeder' THEN 'https://m.media-amazon.com/images/I/61p9MrNoQ5L._AC_SL1500_.jpg'
    WHEN 'furbo-360' THEN 'https://m.media-amazon.com/images/I/616wRFOTA5L._AC_SL1500_.jpg'
    WHEN 'petcube-bites-2' THEN 'https://m.media-amazon.com/images/I/61qGoIbGueL._AC_SL1500_.jpg'
    WHEN 'eufy-pet-camera-e220' THEN 'https://m.media-amazon.com/images/I/51RAiKC4hgL._AC_SL1500_.jpg'
    WHEN 'wyze-cam-v3' THEN 'https://m.media-amazon.com/images/I/51FXUyvOI9L._AC_SL1500_.jpg'
    WHEN 'petlibro-dockstream-2' THEN 'https://m.media-amazon.com/images/I/71Us-ricetL._AC_SX679_.jpg'
    WHEN 'feelneedy-filterless-water-fountain' THEN 'https://m.media-amazon.com/images/I/61h6AIoARIL._AC_SY300_SX300_QL70_FMwebp_.jpg'
  END,
  image_key = NULL,
  alt_text = CONCAT(name, ' — Amazon listing image'),
  updated_label = 'Amazon listing checked Sep 2026'
WHERE is_published = TRUE;

/* Guardrails for future writes: published rows cannot point to a search page. */
UPDATE product_reviews r JOIN products p ON p.id = r.product_id
SET r.gallery_json = JSON_ARRAY(p.image_url)
WHERE p.is_published = TRUE AND r.is_published = TRUE;

/* Do not expose editorial rows whose referenced product was retired above. */
UPDATE comparisons x
LEFT JOIN products a ON a.id = x.product_a_id
LEFT JOIN products b ON b.id = x.product_b_id
SET x.is_published = FALSE
WHERE (a.id IS NOT NULL AND a.is_published = FALSE)
   OR (b.id IS NOT NULL AND b.is_published = FALSE);

UPDATE best_picks bp JOIN products p ON p.id = bp.pick_product_id
SET bp.is_published = FALSE
WHERE p.is_published = FALSE;

UPDATE troubleshooting_guides tg JOIN products p ON p.id = tg.product_id
SET tg.is_published = FALSE
WHERE p.is_published = FALSE;
