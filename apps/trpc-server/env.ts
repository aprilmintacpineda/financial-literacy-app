import z from 'zod';

const schema = z.object({
  JWT_SECRET: z.string(),
  AWS_REGION: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  FROM_EMAIL_ADDRESS: z.string(),
});

const env = schema.parse(process.env);

export default env;
