const express = require('express');

function createWishlistsRouter(db) {
    const router = express.Router();

    // Add product to wishlist
    router.post('/:userId/add', (req, res) => {
        const { userId } = req.params;
        const { product_id } = req.body;
        if (!product_id) return res.status(400).send('Product ID required');

        db.run('INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)', [userId, product_id], function (err) {
            if (err) {
                console.error(err);
                res.status(500).send('Database error');
            } else {
                res.json({ message: 'Product added to wishlist' });
            }
        });
    });

    // Remove product from wishlist
    router.post('/:userId/remove', (req, res) => {
        const { userId } = req.params;
        const { product_id } = req.body;
        if (!product_id) return res.status(400).send('Product ID required');

        db.run('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?', [userId, product_id], function (err) {
            if (err) {
                console.error(err);
                res.status(500).send('Database error');
            } else {
                res.json({ message: 'Product removed from wishlist' });
            }
        });
    });

    return router;
}

module.exports = {
    createWishlistsRouter,
};
