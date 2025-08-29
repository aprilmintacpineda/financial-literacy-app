import { sendEmail } from '../utils/s3';

export async function sendWelcomeEmail({
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
      body: [
        `<p>Hi ${name},</p>`,
        `<p>Thank you for signing up for Cash Tracker App! We're excited to have you on board. Please use the code <strong>${emailVerificationCode}</strong> to verify your email.</p>`,
        '<p>Please note that this code will expire in 15 minutes.</p>',
        '<p>Best regards,<br/>The Cash Tracker App Team</p>',
      ].join('\n'),
    });
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
}

export async function resendEmailVerificationCode({
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
      body: [
        `<p>Hi ${name},</p>`,
        `<p>Looks like you missed your previous email verification code! Don't worry, we got your back, here's another code that you can use to verify your email: <strong>${emailVerificationCode}</strong></p>`,
        '<p>Please note that this code will expire in 15 minutes.</p>',
        '<p>Best regards,<br/>The Cash Tracker App Team</p>',
      ].join('\n'),
    });
  } catch (error) {
    console.error('Error sending email verification code:', error);
  }
}
