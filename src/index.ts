import { Express } from 'express';
import { AddressInfo } from 'net';

import { initDB } from './utils/db';
import { userRoutes } from './routes/userRoutes';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

require('dotenv').config();

const app: Express = express();

initDB();
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());
app.use(express.static('public'));

app.get('/', (_, res) => {
  res.sendFile(path.resolve(__dirname + '/../views/index.html'));
});

app.use(userRoutes);

const listener = app.listen(process.env.PORT || 3000, () => {
  const adress = listener.address() as AddressInfo;

  console.log('Your app is listening on port ' + adress.port);
});
