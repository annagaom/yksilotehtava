
import promisePool from '../../utils/database.js';

const listAllUsers = async () => {
  const [rows] = await promisePool.query('SELECT * FROM users');
  return rows;
};

const findUserById = async (id) => {
  const [rows] = await promisePool.execute(
      'SELECT * FROM kayttaja WHERE user_id = ?',
      [id]
  );
  if (rows.length === 0) {
      return false;
  }
  return rows[0];
};


const addUser = async (user) => {
  const { firstname, lastname, username, password, email, photo } = user;

  // Tarkista, onko käyttäjänimi jo olemassa
  const checkUserSql = 'SELECT * FROM users WHERE username = ?';
  const [existingUsers] = await promisePool.execute(checkUserSql, [username]);

  if (existingUsers.length > 0) {
      throw new Error('Käyttäjänimi on jo käytössä.');
  }

  const sql = 'INSERT INTO users (firstname, lastname, username, password, email, photo) VALUES (?, ?, ?, ?, ?, ?)';
  const data = [firstname, lastname, username, password, email, photo];

  try {
      const [rows] = await promisePool.execute(sql, data);
      if (rows.affectedRows === 1) {
          return { user_id: rows.insertId };
      } else {
          return false;
      }
  } catch (error) {
      console.error('Error executing SQL query:', error);
      return false;
  }
};

const userLogin = async (username, password) => {
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  const data = [username, password];

  try {
      const [rows] = await promisePool.execute(sql, data);
      if (rows.length === 0) {
          return false;
      } else {
          return rows[0]; // Palautetaan ensimmäinen löydetty käyttäjä
      }
  } catch (error) {
      console.error('Error executing SQL query:', error);
      return false;
  }
};


const findUserByUsername = async (usenamer) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM users WHERE username = ?',
      [usenamer]
    );
    if (rows.length === 0) {
      return false;
    }
    return rows[0];
  } catch (error) {
    console.error('Error finding user by username:', error);
    return false;
  }
};

const removeUserByUserId = async (id) => {
  const connection = await promisePool.getConnection();
  try {
    const [rows] = await promisePool.execute(
      'DELETE FROM users WHERE users_id = ?',
      [id]
    );
    if (rows.affectedRows === 0) {
      return false;
    }
    await connection.commit();
    return {
      message: 'User deleted',
    };
  } catch (error) {
    await connection.rollback();
    console.error('error', error.message);
    return false;
  } finally {
    connection.release();
  }
};

const updateUser = async (user, users_id) => {
  const sql = promisePool.format(`UPDATE users SET ? WHERE users_id = ?`, [
    user,
    users_id,
  ]);
  try {
    const rows = await promisePool.execute(sql);
    console.log('updateUser', rows);
    if (rows.affectedRows === 0) {
      return false;
    }
    return { message: 'success' };
  } catch (e) {
    console.error('error', e.message);
    return false;
  }
};

const updateUserPassword = async (userId, hashedNewPassword) => {
  const sql = 'UPDATE users SET password = ? WHERE users_id = ?';
  const values = [hashedNewPassword, userId];

  try {
    const [result] = await promisePool.execute(sql, values);

    if (result.affectedRows === 0) {
      return false;
    }

    return true;

  } catch (error) {
    console.error("Virhe salasanan päivittämisessä:", error);
    throw error;
  }
};

const updateUserPhotoyserId = async (file, user_id) => {
  const sql = 'UPDATE users SET photo = ? WHERE users_id = ?';
  const values = [file, user_id];

  try {
    const [result] = await promisePool.execute(sql, values);

    if (result.affectedRows === 0) {
      return false;
    }
    return {message: 'success'};
  } catch (error) {
    console.error("Virhe kuvan päivittämisessä:", error);
    throw error;
  }
}

const findUserPhotoByUserId = async (user_id) => {
  try {

    const [rows] = await promisePool.execute(
      'SELECT photo FROM users WHERE users_id = ?',
      [user_id]
    );
    if (rows.length === 0) {
      return false;
    }
    return rows[0];
  } catch (error) {
    console.error('Error finding user photo by user id:', error);
    return false;
  }
};

export {
  listAllUsers,
  addUser,
  findUserById,
  userLogin,
  findUserByUsername,
  removeUserByUserId,
  updateUser,
  updateUserPassword,
  updateUserPhotoyserId,
  findUserPhotoByUserId

};
