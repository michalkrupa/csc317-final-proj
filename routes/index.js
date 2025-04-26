const express = require('express');

function createIndexRouter(db) {
    const router = express.Router();

    router.get('/', function(req, res, next) {
      res.render('index', { title: 'Express' });
    });

    return router;
}

module.exports = {
    createIndexRouter,
};
