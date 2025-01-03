export const initializeDatabase = (db) => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS stockReceived (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bill_id TEXT NOT NULL,
      itemName TEXT NOT NULL,
      qty INTEGER NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      amt DECIMAL(10,2) NOT NULL,
      received_Date DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS stockIssued (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stockReceived_id INTEGER NOT NULL,
      qty INTEGER NOT NULL,
      user TEXT NOT NULL,
      issued_Date DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (stockReceived_id) REFERENCES stockReceived(id)
    );

    CREATE VIEW IF NOT EXISTS stockBalance AS
    SELECT 
      sr.id,
      sr.itemName,
      sr.qty as received_qty,
      COALESCE(SUM(si.qty), 0) as issued_qty,
      (sr.qty - COALESCE(SUM(si.qty), 0)) as balance_qty,
      sr.price,
      sr.amt
    FROM stockReceived sr
    LEFT JOIN stockIssued si ON sr.id = si.stockReceived_id
    GROUP BY sr.id;
  `);
};
