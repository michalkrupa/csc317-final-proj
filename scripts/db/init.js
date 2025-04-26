import sqlite3 from 'sqlite3';

// Create or open the 'animals.db' database.
const DB_NAME = `${process.env.DATABASE_NAME}.db`
const db = new sqlite3.Database(DB_NAME, (err) => {
  if (err) {
    return console.error("Error opening database:", err.message);
  }
  console.log(`Connected to ${DB_NAME} database.`);
});

//  Close the connection to ensure
//  that the database does not have
//  empty connections allocated
db.close((err) => {
  if (err) {
    return console.error("Error closing the database:", err.message);
  }
  console.log("Database connection closed.");
});

export default db;