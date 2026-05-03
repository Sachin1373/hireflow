package interview

import "github.com/Sachin1373/hireflow/worker/internal/db"

func GetCandidate(applicationID string) (string, string, error) {

	var email string
	var name string

	err := db.DB.QueryRow(`
		SELECT candidate_email, candidate_name
		FROM applications
		WHERE id = $1
	`, applicationID).Scan(&email, &name)

	if err != nil {
		return "", "", err
	}

	return email, name, nil
}

func GetReviewer(reviewerID string) (string, string, error) {

	var email string
	var name string

	err := db.DB.QueryRow(`
		SELECT email, first_name
		FROM users
		WHERE id = $1
	`, reviewerID).Scan(&email, &name)

	if err != nil {
		return "", "", err
	}

	return email, name, nil
}

func InsertInterview(jobID, appID, reviewerID, meetLink string) error {

	_, err := db.DB.Exec(`
		INSERT INTO interviews (
			job_id,
			application_id,
			reviewer_id,
			meet_link,
			status
		)
		VALUES ($1, $2, $3, $4, 'SCHEDULED')
	`,
		jobID, appID, reviewerID, meetLink,
	)

	return err
}
