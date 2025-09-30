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

export function checkIfUserIsInDB(username: string, callback: (err: Error | null, exists: boolean | null) => void) {
  db.get('SELECT * FROM users WHERE username = ?', [username], (err: Error | null, row: any) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, !!row);
  });
}

function insertNewUser(username: string) {
  const stmt = db.prepare('INSERT INTO users (_id, username) VALUES (?, ?)');

  stmt.run(uuidv4(), username);

  stmt.finalize();
}

function killDBConnection() {
  db.close();
}
