# HireFlow: Project Objective and Implementation Plan

## Product Vision
HireFlow is a hiring workflow product for HR teams to streamline off-campus hiring with a simple and practical process:
- Create jobs quickly
- Collect candidate applications through a shareable form
- Manage review stages with HR and reviewers
- Move candidates through clear pipeline stages

The primary goal is to build a robust system without unnecessary complexity in the initial versions.

## Core Objective
Build a reliable end-to-end hiring flow where:
1. HR creates a job
2. HR configures candidate application form and expiry
3. HR assigns reviewers
4. A public application link is generated and shared
5. Candidates apply
6. System/process classifies candidates into stages
7. Reviewers review shortlisted candidates (Yes/No)
8. HR proceeds with selected candidates and communication

## Current Product Direction
Initial idea included first-level shortlisting configuration during job creation (experience, skills, location, notice period filters).  
This has been removed for now to keep the MVP lean and easier to implement.

It can be reintroduced later as an advanced module.

## User Roles
- **HR/Admin**
  - Create and submit jobs
  - Configure forms and expiry
  - Add reviewers (manual + CSV bulk upload)
  - Assign candidates to reviewers
  - Trigger candidate communication
- **Reviewer**
  - Receive assigned candidates
  - Review resumes
  - Submit review decision (Yes/No)
- **Candidate (public user)**
  - Open shared job link
  - Fill application form
  - Submit before expiry

## High-Level Workflow
1. **HR Signup/Login**
2. **Job Creation (multi-step)**
   - Step 1: Job title, description, JD editor
   - Step 2: Application form fields (Google Form style)
   - Step 3: Assign reviewers
   - Step 4: Preview + submit (set expiry)
3. **Public Link Generation**
4. **Candidate Application Collection**
5. **Post-expiry Processing**
   - Move profiles through stages (`applied`, `shortlisted`, `rejected`)
6. **Reviewer Evaluation Stage**
   - Assign candidates to reviewers (manual/equal distribution)
   - Review decisions
   - Candidate stage updates (`under_review`, `selected`)
7. **HR Communication**
   - Email templates
   - Bulk send for next rounds

## Candidate Pipeline Stages (initial)
- `applied`
- `shortlisted`
- `rejected`
- `under_review`
- `selected`

## MVP Scope (Recommended)
Keep first release small and stable:

### In Scope
- HR auth and organization-based access
- Job creation (4-step flow)
- Form expiry support
- Public application form page
- Candidate submission storage
- Reviewer management (manual + CSV)
- Reviewer assignment to job
- Basic reviewer Yes/No review flow
- Pipeline listing by stage

### Out of Scope (Phase 2+)
- Advanced rule engine for first-level auto-shortlisting
- Automatic interviewer scheduling
- Round-wise interview orchestration
- Auto meet-link generation
- Deep email automation workflows

## Suggested Architecture (Current Stack)
- **Frontend**: React + TypeScript
- **API Layer**: Node.js + Express
- **Services/Workers**: Go (Gin) for scheduled/background processing
- **Database**: PostgreSQL (SQL)

## Service Responsibility Split
- **Node API**
  - CRUD, auth, role checks, main business APIs
  - Job, reviewer, application, review endpoints
- **Go Service**
  - Expiry-based scheduled jobs
  - Bulk processing (classification, assignment helpers, email worker)
  - Future automation extensions

## Data and Entity Notes
Core entities:
- `users` (includes HR/Admin/Reviewer roles)
- `jobs`
- `form_fields`
- `applications`
- `app_responses`
- `reviewer_links`
- `assignments`
- `reviews`
- `email_logs`

## Implementation Milestones
1. **Milestone 1: Job + Form + Reviewer setup**
   - Complete multi-step job creation and submission
2. **Milestone 2: Public form + application ingestion**
   - Public link page and candidate response persistence
3. **Milestone 3: Pipeline + review workflow**
   - Stage tracking and reviewer Yes/No flow
4. **Milestone 4: Background processing**
   - Expiry jobs, shortlist/reject processing, notifications
5. **Milestone 5: Communication tooling**
   - Email template and bulk send integration

## Simplicity Principles
- Prefer clear, manual-first workflow over premature automation
- Keep each module independently testable
- Add automation only after manual flow is stable
- Avoid feature creep in MVP

## Future Enhancements (Optional)
- Reintroduce first-level filter configuration with weighted scoring
- Auto-equal distribution of candidates to reviewers
- Interview round planner
- Calendar + meet link integration
- Analytics dashboard (conversion by stage, reviewer throughput)

## Working Note
This file is the reference implementation objective and can be updated as product decisions evolve.
