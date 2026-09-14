SET NAMES utf8mb4;

/* Core guides use the checked Amazon product image for the relevant scenario.
   image_key stays NULL so the remote Amazon fallback is not shadowed by an old
   placeholder asset. */
UPDATE guides g JOIN products p ON p.slug='oneisall-quiet-dog-clippers'
SET g.image_url=p.image_url,g.image_key=NULL
WHERE g.slug='choose-a-pet-clipper-by-coat-and-temperament';
UPDATE guides g JOIN products p ON p.slug='litter-genie-plus'
SET g.image_url=p.image_url,g.image_key=NULL
WHERE g.slug IN ('build-a-lower-mess-pet-cleanup-routine','pet-waste-cost-and-capacity-planner');
UPDATE guides g JOIN products p ON p.slug='ruffwear-front-range-harness'
SET g.image_url=p.image_url,g.image_key=NULL
WHERE g.slug IN ('measure-and-fit-a-dog-harness','dog-walk-safety-preflight');
UPDATE guides g JOIN products p ON p.slug='dremel-pawcontrol-nail-grinder'
SET g.image_url=p.image_url,g.image_key=NULL
WHERE g.slug='pet-grooming-session-safety-checklist';
