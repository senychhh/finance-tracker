/**
 * Применяет db/schema.sql к БД из DATABASE_URL.
 * Запуск: npm run db:schema
 */

import 'dotenv/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { dbPool } from '../config/db';

const run = async (): Promise<void> => {
  const schemaPath = join(__dirname, '../../db/schema.sql');
  const sql = readFileSync(schemaPath, 'utf-8');
  await dbPool.query(sql);
  await dbPool.end();
  console.log('Схема применена: db/schema.sql');
};

run().catch(async (err) => {
  console.error('Ошибка применения схемы:', err);
  await dbPool.end();
  process.exit(1);
});
