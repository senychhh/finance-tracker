import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  listHandler,
  createHandler,
  getByIdHandler,
} from '../controllers/recurringTransactionController';

export const recurringTransactionRouter = Router();

recurringTransactionRouter.use(authMiddleware);

recurringTransactionRouter.get('/', listHandler);
recurringTransactionRouter.post('/', createHandler);
recurringTransactionRouter.get('/:id', getByIdHandler);
