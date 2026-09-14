/* Expand the two highest-intent litter-box articles with decision-ready content. */

UPDATE guides
SET description='A practical framework for choosing a self-cleaning litter box: cat fit, safety, litter compatibility, placement, maintenance, noise, connectivity, and true ownership cost.',
    read_time='12 min read',
    updated_label='Sep 2026',
    content_json=JSON_OBJECT(
      'summary','The best automatic litter box is not the model with the longest feature list. It is the one every cat can enter comfortably, that fits your available floor space, works with a litter your cats accept, and remains simple enough that you will clean and inspect it consistently.',
      'takeaways',JSON_ARRAY(
        'Measure your largest cat and the installation space before comparing apps or extras.',
        'Treat manufacturer weight, age, mobility, litter, and placement rules as pass-or-fail requirements.',
        'Keep a conventional litter box available during transition and whenever the automatic unit is unavailable.',
        'Compare the full first-year cost: machine, litter, liners or trays, filters, cleaning supplies, and any optional plan.'
      ),
      'sections',JSON_ARRAY(
        JSON_OBJECT(
          'title','1. Start with your cats, not the machine',
          'paragraphs',JSON_ARRAY(
            'A product can clean well and still be the wrong choice if a cat cannot use it confidently. Start with the largest and least mobile cat in the household. Check the usable entrance—not just the exterior dimensions—and look for a stable step, comfortable turning room, and an interior that does not force a large cat into a cramped posture.',
            'Age and mobility matter as much as weight. A small kitten may fall below the automatic sensor threshold, while a senior cat may avoid a high step or enclosed globe. Follow the maker’s minimum age and weight guidance and use manual mode when required.'
          ),
          'checklist',JSON_ARRAY(
            'Record each cat’s weight and note the largest cat’s body length and shoulder height.',
            'Check whether any cat avoids covered boxes, narrow entries, moving objects, or unfamiliar sounds.',
            'For multi-cat homes, judge capacity by your busiest day—not the average day.',
            'Plan a backup box for illness, power loss, cleaning, travel, or a cat that refuses the new unit.'
          )
        ),
        JSON_OBJECT(
          'title','2. Check safety and operating rules',
          'paragraphs',JSON_ARRAY(
            'Automatic cleaning introduces moving parts and sensors. Read the current manual before purchase and confirm what stops a cycle when a cat approaches or enters. Look for clearly documented sensor behavior, safe manual controls, and a way to interrupt power without reaching into the mechanism.',
            'Do not assume that an app alert makes a unit safe. Physical placement, correct assembly, litter level, routine inspection, and adherence to weight or age limits remain essential.'
          ),
          'bullets',JSON_ARRAY(
            'Confirm the machine pauses or cancels cleaning when occupancy is detected.',
            'Check the maker’s rules for kittens, lightweight cats, and manual-only operation.',
            'Prefer controls and status indicators that remain usable when Wi-Fi or the app is unavailable.',
            'Review the warranty before using third-party parts, modifying sensors, or attempting internal repairs.'
          ),
          'note','If a cat has urinary, bowel, mobility, or behavior changes, the priority is veterinary assessment—not simply changing the litter box or interpreting app data.'
        ),
        JSON_OBJECT(
          'title','3. Match the litter and waste system',
          'paragraphs',JSON_ARRAY(
            'Rotating and sifting systems usually depend on clumps that become firm enough to separate cleanly. Crystal-tray systems use a different workflow and recurring tray cost. Read the exact compatibility rules: litter that is too light, too large, slow-clumping, or outside the fill line can cause tracking, residue, false readings, or incomplete separation.',
            'Your cat’s acceptance is the limiting factor. If switching litter is necessary, change one variable at a time and transition gradually rather than introducing a new machine and new litter on the same day.'
          ),
          'table',JSON_OBJECT(
            'headers',JSON_ARRAY('System style','Typical litter workflow','Main trade-off'),
            'rows',JSON_ARRAY(
              JSON_ARRAY('Rotating or sifting globe','Compatible clumping litter; clumps drop into a drawer','More litter choice, but fill level and clump quality matter'),
              JSON_ARRAY('Disposable crystal tray','Matched crystal tray or refill specified by the maker','Simple changeover, but recurring tray cost and waste can be higher'),
              JSON_ARRAY('Raking open pan','Compatible clumping or crystal medium, depending on model','Familiar shape for some cats; rake paths need regular inspection')
            )
          )
        ),
        JSON_OBJECT(
          'title','4. Measure the full installation space',
          'paragraphs',JSON_ARRAY(
            'Exterior dimensions are only the beginning. Leave room to open the waste drawer, remove the globe or rake assembly, add litter, reach the power plug, and clean around the unit. Some sensor systems also require a hard, level floor and clearance from walls.',
            'Choose a quiet, accessible location that your cat can reach at all times. Avoid trapping the unit behind a door or placing it where normal household traffic repeatedly startles a cautious cat.'
          ),
          'checklist',JSON_ARRAY(
            'Measure width, depth, height, door swing, and service clearance.',
            'Confirm a nearby outlet without creating a cord trip or chew hazard.',
            'Check the manual before placing the unit on carpet or a soft mat.',
            'Make sure you can lift or remove the main cleaning parts safely.'
          )
        ),
        JSON_OBJECT(
          'title','5. Compare daily maintenance, odor, and noise',
          'paragraphs',JSON_ARRAY(
            'Self-cleaning does not mean maintenance-free. You will still empty waste, top up litter, wipe sensors, remove stuck residue, deep-clean removable parts, and inspect seals and moving areas. A larger drawer may reduce emptying frequency, but it does not eliminate odor or the need to check output for health changes.',
            'Noise specifications are rarely measured the same way across brands. Treat published decibel figures cautiously. More useful questions are whether you can schedule or delay cycles, whether a cycle can wake people or frighten a cat, and what happens after a jam or interrupted cycle.'
          ),
          'bullets',JSON_ARRAY(
            'Ask how long a normal empty-and-wipe routine takes with no tools.',
            'Check whether waste bags, filters, trays, or odor products are proprietary.',
            'Look for smooth, reachable surfaces rather than crevices that collect damp litter.',
            'Keep inspecting urine and stool; automation can make important changes easier to overlook.'
          )
        ),
        JSON_OBJECT(
          'title','6. Calculate first-year and ongoing cost',
          'paragraphs',JSON_ARRAY(
            'Compare ownership cost with the same assumptions for every model. Do not mix a discounted hardware price for one product with full-price consumables for another. Use your household’s actual litter use where possible and separate required costs from optional app plans or odor accessories.'
          ),
          'table',JSON_OBJECT(
            'headers',JSON_ARRAY('Cost line','How to estimate it','Easy-to-miss detail'),
            'rows',JSON_ARRAY(
              JSON_ARRAY('Hardware','Current delivered price plus tax','Steps, ramps, mats, or extended warranty may be separate'),
              JSON_ARRAY('Litter or trays','Monthly use × 12','A new litter type can change both cost and cat acceptance'),
              JSON_ARRAY('Bags and filters','Replacement interval × unit price','Generic alternatives may affect fit or warranty guidance'),
              JSON_ARRAY('Connectivity','Required plan × 12','Separate required service from optional insights'),
              JSON_ARRAY('Cleaning and downtime','Supplies plus backup-box needs','Replacement parts and shipping can matter after warranty')
            )
          ),
          'note','A simple comparison formula: first-year cost = delivered hardware price + 12 months of required consumables + required connectivity + essential accessories.'
        ),
        JSON_OBJECT(
          'title','7. Use a low-pressure transition plan',
          'paragraphs',JSON_ARRAY(
            'Place the new unit near the familiar box and initially leave automatic cycling off if the manufacturer permits it. Add a small amount of familiar, clean litter to the new box and let the cat investigate without being placed inside. Once the cat uses it reliably, introduce cleaning cycles while the cat is elsewhere and observe the response.',
            'Do not remove the old box simply to force adoption. If a cat stops eliminating normally, strains, vocalizes, repeatedly enters without producing urine, or toilets outside the box, contact a veterinarian promptly.'
          ),
          'checklist',JSON_ARRAY(
            'Keep the old box available during the transition.',
            'Avoid changing machine, litter, and location all at once.',
            'Reward calm investigation; never force the cat into the opening.',
            'Confirm several days of comfortable use before relying on automatic mode alone.'
          )
        ),
        JSON_OBJECT(
          'title','A final pre-purchase checklist',
          'checklist',JSON_ARRAY(
            'Every cat meets the current weight, age, entrance, and mobility requirements.',
            'The unit and its service clearance fit the intended location.',
            'The litter workflow is compatible with both the machine and your cats.',
            'You understand required cleaning, consumables, replacement parts, and warranty terms.',
            'Core controls work without depending entirely on an app.',
            'You have a conventional backup box and a gradual transition plan.',
            'The first-year total fits your budget without relying on an uncertain sale price.'
          )
        )
      ),
      'faq',JSON_ARRAY(
        JSON_OBJECT('question','How many automatic litter boxes do I need for multiple cats?','answer','There is no universal machine-to-cat ratio. Use the manufacturer’s stated capacity as a ceiling, then account for each cat’s preferences, territorial behavior, and the need for a backup. Some multi-cat homes still need more than one toileting location even when the drawer has enough capacity.'),
        JSON_OBJECT('question','Can kittens use an automatic litter box?','answer','Only when they meet the specific maker’s age and weight rules. Lightweight kittens may not reliably trigger occupancy sensors. Follow the manual and use manual mode or a conventional box until the kitten meets the stated requirements.'),
        JSON_OBJECT('question','Do I need Wi-Fi for an automatic litter box?','answer','Many units can perform basic cleaning without Wi-Fi, but setup, history, alerts, or remote controls may require an app and internet connection. Confirm exactly which functions remain available offline.'),
        JSON_OBJECT('question','Will an automatic litter box eliminate odor?','answer','No. Faster waste separation and a closed drawer can reduce exposure, but odor still depends on litter, seals, emptying frequency, cleaning, ventilation, and the cat’s health.'),
        JSON_OBJECT('question','Is a bigger waste drawer always better?','answer','It can reduce emptying frequency, especially with multiple cats, but a large drawer is not a reason to leave waste unchecked. Regular inspection helps manage odor and notice changes in elimination.'),
        JSON_OBJECT('question','What if my cat refuses the new box?','answer','Pause automatic cycles if the manual allows, keep the familiar box nearby, use familiar litter, and transition slowly. Never force the cat inside. Sudden avoidance or elimination changes can also signal pain or illness and deserve veterinary attention.')
      ),
      'sourceNote','This is a category-level decision framework, not a substitute for the safety, litter, placement, cleaning, and kitten rules in the manual for a specific model.',
      'sources',JSON_ARRAY(
        JSON_OBJECT('label','Whisker Support — Litter-Robot 4 knowledge base','url','https://www.litter-robot.com/support/litter-robot-4'),
        JSON_OBJECT('label','PetSafe Support — self-cleaning litter boxes','url','https://support.petsafe.net/s/topic/0TO4X000000kIgBWAU/selfcleaning-litter-boxes'),
        JSON_OBJECT('label','Cornell Feline Health Center — house soiling','url','https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/house-soiling')
      )
    )
