/* Rewrite listing-card copy around the buyer's use case, benefit, and main trade-off. */
SET NAMES utf8mb4;

UPDATE products SET
  verdict='A strong fit for multi-cat homes that want automatic waste separation and app tracking. The mature rotating system is easy to understand, but this listing is a supply bundle, so check exactly which accessories and base unit are included.',
  best_for='Multi-cat homes wanting a proven rotating system and app tracking'
WHERE slug='litter-robot-4';

UPDATE products SET
  verdict='A good option for cats that prefer a roomy, open entrance and owners who want camera-assisted waste and multi-cat tracking. It offers more visibility into litter-box habits, but the camera features and larger footprint may be more than privacy-conscious or space-limited homes need.',
  best_for='Multi-cat homes wanting an open-top box with camera-based tracking'
WHERE slug='petkit-pura-x';

UPDATE products SET
  verdict='Best suited to cats that resist enclosed globes and homes with room for an open-top unit. The large waste bin and dedicated air purifier reduce daily attention, while replacement filters and the broad footprint add ongoing cost and space requirements.',
  best_for='Cats that resist enclosed globes and homes with ample floor space'
WHERE slug='petkit-pura-max';

UPDATE products SET
  verdict='A practical choice for owners who want automatic sifting plus weight and litter-box usage in one app. It accepts clumping or non-clumping litter, but the rotating design still needs enough room and may require a gradual introduction for cautious cats.',
  best_for='Owners wanting flexible litter choice with app-based usage tracking'
WHERE slug='litter-robot-3-connect';

UPDATE products SET
  verdict='A straightforward pick for a single-cat home already comfortable with crystal trays. The uncovered design is easy to approach and simple to operate, but proprietary-style tray refills can cost more over time and there is no app tracking.',
  best_for='Single-cat homes prioritizing simple, uncovered automatic cleaning'
WHERE slug='petsafe-scoopfree-ultra';

UPDATE products SET
  verdict='A useful fit for busy cat or small-dog owners who want frequent scheduled portions and remote control. The 5-liter hopper reduces refill frequency, but Amazon offers can vary between camera and non-camera versions, and very large kibble may feed less consistently.',
  best_for='Busy households needing app-controlled portions and a large hopper'
WHERE slug='petlibro-granary';

UPDATE products SET
  verdict='A good choice when seeing and speaking to your pet at mealtime matters as much as scheduling food. Its 1080p camera, night vision, and two-way audio add reassurance, but camera placement and 2.4 GHz Wi-Fi coverage will affect the experience.',
  best_for='Owners who want video check-ins and two-way audio during meals'
WHERE slug='petkit-fresh-element-infinity';

UPDATE products SET
  verdict='A dependable option for owners who prefer on-device scheduling without another app. It supports up to 12 meals and slow feeding, though its larger hopper and control panel feel less convenient if you frequently change schedules away from home.',
  best_for='Owners wanting reliable app-free scheduling and slow-feed control'
WHERE slug='petsafe-healthy-pet-simply-feed';

UPDATE products SET
  verdict='A sensible budget pick for basic dry-food scheduling and portion control. The simple 4-liter design covers everyday feeding without camera extras, but owners who want remote alerts, meal video, or richer tracking should look at a connected model.',
  best_for='Budget-conscious cat owners needing simple scheduled dry-food meals'
WHERE slug='arf-pets-feeder';

UPDATE products SET
  verdict='A compact choice for dog owners who want live location, escape alerts, and health signals in one tracker. The feature set is useful for active or escape-prone dogs, but live tracking depends on cellular coverage and an ongoing plan.',
  best_for='Escape-prone dogs whose owners want location and wellness alerts'
WHERE slug='fi-series-3';

UPDATE products SET
  verdict='Best for larger dogs and owners who would rather charge less often. The listing claims up to six weeks of battery life alongside live GPS and health signals, but the larger tracker and required service plan are unnecessary for small pets.',
  best_for='Larger dogs and owners prioritizing multi-week battery life'
WHERE slug='tractive-gps-dog-4';

UPDATE products SET
  verdict='A fit for families already using Life360 who want pet location and escape alerts in a familiar app. The claimed two-week battery is convenient, but the small review base and ongoing connectivity terms deserve a closer look before committing.',
  best_for='Life360 households wanting pet location and escape alerts in one app'
WHERE slug='whistle-go-explore';

UPDATE products SET
  verdict='Designed for cats over 6.5 lb that roam outdoors or are prone to slipping away. Real-time location in a cat-sized form is the main benefit, while the shorter claimed five-day battery means more frequent charging than larger dog trackers.',
  best_for='Outdoor or escape-prone cats over 6.5 lb'
WHERE slug='jiobit-smart-tag';

UPDATE products SET
  verdict='A strong fit for dog owners who want to scan an entire room and toss treats remotely. The 360-degree view and two-way audio make check-ins more interactive, but advanced alerts may add a subscription and treats must suit the dispenser.',
  best_for='Dog owners wanting room-wide viewing and remote treat interaction'
WHERE slug='furbo-360';

UPDATE products SET
  verdict='A good choice for owners who want video check-ins and remote treats without making the camera the center of the room. It covers the interaction basics well, though cloud features and the exact bundle contents should be weighed against simpler cameras.',
  best_for='Owners wanting a compact camera with two-way audio and treat dispensing'
WHERE slug='petcube-bites-2';

UPDATE products SET
  verdict='A practical value pick for following a pet around one indoor room. Pan-and-tilt coverage and local microSD storage reduce blind spots and cloud dependence, but there is no treat dispenser and it is a general security camera rather than a pet-specific device.',
  best_for='Owners wanting broad indoor coverage and local video storage'
WHERE slug='eufy-pet-camera-e220';

UPDATE products SET
  verdict='A low-cost way to check on pets in a fixed area with two-way audio and useful night vision. It works well for a bed, crate, or doorway, but the fixed 120-degree view cannot follow a pet around the room.',
  best_for='Budget monitoring of a fixed pet area, crate, or doorway'
WHERE slug='wyze-cam-v3';

UPDATE products SET
  verdict='Best for owners who want drinking history and app-visible hydration trends, not just circulating water. The 3-liter tank and selectable flow modes are convenient, but replacement filters create an ongoing cost and tracking accuracy still depends on setup and use.',
  best_for='Owners who want app-visible drinking history and hydration trends'
WHERE slug='petlibro-dockstream-2';

UPDATE products SET
  verdict='A compelling option for homes that want cordless placement without buying replacement filters. Separate clean and wastewater tanks reduce recirculation, but the long battery and hygiene benefits are manufacturer claims and the multi-tank design still needs regular cleaning.',
  best_for='Homes prioritizing cordless placement and no replacement-filter cost'
WHERE slug='feelneedy-filterless-water-fountain';
