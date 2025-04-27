const { execute } = require('./sql');

const createUsers = async (db) => {
    try {
        await execute(
            db,
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                username TEXT NOT NULL UNIQUE,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL DEFAULT '',
                phone TEXT
            )`
        );
    } catch (error) {
        console.log(error);
    } finally {
        console.log('Users table created.');
    }
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
        try {
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
        } catch (error) {
            console.log(error)
        } finally {
            console.log('Password column added.');
        }
    } else {
        console.log('Password column already exists.');
    }
};

module.exports = {
    createUsers,
    ensurePasswordColumn,
};
