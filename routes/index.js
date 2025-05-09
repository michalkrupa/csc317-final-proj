const express = require('express');

function createIndexRouter(db) {
    const router = express.Router();

    router.get('/', function(req, res) {
      db.all('SELECT * FROM products WHERE is_sale = true', [], (err, sale_products) => {
        db.all('SELECT * FROM products WHERE is_featured = true', [], (err, featured_products) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Database error fetching products');
          }
          res.render(
            'index',{
              title: 'Home',
              user: {
                email: req.session?.email,
              },
              sale_products: sale_products,
              featured_products: featured_products,
            });
        });
      });
    });

    router.get('/about', function(req, res) {
      return res.render('about', {title: 'About'});
    });

    router.get('/faq', function(req, res) {
      return res.render('faq', {title: 'FAQs'});
    });

    return router;
}

module.exports = {
    createIndexRouter,
};
