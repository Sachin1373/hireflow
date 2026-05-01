-- Create job_status enum and migrate jobs.status to use the enum
DO $$
BEGIN
    -- Create enum type if not exists
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_status') THEN
        CREATE TYPE job_status AS ENUM (
            'DRAFT',
            'PUBLISHED',
            'APPLICATION_CLOSED',
            'UNDER_REVIEW',
            'REVIEW_CLOSED',
            'COMPLETED'
        );
    END IF;
END$$;

-- Normalize existing free-text status values to the new enum values
-- Map: 'draft' -> 'DRAFT', 'active' -> 'PUBLISHED', NULL -> 'DRAFT'
UPDATE jobs SET status = 'DRAFT' WHERE status IS NULL;
UPDATE jobs SET status = 'DRAFT' WHERE LOWER(status) = 'draft';
UPDATE jobs SET status = 'PUBLISHED' WHERE LOWER(status) = 'active';

-- Alter the column to use the enum type. Use text cast as intermediary when needed.
-- Drop existing default first (prevents automatic cast errors), then alter the column to use the enum type.
ALTER TABLE jobs ALTER COLUMN status DROP DEFAULT;

ALTER TABLE jobs
    ALTER COLUMN status TYPE job_status USING (
            CASE
                WHEN LOWER(status::text) = 'draft' THEN 'DRAFT'::job_status
                WHEN LOWER(status::text) = 'active' THEN 'PUBLISHED'::job_status
                WHEN LOWER(status::text) = 'submitted' THEN 'PUBLISHED'::job_status
                WHEN LOWER(status::text) = 'closed' THEN 'COMPLETED'::job_status
                WHEN status::text = '' THEN 'DRAFT'::job_status
                ELSE
                    -- Last resort: try to map the uppercase text to enum where it already matches
                    CASE WHEN UPPER(status::text) IN ('DRAFT','PUBLISHED','APPLICATION_CLOSED','UNDER_REVIEW','REVIEW_CLOSED','COMPLETED')
                         THEN UPPER(status::text)::job_status
                         ELSE 'DRAFT'::job_status
                    END
            END
    );

-- Set default to DRAFT
ALTER TABLE jobs ALTER COLUMN status SET DEFAULT 'DRAFT';

-- Add review duration and review_expires_at fields
ALTER TABLE jobs
    ADD COLUMN IF NOT EXISTS review_duration_days INTEGER DEFAULT 3,
    ADD COLUMN IF NOT EXISTS review_expires_at TIMESTAMPTZ;

-- Backfill review_expires_at where possible: form_expires_at + review_duration_days
UPDATE jobs
SET review_expires_at = (form_expires_at AT TIME ZONE 'UTC') + (review_duration_days || ' days')::interval
WHERE form_expires_at IS NOT NULL;

-- Note: future logic in application will set review_expires_at when assignments are created or when job is published/updated
