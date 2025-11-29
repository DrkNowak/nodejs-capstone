import { User } from '../models/models';
import { db } from './connection';

const { v4: uuidv4 } = require('uuid');

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

export { checkIfUserIsInDB, getUserById, insertUser, listUsers, removeUser };
