import { z } from 'zod';

// Define the configuration schema with validation
const configSchema = z.object({
  runalyze: z.object({
    apiToken: z.string().min(1, 'RUNALYZE_API_TOKEN is required'),
    baseUrl: z.string().url().default('https://runalyze.com'),
  }),
});

export type AppConfig = z.infer<typeof configSchema>;

/**
 * Configuration factory that loads and validates environment variables
 * This runs at application startup and will throw if validation fails
 */
export default (): AppConfig => {
  const config = {
    runalyze: {
      apiToken: process.env.RUNALYZE_API_TOKEN || '',
      baseUrl: 'https://runalyze.com',
    },
  };

  // Validate the configuration
  const result = configSchema.safeParse(config);

  if (!result.success) {
    const errors = result.error.errors
      .map((err) => `${err.path.join('.')}: ${err.message}`)
      .join('\n');
    throw new Error(`Configuration validation failed:\n${errors}`);
  }

  return result.data;
};
