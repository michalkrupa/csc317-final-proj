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
        res.send(`
            <h1>Register</h1>
            <form method="POST" action="/users/register">
                <input name="username" placeholder="Username" required />
                <input name="email" placeholder="Email" type="email" required />
                <input name="password" type="password" placeholder="Password" required />
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <a href="/users/login">Login here</a></p>
        `);
    });

    // Handle registration
    router.post('/register', (req, res) => {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).send('All fields are required');
        }

        // Optional: Hash password before storing
        const hashedPassword = bcrypt.hashSync(password, 10);

        db.run(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword],
            function (err) {
                if (err) {
                    console.error(err);
                    if (err.message.includes('UNIQUE')) {
                        res.status(400).send('Username or Email already in use');
                    } else {
                        res.status(500).send('Database error');
                    }
                } else {
                    const userId = this.lastID;

                    // 2. Automatically create a wishlist for the new user
                    db.run('INSERT INTO wishlist (user_id) VALUES (?)', [userId], function (wishlistErr) {
                        if (wishlistErr) {
                            console.error(wishlistErr);
                            return res.status(500).send('Database error during wishlist creation');
                        }
                        res.send('Registration successful! <a href="/users/login">Login here</a>');
                    });
                }
            }
        );
    });

    // Show login form
    router.get('/login', (req, res) => {
        res.send(`
            <h1>Login</h1>
            <form method="POST" action="/users/login">
                <input name="username" placeholder="Username" required />
                <input name="password" type="password" placeholder="Password" required />
                <button type="submit">Login</button>
            </form>
        `);
    });

    // Handle login
    router.post('/login', (req, res) => {
        const { username, password } = req.body;

        db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Database error');
            }

            if (!user) {
                return res.status(401).send('Invalid username or password');
            }

            // Check hashed password
            const passwordMatch = bcrypt.compareSync(password, user.password);
            if (!passwordMatch) {
                return res.status(401).send('Invalid username or password');
            }

            // Successful login
            req.session.userId = user.id;
            req.session.username = user.username;

            res.send(`Logged in as ${user.username}. <a href="/users/logout">Logout</a>`);
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

        db.get('SELECT username, email, phone FROM users WHERE id = ?', [userId], (err, user) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Database error');
            }
            if (!user) return res.status(404).send('User not found');

            res.send(`
                <h1>Your Profile</h1>
                <p><strong>Username:</strong> ${user.username}</p>
                <form method="POST" action="/users/profile/update">
                    <input name="email" value="${user.email}" placeholder="Email" required />
                    <input name="phone" value="${user.phone || ''}" placeholder="Phone Number" />
                    <input name="password" type="password" placeholder="New Password (optional)" />
                    <button type="submit">Update Profile</button>
                </form>
                <p><a href="/users/logout">Logout</a></p>
            `);
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
                        return res.status(400).send('Email already in use');
                    }
                    return res.status(500).send('Database error');
                }
                res.send('Profile updated successfully! <a href="/users/profile">Back to profile</a>');
            }
        );
    });

    return router;
}

module.exports = {
  createUsersRouter: createUsersRouter,
}
