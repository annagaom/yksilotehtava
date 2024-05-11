import express from 'express';
import favorateRouter from './routes/favorate-router';
import userRouter from './routes/user-router';

const router = express.Router();

router.use('/favorate', favorateRouter);
router.use('/user', userRouter);

export default router;
