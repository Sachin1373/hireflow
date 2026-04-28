type InviteUserTemplateParams = {
  firstName: string;
  email: string;
  tempPassword: string;
};

export const inviteUserTemplate = ({
  firstName,
  email,
  tempPassword,
}: InviteUserTemplateParams) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      
      <h2>Welcome to HireFlow</h2>

      <p>Hi ${firstName},</p>

      <p>
        Your account has been created successfully.
      </p>

      <div style="margin: 20px 0; padding: 16px; background: #f5f5f5; border-radius: 8px;">
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Temporary Password:</strong> ${tempPassword}</p>
      </div>

      <p>
        Please login and change your password immediately.
      </p>

      <p>
        Regards,<br />
        HireFlow Team
      </p>

    </div>
  `;
};