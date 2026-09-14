/* Keep the checked theme count aligned with the final coded review set. */
SET NAMES utf8mb4;

UPDATE product_user_review_summaries s
JOIN products p ON p.id=s.product_id
SET s.themes_json=JSON_SET(
  s.themes_json,
  '$[3].mentions',7,
  '$[3].detail','7 of 12 reviews mention the oversized or noisy bowl, awkward clearance for smaller bowls, food scatter, or owners making a tray or ramp.'
)
WHERE p.external_id='B00VIXRB6O';
