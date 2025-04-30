const { execute } = require('./sql');

const createProducts = async (db) => {
    try {
        await execute(
            db,
            `CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                price REAL NOT NULL DEFAULT 0.0,
                is_featured INTEGER NOT NULL DEFAULT 0,
                is_sale INTEGER NOT NULL DEFAULT 0
            )`
        );
    } catch (error) {
        console.log(error);
    } finally {
        console.log('Products table created.');
    }
}

module.exports = {
    createProducts: createProducts,
};