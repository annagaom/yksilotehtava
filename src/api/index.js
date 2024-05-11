import express from 'express';
import favoriteRouter from './routes/favorites-router.js';
import userRouter from './routes/user-router.js';

const router = express.Router();

router.use('/favorites', favoriteRouter);
router.use('/users', userRouter);

export default router;
