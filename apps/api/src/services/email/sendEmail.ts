import { transporter } from "./transporter";

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

export const sendEmail = async ({
  to,
  subject,
  html,
}: SendEmailParams) => {
  try {
    const info = await transporter.sendMail({
      from: `"HireFlow" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent:", info.messageId);

    return info;
  } catch (error) {
    console.error("Send email error:", error);

    throw error;
  }
};