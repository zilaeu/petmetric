/*
  Restore a complete editorial review for the verified Amazon product behind
  the legacy /reviews/petkit-pura-max/ route. The route slug is retained for
  backward compatibility; all visible content follows ASIN B0GD69KW7J.
*/
SET NAMES utf8mb4;

UPDATE products
SET verdict = 'Neakasa M1 Plus with Airstep combines an open-top automatic cleaning system, a large waste bin, and a dedicated air purifier. Its strongest case is easier entry for cats that resist enclosed globes, while its footprint, filter replacements, and lightly reviewed Amazon listing require a careful fit and ownership check.',
    best_for = 'Cats that resist enclosed globes and homes with room for an open-top automatic litter box'
WHERE slug = 'petkit-pura-max'
  AND external_id = 'B0GD69KW7J'
  AND is_published = TRUE;

INSERT INTO product_reviews
  (product_id, summary, gallery_json, quick_specs_json, strengths_json,
   limitations_json, sections_json, research_date, price_checked_date,
   next_review_label, source_count, is_published)
SELECT
  p.id,
  'Neakasa M1 Plus with Airstep is an open-top automatic litter box that moves waste into an 11.2 L bin and pairs the cleaning system with a three-mode air purifier. The open entrance is the main reason to consider it over an enclosed rotating globe, especially for larger or enclosure-averse cats. It still needs normal litter top-ups, drawer checks, surface cleaning, and scheduled filter replacement; the Amazon claim of 7–14 days between waste-bin service depends on cat count and use.',
  JSON_ARRAY(p.image_url),
  JSON_ARRAY(
    JSON_OBJECT('label','Structure','value','Open-top with integrated Airstep'),
    JSON_OBJECT('label','Cleaning','value','Automatic Pull & Wrap waste handling'),
    JSON_OBJECT('label','Waste bin','value','11.2 L; 7–14 days claimed'),
    JSON_OBJECT('label','Litter capacity','value','7.2 L'),
    JSON_OBJECT('label','Odor system','value','Air purifier with three airflow modes'),
    JSON_OBJECT('label','Filter care','value','Replace every 2–3 months')
  ),
  JSON_ARRAY(
    'Open-top entry avoids the narrow doorway and enclosed ceiling of a globe-style box',
    'Integrated Airstep provides a defined route into the litter area',
    '11.2 L waste bin is sized for fewer drawer-emptying interruptions',
    'Dedicated air purifier adds active odor, fur, and litter-dust management',
    'Three airflow modes let owners balance air treatment with the room and routine',
    '7.2 L litter capacity supports a substantial working litter bed'
  ),
  JSON_ARRAY(
    'Open design exposes more of the litter area and may allow additional tracking around the unit',
    'The full footprint and service clearance need measuring before purchase',
    'The 7–14 day waste-bin interval is a manufacturer claim, not a guaranteed schedule',
    'Air-purifier filters are a recurring consumable and may need earlier replacement in busier homes',
    'The checked Amazon listing had only three ratings, which is too small a sample for a reliable ownership consensus',
    'Current listing materials do not establish long-term motor, sensor, or sealing reliability'
  ),
  JSON_ARRAY(
    JSON_OBJECT(
      'title','Design and cat access',
      'body','The M1 Plus uses an open-top structure rather than asking a cat to enter a covered globe. That removes an enclosed doorway and gives the cat a clearer view of the room, which may make introduction easier for cats that avoid tight boxes. The integrated Airstep creates a deliberate entry route, but owners should still compare its height and surface with the cat’s mobility, size, and confidence.'
    ),
    JSON_OBJECT(
      'title','Automatic cleaning workflow',
      'body','The checked listing describes an automatic self-cleaning cycle with Pull & Wrap waste handling. In daily use, automation changes the job from scooping every visit to checking that the cycle completed, topping up litter, inspecting the waste path, and removing the sealed waste load before it becomes overfull. The first cycles should be supervised so every cat’s response and the unit’s movement can be observed.'
    ),
    JSON_OBJECT(
      'title','Waste and litter capacity',
      'body','The published capacities are 11.2 L for the waste bin and 7.2 L for litter. Neakasa claims the waste bin can cover roughly 7–14 days, but the practical interval will change with the number and size of cats, stool volume, litter behavior, and how conservatively the bin is filled. Treat the capacity as a planning range and inspect it frequently until the household establishes its own schedule.'
    ),
    JSON_OBJECT(
      'title','Odor, fur, and dust control',
      'body','A dedicated air purifier distinguishes this configuration from an automatic box that relies only on a covered drawer or deodorizing insert. The listing describes three airflow modes and says the purifier captures odor, fur, and litter dust. This remains a manufacturer claim: room ventilation, litter choice, drawer service, and surface cleaning will still determine how the area smells in practice.'
    ),
    JSON_OBJECT(
      'title','Placement and litter tracking',
      'body','Measure the complete unit, the Airstep, the path a cat uses to enter, and the clearance needed to remove waste and clean surfaces. An open top can improve visual and physical access, but it does not contain kicked litter as fully as a high-sided enclosure. A washable mat and enough open floor space around the step can make the daily cleanup easier.'
    ),
    JSON_OBJECT(
      'title','Cat transition and safety',
      'body','Keep the familiar litter box available during introduction and begin with the new unit inactive or in the manufacturer-approved non-automatic state. Use familiar, compatible litter and let the cat investigate voluntarily. Enable cleaning only after the cat is entering calmly, and never reach into a moving mechanism; disconnect power before clearing an obstruction or removing serviceable parts.'
    ),
    JSON_OBJECT(
      'title','Maintenance and recurring cost',
      'body','The ownership routine includes emptying the waste bin, replenishing litter, wiping accessible contact areas, checking the cleaning path, and caring for the air purifier. The listed filter interval is every 2–3 months, with earlier replacement suggested for homes with more than two cats. Include filters, waste liners or bags, litter use, and cleaning supplies when comparing total cost with another automatic box.'
    ),
    JSON_OBJECT(
      'title','Connectivity and evidence limits',
      'body','Do not assume features from another Neakasa or PETKIT model apply to this exact ASIN. The checked Amazon facts establish the open-top design, capacities, Pull & Wrap cleaning, Airstep, and air-purifier workflow; they do not provide enough evidence here to judge long-term connectivity, sensor accuracy, or mechanical reliability. The 2.9-star average came from only three ratings at the last check and should not be treated as a stable verdict.'
    ),
    JSON_OBJECT(
      'title','Who should buy it',
      'body','This model is most compelling for owners who want automatic waste handling but expect an enclosed globe to be a poor fit for their cat. It also suits households that value a large waste bin and active air treatment and have enough floor space for the open-top body and step. Choose a simpler manual box when recurring filter care or mechanical maintenance is undesirable, and compare other automatic designs when compact placement or a mature body of owner feedback is the higher priority.'
    )
  ),
  '2026-09-07',
  '2026-09-05',
  'December 2026',
  1,
  TRUE
FROM products p
WHERE p.slug = 'petkit-pura-max'
  AND p.external_id = 'B0GD69KW7J'
  AND p.is_published = TRUE
ON DUPLICATE KEY UPDATE
  summary = VALUES(summary),
  gallery_json = VALUES(gallery_json),
  quick_specs_json = VALUES(quick_specs_json),
  strengths_json = VALUES(strengths_json),
  limitations_json = VALUES(limitations_json),
  sections_json = VALUES(sections_json),
  research_date = VALUES(research_date),
  price_checked_date = VALUES(price_checked_date),
  next_review_label = VALUES(next_review_label),
  source_count = VALUES(source_count),
  is_published = TRUE;
