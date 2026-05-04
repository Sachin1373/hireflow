-- 1. Rename old enum
ALTER TYPE application_status RENAME TO application_status_old;

-- 2. Create new enum
CREATE TYPE application_status AS ENUM (
  'APPLIED',
  'SHORTLISTED',
  'INTERVIEW',
  'REJECTED',
  'HIRED'
);

-- 3. Remove old default
ALTER TABLE applications
ALTER COLUMN status DROP DEFAULT;

-- 4. Convert column to new enum
ALTER TABLE applications
ALTER COLUMN status TYPE application_status
USING (
  CASE
    WHEN status::text = 'SELECTED'
      THEN 'SHORTLISTED'

    WHEN status::text = 'applied'
      THEN 'APPLIED'

    WHEN status::text = 'rejected'
      THEN 'REJECTED'

    ELSE upper(status::text)
  END
)::application_status;

-- 5. Set new default
ALTER TABLE applications
ALTER COLUMN status
SET DEFAULT 'APPLIED';

-- 6. Drop old enum
DROP TYPE application_status_old;