/* Complete rich troubleshooting coverage for cameras, litter boxes, and Fi. */

UPDATE troubleshooting_guides SET description='Restore a Furbo camera connection from power and LED state through phone, router, and pairing checks, while preserving account and video-privacy settings.',estimated_time='15–25 min',updated_label='Sep 2026',content_json=JSON_OBJECT(
'safety','Unplug the camera if its cable or adapter is damaged, the unit is unusually hot, or liquid entered it. Do not continue testing a damaged power supply.',
'intro','Treat the LED and app status as evidence. First confirm stable power, then decide whether the problem affects one phone, the home network, or the camera itself. Factory reset is the last step because it can require setup and privacy settings to be rebuilt.',
'quickChecks',JSON_ARRAY('Record the LED color or pattern and exact app message.','Confirm the outlet, approved adapter, and cable are securely connected and undamaged.','Check whether other devices can use the same home internet connection.'),
'detailedSteps',JSON_ARRAY(
 JSON_OBJECT('title','Read the LED before restarting','instruction','Note the visible LED color or sequence and compare it with Furbo’s current article for the exact model. Screenshot any app error.','why','The indicator can distinguish startup, Wi-Fi connection, cloud connection, and setup states.','result','You can name the state rather than reporting only “offline.”'),
 JSON_OBJECT('title','Verify stable power','instruction','Reseat the cable at both ends, test the outlet with a low-risk device, and use the supplied or manufacturer-approved power equipment.','why','Intermittent power can appear as repeated network drops.','result','The LED completes a stable startup sequence without rebooting.'),
 JSON_OBJECT('title','Check the affected phone','instruction','Confirm internet access, sign in to the intended Furbo account, update the app, and allow required local-network or Bluetooth permissions for setup.','why','If another authorized phone connects, the camera and router may already be working.','result','The phone can load the account and discover or contact the device.'),
 JSON_OBJECT('title','Check router compatibility and distance','instruction','Confirm the model’s supported Wi-Fi band and security, move the camera temporarily within reliable router range, and verify the phone uses the intended network.','why','Weak signal, guest isolation, or unsupported router settings can block setup.','result','The camera reaches its documented connected LED state near the router.'),
 JSON_OBJECT('title','Power-cycle the path once','instruction','Unplug Furbo for about one minute, restore the router if it is also malfunctioning, wait for internet service, then reconnect Furbo and allow startup to finish.','why','One ordered restart can renew the connection without erasing settings.','result','The app shows a current video or a more specific setup state.'),
 JSON_OBJECT('title','Reset and re-pair only if required','instruction','Use Furbo’s exact reset and setup instructions only after confirming account access, network password, and any settings that must be recreated.','why','Resetting cannot repair damaged power hardware and may add setup work.','result','Live video loads, notifications are restored, and household access is reviewed.')
),
'causeTable',JSON_ARRAY(
 JSON_OBJECT('observation','Another phone connects normally','cause','Affected phone, app, permission, or account state','next','Correct that phone without resetting Furbo.'),
 JSON_OBJECT('observation','Furbo works only near the router','cause','Weak signal or interference at its normal location','next','Improve network placement or coverage.'),
 JSON_OBJECT('observation','LED repeatedly restarts','cause','Power, cable, adapter, or device fault','next','Stop using damaged equipment and contact support.'),
 JSON_OBJECT('observation','Other devices also lack internet','cause','Router or service outage','next','Restore home internet first.')
),
'support','Contact Furbo if the camera cannot complete setup on a supported network near the router, repeatedly reboots, or remains offline after one documented re-pair. Stop immediately for heat, odor, cable damage, or liquid.',
'supportChecklist',JSON_ARRAY('Exact Furbo model and serial number','LED color or video of startup','App and phone OS versions','Router model, band, and security','Step at which setup fails','Whether another phone or network was tested'),
'faq',JSON_ARRAY(
 JSON_OBJECT('question','Should I factory-reset Furbo immediately?','answer','No. Record the LED, verify power, phone, account, and router first. Reset only when the exact support sequence calls for it.'),
 JSON_OBJECT('question','Can weak Wi-Fi cause intermittent video?','answer','Yes. Live video needs a stable upstream connection. Test near the router to separate range from camera failure.'),
 JSON_OBJECT('question','Why does the app work away from home but not on local Wi-Fi?','answer','That can indicate phone local-network settings, router filtering, or a network path issue. Preserve the device setup while checking the phone and router.')
),
'sourceNote','Furbo models use different LED meanings, bands, and reset controls. Match the support article to the exact model.',
'sources',JSON_ARRAY(JSON_OBJECT('label','Furbo — Help Center','url','https://help.furbo.com/'),JSON_OBJECT('label','Furbo — setup and connection help','url','https://help.furbo.com/hc/en-us/categories/360000226071'))
) WHERE slug='furbo-camera-offline';

