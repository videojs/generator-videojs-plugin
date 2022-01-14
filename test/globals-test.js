import videojs from 'video.js';
import QUnit from 'qunit';
import '../src/js/videojs-ra.js';

QUnit.module('videojs-ra globals');

QUnit.test('has expected globals', function(assert) {
  assert.ok(videojs.Ra, 'videojs has "Ra" property');
});
