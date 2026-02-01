/**
 * Application configuration.
 * Load env via dotenv in index.ts; here we export typed config values.
 */
export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'change-me-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  db: {
    connectionString: process.env.DATABASE_URL,
  },
} as const;
