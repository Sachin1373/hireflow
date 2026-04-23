-- Migration: Update reviewer_links to reference users table
-- The original migration pointed to a secondary 'reviewers' table, but the application uses 'users' with role='REVIEWER'.

-- First, drop the existing foreign key constraint if it exists.
-- We need to know the constraint name. Usually it's 'reviewer_links_reviewer_id_fkey'.
ALTER TABLE reviewer_links DROP CONSTRAINT IF EXISTS reviewer_links_reviewer_id_fkey;

-- Now add it back pointing to users(id)
ALTER TABLE reviewer_links 
ADD CONSTRAINT reviewer_links_reviewer_id_fkey 
FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE;
