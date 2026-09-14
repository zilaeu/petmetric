-- Design content seed. Keep the canonical visual copy in app/composables/designData.ts;
-- this migration makes the same shortlist available to the local/Cloudflare D1 API.
UPDATE categories SET name = 'Automatic Litter Boxes', product_count = 34, updated_at = 'Aug 2026' WHERE slug = 'automatic-litter-boxes';
UPDATE categories SET name = 'Smart Pet Feeders', product_count = 28, updated_at = 'Sep 2026' WHERE slug = 'smart-pet-feeders';
UPDATE categories SET name = 'GPS Pet Trackers', product_count = 19, updated_at = 'Aug 2026' WHERE slug = 'gps-pet-trackers';
UPDATE categories SET name = 'Pet Cameras', product_count = 22, updated_at = 'Jul 2026' WHERE slug = 'pet-cameras';

INSERT OR IGNORE INTO products (slug, category_slug, name, brand, price_cents, subscription, score, verdict, best_for, updated_at) VALUES
('petkit-pura-x', 'automatic-litter-boxes', 'PETKIT PURA X', 'PETKIT', 54900, 'None', 4.0, 'Enclosed globe with a quieter motor and strong multi-cat weight identification.', 'Owners with two cats who want health tracking', 'Sep 2026'),
('litter-robot-3-connect', 'automatic-litter-boxes', 'Litter-Robot 3 Connect', 'Whisker', 49900, 'Optional $12.49/mo', 3.9, 'Previous-generation Litter-Robot, still reliable and often available refurbished.', 'Litter-Robot buyers on a tighter budget', 'May 2026'),
('catlink-luxury-pro-x', 'automatic-litter-boxes', 'CATLINK Luxury Pro X', 'CATLINK', 49900, 'None', 3.8, 'Globe-style unit with more color options; the app is less refined.', 'Owners wanting the LR style at lower cost', 'Jun 2026'),
('petlibro-granary', 'smart-pet-feeders', 'PETLIBRO Granary', 'PETLIBRO', 8999, 'None', 4.2, 'Best dispensing accuracy we have tested, with a 1080p camera and flexible scheduling.', 'Pets on prescribed portion-control diets', 'Sep 2026'),
('petkit-fresh-element-infinity', 'smart-pet-feeders', 'PETKIT Fresh Element Infinity', 'PETKIT', 12999, 'None', 3.9, 'A desiccant system keeps dry food fresh longer in humid climates.', 'Owners with food-storage concerns', 'Sep 2026'),
('petsafe-healthy-pet-simply-feed', 'smart-pet-feeders', 'PetSafe Healthy Pet Simply Feed', 'PetSafe', 9999, 'None', 3.8, 'Reliable scheduling and slow-feed mode without an app.', 'Owners who want a reliable no-app feeder', 'Jul 2026'),
('arf-pets-feeder', 'smart-pet-feeders', 'Arf Pets Automatic Feeder', 'Arf Pets', 5499, 'None', 3.7, 'Reliable for standard schedules, with more variance at small portions.', 'Healthy pets on a basic schedule', 'Aug 2026'),
('fi-series-3', 'gps-pet-trackers', 'Fi Series 3', 'Fi', 14900, '$8.25/mo', 4.1, 'Best battery life in the category with reliable US LTE-M coverage.', 'US-based owners with active or escape-prone dogs', 'Aug 2026'),
('tractive-gps-dog-4', 'gps-pet-trackers', 'Tractive GPS DOG 4', 'Tractive', 4999, '$12.99/mo', 3.9, 'The most affordable hardware with global coverage in 175+ countries.', 'International travelers and cost-sensitive buyers', 'Aug 2026'),
('whistle-go-explore', 'gps-pet-trackers', 'Whistle GO Explore', 'Whistle', 7995, '$9.95/mo', 3.8, 'GPS plus health tracking in one device for the US and Canada.', 'Health-conscious owners in North America', 'Jul 2026'),
('jiobit-smart-tag', 'gps-pet-trackers', 'Jiobit Smart Tag', 'Jiobit', 9999, '$8.99/mo', 3.6, 'Ultra-compact and lightweight for small dogs and cats.', 'Small dogs and cats under 10 lb', 'Jun 2026'),
('furbo-360', 'pet-cameras', 'Furbo 360°', 'Furbo', 16900, '$8.99/mo', 4.0, 'The best all-round camera: 360° pan, color night vision and clear two-way audio.', 'Dog owners managing separation anxiety', 'Jul 2026'),
('petcube-bites-2', 'pet-cameras', 'Petcube Bites 2', 'Petcube', 8999, '$4.99/mo', 3.8, 'Lower price and subscription with adequate treat tossing.', 'Cat owners and budget-conscious buyers', 'Jul 2026'),
('eufy-pet-camera-e220', 'pet-cameras', 'eufy Pet Camera E220', 'eufy', 7999, 'None', 3.7, 'Pan-and-tilt with local storage and no mandatory subscription.', 'Privacy-conscious owners', 'Jun 2026'),
('wyze-cam-v3', 'pet-cameras', 'Wyze Cam v3', 'Wyze', 3599, 'None', 3.5, 'The best budget option for basic live video and cloud storage.', 'Owners who just want live video', 'Jun 2026');

INSERT OR IGNORE INTO research_items (slug, title, excerpt, type, category, read_time, checked_at, accent) VALUES
('litter-robot-4-vs-petkit-pura-max', 'Litter-Robot 4 vs PETKIT PURA MAX', 'Litter-Robot 4 for reliability; PETKIT PURA MAX for budget.', 'Comparison', 'Automatic Litter Boxes', '9 min read', 'Aug 2026', 'orange'),
('tractive-gps-vs-fi-series-3', 'Tractive GPS vs Fi Series 3', 'Tractive for international travel; Fi for US coverage and battery life.', 'Comparison', 'GPS Pet Trackers', '8 min read', 'Aug 2026', 'green'),
('petlibro-granary-vs-arf-pets-feeder', 'PETLIBRO Granary vs Arf Pets Feeder', 'PETLIBRO wins on dispensing accuracy at all portion sizes.', 'Comparison', 'Smart Pet Feeders', '7 min read', 'Sep 2026', 'blue');
