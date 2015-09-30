/*! <%= pluginName %> - v<%= version %> - <%= today %>
 * Copyright (c) <%= year %> <%= author %>
 * Licensed under the <%= license %> license. */
(function(window, videojs, qunit) {
  'use strict';

  var player,

      // local QUnit aliases
      // http://api.qunitjs.com/

      // module(name, {[setup][ ,teardown]})
      module = qunit.module,
      // test(name, callback)
      test = qunit.test,
      // ok(value, [message])
      ok = qunit.ok,
      // equal(actual, expected, [message])
      equal = qunit.equal,
      // strictEqual(actual, expected, [message])
      strictEqual = qunit.strictEqual,
      // deepEqual(actual, expected, [message])
      deepEqual = qunit.deepEqual,
      // notEqual(actual, expected, [message])
      notEqual = qunit.notEqual,
      // throws(block, [expected], [message])
      throws = qunit.throws;

  module('<%= pluginName %>', {
    setup: function() {
      // create a video element
      var video = document.createElement('video');
      document.querySelector('#qunit-fixture').appendChild(video);

      // create a video.js player
      player = videojs(video);

      // initialize the plugin with the default options
      player.<%= camelPluginName %>();
    },
    teardown: function() {
    }
  });

  test('registers itself', function() {
    ok(player.<%= camelPluginName %>, 'registered the plugin');
  });
})(window, window.videojs, window.QUnit);
