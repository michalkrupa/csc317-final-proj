const express = require('express');

function createFaqRouter(db) {
    const router = express.Router();

    router.get('/faq', function(req, res, next) {
        res.render('faq', { title: 'FAQ' });
    });

    return router;
}

module.exports = {
    createFaqRouter,
};