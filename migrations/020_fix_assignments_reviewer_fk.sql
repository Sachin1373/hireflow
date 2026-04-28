-- Migration: Update assignments.reviewer_id to reference users table
-- The application treats reviewers as entries in the users table (role='REVIEWER').
-- Ensure the assignments table's reviewer_id FK points to users(id) to avoid FK violations

-- Drop existing constraint if it references the old reviewers table
ALTER TABLE assignments DROP CONSTRAINT IF EXISTS assignments_reviewer_id_fkey;

-- Add constraint pointing to users(id)
ALTER TABLE assignments
  ADD CONSTRAINT assignments_reviewer_id_fkey
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE;

-- Optional: create an index if not present (Postgres automatically indexes FKs on primary keys but keep for clarity)
CREATE INDEX IF NOT EXISTS idx_assignments_reviewer_id ON assignments(reviewer_id);
