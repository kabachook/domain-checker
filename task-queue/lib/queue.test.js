const {
  expect
} = require('chai');
const Redis = require('ioredis');
const {
  RedisQueue
} = require('./queue');

const REDIS_URL = 'redis://127.0.0.1:6379';
const QUEUE_NAME = 'test';
const QUEUE_TIMEOUT = 30;
const QUEUE_PREFIX = 'queue:';
const QUEUE_REDIS_CONFIG = {
  host: '127.0.0.1',
  port: 6379,
  password: null
};

describe('Queue', () => {
  let db;
  const message = {
    type: 'test',
    args: [
      'test',
      'io'
    ]
  };
  let queue;

  before(() => {
    db = new Redis(REDIS_URL);
    queue = new RedisQueue({
      queueName: QUEUE_NAME,
      prefix: QUEUE_PREFIX,
      timeput: QUEUE_TIMEOUT,
      redisConfig: QUEUE_REDIS_CONFIG
    });
  });

  after(() => {
    db.quit();
    queue.quit();
  });

  it('should send a message to queue', async () => {
    try {
      await queue.sendMessage(message);
      const response = await db.lindex(`${QUEUE_PREFIX}${QUEUE_NAME}`, 0);

      expect(JSON.parse(response)).to.deep.equal(message);
    } catch (e) {
      console.error(e);
      return e;
    }
  });

  it('should receive a message from the queue', async () => {
    try {
      const received = await queue.receiveMessage();

      expect(received).to.deep.equal(message);
    } catch (e) {
      console.error(e);
      return e;
    }
  });
});