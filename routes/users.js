const express = require('express');
const bcrypt = require('bcrypt'); // Optional, recommended

function createUsersRouter(db) {
    const router = express.Router();
    // List all users
    router.get('/', (req, res) => {
        db.all('SELECT * FROM users', [], (err, rows) => {
            if (err) {
                console.error(err);
                res.status(500).send('Database error');
            } else {
                res.json(rows);
            }
        });
    });

    // Show registration form
    router.get('/register', (req, res) => {
        res.render('users/register', {});
    });

    // Handle registration
    router.post('/register', (req, res) => {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).send('All fields are required');
        }

        // Optional: Hash password before storing
        const hashedPassword = bcrypt.hashSync(password, 10);
        const {firstName, lastName} = name.split(' ');

        db.run(
            'INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)',
            [email, hashedPassword, firstName, lastName],
            function (err) {
                if (err) {
                    console.error(err);
                    if (err.message.includes('UNIQUE')) {
                        res.status(400).render('users/register', {error: 'Email already in use'})
                    } else {
                        res.status(400).render('users/register', {error: 'Database error'})
                    }
                } else {
                    const userId = this.lastID;

                    // 2. Automatically create a wishlist for the new user
                    db.run('INSERT INTO wishlist (user_id) VALUES (?)', [userId], function (wishlistErr) {
                        if (wishlistErr) {
                            console.error(wishlistErr);
                            return res.status(500).send('Database error during wishlist creation');
                        }
                        return res.render('users/login', {
                            message: 'Registration successful! Proceed to login.',
                            title: 'Login',
                            pageClass: 'login-page',
                        });
                    });
                }
            }
        );
    });

    // Show login form
    router.get('/login', (req, res) => {
        res.render('users/login', {
            pageClass: 'login-page',
            title: 'Login',
        })
    });

    // Handle login
    router.post('/login', (req, res) => {
        const { email, password } = req.body;

        db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
            if (err) {
                console.error(err);
                return res.status(500).render('users/login', {
                    error: 'Database error!',
                    title: 'Login',
                    pageClass: 'login-page',
                });            }

            if (!user) {
                return res.status(401).render('users/login', {
                    error: 'Invalid email or password!',
                    title: 'Login',
                    pageClass: 'login-page',
                });
            }

            // Check hashed password
            const passwordMatch = bcrypt.compareSync(password, user.password);
            if (!passwordMatch) {
                return res.status(401).render('users/login', {
                    error: 'Invalid username or password!',
                    title: 'Login',
                    pageClass: 'login-page',
                });
            }

            // Successful login
            req.session.userId = user.id;
            req.session.email = user.email;
            req.session.message = 'Login successful!';
            return res.redirect('/');
        });
    });

    // Handle logout
    router.get('/logout', (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Could not log out');
            }
            res.send('Logged out. <a href="/users/login">Login again</a>');
        });
    });


    // View Profile
    router.get('/profile', (req, res) => {
        const userId = req.session.userId;
        if (!userId) return res.status(401).send('You must be logged in.');

        db.get('SELECT email, phone FROM users WHERE id = ?', [userId], (err, user) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Database error');
            }
            if (!user) return res.status(404).send('User not found');
            res.render('users/profile', {
                title: 'Your Profile',
                user,
                pageClass: 'profile-page',
                message: req.session.message,
            });
            delete req.session.message;
        });
    });


    // Handle Profile Update
    router.post('/profile/update', (req, res) => {
        const userId = req.session.userId;
        if (!userId) return res.status(401).send('You must be logged in.');

        const { email, phone, password } = req.body;

        if (!email) return res.status(400).send('Email is required');

        const updates = [];
        const params = [];

        updates.push('email = ?');
        params.push(email);

        if (phone !== undefined) {
            updates.push('phone = ?');
            params.push(phone);
        }

        if (password) {
            const hashedPassword = bcrypt.hashSync(password, 10);
            updates.push('password = ?');
            params.push(hashedPassword);
        }

        params.push(userId);

        db.run(
            `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
            params,
            function (err) {
                if (err) {
                    console.error(err);
                    if (err.message.includes('UNIQUE')) {
                        return res.status(400).render('users/profile', {
                            error: 'Email already in use',
                            user: { email, phone },
                            title: 'Your Profile',
                            pageClass: 'profile-page',
                        });
                    }
                    return res.status(500).send('Database error');
                }
                req.session.message = 'Profile updated successfully!';
                res.redirect('/users/profile');
            }
        );
    });

    return router;
}

module.exports = {
  createUsersRouter: createUsersRouter,
}
