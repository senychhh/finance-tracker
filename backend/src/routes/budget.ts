import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  listHandler,
  createHandler,
  getByIdHandler,
} from '../controllers/budgetController';

export const budgetRouter = Router();

budgetRouter.use(authMiddleware);

budgetRouter.get('/', listHandler);
budgetRouter.post('/', createHandler);
budgetRouter.get('/:id', getByIdHandler);
