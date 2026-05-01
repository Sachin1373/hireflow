package jobs

import (
	"log"

	"github.com/Sachin1373/hireflow/worker/internal/config"
	"github.com/Sachin1373/hireflow/worker/internal/db"
	"github.com/Sachin1373/hireflow/worker/internal/mailer"
)

func ProcessExpiredJobs(cfg *config.Config) error {
	jobIDs, err := GetExpiredJobs()
	if err != nil {
		return err
	}

	for _, jobID := range jobIDs {
		log.Println("processing job:", jobID)

		// TODO:
		// fetch applications
		appIds, err := GetApplications(jobID)
		if err != nil {
			log.Fatal("error fetching applications")
		}
		// fetch reviewers
		reviewerIds, err := GetReviewers(jobID)
		if err != nil {
			log.Fatal("error fetching reviewerIds")
		}
		// assign equally
		assignments := distribute(appIds, reviewerIds)
		// save assignments
		err = AssignReviewers(assignments, jobID)
		if err != nil {
			log.Println("error assigning reviewers:", err)
			continue
		}

		jobTitle, err := GetJobTitle(jobID)

		if err != nil {
			log.Println(
				"error fetching job title:",
				err,
			)
			continue
		}

		for reviewerIds, apps := range assignments {
			email, name, err := GetReviewerDetails(reviewerIds)

			if err != nil {
				log.Println(
					"error fetching reviewer details:",
					err,
				)
				continue
			}

			log.Println(
				"attempting email to:",
				email,
			)

			err = mailer.SendReviewAssignmentEmail(
				cfg,
				email,
				name,
				jobTitle,
				cfg.CLIENT_URL,
			)

			if err != nil {
				log.Printf(
					"EMAIL SEND FAILED | reviewer=%s | email=%s | err=%v",
					name,
					email,
					err,
				)
				continue
			}

			log.Printf(
				"email sent to reviewer %s for %d applications",
				email,
				len(apps),
			)
		}

		// mark processed
		_, err = db.DB.Exec(`
			UPDATE jobs
			SET assignment_processed = true
			WHERE id = $1
		`, jobID)

		if err != nil {
			log.Println("error marking job processed:", err)
			continue
		}
	}

	return nil
}

func distribute(applications []string, reviewers []string) map[string][]string {
	assignments := make(map[string][]string)

	if len(reviewers) == 0 {
		return assignments
	}

	for i, app := range applications {
		reviewer := reviewers[i%len(reviewers)]

		assignments[reviewer] = append(assignments[reviewer], app)
	}

	return assignments

}
