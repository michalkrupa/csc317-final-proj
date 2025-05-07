const { execute } = require('./sql');

const createNewsletterSubs = async (db) => {
    try {
        await execute(
            db,
            `CREATE TABLE IF NOT EXISTS newsletter_subs (
                id INTEGER PRIMARY KEY,
                email TEXT NOT NULL,
                opt_in INTEGER NOT NULL
            )`
        );
    } catch (error) {
        console.log(error);
    } finally {
        console.log('NewsletterSubs table created.');
    }
};

module.exports = {
    createNewsletterSubs,
}