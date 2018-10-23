const fs = require('fs');
const {
  promisify
} = require('util');
const {
  checkDomain
} = require('../checker');

// TODO: load once and update at the runtime
const tlds = JSON.parse(fs.readFileSync(`${__dirname}/../../tlds.json`, 'utf-8'));

const domainHandler = async (req, res) => {
  const {
    domain
  } = req.params;
  const result = {};

  try {
    await Promise.all(tlds.map(async tld => {
      try {
        const avail = await checkDomain(domain, tld);

        console.log(`${domain}.${tld} ? ${avail}`);
        if (avail) {
          result[tld] = {
            available: true
          };
        } else {
          result[tld] = {
            available: false,
            whoisUrl: `https://whois.icann.org/en/lookup?name=${domain}.${tld}`
          };
        }
      } catch (e) {
        console.error(e);
        result[tld] = {
          status: 'error',
          message: e.toString()
        };
      }
    }));

    res.status(200).json(result);
  } catch (e) {
    console.error(e.error);
    res.status(500).json({
      'error': 'Internal server error'
    });
  }
};

module.exports = domainHandler;