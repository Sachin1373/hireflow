package jobs

import "github.com/Sachin1373/hireflow/worker/internal/db"

func GetExpiredJobs() ([]string, error) {
	rows, err := db.DB.Query(`
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

func GetApplications(job_id string) ([]string, error) {
	rows, err := db.DB.Query(`
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

func GetReviewers(job_id string) ([]string, error) {
	rows, err := db.DB.Query(`
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
