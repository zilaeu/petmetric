/* Enrich all remaining troubleshooting guides with safe, symptom-specific paths. */

UPDATE troubleshooting_guides SET description='Identify whether a Litter-Robot 4 pinch fault comes from loose litter, a liner, incorrect assembly, or a persistent safety-sensor fault—without bypassing the protection.',estimated_time='12–15 min',updated_label='Sep 2026',content_json=JSON_OBJECT(
'safety','Keep cats away and unplug the unit before removing the globe or inspecting the waste opening. Never tape, bridge, bend, or bypass a pinch or presence sensor.',
'intro','A pinch alert is a safety stop, not an inconvenience to defeat. Record the exact light and app status first, then look for material caught in the waste path and confirm that every removable part is seated correctly. If the alert returns with a clean, correctly assembled unit, stop and involve Whisker.',
'quickChecks',JSON_ARRAY('Record the light pattern and exact app message before resetting.','Keep pets away, unplug the unit, and check whether a liner or clump protrudes into the waste opening.','Do not force the globe or defeat the sensor to finish a cycle.'),
'detailedSteps',JSON_ARRAY(
 JSON_OBJECT('title','Preserve the fault information','instruction','Take a photo or screenshot of the light pattern and app message. Note whether the alert appeared at startup, during rotation, or as waste passed into the drawer.','why','Different motion and safety states can look similar after a reset.','result','You have the exact status and point in the cycle for support if the fault returns.'),
 JSON_OBJECT('title','Power down and remove access','instruction','Turn the unit off, unplug it, and keep cats out of the room. Wait for all movement to stop before opening the bonnet or removing the globe according to the manual.','why','The pinch area is adjacent to the waste path and moving assembly.','result','The unit is de-energized and stable before inspection.'),
 JSON_OBJECT('title','Clear only visible loose material','instruction','Remove loose litter, clumps, liner material, or another object from the waste opening and drawer area. Use the cleaning method specified by Whisker; do not soak or spray liquid into the base.','why','A protruding bag or compacted waste can obstruct the protected area.','result','The path is visibly clear, dry, and free of material that could be pinched.'),
 JSON_OBJECT('title','Reseat the drawer, globe, and bonnet','instruction','Fit the drawer liner below the rim, slide the drawer fully in, and reinstall the globe and bonnet in the documented orientation. Do not force a latch or component.','why','Misalignment can create resistance or prevent a safety-related part from reading normally.','result','All parts sit flush and move only as intended by the manual.'),
 JSON_OBJECT('title','Run one empty supervised cycle','instruction','Reconnect power with pets kept away, allow startup to finish, and run one manual cycle. Stand ready to turn the unit off if it strains, grinds, or repeats the alert.','why','One controlled test distinguishes a cleared obstruction from a persistent fault.','result','The globe completes a cycle and returns home with no safety alert.'),
 JSON_OBJECT('title','Stop after a repeated pinch alert','instruction','If the alert returns on a clear, dry, correctly assembled unit, unplug it and contact Whisker. Do not open the base or alter sensor hardware.','why','A recurring safety stop can require manufacturer diagnosis or replacement parts.','result','Support receives the serial number, fault evidence, and steps already completed.')
),
'causeTable',JSON_ARRAY(
 JSON_OBJECT('observation','Alert clears after removing a protruding liner','cause','Liner interfered with the waste path','next','Refit below the rim and watch the next several cycles.'),
 JSON_OBJECT('observation','Alert appears at the same point in each rotation','cause','Repeatable obstruction, alignment, or sensor fault','next','Stop testing and send a video and status to support.'),
 JSON_OBJECT('observation','Grinding or straining accompanies the alert','cause','Mechanical resistance rather than a simple loose clump','next','Turn off immediately; do not force the globe.'),
 JSON_OBJECT('observation','Alert returns on startup before rotation','cause','Persistent assembly or safety-circuit state','next','Confirm assembly once, then contact support.')
),
'support','Contact Whisker after one careful cleaning and reseating attempt if the pinch alert repeats. Stop sooner for damaged parts, liquid in the base, abnormal heat, odor, or sound.',
'supportChecklist',JSON_ARRAY('Serial number and warranty status','Photo of the light bar and app error','When in the cycle the alert occurs','Photo of drawer liner and waste opening','Whether one empty supervised cycle completed'),
'faq',JSON_ARRAY(
 JSON_OBJECT('question','Can I disable the pinch sensor?','answer','No. It is a safety protection. Do not bypass, bridge, tape, or modify it.'),
 JSON_OBJECT('question','Can a waste-bag liner cause the alert?','answer','A liner protruding into the waste path can interfere with operation. Fit it exactly as the current instructions show.'),
 JSON_OBJECT('question','Should I lubricate the mechanism?','answer','Do not apply lubricant unless Whisker explicitly instructs it for the exact part. Lubricant can attract litter or damage materials and sensors.')
),
'sourceNote','Use the live Whisker article for the exact light pattern and hardware revision. This guide never recommends bypassing a safety device.',
'sources',JSON_ARRAY(JSON_OBJECT('label','Whisker — Litter-Robot 4 support','url','https://www.litter-robot.com/support/litter-robot-4'),JSON_OBJECT('label','Whisker — support library','url','https://www.litter-robot.com/support'))
) WHERE slug='litter-robot-4-pinch-detect';

