'use strict';

/**
 *  The update function for updating forms or resources to the version in this filename.
 * @return the updated form or resource.
 */
module.exports = function (parsedJSON) {
  // If an observationLinkPeriod extension is used we add observationExtract
  // This affects LForms and versioned Questionnaires

  let util = require('../util');
  if (!util.isFHIRResource(parsedJSON) ||
      (parsedJSON.resourceType === 'Questionnaire' && util.hasLformsTag(parsedJSON))) {
    util.findExtensions(parsedJSON, function (extArray) {
      for (const ext of extArray) {
        // If the observationLinkPeriod is used then add the observationExtract extension too
        if (ext.url === 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-observationLinkPeriod') {
          extArray.push({
            url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-observationExtract',
            valueBoolean: true
          });
          break;
        }
      }
    });
  }
  
  return parsedJSON;
};
