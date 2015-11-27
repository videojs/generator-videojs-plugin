# Brightcove video.js Plugin Standards

This document contains the standard rules of structure, automation, and workflow used at [Brightcove](https://www.brightcove.com) in developing both open-source and proprietary plugins for [video.js](http://videojs.com).

These rules are by no means required for community plugins. This document and the Yeoman generator it is part of are provided as open source for the good of the community. If you don't agree with these standards, by all means stick to your own preferences in your own plugin projects!

### Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Use the Generator!](#use-the-generator)
- [Rules Summary](#rules-summary)
- [Packaging and Dependencies](#packaging-and-dependencies)
  - [Structure](#structure)
- [Automation](#automation)
  - [npm Core Scripts](#npm-core-scripts)
- [Coding Style](#coding-style)
- [Testing](#testing)
  - [Writing Tests](#writing-tests)
  - [Testing with Karma](#testing-with-karma)
  - [Testing in a Browser](#testing-in-a-browser)
- [Release](#release)
  - [Versioning](#versioning)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Use the Generator!

There is a Yeoman generator available for kicking off standard video.js plugin projects. It is [open source](https://github.com/videojs/generator-videojs-plugin) and [available on npm](https://www.npmjs.com/package/generator-videojs-plugin).

## Rules Summary

All standard video.js plugins _must_:

- ...be npm packages.
- ...have automation available through npm scripts.
- ...implement the core set of npm scripts.
- ...be written in ES6 and pass `videojs-standard` linting.
- ...have tests.

## Packaging and Dependencies

__All standard video.js plugins must be npm packages.__

Plugins _should_ be as self-contained as possible, so there are no direct dependencies (`"dependencies"` in `package.json`) by default outside of video.js itself. It is assumed that anything included as a direct dependency will be bundled into the final plugin asset(s) or otherwise shimmed into the project (e.g. via `browserify-shim` as is the case with video.js).

Development dependencies (`"devDependencies"` in `package.json`) will include a number of defaults related to developing, building, and testing a standard video.js plugin.

### Structure

Folder/Filename            | Optional | Description
-------------------------- | -------- | -----------
`dist/`                    |          | Created during builds, ignored by Git.
`dist-test/`               |          | Created during test builds, ignored by Git.
`docs/`                    | ✓        | Any documentation beyond `README.md`.
`es5/`                     |          | Babel-compiled `src/` scripts.
`lang/`                    | ✓        | Any JSON language files for the plugin.
`scripts/`                 | ✓        | Scripts used by npm; _not part of the source code!_
`src/`                     |          | All source code.
`src/scss/`                | ✓        | Sass source code/partials.
`src/js/`                  | ✓        | JavaScript source code.
`src/plugin.scss`          | ✓        | Sass _entry point_.
`src/plugin.js`            |          | Browserify _entry point_.
`test/`                    |          | Unit tests.
`test/karma/`              |          | Karma configuration files.
`test/plugin.test.js`      |          | Browserify _entry point_.
`.editorconfig`            |          |
`.gitignore`               |          |
`.npmignore`               |          |
`bower.json`               |          |
`CHANGELOG.md`             | ✓        | May be removed if not desired.
`CONTRIBUTING.md`          | ✓        | Not present in closed-source plugins.
`index.html`               |          | An example of usage of the plugin. This can be used with GitHub pages as well.
`LICENSE`                  | ✓        | Defaults to `MIT`.
`package.json`             |          |
`README.md`                |          | Documents which version(s) of video.js the plugin supports. Explains how to build/test.

## Automation

__All automation for a standard video.js plugin must be available through npm scripts.__

While the generator, by default, provides a full suite of tools for building and publishing plugins, some developers may prefer to implement their build process with a tool like Gulp or Grunt. That's fine!

The only requirement is that you make the commands for your build tool of choice available via npm scripts. For example, if your build is kicked off with `grunt`, you should have the following in your `package.json`:

```json
"scripts": {
  // ...
  "build": "grunt",
  // ...
}
```

There are many reasons for standardizing on npm scripts:

- It provides a unified interface while keeping implementation choice up to the individual developer or team.
- Where a separate build tool is preferred, npm scripts can easily act as aliases to build tasks (e.g., `"start": "gulp start-server"`).
- CI servers and other tools can use npm (as they must anyway, in some capacity) without worrying about the underlying tooling.
- Consistent npm script naming means contributors don't have to learn a new build tool or new set of commands when moving between plugin projects, lowering the barrier to contributions.

### npm Core Scripts

__To be considered standard, a plugin must implement the core set of npm scripts.__

All names are lower-case and use colons (`:`) as sub-task separators (multiple colons separate multiple levels of sub-tasks). Certain `pre*` and `post*` scripts will be created as well, but these are not documented here and are, therefore, subject to change.

npm Script   | Optional | Description
------------ | -------- | -----------
`build`      |          | Runs all build sub-tasks.
`build:css`  | ✓        | Builds the Sass entry point.
`build:js`   |          | Builds the Browserify entry point.
`build:test` |          | Builds the test Browserify entry point.
`clean`      |          | Cleans up _all_ build artifacts.
`doc`        | ✓        | Performs documentation builds.
`lint`       |          | Lints all `.js` ES6 source file(s).
`start`      |          | Starts a development server at port `9999` (or closest open port) and runs `watch`.
`test`       |          | Runs `lint`, builds tests, and runs tests in available browsers.
`test:*`     | ✓        | Browser-specific tests (e.g. `test:firefox`).
`watch`      |          | Watches everything and runs appropriate tasks.
`watch:css`  | ✓        | Triggers a build when the Sass entry point changes (without banner comment).
`watch:js`   |          | Triggers a build when the Browserify entry point changes (without banner comment or minification).
`watch:test` |          | Triggers a build when the test entry point changes.
`version`    |          | Includes `preversion` and `postversion` scripts. Bumps the package version and creates a distributable, Bower-friendly, tag.

__Note:__ While most of these scripts are run using `npm run *`, `start` and `test` are built-in npm scripts and can be run via `npm start` and `npm test`.

## Coding Style

__All standard video.js plugins must pass videojs-standard linting.__

In an effort to reduce guess work, avoid bikeshedding on style, and simplify the code review process, we have a fork of the popular [standard](https://www.npmjs.com/package/standard) library, named [videojs-standard](https://www.npmjs.com/package/videojs-standard).

Its coding conventions are enforced in standard video.js plugins via the `npm run lint` command, which gets auto-run anytime tests are run and before bumping a version with `npm version`.

_`videojs-standard` assumes all code it evaluates is written in ES6. Therefore, it ignores built scripts and script(s) which must be written in ES5._

## Testing

__All standard video.js plugins must have tests.__

Testing is a critical element of any software project and it should be done in an environment as similar to "production" as possible. To that end, video.js tests should be run in a browser.

By default, testing is achieved with [QUnit](https://qunitjs.com/) as the testing framework and [Karma](https://karma-runner.github.io/) as the runner.

### Writing Tests

The test entry point is `test/plugin.test.js`.

For simple tests (and in the default generator output), this is sufficient and can hold all QUnit modules and tests.

For complex plugins with multiple components, it might make sense to break up tests into multiple modules. The best way to achieve this without deviating too far from the generator setup is to use the entry point for broad environmental or plugin-level tests and create new modules which export function(s) for executing test modules. For example, a file `test/foo.test.js` might look like:

```js
import QUnit from 'qunit';

const testFoo = function() {
  QUnit.module('videojs-my-plugin/foo');

  QUnit.test('test something', function(assert) {
    // ...
  });
};

export default foo;
```

Then in `test/plugin.test.js`:

```js
import QUnit from 'qunit';
import testFoo from './foo.test';

QUnit.module('videojs-my-plugin');

// Plugin-level/environment tests go here...

testFoo(); // Kick off "foo" tests
```

This pattern can be used to provide greater modularity in your test setup.

### Testing with Karma

All the test automation uses single-run Karma sessions. `npm test` will launch all the matching browsers which Karma supports and run tests in them. `npm run test:*` will test in a given browser (e.g. `chrome` or `firefox`).

### Testing in a Browser

During development, it may be more convenient to run your tests in a persistent, user-controlled browser tab (i.e. not through Karma). This can be achieved easily by running a development server with `npm start` and navigating to [`http://localhost:9999/test/`](http://localhost:9999/test/) (_note:_ port may vary, check console output).

## Release

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

### Publishing

Open source plugins should use the most basic publishing process available - `npm publish` - which should be run after versioning.
