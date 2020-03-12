// Tests for the command-line tool

const assert = require('assert');
const path = require('path');

describe('cli', ()=>{
  it.only('should update an LForms form', ()=>{
    let cliPath = path.join(__dirname, '../bin/updater.js');
    let dataPath = path.join(__dirname, './22.0.0/weightHeightLForms.json');
    let results = require('child_process').execSync(cliPath +' -f ' + dataPath);
    let resultJSON = JSON.parse(results);
    assert(resultJSON.lformsVersion); // lformsVersion was not set in dataPath
  });
});