UPDATE troubleshooting_guides SET description='Clear a Furbo treat-toss failure safely by separating an app command problem from treat size, bridging, residue, or mechanism damage.',estimated_time='12–20 min',updated_label='Sep 2026',content_json=JSON_OBJECT(
'safety','Unplug Furbo before removing treats or touching the treat opening. Keep fingers and tools out of the mechanism. Stop for grinding, broken parts, unusual heat, or a damaged cable.',
'intro','A toss can fail because the command never reached the camera, treats cannot feed into the mechanism, the outlet is blocked, or a drive part is damaged. Test the connection first, then inspect only user-accessible areas with power disconnected.',
'quickChecks',JSON_ARRAY('Confirm live video or another app control works before blaming the mechanism.','Use only dry treats within the exact model’s documented size and shape.','Unplug before clearing treats; never reach into a powered opening.'),
'detailedSteps',JSON_ARRAY(
 JSON_OBJECT('title','Confirm the command reaches Furbo','instruction','Check that Furbo is online and the app can load live video. Send one toss command with the hopper loaded, then note any motor sound or app error.','why','No response from any remote function points to connectivity, not a food jam.','result','You know whether the camera received the command and attempted movement.'),
 JSON_OBJECT('title','Disconnect power and remove the treats','instruction','Unplug Furbo, remove the top as documented, and pour treats into a clean container. Do not insert fingers or tools into hidden moving parts.','why','The tossing mechanism can move unexpectedly when powered.','result','The unit is de-energized and the hopper is empty for inspection.'),
 JSON_OBJECT('title','Discard incompatible or damaged treats','instruction','Remove oversized, sticky, soft, oily, broken, or crumb-heavy treats. Compare size and shape with Furbo’s current requirements.','why','Irregular pieces bridge in the hopper or jam the outlet more easily.','result','Only dry, supported treats remain for testing.'),
 JSON_OBJECT('title','Clean accessible food-contact areas','instruction','Remove crumbs from the hopper and accessible outlet using the documented dry-cleaning method. Do not add water or lubricant to the mechanism.','why','Residue narrows the path and attracts more fragments.','result','Accessible surfaces are clean, dry, and free of visible blockage.'),
 JSON_OBJECT('title','Reload lightly and test once','instruction','Reassemble, add a small quantity of compatible treats, restore power, keep pets clear, and send one supervised toss into an open area.','why','A light load tests feeding without immediately recreating pressure or waste.','result','One treat toss completes with a normal sound and path.'),
 JSON_OBJECT('title','Stop if the mechanism still strains','instruction','If the motor grinds, repeats without release, or is silent while other app functions work, unplug and contact Furbo.','why','Internal disassembly can cause injury, contamination, or warranty loss.','result','Support receives a short video, treat dimensions, and the cleaning steps tried.')
),
'causeTable',JSON_ARRAY(
 JSON_OBJECT('observation','No app functions respond','cause','Connection or account issue','next','Use the offline guide before opening the hopper.'),
 JSON_OBJECT('observation','Motor runs; no treat exits','cause','Bridging, size, residue, or internal jam','next','Unplug, empty, and clean accessible areas.'),
 JSON_OBJECT('observation','Works with a light load only','cause','Treat shape or hopper bridging','next','Use a more compatible treat and avoid overfilling.'),
 JSON_OBJECT('observation','Grinding or broken plastic','cause','Mechanical damage','next','Unplug and contact support.')
),
'support','Contact Furbo if compatible dry treats still do not toss after accessible cleaning, or if the mechanism grinds, is damaged, or becomes unusually hot. Do not dismantle internal food-contact parts unless Furbo directs it.',
'supportChecklist',JSON_ARRAY('Exact Furbo model','Treat brand, dimensions, and photo','Whether live video and other controls work','Motor sound during one attempt','Cleaning and reassembly performed','Photo or video of visible damage'),
'faq',JSON_ARRAY(
 JSON_OBJECT('question','Can I use soft treats?','answer','Only if Furbo explicitly lists them as compatible for the exact model. Soft, sticky, or oily treats are more likely to bridge and leave residue.'),
 JSON_OBJECT('question','Should I use oil to free the mechanism?','answer','No. Lubricant can contaminate treats, attract crumbs, or damage the mechanism.'),
 JSON_OBJECT('question','Why does Furbo toss several treats at once?','answer','Treat size and shape affect how many enter the mechanism. Use the documented range; the feature may not meter a precise single treat.')
),
'sourceNote','Treat requirements and cleaning access vary by Furbo generation. Use the exact model’s support instructions.',
'sources',JSON_ARRAY(JSON_OBJECT('label','Furbo — Help Center','url','https://help.furbo.com/'),JSON_OBJECT('label','Furbo — treat compatibility help','url','https://help.furbo.com/hc/en-us'))
) WHERE slug='furbo-treat-toss-jammed';

