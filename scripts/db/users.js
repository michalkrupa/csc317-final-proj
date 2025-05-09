const { execute } = require('./sql');

const createUsers = async (db) => {
    try {
        await execute(
            db,
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL DEFAULT '',
                phone TEXT,
                first_name TEXT DEFAULT '',
                last_name TEXT DEFAULT ''
            )`
        );
    } catch (error) {
        console.log(error);
    } finally {
        console.log('Users table created.');
    }
};

// Generic helper to ensure a column exists
const ensureColumnExists = async (db, columnName, columnType, defaultValue = "''") => {
    const columns = await new Promise((resolve, reject) => {
        db.all('PRAGMA table_info(users)', [], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });

    const hasColumn = columns.some(col => col.name === columnName);

    if (!hasColumn) {
        console.log(`Adding missing ${columnName} column to users table...`);
        try {
            await new Promise((resolve, reject) => {
                db.run(
                    `ALTER TABLE users ADD COLUMN ${columnName} ${columnType} DEFAULT ${defaultValue}`,
                    [],
                    (err) => {
                        if (err) return reject(err);
                        resolve();
                    }
                );
            });
        } catch (error) {
            console.log(error);
        } finally {
            console.log(`${columnName} column added.`);
        }
    } else {
        console.log(`${columnName} column already exists.`);
    }
};

const ensurePasswordColumn = async (db) => {
    await ensureColumnExists(db, 'password', 'TEXT', "''");
};

const ensureFirstAndLastNameColumns = async (db) => {
    await ensureColumnExists(db, 'first_name', 'TEXT', "''");
    await ensureColumnExists(db, 'last_name', 'TEXT', "''");
};

module.exports = {
    createUsers,
    ensurePasswordColumn,
    ensureFirstAndLastNameColumns,
};
