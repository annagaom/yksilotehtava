import {
  listAllSuosikit,
  findSuosikkiByAsiakasId,
  addSuosikki,
  removeSuosikkiById} from '../models/suosikkit-model.js';
// import bcrypt from 'bcrypt';

const getUser = async (req, res) => {
    const users = await listAllUsers();
    if (!users) {
        res.sendStatus(404);
        return;
    }

    const getTuote = async (req, res) => {
        const tuoteet = await listAllTuote();
        if (!tuoteet) {
            res.sendStatus(404);
            return;
        }res
        res.json(tuoteet);
    };

    const getTuoteByname = async(req, res) => {
        const tuote = await findTuoteByname(req.params.tuote_nimi);
        if (tuote) {
            res.json(tuote);
        } else {
            res.sendStatus(404);
        }
    }

    const getTuoteById = async(req, res) => {
        const tuote = await findTuoteById(req.params.tuote_id);
        if (tuote) {
            res.json(tuote);
        } else {
            res.sendStatus(404);
        }
    };
    const getLastTuoteId = async (req, res) => {
      try {
        const tuote_id = await findLastTuoteId();
        console.log('tuote_id', tuote_id);
        if (!tuote_id) {
          res.sendStatus(404);
          return;
        }
        res.json(tuote_id);
      } catch (error) {
        console.error('Error getting last tuote_id:', error);
        res.status(500).send('Internal Server Error');
      }
    };


    const postTuote = async (req, res) => {
      console.log("body", req.body);
      console.log("file", req.file);

      let params = [
        req.body.tuote_nimi,
        req.body.tuote_kuvaus,
        req.body.tuote_hinta,
        req.body.tuote_kustannus,
        req.body.tyyppi_id,
        req.file.path
      ];

      const result = await addTuote(req.body, req.file);
      if (!result) {
          res.sendStatus(400);
          return;
      }
      res.status(200);
      res.json(result);
    };

    const putTuote = async(req, res, next) => {
      const data = {
        tuote_nimi: req.body.tuote_nimi,
        tuote_kuvaus: req.body.tuote_kuvaus,
        tuote_hinta: req.body.tuote_hinta,
        tuote_kustannus: req.body.tuote_kustannus,
        tuote_tyyppi: req.body.tyyppi_id,
        tuote_kuva: req.file.filename // Update the file path
      };

      console.log("body", req.body);
      console.log("file", req.file);

      const result = await updateTuote(data, req.params.tuote_id, res.locals.tuote);
      if (!result) {
          res.sendStatus(400);
          return;
      }
      res.status(200);
      res.json(result)
    };

    const deleteTuote = async (req, res) => {
        const result = await removeTuoteById(req.params.tuote_id);
        if (!result) {
            res.sendStatus(400);
            return;
        }
        res.json(result);
    };

    export { getTuote, getTuoteByname, getTuoteById, getLastTuoteId, postTuote, putTuote, deleteTuote };

    res.json(users);
};

const getUserById = async(req, res) => {
    const user = await findUserById(req.params.id);
    if (user) {
        res.json(user);
    } else {
        res.sendStatus(404);
    }
};

const postUser = async (req, res) => {
  console.log(req.body);
  // req.body.password = bcrypt.hashSync(req.body.password, 10);

  const result = await addUser(req.body);
  if (!result) {
      const error = new Error('Invalid or missing fields.');
      error.status = 400;
      return
  }
  res.status(201).json(result);
};


const putUser = async (req, res) => {
    // if (
    //     res.locals.user.user_id !== Number(req.params.id) &&
    //     res.locals.user.role !== 'admin'
    // ) {
    //     res.sendStatus(403);
    //     return;
    // }

    const result = await updateUser(req.body, req.params.id, res.locals.user);
    if (!result) {
        res.sendStatus(400);
        return;
    }
    res.json(result);
};

const deleteUser = async (req, res) => {
    // if (
    //     res.locals.user.user_id !== Number(req.params.id) &&
    //     res.locals.user.role !== 'admin'
    // ) {
    //     res.sendStatus(403);
    //     return;
    // }
    const result = await removeUser(req.params.id);
    if (!result) {
        res.sendStatus(400);
        return;
    }
    res.json(result);
};

export { getUser, getUserById, postUser, putUser, deleteUser };
