package review

import (
	"context"

	"github.com/Sachin1373/hireflow/worker/internal/db"
)

func GetJobsReadyForInterview(ctx context.Context) ([]string, error) {
	rows, err := db.DB.QueryContext(ctx, `
		SELECT id
		FROM jobs
		WHERE review_expires_at <= NOW()
		AND assignment_processed = true
		AND interview_processed = false
	`)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var jobIDs []string

	for rows.Next() {
		var jobID string

		if err := rows.Scan(&jobID); err != nil {
			return nil, err
		}

		jobIDs = append(jobIDs, jobID)
	}

	return jobIDs, nil
}

func GetShortlistedApplications(ctx context.Context, jobId string) ([]string, error) {
	rows, err := db.DB.QueryContext(ctx, `
		SELECT id
		FROM applications
		WHERE job_id = $1
		AND status = 'SHORTLISTED'
	`, jobId)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var appIDs []string

	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return nil, err
		}
		appIDs = append(appIDs, id)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return appIDs, nil
}

func GetReviewers(ctx context.Context, jobId string) ([]string, error) {

	rows, err := db.DB.QueryContext(ctx, `
		SELECT reviewer_id
		FROM reviewer_links
		WHERE job_id = $1
	`, jobId)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var reviewerIDs []string

	for rows.Next() {
		var id string

		if err := rows.Scan(&id); err != nil {
			return nil, err
		}

		reviewerIDs = append(reviewerIDs, id)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return reviewerIDs, nil
}

func MarkInterviewTriggered(ctx context.Context, jobID string) error {

	_, err := db.DB.ExecContext(ctx, `
		UPDATE jobs
		SET interview_processed = true
		WHERE id = $1
	`, jobID)

	return err
}

func UpdateApplicationStatus(
	ctx context.Context,
	appID string,
	status string,
) error {

	_, err := db.DB.ExecContext(
		ctx,
		`
		UPDATE applications
		SET status = $2
		WHERE id = $1
		`,
		appID,
		status,
	)

	return err
}
