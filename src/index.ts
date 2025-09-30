import { Express } from 'express';

const express = require('express');
const bodyParser = require('body-parser');

const app: Express = express();
const cors = require('cors');
require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: false }));

const userRoutes = require('./routes/userRoutes.ts');

// app.use(cors())
// app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// app.use(userRoutes);

app.use(userRoutes);

// const listener = app.listen(process.env.PORT || 3000, () => {
//   console.log('Your app is listening on port ' + listener.address().port);
// });
