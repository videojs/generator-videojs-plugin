import plugin from '../../src/plugin';

const Player = videojs.getComponent('Player');

QUnit.module('plugin');

QUnit.test('registers itself with video.js', function (assert) {
  assert.strictEqual(typeof plugin, 'function','<%= packageName %> plugin is a function');
  assert.strictEqual(Player.prototype<%= pluginNamePropertyAccessor %>, plugin, '<%= packageName %> plugin was registered');
});
