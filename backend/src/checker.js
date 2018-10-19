const {
  execSync
} = require('child_process');
const fs = require('fs');

/**
 * Whois request timeout.
 * @const {number}
 * @default {2000}
 */
const WHOIS_TIMEOUT = process.env.WHOIS_TIMEOUT || 2000;

/**
 * Regexp to check if domain is valid.
 * @const {RegExp}
 */
const domainRegexp = /[a-z0-9]+.[a-z0-9]+/;

/**
 * Array of strings which occur in whois response if domain is available(not found).
 * @const {string[]}
 */
const domainWhoisAvailable = [
  'NOT FOUND',
  'The queried object does not exist',
  'No Data Found', 'No match for domain',
  'No entries found for the selected source(s).'
];

/**
 * Array of strings which occur in whois response if domain is NOT available.
 * @const {string[]}
 */
const domainWhoisNotAvailable = [
  'Domain Name:',
  'domain:'
];

/**
 * Object where key is TLD and value is whois server corresponding to this TLD. Used to send whois requests.
 */
let whoisServers;

/**
 * Parses given whois response to check availability.
 * @param {string} data Raw whois response.
 * @returns {boolean} True if domain available, false if not.
 * @throws {Error} 'Undefined whois response' else.
 */
const parseRawWhois = (data) => {
  const foundAvailable = domainWhoisAvailable.some(el => data.indexOf(el) >= 0);

  if (foundAvailable) return true;

  const foundNotAvailable = domainWhoisNotAvailable.some(el => data.indexOf(el) >= 0);

  if (foundNotAvailable) return false;

  throw Error('Undefined whois response');
};

/**
 * Checks if domain is available.
 * @param {string} name Base domain name w/o TLD.
 * @param {string} tld TLD.
 * @returns {boolean} true if available else false.
 * @throws {Error} 'Whois timed out' if WHOIS_TIMEOUT reached,
 *                 'Invalid domain' if domain is invalid,
 *                  raw execSync Error otherwise.
 */
const checkDomain = (name, tld) => {
  if (typeof whoisServers === 'undefined') {
    try {
      whoisServers = JSON.parse(fs.readFileSync(`${__dirname}/../whoisServers.json`, 'utf-8'));
      // console.log(`Whois Servers:\n${whoisServers}`);
    } catch (e) {
      console.error(e);
      throw Error("Error while reading whois servers' file");
    }
  }
  const domain = `${name}.${tld}`;
  // TODO: check for invalid domain like 'example something.com'

  if (domainRegexp.test(domain)) {
    console.log(`Calling ${whoisServers[tld]} for ${domain}`);
    try {
      const response = parseRawWhois(execSync(`WHOIS_SERVER=${whoisServers[tld]} whois ${domain}`, {
        timeout: WHOIS_TIMEOUT
      }).toString());

      return response;
    } catch (e) {
      if (e.code === 'ETIMEDOUT') {
        throw Error('Whois timed out');
      } else {
        console.log(e.stderr.toString());
        console.log(e.error);
        throw e;
      }
    }
  }
  throw Error(`Invalid domain ${domain}`);
};

module.exports = {
  parseRawWhois,
  checkDomain
};