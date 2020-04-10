const assert = require('assert');
const fs = require('fs');
const path = require('path');
const updater = require('../../source/index');
const util = require('../../source/util');

const UPDATE_VERSION = '24.0.0';

describe(UPDATE_VERSION, function() {
  describe('linkId', function() {
    let allInOneDef, updatedAllInOneDef;
    beforeEach(() => {
      let allInOne = fs.readFileSync(
          path.join(__dirname, './allInOne.json')).toString();
      allInOneDef = JSON.parse(allInOne);
    });

    it('should have set a correct version', ()=>{
      updatedAllInOneDef = updater.update(allInOneDef, UPDATE_VERSION);
      assert.equal(updatedAllInOneDef.lformsVersion, UPDATE_VERSION);
    });

    it('should generate linkId on each item', () => {
      updatedAllInOneDef = updater.update(allInOneDef, UPDATE_VERSION);
      updatedAllInOneDef.items.forEach( item => {
        assert(item.linkId)
      })
    });

    it('should convert skip logic to use linkId', () => {
      assert.equal(allInOneDef.items[36].linkId, undefined);
      assert.equal(allInOneDef.items[36].skipLogic.conditions[0].source, "slALLSource1");
      assert.equal(allInOneDef.items[36].skipLogic.conditions[1].source, "slALLSource2");
      assert.equal(allInOneDef.items[41].items[1].skipLogic.conditions[0].source, "rpSource1");

      updatedAllInOneDef = updater.update(allInOneDef, UPDATE_VERSION);

      assert.equal(updatedAllInOneDef.items[36].linkId, "/slALLTargetItem");
      assert.equal(updatedAllInOneDef.items[36].skipLogic.conditions[0].source, "/slALLSource1");
      assert.equal(updatedAllInOneDef.items[36].skipLogic.conditions[1].source, "/slALLSource2");

      assert.equal(updatedAllInOneDef.items[41].items[1].skipLogic.conditions[0].source, "/repeatingSection1/rpSource1");
    });


    it('should convert data control to use linkId', () => {
      assert.equal(allInOneDef.items[42].items[1].dataControl[0].source.sourceItemCode, "itemWithExtraData");

      updatedAllInOneDef = updater.update(allInOneDef, UPDATE_VERSION);

      assert.equal(updatedAllInOneDef.items[42].items[1].dataControl[0].source.sourceLinkId, "/dataControlExamples/itemWithExtraData");

    });

  });

});


