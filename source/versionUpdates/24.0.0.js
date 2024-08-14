'use strict';

const PATH_DELIMITER = "/";

/**
 * Generate linkId from questionCode and replace questionCode in form controls
 * with linkId.
 * @param lfData a LForms form definition data object
 */
function convertCodeToLinkId(lfData) {
  _addLinkIdForDescendents(lfData);
  _convertFormControls(lfData.items);
  _removeTempFields(lfData.items)
}

/**
 * Remove the temporary fields created during the conversion
 * @param items a list of LForms items
 * @private
 */
function _removeTempFields(items) {
  // for each item on this level
  for (var i = 0, iLen = items.length; i < iLen; i++) {
    var item = items[i];
    delete item._parentItem;
    // process the sub items
    if (item.items && item.items.length > 0) {
      _removeTempFields(item.items);
    }
  }
}

/**
 * Add linkIds for the given item's descendent items. Link ids are generated based on the questionCode.
 * When multiple items at the same level have the same question code, the link ids for the subsequent
 * occurrences of that question code will have a suffix that is .<sequence#>.
 * @param parentItem the parent item
 * @private
 */
function _addLinkIdForDescendents(parentItem) {

  if (! parentItem.items || ! parentItem.items.length) return;

  let qCodeCount = {}; // map from questionCode to the number of occurrences of the code seen so far.
  let iLen = parentItem.items.length;

  // for each item on this level
  for (var i = 0; i < iLen; i++) {
    let item = parentItem.items[i];
    item._parentItem = parentItem;
    qCodeCount[item.questionCode] = (qCodeCount[item.questionCode] || 0) + 1;

    // A previous version of code attempted to establish repeating sequences but didn't get there.
    // Keeping these lines (as reference) just in case we want to do it in the future.
    // var questionRepeatable = item.questionCardinality && item.questionCardinality.max &&
    //  (item.questionCardinality.max === "*" || parseInt(item.questionCardinality.max) > 1);
    //if (questionRepeatable && prevSibling && prevSibling.questionCode === item.questionCode)

    // linkId for Questionnaire
    if (!item.linkId) {
      let dotSeqNum = qCodeCount[item.questionCode] > 1? '.' + qCodeCount[item.questionCode]: '';
      item.linkId = (parentItem.linkId || '') + PATH_DELIMITER + item.questionCode + dotSeqNum;
    }

    // process the sub items
    if (item.items && item.items.length > 0) {
      _addLinkIdForDescendents(item);
    }
  }
}


/**
 * Convert questionCode in all form controls (skip logic, data control, calculation method)
 * to linkId
 * @param items a list of LForms items
 * @private
 */
function _convertFormControls(items) {

  for(var i=0, iLen=items.length; i<iLen; i++) {
    var item = items[i];
    // convert code in skip logic to be linkId
    if (item.skipLogic && item.skipLogic.conditions) {
      for (var j = 0, jLen = item.skipLogic.conditions.length; j < jLen; j++) {
        var condition = item.skipLogic.conditions[j];
        var sourceItem = _findItemsUpwardsAlongAncestorTree(item, condition.source); // source is still a code
        condition.source = sourceItem.linkId;
      } // end of conditions loop
    }

    // convert code in dataControl to be linkId
    if (item.dataControl) {
      for (var j= 0, jLen=item.dataControl.length; j<jLen; j++) {
        var source = item.dataControl[j].source;

        // has a source configuration
        if (source && (!source.sourceType || source.sourceType === "INTERNAL") &&
            source.sourceItemCode) {
          // get the source item object
          var sourceItem = _findItemsUpwardsAlongAncestorTree(item, source.sourceItemCode);
          if (!sourceItem) {
            // This is an error in the form definition.  Provide a useful
            // debugging message.
            throw new Error("Data control for item '"+item.question+ "' refers to source item '"+source.sourceItemCode+
                "' which was not found as a sibling, ancestor, or ancestor sibling.");
          }
          source.sourceLinkId = sourceItem.linkId;
          delete source.sourceItemCode;
        }
      }
    }

    // convert code in calculationMethod to be linkId
    if (item.calculationMethod && item.calculationMethod.value && Array.isArray(item.calculationMethod.value)) {
      var newValue = [];
      for (var j= 0, jLen=item.calculationMethod.value.length; j<jLen; j++) {
        var questionCode = item.calculationMethod.value[j];
        var sourceItem = _findItemsUpwardsAlongAncestorTree(item, questionCode);
        newValue.push(sourceItem.linkId);
      }

      item.calculationMethod.value = newValue;
    }

    if (item.items && item.items.length > 0) {
      _convertFormControls(item.items);
    }
  }

}


/**
 * Search upwards along the tree structure to find the item with a matching questionCode
 * @param item the item to start with
 * @param questionCode the code of an item
 * @returns {}
 * @private
 */
function _findItemsUpwardsAlongAncestorTree(item, questionCode) {
  var sourceItem = null;

  // check siblings
  if (item._parentItem && Array.isArray(item._parentItem.items)) {
    for (var i= 0, iLen= item._parentItem.items.length; i<iLen; i++) {
      if (item._parentItem.items[i].questionCode === questionCode) {
        sourceItem = item._parentItem.items[i];
        break;
      }
    }
  }
  // check ancestors and each ancestors siblings
  if (!sourceItem) {
    var parentItem = item._parentItem;
    while (parentItem) {
      var foundSource = false;
      // check the ancestor
      if (parentItem.questionCode === questionCode) {
        sourceItem = parentItem;
        foundSource = true;
      }
      // check the ancestors siblings
      else if (parentItem._parentItem && Array.isArray(parentItem._parentItem.items)){
        var parentSiblings = parentItem._parentItem.items;
        for (var i= 0, iLen= parentSiblings.length; i<iLen; i++) {
          if (parentSiblings[i].questionCode === questionCode) {
            sourceItem = parentSiblings[i];
            foundSource = true;
            break;
          }
        }
      }
      if (foundSource)
        break;

      parentItem = parentItem._parentItem;
    }
  }
  return sourceItem;
}


/**
 *  The update function for updating forms or resources to the version in this filename.
 * @param parsedJSON either an LForms definition or a resource generated by
 *  LForms.
 * @return the updated form or resource.
 */
module.exports = function (parsedJSON) {

  let util = require('../util');
  // if it is LForms form data object
  if (!util.isFHIRResource(parsedJSON) && parsedJSON.items) {
    convertCodeToLinkId(parsedJSON);
  }
  return parsedJSON;
};
