-- =============================================================================
-- FLOCKEN QUIZ SUBSCRIBERS
-- =============================================================================
--
-- Kör i SQL Editor på spitakolus-support Supabase-projektet.
-- Samlar e-postadresser från quiz.flocken.info för notifikationer om nya quiz.
--
-- =============================================================================

CREATE TABLE IF NOT EXISTS flocken_quiz_subscribers (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    email       TEXT        NOT NULL,
    quiz_slug   TEXT,                       -- Vilket quiz de avslutade (t.ex. 'hundraser-quiz')
    created_at  TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT flocken_quiz_subscribers_email_unique UNIQUE (email),
    CONSTRAINT flocken_quiz_subscribers_email_format CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

CREATE INDEX IF NOT EXISTS idx_flocken_quiz_subscribers_email
    ON flocken_quiz_subscribers(email);

CREATE INDEX IF NOT EXISTS idx_flocken_quiz_subscribers_created_at
    ON flocken_quiz_subscribers(created_at DESC);

-- RLS: Publikt INSERT (via API-route med service_role), ingen läsning från klienten
ALTER TABLE flocken_quiz_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access"
    ON flocken_quiz_subscribers
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- =============================================================================
-- TABELL: flocken_email_jobs
-- Kö för schemalagda e-postutskick (sekvenser, dag 3, dag 7 etc.)
-- Körs via Vercel Cron Job varje timme.
-- =============================================================================

CREATE TABLE IF NOT EXISTS flocken_email_jobs (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    email           TEXT        NOT NULL,
    template_key    TEXT        NOT NULL,
    template_params JSONB       DEFAULT '{}',
    send_after      TIMESTAMPTZ NOT NULL,
    sent_at         TIMESTAMPTZ,
    status          TEXT        NOT NULL DEFAULT 'pending'
                                CHECK (status IN ('pending', 'sent', 'failed')),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_flocken_email_jobs_pending
    ON flocken_email_jobs(send_after)
    WHERE status = 'pending';

ALTER TABLE flocken_email_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on jobs"
    ON flocken_email_jobs
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- =============================================================================
-- KLART! Kör hela denna fil i Supabase SQL Editor.
-- =============================================================================
