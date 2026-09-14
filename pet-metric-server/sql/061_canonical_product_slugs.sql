/* Align public URLs with the verified product identities introduced in migrations 047-050. */
SET NAMES utf8mb4;

UPDATE products SET slug='petlibro-luma' WHERE slug='petkit-pura-x';
UPDATE products SET slug='neakasa-m1-plus' WHERE slug='petkit-pura-max';
UPDATE products SET slug='petsafe-scoopfree-smartspin' WHERE slug='litter-robot-3-connect';
UPDATE products SET slug='petsafe-scoopfree-crystal-pro-legacy' WHERE slug='petsafe-scoopfree-ultra';
UPDATE products SET slug='petkit-yumshare-solo' WHERE slug='petkit-fresh-element-infinity';
UPDATE products SET slug='voluas-automatic-cat-feeder' WHERE slug='arf-pets-feeder';
UPDATE products SET slug='tractive-dog-6' WHERE slug='fi-series-3';
UPDATE products SET slug='tractive-xl-smart-dog' WHERE slug='tractive-gps-dog-4';
UPDATE products SET slug='life360-pet-gps-tracker' WHERE slug='whistle-go-explore';
UPDATE products SET slug='tractive-smart-cat-gps-tracker' WHERE slug='jiobit-smart-tag';

UPDATE comparisons SET slug='tractive-xl-vs-tractive-dog-6' WHERE slug='tractive-gps-vs-fi-series-3';
UPDATE comparisons SET slug='life360-vs-tractive-dog-6' WHERE slug='life360-vs-tractive-smart-dog';
UPDATE comparisons SET slug='petlibro-granary-vs-voluas-feeder' WHERE slug='petlibro-granary-vs-arf-pets-feeder';
