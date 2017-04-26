<a name="4.0.0"></a>
# [4.0.0](https://github.com/videojs/generator-videojs-plugin/compare/v3.3.1...v4.0.0) (2017-04-26)

### Features

* Remove Bower support option. ([804f835](https://github.com/videojs/generator-videojs-plugin/commit/804f835))
* Remove Brightcove Defaults ([d9565c8](https://github.com/videojs/generator-videojs-plugin/commit/d9565c8))
* Remove deprecated IE8 support option. ([ab2a7bc](https://github.com/videojs/generator-videojs-plugin/commit/ab2a7bc))
* Remove limit-to options. ([925bcdc](https://github.com/videojs/generator-videojs-plugin/commit/925bcdc))
* Remove vjsplugincheck script. ([e85e37f](https://github.com/videojs/generator-videojs-plugin/commit/e85e37f))
* Update videojs-spellbook to 4.0.0 (#124) ([dc43489](https://github.com/videojs/generator-videojs-plugin/commit/dc43489))

### Code Refactoring

* Refactor a bunch of application code for simplicity. ([fbc0e44](https://github.com/videojs/generator-videojs-plugin/commit/fbc0e44))


### BREAKING CHANGES

* This removes the option for generated projects to support Bower with special versioning.
* This removes the vjsplugincheck script.
* This removes the option to limit the output to certain files.
* This removes the option to use Brightcove default values for some fields.
* This removes the option to support IE8.
* This brings generated projects back to the 2.x-style output. This means, going from 3.0.0 to 4.0.0, files in `dist/browser` will once again be found in `dist` directly.

<a name="3.3.1"></a>
## [3.3.1](https://github.com/videojs/generator-videojs-plugin/compare/v3.3.0...v3.3.1) (2017-04-26)

### Bug Fixes

* Remove double prompt. (#126) ([95727f8](https://github.com/videojs/generator-videojs-plugin/commit/95727f8))

<a name="3.3.0"></a>
# [3.3.0](https://github.com/videojs/generator-videojs-plugin/compare/v3.2.0...v3.3.0) (2017-04-26)

### Features

* Deprecate limit-to and bcov options and IE8 support prompt. (#114) ([5a0f465](https://github.com/videojs/generator-videojs-plugin/commit/5a0f465))
* Support output of an advanced plugin (#113) ([19b6898](https://github.com/videojs/generator-videojs-plugin/commit/19b6898))

### Bug Fixes

* Fixes #116, remove HTML escaping for non-HTML files. (#125) ([3302379](https://github.com/videojs/generator-videojs-plugin/commit/3302379)), closes [#116](https://github.com/videojs/generator-videojs-plugin/issues/116) [#125](https://github.com/videojs/generator-videojs-plugin/issues/125)

<a name="3.2.0"></a>
# [3.2.0](https://github.com/videojs/generator-videojs-plugin/compare/v3.1.1...v3.2.0) (2017-04-12)

### Features

* use husky instead of ghooks (#121) ([011c28b](https://github.com/videojs/generator-videojs-plugin/commit/011c28b))

### Bug Fixes

* add browerify-versionify to cleanup & remove sinon (#122) ([81e4342](https://github.com/videojs/generator-videojs-plugin/commit/81e4342))

### Chores

* update spellbook version and remove browserify-shim (#123) ([2f3099f](https://github.com/videojs/generator-videojs-plugin/commit/2f3099f))

<a name="3.1.1"></a>
## [3.1.1](https://github.com/videojs/generator-videojs-plugin/compare/v3.1.0...v3.1.1) (2017-02-22)

### Bug Fixes

* Use relative paths and remove nested spellbook paths (#118) ([3d8a648](https://github.com/videojs/generator-videojs-plugin/commit/3d8a648))

## 3.1.0 (2017-02-12)
* @misteroneill Video.js 5/6 cross-compatibility updates (#110)
* @BrandonOCasey Put the sanity test in a module (#111)
* @misteroneill Fixed an issue where docs/index.md was not rendered as a template (#109)
* @adamoliver Updated link to conventions in CONTRIBUTING.md template (#107)

## 3.0.0 (2016-11-18)
* @misteroneill: Remove dependency on Babel, require Node 4.4+ (#102)
* @misteroneill: videojs-plugin-check updates for v3 (#101)
* @misteroneill: videojs-generator-cleanup updates for v3 (#100)
* @mister-ben: Note that plugin is created in current directory (#103)
* @BrandonOCasey: Only include useful files on npm (#99)
* @BrandonOCasey: Integrate with `videojs-spellbook` (#96)

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
