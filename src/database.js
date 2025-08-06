const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, '../veiculos.db'));

function initDb() {
  return new Promise((resolve, reject) => {
    db.run(`CREATE TABLE IF NOT EXISTS veiculos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      veiculo TEXT NOT NULL,
      marca TEXT NOT NULL,
      ano INTEGER NOT NULL,
      descricao TEXT,
      vendido BOOLEAN NOT NULL DEFAULT 0,
      created DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, err => {
      if (err) reject(err);
      else resolve();
    });
  });
}

module.exports = { db, initDb };