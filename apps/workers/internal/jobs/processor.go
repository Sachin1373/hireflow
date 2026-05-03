package jobs

import (
	"context"
	"log"
	"time"

	"github.com/Sachin1373/hireflow/worker/internal/config"
	"github.com/Sachin1373/hireflow/worker/internal/db"
	"github.com/Sachin1373/hireflow/worker/internal/mailer"
	"github.com/Sachin1373/hireflow/worker/internal/utils"
)

func ProcessExpiredJobs(ctx context.Context, cfg *config.Config) error {
	jobIDs, err := GetExpiredJobs(ctx)
	if err != nil {
		return err
	}

	for _, jobID := range jobIDs {
		select {
		case <-ctx.Done():
			log.Println("stopping expired jobs processing")
			return ctx.Err()

		default:
		}

		log.Println("processing job:", jobID)

		// TODO:
		// fetch applications
		appIds, err := GetApplications(ctx, jobID)
		if err != nil {
			log.Println("error fetching applications")
		}
		// fetch reviewers
		reviewerIds, err := GetReviewers(ctx, jobID)
		if err != nil {
			log.Println("error fetching reviewerIds")
		}
		// assign equally
		assignments := utils.Distribute(appIds, reviewerIds)
		// save assignments
		err = AssignReviewers(ctx, assignments, jobID)
		if err != nil {
			log.Println("error assigning reviewers:", err)
			continue
		}

		jobTitle, err := GetJobTitle(ctx, jobID)

		if err != nil {
			log.Println(
				"error fetching job title:",
				err,
			)
			continue
		}

		for reviewerIds, apps := range assignments {
			email, name, err := GetReviewerDetails(ctx, reviewerIds)

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

			emailCtx, cancel := context.WithTimeout(ctx, 10*time.Second)

			err = mailer.SendReviewAssignmentEmail(
				emailCtx,
				cfg,
				email,
				name,
				jobTitle,
				cfg.CLIENT_URL,
			)

			cancel()

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
