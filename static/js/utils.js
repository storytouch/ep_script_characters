exports.getPluginProps = function() {
  pad.plugins = pad.plugins || {};
  pad.plugins.ep_script_characters = pad.plugins.ep_script_characters || {};
  return pad.plugins.ep_script_characters;
};

// Easier access to outer pad
var padOuter;
exports.getPadOuter = function() {
  padOuter = padOuter || $('iframe[name="ace_outer"]').contents();
  return padOuter;
};

// Easier access to inner pad
var padInner;
exports.getPadInner = function() {
  padInner =
    padInner ||
    this.getPadOuter()
      .find('iframe[name="ace_inner"]')
      .contents();
  return padInner;
};
