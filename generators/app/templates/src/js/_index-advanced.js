import videojs from 'video.js';

const Plugin = videojs.getPlugin('plugin');

// Default options for the plugin.
const defaults = {};

/**
 * A plugin class.
 */
class <%= constructorName %> extends Plugin {

  /**
   * Create an instance of the <%= constructorName %> plugin class.
   *
   * @param  {Player} player
   *         An instance of a Video.js player.
   *
   * @param  {Object} options
   *         An object of options for the plugin author to define, if desired.
   */
  constructor(player, options) {
    super(player, options);
    this.options = videojs.mergeOptions(defaults, options);

    this.player.ready(() => {
      this.player.addClass('<%= className %>');
    });
  }

  /**
   * Handles "statechanged" events on the plugin.
   *
   * @param    {Event} e
   *           An event object provided by a "statechanged" event.
   *
   * @param    {Object} e.changes
   *           An object describing changes that occurred with the "statechanged"
   *           event.
   */
  handleStateChanged(e) {}
}

// Define default values for the plugin's `state`.
<%= constructorName %>.defaultState = {};

// Register the plugin with video.js.
videojs.registerPlugin('<%= functionName %>', <%= constructorName %>);

// Include the version number.
<%= constructorName %>.VERSION = '__VERSION__';

export default <%= constructorName %>;
