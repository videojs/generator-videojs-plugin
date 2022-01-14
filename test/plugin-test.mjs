import QUnit from 'qunit';
import assert from 'yeoman-assert';
import videojs from 'video.js';
//import plugin from '../src/plugin.js';

// describe('environment', function() {
//   it('the environment is sane', function() {
//     assert.strictEqual(typeof Array.isArray, 'function', 'es5 exists');
//     assert.strictEqual(typeof videojs, 'function', 'videojs exists');
//   });
// });

QUnit.module('Environment', {
  beforeEach() {
    this.player = {
      currentSrc: () => {},
      duration: () => {},
      on: () => {},
      one: () => {},
      ready: () => {},
      setTimeout: () => {}
    };
  }
}, function () {
  QUnit.test('the environment is sane', function (assert) {
    assert.strictEqual(typeof Array.isArray, 'function', 'es5 exists');
    assert.strictEqual(typeof videojs, 'function', 'videojs exists');
    //assert.strictEqual(typeof plugin, 'function', 'plugin is a function');
  });
});
//
// QUnit.test('registers itself with video.js', function(assert) {
//   assert.expect(1);
//   assert.strictEqual(
//     typeof videojs.getComponent('Player').prototype.playlist,
//     'function',
//     'videojs-playlist plugin was registered'
//   );
// });
