const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Connect to SQLite DB or create if doesn't exist
const db = new sqlite3.Database('./db/products.db', (err) => {
  if (err) console.error('Database error:', err.message);
  else console.log('Connected to SQLite database.');
});

// Create products table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL,
      image TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Products table created (or already exists).');
    }
  });

  // Insert products if the table is empty
  
  const products = [
    ["Amethyst Ring", "Elegant purple gemstone ring.", 120.00, "product1.jpeg"],
    ["Emerald Necklace", "Vibrant green emerald pendant.", 250.00, "product2.jpeg"],
    ["Ruby Earrings", "Bold ruby gemstone earrings.", 180.00, "product3.jpeg"],
    ["Sapphire Bracelet", "Blue sapphire stones in silver.", 210.00, "product4.jpeg"],
    ["Diamond Pendant", "Classic diamond solitaire necklace.", 320.00, "product5.jpeg"],
    ["Topaz Brooch", "Yellow topaz brooch with vintage design.", 145.00, "product6.jpeg"],
    ["Opal Ring", "Iridescent opal gemstone ring.", 160.00, "product7.jpeg"],
    ["Citrine Studs", "Golden citrine stud earrings.", 95.00, "product8.jpeg"],
    ["Turquoise Cuff", "Bold turquoise in handcrafted cuff.", 190.00, "product9.jpeg"],
    ["Garnet Chain", "Dark red garnet on gold chain.", 130.00, "product10.jpeg"],
    ["Moonstone Charm", "Soft glowing moonstone charm.", 110.00, "product11.jpeg"],
    ["Aquamarine Ring", "Calm blue aquamarine in silver.", 200.00, "product12.jpeg"]
  ];

  db.get('SELECT COUNT(*) AS count FROM products', [], (err, row) => {
    if (err) {
      console.error('Error checking product count:', err.message);
    } else if (row.count === 0) {
      // Insert products if the table is empty
      const stmt = db.prepare('INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)');
      products.forEach((product) => {
        stmt.run(product);
      });
      stmt.finalize();
      console.log("12 products inserted into the database.");
    }
  });
});

// Sample endpoint to get products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
