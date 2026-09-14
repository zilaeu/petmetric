/* Expand scenario guides with practical, product-specific editorial context. */
SET NAMES utf8mb4;

UPDATE best_picks
SET content_json = CASE slug
  WHEN 'best-automatic-litter-box-multiple-cats' THEN JSON_OBJECT(
    'why','Large waste capacity, dependable automatic cycles, and per-cat usage monitoring make Litter-Robot 4 the easiest fit for a busy multi-cat home.',
    'notFor','Single-cat homes on a tight budget, homes without a stable hard-floor location, or owners who do not want to manage app setup and recurring consumables.',
    'sections',JSON_ARRAY(
      JSON_OBJECT('title','Why it suits multiple cats','body','A larger drawer and a recovery cycle after each visit reduce the chance that one cat leaves the box waiting for attention. Usage history can also help you notice when one cat suddenly visits more or less often.'),
      JSON_OBJECT('title','The ownership trade-off','body','The initial price is high, and the system still needs litter top-ups, drawer liners, cleaning, and a suitable floor position. Treat the app and health signals as useful trends, not a diagnosis.'),
      JSON_OBJECT('title','Before you buy','body','Measure the available footprint, confirm every cat fits the entrance and weight range, and decide whether the optional plan and replacement supplies fit your twelve-month budget.'),
      JSON_OBJECT('title','A sensible setup','body','Place it on a level, firm surface with clearance around the drawer. Start with one familiar clumping litter, supervise the first cycles, and keep a second box available while cats adjust.')
    ),
    'alternatives',JSON_ARRAY(JSON_ARRAY('PETKIT PURA X','More compact enclosed footprint for smaller rooms.'),JSON_ARRAY('PetSafe ScoopFree','Lower entry price for owners comfortable with crystal trays and less app detail.'))
  )
  WHEN 'best-gps-tracker-escape-prone-dogs' THEN JSON_OBJECT(
    'why','Long battery life and dependable US LTE-M coverage make Fi Series 3 a practical choice for dogs that may spend time away from home.',
    'notFor','International travel, areas with weak supported cellular coverage, or owners who need the shortest possible live-location interval.',
    'sections',JSON_ARRAY(
      JSON_OBJECT('title','Why it suits escape-prone dogs','body','The main advantage is fewer charging interruptions: a tracker that stays on the collar is more useful than one with impressive features but a short runtime. Safe-zone and escape alerts add a second layer after a dog leaves its expected area.'),
      JSON_OBJECT('title','Coverage comes first','body','Fi relies on supported cellular networks. Check the coverage map for your home, walking routes, and likely escape area before treating the battery claim as decisive.'),
      JSON_OBJECT('title','The ownership trade-off','body','A subscription is part of the real cost. Live tracking, alert behavior, and battery life also vary with coverage, update frequency, weather, and how often the dog is moving.'),
      JSON_OBJECT('title','Before you buy','body','Confirm collar sizing and attachment, test a safe-zone alert while you are nearby, and keep a physical ID tag and recall plan in place. GPS is a recovery aid, not a substitute for supervision.')
    ),
    'alternatives',JSON_ARRAY(JSON_ARRAY('Tractive GPS','Better fit when the dog travels internationally or you need a faster location refresh.'),JSON_ARRAY('Whistle GO Explore','Consider when health and activity insights matter as much as location.'))
  )
  WHEN 'best-pet-feeder-portion-control' THEN JSON_OBJECT(
    'why','PETLIBRO Granary combines low measured portion variance with flexible schedules, making it a strong fit when predictable meals matter more than premium camera features.',
    'notFor','Owners who do not want app setup, pets that need wet food, or households that cannot keep the feeder on a stable surface with backup power.',
    'sections',JSON_ARRAY(
      JSON_OBJECT('title','Why it suits portion control','body','Repeatable dispensing matters more than a single successful meal. The Granary is a practical starting point for scheduled dry-food portions, especially when you can verify the actual amount with a kitchen scale.'),
      JSON_OBJECT('title','Test with your kibble','body','Kibble shape, size, and dust change every dispenser. Run at least ten weighed portions using the food you actually feed, then adjust the scheduled amount instead of assuming the label is exact.'),
      JSON_OBJECT('title','The ownership trade-off','body','A camera-equipped version costs more, and app-connected features add setup and maintenance. Keep the local schedule and a manual feeding fallback usable if Wi-Fi or power fails.'),
      JSON_OBJECT('title','Before you buy','body','Check the hopper size, bowl height, cleaning access, battery backup, and whether your pet can knock or pry at the unit. For a medically managed diet, confirm the result with your veterinary team.')
    ),
    'alternatives',JSON_ARRAY(JSON_ARRAY('PetSafe Healthy Pet Simply Feed','Simpler scheduled feeding with less connected functionality.'),JSON_ARRAY('VOLUAS Automatic Cat Feeder','Lower-cost option when basic dry-food schedules are enough.'))
  )
  WHEN 'best-pet-camera-separation-anxiety' THEN JSON_OBJECT(
    'why','Furbo 360 combines a wide rotating view, clear two-way audio, and dog-focused alerts for owners who need to understand what happens when they leave.',
    'notFor','Owners avoiding subscriptions, pets that become more agitated by remote voices, or homes that need local recording without cloud features.',
    'sections',JSON_ARRAY(
      JSON_OBJECT('title','Why it suits separation anxiety','body','The useful part is not simply seeing a pet; it is observing pacing, barking, settling, and triggers over time. A wide view reduces blind spots, while audio can help in some homes and make distress worse in others.'),
      JSON_OBJECT('title','Use the camera as an observation tool','body','Watch quietly before speaking. Note the time, behavior, and recovery after an alert, then change one variable at a time. Persistent distress should be discussed with a qualified behavior professional.'),
      JSON_OBJECT('title','The ownership trade-off','body','Cloud features and advanced alerts may require a recurring plan. Place the camera where movement is visible, but avoid using treat tosses or repeated voice prompts as a replacement for a gradual absence plan.'),
      JSON_OBJECT('title','Before you buy','body','Confirm your Wi-Fi reaches the camera location, test night visibility and audio delay, and decide how much recording history you actually need. A camera cannot prevent an unsafe situation on its own.')
    ),
    'alternatives',JSON_ARRAY(JSON_ARRAY('Petcube Bites 2','Lower-cost treat interaction without a 360-degree pan.'),JSON_ARRAY('eufy Security Indoor Cam E220','Consider when local-style indoor monitoring and pan/tilt matter more than dog-specific alerts.'))
  )
  WHEN 'best-automatic-litter-box-small-spaces' THEN JSON_OBJECT(
    'why','PETKIT PURA X offers a more compact enclosed footprint for apartments and utility rooms where every inch matters.',
    'notFor','Large multi-cat households, cats that dislike enclosed entrances, or owners who need the largest possible waste drawer.',
    'sections',JSON_ARRAY(
      JSON_OBJECT('title','Why it suits small spaces','body','The enclosed body can be easier to place than a larger open design, but the required service clearances still count. Measure the full operating footprint, not just the product shell.'),
      JSON_OBJECT('title','The capacity compromise','body','A smaller waste drawer usually means more frequent emptying in a multi-cat home. Compact does not mean maintenance-free; keep access clear for cleaning and litter top-ups.'),
      JSON_OBJECT('title','Before you buy','body','Confirm entrance dimensions, cat weight range, litter compatibility, noise tolerance, and a level floor. Leave enough room to remove the drawer without moving the entire unit.'),
      JSON_OBJECT('title','Who should look elsewhere','body','If two or more cats share the box heavily, compare drawer capacity and cycle recovery before prioritizing exterior dimensions.')
    ),
    'alternatives',JSON_ARRAY(JSON_ARRAY('Litter-Robot 4','Larger drawer and stronger multi-cat workflow when floor space and budget allow.'))
  )
  WHEN 'best-gps-tracker-international-travel' THEN JSON_OBJECT(
    'why','Tractive GPS is the better fit when a pet may cross borders because its published coverage spans more than 175 countries.',
    'notFor','Owners prioritizing multi-month battery life, areas without supported cellular coverage, or anyone unwilling to maintain a subscription.',
    'sections',JSON_ARRAY(
      JSON_OBJECT('title','Why coverage changes the decision','body','International travel makes network availability more important than a headline battery number. Check the destination country, local carrier support, and plan terms before departure.'),
      JSON_OBJECT('title','Plan for shorter runtime','body','More frequent location updates and roaming conditions can reduce runtime. Charge before travel, carry the correct cable, and use the battery-saving mode when continuous live tracking is not needed.'),
      JSON_OBJECT('title','Before you buy','body','Confirm the tracker fits the collar, test the app at home, and save offline contact details and a physical ID plan. A tracker should supplement, not replace, travel paperwork and supervision.'),
      JSON_OBJECT('title','The ownership trade-off','body','The lower hardware price is offset by a recurring plan. Compare the annual subscription and update interval with a domestic-only tracker before deciding.')
    ),
    'alternatives',JSON_ARRAY(JSON_ARRAY('Fi Series 3','Better battery life when the dog stays within supported US coverage.'))
  )
  WHEN 'best-smart-feeder-simple-schedules' THEN JSON_OBJECT(
    'why','VOLUAS Automatic Cat Feeder keeps the job simple: scheduled dry-food meals at a lower entry price and without a heavy app ecosystem.',
    'notFor','Medical-grade portion control, wet food, or owners who need remote monitoring and detailed feeding history.',
    'sections',JSON_ARRAY(
      JSON_OBJECT('title','Why it suits simple routines','body','If the goal is a few dependable dry-food meals each day, fewer connected features can mean fewer setup and maintenance points. Program the schedule, test it while home, and keep the manual controls accessible.'),
      JSON_OBJECT('title','Know the limits','body','Basic feeders are not automatically precise. Weigh several portions with your kibble, watch for jams, and inspect the bowl and chute regularly.'),
      JSON_OBJECT('title','Before you buy','body','Check hopper capacity, battery backup, bowl access, cleaning, and whether the feeder can be secured against a determined pet. Keep a backup feeding plan for outages or travel.'),
      JSON_OBJECT('title','When to spend more','body','Choose a connected or higher-precision model when you need remote status, medication-linked portions, camera confirmation, or a stronger audit trail.')
    ),
    'alternatives',JSON_ARRAY(JSON_ARRAY('PETLIBRO Granary','Better fit when portion repeatability and flexible schedules matter.'),JSON_ARRAY('PetSafe Healthy Pet Simply Feed','Larger hopper and straightforward programmable meals.'))
  )
  WHEN 'best-pet-camera-treat-interaction' THEN JSON_OBJECT(
    'why','Petcube Bites 2 offers reliable treat interaction at a lower cost for owners who want a simple way to engage a pet from elsewhere in the home.',
    'notFor','Whole-room 360-degree monitoring, pets that guard or over-focus on treats, or owners avoiding cloud plans altogether.',
    'sections',JSON_ARRAY(
      JSON_OBJECT('title','Why it suits treat interaction','body','A predictable treat toss can add enrichment during a short absence, especially when paired with a calm routine. Start with small treats and verify the landing area is safe.'),
      JSON_OBJECT('title','Treats are not a behavior plan','body','Use the camera to observe whether interaction helps or increases arousal. Do not repeatedly trigger the dispenser for barking, panic, or other behavior you are trying to reduce.'),
      JSON_OBJECT('title','Before you buy','body','Confirm treat size, chute access, Wi-Fi strength, night visibility, and how the camera will be secured. Test the throw distance before leaving the pet alone with it.'),
      JSON_OBJECT('title','The ownership trade-off','body','The fixed view leaves blind spots compared with a 360-degree camera. Decide whether the lower price and simpler interaction outweigh the narrower coverage for your room.')
    ),
    'alternatives',JSON_ARRAY(JSON_ARRAY('Furbo 360','Better fit when wide coverage and dog-specific alerts matter.'),JSON_ARRAY('eufy Security Indoor Cam E220','Consider for pan/tilt monitoring without making treat interaction the center of the purchase.'))
  )
  ELSE content_json
END
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
