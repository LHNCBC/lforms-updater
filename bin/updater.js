#!/usr/bin/env node

const process = require('process');
const path = require('path');
const fs = require('fs');
let updater = require('../source');
var args = require('minimist')(process.argv.slice(2));

if (!args['f'] && (!args['d'] || !args['o'])) {
  console.log('Usage:  node bin/updater \n' +
              '        -f [filepath to a form/resource] \n' +
              '        -d [directory of form/resource files] -o [output directory] \n' +
              '        -v [version to be updated to, optional] \n' +
              'Either -f or, -d and -o are required');
  process.exit(1);
}

// input is a file
if (args['f']) {
  let parsedJSON = JSON.parse(fs.readFileSync(args['f']));
  // with a version specified
  if (args['v']) {
    console.log(JSON.stringify(updater.update(parsedJSON, args['v']), null, 2));
  }
  // no version specified
  else {
    console.log(JSON.stringify(updater.update(parsedJSON), null, 2));
  }
}
// input is a directory
else if (args['d']) {
  //joining path of directory
  const inputDir = path.resolve(process.cwd(), args['d']);
  const outputDir = path.resolve(process.cwd(), args['o']);
  fs.readdir(inputDir, function (err, files) {
    //handling error
    if (err) {
      return console.log('Unable to read directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
      let inputFile = path.join(inputDir, file);
      let parsedJSON = JSON.parse(fs.readFileSync(inputFile));
      let outputFile = path.join(outputDir, file);
      let convertedJSONString = null;
      // with a version specified
      if (args['v']) {
        convertedJSONString = JSON.stringify(updater.update(parsedJSON, args['v']), null, 2);
      }
      // no version specified
      else {
        convertedJSONString = JSON.stringify(updater.update(parsedJSON), null, 2);
      }
      if (convertedJSONString) {
        fs.writeFile(outputFile, convertedJSONString, (err) => {
          if (err) throw err;
          console.log(file + ' has been updated in ' + outputDir);
        });
      }
      else {
        console.log(inputFile + ' cannot be updated!');
      }
    });
  });
}

