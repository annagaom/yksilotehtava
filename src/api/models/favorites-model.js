import e from 'express';
import promisePool from '../../utils/database.js';

const listAllFavorites = async () => {
    const [rows] = await promisePool.query('SELECT * FROM favorites');
    return rows;
};

const findFavoriteByUserId = async (user_id) => {
  try {

    const [rows] = await promisePool.execute(
      'SELECT * FROM favorites WHERE user_id = ?',
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

const addFavorite = async (favorite) => {
  const {
    user_id,
    company,
    name,
    address,
    city,
    puh,
    email,
    distance,
    restaurant_id
    } = favorite;

  const sql = `INSERT INTO favorites (
    user_id,
    company,
    name,
    address,
    city,
    puh,
    email,
    distance,
    restaurant_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const data = [
    user_id,
    company,
    name,
    address,
    city,
    puh,
    email,
    distance,
    restaurant_id
  ];

  try {
    const [rows] = await promisePool.execute(sql, data);
    if (rows && rows.affectedRows !== 0) {
      console.log('Favorite added:', rows);
      rows[0];

    } else {
      return false;
    }
  } catch (error) {
    console.error("Error executing SQL query:", error);
    return false;
  }
};

const removeFavoriteByRestaurantAndUserId = async (restaurant_id, user_id) => {
  const connection = await promisePool.getConnection();
  try {
      const [rows] = await promisePool.execute(
          'DELETE FROM favorites WHERE restaurant_id = ? AND user_id = ?',
          [restaurant_id, user_id]
      );
      if (rows.affectedRows === 0) {
          return false;
      }
      await connection.commit();
      return {
          message: 'Favorite deleted',
      };
  } catch (error) {
      await connection.rollback();
      console.error('error', error.message);
      return false;
  } finally {
      connection.release();
  }
};

export {
  listAllFavorites,
  findFavoriteByUserId,
  addFavorite,
  removeFavoriteByRestaurantAndUserId
};
