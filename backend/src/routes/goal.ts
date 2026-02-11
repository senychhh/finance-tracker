import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  listHandler,
  createHandler,
  getByIdHandler,
} from '../controllers/goalController';

export const goalRouter = Router();

goalRouter.use(authMiddleware);

goalRouter.get('/', listHandler);
goalRouter.post('/', createHandler);
goalRouter.get('/:id', getByIdHandler);
