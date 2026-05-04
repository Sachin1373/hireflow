-- Create ENUM first
CREATE TYPE user_role AS ENUM ('HR', 'REVIEWER', 'ADMIN');

-- Add new columns
ALTER TABLE users
ADD COLUMN first_name VARCHAR(255),
ADD COLUMN last_name VARCHAR(255),
ADD COLUMN role user_role;

-- Populate existing rows
UPDATE users
SET
  first_name = 'Unknown',
  last_name = '',
  role = 'ADMIN'
WHERE first_name IS NULL;

-- Now make first_name required
ALTER TABLE users
ALTER COLUMN first_name SET NOT NULL;

-- Drop old column
ALTER TABLE users
DROP COLUMN name;