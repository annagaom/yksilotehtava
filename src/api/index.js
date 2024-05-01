import express from 'express';
import userRouter from './routes/user-router.js';
import suosikkiRouter from './routes/suosikit-router.js';

const router = express.Router();

// bind base url for all cat routes to catRouter

router.use('/users', userRouter);
router.use('/suosikit', suosikkiRouter);

export default router;
