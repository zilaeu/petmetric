SET NAMES utf8mb4;

/* These two experimental categories are not part of the refreshed Amazon
   shortlist. Hide the category and every dependent content surface together. */
UPDATE categories SET is_published=FALSE WHERE slug IN ('smart-pet-doors','pet-health-monitors');
UPDATE products SET is_published=FALSE WHERE category_id IN (SELECT id FROM categories WHERE slug IN ('smart-pet-doors','pet-health-monitors'));
UPDATE comparisons SET is_published=FALSE WHERE category_id IN (SELECT id FROM categories WHERE slug IN ('smart-pet-doors','pet-health-monitors'));
UPDATE best_picks SET is_published=FALSE WHERE category_id IN (SELECT id FROM categories WHERE slug IN ('smart-pet-doors','pet-health-monitors'));
UPDATE guides SET is_published=FALSE WHERE category_id IN (SELECT id FROM categories WHERE slug IN ('smart-pet-doors','pet-health-monitors'));
UPDATE troubleshooting_guides SET is_published=FALSE WHERE category_id IN (SELECT id FROM categories WHERE slug IN ('smart-pet-doors','pet-health-monitors'));

/*
  Catalog identity refresh (2026-09-09).
  The previous refresh paired several slugs with a different brand/model and
  copied unverified ASINs. Keep the stable product slugs used by the UI, but
  restore the actual model identity and use Amazon search links until a
  listing-level ASIN has been rechecked. This prevents false product claims
  from flowing into details, comparisons, best picks, and troubleshooting.
*/

UPDATE products SET
  external_id = NULL,
  price = NULL,
  score = NULL,
  price_display = 'Check current price on Amazon',
  merchant_name = 'Amazon.com',
  merchant_url = CONCAT('https://www.amazon.com/s?k=', REPLACE(name, ' ', '+')),
  updated_label = 'Identity checked Sep 9, 2026'
WHERE slug IN (
  'litter-robot-4','petkit-pura-x','petkit-pura-max','litter-robot-3-connect',
  'catlink-luxury-pro-x','petsafe-scoopfree-ultra','fi-series-3',
  'tractive-gps-dog-4','whistle-go-explore','petlibro-granary',
  'petkit-fresh-element-infinity','petsafe-healthy-pet-simply-feed',
  'arf-pets-feeder','furbo-360','petcube-bites-2','eufy-pet-camera-e220',
  'wyze-cam-v3'
);

UPDATE products SET name='Litter-Robot 4', brand='Whisker', best_for='Multi-cat households needing automatic waste separation', verdict='A rotating self-cleaning litter box from Whisker. Confirm the selected Amazon listing, bundle contents, and fit before buying.' WHERE slug='litter-robot-4';
UPDATE products SET name='PETKIT PURA X', brand='PETKIT', best_for='Owners comparing enclosed automatic litter boxes', verdict='An enclosed rotating automatic litter box from PETKIT. Check the current Amazon variant and supported litter before buying.' WHERE slug='petkit-pura-x';
UPDATE products SET name='PETKIT PURA MAX', brand='PETKIT', best_for='Owners wanting an app-connected rotating litter box', verdict='A globe-style automatic litter box from PETKIT. Verify the exact generation and included accessories on Amazon.' WHERE slug='petkit-pura-max';
UPDATE products SET name='Litter-Robot 3 Connect', brand='Whisker', best_for='Buyers considering the previous-generation Litter-Robot', verdict='The previous-generation connected Litter-Robot model. Check whether the Amazon offer is new, refurbished, or used.' WHERE slug='litter-robot-3-connect';
UPDATE products SET name='CATLINK Scooper Luxury Pro-X', brand='CATLINK', best_for='Owners comparing globe-style automatic litter boxes', verdict='A globe-style automatic litter box from CATLINK. Confirm dimensions, cat-weight limits, and app support on the listing.' WHERE slug='catlink-luxury-pro-x';
UPDATE products SET name='PetSafe ScoopFree Ultra', brand='PetSafe', best_for='Single-cat homes using crystal litter trays', verdict='A crystal-tray self-cleaning litter box from PetSafe. Ongoing tray costs and variant differences should be checked on Amazon.' WHERE slug='petsafe-scoopfree-ultra';
UPDATE products SET name='Fi Series 3 Smart Dog Collar', brand='Fi', best_for='US dog owners who need LTE escape alerts', verdict='A cellular GPS dog collar from Fi. Core tracking depends on an active membership and coverage.' WHERE slug='fi-series-3';
UPDATE products SET name='Tractive GPS DOG 4', brand='Tractive', best_for='Dog owners comparing subscription GPS trackers', verdict='A cellular GPS tracker for dogs from Tractive. Confirm the current DOG model and plan terms on Amazon.' WHERE slug='tractive-gps-dog-4';
UPDATE products SET name='Whistle GO Explore', brand='Whistle', best_for='North American owners wanting GPS and activity data', verdict='A GPS and wellness tracker for dogs. Verify current availability and subscription terms because model generations change.' WHERE slug='whistle-go-explore';
UPDATE products SET name='PETLIBRO Granary 5L Automatic Feeder', brand='PETLIBRO', best_for='Cats and small dogs needing scheduled dry-food portions', verdict='A 5-liter automatic dry-food feeder. Confirm whether the selected Amazon listing includes Wi-Fi or camera hardware.' WHERE slug='petlibro-granary';
UPDATE products SET name='PETKIT Fresh Element Infinity', brand='PETKIT', best_for='Owners comparing app-connected automatic feeders', verdict='A connected automatic feeder from PETKIT. Check food compatibility and the exact model variant on Amazon.' WHERE slug='petkit-fresh-element-infinity';
UPDATE products SET name='PetSafe Healthy Pet Simply Feed', brand='PetSafe', best_for='Owners wanting a simple scheduled feeder', verdict='A programmable automatic feeder from PetSafe. Confirm the current listing and portion settings before purchase.' WHERE slug='petsafe-healthy-pet-simply-feed';
UPDATE products SET name='Arf Pets Automatic Pet Feeder', brand='Arf Pets', best_for='Budget buyers wanting basic scheduled feeding', verdict='A basic automatic feeder sold under the Arf Pets brand. Verify current seller, capacity, and power backup on Amazon.' WHERE slug='arf-pets-feeder';
UPDATE products SET name='Furbo 360 Dog Camera', brand='Furbo', best_for='Dog owners wanting rotating video and treat tossing', verdict='A rotating dog camera with two-way audio and treat tossing. Confirm whether the listing is standalone or subscription-required.' WHERE slug='furbo-360';
UPDATE products SET name='Petcube Bites 2', brand='Petcube', best_for='Owners wanting remote treat interaction', verdict='A treat-dispensing pet camera from Petcube. Check the exact Bites 2 variant and cloud-plan requirements.' WHERE slug='petcube-bites-2';
UPDATE products SET name='eufy Security Indoor Cam E220', brand='eufy', best_for='Owners wanting a general indoor camera for pets', verdict='A general indoor pan-and-tilt camera that can monitor pets. Confirm storage and subscription details on Amazon.' WHERE slug='eufy-pet-camera-e220';
UPDATE products SET name='Wyze Cam v3', brand='Wyze', best_for='Budget indoor pet monitoring', verdict='A general-purpose indoor camera commonly used for pet monitoring. Verify the current v3 listing and plan terms.' WHERE slug='wyze-cam-v3';

