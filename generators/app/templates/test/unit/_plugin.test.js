import plugin from '../../src/plugin';

const Player = videojs.getComponent('Player');

QUnit.module('<%= packageName %>', {

  beforeEach: function () {
    this.player = new Player(document.createElement('video'));
  },

  afterEach: function () {
    this.player.dispose();
  }
});

QUnit.test('registers itself with video.js', function (assert) {
  assert.strictEqual(typeof plugin, 'function','<%= packageName %> plugin is a function');
  assert.strictEqual(Player.prototype.<%= pluginFunctionName %>, plugin, '<%= packageName %> plugin was registered');
  this.player.<%= pluginFunctionName %>();
  assert.ok(this.player.hasClass('<%= pluginClassName %>'), 'the plugin adds a class to the player');
});
