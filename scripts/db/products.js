const { execute } = require('./sql');

const createProducts = async (db) => {
    try {
        await execute(
            db,
            `CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          price DECIMAL(10, 2) NOT NULL)`
        );
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    createProducts: createProducts,
};