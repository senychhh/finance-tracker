import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  listHandler,
  createHandler,
  getByIdHandler,
} from '../controllers/transactionController';

export const transactionRouter = Router();

transactionRouter.use(authMiddleware);

transactionRouter.get('/', listHandler);
transactionRouter.post('/', createHandler);
transactionRouter.get('/:id', getByIdHandler);
