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
      whoisServersRaw = whoisServersRaw.slice(5, -3); // Cut first comments and last newlines
      whoisServersRaw = whoisServersRaw.map(x => x.split(' '));
      whoisServersRaw.forEach(([tld, server]) => {
        result[tld] = server;
      });
      fs.writeFile('whoisServers.json', JSON.stringify(result), () => console.log('Done writing'));
    });
  } else {
    console.error(`Error ${res.statusCode}`);
  }
});