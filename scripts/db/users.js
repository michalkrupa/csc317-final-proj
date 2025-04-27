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

const ensurePasswordColumn = async (db) => {
    const columns = await new Promise((resolve, reject) => {
        db.all('PRAGMA table_info(users)', [], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });

    const hasPasswordColumn = columns.some(col => col.name === 'password');

    if (!hasPasswordColumn) {
        console.log('Adding missing password column to users table...');
        await new Promise((resolve, reject) => {
            db.run(
                `ALTER TABLE users ADD COLUMN password TEXT NOT NULL DEFAULT ''`,
                [],
                (err) => {
                    if (err) return reject(err);
                    resolve();
                }
            );
        });
        console.log('Password column added.');
    } else {
        console.log('Password column already exists.');
    }
};

module.exports = {
    createUsers,
    ensurePasswordColumn,
};
