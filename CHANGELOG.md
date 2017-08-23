<a name="5.0.1"></a>
## [5.0.1](https://github.com/videojs/generator-videojs-plugin/compare/v5.0.0...v5.0.1) (2017-08-23)

### Bug Fixes

* bring doc precommit from 5s to 1s (#132) ([e9f2cb3](https://github.com/videojs/generator-videojs-plugin/commit/e9f2cb3))
* build sass before watching, as watch wont build until a change (#130) ([e7b0791](https://github.com/videojs/generator-videojs-plugin/commit/e7b0791))
* Set global as external to prevent a warning (#134) ([9a11d12](https://github.com/videojs/generator-videojs-plugin/commit/9a11d12))
* start should not build before starting, as watch will do that (#131) ([df4bac6](https://github.com/videojs/generator-videojs-plugin/commit/df4bac6))
* Use external-helpers in UMD builds (#129) ([4912227](https://github.com/videojs/generator-videojs-plugin/commit/4912227))

<a name="5.0.0"></a>
# [5.0.0](https://github.com/videojs/generator-videojs-plugin/compare/v2.3.0...v5.0.0) (2017-05-19)

### Features

* Add CHANGELOG handling by default via conventional-changelog ([c53b6cb](https://github.com/videojs/generator-videojs-plugin/commit/c53b6cb))
* Add watch scripts and simple static server ([56d71d8](https://github.com/videojs/generator-videojs-plugin/commit/56d71d8))
* Remove Bower support option. ([b2ef091](https://github.com/videojs/generator-videojs-plugin/commit/b2ef091))

### Bug Fixes

* Ensure we include old IE dependencies in tests. ([a506d12](https://github.com/videojs/generator-videojs-plugin/commit/a506d12))

### Code Refactoring

* Move naming methods into a module. ([8297d51](https://github.com/videojs/generator-videojs-plugin/commit/8297d51))
* Move several settings to the constants module. ([1dd813b](https://github.com/videojs/generator-videojs-plugin/commit/1dd813b))
* Remove Babel processing and vjsplugincheck script. ([cef03e9](https://github.com/videojs/generator-videojs-plugin/commit/cef03e9))
* Remove Browserify entirely in favor of Rollup. ([3132eae](https://github.com/videojs/generator-videojs-plugin/commit/3132eae))


### BREAKING CHANGES

* This removes the option for generated projects to support Bower with special versioning.
* Removed the vjsplugincheck script and the --bcov command line option.

## 2.3.0 (2017-02-09)
* Video.js 5/6 cross-compatibility (#108)

## 2.2.0 (2016-10-14)
* Add generator-version (#97)
  * This will store the generator version used for a plugin in its `package.json`.
* Update vjs-standard to 5.0.0 (#95)
  * This _does not affect generated projects_, only the generator itself.

## 2.1.1 (2016-10-13)
* Do not update CHANGELOG for prereleases (#94)
* Fix a possible delete property error (#92)

## 2.1.0 (2016-09-13)
* Added [ghooks](https://www.npmjs.com/package/ghooks) as an optional component of generated projects.
* Update to [Babel](https://www.npmjs.com/package/babel) 6.
* Added [bundle-collapser](https://www.npmjs.com/package/bundle-collapser) to reduce the size of built plugins.
* Added Markdown support to JSDoc tooling.
* Added `--limit-to` and `--limit-to-meta` CLI options.
* Fixed issues with Browserify transforms.
* Test code cleanup.

## 2.0.0 (2016-02-12)
* New [budo](https://www.npmjs.com/package/budo)-based development server.
* New `vjsgenclean` script to clean up old generator files.
* Added functioning Windows support.
* Added support for scoped packages (e.g. `@brightcove/videojs-foo`).
* Improved documentation.
* Test improvements.

## 1.0.4 (2016-01-30)
* Fixed CSS scripting problems.

## 1.0.3 (2016-01-11)
* Fixed an issue where running the generator against an existing project with an object for the `package.json` `author` field would fail.

## 1.0.2 (2016-01-05)
* Fixed issues with merging `package.json` files.
* Fixed issues with npm packaging.
* Fixed an issue where an invalid SPDX licenses was used.

## 1.0.1 (2015-12-05)
* Fixed a broken dependency.

## 1.0.0 (2015-12-05)
* Initial production-ready release.
