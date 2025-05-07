const sqlite3 = require('sqlite3');
const tables = require('./tables');

const openDb = () => {
    const DB_NAME = `${process.env.DATABASE_NAME || 'dev'}.db`;
    const db = new sqlite3.Database(DB_NAME, (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            console.log(`Connected to ${DB_NAME} database.`);
        }
    });
    return db;
};

const setupDb = async (db) => {
    try {
        for (const createTable of tables) {
            await createTable(db);
        }
    } catch (error) {
        console.error('Error setting up database:', error.message);
    }
};

module.exports = {
    openDb,
    setupDb,
};
