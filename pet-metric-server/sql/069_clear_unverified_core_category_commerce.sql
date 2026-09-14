SET NAMES utf8mb4;

UPDATE categories
SET top_score=NULL, price_range='Prices vary; check Amazon listing'
WHERE slug IN ('pet-grooming-tools','pet-waste-cleanup','pet-walking-safety');
