/*
  Verified Amazon catalog refresh.

  Checked 2026-09-05 against the public Amazon.com product detail pages.  The
  ASIN is the durable product identifier; price and availability are purposely
  not copied because Amazon localises them by delivery address and changes them
  continuously.  Product images remain the Amazon-hosted listing images for
  local development.  If these are used in production, move them to R2 only
  after confirming the applicable image/licensing terms.
*/
SET NAMES utf8mb4;

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
  END,
  name = CASE slug
    WHEN 'litter-robot-4' THEN 'Whisker Litter-Robot 4 Supply Bundle'
    WHEN 'petkit-pura-x' THEN 'PETLIBRO Luma Automatic Litter Box'
    WHEN 'petkit-pura-max' THEN 'Neakasa M1 Plus'
    WHEN 'litter-robot-3-connect' THEN 'PetSafe ScoopFree SmartSpin'
    WHEN 'catlink-luxury-pro-x' THEN 'CATLINK Scooper Luxury Pro-X'
    WHEN 'petsafe-scoopfree-ultra' THEN 'PetSafe ScoopFree Crystal Pro Legacy'
    WHEN 'fi-series-3' THEN 'Tractive Smart Dog GPS Tracker'
    WHEN 'tractive-gps-dog-4' THEN 'Tractive XL Smart Dog GPS Tracker'
    WHEN 'whistle-go-explore' THEN 'Life360 Pet GPS Tracker for Dogs'
    WHEN 'jiobit-smart-tag' THEN 'Tractive Smart Cat GPS Tracker'
    WHEN 'petlibro-granary' THEN 'PETLIBRO Granary 5L Automatic Feeder'
    WHEN 'petkit-fresh-element-infinity' THEN 'PETKIT Automatic Feeder with Camera'
    WHEN 'petsafe-healthy-pet-simply-feed' THEN 'PetSafe Healthy Pet Simply Feed'
    WHEN 'arf-pets-feeder' THEN 'VOLUAS Automatic Cat Feeder'
    WHEN 'furbo-360' THEN 'Furbo 360 Dog Camera'
    WHEN 'petcube-bites-2' THEN 'Petcube Bites 2 Lite Cam Bundle'
    WHEN 'eufy-pet-camera-e220' THEN 'eufy Security Indoor Cam E220'
    WHEN 'wyze-cam-v3' THEN 'WYZE Cam v3'
  END,
  brand = CASE slug
    WHEN 'litter-robot-4' THEN 'Whisker' WHEN 'petkit-pura-x' THEN 'PETLIBRO'
    WHEN 'petkit-pura-max' THEN 'Neakasa' WHEN 'litter-robot-3-connect' THEN 'PetSafe'
    WHEN 'catlink-luxury-pro-x' THEN 'CATLINK' WHEN 'petsafe-scoopfree-ultra' THEN 'PetSafe'
    WHEN 'fi-series-3' THEN 'Tractive' WHEN 'tractive-gps-dog-4' THEN 'Tractive'
    WHEN 'whistle-go-explore' THEN 'Life360' WHEN 'jiobit-smart-tag' THEN 'Tractive'
    WHEN 'petlibro-granary' THEN 'PETLIBRO' WHEN 'petkit-fresh-element-infinity' THEN 'PETKIT'
    WHEN 'petsafe-healthy-pet-simply-feed' THEN 'PetSafe' WHEN 'arf-pets-feeder' THEN 'VOLUAS'
    WHEN 'furbo-360' THEN 'Furbo' WHEN 'petcube-bites-2' THEN 'Petcube'
    WHEN 'eufy-pet-camera-e220' THEN 'eufy' WHEN 'wyze-cam-v3' THEN 'Wyze'
  END,
  price = NULL,
  price_display = 'See current price on Amazon',
  subscription = NULL,
  score = NULL,
  verdict = 'Product identity and listing link verified on Amazon. Price and availability vary by region and change over time.',
  best_for = CASE
    WHEN category_id=(SELECT id FROM categories WHERE slug='automatic-litter-boxes') THEN 'See the Amazon listing for current fit and compatibility details'
    WHEN category_id=(SELECT id FROM categories WHERE slug='gps-pet-trackers') THEN 'Pet owners comparing current GPS tracking options'
    WHEN category_id=(SELECT id FROM categories WHERE slug='smart-pet-feeders') THEN 'Pet owners comparing current automatic feeders'
    ELSE 'Pet owners comparing current home pet cameras'
  END,
  image_url = CASE external_id
    WHEN 'B0FFF2Y8R9' THEN 'https://m.media-amazon.com/images/I/71pk1UePo5L._AC_SL1500_.jpg'
    WHEN 'B0GTM9P94B' THEN 'https://m.media-amazon.com/images/I/81nxgFOhbaL._AC_SL1500_.jpg'
    WHEN 'B0GD69KW7J' THEN 'https://m.media-amazon.com/images/I/61x7NLY5aJL._AC_SL1500_.jpg'
    WHEN 'B0D4GHS7V6' THEN 'https://m.media-amazon.com/images/I/71zjCU8jhgL._AC_SL1500_.jpg'
    WHEN 'B0GX2P4R8Y' THEN 'https://m.media-amazon.com/images/X/dawp/M/0dawphqWNPSExCa._AC_UL436_FMjpg_.png'
    WHEN 'B07WZPJ2LW' THEN 'https://m.media-amazon.com/images/I/818ZKgTzS1L._AC_SL1500_.jpg'
    WHEN 'B0D6Z4L6BW' THEN 'https://m.media-amazon.com/images/I/71rGP5YET1L._AC_SL1500_.jpg'
    WHEN 'B0G52NY6HZ' THEN 'https://m.media-amazon.com/images/I/71RhFkAumdL._AC_SL1500_.jpg'
    WHEN 'B0H6GGW9RH' THEN 'https://m.media-amazon.com/images/I/61k3Ihy6dtL._AC_SL1500_.jpg'
    WHEN 'B0C75D8QZ9' THEN 'https://m.media-amazon.com/images/I/71VvBl+rFkL._AC_SL1500_.jpg'
    WHEN 'B09S8WMJY9' THEN 'https://m.media-amazon.com/images/I/71g1HcpaAzL._AC_SL1500_.jpg'
    WHEN 'B0CFFKWYH6' THEN 'https://m.media-amazon.com/images/I/616LotB-n1L._AC_SL1500_.jpg'
    WHEN 'B00VIXRB6O' THEN 'https://m.media-amazon.com/images/I/71ml5Ys-7nL._AC_SL1500_.jpg'
    WHEN 'B09LD2CD1L' THEN 'https://m.media-amazon.com/images/I/61p9MrNoQ5L._AC_SL1500_.jpg'
    WHEN 'B09GDQZLD1' THEN 'https://m.media-amazon.com/images/I/616wRFOTA5L._AC_SL1500_.jpg'
    WHEN 'B0CBK46PSZ' THEN 'https://m.media-amazon.com/images/I/61qGoIbGueL._AC_SL1500_.jpg'
    WHEN 'B0856W45VL' THEN 'https://m.media-amazon.com/images/I/51RAiKC4hgL._AC_SL1500_.jpg'
    WHEN 'B08R59YH7W' THEN 'https://m.media-amazon.com/images/I/51FXUyvOI9L._AC_SL1500_.jpg'
  END,
  image_key = NULL,
  alt_text = name,
  merchant_name = 'Amazon',
  merchant_url = CONCAT('https://www.amazon.com/dp/', external_id),
  updated_label = 'Checked Sep 5, 2026'
WHERE is_published = TRUE;
