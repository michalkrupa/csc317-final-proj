const express = require('express');

function createAboutRouter(db) {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.render('about', { title: 'About Us' });
  });

  return router;
}

module.exports = {
  createAboutRouter,
};