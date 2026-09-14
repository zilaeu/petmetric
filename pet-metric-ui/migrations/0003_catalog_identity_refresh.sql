-- Keep the lightweight D1 fallback aligned with the canonical shortlist.
UPDATE research_items
SET title='Litter-Robot 4 vs PETKIT PURA MAX',
    excerpt='Two real automatic litter boxes compared on cleaning workflow, cat fit, app controls and ongoing cost.'
WHERE slug='litter-robot-5-vs-petkit-purobot-ultra';

UPDATE research_items
SET title='PETLIBRO Granary vs Arf Pets Feeder',
    excerpt='A documented comparison of two scheduled dry-food feeders, focused on portions, capacity and setup.'
WHERE slug='petlibro-granary-vs-arf-pets-feeder';

UPDATE products SET name='Litter-Robot 4', brand='Whisker', price_cents=NULL, score=NULL, subscription='Check current listing', verdict='Whisker rotating self-cleaning litter box; verify the exact Amazon variant before buying.' WHERE slug='litter-robot-4';
UPDATE products SET name='PETKIT PURA X', brand='PETKIT', price_cents=NULL, score=NULL, verdict='Enclosed rotating automatic litter box; verify generation and listing contents on Amazon.' WHERE slug='petkit-pura-x';
UPDATE products SET name='PETKIT PURA MAX', brand='PETKIT', price_cents=NULL, score=NULL, verdict='Globe-style automatic litter box; verify the exact generation and accessories on Amazon.' WHERE slug='petkit-pura-max';
UPDATE products SET name='Litter-Robot 3 Connect', brand='Whisker', price_cents=NULL, score=NULL, verdict='Previous-generation connected Litter-Robot; check whether the Amazon offer is refurbished or used.' WHERE slug='litter-robot-3-connect';
UPDATE products SET name='PETLIBRO Granary 5L Automatic Feeder', brand='PETLIBRO', price_cents=NULL, score=NULL, verdict='5-liter scheduled dry-food feeder; confirm Wi-Fi and camera variant on Amazon.' WHERE slug='petlibro-granary';
UPDATE products SET name='Fi Series 3 Smart Dog Collar', brand='Fi', price_cents=NULL, score=NULL, verdict='Cellular GPS dog collar; core tracking requires membership and coverage.' WHERE slug='fi-series-3';
UPDATE products SET name='Tractive GPS DOG 4', brand='Tractive', price_cents=NULL, score=NULL, verdict='Cellular GPS dog tracker; confirm the current DOG model and plan terms on Amazon.' WHERE slug='tractive-gps-dog-4';
UPDATE products SET name='Whistle GO Explore', brand='Whistle', price_cents=NULL, score=NULL, verdict='GPS and wellness tracker for dogs; verify current model availability and subscription.' WHERE slug='whistle-go-explore';
UPDATE products SET name='Furbo 360 Dog Camera', brand='Furbo', price_cents=NULL, score=NULL, verdict='Rotating dog camera with treat tossing; confirm standalone versus subscription-required listing.' WHERE slug='furbo-360';
UPDATE products SET name='Petcube Bites 2', brand='Petcube', price_cents=NULL, score=NULL, verdict='Treat-dispensing pet camera; check the exact Bites 2 variant and plan requirements.' WHERE slug='petcube-bites-2';
UPDATE products SET name='eufy Security Indoor Cam E220', brand='eufy', price_cents=NULL, score=NULL, verdict='General indoor pan-and-tilt camera for pet monitoring; verify storage and plan terms.' WHERE slug='eufy-pet-camera-e220';
UPDATE products SET name='Wyze Cam v3', brand='Wyze', price_cents=NULL, score=NULL, verdict='General-purpose indoor camera used for pet monitoring; verify the current v3 listing.' WHERE slug='wyze-cam-v3';
