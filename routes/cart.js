const express = require('express');

function createCartRouter(db) {
    const router = express.Router();

    // Add item to cart (POST route)
    router.post('/add', (req, res) => {
        const { product_id, product_name, price_per_unit, quantity } = req.body;

        if (!product_id || !product_name || !price_per_unit) {
            return res.status(400).send('Product info required');
        }

        const userId = req.session.userId || null;
        const sessionId = req.session.id;

        db.run(
            `INSERT INTO cart (user_id, session_id, product_id, product_name, quantity, price_per_unit)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, sessionId, product_id, product_name, quantity || 1, price_per_unit],
            function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Database error');
                }

                res.redirect('/cart');
            }
        );
    });

    // View Cart Items (GET route)
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

    // Remove item from cart (POST route)
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

    // Checkout View (GET route)
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

                let subtotal = 0;
                for (const item of rows) {
                    subtotal += item.price_per_unit * item.quantity;
                }

                const CALIFORNIA_TAX_RATE = 0.0725;
                const DELIVERY_FEE = 3.00;
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

    router.post('/checkout/submit', (req, res) => {
        const userId = req.session.userId || null;
        const sessionId = req.session.id;

        db.run(
            `DELETE FROM cart WHERE user_id = ? OR session_id = ?`,
            [userId, sessionId],
            function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error clearing cart after checkout');
                }

                res.render('cart/confirmation', {
                    title: 'Order Placed',
                    message: 'Thank you! Your order has been placed successfully.',
                });
            }
        );
    });

    return router;
}

module.exports = {
    createCartRouter,
};
