const express = require('express');

function createOrdersRouter(db) {
    const router = express.Router();

    router.get('/', (req, res) => {
        db.all('SELECT * FROM orders', [], (err, rows) => {
            if (err) {
                console.error(err);
                res.status(500).send('Database error');
            } else {
                res.json(rows);
            }
        });
    });

    return router;
}

module.exports = {
    createOrdersRouter,
};
