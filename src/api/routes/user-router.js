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
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
      cb(null, file.filename + '-' + Date.now() + ".png");
  }
});

const upload = multer({ storage: storage });
const userRouter = express.Router();



userRouter.route('/')
.get(getUser)
.post(upload.single('tuote_kuva'), (req, res, next) => {
  console.log("req.file", req.file);
  const inputFile = req.file.path;
  const outputFile = req.file.filename;
  postUser(req, res, next);
});

userRouter.route('/info/:id')
.get(getUserInfo)
.put(upload.single('photo'), putUser);


userRouter.route('/login').post(userLoginPost);
userRouter.route('/:id')
    .put(putUser)
    .delete(deleteUserByUserId);
userRouter.route('/password/:id').put(updatePasswordController);
userRouter.route('/name/:tunnus').get(getUserByUsername);

export default userRouter;
