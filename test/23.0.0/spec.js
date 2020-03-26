const assert = require('assert');
const fs = require('fs');
const path = require('path');
const updater = require('../../source/index');
const util = require('../../source/util');

const UPDATE_VERSION = '23.0.0';
const WRONG_URI = "http://hl7.org/fhir/StructureDefinition/questionnaire-answerRepeats";
let updateVersionTag_ = util.makeVersionTag(UPDATE_VERSION);

describe(UPDATE_VERSION, function() {
  describe('version tag', function() {
    it('should be moved from "display" to "code"', ()=>{
      let obsDefData = fs.readFileSync(
        path.join(__dirname, './obs.json')).toString();
      let obsDef = JSON.parse(obsDefData);
      assert(obsDef.meta.tag[0].display); // precondition check
      let updatedObs = updater.update(obsDef, UPDATE_VERSION);
      assert(!obsDef.meta.tag[0].display);
      assert.equal(obsDef.meta.tag[0].code, updateVersionTag_);
    });
  });

  describe('Questionnaire', function() {
    let qDefData, qDef;
    before(() => {
      qDefData = fs.readFileSync(
          path.join(__dirname, './weightHeightQ.json')).toString();
    });

    describe('updated unversioned Questionnaire', () => {
      let revised, weightExt, heightExt;
      before(() => {
        qDef = JSON.parse(qDefData);
        revised = updater.update(qDef, UPDATE_VERSION);
        weightExt = revised.item[0].extension;
        heightExt = revised.item[1].extension;
      });
      it('should still have questionnaire-unit', () => {
        assert.equal(weightExt[0].url,
            "http://hl7.org/fhir/StructureDefinition/questionnaire-unit");
      });
      it('should have removed the answer-repeats extension', ()=> {
        assert.equal(weightExt.length, 1);
        assert.equal(heightExt.length, 1);
        assert.equal(revised.item[0].repeats, true);
        assert.equal(revised.item[1].repeats, true);
      });
      it('should have the LForms version updated', ()=>{
        assert.equal(revised.meta.tag[0].code, updateVersionTag_);
      });
    });


    describe('old versioned Questionnaire', () => {
      let revised, weightExt, heightExt;
      before(() => {
        qDef = JSON.parse(qDefData);
        qDef.meta.tag = [{display: 'lformsVersion: 21.2.1'}];
        revised = updater.update(qDef, UPDATE_VERSION);
        weightExt = revised.item[0].extension;
        heightExt = revised.item[1].extension;
      });

      it('should have updated URLs for the answer-repeats extension', ()=> {
        assert.equal(weightExt.length, 1);
        assert.equal(heightExt.length, 1);
        assert.equal(revised.item[0].repeats, true);
        assert.equal(revised.item[1].repeats, true);
      });
      it('should have the LForms version updated', ()=>{
        assert.equal(revised.meta.tag[0].code, updateVersionTag_);
      });
    });


    describe('future versioned Questionnaire', () => {
      // This tests that we don't run an update for a version that should
      // already have the update (if the version number is later than the
      // version number that requires it).
      let revised, weightExt, versionTag='lformsVersion: 25.2.1';
      before(() => {
        qDef = JSON.parse(qDefData);
        qDef.meta.tag = [{display: versionTag}];
        revised = updater.update(qDef, UPDATE_VERSION);
        weightExt = revised.item[0].extension;
        heightExt = revised.item[1].extension;
      });

      it('should not have updated URLs for answer-repeats extension', ()=> {
        // If this were really a future-versioned Questionnaire, the URI would
        // already be updated, so the updater should have left them untouched.
        assert.equal(weightExt[1].url, WRONG_URI);
        assert.equal(heightExt[1].url, WRONG_URI);
        assert.equal(revised.item[0].repeats, undefined);
        assert.equal(revised.item[1].repeats, undefined);
      });
      it('should not have the LForms version updated', ()=>{
        assert.equal(revised.meta.tag[0].display, versionTag);
      });
    });
  });

});


