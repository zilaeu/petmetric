SET NAMES utf8mb4;

/* Keep the editorial JSON typed consistently so the detail template can show
   criterion evidence and alternative explanations rather than single strings. */
UPDATE best_picks SET content_json=JSON_SET(content_json,
  '$.decision.criteria',JSON_ARRAY(
    JSON_OBJECT('label','Coat condition','result','Must fit','detail','Use only on a brushed, non-matted coat; stop if the blade pulls or the skin cannot be seen.'),
    JSON_OBJECT('label','Guide-comb range','result','Documented','detail','The checked listing identifies six guide combs for repeatable home-trim length control.'),
    JSON_OBJECT('label','Noise and heat tolerance','result','Must verify','detail','Run the cordless tool away from the pet first and check blade temperature during short passes.')
  ),
  '$.alternatives',JSON_ARRAY(
    JSON_ARRAY('Wahl Professional Animal Bravura','Choose when adjustable blade control and replacement-blade maintenance matter more than a simple guard workflow.'),
    JSON_ARRAY('A professional groomer','Choose for tight mats, close-to-skin work, or a pet that cannot remain calm.')
  )
) WHERE slug='best-quiet-grooming-clipper';

UPDATE best_picks SET content_json=JSON_SET(content_json,
  '$.decision.criteria',JSON_ARRAY(
    JSON_OBJECT('label','Usable floor area','result','Documented','detail','The checked variant measures 27.5 x 44 inches; confirm pack count and current variant.'),
    JSON_OBJECT('label','Edge and runoff risk','result','Feature claim','detail','A runoff barrier edge helps, but placement and the pet targeting an edge still determine leakage.'),
    JSON_OBJECT('label','Weekly usage cost','result','Must calculate','detail','Compare pads used per week plus cleaner and laundry, not package price alone.')
  ),
  '$.alternatives',JSON_ARRAY(
    JSON_ARRAY('Drymate washable litter mat','Choose when the recurring problem is litter tracking or floor debris rather than dog urine.'),
    JSON_ARRAY('Outdoor potty routine','Choose when the household can reliably move liquid waste outdoors.')
  )
) WHERE slug='best-large-dog-training-pad';

UPDATE best_picks SET content_json=JSON_SET(content_json,
  '$.decision.criteria',JSON_ARRAY(
    JSON_OBJECT('label','Chest measurement','result','Must fit','detail','The checked Amazon record is Basalt Gray X-Small; use the current Ruffwear chart for the actual dog.'),
    JSON_OBJECT('label','Movement and comfort','result','Must verify','detail','Allow two fingers under straps and check the elbows, throat, and shoulder movement.'),
    JSON_OBJECT('label','Escape boundary','result','Must test','detail','Perform a gentle supervised backing-out check indoors before outdoor use.')
  ),
  '$.alternatives',JSON_ARRAY(
    JSON_ARRAY('Julius-K9 IDC Powerharness','Choose when a back handle and firm control are more important than a walking-first padded feel.'),
    JSON_ARRAY('Kurgo Enhanced Strength Tru-Fit','Choose when the household also needs a documented walk-and-travel workflow.')
  )
) WHERE slug='best-everyday-dog-harness';

UPDATE best_picks SET content_json=JSON_SET(content_json,
  '$.decision.criteria',JSON_ARRAY(
    JSON_OBJECT('label','Correct size and coat','result','Must fit','detail','The checked variant is for large dogs over 50 lb with long hair; do not generalize it to every coat.'),
    JSON_OBJECT('label','Pressure and session length','result','Must control','detail','Use light pressure on a clean, dry coat and stop when the skin becomes irritated.'),
    JSON_OBJECT('label','Job boundary','result','Documented','detail','This is an undercoat de-shedding tool, not a clipper, detangler, or mat-removal tool.')
  ),
  '$.alternatives',JSON_ARRAY(
    JSON_ARRAY('A coat-length clipper','Choose when the goal is changing trim length rather than removing loose undercoat.'),
    JSON_ARRAY('A soft detangling brush','Choose when the main problem is surface tangles and daily brushing.')
  )
) WHERE slug='best-de-shedding-tool';

UPDATE best_picks SET content_json=JSON_SET(content_json,
  '$.decision.criteria',JSON_ARRAY(
    JSON_OBJECT('label','Cat count and scoop volume','result','Must calculate','detail','The listing says up to 14 days for one cat; multiple cats and larger clumps shorten the interval.'),
    JSON_OBJECT('label','Refill-film availability','result','Ongoing cost','detail','The standard 14 ft refill is part of the ownership workflow and should be priced before buying.'),
    JSON_OBJECT('label','Sealing routine','result','Must maintain','detail','Push waste below the seal, close the chute, and empty before overfilling.')
  ),
  '$.alternatives',JSON_ARRAY(
    JSON_ARRAY('Disposable litter bags','Choose when portable or non-proprietary disposal matters more than an indoor pail.'),
    JSON_ARRAY('A lidded household waste bin','Choose when refill film is unavailable and a normal sealed-bin routine is acceptable.')
  )
) WHERE slug='best-indoor-litter-waste-pail';

UPDATE best_picks SET content_json=JSON_SET(content_json,
  '$.decision.criteria',JSON_ARRAY(
    JSON_OBJECT('label','Chest measurement and variant','result','Must fit','detail','The checked record is black Large with a listing claim up to 75 lb; use the current Kurgo chart.'),
    JSON_OBJECT('label','Vehicle attachment','result','Must verify','detail','Use only the documented seatbelt tether and steel carabiner path for the exact model.'),
    JSON_OBJECT('label','Stationary movement test','result','Required','detail','Check sitting, standing, buckles, tether, and backing-out resistance while parked.')
  ),
  '$.alternatives',JSON_ARRAY(
    JSON_ARRAY('A walking-first padded harness','Choose when car travel is not part of the routine.'),
    JSON_ARRAY('A secured travel crate','Choose when the vehicle setup calls for enclosure rather than a harness restraint.')
  )
) WHERE slug='best-walk-and-travel-harness';