UPDATE troubleshooting_guides SET description='Diagnose a Litter-Robot 4 that makes motor noise but does not rotate by stopping power, checking load and assembly, and avoiding damage from forced movement.',estimated_time='15–20 min',updated_label='Sep 2026',content_json=JSON_OBJECT(
'safety','Turn off and unplug the unit before removing the bonnet or globe. Never hand-force a powered globe or reach into the waste opening. Stop for grinding, burning odor, heat, liquid, or damaged gears.',
'intro','Motor noise without globe movement suggests resistance, incorrect seating, overload, or drive failure. Record the error and exact sound first. A globe that rotates and then stops belongs to the displayed motion or safety-error path rather than repeated manual tests.',
'quickChecks',JSON_ARRAY('Record the light or app error and where in the cycle the globe stopped.','Power off immediately if the motor strains or grinds.','Check for overfilled litter or a heavy clump load before assuming motor failure.'),
'detailedSteps',JSON_ARRAY(
 JSON_OBJECT('title','Stop and preserve evidence','instruction','Turn the unit off after one failed attempt. Record the light pattern, app error, globe position, and a short safe video of the sound if already available.','why','Repeated stalled starts can stress the drive and erase the original status.','result','You have one clear record without further loading the motor.'),
 JSON_OBJECT('title','Unplug and reduce the load','instruction','With pets away, unplug the unit. Remove excess litter and large loose clumps according to the manual before removing the globe.','why','Overfill or accumulated waste can exceed normal operating resistance.','result','Litter is at or below the fill line and no heavy loose mass remains.'),
 JSON_OBJECT('title','Inspect accessible obstructions','instruction','Remove the bonnet and globe as documented. Look for liner material, litter, a foreign object, or residue in accessible paths. Do not open the base.','why','Material between moving surfaces can prevent rotation while the motor is energized.','result','The visible path is dry, clear, and undamaged.'),
 JSON_OBJECT('title','Inspect and reseat the globe','instruction','Check accessible globe features, track, and seating surfaces for obvious damage. Reinstall in the exact home orientation and secure the bonnet without force.','why','An incorrectly seated globe may not engage or move smoothly.','result','The globe and bonnet sit flush in their documented positions.'),
 JSON_OBJECT('title','Run one empty supervised test','instruction','Reconnect power with pets excluded and run one cycle with normal or reduced litter load as allowed. Stop immediately for renewed strain or grinding.','why','A single controlled test identifies whether clearing and reseating resolved the load.','result','The globe completes a smooth cycle and returns home.'),
 JSON_OBJECT('title','Escalate a persistent no-rotation fault','instruction','If motor noise returns without movement, unplug and contact Whisker. Do not force the globe, lubricate the track, or open the drive housing unless support instructs it.','why','Drive, gear, motor, or base repair needs model-specific manufacturer guidance.','result','Support receives the serial number, error, load, sound, and inspection result.')
),
'causeTable',JSON_ARRAY(
 JSON_OBJECT('observation','Works after removing excess litter','cause','Overload or fill-level issue','next','Maintain the specified fill line and monitor.'),
 JSON_OBJECT('observation','Globe does not sit flush','cause','Orientation, bonnet, or component seating issue','next','Reinstall exactly as the manual shows without force.'),
 JSON_OBJECT('observation','Motor grinds but globe stays still','cause','Drive resistance or failure','next','Unplug and contact support.'),
 JSON_OBJECT('observation','Globe starts then stops with named error','cause','Sensor, pinch, bonnet, or motion fault','next','Follow that exact error guide.')
),
'support','Contact Whisker after one unplugged inspection and supervised test if the motor runs without globe movement. Stop immediately for abnormal sound, odor, heat, liquid, or visible damage.',
'supportChecklist',JSON_ARRAY('Serial number and warranty status','Exact light and app error','Globe position at failure','Litter type and fill level','Video or description of sound','Visible damage or obstruction found'),
'faq',JSON_ARRAY(
 JSON_OBJECT('question','Can I rotate the globe by hand?','answer','Never force or rotate it while powered. With power disconnected, handle and position it only as the current manual directs.'),
 JSON_OBJECT('question','Can too much litter stop rotation?','answer','Excess weight can contribute to overload or motion faults. Keep compatible litter at or below the fill line.'),
 JSON_OBJECT('question','Should I lubricate the globe track?','answer','Not unless Whisker explicitly instructs it for the exact surface. Lubricant can attract litter or damage materials.')
),
'sourceNote','Error names and serviceable parts can change by hardware and firmware revision. Do not open the base based on generic instructions.',
'sources',JSON_ARRAY(JSON_OBJECT('label','Whisker — Litter-Robot 4 support','url','https://www.litter-robot.com/support/litter-robot-4'),JSON_OBJECT('label','Whisker — Litter-Robot 4 manual','url','https://www.litter-robot.com/manual_pdf/Litter-Robot-4-Manual.pdf'))
) WHERE slug='litter-robot-4-globe-not-rotating';

