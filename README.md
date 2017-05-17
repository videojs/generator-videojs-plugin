# generator-videojs-plugin

This is an opinionated [Yeoman][yo] generator for [Video.js][vjs] plugins. It is based on the recommendations of the Video.js core team as well as tools and conventions for developing plugins at [Brightcove][bcov].

Lead Maintainer: Pat O'Neill [@misteroneill](https://github.com/misteroneill)

Maintenance Status: Stable

To learn more about Video.js plugins and this generator's conventions and opinions, check out:

- [Video.js Plugins Guide][plugins-guide].
- [Video.js Plugin Conventions][conventions].

### Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Getting Started](#getting-started)
  - [Options](#options)
    - [Install](#install)
    - [Prompt](#prompt)
    - [Hurry](#hurry)
    - [Limiting Generated Files](#limiting-generated-files)
- [Updating an Existing Project](#updating-an-existing-project)
  - [Recommendations](#recommendations)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Getting Started

If you don't know what Yeoman is or what generators are, check out the Yeoman [Getting Started][getting-started] document. Long story short, make sure you have Yeoman and this generator installed globally:

```sh
$ npm install -g yo generator-videojs-plugin
```

Then, creating the foundation for your Video.js plugin is as simple as:

```sh
$ yo videojs-plugin
```

You will be walked through several options and finish with a working, buildable, testable Video.js plugin. Of course, this plugin won't do anything out of the box - that part is left to your creativity!

### Options

#### Install

By default, the generator will run `npm install` after it is finished. This can be a slow process and you may not always need it; so, it can be disabled (this option is provided by Yeoman itself, but it's useful and worth documenting here).

```sh
yo videojs-plugin --skip-install
```

#### Prompt

By default, the generator will present the user with a series of prompts to choose various settings. This can be disabled if you've previously selected values and don't want to change them.

```sh
yo videojs-plugin --skip-prompt
```

#### Hurry

If you don't want to change configuration, but just want to update an existing plugin and skip all the other stuff (e.g., prompts, installation), you can use this option to do that. _You may need to run the installation manually if dependencies changed!_

```sh
yo videojs-plugin --hurry
```

#### Limiting Generated Files

In some cases - especially when updating previously generated projects - you may want to only update certain "meta" files without needing to deal with prompts for source files and test files you definitely do not want to overwrite. The `--limit-to` and `--limit-to-meta` option helps with this.

`--limit-to` accepts keys which will limit the generated files to only those specified. The possible keys are:

- `dotfiles`: Updates _only_ those files starting with a `.`.
- `pkg`: Updates _only_ `package.json`.
- `scripts`: Updates _only_ the `scripts/` directory.

These keys can be combined to create larger sets of files. For example, `--limit-to=dotfiles,pkg` will update the files matched by `dotfiles` and `pkg`.

Finally, the `--limit-to-meta` option is available as a shortcut for using `--limit-to` with _all the available keys._

Update a subset of files with: 

```sh
yo videojs-plugin --limit-to=pkg,scripts
```

Update _all_ "meta" files with: 

```sh
yo videojs-plugin --limit-to-meta
```

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

## License

[Apache 2.0][license]

[bcov]: https://www.brightcove.com/
[getting-started]: http://yeoman.io/learning/index.html
[license]: LICENSE
[plugins-guide]: https://github.com/videojs/Video.js/blob/master/docs/guides/plugins.md
[conventions]: docs/conventions.md
[vjs]: http://videojs.com/
[yo]: http://yeoman.io/
