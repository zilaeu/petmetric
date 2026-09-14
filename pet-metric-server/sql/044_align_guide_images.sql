/* Use product-specific imagery for guide cards instead of generic category photos. */
UPDATE guides
SET image_key = NULL,
    image_url = CASE slug
      WHEN 'how-to-choose-automatic-litter-box' THEN 'https://m.media-amazon.com/images/I/71pk1UePo5L._AC_SL1500_.jpg'
      WHEN 'gps-tracker-subscription-costs-explained' THEN 'https://m.media-amazon.com/images/I/71RhFkAumdL._AC_SL1500_.jpg'
      WHEN 'clumping-vs-crystal-litter' THEN 'https://m.media-amazon.com/images/I/818ZKgTzS1L._AC_SL1500_.jpg'
      WHEN 'pet-feeder-dispensing-accuracy' THEN 'https://m.media-amazon.com/images/I/71g1HcpaAzL._AC_SL1500_.jpg'
      WHEN 'pet-camera-separation-anxiety-guide' THEN 'https://m.media-amazon.com/images/I/616wRFOTA5L._AC_SL1500_.jpg'
      WHEN 'wifi-vs-cellular-pet-tracker' THEN 'https://m.media-amazon.com/images/I/71RhFkAumdL._AC_SL1500_.jpg'
      WHEN 'automatic-litter-box-maintenance-routine' THEN 'https://m.media-amazon.com/images/I/71pk1UePo5L._AC_SL1500_.jpg'
      WHEN 'smart-feeder-backup-plan' THEN 'https://m.media-amazon.com/images/I/71g1HcpaAzL._AC_SL1500_.jpg'
      WHEN 'gps-tracker-coverage-checklist' THEN 'https://m.media-amazon.com/images/I/71RhFkAumdL._AC_SL1500_.jpg'
      WHEN 'pet-camera-privacy-setup' THEN 'https://m.media-amazon.com/images/I/616wRFOTA5L._AC_SL1500_.jpg'
      WHEN 'water-fountain-cleaning-calendar' THEN 'https://m.media-amazon.com/images/I/71Us-ricetL._AC_SX679_.jpg'
      ELSE image_url
    END
WHERE slug IN (
  'how-to-choose-automatic-litter-box', 'gps-tracker-subscription-costs-explained',
  'clumping-vs-crystal-litter', 'pet-feeder-dispensing-accuracy',
  'pet-camera-separation-anxiety-guide', 'wifi-vs-cellular-pet-tracker',
  'automatic-litter-box-maintenance-routine', 'smart-feeder-backup-plan',
  'gps-tracker-coverage-checklist', 'pet-camera-privacy-setup',
  'water-fountain-cleaning-calendar'
);