UPDATE troubleshooting_guides SET description='Respond to a stale or offline Tractive location while continuing an active physical search. Check timestamps, battery, live mode, GPS sky view, and cellular coverage in the right order.',estimated_time='10–20 min',updated_label='Sep 2026',content_json=JSON_OBJECT(
'safety','If the pet is missing, begin a physical search and local lost-pet response immediately. Do not wait for the app to refresh, enter unsafe property, or search near traffic without help.',
'intro','A stale map point means the service has not received a newer usable position; it does not mean the pet is still there. Read its timestamp, start the physical search from that location and likely route, then use Live Tracking and sound or light features only as conditions allow.',
'quickChecks',JSON_ARRAY('Read the timestamp and battery status before treating the displayed dot as current.','Start the physical search and notify another person while the app attempts a refresh.','Move your phone to reliable data service; the tracker also needs GPS view and supported cellular coverage.'),
'detailedSteps',JSON_ARRAY(
 JSON_OBJECT('title','Anchor the search to time, not only the dot','instruction','Record the last-known location, timestamp, direction of travel, and battery level. Screenshot the map before it changes.','why','An old point is a starting clue, not a live position.','result','Searchers share one time-stamped last-known point and likely route.'),
 JSON_OBJECT('title','Start Live Tracking once','instruction','Use the app’s current Live Tracking control and wait for its stated connection period while moving toward the last-known area. Avoid repeatedly toggling modes.','why','Live mode requests frequent fixes but may take time to acquire GPS and cellular service.','result','The app shows a newer timestamp or clearly reports that connection is unavailable.'),
 JSON_OBJECT('title','Check your phone separately','instruction','Confirm the phone has internet access, location permission, background data, and notifications for Tractive. Refresh or reopen the app once.','why','A working tracker can still appear stale on a phone with blocked data or permissions.','result','The phone can load current account and map data.'),
 JSON_OBJECT('title','Use sound or light only at close range','instruction','If the app offers sound or light and reports the tracker reachable, activate it while listening and searching nearby. Do not use sound where it may drive a frightened pet toward danger.','why','Close-range cues can help in vegetation or darkness but are not long-range location systems.','result','A searcher can identify the pet or tracker without relying only on map precision.'),
 JSON_OBJECT('title','Expand the offline search','instruction','If no new fix arrives, search likely shelter points and travel corridors, contact shelters and microchip registry, and share a clear lost-pet notice through appropriate local channels.','why','Battery, coverage, buildings, terrain, or a lost collar can stop updates.','result','Recovery work continues even while the device remains offline.'),
 JSON_OBJECT('title','Diagnose the tracker after recovery','instruction','Once safely recovered, charge it, inspect attachment and damage, update firmware, and test outdoors during the return or support window.','why','Emergency time should be spent recovering the pet, not factory-resetting the account.','result','A controlled outdoor test confirms whether service, battery, or hardware needs support.')
),
'causeTable',JSON_ARRAY(
 JSON_OBJECT('observation','Old timestamp but battery shown','cause','No recent GPS or data upload','next','Search from the last point and keep Live Tracking active as directed.'),
 JSON_OBJECT('observation','Updates resume outdoors','cause','Indoor or covered GPS limitation','next','Review usual wearing position and practice interpreting stale points.'),
 JSON_OBJECT('observation','Another phone updates normally','cause','Phone permission, app, or data issue','next','Correct settings on the affected phone.'),
 JSON_OBJECT('observation','Tracker remains offline after charge and outdoor test','cause','Activation, service, firmware, or hardware issue','next','Contact Tractive before relying on it again.')
),
'support','After recovery, contact Tractive if an activated, charged tracker cannot update during a clear outdoor test in a supported coverage area. During a loss, continue physical and community recovery steps regardless of support response time.',
'supportChecklist',JSON_ARRAY('Tracker ID and subscription status','Last successful timestamp and screenshot','Battery shown at the last update','Locations and times where updates failed','Phone model, app version, and permission state'),
'faq',JSON_ARRAY(
 JSON_OBJECT('question','Does the last dot show where my pet is now?','answer','Only if its timestamp is current. A stale dot shows the last position that successfully reached the service.'),
 JSON_OBJECT('question','Should I factory-reset during an active search?','answer','Usually no. A reset can consume time or remove useful state. Follow Tractive’s live-search instructions and prioritize physical recovery.'),
 JSON_OBJECT('question','Why does GPS fail indoors?','answer','Roofs and walls reduce satellite visibility, while buildings can reflect signals. Cellular coverage and battery also affect whether a fix reaches the app.')
),
'sourceNote','Features and app labels vary by tracker and region. This page supplements—not replaces—local lost-pet procedures.',
'sources',JSON_ARRAY(JSON_OBJECT('label','Tractive Help Center','url','https://help.tractive.com/'),JSON_OBJECT('label','AAHA — microchip lookup','url','https://www.aaha.org/for-veterinary-professionals/microchip-search/'))
) WHERE slug='tractive-gps-location-not-updating';

