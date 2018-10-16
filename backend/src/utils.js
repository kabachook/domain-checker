const {
  exec,
  execSync,
} = require('child_process');

const domainRegexp = /[a-z0-9]+.[a-z0-9]+/;
const domainWhoisKeyFound = 'Domain Name';
const domainWhoisKeyNotFound = 'The queried object does not exist';

const domainWhoisAvailable = ['NOT FOUND', 'The queried object does not exist'];
const domaunWhoisNotAvailable = ['Domain Name'];

/**
 * Parses given whois response to check availability.
 * @param {string} data Raw whois response.
 * @returns {boolean} True if domain available, false if not.
 * @throws {Error} 'Underfined whois response' else.
 */
const parseRawWhois = (data) => {
  const foundAvailable = domainWhoisAvailable.some(el => data.indexOf(el) >= 0);
  if (foundAvailable) return true;
  const foundNotAvailable = domaunWhoisNotAvailable.some(el => data.indexOf(el) >= 0);
  if (foundNotAvailable) return false;
  throw Error('Undefined whois response');
};

/**
 * Checks if domain is available.
 * @param {sting} domain
 * @returns {boolean} true if available else false.
 */
const checkDomain = (name, tld) => {
  const domain = `${name}.${tld}`;
  // TODO: check for invalid domain like 'example something.com'
  if (domainRegexp.test(domain)) {
    return parseRawWhois(execSync(`WHOIS_SERVER=${tld}.whois-servers.net whois ${domain}`).toString());
  }
  throw Error(`Invalid domain ${domain}`);
};

module.exports = {
  parseRawWhois,
  checkDomain,
};
