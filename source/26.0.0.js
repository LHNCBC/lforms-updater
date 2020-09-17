'use strict';

/**
 *  The update function for updating forms or resources to the version in this filename.
 * @return the updated form or resource.
 */
module.exports = function (parsedJSON) {
  // In this version new defaults were provided for templateOptions to hide the header
  // and the form controls. This only affects LForms.

  let util = require('./util');
  if (!util.isFHIRResource(parsedJSON)) {
    if (typeof parsedJSON.templateOptions === 'object') {
      // If template options were specified we won't override them
      
      if (parsedJSON.templateOptions.hideFormControls === undefined) {
        parsedJSON.templateOptions.hideFormControls = false;
      }

      if (parsedJSON.templateOptions.showFormHeader === undefined) {
        parsedJSON.templateOptions.showFormHeader = true;
      }

    } else {
      // If template options were not specified then add the previous defaults
      parsedJSON.templateOptions = {
        hideFormControls: false,
        showFormHeader: true
      }
    }
  }
  
  return parsedJSON;
};
