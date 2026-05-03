package review

import (
	"context"
	"log"
	"time"

	"github.com/Sachin1373/hireflow/worker/internal/config"
	"github.com/Sachin1373/hireflow/worker/internal/interview"
	"github.com/Sachin1373/hireflow/worker/internal/utils"
)

func ProcessReviewCompletion(ctx context.Context, cfg *config.Config) error {

	jobIDs, err := GetJobsReadyForInterview(ctx)
	if err != nil {
		return err
	}

	for _, jobID := range jobIDs {

		select {
		case <-ctx.Done():
			log.Println("stopping review completion processing")
			return ctx.Err()

		default:
		}

		apps, err := GetShortlistedApplications(ctx, jobID)
		if err != nil {
			continue
		}

		reviewers, _ := GetReviewers(ctx, jobID)

		assignments := utils.Distribute(apps, reviewers)

		for reviewerID, assignedApps := range assignments {

			for _, appID := range assignedApps {

				log.Printf(
					"creating interview | app=%s | reviewer=%s",
					appID,
					reviewerID,
				)

				emailCtx, cancel := context.WithTimeout(ctx, 10*time.Second)

				err := interview.CreateInterview(
					emailCtx,
					jobID,
					appID,
					reviewerID,
					cfg,
				)

				cancel()

				if err != nil {
					log.Printf(
						"❌ interview creation failed | app=%s | reviewer=%s | err=%v",
						appID,
						reviewerID,
						err,
					)
					continue
				}

				log.Printf(
					"✅ interview created | app=%s | reviewer=%s",
					appID,
					reviewerID,
				)

				err = UpdateApplicationStatus(ctx, appID, "INTERVIEW")

				if err != nil {
					log.Printf(
						"failed to update application status | app=%s | err=%v",
						appID,
						err,
					)
				}
			}
		}

		err = MarkInterviewTriggered(ctx, jobID)

		if err != nil {
			log.Println(
				"failed to mark interview processed:",
				err,
			)
		}
	}

	return nil
}
