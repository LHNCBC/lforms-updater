// Tests for the browser-generated script

const assert = require('assert');

describe('browser-generated script', ()=> {
  it('should have an update function that sets lformsVersion', ()=>{
    require(require('path').join(__dirname, '../browser/updater'));
    let result = lformsUpdater.update({}); // an empty LForms definition
    assert(result.lformsVersion);
  });
});
