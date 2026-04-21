export type JobStatus = 'draft' | 'active' | 'closed'
export type ApplicationStatus = 'applied' | 'shortlisted' | 'rejected' | 'under_review' | 'selected'
export type ReviewDecision = 'yes' | 'no'
export type FieldType = 'text' | 'email' | 'phone' | 'number' | 'select' | 'file' | 'textarea'

export interface User {
  id: string
  name: string
  email: string
  created_at: string
}

export interface Job {
  id: string
  user_id: string
  title: string
  description: string
  jd_content: string
  form_expires_at: string
  status: JobStatus
  created_at: string
  slug: string
  org_id: string
  updated_at: string
}

export interface ShortlistConfig {
  id: string
  job_id: string
  min_experience_years: number
  required_skills: string[]
  location: string
  max_notice_period_days: number
}

export interface FormField {
  id: string
  job_id: string
  field_type: FieldType
  label: string
  required: boolean
  position: number
  options: string[]
  placeholder: string
}

export interface Application {
  id: string
  job_id: string
  candidate_name: string
  candidate_email: string
  candidate_phone: string
  resume_url: string
  status: ApplicationStatus
  applied_at: string
}

export interface Reviewer {
  id: string
  created_by: string
  name: string
  email: string
  designation: string
}

export interface Assignment {
  id: string
  application_id: string
  reviewer_id: string
  assigned_at: string
}

export interface Review {
  id: string
  assignment_id: string
  decision: ReviewDecision
  notes: string
  reviewed_at: string
}