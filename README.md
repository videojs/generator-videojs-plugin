# generator-videojs-plugin
This is an opinionated [Yeoman][yo] generator for [Video.js][vjs] plugins. It is based on the recommendations of the Video.js core team as well as tools and conventions for developing plugins at [Brightcove][bcov].

- Lead Maintainer: **Pat O'Neill [@misteroneill][misteroneill]**
- Maintenance Status: **Stable**

To learn more about Video.js plugins and this generator's conventions and opinions, see:

- [Video.js Plugins Guide][plugins-guide]
- [Video.js Plugin Conventions][conventions]

### Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Getting Started](#getting-started)
  - [Prompts](#prompts)
    - [`Enter a package scope, if any, for npm`](#enter-a-package-scope-if-any-for-npm)
    - [`Enter the name of this plugin`](#enter-the-name-of-this-plugin)
    - [`Enter a description for your plugin`](#enter-a-description-for-your-plugin)
    - [`Enter the author of this plugin`](#enter-the-author-of-this-plugin)
    - [`Choose a license for your project`](#choose-a-license-for-your-project)
    - [`Choose a plugin type`](#choose-a-plugin-type)
    - [`Do you want to include CSS styling, including Sass preprocessing?`](#do-you-want-to-include-css-styling-including-sass-preprocessing)
    - [`Do you want to support Internet Explorer 8?`](#do-you-want-to-support-internet-explorer-8)
    - [`Do you want to include documentation support?`](#do-you-want-to-include-documentation-support)
    - [`Do you need a Video.js language file setup for internationalized strings?`](#do-you-need-a-videojs-language-file-setup-for-internationalized-strings)
    - [`Do you want to support Bower with special versioning handling?`](#do-you-want-to-support-bower-with-special-versioning-handling)
    - [`What should be done before you git push?`](#what-should-be-done-before-you-git-push)
  - [Options](#options)
    - [Install](#install)
    - [Prompt](#prompt)
    - [Hurry](#hurry)
    - [Limiting Generated Files](#limiting-generated-files)
    - [Brightcove Defaults](#brightcove-defaults)
- [Updating an Existing Project](#updating-an-existing-project)
  - [Recommendations](#recommendations)
- [Extra Tools](#extra-tools)
  - [Cleanup with `vjsgenclean`](#cleanup-with-vjsgenclean)
  - [Validation with `vjsplugincheck`](#validation-with-vjsplugincheck)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Getting Started
If you don't know what Yeoman is or what generators are, check out the Yeoman [Getting Started][getting-started] document. In short, Yeoman generators are tools which simplify the setup of a new project by creating folders and files.

> **Note**: The generator assumes you have Git installed!

First, make sure you have Yeoman and this generator installed globally:

```sh
$ npm install -g yo generator-videojs-plugin
```

Then, starting your Video.js plugin project is as simple as:

```sh
$ yo videojs-plugin
```

You will be walked through several prompts and finish with a working, buildable, testable Video.js plugin in the current directory. Of course, this plugin won't do much out of the box - that part is left to your creativity!

### Prompts
#### `Enter a package scope, if any, for npm`
_Optional!_ This is useful for [scoped npm packages][npm-scope]. You don't need to include the `@` or `/` characters - only the actual scope name.

#### `Enter the name of this plugin`
Only lower-case characters, numbers, and hyphens are allowed in plugin names.

By convention, Video.js plugin names are prefixed with `videojs-`. The generator will add this prefix automatically; so, don't include it here. So, providing a plugin name of `world` will produce a plugin named `videojs-world`.

If a scope of `hello` is given above, the plugin name will be prefixed with that as well (and formatted according to npm's conventions), yielding a name of `@hello/videojs-world`. Again, the scope is _optional_.

#### `Enter a description for your plugin`
Populates the [`package.json` description field][npm-desc].

#### `Enter the author of this plugin`
When starting a new project with the generator, it will attempt to retrieve this information from your Git installation.

Follow the string formatting convention outlined [for `package.json` people fields][npm-ppl].

#### `Choose a license for your project`
This provides a couple pre-configured, popular options [for the `package.json` license field][npm-license]. If your preferred license isn't found, simply choose "UNLICENSED" and update it manually.

#### `Choose a plugin type`
This allows you to choose between a basic, function-based plugin or an advanced, class-based plugin (only supported in Video.js 6). This changes the default contents of the `src/js/index.js` file.

#### `Do you want to include CSS styling, including Sass preprocessing?`
Respond "Y" to set up your project with a base `.scss` file.

#### `Do you want to support Internet Explorer 8?`
Respond "Y" to include some Babel presets to polyfill missing ES5 features for IE8. See [videojs-spellbook][spellbook] for more.

#### `Do you want to include documentation support?`
Respond "Y" to include base files for documentation as well as configuration for generating API documentation. This will also include a placeholder in the `README.md` for generating a table of contents.

#### `Do you need a Video.js language file setup for internationalized strings?`
Respond "Y" to include base files for translation and inclusion with your packaged plugin.

#### `Do you want to support Bower with special versioning handling?`
Respond "Y" to set up your project with a `bower.json` file and, more importantly, will adjust the release process to create tags which include your `dist/` directory.

#### `What should be done before you git push?`
This prompt presents several options for automation via [ghooks][ghooks] before pushing to any Git remote.

- `Check code quality`: The default. Code must pass [videojs-standard][standard] before anything can be pushed.
- `Check code quality and run tests`: Code must pass [videojs-standard][standard] _and unit tests must pass_ before anything can be pushed.
- `Nothing`: Does nothing. There are no `pre-push` hooks configured.

### Options

#### Install

By default, the generator will run `npm install` after it is finished. This can be a slow process and you may not always need it; so, it can be disabled (this option is provided by Yeoman itself, but it's useful and worth documenting here).

Turn installation off with: `yo videojs-plugin --skip-install`

#### Prompt

By default, the generator will present the user with a series of prompts to choose various settings. This can be disabled if you've previously selected values and don't want to change them.

Turn prompts off with: `yo videojs-plugin --skip-prompt`

#### Hurry

If you don't want to change configuration, but just want to update an existing plugin and skip all the other stuff (prompts, installation, "yosay"s), you can use this option to do that. _You may need to run the installation manually if dependencies changed!_

Turn prompts off with: `yo videojs-plugin --hurry`

#### Limiting Generated Files

In some cases - especially when updating previously generated projects - you may want to only update certain "meta" files without needing to deal with prompts for source files and test files you definitely do not want to overwrite. The `--limit-to` and `--limit-to-meta` option helps with this.

`--limit-to` accepts keys which will limit the generated files to only those specified. The possible keys are:

- `dotfiles`: Updates _only_ those files starting with a `.` and `bower.json`.
- `pkg`: Updates _only_ `package.json`.

These keys can be combined to create larger sets of files. For example, `--limit-to=dotfiles,pkg` will update the files matched by `dotfiles` and `pkg`.

Finally, the `--limit-to-meta` option is available as a shortcut for using `--limit-to` with _all the available keys._

Update a subset of files with: `yo videojs-plugin --limit-to=pkg,dotfiles`
Update _all_ "meta" files with: `yo videojs-plugin --limit-to-meta`

#### Brightcove Defaults

Set certain values automatically for Brightcove-authored plugins. Has the following effects:

- Sets the author to `"Brightcove, Inc."`
- Limits open-source license options to `Apache-2.0` only.

Turn on these Brightcove defaults with: `yo videojs-plugin --bcov`

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

## Extra Tools

This generator provides some simple CLI programs that go beyond the basic generator behavior.

These programs can be used on any plugin project - not just those using the generator! They do not provide prompts or accept arguments or options; they do one thing only. The only expectation is that they are run in the project root of a Video.js plugin (`process.cwd()`).

### Cleanup with `vjsgenclean`

The generator is non-destructive: it will only add to or update your project. This script will _remove_ files and `package.json` fields that were removed in previous major versions of the generator.

For example, if `1.x` produced the file `foo/bar.js`, but `2.x` does not, this script will delete it.

```sh
$ vjsgenclean
```

> **Note:** This script _should be run **after** applying_ the latest generator version!

### Validation with `vjsplugincheck`

This script supports validating a directory as following current [Video.js Plugin Conventions][conventions]. Using it is simple; run the following command:

```sh
$ vjsplugincheck
```

## License

[Apache 2.0](LICENSE)

[bcov]: https://www.brightcove.com/
[conventions]: docs/conventions.md
[getting-started]: http://yeoman.io/learning/index.html
[ghooks]: https://www.npmjs.com/package/ghooks
[misteroneill]: https://github.com/misteroneill
[npm-desc]: https://docs.npmjs.com/files/package.json#description-1
[npm-license]: https://docs.npmjs.com/files/package.json#license
[npm-ppl]: https://docs.npmjs.com/files/package.json#people-fields-author-contributors
[npm-scope]: https://docs.npmjs.com/misc/scope
[plugins-guide]: https://github.com/videojs/video.js/blob/master/docs/guides/plugins.md
[spellbook]: https://github.com/videojs/spellbook
[standard]: https://github.com/videojs/standard
[tape]: https://www.npmjs.com/package/tape
[vjs]: http://videojs.com/
[yo]: http://yeoman.io/
