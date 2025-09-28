const express = require('express');

const router = express.Router();

router.post('/api/users', (req, res, next) => {
  console.log(req);
  res.redirect('/');
});

module.exports = router;
