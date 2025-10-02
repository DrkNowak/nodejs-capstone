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

export function checkIfUserIsInDB(username: string): Promise<boolean> {
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
  const stmt = db.prepare('INSERT INTO users (_id, username) VALUES (?, ?)');
  const _id = uuidv4();

  stmt.run(_id, username);

  stmt.finalize();

  return { _id, username };
}

function killDBConnection() {
  db.close();
}

export { initDB, insertUser, killDBConnection };
