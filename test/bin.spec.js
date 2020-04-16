// Tests for the command-line tool

const assert = require('assert');
const path = require('path');
const UPDATE_VERSION = '22.0.0';
describe('cli', ()=>{
  it('should update an LForms form', ()=>{
    let cliPath = path.join(__dirname, '../bin/updater.js');
    let dataPath = path.join(__dirname, './' + UPDATE_VERSION + '/weightHeightLForms.json');
    let results = require('child_process').execSync(cliPath +' -f ' + dataPath + ' -v ' + UPDATE_VERSION);
    let resultJSON = JSON.parse(results);
    assert(resultJSON.lformsVersion); // lformsVersion was not set in dataPath
  });
});
