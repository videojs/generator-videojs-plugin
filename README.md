# generator-videojs-plugin

This is an opinionated [Yeoman][yo] generator for [video.js][vjs] plugins. It is based on the recommendations of the video.js core team as well as tools and conventions for developing plugins at [Brightcove][bcov].

Lead Maintainer: Pat O'Neill [@misteroneill](https://github.com/misteroneill)

Maintenance Status: Stable


To learn more about video.js plugins and this generator's standards and opinions, check out:

- [video.js Plugins Guide][plugins-guide].
- [video.js Plugin Standards][standards].

### Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Getting Started](#getting-started)
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

If you don't know what Yeoman is or what generators are, check out the Yeoman [Getting Started][getting-started] document. Long story short, make sure you have Yeoman and this generator installed globally:

```sh
$ npm install -g yo generator-videojs-plugin
```

Then, creating the foundation for your video.js plugin is as simple as:

```sh
$ yo videojs-plugin
```

You will be walked through several options and finish with a working, buildable, testable video.js plugin. Of course, this plugin won't do anything out of the box - that part is left to your creativity!

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
- `scripts`: Updates _only_ the `scripts/` directory.

These keys can be combined to create larger sets of files. For example, `--limit-to=dotfiles,pkg` will update the files matched by `dotfiles` and `pkg`.

Finally, the `--limit-to-meta` option is available as a shortcut for using `--limit-to` with _all the available keys._

Update a subset of files with: `yo videojs-plugin --limit-to=pkg,scripts`
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

However, files that are _not_ commonly edited by plugin authors may deserve a diff check (`d`) if you've made changes to these sorts of files. For example, anything in `scripts/`.

## Extra Tools

This generator provides some simple CLI programs that go beyond the basic generator behavior.

These programs can be used on any plugin project - not just those using the generator! They do not provide prompts or accept arguments or options; they do one thing only. The only expectation is that they are run in the project root of a video.js plugin (`process.cwd()`).

### Cleanup with `vjsgenclean`

The generator is non-destructive: it will only add to or update your project. This script will _remove_ files and `package.json` fields that were removed since the previous major version of the generator.

For example, if `1.x` produced the file `foo/bar.js`, but `2.x` does not, this script will delete it.

```sh
$ vjsgenclean
```

### Validation with `vjsplugincheck`

This script supports validating a directory as following current [video.js Plugin Standards][standards]. Using it is very simple; run the following command:

```sh
$ vjsplugincheck
```

## License

[Apache 2.0][license]

[bcov]: https://www.brightcove.com/
[getting-started]: http://yeoman.io/learning/index.html
[license]: LICENSE
[plugins-guide]: https://github.com/videojs/video.js/blob/master/docs/guides/plugins.md
[standards]: docs/standards.md
[tape]: https://www.npmjs.com/package/tape
[vjs]: http://videojs.com/
[yo]: http://yeoman.io/