WHERE slug='how-to-choose-automatic-litter-box';

UPDATE troubleshooting_guides
SET description='A safe diagnostic sequence for a Litter-Robot 4 that stays in the home position after a cat exits, including sensor reset, placement, litter level, modes, and support escalation.',
    estimated_time='10–15 min',
    updated_label='Sep 2026',
    content_json=JSON_OBJECT(
      'safety','Keep cats away while testing. Unplug the unit before removing the globe or touching an exposed moving area. Stop immediately if the unit is hot, smells burnt, has a damaged cord, or makes grinding or straining sounds.',
      'intro','A missed automatic cycle does not always mean the motor has failed. First separate three situations: the unit never detected the cat, it detected the visit but is waiting or paused, or it tries to cycle and stops with an error. This guide is for a unit that remains in the home position; a globe that starts and jams needs a different diagnostic path.',
      'quickChecks',JSON_ARRAY(
        'Wait out the selected cycle delay after the cat exits; the unit should not rotate while a cat is present.',
        'Check the control-panel or app status for sleep mode, a full drawer, a paused state, or an active error before resetting anything.',
        'Make sure the cat is heavy enough for the current manufacturer rules and that the unit is on a firm, level surface.'
      ),
      'detailedSteps',JSON_ARRAY(
        JSON_OBJECT('title','Confirm it is a missed cycle, not a normal delay','instruction','Note the time the cat exits and wait through the configured cycle delay. Check whether sleep mode or another schedule is suppressing automatic cleaning. Do not trigger a cycle while a cat is near the opening.','why','The unit intentionally waits after a visit, and scheduled modes can make correct behavior look like a fault.','result','The status changes from cat detected or timing to ready, then the unit completes one normal cycle.'),
        JSON_OBJECT('title','Read the current status before pressing buttons','instruction','Record the light-bar color or pattern and the exact status or notification shown in the Whisker app. Take a screenshot if an error is present.','why','A sensor, drawer, bonnet, or motion error needs its own path. Resetting first can erase the most useful clue.','result','You can describe whether the unit is ready, paused, timing, full, offline, or showing a named fault.'),
        JSON_OBJECT('title','Check placement and physical stability','instruction','Verify that all feet sit securely on a firm, level surface and that the unit is not rocking, pressed tightly against a wall, or resting unevenly on thick carpet. Follow Whisker’s current placement guidance for any mat or carpet tray.','why','The weight-sensing system depends on stable contact with the floor. Soft or uneven support can make cat detection inconsistent.','result','The base does not rock when lightly checked and has the clearances required by the current manual.'),
        JSON_OBJECT('title','Restore the correct litter level','instruction','With the globe in the home position, keep compatible litter at or below the raised fill line and distribute it evenly. Remove excess litter rather than compressing it. Clear loose litter or objects that prevent the globe, waste drawer, or bonnet from seating correctly.','why','Overfilling adds load and can interfere with sensing or movement; incorrect litter can also sift poorly.','result','The litter bed is even, below the fill line, and no loose material obstructs assembly.'),
        JSON_OBJECT('title','Empty and correctly reseat the waste drawer','instruction','Pull out the drawer, empty it if needed, fit the liner so it does not block sensors or protrude into the base, and slide the drawer fully home. Clean sensor windows only by the method in the current manufacturer instructions; do not spray cleaner into the base.','why','A full reading or poorly seated liner can hold the unit in a non-ready state even when the drawer does not look packed.','result','The drawer sits flush and the full indication clears after the documented reset or recalibration.'),
        JSON_OBJECT('title','Perform the documented reset at home position','instruction','Return the globe to the home position and use the physical Reset control as described in the current Litter-Robot 4 manual to zero the weight scale. Use the Cycle control for one supervised test. Do not repeatedly reset while weight is on the step or inside the globe.','why','Moving the unit, adding litter, or emptying the drawer changes its baseline. The physical reset re-establishes that baseline; an app refresh alone may not.','result','The panel returns to ready and one manual test cycle completes without an error.'),
        JSON_OBJECT('title','Power-cycle once, then run a controlled detection test','instruction','If the panel is still unresponsive, turn the unit off and unplug it for about one minute. Reconnect it directly to a known working outlet, allow initialization to finish, reset the scale at home position, and test once while keeping pets away.','why','A single clean restart can clear a temporary control state. Repeated restarts without reading the status can hide a persistent fault.','result','Initialization completes, the unit reaches ready, and it recognizes a later supervised visit after the selected delay.'),
        JSON_OBJECT('title','Update software only after basic operation is stable','instruction','If manual cycling works but automatic behavior or app status remains inconsistent, confirm the app and firmware are current using Whisker’s instructions. Do not interrupt power during a firmware update.','why','Connectivity and firmware can affect schedules and reporting, but they should be checked after placement, baseline, and mechanical readiness.','result','The app matches the control-panel state and automatic cycling resumes on the next supervised visit.')
      ),
      'causeTable',JSON_ARRAY(
        JSON_OBJECT('observation','Manual Cycle works, but no visit appears in history','cause','Cat detection, weight threshold, baseline, or unstable placement','next','Recheck floor contact, cat eligibility, litter level, and the physical reset procedure.'),
        JSON_OBJECT('observation','Visit is recorded and the unit says timing or sleeping','cause','Configured delay or schedule rather than a motor fault','next','Review cycle delay and sleep-mode settings; observe one complete window.'),
        JSON_OBJECT('observation','Drawer-full state remains after emptying','cause','Liner position, sensor cleanliness, or drawer-full calibration','next','Reseat the liner and drawer, then follow the current DFI reset or calibration instructions.'),
        JSON_OBJECT('observation','Cycle starts but stops or reverses','cause','This is a motion, pinch, bonnet, overload, or obstruction path','next','Stop this guide and follow the exact displayed error; do not force the globe.'),
        JSON_OBJECT('observation','No lights or response after a known-good outlet test','cause','Power supply, cable, connector, or base fault','next','Stop testing and contact Whisker support, especially while under warranty.')
      ),
      'support','Contact Whisker if a named error returns after its documented procedure, the unit cannot complete a manual cycle, cat detection remains unreliable on a correct hard-floor setup, or there is any sign of electrical or mechanical damage. Avoid opening the base or bypassing a safety sensor.',
      'supportChecklist',JSON_ARRAY(
        'Serial number, purchase date, and warranty status.',
        'A photo showing the full installation surface and clearance around the base.',
        'The exact light pattern, app message, and time of the missed visit.',
        'Cat weight, litter brand or type, and approximate fill level.',
        'Which steps above were tried and whether a manual cycle completed.',
        'A short video of the status or sound only if it can be recorded safely with pets kept away.'
      ),
      'faq',JSON_ARRAY(
        JSON_OBJECT('question','Why does my Litter-Robot 4 wait before cycling?','answer','A configurable delay lets clumps form and prevents cleaning immediately after a cat exits. Check the selected delay and wait through it before treating the behavior as a fault.'),
        JSON_OBJECT('question','Can carpet stop automatic cycling?','answer','A soft or uneven surface can affect the weight-sensing baseline. Follow Whisker’s current placement requirements and use only the approved support or carpet-tray arrangement for your setup.'),
        JSON_OBJECT('question','Should I reset from the app or the control panel?','answer','For a weight-baseline issue after moving the unit, changing litter, or emptying the drawer, follow the current manual’s physical Reset-button procedure at the home position. App controls and status refreshes are not necessarily the same operation.'),
        JSON_OBJECT('question','Why does manual cycling work but automatic cycling does not?','answer','That pattern points away from a basic motor failure and toward visit detection, scale baseline, cat eligibility, placement, or a schedule. Check whether the visit is recorded, then verify the floor, litter level, and reset procedure.'),
        JSON_OBJECT('question','Can I keep using it in manual mode?','answer','Only if the unit completes cycles normally, shows no safety or motion fault, and you can supervise it according to the manual. Keep a conventional box available and contact support if automatic detection remains unreliable.'),
        JSON_OBJECT('question','When should I stop troubleshooting?','answer','Stop if there is heat, burning odor, cable damage, grinding, exposed movement, liquid in the base, repeated motion faults, or a cycle that cannot be safely interrupted. Unplug the unit and contact the manufacturer.')
      ),
      'sourceNote','This sequence distinguishes a unit that stays at home from one that begins rotating and stops. Light codes, controls, and firmware behavior may change; use the live Whisker support article for the exact status shown on your unit.',
      'sources',JSON_ARRAY(
        JSON_OBJECT('label','Whisker Support — Litter-Robot 4','url','https://www.litter-robot.com/support/litter-robot-4'),
        JSON_OBJECT('label','Whisker Support — Litter-Robot 4 manuals','url','https://www.litter-robot.com/manual_pdf/Litter-Robot-4-Manual.pdf'),
        JSON_OBJECT('label','Whisker Support — troubleshooting library','url','https://www.litter-robot.com/support')
      )
    )
