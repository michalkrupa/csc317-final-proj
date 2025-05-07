const express = require('express');

function createNewsletterRouter(db) {
  const router = express.Router();
  
  router.post('/subscribe', (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).send('Email required');
    
    db.run('INSERT INTO newsletter_subs (email, opt_in) VALUES (?, ?)', [email, 1], function (err) {
      if (err) {
        console.error(err);
        res.status(500).send('Database error');
      } else {
        res.json({ message: 'Subscribed', id: this.lastID });
      }
    });
  });
  
  router.post('/unsubscribe', (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).send('Email required');
    
    db.run('UPDATE newsletter_subs SET opt_in = 0 WHERE email = ?', [email], function (err) {
      if (err) {
        console.error(err);
        res.status(500).send('Database error');
      } else {
        res.json({ message: 'Unsubscribed' });
      }
    });
  });
  
  return router;
}


module.exports = {
  createNewsletterRouter: createNewsletterRouter,
};
