import 'dotenv/config';
import { app } from './app';
import { checkDbConnection } from './config/db';

const PORT = process.env.PORT ?? 3000;

const start = async (): Promise<void> => {
  await checkDbConnection();
  console.log('DB connection OK');

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

start().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
