const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Connect to SQLite DB
const db = new sqlite3.Database('./db/products.db', (err) => {
  if (err) console.error('Database error:', err.message);
  else console.log('Connected to SQLite database.');
});

// Create table and seed data if needed
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL,
      image TEXT
    )
  `);

  const products = [
    ["Emerald Pendant", "A pear-shaped lab grown emerald rests within a bezel setting with an open back to allow maximum light to reach the gem.", 120.00, "product1.jpeg"],
    ["Garnet Pendant", "Minimalistic design.The magnificent pear-shaped garnet captivates with its intense red hue.", 450.00, "product2.jpeg"],
    ["London Blue Topaz", "A pear-shaped London Blue topaz rests within a bezel setting with an open back to allow maximum light to reach the gem.", 175.00, "product3.jpeg"],
    ["Diamond Engagement Ring", "A pear-shaped diamond accent on each side of the center gem", 4500.00, "product4.jpeg"],
    ["Emerald Pendant", "The emerald-cut lab-grown emerald is mounted in a four prong setting and linked to a plain bale.", 320.00, "product5.jpeg"],
    ["Pink Tourmaline", "Hand selected Tourmaline by our GIA-certified gemologists for its exceptional characteristics and rarity.", 2750.00, "product6.jpeg"],
    ["Pink Sapphire", "Pink Sapphire, GIA-certified gemologists for its exceptional characteristics and rarity.", 1600.00, "product7.jpeg"],
    ["Blue Round Sapphire", "Blue Round Sapphire has been hand selected by our GIA-certified gemologists for its exceptional characteristics and rarity.", 1950.00, "product8.jpeg"],
    ["Oval Aquamarine", "Oval Aquamarine has been hand selected by our GIA-certified gemologists for its exceptional characteristics and rarity.", 1190.00, "product9.jpeg"],
    ["Hydrangea Bouquet Earrings", "London Blue topaz, a sapphire, an aquamarine, and a shining diamond gathers together for a truly unique look in these earrings.", 595.00, "product10.jpeg"],
    ["Diamond Earrings", "Our 3-prong martini setting keeps the metal minimal so more light can shine through the colorless lab diamond.", 1110.00, "product11.jpeg"],
    ["Diamond Earrings", "A bold plumeria flower is adorned with shimmering pavé lab diamonds in these whimsical, nature-inspired stud earrings.", 1200.00, "product12.jpeg"]
  ];  

  db.get('SELECT COUNT(*) AS count FROM products', [], (err, row) => {
    if (row.count === 0) {
      const stmt = db.prepare('INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)');
      products.forEach((product) => stmt.run(product));
      stmt.finalize();
      console.log("Inserted 12 products.");
    }
  });
});

// Use the products route
const productRoutes = require('./routes/products')(db);
app.use('/api/products', productRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
