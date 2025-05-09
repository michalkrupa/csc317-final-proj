const express = require('express');

function createLearningRouter() {
    const router = express.Router();

    router.get('/', function(req, res) {
        return res.render('learning/index', {title: 'All Our Programs'});
    });

    router.get('/education', function(req, res) {
        return res.render('learning/education', {title: 'Gem Education'});
    });

    router.get('/healing', function(req, res) {
        return res.render('learning/healing', {title: 'Healing Powers'});
    });

    return router;
};

module.exports = {
    createLearningRouter: createLearningRouter,
};