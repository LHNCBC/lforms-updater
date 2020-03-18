#!/usr/bin/env node

const process = require('process');
let args = process.argv

if (args.length !=4 || args[2] != '-f') {
  console.log('Usage:  node bin/updater -f [path to form or resource]');
  process.exit(1);
}

let parsedJSON = JSON.parse(require('fs').readFileSync(args[3]));
let updater = require('../source');
console.log(JSON.stringify(updater.update(parsedJSON), null, 2));
