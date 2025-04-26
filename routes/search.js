const express = require('express');

function createSearchRouter(db) {
  const router = express.Router();
  /* GET search result listing. */
  router.get('/', function(req, res, next) {
    res.render('search', { title: 'Search' });
  });

  return router;
}


module.exports = {
  createSearchRouter: createSearchRouter,
};
