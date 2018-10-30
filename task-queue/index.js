const EventEmitter = require('events');
const {
  promisify
} = require('util');
const redis = require('redis');

/**
 * Simple task queue.
 */
class Queue extends EventEmitter {
  /**
   *
   * @param {string} name Queue name.
   * @param {object} config Redis options.
   * @param {RedisClient} client Redis client.
   */
  constructor(
    name,
    config = {
      prefix: 'queue:',
      host: '127.0.0.1',
      port: 6379,
      timeout: 30,
      options: {}
    },
    client = null
  ) {
    super();
    this.queueName = name;
    this.prefix = config.prefix;
    this.timeout = config.timeout || 30;

    if (typeof (client) === typeof (redis.RedisClient)) {
      this.client = client;
    } else {
      this.client = redis.createClient(config);
    }
    this.connected = this.client.connected || false;

    if (this.connected) {
      this.emit('connect');
    }

    this.client.on('connect', () => {
      this.connected = true;
      this.emit('connect');
    });

    this.client.on('error', err => {
      if (err.message.indexOf('ECONNREFUSED')) {
        this.connected = false;
        this.emit('disconnect');
      } else {
        this._handleError('Redis error\n' + err);
        this.emit('error');
      }
    });

    this._sadd = promisify(this.client.sadd).bind(this.client);
    this._lpush = promisify(this.client.lpush).bind(this.client);
    this._rpop = promisify(this.client.rpop).bind(this.client);
    this._brpop = promisify(this.client.brpop).bind(this.client);
  }

  /**
   * Create queue (writes queue name to set).
   * @param {string} name Queue name.
   * @returns {void}
   */
  async createQueue(name) {
    try {
      await this._sadd(`${this.prefix}QUEUES`, name);
    } catch (err) {
      this._handleError(err);
    }
  }

  /**
   * Send message to queue.
   * @param {string|object} msg Message.
   * @returns {void}
   */
  async sendMessage(msg) {
    if (typeof msg !== 'object' && typeof msg !== 'string') {
      this._handleError('Wrong message type.');
      return;
    }
    if (typeof msg === 'object') {
      this._lpush(this.queueName, JSON.stringify(msg));
      return;
    }
    this._lpush(this.queueName, msg);
  }
  /**
   * Wait for message.
   * @returns{object} Jsoned message.
   */
  async receiveMessage() {
    try {
      const packed = await this._brpop(this.queueName, this.timeout);

      if (!packed) {
        return undefined;
      }
      const msg = JSON.parse(packed[1]);

      return msg;
    } catch (err) {
      this._handleError(err);
    }
  }

  /**
   * Quit redis connection.
   * @returns {void}
   */
  quit() {
    this.client.quit();
  }

  /**
   * Handles errors.
   * @param {Error} err Error.
   * @returns {void}
   */
  _handleError(err) {
    console.log(err);
    return new Error(err);
  }
}

module.exports = {
  Queue
};