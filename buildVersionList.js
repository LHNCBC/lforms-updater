// Writes source/versionList.json, which contains a list of the versions for
// which we have update steps.
// This should be run as part of the build.
const fs=require('fs');
const semverRevSort = require('semver/functions/rsort');
const versionNums = fs.readdirSync('source/versionUpdates').map(
      (f)=>f.slice(0, -3)); // remove .js exension
fs.writeFileSync('source/versionList.json',
  '["'+ semverRevSort(versionNums).join('","')+'"]');

// Also create an file that requires each of the update files, to avoid dynamic
// imports.
let updateFnCode = "module.exports = {};\n";
versionNums.forEach(num => {
  updateFnCode += "module.exports['"+num+"'] = require('./versionUpdates/"+num+".js');\n";
});
fs.writeFileSync('source/updateFns.js', updateFnCode);
