const { execute } = require('./sql');

const createWishlist = async (db) => {
    try {
        await execute(
            db,
            `CREATE TABLE IF NOT EXISTS wishlist (
                id INTEGER PRIMARY KEY,
                user_id INTEGER UNIQUE,
                product_id INTEGER,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (product_id) REFERENCES products(id)
            )`
        );
    } catch (error) {
        console.log(error);
    } finally {
        console.log('Wishlist table created.');
    }
};

module.exports = {
    createWishlist,
}