UPDATE troubleshooting_guides SET description='Separate normal high-power tracking from weak-signal drain, charging trouble, settings, or a degrading Tractive battery using a controlled baseline test.',estimated_time='24–48 hr test',updated_label='Sep 2026',content_json=JSON_OBJECT(
'safety','Stop using and charging the tracker if it is swollen, cracked, leaking, unusually hot, or has damaged charging contacts. Keep a suspect battery away from the pet and contact Tractive.',
'intro','Battery estimates assume a particular mix of safe-zone time, movement, signal, and Live Tracking. Diagnose drain by returning to a normal baseline and recording percentage over time. Do not compare a day of continuous live mode with an advertised multi-day typical-use estimate.',
'quickChecks',JSON_ARRAY('Inspect the case and contacts before charging.','Note Live Tracking use, safe-zone time, signal conditions, and starting percentage.','Confirm the tracker reaches a full charge with the correct charging method.'),
'detailedSteps',JSON_ARRAY(
 JSON_OBJECT('title','Rule out a damaged battery or charger','instruction','Inspect the tracker, cable, charger, and contacts. Clean only as Tractive directs and charge in a cool, dry place away from the pet.','why','Physical or thermal damage is a safety issue, not a settings problem.','result','Charging is stable with no swelling, odor, or unusual heat.'),
 JSON_OBJECT('title','Confirm a real full charge','instruction','Charge until the current app or indicator confirms completion, then record the disconnect time and percentage.','why','A brief connection or dirty contact can look charged without completing the cycle.','result','The app shows a stable full or near-full reading after disconnection.'),
 JSON_OBJECT('title','End unnecessary Live Tracking','instruction','Stop Live Tracking after the test or search and return to normal tracking. Review active sharing or live sessions on other household phones.','why','Frequent GPS fixes and cellular transmissions are a major power load.','result','The tracker returns to its lower-power normal state.'),
 JSON_OBJECT('title','Restore the power-saving home zone','instruction','Confirm the Wi-Fi or base power-saving zone is online, correctly placed, and recognized when the pet is home.','why','Without a recognized home state, the tracker may search and report more often.','result','The app consistently reports the tracker in the expected safe or power-saving zone.'),
 JSON_OBJECT('title','Run a 24-hour baseline','instruction','Update firmware, restart only as documented, then record percentage at the same times for one ordinary day without Live Tracking. Note time at home and outdoors.','why','A controlled interval makes usage and signal conditions comparable.','result','You have a percentage-per-day result tied to specific conditions.'),
 JSON_OBJECT('title','Compare weak and strong coverage','instruction','If safe, compare normal outdoor use in a known strong-service area with the problematic route. Do not remove the tracker from the pet during an escape-risk period.','why','Repeated network searching can increase drain.','result','Drain clearly follows coverage conditions or remains excessive everywhere.')
),
'causeTable',JSON_ARRAY(
 JSON_OBJECT('observation','Drain rises only during Live Tracking','cause','Expected high-power mode','next','Use it for active location needs and stop it afterward.'),
 JSON_OBJECT('observation','Home zone is not recognized','cause','Power-saving zone or Wi-Fi/base issue','next','Repair the zone using Tractive instructions.'),
 JSON_OBJECT('observation','Charge percentage jumps or charging disconnects','cause','Contact, cable, charger, or battery issue','next','Clean as directed and contact support if repeated.'),
 JSON_OBJECT('observation','Severe drain persists in normal mode and strong coverage','cause','Firmware, account, or battery degradation','next','Send the baseline log to support.')
),
'support','Contact Tractive with a controlled battery log if drain remains excessive in normal mode with current firmware and good coverage. Stop immediately for swelling, heat, odor, leakage, or casing damage.',
'supportChecklist',JSON_ARRAY('Tracker model, age, and ID','Firmware and app versions','Charge start and finish evidence','Timed battery-percentage log','Live-mode and safe-zone usage','Typical signal area and temperature'),
'faq',JSON_ARRAY(
 JSON_OBJECT('question','Does Live Tracking use more battery?','answer','Yes. More frequent GPS fixes and transmissions require more energy than normal periodic tracking.'),
 JSON_OBJECT('question','Can cold weather reduce runtime?','answer','Temperature can affect battery performance. Follow the rated operating and charging range and never heat a tracker artificially.'),
 JSON_OBJECT('question','Should I fully drain the battery to recalibrate it?','answer','Do not do this unless Tractive specifically instructs it for your model. Lithium batteries do not need routine deep discharge.')
),
'sourceNote','Battery life varies with model, network, GPS conditions, temperature, movement, and settings. A timed baseline is more useful than a single percentage observation.',
'sources',JSON_ARRAY(JSON_OBJECT('label','Tractive Help Center — battery and charging','url','https://help.tractive.com/'),JSON_OBJECT('label','Tractive — user manuals','url','https://tractive.com/manuals'))
) WHERE slug='tractive-battery-draining';

