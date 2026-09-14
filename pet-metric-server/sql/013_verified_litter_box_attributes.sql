SET NAMES utf8mb4;

UPDATE products
SET amazon_rating=4.2, amazon_review_count=411, amazon_availability='In Stock', commerce_checked_at=NOW()
WHERE external_id='B0GTM9P94B';

UPDATE products
SET amazon_rating=4.4, amazon_review_count=180,
    amazon_availability='Not deliverable to the checked location', commerce_checked_at=NOW()
WHERE external_id='B0BH6MD3DJ';

DELETE ps FROM product_specs ps
JOIN products p ON p.id=ps.product_id
WHERE p.external_id IN ('B0GTM9P94B','B0BH6MD3DJ')
  AND ps.spec_key IN ('color','material','dimensions','weight','model','variant','amazon_bestsellers_rank');

INSERT INTO product_specs (product_id,spec_key,label,value,sort_order) VALUES
((SELECT id FROM products WHERE external_id='B0GTM9P94B'),'color','Color','White',10),
((SELECT id FROM products WHERE external_id='B0GTM9P94B'),'material','Material','Acrylonitrile butadiene styrene (ABS)',11),
((SELECT id FROM products WHERE external_id='B0GTM9P94B'),'dimensions','Product dimensions','59.2 L × 57.2 W × 71.4 H cm',12),
((SELECT id FROM products WHERE external_id='B0GTM9P94B'),'weight','Item weight','33.07 lb / 15 kg',13),
((SELECT id FROM products WHERE external_id='B0GTM9P94B'),'model','Model','PLLB001',14),
((SELECT id FROM products WHERE external_id='B0GTM9P94B'),'variant','Selected variant','White · Luma Cat Litter Box',15),
((SELECT id FROM products WHERE external_id='B0GTM9P94B'),'amazon_bestsellers_rank','Amazon Best Sellers Rank','#6,856 in Pet Supplies · #28 in Self-Cleaning Cat Litter Boxes',16),

((SELECT id FROM products WHERE external_id='B0BH6MD3DJ'),'color','Color','Black',10),
((SELECT id FROM products WHERE external_id='B0BH6MD3DJ'),'material','Material','Plastic',11),
((SELECT id FROM products WHERE external_id='B0BH6MD3DJ'),'dimensions','Product dimensions','Conflict on page: overview 61 L × 61 W × 78.7 H cm; detail section 68.58 × 61.6 × 74.93 cm',12),
((SELECT id FROM products WHERE external_id='B0BH6MD3DJ'),'weight','Item weight','24 lb / 10.89 kg',13),
((SELECT id FROM products WHERE external_id='B0BH6MD3DJ'),'model','Style / model','LR4',14),
((SELECT id FROM products WHERE external_id='B0BH6MD3DJ'),'variant','Selected variant','Black · Robot Only',15),
((SELECT id FROM products WHERE external_id='B0BH6MD3DJ'),'amazon_bestsellers_rank','Amazon Best Sellers Rank','#4,367 in Pet Supplies',16);

UPDATE product_metric_values v
JOIN products p ON p.id=v.product_id
JOIN comparison_metric_definitions m ON m.id=v.metric_definition_id
SET v.display_value='Cats 2.2–22 lb; minimum 2.2 lb stated for this listing',
    v.source_url='https://www.amazon.com/dp/B0GTM9P94B',
    v.checked_at=NOW(), v.confidence='moderate', v.evidence_status='explicit'
WHERE p.external_id='B0GTM9P94B' AND m.metric_key='minimum_cat_weight';
