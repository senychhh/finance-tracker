import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  listHandler,
  createHandler,
  getByIdHandler,
} from '../controllers/accountController';

export const accountRouter = Router();

accountRouter.use(authMiddleware);

accountRouter.get('/', listHandler);
accountRouter.post('/', createHandler);
accountRouter.get('/:id', getByIdHandler);
