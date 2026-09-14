/*
  Qualitative owner-review summaries for every product used by a published
  comparison. The themes below come from the Amazon review bodies visible on
  2026-09-07. They describe the reviews read, not the frequency of an
  experience across every rating on a listing.
*/
SET NAMES utf8mb4;

INSERT INTO product_user_review_summaries
  (product_id,source_name,source_url,checked_at,rating,review_count,visible_review_count,rating_distribution_json,summary,positives_json,concerns_json,themes_json,sample_note)
SELECT p.id,'Amazon.com',r.source_url,'2026-09-07',r.rating,r.review_count,r.visible_count,NULL,
       r.summary,r.positives,r.concerns,r.themes,r.sample_note
FROM products p
JOIN (
  SELECT 'petkit-pura-x' slug,'https://www.amazon.com/product-reviews/B0GTM9P94B/?reviewerType=all_reviews' source_url,
    4.2 rating,411 review_count,7 visible_count,
    'Owners describe quiet automatic cleaning, an approachable open top, and useful camera or visit alerts. The recurring friction is concentrated in litter tracking, sensor interruptions, unreliable multi-cat classification, connectivity, and paid analysis features.' summary,
    JSON_ARRAY('Quiet cleaning and the open-top layout helped several cats adapt quickly.','Owners value odor control, the waste drawer, and app-visible visit or camera information.') positives,
    JSON_ARRAY('Open access can allow substantial litter tracking.','Nearby motion can pause cycles, while weight and AI classifications may need manual correction.','Connectivity, subscription requirements, and cancellation or support experiences caused frustration.') concerns,
    JSON_ARRAY(
      JSON_OBJECT('label','Quiet cleaning and an open layout','mentions',0,'kind','positive','detail','Owners describe a quiet cleaning cycle, quick setup, and cats adapting to the open-top entrance with little hesitation.'),
      JSON_OBJECT('label','Odor control and remote visibility','mentions',0,'kind','positive','detail','Owners value the sealed waste path, easier daily upkeep, visit notifications, and the ability to check the camera while away.'),
      JSON_OBJECT('label','Litter can travel beyond the entrance','mentions',0,'kind','concern','detail','Owners with vigorous diggers report litter scattering from the uncovered opening and recommend a large anchored mat.'),
      JSON_OBJECT('label','Detection and classification need supervision','mentions',0,'kind','concern','detail','Nearby movement can interrupt cleaning, and similar-looking cats, weight readings, or urine-versus-stool labels sometimes require correction.'),
      JSON_OBJECT('label','Connected features add friction','mentions',0,'kind','concern','detail','Reviews mention firmware or service outages, feature paywalls, and difficulty resolving subscription or support issues.')
    ) themes,
    'Based on 7 relevant featured reviews visible on the Amazon.com product page on 2026-09-07. One review for an unrelated feeding mat was excluded. Amazon selects the displayed reviews, so these observations do not represent every experience across all 411 ratings.' sample_note

  UNION ALL SELECT 'litter-robot-4','https://www.amazon.com/product-reviews/B0FFF2Y8R9/?reviewerType=all_reviews',
    4.3,376,8,
    'Owners often call the automated scooping, odor containment, and app history transformative, especially in multi-cat homes. The tradeoffs are the high total price, litter tracking, a large footprint, and recurring cleaning or sensor maintenance that depends heavily on litter choice and floor placement.',
    JSON_ARRAY('Automatic sifting removes daily scooping and keeps a consistently clean bed.','Owners value odor control, waste-level information, weight history, and easy drawer changes.'),
    JSON_ARRAY('The purchase price and accessories are expensive.','Dust, cat hair, carpet, and unsuitable litter can upset sensors or weight readings.','Litter tracking, globe cleanup, and the product footprint remain meaningful chores.'),
    JSON_ARRAY(
      JSON_OBJECT('label','Automatic scooping changes the daily routine','mentions',0,'kind','positive','detail','Owners with multiple cats describe replacing frequent hand scooping with periodic waste-bag changes and a consistently clean litter surface.'),
      JSON_OBJECT('label','Odor and activity information add reassurance','mentions',0,'kind','positive','detail','Reviews praise odor containment along with app-visible visits, cat weights, litter level, and waste-drawer status.'),
      JSON_OBJECT('label','Litter and placement affect reliability','mentions',0,'kind','concern','detail','Dusty litter, dirty sensors, or carpet placement can cause inaccurate levels, weights, interruptions, and more frequent maintenance.'),
      JSON_OBJECT('label','It is expensive and physically large','mentions',0,'kind','concern','detail','Owners repeatedly frame the purchase as a luxury, and some say the globe and accessories occupy more space or cost more than expected.'),
      JSON_OBJECT('label','Tracking and deep cleaning do not disappear','mentions',0,'kind','concern','detail','Litter can scatter outside the entrance, while sticky clumps and interior surfaces still need regular wiping or deeper cleaning.')
    ),
    'Based on 8 featured reviews visible on the Amazon.com Litter-Robot 4 supply-bundle page on 2026-09-07. The compared listing may show a different color or bundle configuration; the review themes concern the same Litter-Robot 4 device and are not a random sample of all 376 ratings.'

  UNION ALL SELECT 'petkit-pura-max','https://www.amazon.com/product-reviews/B0GD69KW7J/?reviewerType=all_reviews',
    2.9,3,2,
    'The small visible sample is sharply mixed: one long-term owner praises quiet cleaning and odor control, while another reports that concealed areas are difficult to clean and can collect urine and odor.',
    JSON_ARRAY('A long-term owner describes quiet, efficient operation and good odor control.','The self-cleaning function reduced manual scooping for the owners who found the design workable.'),
    JSON_ARRAY('The interior may feel snug for a larger cat.','Accessing hidden compartments for deep cleaning can require extensive disassembly.','Owners question long-term durability of the silicone liner and urine containment.'),
    JSON_ARRAY(
      JSON_OBJECT('label','Quiet operation and odor control','mentions',0,'kind','positive','detail','One owner reports two years of quiet, efficient use with little odor when using clumping clay litter.'),
      JSON_OBJECT('label','Large cats may have limited room','mentions',0,'kind','concern','detail','The visible positive review still notes that the interior feels snug for a heavier senior cat.'),
      JSON_OBJECT('label','Hidden areas are difficult to deep-clean','mentions',0,'kind','concern','detail','Another owner describes removing many screws to reach compartments and reports urine and odor accumulating inside the base.'),
      JSON_OBJECT('label','Liner durability is an open question','mentions',0,'kind','concern','detail','A long-term owner remains concerned about how the silicone base will hold up to aggressive scratching and covering.')
    ),
    'Based on the 2 review bodies visible on the Amazon.com page on 2026-09-07. The listing showed only 3 global ratings, so this very small, non-random sample should be treated as issues to investigate rather than a stable ownership consensus.'

  UNION ALL SELECT 'litter-robot-3-connect','https://www.amazon.com/product-reviews/B0D4GHS7V6/?reviewerType=all_reviews',
    3.7,571,8,
    'Owners praise odor control, straightforward app setup, useful visit and weight records, and relief from daily scooping. Problems focus on litter scatter, cleaning many crevices, a relatively small interior, sensor sensitivity, and serious rotation or alignment failures reported by some owners.',
    JSON_ARRAY('The cleaning cycle and waste drawer reduce daily scooping.','App setup, visit history, weight data, and odor control are useful when the unit works as intended.'),
    JSON_ARRAY('Litter can scatter from the entrance and collect in crevices.','The interior and sensor behavior may not suit every cat.','Some owners report rotation overshoot, banging, stuck clumps, or replacement units developing the same fault.'),
    JSON_ARRAY(
      JSON_OBJECT('label','Less scooping with useful app records','mentions',0,'kind','positive','detail','Owners like automatic cleanup, simple remote controls, household sharing, visit duration, and weight history.'),
      JSON_OBJECT('label','Odor control works well for some homes','mentions',0,'kind','positive','detail','Several owners say the drawer and deodorizer control smell well enough for an office or multi-cat room.'),
      JSON_OBJECT('label','Litter scatter and crevices add cleanup','mentions',0,'kind','concern','detail','The front opening can throw litter outward, and owners describe disassembling multiple parts to remove debris and stuck clumps.'),
      JSON_OBJECT('label','Interior space and sensing vary by cat','mentions',0,'kind','concern','detail','Some owners find the interior tight for a larger cat and want more sensitive presence detection than a primarily weight-triggered response.'),
      JSON_OBJECT('label','Rotation failures can make the box unusable','mentions',0,'kind','concern','detail','Critical reviews report overshooting, loud clacking, a displaced grate, and replacement units repeating the malfunction.')
    ),
    'Based on 8 featured reviews visible on the Amazon.com product page on 2026-09-07. Amazon selects the displayed reviews, so the summary identifies reported advantages and failure modes without estimating how common they are across all 571 ratings.'

  UNION ALL SELECT 'petsafe-scoopfree-ultra','https://www.amazon.com/product-reviews/B07WZPJ2LW/?reviewerType=all_reviews',
    4.1,10736,8,
    'Owners value a consistently raked surface, strong urine-odor control, and easier disposal than a conventional box. The proprietary crystal-tray workflow raises running cost, while rake jams, scattered crystals, tray leakage, and incomplete waste collection still require hands-on checks.',
    JSON_ARRAY('Automatic raking reduces repeated daily scooping.','Crystal litter and the covered waste area can control urine odor effectively.','Disposable trays make a full change relatively simple for owners who accept the cost.'),
    JSON_ARRAY('Replacement trays and crystal litter are expensive.','The rake can jam or miss small pieces, and the trap door may need resetting.','Crystal tracking, tray leakage, and remaining odor mean the box is not fully hands-off.'),
    JSON_ARRAY(
      JSON_OBJECT('label','A clean surface without daily scooping','mentions',0,'kind','positive','detail','Owners value the automatic rake for keeping a picky cat''s surface clean and reducing the need to sift litter several times a day.'),
      JSON_OBJECT('label','Crystal litter can suppress urine odor','mentions',0,'kind','positive','detail','Several long-term reviews report little urine smell when the crystals are stirred and the tray is replaced on schedule.'),
      JSON_OBJECT('label','Proprietary consumables increase cost','mentions',0,'kind','concern','detail','Owners regularly mention the price of disposable trays and crystal refills, with some switching to reusable trays or third-party crystals.'),
      JSON_OBJECT('label','Rake and trap-door jams need intervention','mentions',0,'kind','concern','detail','Large clumps, piled litter, or a loose trap door can stop the rake, leave waste on the wrong side, or require a manual reset.'),
      JSON_OBJECT('label','Tracking and leakage remain possible','mentions',0,'kind','concern','detail','Crystal pieces can spread beyond the box, and delayed tray changes may allow odor or urine to reach the cardboard and floor.')
    ),
    'Based on 8 featured reviews visible on the Amazon.com product page on 2026-09-07. Review age and household setup vary substantially, and the observations do not establish their prevalence across all 10,736 ratings.'

  UNION ALL SELECT 'fi-series-3','https://www.amazon.com/product-reviews/B0D6Z4L6BW/?reviewerType=all_reviews',
    3.9,5236,8,
    'Owners value live location, virtual-fence alerts, walk and health history, and the reassurance of finding an escaped dog. Complaints concentrate on subscription cost, power-saving zones delaying live mode, inconsistent network updates, faster battery drain outside Wi-Fi, and weak attachment straps.',
    JSON_ARRAY('Live tracking and boundary alerts have helped owners retrieve roaming dogs.','The app combines location, activity, walks, and health-oriented information.','Battery life can extend beyond a week when a useful power-saving zone is available.'),
    JSON_ARRAY('A paid subscription is required after buying the device.','Wi-Fi power saving can delay or block urgent live tracking.','Some owners report connection failures, short real-world battery life, quiet sound, or torn collar straps.'),
    JSON_ARRAY(
      JSON_OBJECT('label','Location and escape alerts provide peace of mind','mentions',0,'kind','positive','detail','Owners describe virtual-fence notifications and live maps helping them locate dogs across neighborhoods, woods, and acreage.'),
      JSON_OBJECT('label','Activity and health context enrich the app','mentions',0,'kind','positive','detail','Walk maps, activity, sleep, barking, and health-oriented trends are appreciated beyond the core location function.'),
      JSON_OBJECT('label','Power saving can conflict with urgent tracking','mentions',0,'kind','concern','detail','When the tracker detects home Wi-Fi, live mode may take time to become available even if the dog has moved beyond the expected area.'),
      JSON_OBJECT('label','Battery and connectivity depend on conditions','mentions',0,'kind','concern','detail','Reviews range from roughly two weeks to daily charging, and some report failed live-mode starts or slow network updates.'),
      JSON_OBJECT('label','Subscription and attachment durability matter','mentions',0,'kind','concern','detail','Owners call out the required prepaid service and report elastic mounts or attachment points tearing during active use.')
    ),
    'Based on 8 featured reviews visible on the Amazon.com product page on 2026-09-07. Terrain, cellular coverage, Wi-Fi layout, tracking mode, and dog activity differ by household, so these reports should not be read as controlled performance results across all 5,236 ratings.'

  UNION ALL SELECT 'tractive-gps-dog-4','https://www.amazon.com/product-reviews/B0G52NY6HZ/?reviewerType=all_reviews',
    4.2,109,7,
    'Owners highlight prompt out-of-zone alerts, useful location accuracy, and much longer claimed or observed battery life than smaller trackers. The larger body, false zone alerts, 2.4 GHz power-saving setup, upfront subscription terms, and breakable mounting hardware are the main reported drawbacks.',
    JSON_ARRAY('Owners report successfully locating dogs after boundary escapes.','The XL battery can run for several weeks in favorable use.','The app supports prohibited zones and timely alerts on large properties.'),
    JSON_ARRAY('The larger tracker may not suit smaller dogs.','Power-saving Wi-Fi setup and zone alerts can be unreliable.','Mounting bands or attachment points may break during rough play, and subscriptions require a significant upfront payment.'),
    JSON_ARRAY(
      JSON_OBJECT('label','Boundary alerts help retrieve roaming dogs','mentions',0,'kind','positive','detail','Owners on acreage describe receiving prompt out-of-zone notifications and navigating close enough to recover their dogs.'),
      JSON_OBJECT('label','The XL battery is the central advantage','mentions',0,'kind','positive','detail','Visible reviews describe multi-week endurance, with some projecting roughly six weeks or longer between charges.'),
      JSON_OBJECT('label','The larger body limits fit','mentions',0,'kind','concern','detail','The XL size is useful for endurance but adds bulk that owners should match to the dog and collar.'),
      JSON_OBJECT('label','Power-saving setup can create false alerts','mentions',0,'kind','concern','detail','One owner needed an extra base station for 2.4 GHz compatibility and still received zone alerts while the dogs were at home.'),
      JSON_OBJECT('label','The mounting system can fail','mentions',0,'kind','concern','detail','A multi-unit owner reports broken bands and attachment points during dog play even though location tracking itself worked well.')
    ),
    'Based on 7 featured reviews visible on the Amazon.com product page on 2026-09-07. The sample is small and includes different properties, networks, and dog activity levels; it is not representative of every experience across all 109 ratings.'

  UNION ALL SELECT 'whistle-go-explore','https://www.amazon.com/product-reviews/B0H6GGW9RH/?reviewerType=all_reviews',
    4.0,13,8,
    'Early owners like the Life360 integration, straightforward setup, accurate live maps, arrival and escape notifications, light and sound tools, and included first-year service for eligible accounts. The small review pool repeatedly questions the bulky fit and a subscription flow that requires payment details and can present confusing renewal messaging.',
    JSON_ARRAY('Location, arrival, departure, and escape alerts integrate with familiar Life360 family maps.','Setup is quick, tracking is described as accurate, and the light or sound can help locate a dog nearby.','The included service period improves first-year value for eligible new or free members.'),
    JSON_ARRAY('The tracker can feel bulky or heavy on a small dog.','Almost every function requires an activated subscription and payment details.','Conflicting trial and renewal messages caused billing uncertainty for one owner.'),
    JSON_ARRAY(
      JSON_OBJECT('label','Life360 integration is easy to understand','mentions',0,'kind','positive','detail','Owners already using Life360 like seeing a dog alongside family members and receiving familiar arrival, departure, and driving notifications.'),
      JSON_OBJECT('label','Live location and recovery tools add reassurance','mentions',0,'kind','positive','detail','Reviews praise accurate maps, escape alerts, the lost-pet network, and remote light or sound controls for finding a dog.'),
      JSON_OBJECT('label','The device can be bulky for small dogs','mentions',0,'kind','concern','detail','Several early reviews describe the tracker as noticeably large or heavy, even when the dog tolerated wearing it.'),
      JSON_OBJECT('label','Activation requires a subscription and card','mentions',0,'kind','concern','detail','Owners report that even basic ring functionality remains unavailable until service is activated and payment details are entered.'),
      JSON_OBJECT('label','Renewal communication can be confusing','mentions',0,'kind','concern','detail','One owner received an email showing a shorter trial than the included-year message shown during app activation.')
    ),
    'Based on 8 featured reviews visible on the Amazon.com product page on 2026-09-07. This is a newly reviewed product with only 13 global ratings, so the summary records early owner feedback and should not be treated as a mature consensus.'

  UNION ALL SELECT 'petkit-fresh-element-infinity','https://www.amazon.com/product-reviews/B0CFFKWYH6/?reviewerType=all_reviews',
    4.5,512,8,
    'Owners like dependable scheduled meals, the clear day and night camera, remote check-ins, notifications, a removable bowl, and useful free app functions. Initial Wi-Fi or camera pairing can be awkward, portion output varies with kibble, pets may eventually tip the unit, and saved playback or advanced features may require a subscription.',
    JSON_ARRAY('Schedules, notifications, and remote dispensing help owners cover early meals and time away.','The camera, night vision, two-way audio, and eating snapshots make remote check-ins practical.','The bowl is removable and routine cleaning is straightforward.'),
    JSON_ARRAY('Initial Wi-Fi or camera pairing may require reconnecting the feeder.','Portion size changes with kibble shape and should be measured.','Playback, cloud storage, and some insights are paid; determined pets may tip the feeder or loosen its lid.'),
    JSON_ARRAY(
      JSON_OBJECT('label','Scheduled feeding works well while owners are away','mentions',0,'kind','positive','detail','Owners describe month-long travel, early breakfasts, and busy days being easier because meals continued on schedule with app updates.'),
      JSON_OBJECT('label','Camera and meal records are genuinely useful','mentions',0,'kind','positive','detail','Day and night video, eating alerts, snapshots, and two-way audio let owners confirm that a pet visited and ate.'),
      JSON_OBJECT('label','Pairing may take more than one attempt','mentions',0,'kind','concern','detail','Some owners had difficulty connecting Wi-Fi or activating the camera until they removed and paired the feeder again.'),
      JSON_OBJECT('label','Kibble changes the portion delivered','mentions',0,'kind','concern','detail','Reviewers recommend measuring test portions because larger or smaller kibble pieces change how much each setting dispenses.'),
      JSON_OBJECT('label','Paid playback and pet-proofing are tradeoffs','mentions',0,'kind','concern','detail','Cloud playback and advanced features may require a plan, while persistent cats can eventually tip the body or dislodge an incompletely locked lid.')
    ),
    'Based on 8 relevant featured reviews visible on the Amazon.com product page on 2026-09-07. Amazon chooses the displayed reviews, and food size, network conditions, subscription tier, and pet behavior vary across households.'

  UNION ALL SELECT 'arf-pets-feeder','https://www.amazon.com/product-reviews/B09LD2CD1L/?reviewerType=all_reviews',
    4.4,12437,8,
    'Owners repeatedly describe a simple, dependable schedule feeder with useful battery backup, secure food storage, a removable stainless bowl, and good value. The interface takes some trial and error, portion units need measuring, the first dispensing turns may be incomplete, and the recorded voice is often quiet or muffled.',
    JSON_ARRAY('Timed meals reduce early wake-ups and keep routines consistent during trips.','The compact hopper, lid lock, washable steel bowl, and dual power are practical.','Owners describe reliable dispensing and years of service at a reasonable price.'),
    JSON_ARRAY('Programming is not immediately obvious until the lock-button behavior is understood.','Portion units are abstract and need testing with the selected kibble.','The voice message is quiet or muffled because of the speaker position.'),
    JSON_ARRAY(
      JSON_OBJECT('label','A simple schedule owners can rely on','mentions',0,'kind','positive','detail','Owners use the feeder to stop early-morning wake-ups, maintain several daily meals, and cover travel without depending on Wi-Fi.'),
      JSON_OBJECT('label','Practical hardware at a reasonable price','mentions',0,'kind','positive','detail','The locking lid, generous hopper, removable steel bowl, compact shape, and battery backup are recurring advantages.'),
      JSON_OBJECT('label','Programming takes initial trial and error','mentions',0,'kind','concern','detail','The controls become manageable after setup, but owners say the manual could explain holding the lock button and saving entries more clearly.'),
      JSON_OBJECT('label','Portions must be measured for each food','mentions',0,'kind','concern','detail','The numbered portion setting is not self-explanatory, and the first turns after filling may deliver less while the mechanism primes.'),
      JSON_OBJECT('label','The voice recording is hard to hear','mentions',0,'kind','concern','detail','Owners describe the bottom-mounted speaker as soft or muffled, though pets quickly learn the dispenser motor and food-drop sound.')
    ),
    'Based on 8 featured reviews visible on the Amazon.com product page on 2026-09-07. The listing includes many years of ratings and Amazon controls which reviews are featured, so this qualitative snapshot does not measure prevalence across all 12,437 ratings.'

  UNION ALL SELECT 'furbo-360','https://www.amazon.com/product-reviews/B09GDQZLD1/?reviewerType=all_reviews',
    4.3,8962,8,
    'Owners praise clear rotating video, night vision, two-way audio, treat tossing, and alerts that make remote pet checks and puppy training easier. Recurring limitations are paid AI features, occasional wireless lag or disconnections, treat-size jams, short cloud retention, and the risk of food-triggered conflict in multi-dog homes.',
    JSON_ARRAY('Clear live video, night vision, and two-way audio make remote check-ins reassuring.','Treat tossing and behavior alerts support training and interaction while away.','Owners value detailed notifications, including barking and household-alarm events.'),
    JSON_ARRAY('Many detailed AI and nanny features require a subscription.','Wireless lag or disconnections can make the camera unavailable when it is needed.','Treat shape affects dispensing, saved clips are retained for a limited time, and tossed food may trigger competition between dogs.'),
    JSON_ARRAY(
      JSON_OBJECT('label','Clear video and remote interaction','mentions',0,'kind','positive','detail','Owners like the rotating live view, usable night vision, clear two-way audio, and the ability to speak to and reward a pet from work or travel.'),
      JSON_OBJECT('label','Alerts support reassurance and training','mentions',0,'kind','positive','detail','Barking, movement, behavior, and alarm notifications help owners monitor puppies, senior dogs, and unexpected household events.'),
      JSON_OBJECT('label','The richest alerts cost extra','mentions',0,'kind','concern','detail','AI Nanny details, summaries, and automated behavior features sit behind a recurring plan even though core live features remain available.'),
      JSON_OBJECT('label','Connectivity can interrupt monitoring','mentions',0,'kind','concern','detail','Owners report lag, brief disconnections, and in some cases a camera becoming unreachable for hours despite another unit on the same network working.'),
      JSON_OBJECT('label','Treat use needs the right household and size','mentions',0,'kind','concern','detail','Incorrect treat shapes can jam or require a second toss, and owners warn that food competition can provoke conflict between dogs.')
    ),
    'Based on 8 featured reviews visible on the Amazon.com product page on 2026-09-07. Subscription tier, Wi-Fi quality, treat shape, and pet behavior differ, so the summary records owner-reported advantages and problems rather than product-test results across all 8,962 ratings.'

  UNION ALL SELECT 'petcube-bites-2','https://www.amazon.com/dp/B08XXKJGKH',
    4.0,1585,8,
    'Owners like the day and night video, simple app, two-way communication, and remote treat rewards. The main problems are unreliable remote connectivity or sharing, inconsistent treat quantity and distance, pets tipping or opening the unit, and a fixed camera angle that demands careful placement.',
    JSON_ARRAY('Video, night vision, audio, and remote treats make it useful for checking and rewarding pets while away.','The app and initial setup are straightforward for many owners.','Long-term owners report that the camera and activity alerts can remain useful for years.'),
    JSON_ARRAY('Remote access, sharing, or reconnection can fail after power changes or on slower mobile networks.','Treat size changes the number and distance launched.','The tall rectangular body and unsecured lid can be knocked over or opened, while the fixed camera cannot pan or zoom.'),
    JSON_ARRAY(
      JSON_OBJECT('label','Remote video and rewards work well together','mentions',0,'kind','positive','detail','Owners value checking clear day or night video, talking to a pet, and delivering a reward from work or while traveling.'),
      JSON_OBJECT('label','Setup and everyday app use are approachable','mentions',0,'kind','positive','detail','Several reviewers describe quick setup, a clear app, activity alerts, and reliable use once the device stays connected.'),
      JSON_OBJECT('label','Remote connectivity and sharing can fail','mentions',0,'kind','concern','detail','Reviews describe QR pairing friction, guest-sharing steps, resets after unplugging, and mobile connections that cannot always retrieve video.'),
      JSON_OBJECT('label','Treat output varies with size and shape','mentions',0,'kind','concern','detail','Small treats may launch several at once, large treats can stick, and even the shortest distance may throw farther than expected.'),
      JSON_OBJECT('label','The body, lid, and fixed view need planning','mentions',0,'kind','concern','detail','Food-motivated pets may tip the unit or open its hopper, while the non-moving camera requires careful positioning to cover the desired area.')
    ),
    'Based on 8 visible reviews from the Amazon.com Bites 2 Lite product-family listing on 2026-09-07. The linked Cam Bundle page showed one rating but no readable review body, so a matching Bites 2 Lite device listing was used and is linked here; bundle contents may differ.'

  UNION ALL SELECT 'eufy-pet-camera-e220','https://www.amazon.com/product-reviews/B0856W45VL/?reviewerType=all_reviews',
    4.4,21467,8,
    'Owners see strong value in the sharp 2K image, wide pan and tilt coverage, night vision, fast setup, responsive app, and optional local microSD recording without a required plan. Reported issues include inconsistent person or pet detection, false notifications, uneven auto-tracking, firmware regressions, storage-description confusion, and slower support during faults.',
    JSON_ARRAY('Image quality, night vision, pan and tilt coverage, and remote viewing are strong for the price.','Local microSD recording can avoid a mandatory cloud subscription.','Setup and routine app navigation are easy for many owners.'),
    JSON_ARRAY('AI detection can miss people or pets and also create false alerts.','Auto-tracking may lag, lose the subject, or fail to return to a preferred view.','Firmware changes have temporarily broken motion recording or connectivity for some owners.'),
    JSON_ARRAY(
      JSON_OBJECT('label','Sharp video and broad room coverage','mentions',0,'kind','positive','detail','Owners praise the 2K picture, night vision, remote pan and tilt, and ability to watch most of a room or camper from one camera.'),
      JSON_OBJECT('label','Local recording avoids a required plan','mentions',0,'kind','positive','detail','A microSD card supports local event or continuous recording, which owners value when they do not want cloud fees.'),
      JSON_OBJECT('label','Detection is not consistently trustworthy','mentions',0,'kind','concern','detail','Reviews report false person detections, missed people on stairs, and pets that are ignored or labeled as humans.'),
      JSON_OBJECT('label','Tracking and view controls have limits','mentions',0,'kind','concern','detail','Auto-tracking can be jerky or miss the important moment, and owners want reliable preset or return-to-home viewing positions.'),
      JSON_OBJECT('label','Firmware and account details can cause friction','mentions',0,'kind','concern','detail','Owners describe updates breaking motion recording, offline cameras, storage-capacity discrepancies, or unexpected cloud-trial billing messages.')
    ),
    'Based on 8 featured reviews visible on the Amazon.com product page on 2026-09-07. Some reviews discuss firmware states that were later corrected, and detection performance depends on placement and settings; this is not a controlled measure across all 21,467 ratings.'

  UNION ALL SELECT 'wyze-cam-v3','https://www.amazon.com/product-reviews/B08R59YH7W/?reviewerType=all_reviews',
    4.4,81658,8,
    'Owners consistently value the low price, quick setup, clear 1080p video, color night vision, compact weather-resistant body, and microSD recording. The tradeoffs are heavy motion-alert noise without paid detection, Wi-Fi or cloud dependence for remote use, confusing subscription changes, awkward SD-card playback, window glare, and broader privacy or security concerns.',
    JSON_ARRAY('The camera offers clear day and night video for a low purchase price.','Setup is fast, the app is approachable, and the compact camera is easy to place.','MicroSD recording provides a local option and the outdoor-rated body has survived harsh conditions for some owners.'),
    JSON_ARRAY('Basic motion alerts can become noisy, while smarter classification is tied to paid plans.','Wi-Fi or service outages interrupt remote access.','SD-card review, window placement, subscription marketing, and account-security concerns frustrate some owners.'),
    JSON_ARRAY(
      JSON_OBJECT('label','Strong image quality for the price','mentions',0,'kind','positive','detail','Owners repeatedly compare the clear 1080p picture and color night vision favorably with cameras that cost much more.'),
      JSON_OBJECT('label','Easy setup and flexible local recording','mentions',0,'kind','positive','detail','The small wired camera connects quickly, works indoors or under outdoor exposure, and can record continuously to microSD.'),
      JSON_OBJECT('label','Useful alerts may require tuning or payment','mentions',0,'kind','concern','detail','Unclassified motion can produce alerts for shadows, plants, rain, lights, pets, and cars; smarter filters and longer cloud clips depend on service level.'),
      JSON_OBJECT('label','Remote monitoring depends on network services','mentions',0,'kind','concern','detail','Wi-Fi loss, cloud incidents, or server outages can prevent remote viewing even when local recording continues.'),
      JSON_OBJECT('label','Playback, marketing, and privacy create friction','mentions',0,'kind','concern','detail','Owners criticize cumbersome SD-card timelines, repeated subscription prompts, changing free features, and the company''s security history.')
    ),
    'Based on 8 featured reviews visible on the Amazon.com product page on 2026-09-07. Several reviews span different firmware and subscription eras, so they show recurring ownership considerations rather than the current frequency of issues across all 81,658 ratings.'

  UNION ALL SELECT 'petlibro-dockstream-2','https://www.amazon.com/product-reviews/B0FDKQGRCK/?reviewerType=all_reviews',
    4.2,17202,7,
    'Owners strongly praise the nearly silent flow, lift-off cordless tank, accessible parts, simple weekly cleaning, generous capacity, and cats adopting it quickly. The app is most useful for low-water and maintenance reminders, but intake estimates and multi-cat attribution can be inaccurate, low-water alerts are not prominent enough, and filters remain an ongoing consumable.',
    JSON_ARRAY('The separated powered base and removable tank make carrying and cleaning easier.','Owners describe very quiet operation, good capacity, and quick cat acceptance.','Low-water, drinking, cleaning, and filter reminders provide useful status information.'),
    JSON_ARRAY('Reported intake amounts and multi-cat identification are not consistently reliable.','A completely empty tank may stop without a strong audible or critical phone alert.','Filters require regular replacement, and the small removable propeller can be lost during washing.'),
    JSON_ARRAY(
      JSON_OBJECT('label','Easy cleaning is the standout advantage','mentions',0,'kind','positive','detail','Owners like lifting the tank away from its powered base and reaching the water-contact surfaces without scrubbing a submerged pump and narrow crevices.'),
      JSON_OBJECT('label','Quiet flow, useful capacity, and cat acceptance','mentions',0,'kind','positive','detail','Reviews describe operation as nearly silent, the three-liter tank as sufficient between cleanings, and even cautious cats beginning to drink quickly.'),
      JSON_OBJECT('label','The app is better for reminders than measurement','mentions',0,'kind','concern','detail','Owners value low-water and maintenance notifications but question ounce estimates, false drinking events, and the inability to distinguish two cats reliably.'),
      JSON_OBJECT('label','Empty-water warnings could be harder to miss','mentions',0,'kind','concern','detail','When water runs out the fountain stops, but owners want a loud local beep and a more urgent phone notification.'),
      JSON_OBJECT('label','Filters and small parts require attention','mentions',0,'kind','concern','detail','The filter is an ongoing replacement item, and owners warn that the removable propeller can accidentally be discarded during sink cleaning.')
    ),
    'Based on 7 relevant featured reviews visible on the Amazon.com product page on 2026-09-07. One replacement-filter review was excluded. Model variants may share a listing, and app accuracy was not independently tested across all 17,202 ratings.'

  UNION ALL SELECT 'feelneedy-filterless-water-fountain','https://www.amazon.com/product-reviews/B0F9FC7JYD/?reviewerType=all_reviews',
    4.0,1461,8,
    'Owners like eliminating filter purchases, placing the fountain without a permanent cord, cleaning the removable steel bowl quickly, and separating stale water from the drinking surface. The design is less suitable for water-playing or tipping pets, multiple simultaneous drinkers, and larger dogs; the smaller waste tank needs frequent emptying and refill timing lacks an on-demand sensor mode.',
    JSON_ARRAY('Filterless operation removes recurring filter cost and slimy filter handling.','Cordless placement, multi-week battery reports, and simple disassembly make everyday use convenient.','Wastewater separation refreshes the shallow steel drinking bowl instead of continually recirculating the same water.'),
    JSON_ARRAY('Curious pets can remove the waste grate, play in the water, or tip components.','The drinking surface and waste tank are small relative to the clean-water reservoir.','Refill intervals start at several hours and there is no automatic presence sensor for on-demand fresh water.'),
    JSON_ARRAY(
      JSON_OBJECT('label','No replacement filters is the defining benefit','mentions',0,'kind','positive','detail','Owners appreciate avoiding recurring charcoal-filter purchases and being able to rinse accessible parts instead of handling slimy media.'),
      JSON_OBJECT('label','Cordless placement and wastewater separation','mentions',0,'kind','positive','detail','The rechargeable design can sit away from an outlet, while timed dumping moves fur, crumbs, and saliva into a separate tank before refilling the bowl.'),
      JSON_OBJECT('label','Water-playing pets can defeat the design','mentions',0,'kind','concern','detail','Owners warn that curious cats may remove the wastewater grate, paw at the tank, or knock components out of place.'),
      JSON_OBJECT('label','Bowl and waste capacity limit some households','mentions',0,'kind','concern','detail','Only one pet comfortably drinks at a time, the bowl is too small for a large dog, and the waste tank fills before the larger clean-water reservoir empties.'),
      JSON_OBJECT('label','The refill schedule is not truly on demand','mentions',0,'kind','concern','detail','Owners want a presence sensor or shorter interval because the available three-, six-, or twelve-hour cycles can leave a picky pet waiting for a refresh.')
    ),
    'Based on 8 featured reviews visible on the Amazon.com product page on 2026-09-07. Pet size, number of pets, refresh interval, and water-playing behavior strongly shape the experience; the summary does not estimate prevalence across all 1,461 ratings.'
) r ON r.slug=p.slug
ON DUPLICATE KEY UPDATE
  source_name=VALUES(source_name),source_url=VALUES(source_url),checked_at=VALUES(checked_at),
  rating=VALUES(rating),review_count=VALUES(review_count),visible_review_count=VALUES(visible_review_count),
  rating_distribution_json=VALUES(rating_distribution_json),summary=VALUES(summary),
  positives_json=VALUES(positives_json),concerns_json=VALUES(concerns_json),themes_json=VALUES(themes_json),
  sample_note=VALUES(sample_note);

/* Keep product-level marketplace context aligned with the checked snapshots. */
UPDATE products p
JOIN product_user_review_summaries s ON s.product_id=p.id
SET p.amazon_rating=s.rating,p.amazon_review_count=s.review_count
WHERE p.slug IN (
  'petkit-pura-x','litter-robot-4','petkit-pura-max','litter-robot-3-connect','petsafe-scoopfree-ultra',
  'fi-series-3','tractive-gps-dog-4','whistle-go-explore','petkit-fresh-element-infinity','arf-pets-feeder',
  'furbo-360','petcube-bites-2','eufy-pet-camera-e220','wyze-cam-v3',
  'petlibro-dockstream-2','feelneedy-filterless-water-fountain'
);
