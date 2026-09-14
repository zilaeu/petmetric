/* Keep the Granary card buyer-focused after the broader listing-copy migration. */
SET NAMES utf8mb4;

UPDATE products SET
  verdict='A useful fit for busy cat or small-dog owners who want frequent scheduled portions and remote control. The 5-liter hopper reduces refill frequency, but Amazon offers can vary between camera and non-camera versions, and very large kibble may feed less consistently.'
WHERE slug='petlibro-granary';
