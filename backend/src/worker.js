const redis = require('redis');
const {
  Queue
} = require('task-queue');
const {
  checkDomain
} = require('./checker');

/**
 * Config for Queue and RedisClient.
 */
const CONFIG = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  prefix: process.env.REDIS_PREFIX || 'queue:',
  timeout: process.env.TIMEOUT || 1
};

/**
 * Callback for `whois` msg type.
 * @param {string} name Domain name.
 * @param {string} tld TLD.
 * @param {RedisClient} redisClient Redis client. 
 */
const whoisCallback = async (name, tld, redisClient) => {
  let result = {}
  let queueResponse = new Queue(`response:${name}`, CONFIG, redisClient);

  queueResponse.on('error', (err) => {
    console.error(err);
  });

  try {
    const available = await checkDomain(name, tld);
    result = {
      tld,
      available
    }
  } catch (err) {
    result = {
      tld,
      error: err.toString()
    }
  }

  await queueResponse.sendMessage(result);
  queueResponse.quit();
}

/**
 * Functions to be called when received msg.
 */
const CALLBACKES = {
  'whois': whoisCallback
};


/**
 * Redis clienr. Only one to make less connections.
 */
const client = redis.createClient(CONFIG);

/**
 * Message receive queue.
 */
let queueWhois = new Queue('whois', CONFIG, client);

queueWhois.on('error', (err) => {
  console.error(err);
});

/**
 * Main worker loop.
 */
const main = async () => {
  while (true) {
    try {
      const msg = await queueWhois.receiveMessage();
      if (typeof (msg) === 'undefined') {
        continue;
      }
      CALLBACKES[msg.type](...msg.args, client);

    } catch (err) {
      console.error(err);
    }
  }
}

main();