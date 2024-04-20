import promisePool from '../../utils/database.js';

const listAllUsers = async () => {
    const [rows] = await promisePool.query('SELECT * FROM users');
    return rows;
};

const findUserById = async (id) => {
    const [rows] = await promisePool.execute(
        'SELECT * FROM users WHERE user_id = ?',
        [id]
    );
    if (rows.length === 0) {
        return false;
    }
    return rows[0];
};

const addUser = async (user) => {
  const {
    photo,
    firstname,
    lastname,
    username,
    password,
    email,
    cookies_accept

  } = user;

  const sql = `INSERT INTO users (photo, firstname, lastname, username, password, email, cookies_accept)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  const data = [
    photo,
    firstname,
    lastname,
    username,
    password,
    email,
    cookies_accept
  ];

  const rows =  promisePool.execute(sql, data);
  // if (rows[0].affectedRows === 0) {
  //     return false;
  // }
  // return { asiakas_id: rows[0].insertId };
};

const getUserByUsername = async (firstname, lastname) => {
  const sql = `SELECT *
               FROM users
               WHERE firstname = ? AND lastname = ?`;
  const [rows] = await promisePool.execute(sql, [firstname, lastname]);
  if (rows.length === 0) {
      return false;
  }
  return rows[0];
};


const removeUser = async (id) => {
  const connection = await promisePool.getConnection();
  try {
      const [rows] = await promisePool.execute(
          'DELETE FROM users WHERE user_id = ?',
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

const updateUser = async (user, id) => {
  const sql = promisePool.format(`UPDATE users SET ? WHERE user_id = ?`, [
      user,
      id,
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

export {
    listAllUsers,
    findUserById,
    addUser,
    getUserByUsername,
    removeUser,
    updateUser,
};
