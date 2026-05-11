export const getResetPasswordEmailTemplate = (resetUrl) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password for Chattify.</p>

      <p>Please click the button below to set a new password. This link is valid for 10 minutes:</p>

      <a href="${resetUrl}" 
        style="background-color: #4F46E5; color: white; padding: 10px 20px; 
        text-decoration: none; border-radius: 5px; display: inline-block;">
        Reset Password
      </a>

      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>

      <p>If you did not request this, please ignore this email.</p>
    </div>
  `;
};