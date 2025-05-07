const { execute } = require('./sql');

const createCart = async (db) => {
    try {
        await execute(
            db,
            `CREATE TABLE IF NOT EXISTS cart (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER, -- NULLABLE for guests
                session_id TEXT, -- NEW: for unauthenticated users
                product_id INTEGER NOT NULL,
                product_name TEXT NOT NULL,
                quantity INTEGER NOT NULL DEFAULT 1,
                price_per_unit REAL NOT NULL,
                added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );`
        );
    } catch (error) {
        console.log(error);
    } finally {
        console.log('Checkout cart table created.');
    }
}

module.exports = {
    createCart: createCart,
};