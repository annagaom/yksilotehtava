import e from 'express';
import promisePool from '../../utils/database.js';

const listAllTuote= async () => {
    const [rows] = await promisePool.query('SELECT * FROM tuote');
    return rows;
};

const findTuoteById = async (tuote_id) => {
    const [rows] = await promisePool.execute(
        'SELECT * FROM tuote WHERE tuote_id = ?',
        [tuote_id]
    );
    if (rows.length === 0) {
        return false;
    }
    return rows[0];
};

const findTuoteByname = async (tuote_nimi) => {
  const [rows] = await promisePool.execute(
      'SELECT * FROM tuote WHERE tuote_nimi = ?',
      [tuote_nimi]
  );
  if (rows.length === 0) {
      return false;
  }
  return rows[0];
};

const findLastTuoteId = async () => {
  try {
    const [rows] = await promisePool.execute('SELECT tuote_id FROM tuote ORDER BY tuote_id DESC LIMIT 1');
    if (rows.length > 0) {
      const lastTuoteId = rows[0].tuote_id;
      console.log('Last tuote_id:', lastTuoteId);
      return lastTuoteId;
    } else {
      console.error('No tuote found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching last tuote_id:', error);
    throw error;
  }
};

const addTuote = async (tuote, file) => {
  const { tuote_nimi, tuote_kuvaus, tuote_hinta, tuote_kustannus, tyyppi_id } = tuote;

  const sql = `INSERT INTO tuote (tuote_nimi, tuote_kuvaus, tuote_hinta, tuote_kustannus,
              tyyppi_id, tuote_kuva) VALUES (?, ?, ?, ?, ?, ?)`;

  console.log('file', file);
  const params = [tuote_nimi, tuote_kuvaus, tuote_hinta, tuote_kustannus, tyyppi_id, file.filename || null];

  try {
    const [rows] = await promisePool.execute(sql, params);
    if (rows.affectedRows === 0) {
      return false;
    }
    return { tuote_id: rows.insertId };
  } catch (error) {
    console.error("Error executing SQL query:", error);
    return false;
  }
};


const removeTuoteById = async (tuote_id) => {
  const connection = await promisePool.getConnection();
  try {
      const [rows] = await promisePool.execute(
          'DELETE FROM tuote WHERE tuote_id = ?',
          [tuote_id]
      );
      if (rows.affectedRows === 0) {
          return false;
      }
      await connection.commit();
      return {
          message: 'tuote deleted',
      };
  } catch (error) {
      await connection.rollback();
      console.error('error', error.message);
      return false;
  } finally {
      connection.release();
  }
};

const updateTuote = async (tuote, file, tuote_id) => {
  const sql = promisePool.format(`UPDATE tuote SET ? WHERE tuote_id = ?`, [
      tuote,
      file,
      tuote_id,
  ]);
  try {
      const rows = await promisePool.execute(sql);
      console.log('updatetuote', rows);
      if (rows.affectedRows === 0) {
          return false;
      }
      return { message: 'success' };
  } catch (e) {
      console.error('error', e.message);
      return false;
  }
};

export {listAllTuote, findTuoteById, findTuoteByname,findLastTuoteId, addTuote, removeTuoteById, updateTuote};