WHERE slug='litter-robot-4-not-cycling';

DELETE FROM troubleshooting_steps WHERE guide_id=(SELECT id FROM troubleshooting_guides WHERE slug='litter-robot-4-not-cycling');
INSERT INTO troubleshooting_steps (guide_id,instruction,sort_order) VALUES
((SELECT id FROM troubleshooting_guides WHERE slug='litter-robot-4-not-cycling'),'Confirm the selected cycle delay and scheduled modes',1),
((SELECT id FROM troubleshooting_guides WHERE slug='litter-robot-4-not-cycling'),'Record the current light-bar and app status',2),
((SELECT id FROM troubleshooting_guides WHERE slug='litter-robot-4-not-cycling'),'Check firm, level placement and required clearance',3),
((SELECT id FROM troubleshooting_guides WHERE slug='litter-robot-4-not-cycling'),'Correct the litter level and remove obstructions',4),
((SELECT id FROM troubleshooting_guides WHERE slug='litter-robot-4-not-cycling'),'Empty and correctly reseat the waste drawer',5),
((SELECT id FROM troubleshooting_guides WHERE slug='litter-robot-4-not-cycling'),'Reset the weight scale at the home position',6),
((SELECT id FROM troubleshooting_guides WHERE slug='litter-robot-4-not-cycling'),'Power-cycle once and run a supervised test',7),
((SELECT id FROM troubleshooting_guides WHERE slug='litter-robot-4-not-cycling'),'Check app and firmware only after basic operation is stable',8);
