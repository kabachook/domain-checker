const process = require('process');
const http = require('http');
const Router = require('./router');
const rootHandler = require('./handlers/root');

const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;

const router = new Router();
router.get('/', rootHandler);

router.get('/{domain}', (req, res) => {
  res.statusCode = 200;
  res.end('WIP');
});

console.log(router.routes);

const server = http.createServer((req, res) => {
  // console.log(req.url);
  // if (req.url === '/') {
  //   res.statusCode = 200;
  //   res.setHeader('Content-Type', 'text/plain');
  //   res.end('Hello World\n');
  // }
  router.handle(req, res);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
