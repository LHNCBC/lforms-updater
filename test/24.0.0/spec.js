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

    it('should have unique linkIds for items with the same questionCode', () => {
      updatedAllInOneDef = updater.update(allInOneDef, UPDATE_VERSION);
      uniqQuestionCodes = new Set(), uniqLinkIds = new Set();
      updatedAllInOneDef.items.forEach(item => {
        uniqQuestionCodes.add(item.questionCode);
        uniqLinkIds.add(item.linkId);
      });
      assert.equal(uniqLinkIds.size, updatedAllInOneDef.items.length);
      assert(uniqLinkIds.size > uniqQuestionCodes.size);
    });

    it('should have the correct linkId', () => {
      updatedAllInOneDef = updater.update(allInOneDef, UPDATE_VERSION);
      let nestedItem = updatedAllInOneDef.items.filter(item => item.questionCode === 'dup-code-001' && item.items)[0];
      assert.equal(nestedItem.items[0].linkId, '/dup-code-001.2/nest-code-001');
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

    it('should convert calculation method (BMI) to use linkId', () => {
      assert.equal(allInOneDef.items[57].calculationMethod.name, "BMI");
      assert.equal(allInOneDef.items[57].calculationMethod.value[0], "3141-9");
      assert.equal(allInOneDef.items[57].calculationMethod.value[1], "8302-2");

      updatedAllInOneDef = updater.update(allInOneDef, UPDATE_VERSION);

      assert.equal(allInOneDef.items[57].calculationMethod.name, "BMI");
      assert.equal(allInOneDef.items[57].calculationMethod.value[0], "/3141-9");
      assert.equal(allInOneDef.items[57].calculationMethod.value[1], "/8302-2");
    });

  });

});


