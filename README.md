# generator-videojs-plugin

This is an opinionated [Yeoman][yo] generator for [video.js][vjs] plugins. It is based on the recommendations of the video.js core team as well as tools and conventions for developing plugins at [Brightcove][bcov].

To learn more about video.js plugins and this generator's standards and opinions, check out:

- [video.js Plugins Guide][plugins-guide].
- [video.js Plugin Standards][standards].

### Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Getting Started](#getting-started)
  - [Options](#options)
    - [Install](#install)
    - [Prompt](#prompt)
    - [Hurry](#hurry)
    - [Brightcove Defaults](#brightcove-defaults)
- [Updating an Existing Project](#updating-an-existing-project)
  - [Recommendations](#recommendations)
- [Validation](#validation)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Getting Started

If you don't know what Yeoman is or what generators are, check out the Yeoman [Getting Started][getting-started] document. Long story short, make sure you have Yeoman and this generator installed globally:

```sh
$ npm install -g yo generator-videojs-plugin
```

Then, creating the foundation for your video.js plugin is as simple as:

```sh
$ yo videojs-plugin
```

You will be walked through several options and finish with a working, buildable, testable video.js plugin. Of course, this plugin won't do anything out of the box - that part is left to your creativity!

### Options

#### Install

By default, the generator will run `npm install` after it is finished. This can be a slow process and you may not always need it; so, it can be disabled (this option is provided by Yeoman itself, but it's useful and worth documenting here).

Turn installation off with: `yo videojs-plugin --skip-install`

#### Prompt

By default, the generator will present the user with a series of prompts to choose various settings. This can be disabled if you've previously selected values and don't want to change them.

Turn prompts off with: `yo videojs-plugin --skip-prompt`

#### Hurry

If you don't want to change configuration, but just want to update an existing plugin and skip all the other stuff (prompts, installation, "yosay"s), you can use this option to do that. _You may need to run the installation manually if dependencies changed!_

Turn prompts off with: `yo videojs-plugin --hurry`

#### Brightcove Defaults

Set certain values automatically for Brightcove-authored plugins. Has the following effects:

- Sets the author to `"Brightcove, Inc."`
- Limits open-source license options to `Apache-2.0` only.

Turn on these Brightcove defaults with: `yo videojs-plugin --bcov`

## Updating an Existing Project

Running a Yeoman generator in an empty directory poses no difficulties; however, running it against an existing project can cause conflicts. Yeoman provides a mechanism, which can be confusing because it's not clearly documented, for resolving these conflicts. It will prompt you to choose one of: 

- `Y`: yes (default)
- `n`: no
- `a`: yes to all
- `x`: exit
- `d`: diff
- `h`: help

### Recommendations

Most of what this generator does is localized to the `package.json` file. Luckily, the generator does a good job of merging your existing contents with the generated contents. In general, it's safe to select `Y` for the `package.json` in your project.

Other files you'll usually want to select `n` on - particularly those files plugin authors will edit the most: anything in `src/` or `test/`.

However, files that are _not_ commonly edited by plugin authors may deserve a diff check (`d`) if you've made changes to these sorts of files. For example, anything in `scripts/`.

## Validation

Also provided by this generator is a CLI application for validating a directory as following current [video.js Plugin Standards][standards]. Using it is very simple; run the following command:

```sh
$ vjsplugincheck
```

There are no options or arguments available or needed. This will run a series of tests against the contents of `process.cwd()` (the current directory).

_Note: this command can be used on any plugin project - not just those using the generator!_

## License

[Apache 2.0][license]

[bcov]: https://www.brightcove.com/
[getting-started]: http://yeoman.io/learning/index.html
[license]: LICENSE
[plugins-guide]: https://github.com/videojs/video.js/blob/master/docs/guides/plugins.md
[standards]: docs/standards.md
[tape]: https://www.npmjs.com/package/tape
[vjs]: http://videojs.com/
[yo]: http://yeoman.io/
