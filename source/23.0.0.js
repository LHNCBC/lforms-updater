'use strict';

/**
 *  The update function for updating forms or resources to the version in this filename.
 * @param parsedJSON either an LForms definition or a resource generated by
 *  LForms.
 * @return the updated form or resource.
 */
module.exports = function (parsedJSON) {
  // In this version, the lformsVersion tag changed to have its value on the
  // "code" field rather than the "display" field (because the HAPI FHIR server
  // requires a "code" for tags).
  let util = require('./util');
  let meta = parsedJSON.meta;
  if (meta) {
    let tags = meta.tag;
    if (tags) {
      for (let t of tags) {
        let version = util.versionFromTag(t);
        if (version) {
          // Move the version string from "display" to "code".  The index.js
          // code will handle updating the version number.
          if (t.display && !t.code) {
            t.code = t.display;
            delete t.display;
          }
          break;
        }
      }
    }
  }

  return parsedJSON;
};
