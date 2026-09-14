SET NAMES utf8mb4;

/* The catalogue now covers eight categories, including the three cat/dog
   care and safety groups. Keep the public site description aligned with the
   actual inventory instead of the original four-category MVP copy. */
UPDATE site_settings SET setting_value=JSON_SET(setting_value,
  '$.description','Independent research on cat and dog products across smart home, feeding, hydration, litter, grooming, waste cleanup, walking, and safety with dated sources and clear commercial disclosures.')
WHERE setting_key='home';

/* Make non-substitute matchups explicit in the data so cards and detail pages
   can set the right expectation before a reader compares the products. */
UPDATE comparisons SET content_json=JSON_SET(content_json,'$.comparisonType','Workflow comparison')
WHERE slug IN ('furminator-vs-dremel-pawcare','oneisall-vs-furminator-grooming','weewee-pads-vs-drymate-mat','litter-genie-vs-waste-bags','weewee-pads-vs-litter-genie','kurgo-vs-voyager-walk-setup');
UPDATE comparisons SET content_json=JSON_SET(content_json,'$.comparisonType','Direct alternative')
WHERE slug IN ('oneisall-vs-wahl-bravura','ruffwear-vs-julius-k9','ruffwear-vs-kurgo-harness');

/* Add explicit source lists to the six cat/dog guides. Source notes alone are
   useful context, but users need a clickable path to the listing or brand
   documentation used for the scenario. */
UPDATE guides SET content_json=JSON_SET(content_json,'$.sources',JSON_ARRAY(
  JSON_OBJECT('label','Oneisall Amazon listing · ASIN B01HRSZRXM','url','https://www.amazon.com/dp/B01HRSZRXM'),
  JSON_OBJECT('label','Wahl Professional Animal Bravura Amazon listing · ASIN B00EVBXI5S','url','https://www.amazon.com/dp/B00EVBXI5S'),
  JSON_OBJECT('label','Pet grooming safety reference','url','https://www.aspca.org/pet-care/general-pet-care/grooming-your-dog')
),'$.sourceNote','Product facts are tied to the checked Amazon listings. Safety boundaries are general guidance; consult a qualified groomer or veterinarian for mats, skin problems, or distressed pets.')
WHERE slug IN ('choose-a-pet-clipper-by-coat-and-temperament','pet-grooming-session-safety-checklist');
UPDATE guides SET content_json=JSON_SET(content_json,'$.sources',JSON_ARRAY(
  JSON_OBJECT('label','Litter Genie Amazon listing · ASIN B019W0OH48','url','https://www.amazon.com/dp/B019W0OH48'),
  JSON_OBJECT('label','Four Paws Amazon listing · ASIN B004GWSIJ8','url','https://www.amazon.com/dp/B004GWSIJ8'),
  JSON_OBJECT('label','Drymate Amazon listing · ASIN B099HBMZ67','url','https://www.amazon.com/dp/B099HBMZ67')
),'$.sourceNote','Dimensions and workflow facts are tied to checked Amazon listings. Price, pack count, refill availability, and current variants can change.')
WHERE slug IN ('build-a-lower-mess-pet-cleanup-routine','pet-waste-cost-and-capacity-planner');
UPDATE guides SET content_json=JSON_SET(content_json,'$.sources',JSON_ARRAY(
  JSON_OBJECT('label','Ruffwear Amazon listing · ASIN B0CLB3VFB8','url','https://www.amazon.com/dp/B0CLB3VFB8'),
  JSON_OBJECT('label','Julius-K9 Amazon listing · ASIN B004IQ6EZ2','url','https://www.amazon.com/dp/B004IQ6EZ2'),
  JSON_OBJECT('label','Kurgo Amazon listing · ASIN B0064ACNLO','url','https://www.amazon.com/dp/B0064ACNLO')
),'$.sourceNote','Variant and feature facts are tied to checked Amazon listings. Fit, escape risk, and vehicle restraint must be tested on the actual dog using current manufacturer instructions.')
WHERE slug IN ('measure-and-fit-a-dog-harness','dog-walk-safety-preflight');
