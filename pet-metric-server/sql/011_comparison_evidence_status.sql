SET NAMES utf8mb4;

ALTER TABLE product_metric_values
  ADD COLUMN evidence_status ENUM('explicit','claim','unclear','unsupported') NOT NULL DEFAULT 'unclear' AFTER confidence;

UPDATE product_metric_values
SET evidence_status = CASE
  WHEN display_value LIKE '%listing claim%' THEN 'claim'
  WHEN display_value IN ('Not verified','Not available') THEN 'unclear'
  ELSE 'explicit'
END;
