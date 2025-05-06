// routes/products.js
const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // GET /api/products
  router.get('/', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  });

  return router;
};
