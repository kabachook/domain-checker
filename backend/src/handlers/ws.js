const {
  RedisQueue
} = require('task-queue');

const QUEUE_RESPONSE_PREFIX = 'queue_response:';
const QUEUE_TIMEOUT = 3;
const REDIS_TLDCOUNT = 'tldCount';

const wsHandler = async (ws, req) => {
  let {
    redisClient
  } = req;

  const tldCount = +await redisClient.get(REDIS_TLDCOUNT);

  console.log(`Number of tlds: ${tldCount}`);

  ws.on('message', async (msg) => {
    if (msg.length === 36) { // check if msg is id
      if (await redisClient.exists(QUEUE_RESPONSE_PREFIX + msg)) {
        ws.send('OK');
        console.log(`Sending response for ${msg}, picking up from ${QUEUE_RESPONSE_PREFIX + msg}`);

        const queueResponse = new RedisQueue({
          queueName: msg,
          prefix: QUEUE_RESPONSE_PREFIX,
          timeout: QUEUE_TIMEOUT,
          redisClient
        });

        for (let i = 0; i < tldCount; i++) {
          const status = await queueResponse.receiveMessage();

          console.log(`Sending for tld ${status.tld}`);

          ws.send(JSON.stringify(status));
        }
        ws.send('DONE');
        ws.close();
      } else {
        ws.send('Wrong id');
      };
    }
  });
};

module.exports = wsHandler;