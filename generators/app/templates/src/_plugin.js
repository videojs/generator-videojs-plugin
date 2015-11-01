import videojs from 'video.js';

// Default options for the plugin.
const defaults = {};

/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @function onPlayerReady
 * @param    {Object} options
 */
const onPlayerReady = function(options) {
  videojs.log('<%= packageName %> initializing', options);
  this.addClass('<%= pluginClassName %>');
};

/**
 * A video.js plugin.
 *
 * @function plugin
 * @param    {Object} [options={}]
 */
const <%= pluginFunctionName %> = function(options = {}) {

  // In here, the value of `this` is a video.js `Player` instance. You
  // cannot rely on the player being in a "ready" state here, depending
  // on how the plugin is invoked. This may or may not be important to
  // you; if not, remove the wait for "ready"!
  this.ready(() => onPlayerReady.call(this, videojs.mergeOptions(defaults, options)));
};

// Register the plugin with video.js.
videojs.plugin('<%= pluginFunctionName %>', <%= pluginFunctionName %>);

export default <%= pluginFunctionName %>;
