import videojs from 'video.js';

export default function plugin() {
  // The value of `this` is a video.js Player instance.
}

videojs.plugin('<%= pluginName %>', plugin);
