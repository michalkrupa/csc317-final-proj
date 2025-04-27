const { execute } = require('./sql');

const createService = async (db) => {
    try {
        await execute(
            db,
            `CREATE TABLE IF NOT EXISTS service (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL
            )`
        );
    } catch (error) {
        console.log(error);
    } finally {
        console.log('Service table created.');
    }
};

module.exports = {
    createService: createService
}