UPDATE troubleshooting_guides SET description='Use Fi’s last-known time and Lost mode as one part of an immediate physical recovery plan when a missing dog is not producing a fresh map location.',estimated_time='Immediate response',updated_label='Sep 2026',content_json=JSON_OBJECT(
'safety','Begin searching immediately. Do not wait for a map update, trespass, enter traffic, or search hazardous terrain alone. Call emergency services if people are in danger; use local animal-control and lost-pet resources for the dog.',
'intro','A missing map update can reflect an old last-known point, weak GPS view, no LTE-M connection, depleted battery, a lost collar, or a phone/app issue. Preserve the last-known time, activate Fi’s current lost-dog workflow, and coordinate searchers around facts rather than treating the dot as live.',
'quickChecks',JSON_ARRAY('Screenshot the last-known location, timestamp, battery, and safe-zone exit.','Activate Lost mode using Fi’s current instructions and start a physical search at once.','Share the dog description and a single contact channel with nearby helpers and official local resources.'),
'detailedSteps',JSON_ARRAY(
 JSON_OBJECT('title','Read the last-known record correctly','instruction','Capture the map, timestamp, location type, battery, and direction or escape point. Do not overwrite notes as the app changes.','why','The last dot may predate the escape or reflect a base or phone-assisted state.','result','All searchers use one time-stamped starting point.'),
 JSON_OBJECT('title','Activate the current lost-dog workflow','instruction','Enable Lost mode in the Fi app according to current support instructions and confirm household members can see the dog profile.','why','Lost mode changes how the collar requests and reports location, with a battery trade-off.','result','The app shows Lost mode active or a specific connection status.'),
 JSON_OBJECT('title','Search the escape route physically','instruction','Check the property, exit point, familiar paths, shelter spots, water, and nearby roads. Assign zones and times to helpers.','why','No wearable guarantees a current fix, and the collar may be separated from the dog.','result','Coverage expands from the strongest known evidence without duplicate effort.'),
 JSON_OBJECT('title','Check the phone and app without delaying search','instruction','Confirm phone data, notifications, account access, and app version. Ask another authorized owner whether they see a newer location.','why','A local phone problem can hide an update already available to the household.','result','At least one working phone monitors updates while others search.'),
 JSON_OBJECT('title','Activate community recovery layers','instruction','Contact local shelters, animal control, veterinary clinics, and the microchip registry. Publish a clear current photo, last-seen time and area, temperament, and safe contact method.','why','Identification and community sightings work even when the collar cannot communicate.','result','Relevant local channels know what dog to look for and whom to contact.'),
 JSON_OBJECT('title','Diagnose equipment only after recovery','instruction','After the dog is safe, inspect fit and attachment, charge the collar, update firmware, and perform an outdoor boundary and Lost-mode test.','why','Resetting or account changes during the search can consume time and state.','result','A controlled test determines whether the collar or membership needs support.')
),
'causeTable',JSON_ARRAY(
 JSON_OBJECT('observation','Timestamp is old','cause','No recent location reached Fi','next','Search from the last-seen area and likely route.'),
 JSON_OBJECT('observation','Another owner sees a newer point','cause','Affected phone, account, or app state','next','Use the working device and correct the other phone later.'),
 JSON_OBJECT('observation','Map points to the collar but dog is absent','cause','Collar may be detached','next','Recover the collar and continue dog search through sightings and ID.'),
 JSON_OBJECT('observation','No update despite battery shown','cause','GPS, LTE-M, terrain, indoor cover, or stale battery report','next','Continue physical and community search; contact Fi in parallel.')
),
'support','Contact Fi during the search through its current urgent support channel, but do not pause physical and community recovery. After recovery, do not rely on the collar again until an outdoor test succeeds.',
'supportChecklist',JSON_ARRAY('Fi collar and base identifiers','Membership status','Last-known screenshot and timestamp','Battery shown and last safe-zone event','Dog photo, description, and collar fit','Locations where service failed'),
'faq',JSON_ARRAY(
 JSON_OBJECT('question','Should I wait for Lost mode to connect?','answer','No. Activate it, then begin the physical and local recovery plan immediately.'),
 JSON_OBJECT('question','Does the dot always represent the dog?','answer','It represents the collar’s reported location. If the collar detached, the dog may be elsewhere.'),
 JSON_OBJECT('question','Should I reset the collar during the search?','answer','Only if Fi support explicitly directs it and the step will not disrupt active recovery. Preserve the last-known evidence first.')
),
'sourceNote','Fi app labels, membership functions, and urgent-support routes can change. This guide coordinates recovery; it cannot guarantee or remotely force a location.',
'sources',JSON_ARRAY(JSON_OBJECT('label','Fi — Support Center','url','https://support.tryfi.com/'),JSON_OBJECT('label','AAHA — microchip lookup','url','https://www.aaha.org/for-veterinary-professionals/microchip-search/'))
) WHERE slug='fi-series-3-dog-not-on-map';

