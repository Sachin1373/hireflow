CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL UNIQUE REFERENCES assignments(id) ON DELETE CASCADE,
    decision VARCHAR(10) NOT NULL,
    notes TEXT,
    reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);