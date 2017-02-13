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
