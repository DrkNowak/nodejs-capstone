const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('user_database.db');

function initDB() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      _id PRIMARY KEY,
      username
    )`);

    return db;
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

function insertUser(username: string) {
  const dbQuery = db.prepare('INSERT INTO users (_id, username) VALUES (?, ?)');
  const _id = uuidv4();

  dbQuery.run(_id, username);

  dbQuery.finalize();

  return { _id, username };
}

function listUsers(): Promise<{ _id: string; username: string }[]> {
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

export { initDB, insertUser, checkIfUserIsInDB, killDBConnection, listUsers };
