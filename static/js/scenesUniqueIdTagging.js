var _ = require('ep_etherpad-lite/static/js/underscore');
var $ = require('ep_etherpad-lite/static/js/rjquery').$;

var utils = require('./utils');
var SCENE_ID_KEY_ATTRIB = require('./shared').SCENE_ID_KEY_ATTRIB;
var generateSceneId = require('./shared').generateSceneId;
//var detailedLinesChangedListener = require('ep_script_scene_marks/static/js/detailedLinesChangedListener');
//var scheduler = require('./scheduler');

var sceneUniqueIdTagging = function() {};

var _markSceneWithUniqueId = function(element, $lines, attributeManager) {
  var lineNumber = $lines.index(element);
  var sceneId = generateSceneId();
  attributeManager.setAttributeOnLine(lineNumber, SCENE_ID_KEY_ATTRIB, sceneId);
};

exports.init = function() {
  return new sceneUniqueIdTagging();
};

exports.markScenesWithUniqueId = function(editorInfo, attributeManager) {
  editorInfo.ace_inCallStackIfNecessary('markScenesWithUniqueId ', function() {
    var $headings = utils.getPadInner().find('div:has(heading)');
    var $lines = utils.getPadInner().find('div');
    $headings.each(function(index, element) {
      _markSceneWithUniqueId(element, $lines, attributeManager);
    });
  });
};
