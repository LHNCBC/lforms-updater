// Writes source/versionList.json, which contains a list of the versions for
// which we have update steps.
// This should be run as part of the build.
const fs=require('fs');
const semverRevSort = require('semver/functions/rsort');
fs.writeFileSync('source/versionList.json',
  '["'+ semverRevSort(
    fs.readdirSync('source/versionUpdates').map(
      (f)=>f.slice(0, -3) // remove .js exension
  )).join('","')+'"]');
