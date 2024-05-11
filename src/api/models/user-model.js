
import promisePool from '../../utils/database.js';

const listAllUsers = async () => {
  const [rows] = await promisePool.query('SELECT * FROM users');
  return rows;
};

const addUser = async (user, file) => {
  const {firstname, lastname, username, password, email, dcookied_accept} = user;
    const sql = `INSERT INTO users (firstname, lastname, username, password, email, dcookied_accept)
        VALUES (?, ?, ?, ?, ?, ?)`;

    const data = [firstname, lastname, username, password, email, dcookied_accept];

    try {
        const [rows] = await promisePool.execute(sql, params);
        if (rows.affectedRows === 0) {
        console.error("SQL-kysely ei tuottanut tulosta");
        return false;
        }
        return { tuote_id: rows.insertId };
    } catch (error) {
        console.error("Virhe SQL-kyselyssä:", error);
        return false;
    }
};

const findUserByUsername = async (usenamer) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM users WHERE usenamer = ?',
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

export {
  listAllUsers,
  addUser,
  findUserByUsername,
  removeUserByUserId,
  updateUser,
  updateUserPassword

};
