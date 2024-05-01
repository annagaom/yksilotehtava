import e from 'express';
import promisePool from '../../utils/database.js';

const listAllSuosikit = async () => {
    const [rows] = await promisePool.query('SELECT * FROM favorites');
    return rows;
};

const findSuosikkiByUserId = async (id) => {
  const [rows] = await promisePool.execute(
      'SELECT * FROM favorites WHERE favorite_id = ?',
      [id]
  );
  if (rows.length === 0) {
      return false;
  }
  return rows;
};

const addSuosikki = async (suosikki) => {
  const {
    favorite_id ,
    company,
    name,
    address,
    city,
    puh,
    email,
    distance
    } = suosikki;

  const sql = `INSERT INTO favorites (
    favorite_id ,
    company,
    name,
    address,
    city,
    puh,
    email,
    distance) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  const data = [
    favorite_id ,
    company,
    name,
    address,
    city,
    puh,
    email,
    distance
  ];

  try {
    const [rows] = await promisePool.execute(sql, data);
    if (rows && rows.affectedRows !== 0) {
      rows[0];
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error executing SQL query:", error);
    return false;
  }
};

const removeSuosikkiById = async (id) => {
  const connection = await promisePool.getConnection();
  try {
      const [rows] = await promisePool.execute(
          'DELETE FROM favorites WHERE favorite_id = ?',
          [id]
      );
      if (rows.affectedRows === 0) {
          return false;
      }
      await connection.commit();
      return {
          message: 'Suosikki deleted',
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
  listAllSuosikit,
  findSuosikkiByUserId,
  addSuosikki,
  removeSuosikkiById
};
