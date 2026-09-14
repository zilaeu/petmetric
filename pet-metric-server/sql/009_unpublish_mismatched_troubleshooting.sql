/*
  Hide troubleshooting articles whose linked catalog products were replaced
  during the verified Amazon refresh. Their model-specific instructions no
  longer match the products attached to those records, so publishing them
  would be unsafe until the content is re-researched against manufacturer
  documentation.
*/
UPDATE troubleshooting_guides
SET is_published = FALSE
WHERE slug IN (
  'fi-series-3-dog-not-on-map',
  'petkit-pura-max-cat-not-using'
);
