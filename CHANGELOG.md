<a name="6.0.5"></a>
## [6.0.5](https://github.com/videojs/generator-videojs-plugin/compare/v6.0.4...v6.0.5) (2018-06-12)

### Bug Fixes

* no longer make test/dist ([774d337](https://github.com/videojs/generator-videojs-plugin/commit/774d337))

<a name="6.0.4"></a>
## [6.0.4](https://github.com/videojs/generator-videojs-plugin/compare/v6.0.3...v6.0.4) (2018-06-12)

### Bug Fixes

* linter warning ([008b57b](https://github.com/videojs/generator-videojs-plugin/commit/008b57b))

<a name="6.0.3"></a>
## [6.0.3](https://github.com/videojs/generator-videojs-plugin/compare/v6.0.2...v6.0.3) (2018-06-11)

### Bug Fixes

* copy/paste issues ([c8cb015](https://github.com/videojs/generator-videojs-plugin/commit/c8cb015))

<a name="6.0.2"></a>
## [6.0.2](https://github.com/videojs/generator-videojs-plugin/compare/v6.0.1...v6.0.2) (2018-06-11)

### Bug Fixes

* only uglify during build ([38e9f52](https://github.com/videojs/generator-videojs-plugin/commit/38e9f52))
* switch to serve-static as its more stable ([462a36d](https://github.com/videojs/generator-videojs-plugin/commit/462a36d))
* unintended breaking change, there is no .min.css ([117cf63](https://github.com/videojs/generator-videojs-plugin/commit/117cf63))

<a name="6.0.1"></a>
## [6.0.1](https://github.com/videojs/generator-videojs-plugin/compare/v6.0.0...v6.0.1) (2018-06-11)

### Bug Fixes

* remove deps from optional ([21a93b8](https://github.com/videojs/generator-videojs-plugin/commit/21a93b8))
* small script fix, support greenkeeper lock on travis (#180) ([6fcb9e6](https://github.com/videojs/generator-videojs-plugin/commit/6fcb9e6)), closes [#180](https://github.com/videojs/generator-videojs-plugin/issues/180)

<a name="6.0.0"></a>
# [6.0.0](https://github.com/videojs/generator-videojs-plugin/compare/v5.2.1...v6.0.0) (2018-06-11)

### Features

* **BREAKING:** generated projects can no longer support IE8 out of the box. (#151) ([6669baa](https://github.com/videojs/generator-videojs-plugin/commit/6669baa)), closes [#151](https://github.com/videojs/generator-videojs-plugin/issues/151)
* **BREAKING:** Remove Sass support option. (#152) ([eab6398](https://github.com/videojs/generator-videojs-plugin/commit/eab6398)), closes [#152](https://github.com/videojs/generator-videojs-plugin/issues/152)
* add generator deps as optional so they stay up to date (#165) ([815f15e](https://github.com/videojs/generator-videojs-plugin/commit/815f15e)), closes [#165](https://github.com/videojs/generator-videojs-plugin/issues/165)
* Allow choosing a basic or advanced plugin. (#154) ([2881848](https://github.com/videojs/generator-videojs-plugin/commit/2881848)), closes [#154](https://github.com/videojs/generator-videojs-plugin/issues/154)
* css support through postcss (#172) ([6664523](https://github.com/videojs/generator-videojs-plugin/commit/6664523)), closes [#172](https://github.com/videojs/generator-videojs-plugin/issues/172)
* update karma-qunit and switch to qunit pkg (#160) ([7c8f3dd](https://github.com/videojs/generator-videojs-plugin/commit/7c8f3dd)), closes [#160](https://github.com/videojs/generator-videojs-plugin/issues/160)
* use browserslist through babel-preset-env and postcss-preset-env (#176) ([0eef1b8](https://github.com/videojs/generator-videojs-plugin/commit/0eef1b8)), closes [#176](https://github.com/videojs/generator-videojs-plugin/issues/176)
* use karma server as dev server (#168) ([4afd6c2](https://github.com/videojs/generator-videojs-plugin/commit/4afd6c2)), closes [#168](https://github.com/videojs/generator-videojs-plugin/issues/168)

### Bug Fixes

* add videojs-languages to optional add add a test (#170) ([4b991e5](https://github.com/videojs/generator-videojs-plugin/commit/4b991e5)), closes [#170](https://github.com/videojs/generator-videojs-plugin/issues/170)
* always build css and lang before test ([2de0a9c](https://github.com/videojs/generator-videojs-plugin/commit/2de0a9c))

### Chores

* **BREAKING:** Only support node 8+ as dependencies now require it (#169) ([d0feb26](https://github.com/videojs/generator-videojs-plugin/commit/d0feb26)), closes [#169](https://github.com/videojs/generator-videojs-plugin/issues/169)
* move jsdoc and karma config (#171) ([aadaae7](https://github.com/videojs/generator-videojs-plugin/commit/aadaae7)), closes [#171](https://github.com/videojs/generator-videojs-plugin/issues/171)
* update video.js ([c350310](https://github.com/videojs/generator-videojs-plugin/commit/c350310))
* **package:** add 6.x back to video.js version ([77fc224](https://github.com/videojs/generator-videojs-plugin/commit/77fc224))
* **package:** update yeoman-generator (#177) ([bcc36ce](https://github.com/videojs/generator-videojs-plugin/commit/bcc36ce)), closes [#177](https://github.com/videojs/generator-videojs-plugin/issues/177)

### Code Refactoring

* A single rollup config, and let karma rollup during run (#155) ([d3c6ba1](https://github.com/videojs/generator-videojs-plugin/commit/d3c6ba1)), closes [#155](https://github.com/videojs/generator-videojs-plugin/issues/155)

<a name="5.2.1"></a>
## [5.2.1](https://github.com/videojs/generator-videojs-plugin/compare/v5.2.0...v5.2.1) (2018-02-03)

### Bug Fixes

* Do not add .yo-rc.json to .gitignore (#150) ([af317b9](https://github.com/videojs/generator-videojs-plugin/commit/af317b9))

### Code Refactoring

* Save bytes in the UMD module by using Rollup globals rather than bundling the global module. ([dc05ad0](https://github.com/videojs/generator-videojs-plugin/commit/dc05ad0))

<a name="5.2.0"></a>
# [5.2.0](https://github.com/videojs/generator-videojs-plugin/compare/v5.1.1...v5.2.0) (2018-01-10)

### Features

* Add .nvmrc and update various minimum dependency versions. (#148) ([5b7ba9b](https://github.com/videojs/generator-videojs-plugin/commit/5b7ba9b))

<a name="5.1.1"></a>
## [5.1.1](https://github.com/videojs/generator-videojs-plugin/compare/v5.1.0...v5.1.1) (2017-12-15)

### Bug Fixes

* Fix linter errors on generated server.js file. ([9a4aa46](https://github.com/videojs/generator-videojs-plugin/commit/9a4aa46))

<a name="5.1.0"></a>
# [5.1.0](https://github.com/videojs/generator-videojs-plugin/compare/v5.0.4...v5.1.0) (2017-12-14)

### Features

* Add support for port scanning in the development server to use the first available port from 9999 to 10999. (#145) ([7de482d](https://github.com/videojs/generator-videojs-plugin/commit/7de482d))
* Don't build on install (#142) ([117cdfb](https://github.com/videojs/generator-videojs-plugin/commit/117cdfb))

### Bug Fixes

* Prepublish install failure (#143) ([40735aa](https://github.com/videojs/generator-videojs-plugin/commit/40735aa))

### Code Refactoring

* Make sure Node versions are consistent. (#144) ([338779f](https://github.com/videojs/generator-videojs-plugin/commit/338779f))

<a name="5.0.4"></a>
## [5.0.4](https://github.com/videojs/generator-videojs-plugin/compare/v5.0.3...v5.0.4) (2017-11-27)

<a name="5.0.3"></a>
## [5.0.3](https://github.com/videojs/generator-videojs-plugin/compare/v5.0.2...v5.0.3) (2017-11-07)

### Bug Fixes

* Fix broken watch as of Sass 4.6.0 (#138) ([9d24d0d](https://github.com/videojs/generator-videojs-plugin/commit/9d24d0d)), closes [#138](https://github.com/videojs/generator-videojs-plugin/issues/138)
* Tick 2ms in tests for player ready, see https://github.com/videojs/video.js/pull/4665 (#136) ([87f0d08](https://github.com/videojs/generator-videojs-plugin/commit/87f0d08))

### Chores

* Update to Rollup 0.50 to fix issue with test builds. (#137) ([b8e359b](https://github.com/videojs/generator-videojs-plugin/commit/b8e359b)), closes [#137](https://github.com/videojs/generator-videojs-plugin/issues/137)

<a name="5.0.2"></a>
## [5.0.2](https://github.com/videojs/generator-videojs-plugin/compare/v5.0.1...v5.0.2) (2017-08-23)

### Bug Fixes

* Explicitly set global/document and global/window as external for module builds to avoid warnings. ([7601d77](https://github.com/videojs/generator-videojs-plugin/commit/7601d77))

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
