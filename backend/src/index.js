const process = require('process');
const express = require('express');
const rootHandler = require('./handlers/root');
const domainHandler = require('./handlers/domain');

const hostname = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3000;

const server = express();

server.get('/', rootHandler);
server.get('/domain/:domain', domainHandler);

server.listen(port, hostname, () => {
  console.log(`Server running at ${hostname}:${port}/`);
});