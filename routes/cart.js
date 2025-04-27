const express = require('express');

function createCartRouter(db) {
    const router = express.Router();

    // Add item to cart
    router.post('/add', (req, res) => {
        const { product_id, product_name, price_per_unit, quantity } = req.body;

        if (!product_id || !product_name || !price_per_unit) {
            return res.status(400).send('Product info required');
        }

        const userId = req.session.userId || null; // if user logged in
        const sessionId = req.session.id; // express-session session ID

        db.run(
            `INSERT INTO cart (user_id, session_id, product_id, product_name, quantity, price_per_unit)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, sessionId, product_id, product_name, quantity || 1, price_per_unit],
            function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Database error');
                }

                res.json({ message: 'Product added to cart', cartItemId: this.lastID });
            }
        );
    });

    // Remove item from cart
    router.post('/remove', (req, res) => {
        const { cart_item_id } = req.body;
        if (!cart_item_id) return res.status(400).send('Cart item ID required');

        const userId = req.session.userId || null;
        const sessionId = req.session.id;

        db.run(
            `DELETE FROM cart 
             WHERE id = ? AND (user_id = ? OR session_id = ?)`,
            [cart_item_id, userId, sessionId],
            function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Database error');
                }

                if (this.changes === 0) {
                    return res.status(404).send('Cart item not found');
                }

                res.json({ message: 'Product removed from cart' });
            }
        );
    });
    const CALIFORNIA_TAX_RATE = 0.0725; // 7.25%
    const DELIVERY_FEE = 3.00; // Flat delivery rate

    // View Cart Items
    router.get('/', (req, res) => {
        const userId = req.session.userId || null;
        const sessionId = req.session.id;

        db.all(
            `SELECT * FROM cart WHERE user_id = ? OR session_id = ?`,
            [userId, sessionId],
            (err, rows) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Database error loading cart');
                }

                res.render('cart/cart', { title: 'Your Cart', cartItems: rows });
            }
        );
    });

    // Checkout View
    router.get('/checkout', (req, res) => {
        const userId = req.session.userId || null;
        const sessionId = req.session.id;

        db.all(
            `SELECT * FROM cart WHERE user_id = ? OR session_id = ?`,
            [userId, sessionId],
            (err, rows) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Database error loading checkout');
                }

                // Calculate subtotal
                let subtotal = 0;
                for (const item of rows) {
                    subtotal += item.price_per_unit * item.quantity;
                }

                const tax = subtotal * CALIFORNIA_TAX_RATE;
                const total = subtotal + tax + DELIVERY_FEE;

                res.render('cart/checkout', {
                    title: 'Checkout',
                    cartItems: rows,
                    subtotal: subtotal.toFixed(2),
                    tax: tax.toFixed(2),
                    deliveryFee: DELIVERY_FEE.toFixed(2),
                    total: total.toFixed(2),
                });
            }
        );
    });

    return router;
}

module.exports = {
    createCartRouter,
};
