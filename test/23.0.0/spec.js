const assert = require('assert');
const fs = require('fs');
const path = require('path');
const updater = require('../../source/index');
const util = require('../../source/util');

const UPDATE_VERSION = '23.0.0';
let updateVersionTag_ = util.makeVersionTag(UPDATE_VERSION);

describe(UPDATE_VERSION, function() {
  describe('version tag', function() {
    it('should be moved from "display" to "code"', ()=>{
      let obsDefData = fs.readFileSync(
        path.join(__dirname, './obs.json')).toString();
      let obsDef = JSON.parse(obsDefData);
      assert(obsDef.meta.tag[0].display); // precondition check
      let updatedObs = updater.update(obsDef);
      assert(!obsDef.meta.tag[0].display);
      assert.equal(obsDef.meta.tag[0].code, updateVersionTag_);
    });
  });
});
