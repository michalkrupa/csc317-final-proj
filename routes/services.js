const express = require('express');

function createServicesRouter(db) {
    const router = express.Router();

    // View all services
    router.get('/', (req, res) => {
        db.all('SELECT * FROM service', [], (err, rows) => {
            if (err) {
                console.error(err);
                res.status(500).send('Database error');
            } else {
                return res.render('services', {scheduled_services: rows, title: 'All Services'});
            }
        });
    });

    // Create a new service
    router.post('/', (req, res) => {
        const { name } = req.body;
        if (!name) return res.status(400).send('Name required');

        db.run('INSERT INTO service (name) VALUES (?)', [name], function (err) {
            if (err) {
                console.error(err);
                res.status(500).send('Database error');
            } else {
                res.json({ id: this.lastID, name });
            }
        });
    });

    // Update service
    router.put('/:id', (req, res) => {
        const { id } = req.params;
        const { name } = req.body;
        if (!name) return res.status(400).send('Name required');

        db.run('UPDATE service SET name = ? WHERE id = ?', [name, id], function (err) {
            if (err) {
                console.error(err);
                res.status(500).send('Database error');
            } else {
                res.json({ message: 'Service updated' });
            }
        });
    });

    // Delete service
    router.delete('/:id', (req, res) => {
        const { id } = req.params;

        db.run('DELETE FROM service WHERE id = ?', [id], function (err) {
            if (err) {
                console.error(err);
                res.status(500).send('Database error');
            } else {
                res.json({ message: 'Service deleted' });
            }
        });
    });

    // View all services
    router.get('/custom', (req, res) => {
        res.render('services/cutting', {title: 'Custom Cutting'});
    });

    router.get('/design', (req, res) => {
        res.render('services/design', {title: 'Custom Designs'});
    });


    return router;
}

module.exports = {
    createServicesRouter,
};
