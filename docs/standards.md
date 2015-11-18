# Brightcove video.js Plugin Standards

This document contains the standard rules of structure, tooling, and workflow used at [Brightcove](https://www.brightcove.com) in developing both open-source and proprietary plugins for [video.js](http://videojs.com).

These rules are by no means required for community plugins. This document and the Yeoman generator it is part of are provided as open source for the good of the community. If you don't agree with these standards, by all means stick to your own preferences in your own plugin projects!

## Use the Generator!

There is a Yeoman generator available for kicking off standard video.js plugin projects. It is [open source](https://github.com/videojs/generator-videojs-plugin) and [available on npm](https://www.npmjs.com/package/generator-videojs-plugin).

## Packaging and Dependencies

__All standard video.js plugins must be npm packages.__

Plugins _should_ be as self-contained as possible, so there are no direct dependencies (`"dependencies"` in `package.json`) by default. It is assumed that anything included as a direct dependency will be bundled into the final plugin asset(s) or otherwise shimmed into the project (e.g. via `browserify-shim`).

Development dependencies (`"devDependencies"` in `package.json`) will include a number of defaults related to developing, building, and testing a standard video.js plugin. These vary based on options used to generate your plugin.

### Entry Points

The entry point for the package (`"main"` in `package.json`) and the plugin's Browserify bundle _should_ be `src/plugin.js`.

If Sass is enabled, `src/plugin.scss` _should_ be the entry point for plugin styles.

The entry point for the test Browserify bundle _should_ be `test/plugin.test.js`.

### Structure

Folder/Filename            | Optional | Description
-------------------------- | -------- | -----------
`dist/`                    |          | Created during builds and ignored by Git.
`docs/`                    | ✓        | Any documentation beyond `README.md`.
`lang/`                    | ✓        | Any JSON language files for the plugin.
`scripts/`                 | ✓        | Scripts used by npm, Grunt, or other tools; _not part of the source code!_
`src/`                     |          | All source code.
`src/scss/`                | ✓        | Sass source code/partials.
`src/js/`                  | ✓        | JavaScript source code.
`src/plugin.scss`          | ✓        | Sass entry point.
`src/plugin.js`            |          | Browserify entry point.
`test/`                    |          | Unit tests.
`test/karma/`              |          | Karma configuration files.
`test/bundle.js`           |          | Built Browserify test bundle (ignored by Git).
`test/plugin.test.js`      |          | Browserify entry point.
`.editorconfig`            |          |
`.gitignore`               |          |
`.npmignore`               |          |
`bower.json`               |          |
`CHANGELOG.md`             | ✓        | May be removed if not desired.
`CONTRIBUTING.md`          | ✓        | Not present in closed-source plugins.
`index.html`               |          | An example of usage of the plugin. This can be used with GitHub pages as well.
`Gruntfile.js`             | ✓        |
`LICENSE`                  | ✓        | Defaults to `MIT`.
`package.json`             |          |
`README.md`                |          | Documents which version(s) of video.js the plugin supports. Explains how to build/test.

## Tooling

__All tooling for a standard video.js plugin must be available through npm scripts.__

There are many reasons for this rule:

- Complicated build tools are not necessary for all plugins.
- Where a separate build tool is preferred, npm scripts can easily act as aliases to build tasks (e.g., `"build": "grunt build"`).
- CI servers and other tools can use npm - as they must anyway, in some capacity - without worrying about the underlying tooling.
- Consistent npm script naming means contributors don't have to learn a new build tool or new set of commands when moving between plugin projects, lowering the barrier to contributions.

### Grunt, by Default

By default, a Grunt-based workflow is provided by the generator. Its tasks closely match the npm scripts outlined below. By default, it will run `grunt test`.

### npm Scripts

__The core set of npm scripts must match the table below.__

All names are lower-case and use colons (`:`) as word-separators. Certain `pre*` and `post*` scripts will be created as well, but these are not documented here and are, therefore, subject to change.

npm Script   | Grunt Equiv.       | Optional | Description
------------ | ------------------ | -------- | -----------
`build`      | `grunt build`      |          | Runs all build sub-tasks.
`build:css`  | `grunt build:css`  | ✓        | Builds the Sass entry point.
`build:js`   | `grunt build:js`   |          | Builds the Browserify entry point.
`build:test` | `grunt build:test` |          | Builds the test Browserify entry point.
`clean`      | `grunt clean`      |          | Cleans up build artifacts.
`lint`       | `grunt lint`       |          | Lints all `.js` file(s).
`start`      | `grunt start`      |          | Starts a development server at port `9999` (or closest open port) and runs `watch`.
`test`       | `grunt test`       |          | Runs `lint`, `build`, and tests.
`test:*`     | `grunt test:*`     |          | Browser-specific tests (e.g. `test:firefox`).
`watch`      | `grunt watch`      |          | Watches everything and runs appropriate tasks.
`watch:css`  | `grunt watch:css`  | ✓        | Triggers a build when the Sass entry point changes (without banner comment).
`watch:js`   | `grunt watch:js`   |          | Triggers a build when the Browserify entry point changes (without banner comment or minification).
`watch:test` | `grunt watch:test` |          | Triggers a build when the test entry point changes.
`version`    | n/a                |          | Bumps the package version and creates a distributable, Bower-friendly, tag.

__Note:__ While most of these scripts are run using `npm run *`, `start` and `test` are built-in npm scripts and can be run via `npm start` and `npm test`.

## Testing

__All standard video.js plugins must have tests.__

Testing is a critical element of any software project and it should be done in an environment as similar to "production" as possible. To that end, video.js tests should be run in a browser.

By default, testing is achieved with [QUnit](https://qunitjs.com/) as the testing framework and [Karma](https://karma-runner.github.io/) as the runner.

### Testing with Karma

All the test tooling uses single-run Karma sessions. `npm test` will launch all the matching browsers which Karma supports and run tests in them. `npm run test:*` will test in a given browser (e.g. `chrome` or `firefox`).

### Testing in a Browser

During development, it may be more convenient to run your tests in a persistent, user-controlled browser tab (i.e. not through Karma). This can be achieved easily by running a development server with `npm start` and navigating to [`http://localhost:9999/test/`](http://localhost:9999/test/) (_note:_ port may vary, check console output).

## Release

Open source plugins should be tagged and published to npm as their primary release method.

### Versioning

It is generally considered a best practice to not check build artifacts into source control. However, because Bower only clones repositories and offers no mechanism for scripting, the video.js plugin standard must define a workflow for bumping versions without checking `dist/` into the repository's `master` history!

This assumes use of the `npm version` command:

1. The npm `"preversion"` script will:
  1. Verify that the project is a Git repository and that there are not unstaged/uncommitted changes. Either condition will cause the rest of the workflow to fail.
  1. Run tests to enforce code quality before allowing the version to be bumped.
1. _npm automatically bumps the `package.json` version._
1. The npm `"version"` script will run:
  1. `package.json` is staged, committed, and pushed. The effect of this is that the `package.json` change exists in the history of `master`.
  1. Run `npm run build`, so that the new version number gets picked up in built assets.
  1. The `dist/` directory will be force-staged. Normally, it is ignored, but it needs to exist in the tag for Bower to install things properly.
1. _npm automatically commits and tags._ This commit will contain only the `dist/` dir (the `package.json` bump is the parent commit).
1. The npm `"postversion"` script will run:
  1. `master` is hard-reset to the state of `origin/master`. This avoids `dist/` being added to `master`'s history - tagged commits will be children of commits on `master`.
  1. Tags are pushed to `origin`.

This process results in a `master` history that looks something like this:

```
<...> C --- V --- C --- C <...> C --- C --- V --- C --- C <...>
             \                               \
              T                               T
```

`C`: signifies a conventional commit.
`V`: signifies a version bump commit.
`T`: tagged commit, with `dist/` included.
