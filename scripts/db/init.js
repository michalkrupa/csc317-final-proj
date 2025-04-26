const sqlite3 = require('sqlite3');
const { createProducts } = require('./products');
const { createOrders } = require('./orders');
const { createUsers } = require('./users');

const openDb = () => {
    const DB_NAME = `${process.env.DATABASE_NAME || 'animals'}.db`;
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
        // 🛠 Create multiple tables here
        // If there were additional tables (10+), we could use:
        // const tables = [createProducts, createOrders, createUsers];
        // for (const createTable of tables) {
        //   await createTable(db);
        // }
        await createProducts(db);
        console.log('Products table created.');

        await createOrders(db);
        console.log('Orders table created.');

        await createUsers(db);
        console.log('Users table created.');
    } catch (error) {
        console.error('Error setting up database:', error.message);
    }
};

module.exports = {
    openDb,
    setupDb,
};
