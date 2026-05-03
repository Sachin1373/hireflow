package jobs

import (
	"context"

	"github.com/Sachin1373/hireflow/worker/internal/db"
)

func GetExpiredJobs(ctx context.Context) ([]string, error) {
	rows, err := db.DB.QueryContext(ctx, `
		SELECT id
		FROM jobs
		WHERE form_expires_at <= NOW()
		AND assignment_processed = false
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

func GetApplications(ctx context.Context, job_id string) ([]string, error) {
	rows, err := db.DB.QueryContext(ctx, `
		SELECT id
		FROM applications
		WHERE job_id = $1
	`, job_id)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var appIDs []string

	for rows.Next() {
		var appID string

		if err := rows.Scan(&appID); err != nil {
			return nil, err
		}

		appIDs = append(appIDs, appID)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return appIDs, nil
}

func GetReviewers(ctx context.Context, job_id string) ([]string, error) {
	rows, err := db.DB.QueryContext(ctx, `
		SELECT reviewer_id
		FROM reviewer_links
		WHERE job_id = $1
	`, job_id)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var reviewersIDs []string

	for rows.Next() {
		var reviewerID string

		if err := rows.Scan(&reviewerID); err != nil {
			return nil, err
		}

		reviewersIDs = append(reviewersIDs, reviewerID)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return reviewersIDs, nil
}

func AssignReviewers(ctx context.Context, assignments map[string][]string, jobID string) error {
	for reviewerID, applicationIDs := range assignments {

		for _, applicationID := range applicationIDs {

			_, err := db.DB.ExecContext(ctx, `
				INSERT INTO assignments (
					application_id,
					reviewer_id,
					job_id
				)
				VALUES ($1, $2, $3)
			`, applicationID, reviewerID, jobID)

			if err != nil {
				return err
			}
		}
	}

	// After creating assignments, update the job status to UNDER_REVIEW and calculate review_expires_at
	_, err := db.DB.ExecContext(ctx, `
		UPDATE jobs
		SET status = $2,
		review_expires_at = CASE
			WHEN form_expires_at IS NOT NULL
			THEN form_expires_at
				+ (COALESCE(review_duration_days, 3) || ' days')::interval
			ELSE NULL
		END
		WHERE id = $1
	`, jobID, "UNDER_REVIEW")

	if err != nil {
		return err
	}

	return nil
}

func GetJobTitle(ctx context.Context, job_id string) (string, error) {
	var title string
	err := db.DB.QueryRowContext(ctx, `SELECT title FROM jobs WHERE id = $1`, job_id).Scan(&title)

	if err != nil {
		return "", err
	}

	return title, nil

}

func GetReviewerDetails(ctx context.Context, reviewerID string) (string, string, error) {
	var email string
	var firstName string

	err := db.DB.QueryRowContext(ctx, `
		SELECT email, first_name
		FROM users
		WHERE id = $1
	`, reviewerID).
		Scan(&email, &firstName)

	if err != nil {
		return "", "", err
	}

	return email, firstName, nil
}
