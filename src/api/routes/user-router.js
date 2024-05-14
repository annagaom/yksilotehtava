import express from 'express';
import {
  getUser,
    getUserById,
    getUserByUsername,
    postUser,
    putUser,
    deleteUserByUserId,
    updatePassword,
    postUserLogin,
    getUserPhotoByUserId,
    putUserPhotoByUserId
} from '../controllers/user-controller.js';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    console.log("file in multer filename", file);
    cb(null, file.filename + '-' + Date.now() + ".png");
  }
});

const upload = multer({ storage: storage });
const userRouter = express.Router();


userRouter.route('/')
.get(getUser)
.post(upload.single('photo'), (req, res, next) => {
  console.log("req.file", req.file);
  const inputFile = req.file.path;
  const outputFile = req.file.filename;
  postUser(req, res, next);
});

userRouter.route('/info/:id')
.put(upload.single('photo'), putUser);


userRouter.route('/login').post(postUserLogin);
userRouter.route('/:id')
  .get(getUserById)
  .put(putUser)
  .delete(deleteUserByUserId);
userRouter.route('/password/:id').put(updatePassword);
userRouter.route('/name/:tunnus').get(getUserByUsername);

userRouter.route('/photo/:id')
.get(getUserPhotoByUserId)
.put(upload.single('photo'), putUserPhotoByUserId);

export default userRouter;
