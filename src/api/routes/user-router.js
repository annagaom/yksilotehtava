import express from 'express';
import {
  getUser,
  getUserByUsername,
  postUser,
  getUserInfo,
  userLoginPost,
  putUser,
  deleteUserByUserId,
  updatePasswordController
} from '../controllers/user-controller.js';

const userRouter = express.Router();

userRouter.route('/').get(getUser).post(postUser);
userRouter.route('/info/:id').get(getUserInfo).put(putUser);
userRouter.route('/login').post(userLoginPost);
userRouter.route('/:id')
    .put(putUser)
    .delete(deleteUserByUserId);
userRouter.route('/password/:id').put(updatePasswordController);
userRouter.route('/name/:tunnus').get(getUserByUsername);

export default userRouter;
