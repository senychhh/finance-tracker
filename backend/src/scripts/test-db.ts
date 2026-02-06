/**
 * Ручной тест БД: подключение + UserRepository (create, getByEmail, getById, delete).
 * Запуск: npm run test:db
 */

import 'dotenv/config';
import { checkDbConnection } from '../config/db';
import {
  createUser,
  getUserByEmail,
  getUserById,
  deleteUserById,
} from '../repositories';

const TEST_EMAIL = `test-db-${Date.now()}@example.com`;
const TEST_PASSWORD_HASH = 'test-hash-not-real';

const run = async (): Promise<void> => {
  console.log('1. Проверка подключения к БД...');
  await checkDbConnection();
  console.log('   OK\n');

  console.log('2. createUser...');
  const created = await createUser(TEST_EMAIL, TEST_PASSWORD_HASH);
  console.log('   Создан пользователь:', { id: created.id, email: created.email });
  console.log('   OK\n');

  console.log('3. getUserByEmail...');
  const byEmail = await getUserByEmail(TEST_EMAIL);
  if (!byEmail || byEmail.id !== created.id) {
    throw new Error('getUserByEmail вернул не того пользователя');
  }
  console.log('   Найден по email:', byEmail.email);
  console.log('   OK\n');

  console.log('4. getUserById...');
  const byId = await getUserById(created.id);
  if (!byId || byId.email !== TEST_EMAIL) {
    throw new Error('getUserById вернул не того пользователя');
  }
  console.log('   Найден по id:', byId.id);
  console.log('   OK\n');

  console.log('5. deleteUserById (очистка тестовых данных)...');
  const deleted = await deleteUserById(created.id);
  if (!deleted) throw new Error('deleteUserById не удалил запись');
  console.log('   OK\n');

  console.log('Все проверки БД прошли успешно.');
};

run().catch((err: NodeJS.ErrnoException & { code?: string }) => {
  if (err.code === '42P01') {
    console.error(
      'Ошибка: таблица users не найдена. Примените схему БД:\n  psql "$DATABASE_URL" -f db/schema.sql\n  или: npm run db:schema'
    );
  } else {
    console.error('Ошибка теста БД:', err);
  }
  process.exit(1);
});
