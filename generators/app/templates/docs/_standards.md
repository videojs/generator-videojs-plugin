# Brightcove video.js Plugin Standards

This document contains the standard rules of structure, tooling, and workflow used at [Brightcove](https://www.brightcove.com) in developing both open-source and proprietary plugins for [video.js](http://videojs.com).

These rules are by no means required for community plugins. This is provided as an open-source project for the good of the community. If you don't agree with them, by all means stick to your own preferences in your own plugin projects!

## Use the Generator!

There is a Yeoman generator available for kicking off standard video.js plugin projects. It is [open source](https://github.com/videojs/generator-videojs-plugin) and [available on npm](https://www.npmjs.com/package/generator-videojs-plugin).

## Packaging and Dependencies

All video.js plugins must be npm packages.

Plugins should be as self-contained as possible, so direct dependencies (`"dependencies"` in `package.json`) is empty by default. It is assumed that anything included as a direct dependency will be bundled into the final plugin asset(s) or otherwise shimmed into the project (e.g. via `browserify-shim`, which is the case for video.js).

Development dependencies (`"devDependencies"` in `package.json`) will include a number of defaults related to developing, building, and testing a video.js plugin. These vary based on options used to generate your plugin.

The entry point for the package (`"main"` in `package.json`) should be `src/plugin.js`. This script should import whatever dependencies it needs. Similarly, `src/plugin.scss` is considered the entry point for Sass, if it is enabled/required.

### Structure

Folder/Filename     | Optional | Description
------------------- | -------- | -----------
`dist/`             |          | Created during builds and ignored by Git.
`docs/`             | ✓        | Any documentation beyond `README.md`.
`lang/`             | ✓        | Any JSON language files for the plugin.
`scripts/`          | ✓        | Scripts used by npm, Grunt, or other tools; _not part of the source code!_
`src/`              |          | All source code.
`src/scss/`         | ✓        | Sass source code/partials.
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

Building a standard video.js plugin must be possible through npm scripts (`"scripts"` in `package.json`). There are many reasons for this rule:

- Complicated build tools are not necessary for most plugins.
- Where build tools are useful, npm scripts can easily act as aliases to your Grunt/Gulp/whatever build tasks (e.g., `"build": "grunt build"`).
  - This also means that plugin authors have complete freedom in choosing a tool they prefer behind the scenes.
- Consistent script naming means contributors don't have to think when moving between plugin projects, lowering the barrier to contributions.

### Grunt, by Default

By default, a Grunt-based workflow is provided by the generator. Its tasks closely match the npm scripts outlined below. By default, it will run `grunt test`.

### npm Scripts

What follows is a table of the standard npm script names. All names are lower-case and use hyphens (`-`) as word-separators.

npm Script   | Grunt Equiv.       | Optional | Description
------------ | ------------------ | -------- | -----------
`build`      | `grunt build`      |          | Cleans up any old build and produces a new one.
`build-css`  | `grunt build:css`  | ✓        | Compiles `src/plugin.scss` to `dist/<plugin-name>.css`.
`build-js`   | `grunt build:js`   |          | Builds `src/plugin.js` and outputs `dist/<plugin-name>.js` and `dist/<plugin-name>.min.js`.
`clean`      | `grunt clean`      |          | Alias for `clean-dist`.
`clean-dist` | `grunt clean:dist` |          | Removes `dist/`.
`clean-css`  | `grunt clean:css`  | ✓        | Rremoves all `.css` file(s) in `dist/`.
`clean-js`   | `grunt clean:js`   |          | Removes all `.js` file(s) in `dist/`.
`lint`       | `grunt lint`       |          | Lints all `.js` file(s)
`start`      | `grunt start`      |          | Starts a development server.
`test`       | `grunt test`       |          | Runs `lint`, `build`, and tests.
`watch`      | `grunt watch`      |          | Watches everything and runs appropriate tasks.
`watch-css`  | `grunt watch:css`  | ✓        | Watches `.scss` file(s) for changes and runs `build-css`.
`watch-js`   | `grunt watch:js`   |          | Watches `.js` file(s) for changes and runs `build-js`.
`watch-test` | `grunt watch:test` |          | Watches test `.js` file(s) and runs `test`.

### Other Build/Automation Tools

If you prefer Gulp or Broccoli or the other build tool of the week, you should feel free to use it, but remember to map the standard npm scripts to your build tool of choice!

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
