import videojs from 'video.js';
import {version as VERSION} from '../package.json';

// Default options for the plugin.
const defaults = {};

/**
 * An advanced Video.js plugin. For more information on the API
 *
 * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
 */

const ra = function(options) {

  const player = this; // eslint-disable-line consistent-this
  /**
   * Create a Ra plugin instance.
   *
   * @param  {Player} player
   *         A Video.js Player instance.
   *
   * @param  {Object} [options]
   *         An optional options object.
   *
   *         While not a core part of the Video.js plugin architecture, a
   *         second argument of options is a convenient way to accept inputs
   *         from your plugin's caller.
   */

  this.options = videojs.mergeOptions(defaults, options);

  player.ready(() => {
    player.addClass('vjs-ra');
  });

  player.on('playing', function() {
    this.volume(0.25);
    videojs.log('playback began 1!');
  });
};

// Define default values for the plugin's `state` object here.
ra.defaultState = {};

// Include the version number.
ra.VERSION = VERSION;

// Register the plugin with video.js.
videojs.registerPlugin('ra', ra);

export default ra;
