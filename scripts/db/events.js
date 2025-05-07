const { execute } = require('./sql');

const createEvents = async (db) => {
    try {
        await execute(
            db,
            `CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                date TEXT
            )`
        );
    } catch (error) {
        console.log(error);
    } finally {
        console.log('Events table created.');
    }
};

module.exports = {
    createEvents,
}