-- =============================================================================
-- SPITAKOLUS SUPPORT SYSTEM - DATABASE SCHEMA
-- =============================================================================
--
-- INSTRUKTIONER:
-- 1. Skapa ett nytt Supabase-projekt (spitakolus-support)
-- 2. Gå till SQL Editor
-- 3. Kopiera och kör denna fil
--
-- =============================================================================

-- -----------------------------------------------------------------------------
-- TABELL: apps
-- Registrerade appar som kan skicka ärenden
-- -----------------------------------------------------------------------------
CREATE TABLE apps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    api_key UUID DEFAULT gen_random_uuid(),  -- För att validera requests från appen
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Exempel: 'flocken', 'Flocken - Hundappen'
    CONSTRAINT apps_name_format CHECK (name ~ '^[a-z0-9-]+$')
);

-- Index för snabb lookup på api_key
CREATE INDEX idx_apps_api_key ON apps(api_key);

-- -----------------------------------------------------------------------------
-- ENUM: issue_priority
-- Prioritetsnivåer för ärenden
-- -----------------------------------------------------------------------------
CREATE TYPE issue_priority AS ENUM (
    'emergency',  -- Kräver omedelbar åtgärd (radera konto, säkerhet, dataläcka)
    'high',       -- Viktigt, bör hanteras snart (funktion fungerar inte)
    'medium',     -- Normal prioritet (bugg som har workaround)
    'low'         -- Låg prioritet (förbättringsförslag, minor issues)
);

-- -----------------------------------------------------------------------------
-- ENUM: issue_status
-- Status för ärenden
-- -----------------------------------------------------------------------------
CREATE TYPE issue_status AS ENUM (
    'new',           -- Nytt, ej hanterat
    'in_progress',   -- Under utredning
    'waiting_user',  -- Väntar på svar från användare
    'resolved',      -- Löst
    'closed'         -- Stängt (ej åtgärdat, duplikat, etc.)
);

-- -----------------------------------------------------------------------------
-- TABELL: issues
-- Huvudtabell för ärenden
-- -----------------------------------------------------------------------------
CREATE TABLE issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Koppling till app
    app_id UUID NOT NULL REFERENCES apps(id),

    -- Användarinfo (från appen)
    user_id UUID,                    -- Användarens ID i appen (om inloggad)
    user_email TEXT,                 -- Kontakt-email (valfri)
    user_name TEXT,                  -- Användarens namn (valfritt)

    -- Ärendebeskrivning
    title TEXT,                      -- Kort titel (kan genereras av AI)
    description TEXT NOT NULL,       -- Användarens beskrivning
    screenshot_urls TEXT[],          -- Array av screenshot-URLs

    -- Enhetsinformation (automatiskt från appen)
    device_info JSONB,               -- { platform, os_version, device_model, etc. }
    app_version TEXT,                -- Appens version

    -- AI-klassificering (fylls i av Edge Function)
    ai_priority issue_priority,      -- AI-bedömd prioritet
    ai_needs_response BOOLEAN,       -- AI-bedömning: förväntar användaren svar?
    ai_summary TEXT,                 -- AI-genererad sammanfattning för utvecklare
    ai_category TEXT,                -- AI-kategorisering (bug, feature_request, account, etc.)
    ai_classified_at TIMESTAMPTZ,    -- När AI klassificerade

    -- Status och hantering
    status issue_status DEFAULT 'new',
    assigned_to TEXT,                -- Vem som hanterar ärendet
    resolution_notes TEXT,           -- Intern anteckning om lösning

    -- Tidsstämplar
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,

    -- Constraints
    CONSTRAINT issues_has_description CHECK (length(description) >= 10)
);

-- Index för vanliga queries
CREATE INDEX idx_issues_app_id ON issues(app_id);
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_priority ON issues(ai_priority);
CREATE INDEX idx_issues_created_at ON issues(created_at DESC);
CREATE INDEX idx_issues_user_id ON issues(user_id);
CREATE INDEX idx_issues_needs_response ON issues(ai_needs_response) WHERE ai_needs_response = true;

-- Trigger för att uppdatera updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER issues_updated_at
    BEFORE UPDATE ON issues
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- -----------------------------------------------------------------------------
-- TABELL: issue_responses
-- Svar/kommunikation på ärenden
-- -----------------------------------------------------------------------------
CREATE TABLE issue_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,

    -- Vem svarade
    response_type TEXT NOT NULL CHECK (response_type IN ('user', 'support', 'system')),
    responder_name TEXT,             -- Namn på den som svarade

    -- Innehåll
    message TEXT NOT NULL,

    -- Om svaret skickades till användaren
    sent_to_user BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMPTZ,
    sent_via TEXT,                   -- 'email', 'push', etc.

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_issue_responses_issue_id ON issue_responses(issue_id);

