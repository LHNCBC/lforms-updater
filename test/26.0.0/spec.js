const assert = require('assert');
const fs = require('fs');
const path = require('path');
const updater = require('../../source/index');
const util = require('../../source/util');

const UPDATE_VERSION = '26.0.0';

describe(UPDATE_VERSION, function() {
  describe('Questionnaire', function() {
    let qDefData, qDef;
    before(() => {
      qDefData = fs.readFileSync(
        path.join(__dirname, './weightHeightQ.json')).toString();
    });

    describe('updated unversioned Questionnaire', () => {
      let revised;
      before(() => {
        qDef = JSON.parse(qDefData);
        revised = updater.update(qDef, UPDATE_VERSION);
      });

      it('should have the LForms version updated', ()=>{
        assert.equal(util.versionFromTag(revised.meta.tag[0]), UPDATE_VERSION);
      });
    });
  });


  describe('LForms definition', function() {
    let lfDefData, lfDef;
    before(() => {
      lfDefData = fs.readFileSync(
        path.join(__dirname, './weightHeightLForms.json')).toString();
    });

    describe('updated unversioned Questionnaire', () => {
      let revised;
      before(() => {
        lfDef = JSON.parse(lfDefData);
        revised = updater.update(lfDef, UPDATE_VERSION);
      });

      it('should have updated templateOptions not explicitly specified', ()=> {
        assert.equal(revised.templateOptions.hideFormControls, true);
        assert.equal(revised.templateOptions.showFormHeader, true);
      });

      it('should have the LForms version updated', ()=>{
        assert.equal(revised.lformsVersion, UPDATE_VERSION);
      });
    });
  });
});
