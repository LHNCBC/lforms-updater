// The update function for updating resources to the version in this filename.
module.exports = function (parsedJSON) {
  // In this version, the observationLinkPeriod extension changed.  This
  // affects both LForms definitions and Questionnaires.

  let util = require('./util');
  if (!util.isFHIRResource(parsedJSON) || parsedJSON.resourceType === 'Questionnaire') {
    util.findExtensions(parsedJSON, function (extArray) {
      for (let ext of extArray) {
        if (ext.url === "http://hl7.org/fhir/StructureDefinition/questionnaire-observationLinkPeriod")
          ext.url = "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-observationLinkPeriod";
      }
    }
  }
};
