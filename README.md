# generator-videojs-plugin

[![Build Status](https://travis-ci.org/videojs/generator-videojs-plugin.svg?branch=master)](https://travis-ci.org/videojs/generator-videojs-plugin)
[![Greenkeeper badge](https://badges.greenkeeper.io/videojs/generator-videojs-plugin.svg)](https://greenkeeper.io/)
[![Slack Status](http://slack.videojs.com/badge.svg)](http://slack.videojs.com)

[![NPM](https://nodei.co/npm/generator-videojs-plugin.png?downloads=true&downloadRank=true)](https://nodei.co/npm/generator-videojs-plugin/)

This is an opinionated [Yeoman][yo] generator for [Video.js][vjs] plugins. It is based on the recommendations of the Video.js core team as well as tools and conventions for developing plugins at [Brightcove][bcov].

Lead Maintainer: Pat O'Neill [@misteroneill](https://github.com/misteroneill)

Maintenance Status: Stable

To learn more about Video.js plugins and this generator's conventions and opinions, check out:

- [Video.js Plugins Guide][plugins-guide].
- [Video.js Plugin Conventions][conventions].

### Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Getting Started](#getting-started)
  - [Options](#options)
    - [Install](#install)
    - [Prompt](#prompt)
    - [Hurry](#hurry)
- [Updating an Existing Project](#updating-an-existing-project)
  - [Recommendations](#recommendations)
  - [Migrating to the Latest Version](#migrating-to-the-latest-version)
  - [Where do dependencies come from?](#where-do-dependencies-come-from)
    - [`videojs-generate-rollup-config`](#videojs-generate-rollup-config)
    - [`videojs-genreate-karma-config`](#videojs-genreate-karma-config)
    - [`videojs-generate-postcss-config`](#videojs-generate-postcss-config)
    - [`videojs-generator-verify`](#videojs-generator-verify)
    - [`@videojs/generator-helpers`](#videojsgenerator-helpers)
    - [No longer needed](#no-longer-needed)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Getting Started

If you don't know what Yeoman is or what generators are, check out the Yeoman [Getting Started][getting-started] document. Long story short, make sure you have Yeoman and this generator installed globally:

```sh
$ npm install -g yo generator-videojs-plugin
```

Then, creating the foundation for your Video.js plugin is as simple as:

```sh
$ yo videojs-plugin
```

You will be walked through several options and finish with a working, buildable, testable Video.js plugin. Of course, this plugin won't do anything out of the box - that part is left to your creativity!

### Options

#### Install

By default, the generator will run `npm install` after it is finished. This can be a slow process and you may not always need it; so, it can be disabled (this option is provided by Yeoman itself, but it's useful and worth documenting here).

```sh
yo videojs-plugin --skip-install
```

#### Prompt

By default, the generator will present the user with a series of prompts to choose various settings. This can be disabled if you've previously selected values and don't want to change them.

```sh
yo videojs-plugin --skip-prompt
```

#### Hurry

If you don't want to change configuration, but just want to update an existing plugin and skip all the other stuff (e.g., prompts, installation), you can use this option to do that. _You may need to run the installation manually if dependencies changed!_

```sh
yo videojs-plugin --hurry
```

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

### Migrating to the Latest Version

> **NOTE:** This section comes with the caveat that you know your project better than we do; so, do what you think is best.

Migrating across major versions can be a bit of a pain sometimes, but we're working on making it better with the generator. Here are some notes on migrating to the current major version.

You may - depending on your customizations - want to prepare your project by doing one of two things.

If you have made no customizations, the simplest process may be to remove some or all of the following:

- `dependencies`, `devDependencies`, and/or `scripts` from `package.json`
- `package-lock.json`
- `scripts/*.js`
- `test/karma.conf.js`
- `test/index.html`

For a more conservative approach, you should be able to remove any dependencies not listed in [`plugin/package.json`](plugin/package.json) unless it is specifically needed by your project.

### Where do dependencies come from?

#### `videojs-generate-rollup-config`
```
babel-core
babel-plugin-external-helpers
babel-plugin-transform-object-assign
babel-preset-env
@babel/preset-env
@babel/plugin-transform-object-assign
@babel/core
@babel/plugin-external-helpers
rollup-plugin-babel
rollup-plugin-commonjs
rollup-plugin-json
rollup-plugin-multi-entry
rollup-plugin-node-resolve
rollup-plugin-uglify
rollup-plugin-terser
uglify-es
```

#### `videojs-genreate-karma-config`
```
karma-browserstack-launcher
karma-chrome-launcher
karma-coverage
karma-detect-browsers
karma-firefox-launcher
karma-ie-launcher
karma-qunit
karma-safari-launcher
karma-safaritechpreview-launcher
karma-safari-applescript-launcher
karma-teamcity-reporter
karma-static-server
qunit
```

#### `videojs-generate-postcss-config`
```
autoprefixer
postcss-banner
postcss-calc
postcss-csso
postcss-custom-properties
postcss-import
postcss-nesting
postcss-progress
```

#### `videojs-generator-verify`
```
es-check
pkg-ok
pkg-can-install
```

#### `@videojs/generator-helpers`
```
conventional-changelog-cli
conventional-changelog-videojs
doctoc
husky
lint-staged
not-prerelease
npm-merge-driver-install
npm-run-all
shx
```

#### No longer needed

No longer needed for other reasons
* `serve-static`: replaced by `karma-static-server`
* `in-publish`: replaced by using `prepublishOnly` via a new version of npm
* `mkdirp`: replaced by using `shx`
* `rimraf`: replaced by using `shx`
* `semver`: replaced by `@videojs/generator-helpers`

## License

[Apache 2.0][license]

[bcov]: https://www.brightcove.com/
[getting-started]: http://yeoman.io/learning/index.html
[license]: LICENSE
[plugins-guide]: https://github.com/videojs/Video.js/blob/master/docs/guides/plugins.md
[conventions]: docs/conventions.md
[vjs]: http://videojs.com/
[yo]: http://yeoman.io/
