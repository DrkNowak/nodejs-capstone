import { Express } from 'express';

const express = require('express');

const router: Express = express.Router();

router.post('/api/users', (req, res) => {
  const { body } = req;
  console.log(req, '');
  res.status(404).send('Sorry, we cannot find that!');

  res.redirect('/');
});

module.exports = router;
