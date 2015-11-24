# generator-videojs-plugin

This is a [Yeoman](http://yeoman.io) generator for [video.js](http://videojs.com) plugins. It is based on the recommendations of the video.js core team as well as tools and conventions for developing plugins at [Brightcove](https://www.brightcove.com).

To learn more about video.js plugins and this generator's standards and opinions, check out:

- [video.js Plugins Guide](https://github.com/videojs/video.js/blob/master/docs/guides/plugins.md).
- [Brightcove's video.js Plugin Standards](docs/standards.md).

### Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Getting Started](#getting-started)
  - [Options](#options)
    - [Brightcove Defaults](#brightcove-defaults)
    - [Install](#install)
    - [Prompt](#prompt)
    - [Hurry](#hurry)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Getting Started

If you don't know what Yeoman is or what generators are, check out the Yeoman [Getting Started](http://yeoman.io/learning/index.html) document. Long story short, make sure you have Yoeman and this generator installed globally:

```sh
$ npm install -g yo generator-videojs-plugin
```

Then, creating the foundation for your video.js plugin is as simple as:

```sh
$ yo videojs-plugin
```

For the typing-phobic, a shortcut is available:

```sh
$ vjsp
```

You will be walked through several options and ultimately be presented with a working video.js plugin. Of course, this plugin won't do anything out of the box - that part is left to your creativity!

### Options

#### Brightcove Defaults

Set certain values automatically for Brightcove-authored plugins. For example, all Brightcove plugins use the Apache-2.0 license; so, the license prompt is not presented to the user.

Turn Brightcove defaults on with: `yo videojs-plugin --bcov`

#### Install

By default, the generator will run `npm install` after it is finished. This can be a slower process and you may not always need it; so, it can be disabled (this option is provided by Yeoman itself).

Turn installation off with: `yo videojs-plugin --skip-install`

#### Prompt

By default, the generator will present the user with a series of prompts to choose various settings. This can be disabled if you've previously selected values and don't want to change them.

Turn prompts off with: `yo videojs-plugin --skip-prompt`

#### Hurry

If you just want to update an existing plugin and skip all the other stuff (prompts, installation, "yosay"s), you can use this option to do that.

Turn prompts off with: `yo videojs-plugin --hurry`

## License

[Apache 2.0](LICENSE)
