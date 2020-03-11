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
  }
}
