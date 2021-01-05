const assert = require('assert');
const fs = require('fs');
const path = require('path');
const updater = require('../../source/index');
const util = require('../../source/util');

const NEW_LAUNCH_CONTEXT = 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-launchContext';

const UPDATE_VERSION = '29.0.0';

describe(UPDATE_VERSION, () => {
  describe('Questionnaire', () => {
    let qDefData, qDef;
    before(() => {
      qDefData = fs.readFileSync(
        path.join(__dirname, './weightHeightQ.json')).toString();
    });

    describe('updated unversioned Questionnaire', () => {
      let revised, launchContextExt;
      before(() => {
        qDef = JSON.parse(qDefData);
        revised = updater.update(qDef, UPDATE_VERSION);
        launchContextExt = revised.extension;
      });
      it('should have updated URLs for calculatedExpression', () => {
        assert.strictEqual(launchContextExt[2].url, NEW_LAUNCH_CONTEXT);
      });
      it('should have the LForms version updated', () => {
        assert.strictEqual(util.versionFromTag(revised.meta.tag[0]), UPDATE_VERSION);
      });
    });
  });
});
