import { sendEmail } from '../utils/s3';

function composeBody (message: string[]) {
  return [
    ...message,
    '<p>Best regards,<br/>The Cash Tracker App Team</p>',
  ].join('');
}

export async function sendWelcomeEmail ({
  emailVerificationCode,
  to,
  name,
}: {
  to: string;
  name: string;
  emailVerificationCode: string;
}) {
  try {
    await sendEmail({
      to,
      subject: 'Welcome to Cash Tracker App',
      body: composeBody([
        `<p>Hi ${name},</p>`,
        `<p>Thank you for signing up for Cash Tracker App! We're excited to have you on board. Please use the code <strong>${emailVerificationCode}</strong> to verify your email.</p>`,
        '<p>Please note that this code will expire in 15 minutes.</p>',
      ]),
    });
  } catch (error) {
    console.log('Error sending welcome email:', error);
  }
}

export async function resendEmailVerificationCode ({
  emailVerificationCode,
  to,
  name,
}: {
  to: string;
  name: string;
  emailVerificationCode: string;
}) {
  try {
    await sendEmail({
      to,
      subject: 'Resend Email Verification Code',
      body: composeBody([
        `<p>Hi ${name},</p>`,
        `<p>Looks like you missed your previous email verification code! Don't worry, we got your back, here's another code that you can use to verify your email: <strong>${emailVerificationCode}</strong></p>`,
        '<p>Please note that this code will expire in 15 minutes.</p>',
      ]),
    });
  } catch (error) {
    console.log('Error sending email verification code:', error);
  }
}

export async function changedPasswordEmail ({
  to,
  name,
}: {
  to: string;
  name: string;
}) {
  try {
    await sendEmail({
      to,
      subject: 'Change Password Successful!',
      body: composeBody([
        `<p>Hi ${name},</p>`,
        '<p>We are sending this email to let you know that you have changed your password. If you did not do this, you may get support by sending us email at <a href="mailto:hello@entrepic.com">hello@entrepic.com</a>.</p>',
      ]),
    });
  } catch (error) {
    console.log('Error sending changed password email:', error);
  }
}

export async function sendChangePasswordVerificationEmail ({
  to,
  name,
  changePasswordVerificationCode,
}: {
  to: string;
  name: string;
  changePasswordVerificationCode: string;
}) {
  try {
    await sendEmail({
      to,
      subject: 'Change Password Verification Code',
      body: composeBody([
        `<p>Hi ${name},</p>`,
        `<p>Here's your verification code to change your password: <strong>${changePasswordVerificationCode}</strong></p>`,
        '<p>Please note that this code will expire in 15 minutes.</p>',
      ]),
    });
  } catch (error) {
    console.log(
      'Error sending change password verification code:',
      error,
    );
  }
}
