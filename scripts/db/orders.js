const { execute } = require('./sql');

const createOrders = async (db) => {
    try {
        await execute(
            db,
            `CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY,
                product_id INTEGER,
                quantity INTEGER NOT NULL,
                FOREIGN KEY (product_id) REFERENCES products(id)
            )`
        );
    } catch (error) {
        console.log(error);
    } finally {
        console.log('Orders table created.');
    }
};

module.exports = {
    createOrders,
};
