const {
  exec,
} = require('child_process');

const domainRegexp = /[a-z0-9]+.[a-z0-9]+/;
const domainWhoisKeyFound = 'Domain Name';
const domainWhoisKeyNotFound = 'The queried object does not exist';

/**
 *
 * @param {string} data Raw whois response.
 * @returns {object} Parsed whois response.
 */
const parseRawWhois = (data) => {
  const result = {};
  for (const row in data.split('\n')) {
    if (row.find('>>>') !== -1) break;
    const {
      key,
      value,
    } = row.split(':');
    result[key] = value;
  }
  return result;
};

/**
 * Checks if domain is available
 * @param {sting} domain
 * @returns {boolean}
 */
const checkDomain = (name, tld) => {
  const domain = `${name}.${tld}`;
  // TODO: check for invalid domain like 'example something.com'
  if (domainRegexp.test(domain)) {
    let data;
    exec(`WHOIS_SERVER=${tld}.whois-servers.net whois ${domain}`, (err, stdout, stderr) => {
      if (err) {
        throw Error(err);
      }
      data = parseRawWhois(stdout);
    });
    if (data[domainWhoisKeyFound]) {
      return true;
    }
    if (data[domainWhoisKeyNotFound]) {
      return false;
    }
    throw Error('Unknown whois response');
  } else {
    throw Error(`Invalid domain ${domain}`);
  }
};

module.exports = {
  parseRawWhois,
  checkDomain,
};
