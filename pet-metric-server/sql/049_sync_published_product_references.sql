/* Keep every visible product reference on published pages in sync with products. */
SET NAMES utf8mb4;

/* The comparison “best for” cards are editorial text, so align them to the
   exact names used by the published product catalog. */
UPDATE comparison_best_for cb
JOIN comparisons c ON c.id = cb.comparison_id AND c.is_published = TRUE
SET cb.pick_name = CASE
  WHEN c.slug = 'litter-robot-4-vs-neakasa-m1-plus' AND cb.sort_order = 1
    THEN 'Whisker Litter-Robot 4 Supply Bundle'
  WHEN c.slug = 'litter-robot-4-vs-neakasa-m1-plus' AND cb.sort_order = 2
    THEN 'Neakasa M1 Plus with Airstep'
  WHEN c.slug = 'litter-robot-4-vs-petsafe-scoopfree' AND cb.sort_order = 1
    THEN 'Whisker Litter-Robot 4 Supply Bundle'
  WHEN c.slug = 'tractive-gps-vs-fi-series-3' AND cb.sort_order = 1
    THEN 'Tractive XL Smart Dog GPS Tracker'
  WHEN c.slug = 'tractive-gps-vs-fi-series-3' AND cb.sort_order = 2
    THEN 'Tractive DOG 6 Smart GPS Tracker'
  WHEN c.slug = 'life360-vs-tractive-xl-smart-dog' AND cb.sort_order = 1
    THEN 'Life360 Pet GPS Tracker'
  WHEN c.slug = 'life360-vs-tractive-xl-smart-dog' AND cb.sort_order = 2
    THEN 'Tractive XL Smart Dog GPS Tracker'
  WHEN c.slug = 'petlibro-granary-vs-arf-pets-feeder' AND cb.sort_order = 1
    THEN 'PETLIBRO Granary 5L Automatic Feeder'
  WHEN c.slug = 'petlibro-granary-vs-arf-pets-feeder' AND cb.sort_order = 2
    THEN 'VOLUAS Automatic Cat Feeder'
  WHEN c.slug = 'furbo-360-vs-petcube-bites-2' AND cb.sort_order = 1
    THEN 'Furbo 360 Dog Camera'
  WHEN c.slug = 'furbo-360-vs-petcube-bites-2' AND cb.sort_order = 2
    THEN 'Petcube Bites 2 Lite Cam Bundle'
  ELSE cb.pick_name
END
WHERE c.slug IN (
  'litter-robot-4-vs-neakasa-m1-plus',
  'litter-robot-4-vs-petsafe-scoopfree',
  'tractive-gps-vs-fi-series-3',
  'life360-vs-tractive-xl-smart-dog',
  'petlibro-granary-vs-arf-pets-feeder',
  'furbo-360-vs-petcube-bites-2'
);

/* Normalize legacy aliases in visible text and embedded editorial JSON. */
UPDATE comparisons
SET verdict = REPLACE(REPLACE(REPLACE(REPLACE(verdict,
    'Litter-Robot 4', 'Whisker Litter-Robot 4 Supply Bundle'),
    'Tractive GPS', 'Tractive XL Smart Dog GPS Tracker'),
    'Furbo 360°', 'Furbo 360 Dog Camera'),
    'Petcube Bites 2', 'Petcube Bites 2 Lite Cam Bundle'),
    home_verdict = REPLACE(REPLACE(REPLACE(REPLACE(home_verdict,
    'Litter-Robot 4', 'Whisker Litter-Robot 4 Supply Bundle'),
    'Tractive GPS', 'Tractive XL Smart Dog GPS Tracker'),
    'Furbo 360°', 'Furbo 360 Dog Camera'),
    'Petcube Bites 2', 'Petcube Bites 2 Lite Cam Bundle'),
    content_json = REPLACE(REPLACE(REPLACE(REPLACE(CAST(content_json AS CHAR),
    'Litter-Robot 4', 'Whisker Litter-Robot 4 Supply Bundle'),
    'Tractive GPS', 'Tractive XL Smart Dog GPS Tracker'),
    'Furbo 360°', 'Furbo 360 Dog Camera'),
    'Petcube Bites 2', 'Petcube Bites 2 Lite Cam Bundle')
WHERE is_published = TRUE;

UPDATE troubleshooting_guides
SET product_name = CASE
      WHEN product_id = (SELECT id FROM products WHERE slug='fi-series-3') THEN 'Tractive DOG 6 Smart GPS Tracker'
      WHEN product_id = (SELECT id FROM products WHERE slug='tractive-gps-dog-4') THEN 'Tractive XL Smart Dog GPS Tracker'
      ELSE product_name END,
    problem = REPLACE(REPLACE(problem, 'Tractive GPS', 'Tractive XL Smart Dog GPS Tracker'), 'Fi Series 3', 'Tractive DOG 6 Smart GPS Tracker'),
    title = REPLACE(REPLACE(title, 'Tractive GPS', 'Tractive XL Smart Dog GPS Tracker'), 'Fi Series 3', 'Tractive DOG 6 Smart GPS Tracker'),
    description = REPLACE(REPLACE(description, 'Tractive GPS', 'Tractive XL Smart Dog GPS Tracker'), 'Fi Series 3', 'Tractive DOG 6 Smart GPS Tracker'),
    content_json = REPLACE(REPLACE(CAST(content_json AS CHAR), 'Tractive GPS', 'Tractive XL Smart GPS Tracker'), 'Fi Series 3', 'Tractive DOG 6 Smart GPS Tracker')
WHERE is_published = TRUE;

UPDATE categories
SET top_pick = CASE slug
  WHEN 'automatic-litter-boxes' THEN 'Whisker Litter-Robot 4 Supply Bundle'
  WHEN 'smart-pet-feeders' THEN 'PETLIBRO Granary 5L Automatic Feeder'
  WHEN 'gps-pet-trackers' THEN 'Tractive DOG 6 Smart GPS Tracker'
  WHEN 'pet-cameras' THEN 'Furbo 360 Dog Camera'
  ELSE top_pick END
WHERE is_published = TRUE AND slug IN ('automatic-litter-boxes','smart-pet-feeders','gps-pet-trackers','pet-cameras');

/* Fi was retired from the catalog; keep the guide sources within current
   products' support ecosystems. */
UPDATE guides
SET content_json = REPLACE(REPLACE(CAST(content_json AS CHAR),
    'https://support.tryfi.com/', 'https://help.tractive.com/'),
    'Fi — membership information', 'Tractive — subscription and coverage help'),
    description = REPLACE(description, 'Fi Series 3', 'Tractive DOG 6 Smart GPS Tracker')
WHERE is_published = TRUE;

