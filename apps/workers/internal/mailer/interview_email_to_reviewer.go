package mailer

import (
	"fmt"
	"strconv"

	"github.com/Sachin1373/hireflow/worker/internal/config"
	"gopkg.in/gomail.v2"
)

func SendReviewerInterviewEmail(
	cfg *config.Config,
	to,
	name,
	meetLink string,
) error {

	port, err := strconv.Atoi(cfg.SMTP.SMTP_PORT)
	if err != nil {
		return err
	}

	m := gomail.NewMessage()

	m.SetHeader("From", cfg.SMTP.SMTP_USER)
	m.SetHeader("To", to)
	m.SetHeader("Subject", "HireFlow | Interview Assigned")

	body := fmt.Sprintf(`
	<div style="font-family: Arial, sans-serif; line-height:1.6; color:#111827;">

		<h2>Hello %s,</h2>

		<p>
			An interview has been assigned to you in HireFlow.
		</p>

		<p>
			Please join the interview using the meeting link below:
		</p>

		<div style="margin:24px 0;">
			<a 
				href="%s"
				style="
					background:#111827;
					color:white;
					padding:12px 18px;
					text-decoration:none;
					border-radius:8px;
					display:inline-block;
					font-weight:600;
				"
			>
				Join Interview
			</a>
		</div>

		<p>
			If the button above does not work, use this link:
		</p>

		<p>
			<a href="%s">%s</a>
		</p>

		<hr style="margin:24px 0;" />

		<p>
			<strong>Important:</strong>
		</p>

		<p>
			After the interview is completed, please log in to the HireFlow Reviewer Dashboard and mark the candidate as:
		</p>

		<ul>
			<li>Selected</li>
			<li>Rejected</li>
		</ul>

		<p>
			This helps keep the hiring pipeline updated accurately.
		</p>

		<br/>

		<p>
			Best regards,<br/>
			HireFlow Team
		</p>

	</div>
	`,
		name,
		meetLink,
		meetLink,
		meetLink,
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
