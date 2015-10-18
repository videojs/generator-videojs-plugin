import plugin from '../../src/plugin';

const Player = videojs.getComponent('Player');

QUnit.module('plugin');

QUnit.test('registers itself with video.js', function (assert) {
  assert.strictEqual(
    Player.prototype<% if (/^[A-Za-z0-9_]+$/.test(pluginName)) { %>.<%= pluginName %><% } else { %>['<%= pluginName %>']<% } %>,
    plugin,
    '<%= packageName %> plugin was registered'
  );
});
