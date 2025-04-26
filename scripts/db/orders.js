const { execute } = require('./sql');

const createOrders = async (db) => {
    await execute(
        db,
        `CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY,
            product_id INTEGER,
            quantity INTEGER NOT NULL,
            FOREIGN KEY (product_id) REFERENCES products(id)
        )`
    );
};

module.exports = {
    createOrders,
};