UPDATE products SET merchant_url=CONCAT('https://www.amazon.com/s?k=', REPLACE(name, ' ', '+'))
WHERE slug IN (
  'litter-robot-4','petkit-pura-x','petkit-pura-max','litter-robot-3-connect',
  'catlink-luxury-pro-x','petsafe-scoopfree-ultra','fi-series-3',
  'tractive-gps-dog-4','whistle-go-explore','petlibro-granary',
  'petkit-fresh-element-infinity','petsafe-healthy-pet-simply-feed',
  'arf-pets-feeder','furbo-360','petcube-bites-2','eufy-pet-camera-e220',
  'wyze-cam-v3'
);

/* Listing-level checks completed for these two canonical examples. */
UPDATE products SET external_id='B09S8WMJY9', merchant_url='https://www.amazon.com/dp/B09S8WMJY9', merchant_name='Amazon.com'
WHERE slug='petlibro-granary';
UPDATE products SET external_id='B09GDQZLD1', merchant_url='https://www.amazon.com/dp/B09GDQZLD1', merchant_name='Amazon.com'
WHERE slug='furbo-360';

/* Keep every downstream record aligned with the canonical product name. */
UPDATE comparisons c JOIN products p ON p.id=c.product_a_id SET c.product_a_name=p.name;
UPDATE comparisons c JOIN products p ON p.id=c.product_b_id SET c.product_b_name=p.name;
UPDATE best_picks b JOIN products p ON p.id=b.pick_product_id SET b.pick_name=p.name;
UPDATE troubleshooting_guides t JOIN products p ON p.id=t.product_id SET t.product_name=p.name;

/* Retire orphaned comparison/support rows that reference products removed from
   the refreshed shortlist instead of leaving a broken detail chain visible. */
UPDATE comparisons
SET is_published=FALSE
WHERE product_a_id IS NULL OR product_b_id IS NULL
   OR product_a_id NOT IN (SELECT id FROM products WHERE slug IN (
     'litter-robot-4','petkit-pura-x','petkit-pura-max','litter-robot-3-connect',
     'petsafe-scoopfree-ultra','fi-series-3','tractive-gps-dog-4',
     'whistle-go-explore','petlibro-granary','petsafe-healthy-pet-simply-feed',
     'arf-pets-feeder','furbo-360','petcube-bites-2','eufy-pet-camera-e220','wyze-cam-v3'))
   OR product_b_id NOT IN (SELECT id FROM products WHERE slug IN (
     'litter-robot-4','petkit-pura-x','petkit-pura-max','litter-robot-3-connect',
     'petsafe-scoopfree-ultra','fi-series-3','tractive-gps-dog-4',
     'whistle-go-explore','petlibro-granary','petsafe-healthy-pet-simply-feed',
     'arf-pets-feeder','furbo-360','petcube-bites-2','eufy-pet-camera-e220','wyze-cam-v3'));

UPDATE best_picks
SET is_published=FALSE
WHERE pick_product_id IS NULL OR pick_product_id NOT IN (SELECT id FROM products WHERE slug IN (
  'litter-robot-4','petkit-pura-x','petkit-pura-max','litter-robot-3-connect',
  'petsafe-scoopfree-ultra','fi-series-3','tractive-gps-dog-4','whistle-go-explore',
  'petlibro-granary','petsafe-healthy-pet-simply-feed','arf-pets-feeder',
  'furbo-360','petcube-bites-2','eufy-pet-camera-e220','wyze-cam-v3'));
