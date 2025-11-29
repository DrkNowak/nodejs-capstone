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

function killDBConnection() {
  db.close();
}

export { db, initDB, killDBConnection };
