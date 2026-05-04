CREATE TABLE app_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    form_field_id UUID NOT NULL REFERENCES form_fields(id) ON DELETE CASCADE,
    value TEXT
);