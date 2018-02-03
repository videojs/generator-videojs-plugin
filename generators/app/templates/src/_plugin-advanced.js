import videojs from 'video.js';
import {version as VERSION} from '../package.json';

const Plugin = videojs.getPlugin('plugin');

// Default options for the plugin.
const defaults = {};

/**
 * An advanced Video.js plugin.
 */
class <%= pluginClassName %> extends Plugin {

  /**
   * Create a <%= pluginClassName %> plugin instance.
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
  constructor(player, options) {
    super(player);

    this.options = videojs.mergeOptions(defaults, options);

    player.ready(() => {
      player.addClass('<%= className %>');
    });
  }
}

// Define default values for the plugin's `state` object here.
<%= pluginClassName %>.defaultState = {};

// Include the version number.
<%= pluginClassName %>.VERSION = VERSION;

// Register the plugin with video.js.
videojs.registerPlugin('<%= pluginFunctionName %>', <%= pluginClassName %>);

export default <%= pluginClassName %>;
