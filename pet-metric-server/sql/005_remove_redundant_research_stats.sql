-- All homepage research statistics now come from their authoritative business tables.
DELETE FROM site_settings WHERE setting_key = 'research_stats';
