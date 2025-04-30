const express = require('express');

function createEventsRouter(db) {
    const router = express.Router();
    // Create a new event
    router.post('/', (req, res) => {
        const { name, description, date } = req.body;

        if (!name || !date) {
            return res.status(400).send('Name and date are required');
        }

        db.run(
            `INSERT INTO events (name, description, date)
             VALUES (?, ?, ?)`,
            [name, description || '', date],
            function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Database error during event creation');
                }
                res.status(201).json({ id: this.lastID });
            }
        );
    });

    // Read: Get all events
    router.get('/', (req, res) => {
        db.all('SELECT * FROM events', [], (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Database error fetching events');
            }
            res.json(rows);
        });
    });

    // Read: Get a specific event
    router.get('/:id', (req, res) => {
        const { id } = req.params;
        db.get('SELECT * FROM events WHERE id = ?', [id], (err, row) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Database error fetching event');
            }
            if (!row) {
                return res.status(404).send('Event not found');
            }
            res.json(row);
        });
    });

    // Update an event
    router.put('/:id', (req, res) => {
        const { id } = req.params;
        const { name, description, date } = req.body;

        if (!name && description == null && date == null) {
            return res.status(400).send('Nothing to update');
        }

        const updates = [];
        const params = [];

        if (name !== undefined) {
            updates.push('name = ?');
            params.push(name);
        }
        if (description !== undefined) {
            updates.push('description = ?');
            params.push(description);
        }
        if (date !== undefined) {
            updates.push('date = ?');
            params.push(date);
        }

        params.push(id);

        db.run(
            `UPDATE events SET ${updates.join(', ')} WHERE id = ?`,
            params,
            function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Database error updating event');
                }
                if (this.changes === 0) {
                    return res.status(404).send('Event not found');
                }
                res.json({ message: 'Event updated successfully' });
            }
        );
    });

    // Delete an event
    router.delete('/:id', (req, res) => {
        const { id } = req.params;

        db.run('DELETE FROM events WHERE id = ?', [id], function (err) {
            if (err) {
                console.error(err);
                return res.status(500).send('Database error deleting event');
            }
            if (this.changes === 0) {
                return res.status(404).send('Event not found');
            }
            res.json({ message: 'Event deleted successfully' });
        });
    });

    return router;
}

module.exports = {
    createEventsRouter,
};
