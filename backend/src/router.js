module.exports = class Router {
  constructor() {
    this.routes = {};
    this.paramRegexp = /\{(.*)\}/;
  }

  /**
   *
   * @param {string} method Handler method. GET, POST, etc
   * @param {string} url Url prefix
   * @param {function} handler Handler function (req: IncomingMessage, res: ServerResponse): void
   */
  register(method, url, handler) {
    this.routes[url] = {
      method,
      handler,
    };
  }

  /**
   * Set up a handler with GET method.
   * @param {string} url Url prefix.
   * @param {function} handler Handler function (req: IncomingMessage, res: ServerResponse): void.
   */
  get(url, handler) {
    this.routes[url] = {
      method: 'GET',
      handler,
    };
  }

  /**
   * Set up a handler with POST method.
   * @param {string} url Url prefix.
   * @param {function} handler Handler function (req: IncomingMessage, res: ServerResponse): void.
   */
  post(url, handler) {
    this.routes[url] = {
      method: 'POST',
      handler,
    };
  }

  /**
   * Handles request with appropriate route.
   * @param {IncomingMessage} req
   * @param {ServerResponse} res
   */
  handle(req, res) {
    const {
      url,
      method,
    } = req;
    try {
      if (this.routes[url].method === method) {
        this.routes[url].handler(req, res);
        console.info(`${url} 200`);
      } else {
        res.statusCode = 405;
        res.end('Method not allowed');
      }
    } catch (e) {
      if (e.name === 'TypeError') {
        console.error(`${url} 404`);
        res.statusCode = 404;
        res.end('404 Not found');
      }
    }
  }
};
