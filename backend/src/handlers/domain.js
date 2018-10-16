const fs = require('fs');
const {
  checkDomain,
} = require('../utils');

// TODO: load once and update at the runtime
const tlds = JSON.parse(fs.readFileSync(`${__dirname}/../../tlds.json`, 'utf-8'));

const domainHandler = (req, res) => {
  const {
    domain,
  } = req.params;
  const result = {};
  tlds.forEach((tld) => {
    try {
      const avail = checkDomain(domain, tld);
      console.log(`${domain}.${tld} ? ${avail}`);
      if (avail) {
        result[tld] = {
          available: true,
        };
      } else {
        result[tld] = {
          available: false,
          whoisUrl: `https://whois.icann.org/en/lookup?name=${domain}.${tld}`,
        };
      }
    } catch (e) {
      console.error(e);
      if (e.name === 'Undefined whois response') {
        result[tld] = {
          undefined: true,
        };
      } else {
        res.status(500).json({
          error: e.name,
        });
      }
    }
  });
  res.status(200).json(result);
};

module.exports = domainHandler;