UPDATE troubleshooting_guides SET description='Restore missed PETLIBRO Granary meals by protecting the pet’s feeding plan first, then separating schedule, power, food-bridging, outlet, and motor problems.',estimated_time='12–20 min',updated_label='Sep 2026',content_json=JSON_OBJECT(
'safety','Confirm the pet has a reliable meal and fresh water before troubleshooting. Unplug the feeder before reaching into the hopper, rotor, or outlet. For medication-linked or prescribed meals, contact the veterinarian if a meal is missed.',
'intro','First determine whether the feeder attempted the meal. A saved schedule with no motor sound points in a different direction from a motor that runs while no food falls. Do not keep triggering portions into the bowl without counting the extra food.',
'quickChecks',JSON_ARRAY('Provide the meal manually and record how much was missed.','Check current time, schedule enabled state, power, and any low-food or jam message.','Listen once: no motor suggests schedule or power; motor sound with no food suggests the food path.'),
'detailedSteps',JSON_ARRAY(
 JSON_OBJECT('title','Protect today’s feeding plan','instruction','Measure and serve the missed meal manually if appropriate. Record what was actually eaten and avoid an automatic catch-up portion unless the feeding plan calls for it.','why','Restoring the device must not create a second missed meal or accidental double feed.','result','The pet has a documented, reliable meal while testing continues.'),
 JSON_OBJECT('title','Verify clock, schedule, and meal count','instruction','Check feeder time zone and clock, each meal’s enabled state, days, and portion count. Save the schedule and confirm it appears on the device or app as current.','why','A disabled day, wrong clock, or unsaved edit can mimic hardware failure.','result','The next test meal is scheduled a few minutes ahead with a known portion.'),
 JSON_OBJECT('title','Check primary and backup power','instruction','Confirm the adapter is fully seated and the outlet works. Inspect cable damage. Check batteries and polarity only as the manual allows.','why','Some backup systems preserve the schedule but restrict network or other behavior.','result','The display and controls remain stable and the feeder does not reboot.'),
 JSON_OBJECT('title','Inspect compatible food and bridging','instruction','Unplug the feeder, remove the lid, and inspect whether kibble has formed a hollow bridge above the rotor or contains pieces outside the supported size. Empty and clean the food path using the manual.','why','A motor can turn beneath a stable arch of food without new kibble dropping.','result','Dry, compatible kibble falls freely into the metering area.'),
 JSON_OBJECT('title','Clear the outlet and reseat removable parts','instruction','With power disconnected, remove crumbs or a lodged piece from accessible components. Reassemble the rotor, hopper, lid, and bowl exactly as documented.','why','Misassembly after cleaning or a blocked chute can stop delivery.','result','Every part sits flush and the outlet is visibly open.'),
 JSON_OBJECT('title','Run one measured manual and scheduled test','instruction','Reconnect power and dispense one manual portion into a tared bowl, then one near-term scheduled portion. Weigh both and account for all food.','why','This separates a schedule problem from an inconsistent mechanism.','result','Both tests deliver a plausible amount without abnormal sound.')
),
'causeTable',JSON_ARRAY(
 JSON_OBJECT('observation','Manual feed works; scheduled feed does not','cause','Clock, schedule, save, app sync, or mode issue','next','Re-create one schedule using the current manual; contact support if it still misses.'),
 JSON_OBJECT('observation','Motor sounds but no food falls','cause','Bridging, incompatible kibble, empty hopper, or blockage','next','Unplug and inspect the documented food path.'),
 JSON_OBJECT('observation','Feeder reboots near meal time','cause','Adapter, connector, outlet, or power issue','next','Stop using a damaged cable and contact support.'),
 JSON_OBJECT('observation','Portion is repeatedly low or high','cause','Kibble compatibility, assembly, or metering issue','next','Run a 10-portion gram test and share results.')
),
'support','Contact PETLIBRO after one clean, compatible-food test if scheduled meals remain unreliable, the motor strains, parts are damaged, or delivery varies enough to affect the feeding plan.',
'supportChecklist',JSON_ARRAY('Exact Granary model and serial number','Food brand, shape, and measured size','Schedule screenshot and feeder clock','Video or description of sound during one test','Weights from repeated test portions','Power adapter and backup-battery state'),
'faq',JSON_ARRAY(
 JSON_OBJECT('question','Will the schedule work if Wi-Fi is down?','answer','Many feeders store schedules locally, but behavior differs by exact model and state. Verify the current manual and test safely rather than assuming.'),
 JSON_OBJECT('question','Can oily or irregular kibble cause jams?','answer','Yes. Surface oil, crumbs, size, and shape can affect bridging and metering. Use food within the model’s documented range.'),
 JSON_OBJECT('question','Should I dispense extra food after a missed meal?','answer','Not automatically. Determine what the pet ate and follow the feeding or veterinary plan to avoid a double portion.')
),
'sourceNote','PETLIBRO sells several Granary versions. Controls, schedule storage, food-size limits, and cleaning steps must be checked against the exact model.',
'sources',JSON_ARRAY(JSON_OBJECT('label','PETLIBRO — support center','url','https://petlibro.com/pages/support'),JSON_OBJECT('label','PETLIBRO — manuals','url','https://petlibro.com/pages/manuals'))
) WHERE slug='petlibro-granary-not-dispensing';

