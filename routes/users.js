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
                    res.send('Registration successful! <a href="/users/login">Login here</a>');
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

    return router;
}

module.exports = {
  createUsersRouter: createUsersRouter,
}
