CREATE TABLE shortlist_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL UNIQUE REFERENCES jobs(id) ON DELETE CASCADE,
    min_experience_years INT DEFAULT 0,
    required_skills JSONB DEFAULT '[]',
    location VARCHAR(255),
    max_notice_period_days INT
);