export const initializeDatabase = async (db) => {
  await db.schema.hasTable('users').then(exists => {
    if (!exists) {
      return db.schema.createTable('users', table => {
        table.increments('id').primary();
        table.string('username').notNullable().unique();
        table.string('password').notNullable();
        table.timestamp('created_at').defaultTo(db.fn.now());
      });
    }
  });

  await db.schema.hasTable('stockReceived').then(exists => {
    if (!exists) {
      return db.schema.createTable('stockReceived', table => {
        table.increments('id').primary();
        table.string('bill_id').notNullable();
        table.string('itemName').notNullable();
        table.integer('qty').notNullable();
        table.decimal('price', 10, 2).notNullable();
        table.decimal('amt', 10, 2).notNullable();
        table.timestamp('received_Date').notNullable();
        table.timestamp('created_at').defaultTo(db.fn.now());
      });
    }
  });

  await db.schema.hasTable('stockIssued').then(exists => {
    if (!exists) {
      return db.schema.createTable('stockIssued', table => {
        table.increments('id').primary();
        table.integer('stockReceived_id').notNullable().references('id').inTable('stockReceived');
        table.integer('qty').notNullable();
        table.string('user').notNullable();
        table.timestamp('issued_Date').notNullable();
        table.timestamp('created_at').defaultTo(db.fn.now());
      });
    }
  });

  await db.schema.raw(`
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
