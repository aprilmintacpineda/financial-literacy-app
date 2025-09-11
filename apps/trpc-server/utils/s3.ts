import {
  SESv2Client,
  SendEmailCommand,
} from '@aws-sdk/client-sesv2';
import env from '../env';

export function sendEmail ({
  to,
  body,
  subject,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const client = new SESv2Client({
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const command = new SendEmailCommand({
    FromEmailAddress: env.FROM_EMAIL_ADDRESS,
    Destination: {
      ToAddresses: [to],
    },
    Content: {
      Simple: {
        Subject: {
          Data: subject,
        },
        Body: {
          Html: {
            Data: body,
          },
        },
      },
    },
  });

  return client.send(command);
}
