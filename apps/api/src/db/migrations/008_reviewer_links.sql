CREATE TABLE reviewer_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES reviewers(id) ON DELETE CASCADE,
    UNIQUE(job_id, reviewer_id)
);