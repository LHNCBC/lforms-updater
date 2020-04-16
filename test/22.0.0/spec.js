const assert = require('assert');
const fs = require('fs');
const path = require('path');
const updater = require('../../source/index');
const util = require('../../source/util');

const OLD_LINK_URI = "http://hl7.org/fhir/StructureDefinition/questionnaire-observationLinkPeriod";
const NEW_LINK_URI = "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-observationLinkPeriod";

const UPDATE_VERSION = '22.0.0';

if (!global.window)
  global.window = {}; // The browser version assigns to window
require(path.join(__dirname, '../../browser/updater'));

const testCases = [
  {"test": "Binary version", "updater": updater},
  {"test": "Browser version", "updater": window.lformsUpdater}
];
for (let i=0, len=testCases.length; i<len; ++i) {
  (function (testCase) {
    describe(testCase.test, function() {
      describe(UPDATE_VERSION, function() {
        describe('Questionnaire', function() {
          let qDefData, qDef;
          before(() => {
            qDefData = fs.readFileSync(
                path.join(__dirname, './weightHeightQ.json')).toString();
          });

          describe('updated unversioned Questionnaire', () => {
            let revised, weightExt;
            before(() => {
              qDef = JSON.parse(qDefData);
              revised = testCase.updater.update(qDef, UPDATE_VERSION);
              weightExt = revised.item[0].extension;
            });
            it('should still have questionnaire-unit', () => {
              assert.equal(weightExt[0].url,
                  "http://hl7.org/fhir/StructureDefinition/questionnaire-unit");
            });
            it('should have updated URLs for observationLinkPeriod', ()=> {
              assert.equal(weightExt[1].url, NEW_LINK_URI);
              let heightExt = revised.item[2].extension;
              assert.equal(heightExt[1].url, NEW_LINK_URI);
            });
            it('should have the LForms version updated', ()=>{
              assert.equal(util.versionFromTag(revised.meta.tag[0]), UPDATE_VERSION);
            });
          });


          describe('old versioned Questionnaire', () => {
            let revised, weightExt;
            before(() => {
              qDef = JSON.parse(qDefData);
              qDef.meta.tag = [{display: 'lformsVersion: 21.2.1'}];
              revised = testCase.updater.update(qDef, UPDATE_VERSION);
              weightExt = revised.item[0].extension;
            });

            it('should have updated URLs for observationLinkPeriod', ()=> {
              assert.equal(weightExt[1].url, NEW_LINK_URI);
              let heightExt = revised.item[2].extension;
              assert.equal(heightExt[1].url, NEW_LINK_URI);
            });

            it('should have the LForms version updated', ()=>{
              assert.equal(util.versionFromTag(revised.meta.tag[0]), UPDATE_VERSION);
            });
          });


          describe('future versioned Questionnaire', () => {
            // This tests that we don't run an update for a version that should
            // already have the update (if the version number is later than the
            // version number that requires it).
            let futureVersion = '22.2.1';
            let revised, weightExt, versionTag='lformsVersion: '+futureVersion;
            before(() => {
              qDef = JSON.parse(qDefData);
              qDef.meta.tag = [{display: versionTag}];
              revised = testCase.updater.update(qDef, UPDATE_VERSION);
              weightExt = revised.item[0].extension;
            });

            it('should not have updated URLs for observationLinkPeriod', ()=> {
              // If this were really a future-versioned Questionnaire, the URI would
              // already be updated, so the updater should have left them untouched.
              assert.equal(weightExt[1].url, OLD_LINK_URI);
              let heightExt = revised.item[2].extension;
              assert.equal(heightExt[1].url, OLD_LINK_URI);
            });
            it('should not have the LForms version updated', ()=>{
              assert.equal(util.versionFromTag(revised.meta.tag[0]), futureVersion);
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
            let revised, weightExt;
            before(() => {
              lfDef = JSON.parse(lfDefData);
              revised = testCase.updater.update(lfDef, UPDATE_VERSION);
              weightExt = revised.items[0].extension;
            });

            it('should still have questionnaire-unit', () => {
              assert.equal(weightExt[0].url,
                  "http://hl7.org/fhir/StructureDefinition/questionnaire-unit");
            });

            it('should have updated URLs for observationLinkPeriod', ()=> {
              assert.equal(weightExt[1].url, NEW_LINK_URI);
              let heightExt = revised.items[2].extension;
              assert.equal(heightExt[1].url, NEW_LINK_URI);
            });

            it('should have the LForms version updated', ()=>{
              assert.equal(revised.lformsVersion, UPDATE_VERSION);
            });
          });

          describe('old versioned Questionnaire', () => {
            let revised, weightExt;
            before(() => {
              lfDef = JSON.parse(lfDefData);
              lfDef.lformsVersion = '21.2.1';
              revised = testCase.updater.update(lfDef, UPDATE_VERSION);
              weightExt = revised.items[0].extension;
            });

            it('should have updated URLs for observationLinkPeriod', ()=> {
              assert.equal(weightExt[1].url, NEW_LINK_URI);
              let heightExt = revised.items[2].extension;
              assert.equal(heightExt[1].url, NEW_LINK_URI);
            });

            it('should have the LForms version updated', ()=>{
              assert.equal(revised.lformsVersion, UPDATE_VERSION);
            });
          });

          describe('future versioned Questionnaire', () => {
            // This tests that we don't run an update for a version that should
            // already have the update (if the version number is later than the
            // version number that requires it).
            let revised, weightExt;
            before(() => {
              lfDef = JSON.parse(lfDefData);
              lfDef.lformsVersion = '22.2.1';
              revised = testCase.updater.update(lfDef, UPDATE_VERSION);
              weightExt = revised.items[0].extension;
            });

            it('should not have updated URLs for observationLinkPeriod', ()=> {
              assert.equal(weightExt[1].url, OLD_LINK_URI);
              let heightExt = revised.items[2].extension;
              assert.equal(heightExt[1].url, OLD_LINK_URI);
            });

            it('should not have the LForms version updated', ()=>{
              assert.equal(revised.lformsVersion, '22.2.1');
            });
          });
        });
      });
    })
  })(testCases[i])
}
