var _ = require('ep_etherpad-lite/static/js/underscore');
var $ = require('ep_etherpad-lite/static/js/rjquery').$;

var utils = require('./utils');
var generateSceneId = require('./shared').generateSceneId;
var linesChangedListener = require('ep_comments_page/static/js/linesChangedListener');

var SCENE_ID_KEY_ATTRIB = require('./shared').SCENE_ID_KEY_ATTRIB;
var SCENE_ID_REGEXP = require('./shared').SCENE_ID_REGEXP;

var sceneUniqueIdTagging = function(editorInfo, documentAttributeManager) {
  var self = this;
  self.editorInfo = editorInfo;
  self.attributeManager = documentAttributeManager;
  linesChangedListener.onLineChanged('heading', this.markScenesWithUniqueId.bind(this));
};

sceneUniqueIdTagging.prototype._markSceneWithUniqueId = function(element, $lines) {
  var lineNumber = $lines.index(element);
  var headingClasses = $(element)
    .find('heading')
    .attr('class');
  var headingAlreadyHasSceneId = SCENE_ID_REGEXP.exec(headingClasses);
  if (!headingAlreadyHasSceneId) {
    var sceneId = generateSceneId();
    this.attributeManager.setAttributeOnLine(lineNumber, SCENE_ID_KEY_ATTRIB, sceneId);
  }
};

sceneUniqueIdTagging.prototype.markScenesWithUniqueId = function(linesToProcess) {
  var self = this;
  self.editorInfo.ace_inCallStackIfNecessary('markScenesWithUniqueId', function() {
    var $lines = utils.getPadInner().find('div');
    var $linesToProcess = linesToProcess ? $(linesToProcess) : $lines;
    var $headings = $linesToProcess.filter(':has(heading)');
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