UPDATE troubleshooting_guides SET description='Help a cat accept the PETKIT PURA MAX through a gradual, low-pressure transition while recognizing urinary or bowel warning signs that require veterinary care.',estimated_time='Several days',updated_label='Sep 2026',content_json=JSON_OBJECT(
'safety','If the cat strains, repeatedly enters a box without producing urine, cries, vomits, becomes lethargic, has blood in urine, or may be unable to urinate, seek urgent veterinary care. Do not assume avoidance is behavioral.',
'intro','A new automatic box changes shape, entry, texture, smell, sound, and movement at once. Reduce those changes: keep the familiar box available, begin with the PURA MAX powered off or in the manufacturer-approved non-automatic state, and let the cat choose to investigate.',
'quickChecks',JSON_ARRAY('Confirm the cat is urinating and defecating normally in another clean box.','Keep the old box in its usual location; do not force the cat into the new unit.','Disable automatic cleaning during early exposure if PETKIT’s current instructions allow it.'),
'detailedSteps',JSON_ARRAY(
 JSON_OBJECT('title','Rule out a medical or access problem','instruction','Check normal urine and stool output, appetite, mobility, and whether another clean box is being used. Ensure the entry is physically comfortable.','why','Pain, urinary obstruction, constipation, and mobility limits can look like preference.','result','The cat is eliminating normally or has been assessed by a veterinarian.'),
 JSON_OBJECT('title','Restore a reliable familiar option','instruction','Return the old box to its normal location with familiar litter and keep it clean. Place the PURA MAX nearby only if the space remains calm and accessible.','why','Removing the safe option can create stress and inappropriate elimination rather than adoption.','result','The cat has uninterrupted access to a known acceptable toilet.'),
 JSON_OBJECT('title','Make the new box quiet and predictable','instruction','Leave automatic cycles off during introduction if allowed. Keep the unit stable, clean, and free of deodorizer or strong cleaning scent.','why','Unexpected rotation or odor can create a lasting avoidance association.','result','The cat can approach, sniff, and leave without movement or pressure.'),
 JSON_OBJECT('title','Use a familiar litter transition','instruction','Use a machine-compatible litter the cat already accepts, or transition texture gradually. Add only a small amount of clean familiar litter for scent if the manual permits.','why','Changing both box and substrate makes the source of refusal unclear.','result','The new box smells and feels familiar while staying within machine requirements.'),
 JSON_OBJECT('title','Reward voluntary investigation','instruction','Offer calm praise or a small reward near—never inside—the unit when the cat approaches. Do not place, hold, or trap the cat in it.','why','Choice builds confidence; forced exposure can intensify fear.','result','The cat approaches and enters without coaxing or escape behavior.'),
 JSON_OBJECT('title','Introduce cleaning at a distance','instruction','After repeated comfortable use, run a manual cycle while the cat is elsewhere, then at a greater visible distance if the cat remains relaxed. Only later enable automatic timing.','why','Separating toileting from the first movement prevents a surprise during use.','result','The cat resumes using the box after hearing and seeing a cycle.'),
 JSON_OBJECT('title','Change the plan if avoidance persists','instruction','If the cat continues to avoid the unit, maintain enough conventional boxes and consult a veterinarian or qualified feline behavior professional.','why','Some cats do not accept a particular enclosure, entry, or motion pattern.','result','The household prioritizes reliable elimination rather than forcing one device.')
),
'causeTable',JSON_ARRAY(
 JSON_OBJECT('observation','Uses old box normally; avoids new entry','cause','Shape, height, enclosure, location, or novelty','next','Continue low-pressure exposure and check physical access.'),
 JSON_OBJECT('observation','Used it until first automatic cycle','cause','Startle or movement association','next','Return to manual/off introduction and rebuild gradually.'),
 JSON_OBJECT('observation','Avoids both old and new boxes','cause','Medical, litter, cleanliness, location, or broader stress issue','next','Arrange veterinary assessment promptly.'),
 JSON_OBJECT('observation','Enters repeatedly but little or no urine appears','cause','Possible urinary emergency','next','Seek urgent veterinary care now.')
),
'support','Contact PETKIT for abnormal motion, sound, sensor behavior, or setup questions. Contact a veterinarian for elimination or health changes; contact a qualified behavior professional for persistent avoidance after medical causes are addressed.',
'supportChecklist',JSON_ARRAY('Cat age, weight, mobility, and health changes','Normal urine and stool timeline','Old and new box locations','Litter types and cleaning products','Response before and after a cycle','Photos of entry and surrounding access'),
'faq',JSON_ARRAY(
 JSON_OBJECT('question','Should I remove the old litter box?','answer','Not to force adoption. Keep a reliable familiar box while the cat learns the new one and whenever elimination is uncertain.'),
 JSON_OBJECT('question','Can I put the cat inside the PURA MAX?','answer','Do not force or confine the cat in it. Encourage voluntary exploration and make sure the entry is physically accessible.'),
 JSON_OBJECT('question','How long should transition take?','answer','There is no universal deadline. Some cats adapt in days; others need weeks or never accept a particular design. Normal elimination and low stress are the priorities.'),
 JSON_OBJECT('question','When is not using the box an emergency?','answer','Repeated straining or attempts with little or no urine, pain, vomiting, lethargy, or blood can be urgent—especially in male cats. Seek veterinary care immediately.')
),
'sourceNote','This guide addresses introduction, not diagnosis. Follow PETKIT’s current kitten, weight, litter, and operating rules for the exact hardware revision.',
'sources',JSON_ARRAY(JSON_OBJECT('label','PETKIT — support','url','https://petkit.com/pages/support'),JSON_OBJECT('label','Cornell Feline Health Center — house soiling','url','https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/house-soiling'),JSON_OBJECT('label','Cornell Feline Health Center — feline lower urinary tract disease','url','https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/feline-lower-urinary-tract-disease'))
) WHERE slug='petkit-pura-max-cat-not-using';