UPDATE troubleshooting_guides SET description='Reconnect a PETLIBRO feeder methodically without sacrificing the next meal: verify local feeding first, then phone permissions, 2.4 GHz network compatibility, router state, and pairing.',estimated_time='15–25 min',updated_label='Sep 2026',content_json=JSON_OBJECT(
'safety','Keep a manual backup feeding plan active until both local dispensing and the next saved meal are verified. Do not repeatedly reset a feeder if doing so may erase schedules you have not recorded.',
'intro','An offline app does not necessarily mean the feeder cannot deliver a locally stored schedule. First prove that the feeder has stable power and can dispense locally, then preserve the schedule before changing network settings or re-pairing.',
'quickChecks',JSON_ARRAY('Photograph every saved schedule before resetting or removing the device.','Test one local manual portion and account for the food.','Confirm the exact model’s Wi-Fi band and security requirements—many use 2.4 GHz.'),
'detailedSteps',JSON_ARRAY(
 JSON_OBJECT('title','Separate feeding from connectivity','instruction','Check the feeder display and run one supervised local manual feed. Record whether scheduled meals are still shown locally.','why','A network fault and a food-delivery fault have different urgency and paths.','result','You know whether feeding can continue while the app is offline.'),
 JSON_OBJECT('title','Preserve schedules and account details','instruction','Screenshot meal times, portions, time zone, device name, and sharing settings. Confirm you can sign in to the intended PETLIBRO account.','why','Removing or resetting the device can require schedule re-entry.','result','You can recreate the feeding plan if pairing changes local data.'),
 JSON_OBJECT('title','Check phone permissions and data','instruction','Allow the app the current local-network, Bluetooth, and location permissions required for setup, and temporarily disable VPN or restrictive filtering if PETLIBRO documents it as necessary.','why','Initial discovery can fail before the feeder ever reaches the router.','result','The app can search for nearby devices on the same local network.'),
 JSON_OBJECT('title','Confirm the compatible Wi-Fi network','instruction','Use the band and security mode specified for the exact feeder—commonly 2.4 GHz. Verify the phone is connected to that network and that the password is exact.','why','Band steering, unsupported security, guest isolation, and hidden networks can block onboarding.','result','A normal household device can reach the internet on the intended network.'),
 JSON_OBJECT('title','Restart only the network path once','instruction','Restart the feeder and router in the order recommended by their manuals. Wait for the router to be fully online before retrying the feeder.','why','A clean restart can renew an address without destroying saved configuration.','result','The feeder returns to its documented ready-to-pair or online state.'),
 JSON_OBJECT('title','Re-pair as the last reversible step','instruction','Follow the exact model’s pairing sequence. Remove or factory-reset the feeder only if current PETLIBRO instructions require it and your schedules are recorded.','why','Premature deletion can add a data problem to a temporary connection problem.','result','The device appears online, the schedule is restored, and one near-term test meal succeeds.')
),
'causeTable',JSON_ARRAY(
 JSON_OBJECT('observation','Local dispensing works; app is offline','cause','Phone, account, router, cloud, or feeder Wi-Fi path','next','Preserve schedule and work through network checks.'),
 JSON_OBJECT('observation','Pairs on hotspot but not home router','cause','Router band, security, isolation, or filtering issue','next','Review router compatibility without leaving the feeder on a temporary hotspot.'),
 JSON_OBJECT('observation','All household devices are offline','cause','Internet or router outage','next','Restore the network; maintain manual feeding.'),
 JSON_OBJECT('observation','Feeder loses power or reboots','cause','Power issue rather than Wi-Fi','next','Inspect adapter and contact support.')
),
'support','Contact PETLIBRO if the feeder cannot pair on a documented-compatible network after one clean setup, repeatedly drops offline near the router, or loses schedules. Keep feeding manually until reliability is confirmed.',
'supportChecklist',JSON_ARRAY('Exact model and serial number','App and phone OS versions','Router model, Wi-Fi band, and security mode','Indicator-light pattern','Pairing step where failure occurs','Whether local scheduled feeding still works'),
'faq',JSON_ARRAY(
 JSON_OBJECT('question','Does offline mean my pet will miss a meal?','answer','Not necessarily. Some models retain schedules locally, but you must verify the exact model and test it safely with a backup plan.'),
 JSON_OBJECT('question','Why is 2.4 GHz often required?','answer','It offers broad compatibility and range for small connected devices. A router can advertise both bands, but onboarding behavior varies.'),
 JSON_OBJECT('question','Should I delete the feeder from the app first?','answer','Only when the current model instructions require it and after recording schedules. Start with power, permissions, and network compatibility.')
),
'sourceNote','Pairing controls and network requirements differ across PETLIBRO Granary generations. Use the label and manual for the exact model.',
'sources',JSON_ARRAY(JSON_OBJECT('label','PETLIBRO — support center','url','https://petlibro.com/pages/support'),JSON_OBJECT('label','PETLIBRO — manuals','url','https://petlibro.com/pages/manuals'))
) WHERE slug='petlibro-feeder-offline';
