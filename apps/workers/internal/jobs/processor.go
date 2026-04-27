package jobs

import (
	"fmt"
	"log"
)

func ProcessExpiredJobs() error {
	jobIDs, err := GetExpiredJobs()
	fmt.Println("jobIDs :", jobIDs)
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
		log.Println("processing appIds:", appIds)
		// fetch reviewers
		reviewerIds, err := GetReviewers(jobID)
		if err != nil {
			log.Fatal("error fetching reviewerIds")
		}
		log.Println("processing reviewerIds:", reviewerIds)
		// assign equally
		assignments := distribute(appIds, reviewerIds)
		fmt.Println("assignments :", assignments)
		// save assignments
		// mark processed
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
