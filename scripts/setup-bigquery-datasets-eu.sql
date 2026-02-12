-- Skapa Datasets i EU Location för Flocken
-- Project: nastahem-tracking
-- Location: EU (multi-region) - samma som GA4 export
-- 
-- Kör detta först innan du skapar views/tables

-- ============================================
-- Skapa Datasets i EU Location
-- ============================================

-- Dataset: flocken_curated (Processed and standardized data)
CREATE SCHEMA IF NOT EXISTS `nastahem-tracking.flocken_curated`
OPTIONS(
  description="Processed and standardized GA4 data för Flocken. Data är cleaned och ready för analysis.",
  location="EU"
);

-- Dataset: flocken_marts (Business intelligence ready metrics)
CREATE SCHEMA IF NOT EXISTS `nastahem-tracking.flocken_marts`
OPTIONS(
  description="Pre-calculated business metrics för Flocken. Optimized för dashboard queries.",
  location="EU"
);

-- ============================================
-- Kommentarer
-- ============================================
--
-- Detta skapar datasets i EU location (samma som analytics_518338757)
-- När datasets är skapade, kör setup-bigquery-views-flocken.sql
-- 
-- Om gamla datasets (europe-west1) finns:
-- 1. Skapa views/tables i nya datasets (EU)
-- 2. Verifiera att allt fungerar
-- 3. Ta bort gamla datasets när allt fungerar
--

