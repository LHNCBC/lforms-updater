// Tests for the browser-generated script

const assert = require('assert');
if (!global.window)
  global.window = {}; // The browser version assigns to window

describe('browser-generated script', ()=> {
  it('should have an update function that sets lformsVersion', ()=>{
    require(require('path').join(__dirname, '../browser/updater'));
    let result = window.lformsUpdater.update({}); // an empty LForms definition
    assert(result.lformsVersion);
  });
});
