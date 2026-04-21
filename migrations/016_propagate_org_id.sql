-- Migration: Propagate org_id to child tables for robust multi-tenancy
-- This ensures every record is associated with an organization, enabling better security (RLS) and query performance.

-- 1. shortlist_config
ALTER TABLE shortlist_config ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);
CREATE INDEX IF NOT EXISTS idx_shortlist_config_org_id ON shortlist_config(org_id);

-- 2. form_fields
ALTER TABLE form_fields ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);
CREATE INDEX IF NOT EXISTS idx_form_fields_org_id ON form_fields(org_id);

-- 3. app_responses
ALTER TABLE app_responses ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);
CREATE INDEX IF NOT EXISTS idx_app_responses_org_id ON app_responses(org_id);

-- 4. reviewer_links
ALTER TABLE reviewer_links ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);
CREATE INDEX IF NOT EXISTS idx_reviewer_links_org_id ON reviewer_links(org_id);

-- 5. assignments
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);
CREATE INDEX IF NOT EXISTS idx_assignments_org_id ON assignments(org_id);

-- 6. reviews
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);
CREATE INDEX IF NOT EXISTS idx_reviews_org_id ON reviews(org_id);

-- 7. email_logs
ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);
CREATE INDEX IF NOT EXISTS idx_email_logs_org_id ON email_logs(org_id);
