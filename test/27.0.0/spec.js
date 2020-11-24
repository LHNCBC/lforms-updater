const assert = require('assert');
const fs = require('fs');
const path = require('path');
const updater = require('../../source/index');
const util = require('../../source/util');

const OBSERVATION_EXTRACT_URI = 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-observationExtract';

const UPDATE_VERSION = '27.0.0';

describe(UPDATE_VERSION, function () {
  describe('Questionnaire', function () {
    let qDefData, qDef;
    before(() => {
      qDefData = fs.readFileSync(
        path.join(__dirname, './weightHeightQ.json')).toString();
    });

    describe('updated versioned Questionnaire', () => {
      let revised, extensions;
      before(() => {
        qDef = JSON.parse(qDefData);
        revised = updater.update(qDef, UPDATE_VERSION);
        extensions = revised.item[0].extension;
      });

      it('should have added an extension for observationExtract', () => {
        assert.equal(extensions[2].url, OBSERVATION_EXTRACT_URI);
      });

      it('should have the LForms version updated', () => {
        assert.equal(util.versionFromTag(revised.meta.tag[0]), UPDATE_VERSION);
      });
    });
  });


  describe('Questionnaire with no Tag', function () {
    let qDefData, qDef;
    before(() => {
      qDefData = fs.readFileSync(
        path.join(__dirname, './weightHeightQNoTag.json')).toString();
    });

    describe('updated versioned Questionnaire', () => {
      let revised, extensions;
      before(() => {
        qDef = JSON.parse(qDefData);
        revised = updater.update(qDef, UPDATE_VERSION);
        extensions = revised.item[0].extension;
      });

      it('should have not added an extension for observationExtract', () => {
        assert.equal(extensions.length, 2);
      });

      it('should have the LForms version updated', () => {
        assert.equal(util.versionFromTag(revised.meta.tag[0]), UPDATE_VERSION);
      });
    });
  });


  describe('LForms definition', function () {
    let lfDefData, lfDef;
    before(() => {
      lfDefData = fs.readFileSync(
        path.join(__dirname, './weightHeightLForms.json')).toString();
    });

    describe('updated unversioned form definition', () => {
      let revised, extensions;
      before(() => {
        lfDef = JSON.parse(lfDefData);
        revised = updater.update(lfDef, UPDATE_VERSION);
        extensions = revised.items[0].extension;
      });

      it('should have added an extension for observationExtract', () => {
        assert.equal(extensions[2].url, OBSERVATION_EXTRACT_URI);
      });

      it('should have the LForms version updated', () => {
        assert.equal(revised.lformsVersion, UPDATE_VERSION);
      });
    });
  });
});
