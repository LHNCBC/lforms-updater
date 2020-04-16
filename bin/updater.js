#!/usr/bin/env node

const process = require('process');
const path = require('path');
const fs = require('fs');
let updater = require('../source');
var args = require('minimist')(process.argv.slice(2));

if (!args['f'] && (!args['d'] || !args['o'])) {
  console.log('Usage:  node bin/updater \n' +
              '        -f [filepath to a form/resource file] \n' +
              '        -d [directory of form/resource .json files] -o [output directory] \n' +
              '        -v [version to be updated to, optional] \n' +
              'Note: Use -f option to convert a single file. The result is in STDOUT. \n' +
              '      Use -d and -o options to convert all the .json files in a directory.');
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

  let dirents;
  try {
    dirents = fs.readdirSync(inputDir, { withFileTypes: true });
  }
  catch (err) {
    return console.log('Unable to read directory: ' + err);
  }

  const filesNames = dirents.reduce(function(filtered, dirent) {
    if (dirent.isFile() && dirent.name.match(/\.json$/i)) {
      filtered.push(dirent.name);
    }
    return filtered;
  }, []);

  if (filesNames.length === 0) {
    return console.log('No .json files in directory: ' + inputDir);
  }

  //listing all files using forEach
  filesNames.forEach(function (fileName) {
    let inputFile = path.join(inputDir, fileName);
    let parsedJSON = JSON.parse(fs.readFileSync(inputFile));
    let outputFile = path.join(outputDir, fileName);
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
        console.log(fileName + ' has been updated in ' + outputDir);
      });
    }
    else {
      console.log(inputFile + ' cannot be updated!');
    }
  });

}

