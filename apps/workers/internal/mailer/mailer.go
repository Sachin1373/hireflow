package mailer

import (
	"fmt"
	"strconv"

	"github.com/Sachin1373/hireflow/worker/internal/config"

	"gopkg.in/gomail.v2"
)

func SendReviewAssignmentEmail(
	cfg *config.Config,
	to string,
	reviewerName string,
	jobTitle string,
	reviewLink string,
) error {

	port, err := strconv.Atoi(
		cfg.SMTP.SMTP_PORT,
	)

	if err != nil {
		return err
	}

	m := gomail.NewMessage()

	m.SetHeader(
		"From",
		cfg.SMTP.SMTP_USER,
	)

	m.SetHeader("To", to)

	m.SetHeader(
		"Subject",
		"Applications Assigned For Review",
	)

	body := fmt.Sprintf(`
		<div style="font-family: Arial, sans-serif; line-height: 1.6;">

			<h2>Hello %s,</h2>

			<p>
				You have been assigned as a reviewer for the following job:
			</p>

			<p>
				<strong>Job:</strong> %s
			</p>

			<p>
				Please review the candidates assigned to you.
			</p>

			<p>
				<a 
					href="%s"
					style="
						background:black;
						color:white;
						padding:12px 18px;
						text-decoration:none;
						border-radius:8px;
						display:inline-block;
					"
				>
					Review Applications
				</a>
			</p>

			<p>%s</p>

		</div>
	`,
		reviewerName,
		jobTitle,
		reviewLink,
		reviewLink,
	)

	m.SetBody("text/html", body)

	d := gomail.NewDialer(
		cfg.SMTP.SMTP_HOST,
		port,
		cfg.SMTP.SMTP_USER,
		cfg.SMTP.SMTP_PASS,
	)

	return d.DialAndSend(m)
}
