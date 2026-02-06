import { Pool } from 'pg';
import { config } from './index';

if (!config.db.connectionString) {
  // Fail fast in dev if DATABASE_URL is not set
  // to avoid confusing runtime errors in repositories.
  throw new Error('DATABASE_URL is not defined. Check your backend/.env configuration.');
}

export const dbPool = new Pool({
  connectionString: config.db.connectionString,
});

export const checkDbConnection = async (): Promise<void> => {
  const client = await dbPool.connect();
  try {
    await client.query('SELECT 1');
  } finally {
    client.release();
  }
};

