-- 1. Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Update user_role enum (adding ADMIN)
-- Note: ALTER TYPE ADD VALUE cannot run inside a transaction block in some PG versions.
-- migrate.ts runs these as separate commands, so it should be fine.
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'ADMIN';

-- 3. Add org_id to users and other tables
ALTER TABLE users ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{"read": true, "write": false}'::jsonb;

-- 4. Add org_id to key tables for multi-tenancy
ALTER TABLE reviewers ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);
ALTER TABLE applications ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);

-- 5. Set default permissions for existing types (if any)
UPDATE users SET permissions = '{"read": true, "write": true}'::jsonb WHERE role = 'ADMIN';
