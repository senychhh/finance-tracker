import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  listHandler,
  createHandler,
  getByIdHandler,
} from '../controllers/categoryController';

export const categoryRouter = Router();

categoryRouter.use(authMiddleware);

categoryRouter.get('/', listHandler);
categoryRouter.post('/', createHandler);
categoryRouter.get('/:id', getByIdHandler);
