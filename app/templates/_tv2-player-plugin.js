/*! <%= pluginName %> - v<%= version %> - <%= today %>
 * Copyright (c) <%= year %> <%= author %>
 * Licensed under the <%= license %> license. */
(function(window, videojs) {
  'use strict';

  var defaults = {
        option: true
      }, <%= camelPluginName %>;

  /**
   * Initialize the plugin.
   * @param options (optional) {object} configuration for the plugin
   */
  <%= camelPluginName %> = function(options) {
    var settings = videojs.mergeOptions(defaults, options),
        player = this;

    // TODO: write some amazing plugin code
  };

  // register the plugin
  videojs.plugin('<%= camelPluginName %>', <%= camelPluginName %>);
})(window, window.videojs);
