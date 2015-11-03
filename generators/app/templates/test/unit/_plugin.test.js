import document from 'global/document';

import _ from 'lodash';
import QUnit from 'qunit';
import sinon from 'sinon';
import videojs from 'video.js';

import plugin from '../../src/plugin';

const Player = videojs.getComponent('Player');

QUnit.test('the environment is sane', function(assert) {
  assert.strictEqual(typeof Array.isArray, 'function', 'es5 exists');
  assert.strictEqual(typeof _, 'function', 'lodash exists');
  assert.strictEqual(typeof sinon, 'object', 'sinon exists');
  assert.strictEqual(typeof videojs, 'function', 'videojs exists');
});

QUnit.module('<%= packageName %>', {

  beforeEach() {
    this.player = new Player(document.createElement('video'));

    // Mock the environment's timers because certain things - particularly
    // player readiness - are asynchronous in video.js 5.
    this.clock = sinon.useFakeTimers();
  },

  afterEach() {
    this.clock.restore();
  }
});

QUnit.test('registers itself with video.js', function(assert) {
  assert.ok(
    _.isFunction(plugin),
    '<%= packageName %> plugin is a function'
  );

  assert.strictEqual(
    Player.prototype.<%= pluginFunctionName %>,
    plugin,
    '<%= packageName %> plugin was registered'
  );

  this.player.<%= pluginFunctionName %>();

  // Tick the clock forward enough to trigger the player to be "ready".
  this.clock.tick(1);

  assert.ok(
    this.player.hasClass('<%= pluginClassName %>'),
    'the plugin adds a class to the player'
  );
});
