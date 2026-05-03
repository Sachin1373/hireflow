package utils

func Distribute(applications []string, reviewers []string) map[string][]string {
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
