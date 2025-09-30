const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('user_database.db');

function initDB() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
    _id PRIMARY KEY,
    username
  )`);

    // 3. Wstawianie danych
    const stmt = db.prepare('INSERT INTO users (_id, username) VALUES (?, ?)');
    stmt.run(uuidv4(), 'Jan');
    stmt.run(uuidv4(), 'Anna2');
    stmt.finalize();
  });

  // 5. Zamknięcie bazy
  // db.close();
}
