/* Add an explicit decision trail to every scenario guide. */
SET NAMES utf8mb4;

UPDATE best_picks
SET content_json = JSON_SET(content_json, '$.decision', CASE slug
  WHEN 'best-automatic-litter-box-multiple-cats' THEN JSON_OBJECT(
    'headline','Why Whisker Litter-Robot 4 wins this scenario',
    'summary','For a busy multi-cat home, the recommendation is driven by capacity and repeatable multi-cat workflow—not by having the lowest purchase price.',
    'criteria',JSON_ARRAY(
      JSON_OBJECT('label','Waste capacity','result','Leads','detail','The larger drawer reduces emptying frequency when several cats share the unit.'),
      JSON_OBJECT('label','After-visit workflow','result','Leads','detail','Automatic cycling and a recovery cycle keep the box ready for the next cat.'),
      JSON_OBJECT('label','Household visibility','result','Leads','detail','Per-cat usage history adds a useful signal that compact or lower-cost alternatives may not provide.'),
      JSON_OBJECT('label','Footprint and price','result','Trade-off','detail','PETLIBRO Luma and crystal-tray alternatives can be easier on space or budget.')
    ),
    'boundary','Choose another model if compact placement or low ownership cost is more important than multi-cat capacity and usage visibility.',
    'confidence','Moderate'
  )
  WHEN 'best-gps-tracker-escape-prone-dogs' THEN JSON_OBJECT(
    'headline','Why Tractive Smart Dog GPS Tracker wins this scenario',
    'summary','For an escape-prone dog in supported US coverage, staying powered and connected is more valuable than a cheaper device that is harder to rely on during a recovery search.',
    'criteria',JSON_ARRAY(
      JSON_OBJECT('label','Battery continuity','result','Leads','detail','Longer stated runtime reduces the chance of a missed alert caused by frequent charging.'),
      JSON_OBJECT('label','US coverage fit','result','Leads','detail','The recommendation matches a US LTE-M workflow when the home and escape area are covered.'),
      JSON_OBJECT('label','Recovery alerts','result','Leads','detail','Safe-zone and escape alerts create an actionable first warning before a longer search begins.'),
      JSON_OBJECT('label','International coverage','result','Trade-off','detail','Tractive XL is the better direction when the dog crosses borders or needs broader published coverage.')
    ),
    'boundary','This is not the best pick outside supported US coverage, or when the shortest live-location interval matters more than battery life.',
    'confidence','Moderate'
  )
  WHEN 'best-pet-feeder-portion-control' THEN JSON_OBJECT(
    'headline','Why PETLIBRO Granary wins this scenario',
    'summary','The pick is based on repeatable dry-food dispensing and schedule flexibility, then verified with the actual kibble and a kitchen scale.',
    'criteria',JSON_ARRAY(
      JSON_OBJECT('label','Portion repeatability','result','Leads','detail','Its published and measured accuracy focus make it the strongest fit when meal variance matters.'),
      JSON_OBJECT('label','Schedule control','result','Leads','detail','Flexible schedules support smaller, repeatable meals instead of one simple daily timer.'),
      JSON_OBJECT('label','Dry-food compatibility','result','Meets','detail','The workflow is appropriate for dry food; kibble shape and dust still need a real-world portion check.'),
      JSON_OBJECT('label','Simplicity and price','result','Trade-off','detail','VOLUAS or PetSafe can be preferable when connected features and tighter portion evidence are unnecessary.')
    ),
    'boundary','Do not treat this recommendation as medical-grade dosing without repeated weighing and veterinary guidance.',
    'confidence','Moderate'
  )
  WHEN 'best-pet-camera-separation-anxiety' THEN JSON_OBJECT(
    'headline','Why Furbo 360 Dog Camera wins this scenario',
    'summary','Separation-anxiety decisions need usable observation, not just a live video feed: wide coverage, dog-focused alerts, and clear audio explain the recommendation.',
    'criteria',JSON_ARRAY(
      JSON_OBJECT('label','Behavior visibility','result','Leads','detail','A rotating view makes it easier to observe pacing, settling, and triggers across a room.'),
      JSON_OBJECT('label','Dog-focused alerts','result','Leads','detail','Alerts are tuned to the behaviors an owner is trying to understand during an absence.'),
      JSON_OBJECT('label','Two-way audio','result','Useful with care','detail','Clear audio can help some dogs, but should be tested because remote voices can increase distress.'),
      JSON_OBJECT('label','Local storage and cost','result','Trade-off','detail','eufy is a better fit when local storage or avoiding a recurring cloud plan is the priority.')
    ),
    'boundary','A camera cannot treat separation anxiety. Choose a simpler or local-storage camera when alerts, cloud cost, or remote audio are likely to make the situation worse.',
    'confidence','Moderate'
  )
  WHEN 'best-automatic-litter-box-small-spaces' THEN JSON_OBJECT(
    'headline','Why PETLIBRO Luma Automatic Litter Box wins this scenario',
    'summary','The recommendation is narrow by design: it wins when the complete operating footprint must fit a small room and a single or lighter-use household can accept more frequent maintenance.',
    'criteria',JSON_ARRAY(
      JSON_OBJECT('label','Compact placement','result','Leads','detail','The enclosed form is easier to place in apartments and utility rooms than larger multi-cat units.'),
      JSON_OBJECT('label','Service access','result','Meets','detail','It still needs clearance to remove the drawer, add litter, and clean safely.'),
      JSON_OBJECT('label','Waste capacity','result','Trade-off','detail','Litter-Robot 4 is the stronger choice when fewer emptying trips matter more than floor area.'),
      JSON_OBJECT('label','Cat acceptance','result','Must verify','detail','Entrance size, weight range, noise, and enclosed design can outweigh every dimensional advantage for a hesitant cat.')
    ),
    'boundary','This is not the best choice for heavy multi-cat use or homes that cannot provide the required service clearance.',
    'confidence','Moderate'
  )
  WHEN 'best-gps-tracker-international-travel' THEN JSON_OBJECT(
    'headline','Why Tractive XL Smart Dog GPS Tracker wins this scenario',
    'summary','Cross-border travel changes the first question from “how long is the battery?” to “will the tracker connect where we are going?”',
    'criteria',JSON_ARRAY(
      JSON_OBJECT('label','Published coverage','result','Leads','detail','Coverage spanning more than 175 countries gives this pick the broadest travel fit in the shortlist.'),
      JSON_OBJECT('label','Travel readiness','result','Meets','detail','The app, collar fit, charging cable, and plan should be tested before departure rather than at the destination.'),
      JSON_OBJECT('label','Battery endurance','result','Trade-off','detail','Fi Series 3 can last longer in supported US use, but that advantage does not solve international coverage.'),
      JSON_OBJECT('label','Recurring cost','result','Trade-off','detail','The subscription is part of the travel budget and should be compared with the length of each trip.')
    ),
    'boundary','Choose a domestic-only tracker when the dog stays inside its supported network and multi-month battery life is the overriding constraint.',
    'confidence','Moderate'
  )
  WHEN 'best-smart-feeder-simple-schedules' THEN JSON_OBJECT(
    'headline','Why VOLUAS Automatic Cat Feeder wins this scenario',
    'summary','For a basic dry-food routine, the best choice is the device that reliably keeps a few scheduled meals running without adding an app ecosystem the household does not need.',
    'criteria',JSON_ARRAY(
      JSON_OBJECT('label','Routine simplicity','result','Leads','detail','Straightforward scheduling keeps setup and daily ownership understandable.'),
      JSON_OBJECT('label','Entry cost','result','Leads','detail','The lower price preserves the core timed-feeding workflow for budget-conscious homes.'),
      JSON_OBJECT('label','Portion evidence','result','Trade-off','detail','PETLIBRO Granary is the better fit when measured repeatability matters more than simplicity.'),
      JSON_OBJECT('label','Remote visibility','result','Trade-off','detail','Connected models are preferable when status checks, camera confirmation, or remote changes are essential.')
    ),
    'boundary','Do not choose this scenario winner for wet food, medication-linked meals, or a diet that requires tightly audited portions.',
    'confidence','Moderate'
  )
  WHEN 'best-pet-camera-treat-interaction' THEN JSON_OBJECT(
    'headline','Why Petcube Bites 2 Lite Cam Bundle wins this scenario',
    'summary','When the job is a short, predictable interaction—not whole-room surveillance—the lower-cost treat workflow outweighs the lack of 360-degree coverage.',
    'criteria',JSON_ARRAY(
      JSON_OBJECT('label','Treat interaction','result','Leads','detail','The dispenser is the central feature and supports a simple enrichment routine from another room.'),
      JSON_OBJECT('label','Value','result','Leads','detail','The lower entry price suits owners who want interaction without paying for a wider monitoring system.'),
      JSON_OBJECT('label','Room coverage','result','Trade-off','detail','Furbo 360 is stronger when the pet can move outside a fixed camera view.'),
      JSON_OBJECT('label','Behavior fit','result','Must verify','detail','Treats can increase arousal or guarding, so the throw distance and the pet’s response need a supervised test.')
    ),
    'boundary','Choose Furbo 360 or a general pan/tilt camera when monitoring coverage matters more than dispensing treats.',
    'confidence','Moderate'
  )
  ELSE JSON_OBJECT()
END)
WHERE slug IN (
  'best-automatic-litter-box-multiple-cats',
  'best-gps-tracker-escape-prone-dogs',
  'best-pet-feeder-portion-control',
  'best-pet-camera-separation-anxiety',
  'best-automatic-litter-box-small-spaces',
  'best-gps-tracker-international-travel',
  'best-smart-feeder-simple-schedules',
  'best-pet-camera-treat-interaction'
);
