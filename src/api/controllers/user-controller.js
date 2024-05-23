import {
  listAllUsers,
  addUser,
  findUserById,
  // userLogin,
  findUserByUsername,
  removeUserByUserId,
  updateUser,
  updateUserPassword,
  updateUserPhotoyserId,
  findUserPhotoByUserId
} from '../models/user-model.js';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { checkPassword} from '../../utils/salasana.js';
import config from '../../config/config.js';
const SECRET_KEY = config.SECRET_KEY;

const getUser = async (req, res) => {
    const users = await listAllUsers();
    if (!users) {
        res.sendStatus(404);
        return;
    } res
    res.json(users);
};

const getUserByUsername = async (req, res) => {
    const user = await findUserByUsername(req.params.username);
    if (user) {
        res.json(user);
    } else {
        res.sendStatus(404);
    }
}

const getUserById = async (req, res) => {
    const user = await findUserById(req.params.id);
    if (user) {
        res.json(user);
    }
    else {
        res.sendStatus(404);
    }
};


const postUser = async (req, res) => {
  try {
      const user = {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          username: req.body.username,
          password: bcrypt.hashSync(req.body.password, 10),
          email: req.body.email,
          photo: req.file ? req.file.filename : null
      };

      const newUser = await addUser(user);

      if (!newUser) {
          return res.status(400).json({ error: 'Käyttäjän lisääminen epäonnistui.' });
      }

      res.status(201).json({ success: true, message: 'Käyttäjä lisätty onnistuneesti.', user_id: newUser.user_id });
  } catch (error) {
      console.error('Virhe postUser-toiminnossa:', error.message);
      if (error.message === 'Käyttäjänimi on jo käytössä.') {
          res.status(400).json({ error: 'Käyttäjänimi on jo käytössä.' });
      } else {
          res.status(500).json({ error: 'Sisäinen palvelinvirhe.' });
      }
  }
};

const postUserLogin = async (req, res) => {
  try {
      const { username, password } = req.body;
      console.log('Username received: ', username);
      console.log('Password received: ', password);

      if (!username || !password) {
          throw new Error("Käyttäjätunnus ja salasana ovat pakollisia.");
      }

      const user = await findUserByUsername(username);
      console.log('User found: ', user);

      if (!user) {
          console.log(`No user found with username: ${username}`);
          return res.status(401).json({ error: "Väärä käyttäjätunnus tai salasana." });
      }

      console.log(`Logging in user: ${username}`);
      console.log(`Stored password hash: ${user.password}`);
      console.log(`Input password: ${password}`);

      const passwordCorrect = checkPassword(password, user.password);
      console.log(`Password correct: ${passwordCorrect}`);

      if (!passwordCorrect) {
          console.log(`Incorrect password for user: ${username}`);
          return res.status(401).json({ error: "Väärä ksalasana." });
      }

      const token = jwt.sign(
          { user_id: user.user_id, username: user.username },
          SECRET_KEY,
          { expiresIn: "2h" }
      );

      res.status(200).json({ success: true, message: "Kirjautuminen onnistui.", token, user_id: user.user_id });
  } catch (error) {
      console.error("Virhe kirjautumisessa:", error.message);
      res.status(400).json({ error: error.message });
  }
};


const putUser = async (req, res) => {
  try {
    const user_id = req.params.id;
    const updatedFields = {
        etunimi: req.body.etunimi || null,
        sukunimi: req.body.sukunimi || null,
        tunnus: req.body.tunnus || null,
        salasana: req.body.salasana ? bcrypt.hashSync(req.body.salasana, 10) : null,
        email: req.body.email || null,
        puhelin: req.body.puhelin || null,
    };

    const sanitizedFields = Object.fromEntries(
        Object.entries(updatedFields).filter(([, value]) => value !== null)
    );

    const result = await updateUser(sanitizedFields, users_id);
    if (!result) {
        res.status(400).send('Päivitys epäonnistui');
        return;
    }
    res.json(result);

  } catch (error) {
      console.error('Virhe päivittäessä käyttäjää:', error);
      res.status(500).send('Sisäinen palvelinvirhe');
  }
};

const deleteUserByUserId = async (req, res) => {
    if (
        res.locals.user.user_id !== Number(req.params.id) &&
        res.locals.user.role !== 'admin'
    ) {
        res.sendStatus(403);
        return;
    }
    const result = await removeUserByUserId(req.params.id);
    if (!result) {
        res.sendStatus(400);
        return;
    }
    res.json(result);
};

const updatePassword = async (req, res) => {
    try {
        const newPassword = req.body.salasana;

        if (!newPassword) {
            return res.status(400).send("Uusi salasana on pakollinen.");
        }

        const user = await findUserById(req.params.id);

        if (!user) {
            return res.status(404).send("Käyttäjää ei löydy.");
        }

        const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

        const result = await updateUserPassword(req.params.id, hashedNewPassword);

        if (!result) {
            return res.status(400).send("Salasanan päivitys epäonnistui.");
        }

        return res.status(200).send("Salasana päivitetty onnistuneesti.");

    } catch (error) {
        console.error("Virhe salasanan päivityksessä:", error);
        return res.status(500).send("Sisäinen palvelinvirhe.");
    }
};



const putUserPhotoByUserId = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Username-controllersta: ', username);
    console.log('Password-controllersta: ', password);

    if (!username || !password) {
      throw new Error("Käyttäjätunnus ja salasana ovat pakollisia.");
    }

    const user = await findUserByUsername(username);
    console.log('Find user by username - controller: ', user);

    if (!user) {
      console.log(`No user found with username: ${username}`);
      return res.status(401).json({ error: "Väärä käyttäjätunnus tai salasana." });
    }

    console.log(`Logging in user: ${username}`);
    console.log(`Stored password hash: ${user.password}`);
    console.log(`Input password: ${password}`);

    const passwordCorrect = await bcrypt.compare(password, user.password);
    console.log(`Password correct: ${passwordCorrect}`);

    if (!passwordCorrect) {
      console.log(`Incorrect password for user: ${username}`);
      return res.status(401).json({ error: "Väärä salasana." });
    }

    const token = jwt.sign(
      { user_id: user.user_id, username: user.username },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    res.status(200).json({ success: true, message: "Kirjautuminen onnistui.", token, user_id: user.user_id });

  } catch (error) {
    console.error("Virhe kirjautumisessa:", error.message);
    res.status(400).json({ error: error.message });
  }
};


const getUserPhotoByUserId = async (req, res) => {
    try {
        const user_id = req.params.id;

        const result = await findUserPhotoByUserId(user_id);

        if (!result) {
            return res.status(404).send("Kuvaa ei löytynyt.");
        }

        return res.status(200).send(result.photo);

    } catch (error) {
        console.error("Virhe kuvan hakemisessa:", error);
        return res.status(500).send("Sisäinen palvelinvirhe.");
    }
}


export {
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


};
