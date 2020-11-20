'use strict';

/**
 *  The update function for updating forms or resources to the version in this filename.
 * @return the updated form or resource.
 */
module.exports = function (parsedJSON) {
  // In this version, the calculatedExpresion URI changed.  This
  // affects both LForms definitions and Questionnaires.

  let util = require('../util');
  if (!util.isFHIRResource(parsedJSON) || parsedJSON.resourceType === 'Questionnaire') {
    util.findExtensions(parsedJSON, function (extArray) {
      for (let ext of extArray) {
        if (ext.url === "http://hl7.org/fhir/StructureDefinition/questionnaire-calculatedExpression")
          ext.url = "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression";
      }
    });
  }
  return parsedJSON;
};
