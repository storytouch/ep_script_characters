var _ = require('ep_etherpad-lite/static/js/underscore');
var $ = require('ep_etherpad-lite/static/js/rjquery').$;

var utils = require('./utils');
var generateSceneId = require('./shared').generateSceneId;
var linesChangedListener = require('ep_comments_page/static/js/linesChangedListener');

var HEADING_WITHOUT_SCENE_ID_SELECTOR = 'heading:not(.scene-id)';
var LINES_CHANGED_LISTENER_TIMEOUT = 800;
var SCENE_ID_KEY_ATTRIB = require('./shared').SCENE_ID_KEY_ATTRIB;
var SCENE_ID_REGEXP = require('./shared').SCENE_ID_REGEXP;

var sceneUniqueIdTagging = function(editorInfo, documentAttributeManager) {
  var self = this;
  self.editorInfo = editorInfo;
  self.attributeManager = documentAttributeManager;
  linesChangedListener.onLineChanged(
    HEADING_WITHOUT_SCENE_ID_SELECTOR,
    this.markScenesWithUniqueId.bind(this),
    LINES_CHANGED_LISTENER_TIMEOUT
  );
};

sceneUniqueIdTagging.prototype._markSceneWithUniqueId = function(element, $lines) {
  var lineNumber = $lines.index(element);
  var sceneId = generateSceneId();
  this.attributeManager.setAttributeOnLine(lineNumber, SCENE_ID_KEY_ATTRIB, sceneId);
};

sceneUniqueIdTagging.prototype.markScenesWithUniqueId = function() {
  var self = this;
  self.editorInfo.ace_inCallStackIfNecessary('markScenesWithUniqueId', function() {
    var padInner = utils.getPadInner();
    var $lines = padInner.find('div');
    var $headings = padInner.find(HEADING_WITHOUT_SCENE_ID_SELECTOR).parent();
    $headings.each(function(index, element) {
      self._markSceneWithUniqueId(element, $lines);
    });
  });
};

exports.init = function() {
  var editorInfo = this.editorInfo;
  var documentAttributeManager = this.documentAttributeManager;
  return new sceneUniqueIdTagging(editorInfo, documentAttributeManager);
};
