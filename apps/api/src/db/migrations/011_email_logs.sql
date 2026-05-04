CREATE TABLE email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    recipient_email VARCHAR(255) NOT NULL,
    template_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    sent_at TIMESTAMP
);