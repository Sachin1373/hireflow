
-- Add slug for public shareable links
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS slug VARCHAR(100) UNIQUE;
-- Add updated_at for tracking edits
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
-- Add options (for select/dropdown fields) and placeholder to form_fields
ALTER TABLE form_fields ADD COLUMN IF NOT EXISTS options JSONB DEFAULT '[]';
ALTER TABLE form_fields ADD COLUMN IF NOT EXISTS placeholder VARCHAR(255);