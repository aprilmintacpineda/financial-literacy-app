import z from 'zod';

const schema = z.object({
  JWT_SECRET: z.string(),
});

const env = schema.parse(process.env);

export default env;
