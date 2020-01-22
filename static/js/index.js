var epSEUtils = require('ep_script_elements/static/js/utils');

var utils = require('./utils');
var SCENE_ID_KEY_ATTRIB = require('./shared').SCENE_ID_KEY_ATTRIB;
var sceneUniqueIdTagging = require('./scenesUniqueIdTagging');

var isFirstTimeSceneIdTaggingRunAfterLoading = true;
var pluginHasInitialized = false;

exports.aceAttribsToClasses = function(hook, context) {
  var key = context.key;
  var value = context.value;
  if (key === SCENE_ID_KEY_ATTRIB) {
    return [key, value];
  }
};

exports.aceEditEvent = function(hook, context) {
  var callstack = context.callstack;
  var eventType = callstack.editEvent.eventType;

  var padHasLoadedCompletely = finishedLoadingPadAndSceneMarkIsInitialized(eventType);

  // when we import a script Etherpad does not trigger any event that makes
  // isAChangeOnPadContent change to true. So to avoid not running the
  // calculation of the scene length, we force run it as soon the pad loads
  if (isFirstTimeSceneIdTaggingRunAfterLoading && padHasLoadedCompletely) {
    isFirstTimeSceneIdTaggingRunAfterLoading = false;

    // mark scenes ids after loading script
    var thisPlugin = utils.getPluginProps();
    thisPlugin.sceneUniqueIdTagging.markScenesWithUniqueId();
  }
};

// Once ace is initialized, we set sceneUniqueIdTagging and bind it to the context
exports.aceInitialized = function(hook, context) {
  utils.getPluginProps().sceneUniqueIdTagging = sceneUniqueIdTagging.init.bind(context)();
  pluginHasInitialized = true;
};

var finishedLoadingPadAndSceneMarkIsInitialized = function(eventType) {
  return pluginHasInitialized && epSEUtils.checkIfPadHasLoaded(eventType);
};
