package mailer

import (
	"fmt"

	"gopkg.in/gomail.v2"
)

type EmailConfig struct {
	Host     string
	Port     int
	Username string
	Password string
	From     string
}

func SendReviewAssignmentEmail(
	cfg EmailConfig,
	to string,
	reviewerName string,
	candidateName string,
	jobTitle string,
	reviewLink string,
) error {

	m := gomail.NewMessage()

	m.SetHeader("From", cfg.From)
	m.SetHeader("To", to)
	m.SetHeader("Subject", "New Application Assigned For Review")

	body := fmt.Sprintf(`
		<h2>Hello %s,</h2>

		<p>A new job applications has been assigned to you for review.</p>

		<p>
			<a href="%s">
				Review Applications
			</a>
		</p>
	`, reviewerName, candidateName, jobTitle, reviewLink)

	m.SetBody("text/html", body)

	d := gomail.NewDialer(
		cfg.Host,
		cfg.Port,
		cfg.Username,
		cfg.Password,
	)

	return d.DialAndSend(m)
}
