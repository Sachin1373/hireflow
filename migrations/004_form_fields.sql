CREATE TABLE form_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    field_type VARCHAR(50) NOT NULL,
    label VARCHAR(255) NOT NULL,
    required BOOLEAN DEFAULT FALSE,
    position INT DEFAULT 0
);