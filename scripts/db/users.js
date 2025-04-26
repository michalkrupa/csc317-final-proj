const { execute } = require('./sql');

const createUsers = async (db) => {
    await execute(
        db,
        `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE
        )`
    );
};

module.exports = {
    createUsers,
};
