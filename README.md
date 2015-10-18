# generator-videojs-plugin [![Build Status](https://secure.travis-ci.org/videojs/generator-videojs-plugin.png?branch=master)](https://travis-ci.org/videojs/generator-videojs-plugin)

This is a [Yeoman](http://yeoman.io) generator for [video.js](http://videojs.com) plugins. It is based on the recommendations of the video.js core team as well as tools and conventions for developing plugins at [Brightcove](https://www.brightcove.com).

To learn more about video.js plugins and this generator, check out:

- [video.js Plugins Guide](https://github.com/videojs/video.js/blob/master/docs/guides/plugins.md).
- [Brightcove's video.js Plugin Standards](https://github.com/videojs/generator-videojs-plugin/generators/app/templates/docs/_standards.md).

## Getting Started

If you don't know what Yeoman is or what generators are, check out the Yeoman [Getting Started](http://yeoman.io/learning/index.html) document. Long story short, make sure you have Yoeman and this generator installed globally:

```bash
npm install -g yo generator-videojs-plugin
```

Then, creating the foundation for your video.js plugin is as simple as:

```bash
yo videojs-plugin
```

You will be walked through several options and ultimately be presented with a working video.js plugin. Of course, this plugin won't do anything out of the box - that part is left to your creativity!

### Options

Using the `--bcov` option will set certain values automatically for Brightcove-authored plugins. For example, all Brightcove plugins use the Apache-2.0 license; so, the license option is not presented to the user.

```bash
yo videojs-plugin --bcov
```

## License

[Apache 2.0](LICENSE)
