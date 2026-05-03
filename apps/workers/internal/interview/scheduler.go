package interview

import (
	"context"

	"github.com/Sachin1373/hireflow/worker/internal/config"
	// "github.com/Sachin1373/hireflow/worker/internal/interview/repository"
	"github.com/Sachin1373/hireflow/worker/internal/mailer"
)

func CreateInterview(ctx context.Context, jobID, appID, reviewerID string, cfg *config.Config) error {

	meetLink := GenerateMeetLink()

	err := InsertInterview(
		jobID,
		appID,
		reviewerID,
		meetLink,
	)

	if err != nil {
		return err
	}

	// fetch candidate + reviewer
	candidateEmail, candidateName, err := GetCandidate(appID)
	reviewerEmail, reviewerName, err := GetReviewer(reviewerID)

	// send emails
	_ = mailer.SendInterviewEmail(
		cfg,
		candidateEmail,
		candidateName,
		meetLink,
	)

	_ = mailer.SendReviewerInterviewEmail(
		cfg,
		reviewerEmail,
		reviewerName,
		meetLink,
	)

	return nil
}
