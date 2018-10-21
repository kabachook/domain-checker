#!/usr/bin/env node

const https = require('https');
const fs = require('fs');

let tlds = [];

https.get('https://data.iana.org/TLD/tlds-alpha-by-domain.txt', (res) => {
  if (res.statusCode === 200) {
    res.on('data', (d) => {
      tlds.push(d);
    }).on('end', () => {
      tlds = Buffer.concat(tlds).toString().split('\n');
      tlds = tlds.slice(1, -1); // Cut first commend and last newline
      tlds = tlds.map(x => x.toLowerCase());
      fs.writeFile('tlds.json', JSON.stringify(tlds), () => console.log('Done writing'));
    });
  }
});