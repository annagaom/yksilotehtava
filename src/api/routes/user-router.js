import express from 'express';
import {
  getTuote,
  getTuoteByname,
  getTuoteById,
  getLastTuoteId,
  postTuote,
  putTuote,
  deleteTuote,
} from '../controllers/tuote-controller.js';
import multer from 'multer';
import {authenticateToken, createThumbnail} from '../../middlewares.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    console.log("file in multer filename", file);
    cb(null, file.fieldname + '-' + Date.now()+".png");
  }
});

const upload = multer({ storage: storage });
const tuoteRouter = express.Router();

tuoteRouter.route('/')
  .get(getTuote)
  .post(upload.single('tuote_kuva'), (req, res, next) => {
    console.log("req.file", req.file);
    const inputFile = req.file.path;
    const outputFile = req.file.filename;
    postTuote(req, res, next);
  });

  tuoteRouter.route('/:tuote_id')
  .get(getTuoteById)
  .delete(deleteTuote)
  .put(upload.single('tuote_kuva'), (req, res, next) => {
    console.log("req.file", req.file);
    const inputFile = req.file.path;
    const outputFile = req.file.filename;
    putTuote(req, res, next);
  });

tuoteRouter.route('/name/:tuote_nimi').get(getTuoteByname);
tuoteRouter.route('/lastid').get(getLastTuoteId);

export default tuoteRouter;
