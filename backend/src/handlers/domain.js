const fs = require('fs');
const uuid = require('uuid/v4');
const {
  checkDomain
} = require('../checker');
const {
  RedisQueue
} = require('task-queue');

/**
 * Config for Queue and RedisClient.
 */
const QUEUE_WHOIS_PREFIX = 'queue:';

// TODO: load once and update at the runtime
const tlds = JSON.parse(fs.readFileSync(`${__dirname}/../../tlds.json`, 'utf-8'));

const domainHandler = async (req, res) => {
  const {
    domain
  } = req.params;
  const redisClient = req.redisClient;
  let result = {};

  try {
    const randId = uuid();
    const queueWhois = new RedisQueue({
      queueName: 'whois',
      prefix: QUEUE_WHOIS_PREFIX,
      redisClient: redisClient
    });

    queueWhois.on('error', (err) => {
      console.error(err);
    });

    await Promise.all(tlds.map(async tld => {
      try {
        await queueWhois.sendMessage({
          type: 'whois',
          args: [domain, tld],
          id: randId
        });
      } catch (e) {
        console.error(e);
        result = {
          status: 'error',
          message: e.toString()
        };
      }
    }));

    result = {
      id: randId
    };

    res.status(200).json(result);
  } catch (e) {
    console.error(e.error);
    res.status(500).json({
      'error': 'Internal server error'
    });
  }
};

module.exports = domainHandler;