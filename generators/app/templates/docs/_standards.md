# Brightcove video.js Plugin Standards

This document outlines standard of structure, tools, and workflows [Brightcove](https://www.brightcove.com) uses in developing both open-source and proprietary plugins for [video.js](http://videojs.com).

## Highlights

- JavaScript is:
  - Written in [ES6](http://es6-features.org/)
  - Linted with [videojs-standard](https://www.npmjs.com/package/videojs-standard)
  - Tested with [QUnit](https://api.qunitjs.com/)
  - Transpiled by [Babel](https://babeljs.io/)
  - Bundled with [Browserify](http://browserify.org/)
  - Minified with [UglifyJS](https://www.npmjs.com/package/uglify-js)

- Sass is _optional_ (and off by default), but it is the only option available in the generator for producing stylesheets.

- Task automation __must__ be available via npm scripts, but _optional_ Grunt tasks are provided by default.

## Packaging and Dependencies

All video.js plugins should be npm packages.

Direct dependencies (`"dependencies"` in `package.json`) will be empty by default. Plugins should be as self-contained as possible. It is assumed that anything included as a direct dependency will be bundled into the final plugin asset(s) or otherwise shimmed into the project (e.g. via `browserify-shim`).

Development dependencies (`"devDependencies"` in `package.json`) will include a number of defaults related to developing, building, and testing a video.js plugin.

The entry point for the package (`"main"` in `package.json`) should be `src/plugin.js`. This script should import whatever dependencies it needs. Similarly, `src/plugin.scss` is considered the entry point for Sass.

### Structure

Folder/Filename     | Optional | Description
------------------- | -------- | -----------
`dist/`             |          | Created during builds and ignored by Git.
`docs/`             | ✓        | Any documentation beyond `README.md`.
`lang/`             | ✓        | Any JSON language files for the plugin.
`scripts/`          | ✓        | Scripts used by npm, Grunt, or other tools.
`src/`              |          | All source code.
`src/scss/`         | ✓        | Sass source code.
`src/js/`           | ✓        | JavaScript source code.
`src/plugin.scss`   | ✓        | Sass entry point.
`src/plugin.js`     |          | JavaScript entry point.
`test/`             |          | All testing-related source code.
`test/unit/`        |          | QUnit/Karma unit tests.
`.editorconfig`     |          |
`.gitignore`        |          |
`.npmignore`        |          | Override `.gitignore`'s exclusion of `dist/`.
`bower.json`        |          |
`CHANGELOG.md`      | ✓        | 
`CONTRIBUTING.md`   | ✓        |
`index.html`        |          | An example of usage of the plugin. This can be used with GitHub pages as well.
`Gruntfile.js`      | ✓        |
`LICENSE`           | ✓        | Defaults to `Apache-2.0`
`package.json`      |          |
`README.md`         |          | Documents which version(s) of video.js the plugin supports. Explains how to build/test.

## Building

Building a standard video.js plugin should be possible through npm scripts (`"scripts"` in `package.json`).

Consistency is paramount in plugin build tasks: the names must be consistent across _all_ plugins that want to be called "standard." The following npm scripts exist by default and are expected to exist for all standard video.js plugins:

Script      | Description
----------- | -----------
`build`     | Runs `clean`, `build-css`, and `build-js`.
`build-css` | Compiles `src/plugin.scss` to `dist/<plugin-name>.css`.
`build-js`  | Builds `src/plugin.js` and outputs `dist/<plugin-name>.js` and `dist/<plugin-name>.min.js`.
`clean`     | Removes `dist/`.
`clean-css` | Removes all `.css` file(s) in `dist/`.
`clean-js`  | Removes all `.js` file(s) in `dist/`.
`lint`      | Lints all `.js` file(s)
`start`     | Starts a development server.
`test`      | Runs `lint`, `build`, and unit tests.
`watch`     | Runs `watch-css` and `watch-js`.
`watch-css` | Watches `.scss` file(s) for changes and runs `build-css`.
`watch-js`  | Watches `.js` file(s) for changes and runs `build-js`.

### Building with Grunt (Optional)

By default, plugins produced by the generator will provide a fully functional Grunt-based build process and the npm scripts mentioned previously will delegate to Grunt.

As with npm-based scripts, Grunt tasks/targets must be consistently named. It is the developer's prerogative to change the underlying tools, but exposing the following Grunt tasks is expected for all standard video.js plugins:

Task         | Description
------------ | -----------
`build`      | Alias for: `clean:dist`, `build:css`, `build:js`.
`build:css`  | Alias for: `clean:css`, `sass`, `usebanner:css`.
`build:js`   | Alias for: `clean:js`, `browserify`, `usebanner:js`, `uglify`.
`clean`      | Alias for: `clean:dist`.
`clean:dist` | Removes `dist/`.
`clean:css`  | Removes all `.css` file(s) in `dist/`.
`clean:js`   | Removes all `.js` file(s) in `dist/`.
`default`    | Alias for: `test`
`lint`       | Runs the npm `lint` script.
`start`      | Runs a dev server and `watch` concurrently.
`test`       | Alias for: `lint`, `build`, `qunit`
`watch`      | Alias for: `watch:css`, `watch:gruntfile`, `watch:js`, `watch:test`
`watch:css`  | Watches `.scss` file(s) for changes and runs `build:css`.
`watch:js`   | Watches `.js` file(s) for changes and runs `lint` and `build:js`.
`watch:test` | Watches test file(s) and `Gruntfile.js` for changes and runs `test`.

### Other Build/Automation Tools

If you prefer Gulp or Broccoli or the build tool of the week, you should feel free to use it, but remember to map the standard npm scripts to your build tool of choice!

## Release

Plugins should be tagged and published to npm as their primary release method.

### Versioning

We want to support Bower users as well as following software best practices (i.e. not adding build artifacts to source control); so, the version bumping process is somewhat involved under the hood. It is kicked off using `npm version` and will have the following effects:

1. The npm `"preversion"` script will run npm test.
1. npm automatically bumps the `package.json` version.
1. The npm `"version"` script will run:
  1. `package.json` is staged, committed, and pushed. The effect of this is that the `package.json` change exists in the history of `master`.
  1. The npm `"build"` script will run to compile the project.
  1. The `dist/` directory will be force-staged. Normally, it is ignored, but it needs to exist in the tag for Bower to install things properly.
1. npm automatically commits and tags. This commit will contain only the `dist/` dir (the `package.json` bump is the parent commit).
1. The npm `"postversion"` script will run:
  1. `master` is reset to the state of `origin/master`. This avoids `dist/` being added to `master`'s history - tagged commits will be children of commits on `master`.
  1. `master` is pushed to `origin/gh-pages` allowing the `index.html` demo file to be hosted on GitHub Pages.
  1. Tags are pushed to `origin`.

This process results in a `master` history that looks something like this:

```
<...> C --- V --- C --- C <...> C --- C --- V --- C --- C <...>
             \                               \
              T                               T
```

`C`: signifies a conventional commit.
`V`: signifies a version bump commit (3.i. above).
`T`: tagged commit (4. above).

## Publishing

TODO Outline publishing process after versioning.