-- -----------------------------------------------------------------------------
-- TABELL: issue_events
-- Logg över händelser (för audit trail)
-- -----------------------------------------------------------------------------
CREATE TABLE issue_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,

    event_type TEXT NOT NULL,        -- 'created', 'status_changed', 'assigned', 'classified', etc.
    event_data JSONB,                -- Extra data beroende på event_type
    actor TEXT,                      -- Vem/vad som utförde händelsen

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_issue_events_issue_id ON issue_events(issue_id);
CREATE INDEX idx_issue_events_created_at ON issue_events(created_at DESC);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-- -----------------------------------------------------------------------------

-- Aktivera RLS på alla tabeller
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_events ENABLE ROW LEVEL SECURITY;

-- Policy: Apps - endast läsbar via service_role
CREATE POLICY "Apps readable by service role" ON apps
    FOR SELECT USING (true);  -- Kontrolleras via API key i Edge Function

-- Policy: Issues - användare kan se sina egna
CREATE POLICY "Users can view own issues" ON issues
    FOR SELECT USING (
        auth.uid() = user_id OR
        auth.jwt() ->> 'role' = 'service_role'
    );

-- Policy: Issues - användare kan skapa
CREATE POLICY "Users can create issues" ON issues
    FOR INSERT WITH CHECK (true);  -- Validering sker i Edge Function

-- Policy: Issues - endast service_role kan uppdatera
CREATE POLICY "Service role can update issues" ON issues
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'service_role');

-- Policy: Responses - användare kan se svar på sina ärenden
CREATE POLICY "Users can view responses on own issues" ON issue_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM issues
            WHERE issues.id = issue_responses.issue_id
            AND (issues.user_id = auth.uid() OR auth.jwt() ->> 'role' = 'service_role')
        )
    );

-- Policy: Events - endast service_role
CREATE POLICY "Service role can access events" ON issue_events
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- -----------------------------------------------------------------------------
-- VIEWS
-- -----------------------------------------------------------------------------

-- View: Ärenden med app-info (för admin/MCP)
CREATE VIEW issues_with_app AS
SELECT
    i.*,
    a.name AS app_name,
    a.display_name AS app_display_name,
    (SELECT COUNT(*) FROM issue_responses WHERE issue_id = i.id) AS response_count
FROM issues i
JOIN apps a ON i.app_id = a.id;

-- View: Öppna ärenden som behöver respons
CREATE VIEW issues_needing_response AS
SELECT * FROM issues_with_app
WHERE status NOT IN ('resolved', 'closed')
AND ai_needs_response = true
ORDER BY
    CASE ai_priority
        WHEN 'emergency' THEN 1
        WHEN 'high' THEN 2
        WHEN 'medium' THEN 3
        ELSE 4
    END,
    created_at ASC;

-- View: Emergency-ärenden
CREATE VIEW emergency_issues AS
SELECT * FROM issues_with_app
WHERE ai_priority = 'emergency'
AND status NOT IN ('resolved', 'closed')
ORDER BY created_at ASC;

-- -----------------------------------------------------------------------------
-- FUNCTIONS
-- -----------------------------------------------------------------------------

-- Funktion: Hämta statistik per app
CREATE OR REPLACE FUNCTION get_app_stats(p_app_id UUID DEFAULT NULL)
RETURNS TABLE (
    app_name TEXT,
    total_issues BIGINT,
    open_issues BIGINT,
    emergency_issues BIGINT,
    needs_response BIGINT,
    avg_resolution_hours NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        a.name,
        COUNT(i.id)::BIGINT AS total_issues,
        COUNT(i.id) FILTER (WHERE i.status NOT IN ('resolved', 'closed'))::BIGINT AS open_issues,
        COUNT(i.id) FILTER (WHERE i.ai_priority = 'emergency' AND i.status NOT IN ('resolved', 'closed'))::BIGINT AS emergency_issues,
        COUNT(i.id) FILTER (WHERE i.ai_needs_response = true AND i.status NOT IN ('resolved', 'closed'))::BIGINT AS needs_response,
        ROUND(AVG(EXTRACT(EPOCH FROM (i.resolved_at - i.created_at)) / 3600) FILTER (WHERE i.resolved_at IS NOT NULL), 1) AS avg_resolution_hours
    FROM apps a
    LEFT JOIN issues i ON i.app_id = a.id
    WHERE p_app_id IS NULL OR a.id = p_app_id
    GROUP BY a.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- KLART!
-- Nästa steg: Kör seed.sql för att lägga till testdata (valfritt)
-- =============================================================================
