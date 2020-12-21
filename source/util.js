// Utility functions used by other modules in this package.

'use strict';

const VERSION_REGEX = /^lformsVersion: (.+)$/;

module.exports = {
  /**
   *  Returns true if the given parsed JSON is a FHIR resource.
   */
  isFHIRResource: function (parsedJSON) {
    return !!parsedJSON.resourceType;
  },


  /**
   *  Finds extension arrays in the given structure, and calls the callback
   *  for each array found, passing it as a parameter.
   */
  findExtensions: function (parsedJSON, callback) {
    if (parsedJSON.extension)
      callback(parsedJSON.extension);
    let items = parsedJSON.item || parsedJSON.items; // "items" is the LForms format
    if (items) {
      for (let i of items)
        this.findExtensions(i, callback);
    }
  },


  /**
   *  Finds the item by searching extension arrays in the given structure, and calls the callback
   *  for each array found, passing the item as a parameter.
   */
  findItemByExtension: function (parsedJSON, callback) {
    if (parsedJSON.extension)
      callback(parsedJSON);
    let items = parsedJSON.item || parsedJSON.items; // "items" is the LForms format
    if (items) {
      for (let i of items)
        this.findItemByExtension(i, callback);
    }
  },


  /**
   *  Returns true if the first version is less than the second version.
   *  Assumption: There are always three numeric parts in the version strings,
   *  separated by periods.
   * @param left the first version (left of the < operator).  This can be
   *  undefined or null; in that case the return value is true.
   * @param right the second version (right of the < operator)
   */
  versionLessThan: function (left, right) {
    let rtn;
    if (!left)
      rtn = true; // unversioned case
    else {
      let leftParts = left.split('.');
      let rightParts = right.split('.');
      for (let i=0; i<3 && rtn === undefined; ++i) {
        let lp = parseInt(leftParts[i]), rp = parseInt(rightParts[i]);
        if (lp != rp)
          rtn = lp < rp
      }
      if (rtn === undefined)
        rtn = false;
    }
    return rtn;
  },


  /**
   *  Returns a FHIR tag display string for a given LForms version string.
   * @param lformsVersion The LForms SemVer string for which a tag is needed.
   */
  makeVersionTag: function (lformsVersion) {
    return 'lformsVersion: '+lformsVersion;
  },


  /**
   *  Returns the LForms SemVer version from the given FHIR tag object,
   *  or null if the given tag string does not indicate an LForms version.
   * @param tag A FHIR tag object
   */
  versionFromTag: function(tag) {
    let rtn = null;
    // Currently the version is on the "code" attribute, but originally it was
    // on the "display" attribute, so we check both.
    let versionStr = tag.code || tag.display;
    let md = versionStr.match(VERSION_REGEX);
    if (md)
      rtn = md[1];
    return rtn;
  },


  /**
   *  Returns true if there is a LForms tag in the FHIR resource
   * @param parsedJSON the updated resource
   */
  hasLformsTag(parsedJSON) {
    if (parsedJSON.meta && parsedJSON.meta.tag) {
      for (const tag of parsedJSON.meta.tag) {
        if (tag.code && tag.code.match(VERSION_REGEX)) {
          return true;
        }
      }
    }

    return false;
  }
}
