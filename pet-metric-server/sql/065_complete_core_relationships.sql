SET NAMES utf8mb4;

INSERT INTO product_tags (product_id,tag,sort_order)
SELECT p.id,v.tag,v.sort_order FROM products p JOIN (
SELECT 'oneisall-quiet-dog-clippers' slug,'cordless' tag,1 sort_order UNION ALL SELECT 'oneisall-quiet-dog-clippers','quiet grooming',2 UNION ALL
SELECT 'wahl-pro-series-animal','thick coats',1 UNION ALL SELECT 'wahl-pro-series-animal','replaceable blade',2 UNION ALL
SELECT 'furminator-undercoat-deshedding-tool','cats and dogs',1 UNION ALL SELECT 'furminator-undercoat-deshedding-tool','de-shedding',2 UNION ALL
SELECT 'dremel-pawcontrol-nail-grinder','nail care',1 UNION ALL SELECT 'dremel-pawcontrol-nail-grinder','cordless',2 UNION ALL
SELECT 'wee-wee-pads-xxl','dog training',1 UNION ALL SELECT 'wee-wee-pads-xxl','disposable refill',2 UNION ALL
SELECT 'drymate-cat-litter-mat','cat litter',1 UNION ALL SELECT 'drymate-cat-litter-mat','washable',2 UNION ALL
SELECT 'glad-for-pets-waste-bags','dog walking',1 UNION ALL SELECT 'glad-for-pets-waste-bags','disposable refill',2 UNION ALL
SELECT 'litter-genie-plus','cat litter',1 UNION ALL SELECT 'litter-genie-plus','odor containment',2 UNION ALL
SELECT 'ruffwear-front-range-harness','everyday walks',1 UNION ALL SELECT 'ruffwear-front-range-harness','reflective',2 UNION ALL
SELECT 'julius-k9-idc-powerharness','back handle',1 UNION ALL SELECT 'julius-k9-idc-powerharness','strong dogs',2 UNION ALL
SELECT 'wonder-dog-ultimate-leash','multi-use leash',1 UNION ALL SELECT 'wonder-dog-ultimate-leash','hands-free',2 UNION ALL
SELECT 'kurgo-enhanced-strength-tru-fit','travel harness',1 UNION ALL SELECT 'kurgo-enhanced-strength-tru-fit','adjustable fit',2
) v ON v.slug=p.slug ON DUPLICATE KEY UPDATE sort_order=VALUES(sort_order);

INSERT INTO comparison_best_for (comparison_id,pick_name,audience,sort_order)
SELECT c.id,v.pick_name,v.audience,v.sort_order FROM comparisons c JOIN (
SELECT 'oneisall-vs-wahl-bravura' slug,'Oneisall Quiet Dog Clippers' pick_name,'Occasional home grooming and pets that need a calmer introduction.' audience,1 sort_order UNION ALL SELECT 'oneisall-vs-wahl-bravura','Wahl Professional Animal Bravura','Frequent grooming and owners prepared for blade maintenance.',2 UNION ALL
SELECT 'weewee-pads-vs-drymate-mat','WEE WEE XXL Training Pads','Dog households containing indoor liquid accidents.',1 UNION ALL SELECT 'weewee-pads-vs-drymate-mat','Drymate Cat Litter Mat','Cat households reducing tracked litter at the box exit.',2 UNION ALL
SELECT 'ruffwear-vs-julius-k9','Ruffwear Front Range Harness','Everyday walks where padded comfort is the priority.',1 UNION ALL SELECT 'ruffwear-vs-julius-k9','Julius-K9 IDC Powerharness','Strong dogs where a sturdy back handle is useful.',2
) v ON v.slug=c.slug WHERE NOT EXISTS (SELECT 1 FROM comparison_best_for x WHERE x.comparison_id=c.id AND x.pick_name=v.pick_name);

INSERT INTO troubleshooting_steps (guide_id,instruction,sort_order)
SELECT g.id,v.instruction,v.sort_order FROM troubleshooting_guides g JOIN (
SELECT 'pet-clipper-pulling-hair' slug,'Stop and contact the maker or a groomer if a clean, cool blade still pulls.' instruction,4 sort_order UNION ALL
SELECT 'dremel-pawcontrol-vibration-too-high','Stop the session if the pet remains distressed; retry on another day or seek professional help.',4 UNION ALL
SELECT 'training-pad-leaking','Try a larger containment area or a washable tray if edge misses continue.',4 UNION ALL
SELECT 'litter-genie-odor-escaping','Replace damaged refill film or contact support if the seal will not close.',4 UNION ALL
SELECT 'dog-harness-rubs-or-slips','Stop using the harness and choose a different shape if safe adjustment cannot prevent rubbing or escape.',4 UNION ALL
SELECT 'kurgo-harness-car-clip-twists','Use the manufacturer support channel if the exact variant instructions remain unclear.',4
) v ON v.slug=g.slug WHERE NOT EXISTS (SELECT 1 FROM troubleshooting_steps x WHERE x.guide_id=g.id AND x.instruction=v.instruction);
