SET NAMES utf8mb4;

/* Category cards use the primary image from a representative Amazon listing.
   Keep image_key NULL so an old R2 placeholder cannot override the Amazon fallback. */
UPDATE categories
SET image_url='https://m.media-amazon.com/images/I/71ntBUTlBLL._AC_UL320_.jpg',
    image_key=NULL,
    alt_text='Oneisall cordless pet grooming clipper on an Amazon product listing'
WHERE slug='pet-grooming-tools';

UPDATE categories
SET image_url='https://m.media-amazon.com/images/I/71im5wfSL+L._AC_UL320_.jpg',
    image_key=NULL,
    alt_text='Litter Genie cat litter waste pail on an Amazon product listing'
WHERE slug='pet-waste-cleanup';

UPDATE categories
SET image_url='https://m.media-amazon.com/images/I/61O2JBTwAiL._AC_UL320_.jpg',
    image_key=NULL,
    alt_text='Ruffwear Front Range dog harness on an Amazon product listing'
WHERE slug='pet-walking-safety';
