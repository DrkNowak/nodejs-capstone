import { User } from '../models/models';

const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('user_database.db');

function initDB(): Promise<typeof db> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `CREATE TABLE IF NOT EXISTS users (
          _id PRIMARY KEY,
          username
        )`,
        (err: Error | null) => {
          if (err) return reject(err);

          db.run(
            `CREATE TABLE IF NOT EXISTS exercises (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              _id,
              description,
              duration,
              date
            )`,
            (err2: Error | null) => {
              if (err2) return reject(err2);
              resolve(db);
            }
          );
        }
      );
    });
  });
}

function checkIfUserIsInDB(username: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM users WHERE username = ? COLLATE NOCASE',
      [username],
      (err: Error | null, row: { username: string; _id: string }) => {
        if (err) {
          return reject(err);
        }

        resolve(!!row);
      }
    );
  });
}

function getUserById(userId: string): Promise<User | null> {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM users WHERE _id = ?',
      [userId],
      (err: Error | null, row: { username: string; _id: string }) => {
        if (err) {
          return reject(err);
        }

        resolve(row ? { _id: row._id, username: row.username } : null);
      }
    );
  });
}

async function insertUser(username: string): Promise<User> {
  try {
    const _id = uuidv4();

    await new Promise<void>((resolve, reject) => {
      const dbQuery = db.prepare('INSERT INTO users (_id, username) VALUES (?, ?)');
      dbQuery.run(_id, username, (err: Error | null) => {
        dbQuery.finalize();
        if (err) return reject(err);
        resolve();
      });
    });

    return { _id, username };
  } catch (error) {
    throw error;
  }
}

function listUsers(): Promise<User[]> {
  return new Promise((resolve, reject) => {
    const dbQuery = db.prepare('SELECT _id, username FROM users ORDER BY username COLLATE NOCASE ASC');

    dbQuery.all((err: Error | null, rows: { username: string; _id: string }[]) => {
      dbQuery.finalize();

      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

function killDBConnection() {
  db.close();
}

async function removeUser(username: string): Promise<string> {
  try {
    await new Promise<void>((resolve, reject) => {
      const dbQuery = db.prepare('DELETE FROM users WHERE username = ? COLLATE NOCASE');

      dbQuery.run(username, (err: Error | null) => {
        dbQuery.finalize();
        if (err) return reject(err);
        resolve();
      });
    });

    return username;
  } catch (error) {
    throw error;
  }
}

async function insertExercise(
  _id: string,
  description: string,
  duration: number,
  date: string
): Promise<{ _id: string; description: string; duration: number; date: string }> {
  try {
    await new Promise<void>((resolve, reject) => {
      const dbQuery = db.prepare('INSERT INTO exercises (_id, description, duration, date) VALUES (?, ?, ?, ?)');

      dbQuery.run(_id, description, duration, date, (err: Error | null) => {
        dbQuery.finalize();
        if (err) return reject(err);
        resolve();
      });
    });

    return { _id, description, duration, date };
  } catch (error) {
    throw error;
  }
}

async function getExercisesByUserId(
  userId: string
): Promise<{ _id: string; description: string; duration: number; date: string }[]> {
  return new Promise((resolve, reject) => {
    const dbQuery = db.prepare('SELECT _id, description, duration, date FROM exercises WHERE _id = ?');

    dbQuery.all(
      userId,
      (err: Error | null, rows: { _id: string; description: string; duration: number; date: string }[]) => {
        dbQuery.finalize();

        if (err) {
          return reject(err);
        }
        resolve(rows);
      }
    );
  });
}

export {
  initDB,
  insertUser,
  checkIfUserIsInDB,
  killDBConnection,
  listUsers,
  insertExercise,
  getUserById,
  removeUser,
  getExercisesByUserId,
};
