describe('ep_script_characters - scenes unique id tagging', function() {
  var helperFunctions, padId;
  var sceneNavigatorUtils;

  var FIRST_SCENE_LINE = 2;

  before(function(done) {
    helperFunctions = ep_script_characters_test_helper.generalTests;
    sceneNavigatorUtils = ep_scene_navigator_test_helper.utils;

    padId = helper.newPad(function() {
      helperFunctions.createScript(function() {
        ep_scene_navigator_test_helper.utils.enableAllEASCButtons(done);
      });
    });
    this.timeout(20000);
  });

  context('when the pad is completely loaded', function() {
    var padSceneIds;

    before(function(done) {
      helperFunctions.getSceneIds(function(sceneIds) {
        padSceneIds = sceneIds;
        done();
      });
    });

    it('sets a unique for each heading', function(done) {
      expect(padSceneIds[0]).to.not.eql(padSceneIds[1]);
      done();
    });

    context('and user reloads the pad', function() {
      var padSceneIdsAfterReload;

      before(function(done) {
        helperFunctions.reloadPad(padId, function() {
          helperFunctions.getSceneIds(function(sceneIds) {
            padSceneIdsAfterReload = sceneIds;
            done();
          });
        });
      });

      it('does not change the scene ids', function(done) {
        expect(padSceneIds).to.eql(padSceneIdsAfterReload);
        done();
      });
    });

    context('when user adds a SCENE', function() {
      var padSceneIdsAfterCreatingNewScene;

      before(function(done) {
        helperFunctions.addScene(FIRST_SCENE_LINE, function() {
          // wait some time to get the new scene-ids list
          setTimeout(function() {
            helperFunctions.getSceneIds(function(sceneIds) {
              padSceneIdsAfterCreatingNewScene = sceneIds;
              done();
            });
          }, 1000);
        });
        this.timeout(20000);
      });

      it('creates a new id for the new heading', function(done) {
        expect(padSceneIdsAfterCreatingNewScene.length).to.eql(padSceneIds.length + 1);
        done();
      });
    });
  });
});

var ep_script_characters_test_helper = ep_script_characters_test_helper || {};
ep_script_characters_test_helper.generalTests = {
  createScript: function(cb) {
    var SMUtils = ep_script_scene_marks_test_helper.utils;
    SMUtils.cleanPad(function() {
      var firstScene = SMUtils.createSynopsis('heading 1');
      var action = SMUtils.action('first action');
      var secondScene = SMUtils.createSynopsis('heading 2');
      var dialogue = SMUtils.dialogue('last');
      var script = firstScene + action + secondScene + dialogue;
      SMUtils.createScriptWith(script, 'last', cb);
    });
  },
  reloadPad: function(targetPadId, done) {
    return helper.newPad(function() {
      ep_scene_navigator_test_helper.utils.enableAllEASCButtons(done);
    }, targetPadId);
  },
  addScene: function(line, cb) {
    shortcutAddSceneMark.MOUSE.addScene(line, cb);
  },
  getSceneIdBySceneIndex: function(sceneIndex, cb) {
    var sceneId;
    helper
      .waitFor(function() {
        // from 'scene-id scid-A8B6RzMlZg0wHr9O' gets 'scid-A8B6RzMlZg0wHr9O'
        var sceneIdRegex = new RegExp('scene-id (scid-[A-Za-z0-9]+)');
        var headingClass = helper
          .padInner$('heading')
          .eq(sceneIndex)
          .attr('class');
        sceneId = sceneIdRegex.exec(headingClass);
        return sceneId && sceneId.length;
      })
      .done(function() {
        cb(sceneId[1]); // e.g. cb('scid-A8B6RzMlZg0wHr9O')
      });
  },
  getSceneIds: function(cb) {
    helper
      .waitFor(function() {
        var $headings = helper.padInner$('heading.scene-id');
        return $headings.length;
      })
      .done(function() {
        // from 'scene-id scid-A8B6RzMlZg0wHr9O' gets 'scid-A8B6RzMlZg0wHr9O'
        var sceneIds = [];
        var sceneIdRegex = new RegExp('scene-id (scid-[A-Za-z0-9]+)');
        var $headings = helper.padInner$('heading.scene-id');
        $headings.each(function(index, element) {
          var headingClass = helper.padInner$(element).attr('class');
          var sceneId = sceneIdRegex.exec(headingClass);
          if (sceneId && sceneId.length) sceneIds.push(sceneId[1]);
        });
        cb(sceneIds);
      });
  },
};
