-- Add new columns
ALTER TABLE users
ADD COLUMN first_name VARCHAR(255),
ADD COLUMN last_name VARCHAR(255),
ADD COLUMN role VARCHAR(20);

-- Make first_name NOT NULL
ALTER TABLE users
ALTER COLUMN first_name SET NOT NULL;

-- Create ENUM
CREATE TYPE user_role AS ENUM ('HR', 'REVIEWER');

ALTER TABLE users
ALTER COLUMN role TYPE user_role
USING role::user_role;

-- Drop old column
ALTER TABLE users
DROP COLUMN name;