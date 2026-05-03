package scheduler

import (
	"context"
	"log"
	"time"

	"github.com/Sachin1373/hireflow/worker/internal/config"
	"github.com/Sachin1373/hireflow/worker/internal/jobs"
	"github.com/Sachin1373/hireflow/worker/internal/review"
)

func StartWorker(ctx context.Context, cfg *config.Config) {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()
	for {
		select {

		case <-ctx.Done():
			log.Println("Shutting down worker...")
			return

		case <-ticker.C:
			log.Println("Worker cycle started")

			if err := jobs.ProcessExpiredJobs(ctx, cfg); err != nil {
				log.Println("expired jobs error:", err)
			}

			if err := review.ProcessReviewCompletion(ctx, cfg); err != nil {
				log.Println("review completion error:", err)
			}
		}
	}
}
