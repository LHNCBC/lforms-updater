const assert = require('assert');
const fs = require('fs');
const path = require('path');
const updater = require('../../source/index');
const util = require('../../source/util');

const OLD_LINK_URI = "http://hl7.org/fhir/StructureDefinition/questionnaire-calculatedExpression";
const NEW_LINK_URI = "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression";

const UPDATE_VERSION = '25.0.0';

describe(UPDATE_VERSION, function() {
  describe('Questionnaire', function() {
    let qDefData, qDef;
    before(() => {
      qDefData = fs.readFileSync(
        path.join(__dirname, './weightHeightQ.json')).toString();
    });

    describe('updated unversioned Questionnaire', () => {
      let revised, bmiExt;
      before(() => {
        qDef = JSON.parse(qDefData);
        revised = updater.update(qDef, UPDATE_VERSION);
        bmiExt = revised.item[3].extension;
      });
      it('should have updated URLs for calculatedExpression', ()=> {
        assert.equal(bmiExt[1].url, NEW_LINK_URI);
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
      let revised, bmiExt;
      before(() => {
        lfDef = JSON.parse(lfDefData);
        revised = updater.update(lfDef, UPDATE_VERSION);
        bmiExt = revised.items[3].extension;
console.log(JSON.stringify(revised));
      });

      it('should have updated URLs for calculatedExpression', ()=> {
        assert.equal(bmiExt[0].url, NEW_LINK_URI);
      });

      it('should have the LForms version updated', ()=>{
        assert.equal(revised.lformsVersion, UPDATE_VERSION);
      });
    });
  });
});
