CREATE TABLE interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    job_id UUID NOT NULL,
    application_id UUID NOT NULL,
    reviewer_id UUID NOT NULL,

    meet_link TEXT NOT NULL,

    scheduled_at TIMESTAMP NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED'
        CHECK (status IN ('SCHEDULED', 'COMPLETED', 'SELECTED', 'REJECTED')),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_interview_job
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,

    CONSTRAINT fk_interview_application
        FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,

    CONSTRAINT fk_interview_reviewer
        FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE
);