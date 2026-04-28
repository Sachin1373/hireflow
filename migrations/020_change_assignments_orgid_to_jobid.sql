-- Migration: Change assignments.org_id to assignments.job_id
-- This migration attempts to rename the column if it exists; otherwise it will add the new column.
-- It then ensures a foreign key constraint to jobs(id) and an index on job_id.

-- 1) If an org_id column exists, try to rename it to job_id.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='assignments' AND column_name='org_id'
    ) THEN
        -- Try to rename column org_id to job_id
        ALTER TABLE assignments RENAME COLUMN org_id TO job_id;
    END IF;
END$$;

-- 2) If job_id still doesn't exist, add it (NULLABLE by default). Caller must backfill if needed.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='assignments' AND column_name='job_id'
    ) THEN
        ALTER TABLE assignments ADD COLUMN job_id UUID;
    END IF;
END$$;

-- 3) Drop any old constraint referencing org_id if present (constraint name may vary)
ALTER TABLE assignments DROP CONSTRAINT IF EXISTS assignments_org_id_fkey;

-- 4) Add foreign key constraint to jobs(id)
ALTER TABLE assignments DROP CONSTRAINT IF EXISTS assignments_job_id_fkey;
ALTER TABLE assignments
  ADD CONSTRAINT assignments_job_id_fkey
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE;

-- 5) Create index on job_id to speed up lookups
CREATE INDEX IF NOT EXISTS idx_assignments_job_id ON assignments(job_id);

-- Note: This migration does not attempt to determine the correct job_id values.
-- If you need to backfill job_id from another table or logic, run a separate backfill migration
-- after confirming the correct mapping.
