-- 1. Create enum type
CREATE TYPE application_status AS ENUM (
  'APPLIED',
  'SELECTED',
  'REJECTED'
);

-- 2. Remove old default first
ALTER TABLE applications
ALTER COLUMN status DROP DEFAULT;

-- 3. Normalize existing values
UPDATE applications
SET status = UPPER(status);

-- 4. Fallback invalid values
UPDATE applications
SET status = 'APPLIED'
WHERE status NOT IN (
  'APPLIED',
  'SELECTED',
  'REJECTED'
);

-- 5. Convert column to enum
ALTER TABLE applications
ALTER COLUMN status TYPE application_status
USING status::application_status;

-- 6. Add new enum default
ALTER TABLE applications
ALTER COLUMN status SET DEFAULT 'APPLIED';