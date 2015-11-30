# Brightcove video.js Plugin Standards

When we refer to "standard video.js plugins" we are not referring to any official, codified standard (e.g. ECMAScript or HTML5). Rather, we are referring to the rules used internally at [Brightcove](https://www.brightcove.com) in developing both open-source and proprietary plugins for [video.js](http://videojs.com).

_These rules are by no means required for community plugins._ You can write plugins in whichever way you choose. However, these rules _are recommended_, as we want to foster consistency within the video.js ecosystem.

This document and [the Yeoman generator](https://github.com/videojs/generator-videojs-plugin) it is part of are provided as open-source for the good of the community. If you don't agree with these standards, by all means follow your preferences in your plugin projects!

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

## Rules Summary

All standard video.js plugins _must_:

- ...be npm packages.
- ...have automation available through npm scripts.
- ...implement the core set of npm scripts.
- ...be written in ES6 and pass `videojs-standard` linting.
- ...have tests.

## Packaging and Dependencies

__All standard video.js plugins must be npm packages.__

Plugins should be as self-contained as possible, so the only dependency (`"dependencies"` in `package.json`) by default is video.js, which is shimmed using `browserify-shim`.

Development dependencies (`"devDependencies"` in `package.json`) will include many packages related to developing, building, and testing a standard video.js plugin.

### Structure

Folder/Filename            | Optional | Description
-------------------------- | -------- | -----------
`dist/`                    |          | Created during builds, ignored by Git.
`dist-test/`               |          | Created during test builds, ignored by Git.
`docs/`                    | ✓        | Any documentation beyond `README.md`.
`es5/`                     |          | Babel-compiled `src/` scripts.
`lang/`                    | ✓        | Any JSON language files for the plugin.
`scripts/`                 |          | Scripts used by npm; _not part of the source code!_
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

The generator provides npm script automation for all aspects of plugin development. There is no need for a third-party build tool.

However, some developers may prefer to implement their build process with a tool like Gulp or Grunt and this is an accepted practice provided [the core set of npm scripts](#npm-core-scripts) are aliased to the appropriate command for your build tool. For example, if you're using `grunt`, your `package.json` might have:

```json
"scripts": {
  // ...
  "build": "grunt",
  "build:js": "grunt js"
  // ...
}
```

There are many good reasons to standardize on npm scripts:

- npm provides a unified interface while keeping implementation choices up to the individual developer or team.
- Where a separate build tool is preferred, npm scripts can easily act as aliases to build tasks (e.g., `"start": "gulp start-server"`).
- npm is a common denominator (far more than build tools); so, CI servers, contributors, and other tools can use npm without worrying about the underlying tool.
- Consistent npm script naming means contributors don't have to learn a new build tool or new set of commands when moving between plugin projects, lowering the barrier to contributions.

### npm Core Scripts

__All standard video.js plugins must implement the core set of npm scripts.__

All names are lower-case and use colons (`:`) as sub-task separators (multiple colons separate multiple levels of sub-tasks). Other scripts (e.g., sub-sub-tasks and `pre*`/`post*` scripts) will be created as well, but these are not documented here as they are not considered core scripts and are subject to change.

npm Script   | Optional | Description
------------ | -------- | -----------
`build`      |          | Runs all build sub-tasks.
`build:css`  | ✓        | Builds the Sass entry point.
`build:js`   |          | Builds the Browserify entry point.
`build:lang` | ✓        | Builds language files.
`build:test` |          | Builds the test Browserify entry point.
`clean`      |          | Cleans up _all_ build artifacts.
`doc`        | ✓        | Performs documentation tasks.
`lint`       |          | Lints all `.js` ES6 source file(s) using `videojs-standard`.
`start`      |          | Starts a development server at port `9999` (or closest open port) and runs `watch`.
`test`       |          | Runs `lint`, builds tests, and runs tests in available browsers.
`test:*`     | ✓        | Browser-specific tests (e.g. `test:firefox`).
`watch`      |          | Watches everything and runs appropriate tasks.
`watch:css`  | ✓        | Triggers a build when the Sass entry point changes (without banner comment).
`watch:js`   |          | Triggers a build when the Browserify entry point changes (without banner comment or minification).
`watch:test` |          | Triggers a build when the test entry point changes.
`version`    |          | Includes `preversion` and `postversion` scripts. Bumps the package version and creates a distributable, Bower-friendly, tag.

## Coding Style

__All standard video.js plugins must pass `videojs-standard` linting.__

In an effort to reduce guess work, improve maintainability, avoid stylistic bikeshedding, and simplify the code review process, we have a linter based on the popular [standard](https://www.npmjs.com/package/standard) project, named [videojs-standard](https://www.npmjs.com/package/videojs-standard).

Its coding conventions are enforced in standard video.js plugins via the `npm run lint` command.

_`videojs-standard` assumes all code it evaluates is written in ES6. Therefore, it ignores built scripts and any script(s) which must be written in ES5._

## Testing

__All standard video.js plugins must have tests.__

Testing is a critical element of any software project and it should be done in an environment as similar to production as possible. To that end, video.js tests should be run in a browser.

Testing is performed with [QUnit](https://qunitjs.com/) as the testing framework and [Karma](https://karma-runner.github.io/) as the runner.

### Writing Tests

__All scripts containing tests must be named in the format `*.test.js`__

The generator-provided test entry point is `test/plugin.test.js` (matching `src/plugin.js`). For simple plugins, this is typically sufficient.

For complex plugins with multiple modules/components, it might make sense to break up tests into multiple modules, too. How test modules are split up is really up to the developer, but the recommended practice is to have a test module for each source module. For example:

```
src/plugin.js :: test/plugin.test.js
src/foo.js :: test/foo.test.js
src/bar.js :: test/bar.test.js
```

When the `build:test` script is executed, all `*.test.js` files within `test` and sub-directories will be built into the output script (`dist-test/${pluginName}.js`).

### Testing with Karma

All the test automation uses single-run Karma sessions. `npm test` will launch all the matching browsers which Karma supports and run tests in them. `npm run test:*` will test in a given browser (e.g. `chrome` or `firefox`).

### Testing in a Browser

During development, it may be more convenient to run your tests manually in a browser tab (i.e. not through Karma). This can be achieved easily by running a development server with `npm start` and navigating to [`http://localhost:9999/test/`](http://localhost:9999/test/) (_note:_ the port may vary, check console output).

## Release

### Versioning

__All standard video.js plugins must support Bower, but never check in build artifacts to source control.__

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

Open-source plugins should use the most basic publishing process available - `npm publish` - which should be run after versioning. Closed-source plugins are left to their respective author(s) or organization.
