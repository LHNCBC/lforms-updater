// Utility functions used by other modules in this package.

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
   *  Returns the LForms SemVer version from the given FHIR tag display string,
   *  or null if the given tag string does not indicate an LForms version.
   * @param tagDisplay the display string of a FHIR tag
   */
  versionFromTag: function(tagDisplay) {
    let rtn = null;
    let md = tagDisplay.match(/^lformsVersion: (.+)$/);
    if (md)
      rtn = md[1];
    return rtn;
  }
}
