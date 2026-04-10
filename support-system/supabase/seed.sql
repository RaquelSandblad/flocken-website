-- =============================================================================
-- SEED DATA - Lägg till appar och testdata
-- =============================================================================
--
-- Kör denna EFTER schema.sql
--
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Lägg till appar
-- -----------------------------------------------------------------------------

INSERT INTO apps (name, display_name) VALUES
    ('flocken', 'Flocken - Hundappen'),
    ('nastahem', 'Nästa Hem')
ON CONFLICT (name) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Testärenden (ta bort i produktion eller kör inte denna del)
-- -----------------------------------------------------------------------------

-- Hämta app_id för Flocken
DO $$
DECLARE
    v_flocken_app_id UUID;
BEGIN
    SELECT id INTO v_flocken_app_id FROM apps WHERE name = 'flocken';

    -- Testärende 1: Emergency - radera konto
    INSERT INTO issues (
        app_id, user_email, description, device_info, app_version,
        ai_priority, ai_needs_response, ai_summary, ai_category, ai_classified_at, status
    ) VALUES (
        v_flocken_app_id,
        'test@example.com',
        'Jag vill radera mitt konto men knappen fungerar inte. Jag har försökt flera gånger. Snälla hjälp mig ta bort all min data!',
        '{"platform": "ios", "os_version": "17.2", "device_model": "iPhone 14"}',
        '1.2.3',
        'emergency',
        true,
        'Användare kan inte radera konto - GDPR-relaterat, kräver manuell hantering',
        'account_deletion',
        NOW(),
        'new'
    );

    -- Testärende 2: Medium - bugg
    INSERT INTO issues (
        app_id, user_email, description, device_info, app_version,
        ai_priority, ai_needs_response, ai_summary, ai_category, ai_classified_at, status
    ) VALUES (
        v_flocken_app_id,
        NULL,
        'Listan med hundar laddar väldigt långsamt. Tar typ 10 sekunder varje gång.',
        '{"platform": "android", "os_version": "14", "device_model": "Samsung S23"}',
        '1.2.3',
        'medium',
        false,
        'Prestandaproblem med hundlistan - behöver undersökas men ingen direkt återkoppling krävs',
        'performance',
        NOW(),
        'new'
    );

    -- Testärende 3: Low - feature request
    INSERT INTO issues (
        app_id, description, device_info, app_version,
        ai_priority, ai_needs_response, ai_summary, ai_category, ai_classified_at, status
    ) VALUES (
        v_flocken_app_id,
        'Det vore kul om man kunde se vilka hundar som är online just nu!',
        '{"platform": "ios", "os_version": "16.5", "device_model": "iPhone 12"}',
        '1.2.2',
        'low',
        false,
        'Feature request: visa online-status för hundar',
        'feature_request',
        NOW(),
        'new'
    );

END $$;

-- -----------------------------------------------------------------------------
-- Visa resultat
-- -----------------------------------------------------------------------------
SELECT
    'Apps' AS table_name,
    COUNT(*) AS count
FROM apps
UNION ALL
SELECT
    'Issues' AS table_name,
    COUNT(*) AS count
FROM issues;
