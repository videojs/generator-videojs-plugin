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
function onPlayerReady(options) {
  videojs.log('<%= pluginName %> initializing', options);
}

/**
 * A video.js plugin.
 *
 * @function plugin
 * @param    {Object} [options={}]
 */
export default function plugin(options = {}) {

  // In here, the value of `this` is a video.js `Player` instance. You
  // cannot rely on the player being in a "ready" state here, depending
  // on how the plugin is invoked. This may or may not be important to
  // you; if not, remove the wait for "ready"!
  this.ready(() => onPlayerReady(videojs.mergeOptions(defaults, options)));
}

// Register the plugin with video.js.
videojs.plugin('<%= pluginName %>', plugin);
