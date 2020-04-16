const assert = require('assert');
const fs = require('fs');
const path = require('path');
const updater = require('../../source/index');
const util = require('../../source/util');

if (!global.window)
  global.window = {}; // The browser version assigns to window
require(path.join(__dirname, '../../browser/updater'));

const UPDATE_VERSION = '24.0.0';
const testCases = [
  {"test": "Binary version", "updater": updater},
  {"test": "Browser version", "updater": window.lformsUpdater}
];

for (let i=0, len=testCases.length; i<len; ++i) {
  (function (testCase) {
    describe(testCase.test, ()=> {
      describe('linkId', function() {
        let allInOneDef, updatedAllInOneDef;
        beforeEach(() => {
          let allInOne = fs.readFileSync(
              path.join(__dirname, './allInOne.json')).toString();
          allInOneDef = JSON.parse(allInOne);
        });

        it('should have set a correct version', ()=>{
          updatedAllInOneDef = testCase.updater.update(allInOneDef, UPDATE_VERSION);
          assert.equal(updatedAllInOneDef.lformsVersion, UPDATE_VERSION);
        });

        it('should generate linkId on each item', () => {
          updatedAllInOneDef = testCase.updater.update(allInOneDef, UPDATE_VERSION);
          updatedAllInOneDef.items.forEach( item => {
            assert(item.linkId)
          })
        });

        it('should convert skip logic to use linkId', () => {
          assert.equal(allInOneDef.items[36].linkId, undefined);
          assert.equal(allInOneDef.items[36].skipLogic.conditions[0].source, "slALLSource1");
          assert.equal(allInOneDef.items[36].skipLogic.conditions[1].source, "slALLSource2");
          assert.equal(allInOneDef.items[41].items[1].skipLogic.conditions[0].source, "rpSource1");

          updatedAllInOneDef = testCase.updater.update(allInOneDef, UPDATE_VERSION);

          assert.equal(updatedAllInOneDef.items[36].linkId, "/slALLTargetItem");
          assert.equal(updatedAllInOneDef.items[36].skipLogic.conditions[0].source, "/slALLSource1");
          assert.equal(updatedAllInOneDef.items[36].skipLogic.conditions[1].source, "/slALLSource2");

          assert.equal(updatedAllInOneDef.items[41].items[1].skipLogic.conditions[0].source, "/repeatingSection1/rpSource1");
        });

        it('should convert data control to use linkId', () => {
          assert.equal(allInOneDef.items[42].items[1].dataControl[0].source.sourceItemCode, "itemWithExtraData");

          updatedAllInOneDef = testCase.updater.update(allInOneDef, UPDATE_VERSION);

          assert.equal(updatedAllInOneDef.items[42].items[1].dataControl[0].source.sourceLinkId, "/dataControlExamples/itemWithExtraData");

        });

        it('should convert calculation method (BMI) to use linkId', () => {
          assert.equal(allInOneDef.items[57].calculationMethod.name, "BMI");
          assert.equal(allInOneDef.items[57].calculationMethod.value[0], "3141-9");
          assert.equal(allInOneDef.items[57].calculationMethod.value[1], "8302-2");

          updatedAllInOneDef = testCase.updater.update(allInOneDef, UPDATE_VERSION);

          assert.equal(allInOneDef.items[57].calculationMethod.name, "BMI");
          assert.equal(allInOneDef.items[57].calculationMethod.value[0], "/3141-9");
          assert.equal(allInOneDef.items[57].calculationMethod.value[1], "/8302-2");
        });

      });

    });

  })(testCases[i])
}