/* Keep compact index steps aligned with the richer detail pages. */
DELETE FROM troubleshooting_steps WHERE guide_id IN (SELECT id FROM troubleshooting_guides WHERE slug IN ('litter-robot-4-pinch-detect','tractive-gps-location-not-updating','tractive-battery-draining','petlibro-granary-not-dispensing','petlibro-feeder-offline','furbo-camera-offline','furbo-treat-toss-jammed','litter-robot-4-globe-not-rotating','fi-series-3-dog-not-on-map','petkit-pura-max-cat-not-using'));
INSERT INTO troubleshooting_steps (guide_id,instruction,sort_order) VALUES
((SELECT id FROM troubleshooting_guides WHERE slug='litter-robot-4-pinch-detect'),'Record the fault, unplug, and clear only visible loose material',1),
((SELECT id FROM troubleshooting_guides WHERE slug='litter-robot-4-pinch-detect'),'Reseat the drawer, globe, and bonnet without forcing them',2),
((SELECT id FROM troubleshooting_guides WHERE slug='litter-robot-4-pinch-detect'),'Run one empty supervised cycle; stop if the alert returns',3),
((SELECT id FROM troubleshooting_guides WHERE slug='tractive-gps-location-not-updating'),'Screenshot the last-known location and timestamp',1),
((SELECT id FROM troubleshooting_guides WHERE slug='tractive-gps-location-not-updating'),'Start Live Tracking while beginning the physical search',2),
((SELECT id FROM troubleshooting_guides WHERE slug='tractive-gps-location-not-updating'),'Check phone data and expand local recovery if still offline',3),
((SELECT id FROM troubleshooting_guides WHERE slug='tractive-battery-draining'),'Inspect charging hardware and confirm a full charge',1),
((SELECT id FROM troubleshooting_guides WHERE slug='tractive-battery-draining'),'End Live Tracking and restore the power-saving home zone',2),
((SELECT id FROM troubleshooting_guides WHERE slug='tractive-battery-draining'),'Record a controlled 24-hour normal-use baseline',3),
((SELECT id FROM troubleshooting_guides WHERE slug='petlibro-granary-not-dispensing'),'Provide the meal manually and verify the saved schedule',1),
((SELECT id FROM troubleshooting_guides WHERE slug='petlibro-granary-not-dispensing'),'Unplug and inspect compatible food, bridging, and outlet',2),
((SELECT id FROM troubleshooting_guides WHERE slug='petlibro-granary-not-dispensing'),'Run one measured manual and one scheduled test',3),
((SELECT id FROM troubleshooting_guides WHERE slug='petlibro-feeder-offline'),'Verify local feeding and preserve every saved schedule',1),
((SELECT id FROM troubleshooting_guides WHERE slug='petlibro-feeder-offline'),'Check phone permissions and compatible Wi-Fi settings',2),
((SELECT id FROM troubleshooting_guides WHERE slug='petlibro-feeder-offline'),'Restart once and re-pair only if required',3),
((SELECT id FROM troubleshooting_guides WHERE slug='furbo-camera-offline'),'Record the LED state and verify stable power',1),
((SELECT id FROM troubleshooting_guides WHERE slug='furbo-camera-offline'),'Check the phone, account, router, and camera distance',2),
((SELECT id FROM troubleshooting_guides WHERE slug='furbo-camera-offline'),'Power-cycle once; reset only as a final documented step',3),
((SELECT id FROM troubleshooting_guides WHERE slug='furbo-treat-toss-jammed'),'Confirm the command reaches Furbo, then unplug it',1),
((SELECT id FROM troubleshooting_guides WHERE slug='furbo-treat-toss-jammed'),'Remove incompatible treats and dry-clean accessible areas',2),
((SELECT id FROM troubleshooting_guides WHERE slug='furbo-treat-toss-jammed'),'Reload lightly and run one supervised toss',3),
((SELECT id FROM troubleshooting_guides WHERE slug='litter-robot-4-globe-not-rotating'),'Record the error, unplug, and reduce excess litter load',1),
((SELECT id FROM troubleshooting_guides WHERE slug='litter-robot-4-globe-not-rotating'),'Clear visible obstructions and reseat the globe',2),
((SELECT id FROM troubleshooting_guides WHERE slug='litter-robot-4-globe-not-rotating'),'Run one supervised test; stop for strain or grinding',3),
((SELECT id FROM troubleshooting_guides WHERE slug='fi-series-3-dog-not-on-map'),'Screenshot the last-known time and activate Lost mode',1),
((SELECT id FROM troubleshooting_guides WHERE slug='fi-series-3-dog-not-on-map'),'Begin a coordinated physical search immediately',2),
((SELECT id FROM troubleshooting_guides WHERE slug='fi-series-3-dog-not-on-map'),'Activate shelters, microchip, and local recovery channels',3),
((SELECT id FROM troubleshooting_guides WHERE slug='petkit-pura-max-cat-not-using'),'Confirm normal elimination and keep the old box available',1),
((SELECT id FROM troubleshooting_guides WHERE slug='petkit-pura-max-cat-not-using'),'Introduce the new box powered off with familiar litter',2),
((SELECT id FROM troubleshooting_guides WHERE slug='petkit-pura-max-cat-not-using'),'Reward voluntary use and add cleaning cycles gradually',3);
