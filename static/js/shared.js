var randomString = require('ep_etherpad-lite/static/js/pad_utils').randomString;

var SCENE_ID_KEY_ATTRIB = 'scene-id';
exports.SCENE_ID_KEY_ATTRIB = SCENE_ID_KEY_ATTRIB;

var SCENE_ID_PREFIX = 'scid-';
exports.SCENE_ID_PREFIX = SCENE_ID_PREFIX;

var SCENE_ID_REGEXP = new RegExp('(?:^| )' + SCENE_ID_PREFIX + '[A-Za-z0-9]+');

var isHeading = function(tname) {
  return tname === 'heading';
};

exports.generateSceneId = function() {
  return SCENE_ID_PREFIX + randomString(16);
};

exports.collectContentPre = function(hook, context) {
  var sceneId = SCENE_ID_REGEXP.exec(context.cls);
  var tname = context.tname;
  var state = context.state;
  var lineAttributes = state.lineAttributes;

  if (isHeading(tname) && sceneId) {
    lineAttributes[SCENE_ID_KEY_ATTRIB] = sceneId[0];
  }
};
