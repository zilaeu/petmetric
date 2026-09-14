/* Final copy pass: visible names must exactly match the published catalog. */
SET NAMES utf8mb4;

UPDATE comparisons
SET verdict = 'Whisker Litter-Robot 4 Supply Bundle is the more established rotating option; Neakasa M1 Plus offers an open-top design with a different cat-fit trade-off.',
    home_verdict = 'Whisker Litter-Robot 4 Supply Bundle for a mature rotating workflow; Neakasa for an open-top entry.'
WHERE slug = 'litter-robot-4-vs-neakasa-m1-plus' AND is_published = TRUE;

UPDATE comparisons
SET verdict = 'Both products are Tractive trackers; the DOG 6 is the standard dog fit, while the XL model targets larger dogs and longer battery intervals.',
    home_verdict = 'Choose the DOG 6 for standard dog fit; choose the XL model for larger dogs and longer battery intervals.'
WHERE slug = 'tractive-gps-vs-fi-series-3' AND is_published = TRUE;

UPDATE comparison_best_for cb
JOIN comparisons c ON c.id = cb.comparison_id
SET cb.pick_name = 'PetSafe ScoopFree Crystal Pro Legacy'
WHERE c.slug = 'litter-robot-4-vs-petsafe-scoopfree'
  AND cb.sort_order = 2
  AND c.is_published = TRUE;

