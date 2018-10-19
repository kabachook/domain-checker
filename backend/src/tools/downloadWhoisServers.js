#!/usr/bin/env node

const https = require('https');
const fs = require('fs');

let whoisServersRaw = [];
const result = {};

https.get('https://www.nirsoft.net/whois-servers.txt', (res) => {
  if (res.statusCode === 200) {
    res.on('data', (d) => {
      whoisServersRaw.push(d);
    }).on('end', () => {
      whoisServersRaw = Buffer.concat(whoisServersRaw).toString().split('\n');
      // whoisServersRaw = whoisServersRaw.slice(5, -3); // Cut first comments and last newlines
      whoisServersRaw.forEach(line => {
        if (line.indexOf(';') !== 0 && line.indexOf('\n') !== 0) {
          const [tld, server] = line.split(' ');

          result[tld] = server;
        }
      });
      fs.writeFile('whoisServers.json', JSON.stringify(result), () => console.log('Done writing'));
    });
  } else {
    console.error(`Error ${res.statusCode}`);
  }
});