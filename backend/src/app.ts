import express from 'express';
import cors from 'cors';
import { healthRouter } from './routes/health';
import { authRouter } from './routes/auth';
import { accountRouter } from './routes/account';
import { categoryRouter } from './routes/category';
import { transactionRouter } from './routes/transaction';
import { budgetRouter } from './routes/budget';
import { recurringTransactionRouter } from './routes/recurringTransaction';
import { goalRouter } from './routes/goal';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/accounts', accountRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/budgets', budgetRouter);
app.use('/api/recurring-transactions', recurringTransactionRouter);
app.use('/api/goals', goalRouter);

export { app };
