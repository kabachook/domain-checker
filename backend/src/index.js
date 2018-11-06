const process = require('process');
const express = require('express');
const Redis = require('ioredis');
const rootHandler = require('./handlers/root');
const domainHandler = require('./handlers/domain');
const wsHandler = require('./handlers/ws');

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const hostname = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3000;

const app = express();
// eslint-disable-next-line no-unused-vars
const expressWs = require('express-ws')(app);

// Connect to the database and add to req
const redisClient = new Redis(REDIS_URL);

// Let handlers reuse redis connection
app.use((req, res, next) => {
  req.redisClient = redisClient;
  return next();
});

app.get('/', rootHandler);
app.get('/domain/:domain', domainHandler);
app.ws('/ws', wsHandler);

app.listen(port, hostname, () => {
  console.log(`Server running at ${hostname}:${port}/`);
});