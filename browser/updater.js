"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // source/versionList.json
  var require_versionList = __commonJS({
    "source/versionList.json"(exports, module) {
      module.exports = ["29.0.0", "28.0.0", "26.0.0", "25.0.0", "24.0.0", "23.0.0", "22.0.0"];
    }
  });

  // source/util.js
  var require_util = __commonJS({
    "source/util.js"(exports, module) {
      "use strict";
      var VERSION_REGEX = /^lformsVersion: (.+)$/;
      module.exports = {
        /**
         *  Returns true if the given parsed JSON is a FHIR resource.
         */
        isFHIRResource: function(parsedJSON) {
          return !!parsedJSON.resourceType;
        },
        /**
         *  Finds extension arrays in the given structure, and calls the callback
         *  for each array found, passing it as a parameter.
         */
        findExtensions: function(parsedJSON, callback) {
          if (parsedJSON.extension)
            callback(parsedJSON.extension);
          let items = parsedJSON.item || parsedJSON.items;
          if (items) {
            for (let i of items)
              this.findExtensions(i, callback);
          }
        },
        /**
         *  Finds the item by searching extension arrays in the given structure, and calls the callback
         *  for each array found, passing the item as a parameter.
         */
        findItemByExtension: function(parsedJSON, callback) {
          if (parsedJSON.extension)
            callback(parsedJSON);
          let items = parsedJSON.item || parsedJSON.items;
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
        versionLessThan: function(left, right) {
          let rtn;
          if (!left)
            rtn = true;
          else {
            let leftParts = left.split(".");
            let rightParts = right.split(".");
            for (let i = 0; i < 3 && rtn === void 0; ++i) {
              let lp = parseInt(leftParts[i]), rp = parseInt(rightParts[i]);
              if (lp != rp)
                rtn = lp < rp;
            }
            if (rtn === void 0)
              rtn = false;
          }
          return rtn;
        },
        /**
         *  Returns a FHIR tag display string for a given LForms version string.
         * @param lformsVersion The LForms SemVer string for which a tag is needed.
         */
        makeVersionTag: function(lformsVersion) {
          return "lformsVersion: " + lformsVersion;
        },
        /**
         *  Returns the LForms SemVer version from the given FHIR tag object,
         *  or null if the given tag string does not indicate an LForms version.
         * @param tag A FHIR tag object
         */
        versionFromTag: function(tag) {
          let rtn = null;
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
      };
    }
  });

  // source/versionUpdates/29.0.0.js
  var require__ = __commonJS({
    "source/versionUpdates/29.0.0.js"(exports, module) {
      "use strict";
      module.exports = function(parsedJSON) {
        let util = require_util();
        if (!util.isFHIRResource(parsedJSON) || parsedJSON.resourceType === "Questionnaire") {
          util.findExtensions(parsedJSON, function(extArray) {
            for (let ext of extArray) {
              if (ext.url === "http://hl7.org/fhir/StructureDefinition/questionnaire-launchContext") {
                ext.url = "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-launchContext";
              }
            }
          });
        }
        return parsedJSON;
      };
    }
  });

  // source/versionUpdates/28.0.0.js
  var require__2 = __commonJS({
    "source/versionUpdates/28.0.0.js"(exports, module) {
      "use strict";
      module.exports = function(parsedJSON) {
        let util = require_util();
        if (!util.isFHIRResource(parsedJSON) || parsedJSON.resourceType === "Questionnaire" && util.hasLformsTag(parsedJSON)) {
          util.findExtensions(parsedJSON, function(extArray) {
            for (const ext of extArray) {
              if (ext.url === "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-observationLinkPeriod") {
                extArray.push({
                  url: "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-observationExtract",
                  valueBoolean: true
                });
                break;
              }
            }
          });
        }
        return parsedJSON;
      };
    }
  });

  // source/versionUpdates/26.0.0.js
  var require__3 = __commonJS({
    "source/versionUpdates/26.0.0.js"(exports, module) {
      "use strict";
      module.exports = function(parsedJSON) {
        let util = require_util();
        if (!util.isFHIRResource(parsedJSON)) {
          if (typeof parsedJSON.templateOptions === "object") {
            if (parsedJSON.templateOptions.hideFormControls === void 0) {
              parsedJSON.templateOptions.hideFormControls = false;
            }
            if (parsedJSON.templateOptions.showFormHeader === void 0) {
              parsedJSON.templateOptions.showFormHeader = true;
            }
          } else {
            parsedJSON.templateOptions = {
              hideFormControls: false,
              showFormHeader: true
            };
          }
        }
        return parsedJSON;
      };
    }
  });

  // source/versionUpdates/25.0.0.js
  var require__4 = __commonJS({
    "source/versionUpdates/25.0.0.js"(exports, module) {
      "use strict";
      module.exports = function(parsedJSON) {
        let util = require_util();
        if (!util.isFHIRResource(parsedJSON) || parsedJSON.resourceType === "Questionnaire") {
          util.findExtensions(parsedJSON, function(extArray) {
            for (let ext of extArray) {
              if (ext.url === "http://hl7.org/fhir/StructureDefinition/questionnaire-calculatedExpression")
                ext.url = "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression";
            }
          });
        }
        return parsedJSON;
      };
    }
  });

  // source/versionUpdates/24.0.0.js
  var require__5 = __commonJS({
    "source/versionUpdates/24.0.0.js"(exports, module) {
      "use strict";
      var PATH_DELIMITER = "/";
      function convertCodeToLinkId(lfData) {
        _addLinkId(lfData.items, "", lfData);
        _convertFormControls(lfData.items);
        _removeTempFields(lfData.items);
      }
      function _removeTempFields(items) {
        for (var i = 0, iLen = items.length; i < iLen; i++) {
          var item = items[i];
          delete item._parentItem;
          delete item._codePath;
          if (item.items && item.items.length > 0) {
            _removeTempFields(item.items);
          }
        }
      }
      function _addLinkId(items, parentItemCodePath, parentItem) {
        var iLen = items.length, prevSibling = null, itemId = 1;
        for (var i = 0; i < iLen; i++) {
          var item = items[i];
          var questionRepeatable = item.questionCardinality && item.questionCardinality.max && (item.questionCardinality.max === "*" || parseInt(item.questionCardinality.max) > 1);
          if (questionRepeatable && prevSibling && prevSibling.questionCode === item.questionCode) {
            itemId += 1;
          } else {
            itemId = 1;
          }
          var codePath = parentItemCodePath + PATH_DELIMITER + item.questionCode;
          item._parentItem = parentItem;
          item._codePath = codePath;
          if (!item.linkId) {
            item.linkId = codePath;
          }
          prevSibling = item;
          if (item.items && item.items.length > 0) {
            _addLinkId(item.items, codePath, item);
          }
        }
      }
      function _convertFormControls(items) {
        for (var i = 0, iLen = items.length; i < iLen; i++) {
          var item = items[i];
          if (item.skipLogic && item.skipLogic.conditions) {
            for (var j = 0, jLen = item.skipLogic.conditions.length; j < jLen; j++) {
              var condition = item.skipLogic.conditions[j];
              var sourceItem = _findItemsUpwardsAlongAncestorTree(item, condition.source);
              condition.source = sourceItem.linkId;
            }
          }
          if (item.dataControl) {
            for (var j = 0, jLen = item.dataControl.length; j < jLen; j++) {
              var source = item.dataControl[j].source;
              if (source && (!source.sourceType || source.sourceType === "INTERNAL") && source.sourceItemCode) {
                var sourceItem = _findItemsUpwardsAlongAncestorTree(item, source.sourceItemCode);
                if (!sourceItem) {
                  throw new Error("Data control for item '" + item.question + "' refers to source item '" + source.sourceItemCode + "' which was not found as a sibling, ancestor, or ancestor sibling.");
                }
                source.sourceLinkId = sourceItem.linkId;
                delete source.sourceItemCode;
              }
            }
          }
          if (item.calculationMethod && item.calculationMethod.value && Array.isArray(item.calculationMethod.value)) {
            var newValue = [];
            for (var j = 0, jLen = item.calculationMethod.value.length; j < jLen; j++) {
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
      function _findItemsUpwardsAlongAncestorTree(item, questionCode) {
        var sourceItem = null;
        if (item._parentItem && Array.isArray(item._parentItem.items)) {
          for (var i = 0, iLen = item._parentItem.items.length; i < iLen; i++) {
            if (item._parentItem.items[i].questionCode === questionCode) {
              sourceItem = item._parentItem.items[i];
              break;
            }
          }
        }
        if (!sourceItem) {
          var parentItem = item._parentItem;
          while (parentItem) {
            var foundSource = false;
            if (parentItem.questionCode === questionCode) {
              sourceItem = parentItem;
              foundSource = true;
            } else if (parentItem._parentItem && Array.isArray(parentItem._parentItem.items)) {
              var parentSiblings = parentItem._parentItem.items;
              for (var i = 0, iLen = parentSiblings.length; i < iLen; i++) {
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
      module.exports = function(parsedJSON) {
        let util = require_util();
        if (!util.isFHIRResource(parsedJSON) && parsedJSON.items) {
          convertCodeToLinkId(parsedJSON);
        }
        return parsedJSON;
      };
    }
  });

  // source/versionUpdates/23.0.0.js
  var require__6 = __commonJS({
    "source/versionUpdates/23.0.0.js"(exports, module) {
      "use strict";
      module.exports = function(parsedJSON) {
        let util = require_util();
        let meta = parsedJSON.meta;
        if (meta) {
          let tags = meta.tag;
          if (tags) {
            for (let t of tags) {
              let version = util.versionFromTag(t);
              if (version) {
                if (t.display && !t.code) {
                  t.code = t.display;
                  delete t.display;
                }
                break;
              }
            }
          }
        }
        if (parsedJSON.resourceType === "Questionnaire") {
          util.findItemByExtension(parsedJSON, function(item) {
            if (item.extension) {
              for (let i = 0; i < item.extension.length; i++) {
                let ext = item.extension[i];
                if (ext.url === "http://hl7.org/fhir/StructureDefinition/questionnaire-answerRepeats") {
                  item.repeats = true;
                  item.extension.splice(i, 1);
                  i = i - 1;
                }
              }
            }
          });
        }
        return parsedJSON;
      };
    }
  });

  // source/versionUpdates/22.0.0.js
  var require__7 = __commonJS({
    "source/versionUpdates/22.0.0.js"(exports, module) {
      "use strict";
      module.exports = function(parsedJSON) {
        let util = require_util();
        if (!util.isFHIRResource(parsedJSON) || parsedJSON.resourceType === "Questionnaire") {
          util.findExtensions(parsedJSON, function(extArray) {
            for (let ext of extArray) {
              if (ext.url === "http://hl7.org/fhir/StructureDefinition/questionnaire-observationLinkPeriod")
                ext.url = "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-observationLinkPeriod";
            }
          });
        }
        return parsedJSON;
      };
    }
  });

  // source/updateFns.js
  var require_updateFns = __commonJS({
    "source/updateFns.js"(exports, module) {
      module.exports = {};
      module.exports["29.0.0"] = require__();
      module.exports["28.0.0"] = require__2();
      module.exports["26.0.0"] = require__3();
      module.exports["25.0.0"] = require__4();
      module.exports["24.0.0"] = require__5();
      module.exports["23.0.0"] = require__6();
      module.exports["22.0.0"] = require__7();
    }
  });

  // source/index.js
  var require_source = __commonJS({
    "source/index.js"(exports, module) {
      "use strict";
      var updateVersions_ = require_versionList();
      var updateFns_ = require_updateFns();
      module.exports = { update: function(parsedJSON, version) {
        let stopVersion = version;
        let util = require_util();
        var isFHIR = util.isFHIRResource(parsedJSON);
        var lformsVersion;
        if (isFHIR) {
          let meta = parsedJSON.meta;
          if (meta) {
            let tags = meta.tag;
            if (tags) {
              for (let t of tags) {
                let tagVersion = util.versionFromTag(t);
                if (tagVersion) {
                  lformsVersion = tagVersion;
                  break;
                }
              }
            }
          }
        } else {
          lformsVersion = parsedJSON.lformsVersion;
        }
        let updateSteps = [];
        for (let i = 0, len = updateVersions_.length, uv; i < len && (uv = updateVersions_[i]) && util.versionLessThan(lformsVersion, uv); ++i) {
          if (!stopVersion || !util.versionLessThan(stopVersion, uv))
            updateSteps.push(uv);
        }
        let latestVersion = updateSteps[0];
        for (let step of updateSteps.reverse())
          parsedJSON = updateFns_[step](parsedJSON);
        if (updateSteps.length) {
          if (isFHIR) {
            let meta = parsedJSON.meta;
            if (!meta)
              meta = parsedJSON.meta = {};
            let tags = meta.tag;
            if (!tags)
              tags = meta.tag = [];
            let versionTag;
            for (let t of tags) {
              let version2 = util.versionFromTag(t);
              if (version2) {
                versionTag = t;
                break;
              }
            }
            let versionDisplay = util.makeVersionTag(latestVersion);
            if (versionTag) {
              versionTag.code = versionDisplay;
              delete versionTag.display;
            } else
              tags.push({ code: versionDisplay });
          } else
            parsedJSON.lformsVersion = latestVersion;
        }
        return parsedJSON;
      } };
    }
  });

  // source/index_browser.js
  var updater = require_source();
  window.lformsUpdater = updater;
})();
//# sourceMappingURL=updater.js.map
