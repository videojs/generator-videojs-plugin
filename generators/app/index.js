'use strict';

const _ = require('lodash');
const chalk = require('chalk');
const path = require('path');
const tsmlj = require('tsmlj');
const yeoman = require('yeoman-generator');
const yosay = require('yosay');
const shelljs = require('shelljs');

const PREFIX = require('./constants').PREFIX;
const packageJSON = require('./package-json');
const validators = require('./validators');

/**
 * Convert an object into "choices" for a prompt. The object keys are the
 * values reported by the prompt and the object values are the texts displayed
 * to the user.
 *
 * @param  {Object} o
 * @return {Array}
 */
const objectToChoices = (o) => _.map(o, (v, k) => ({name: v, value: k}));

module.exports = yeoman.generators.Base.extend({

  /**
   * Whether or not this plugin is privately licensed.
   *
   * @return {Boolean}
   */
  _isPrivate() {
    return this.config.get('license') === 'private';
  },

  /**
   * Removes the leading underscore from a template file name and
   * generates the full destination path for it.
   *
   * @method _dest
   * @private
   * @example
   *         this._dest('some-dir/__foo') // "/path/to/some-dir/_foo"
   *         this._dest('_some-file.js')  // "/path/to/some-file.js"
   *         this._dest('some-file.js')   // "/path/to/some-file.js"
   *
   * @param  {String} src
   * @return {String}
   */
  _dest(src) {
    const basename = path.basename(src);
    let destname = src;

    if (_.startsWith(basename, '_')) {
      destname = src.replace(basename, basename.substr(1));
    }

    return this.destinationPath(destname);
  },

  /**
   * Gets the name of the scope including the "@" symbol. Will not prepend
   * the "@" if it is already included.
   *
   * @param  {String} scope
   * @return {String}
   */
  _getScope(scope) {
    if (!scope || typeof scope !== 'string') {
      return '';
    }
    return scope.charAt(0) === '@' ? scope : `@${scope}`;
  },

  /**
   * Gets the name of the plugin (without scope) including the "videojs-"
   * prefix.
   *
   * @param  {String} name
   * @return {String}
   */
  _getPluginName(name) {
    return name && typeof name === 'string' ? PREFIX + name : '';
  },

  /**
   * Gets the full package name, taking scope into account.
   *
   * @param  {String} name
   * @param  {String} [scope]
   * @return {String}
   */
  _getPackageName(name, scope) {
    scope = this._getScope(scope);
    name = this._getPluginName(name);
    return scope ? `${scope}/${name}` : name;
  },

  /**
   * Gets the scope of the plugin (without scope or "videojs-" prefix).
   *
   * @param  {String} name
   * @return {String}
   */
  _getScopeFromPackageName(name) {
    if (!name) {
      return '';
    }

    const match = name.match(/^@([^/]+)\//);

    return match ? match[1] : '';
  },

  /**
   * Gets the core/default - that is, without scope or "videojs-"
   * prefix - name of the plugin.
   *
   * @param  {String} name
   * @return {String}
   */
  _getDefaultNameFromPackageName(name) {
    if (!name) {
      return '';
    }
    return name.split('/').reverse()[0].replace(PREFIX, '');
  },

  /**
   * Attempts to get default values for prompts. Async because it may call
   * out to external processes (e.g. Git) to attempt to gather this info.
   *
   * @method _getPromptDefaults
   * @private
   * @return {Object}
   */
  _getPromptDefaults() {
    const configs = this.config.getAll();
    const pkg = this._currentPkgJSON || {};
    const licenseNames = this._licenseNames;

    const defaults = {
      bower: configs.hasOwnProperty('bower') ? !!configs.bower : true,
      ghooks: configs.hasOwnProperty('ghooks') ? !!configs.ghooks : 'lint',
      license: this._licenseDefault,
      type: configs.type || this._typeDefault,
      docs: configs.hasOwnProperty('docs') ? !!configs.docs : false,
      lang: configs.hasOwnProperty('lang') ? !!configs.lang : false,
      css: configs.hasOwnProperty('sass') ? !!configs.sass : false,
      ie8: configs.hasOwnProperty('ie8') ? !!configs.ie8 : false
    };

    // support new property name old name was sass
    if (configs.hasOwnProperty('css')) {
      defaults.css = !!configs.css;
    }

    ['author', 'license', 'name', 'description'].forEach(key => {
      if (pkg.hasOwnProperty(key)) {
        defaults[key] = pkg[key];
      } else if (configs.hasOwnProperty(key)) {
        defaults[key] = configs[key];
      }
    });

    // At this point, the `defaults.name` may still have the full scope and
    // prefix included; so, we get the scope now.
    defaults.scope = this._getScopeFromPackageName(defaults.name);

    // Strip out the "videojs-" prefix from the name for the purposes of
    // the prompt (otherwise it will be rejected by validation).
    defaults.name = this._getDefaultNameFromPackageName(defaults.name);

    // The package.json stores a value from `_licenseNames`, so in that
    // case, we need to find the key instead of the value.
    if (pkg && pkg.license && pkg.license === defaults.license) {
      defaults.license = _.find(Object.keys(licenseNames), k => {
        return licenseNames[k] === pkg.license;
      });
    }

    const name = this.user.git.name();

    // Build up an author string from git if possible as a last-ditch effort.
    if (!defaults.author && name) {
      const email = this.user.git.email();

      defaults.author = name;

      if (email) {
        defaults.author += ` <${email}>`;
      }
    }

    return defaults;
  },

  /**
   * Gets prompts for the user.
   *
   * @method _createPrompts
   * @private
   * @return {Array}
   */
  _getPrompts() {
    const defaults = this._getPromptDefaults();
    const prompts = [{
      name: 'scope',
      message: 'Enter a package scope, if any, for npm (optional):',
      default: defaults.scope,
      validate: validators.scope
    }, {
      name: 'name',
      message: tsmlj`
        Enter the name of this plugin (a-z/0-9/- only; will be
        prefixed with "${PREFIX}"):
      `,
      default: defaults.name,
      validate: validators.name
    }, {
      name: 'description',
      message: 'Enter a description for your plugin:',
      default: defaults.description
    }, {
      name: 'author',
      message: 'Enter the author of this plugin:',
      default: defaults.author
    }, {
      type: 'list',
      name: 'license',
      message: 'Choose a license for your project',
      default: defaults.license,
      choices: objectToChoices(this._licenseNames)
    }, {
      type: 'list',
      name: 'type',
      message: 'Choose a plugin type',
      default: defaults.type,
      choices: objectToChoices(this._types)
    }, {
      type: 'confirm',
      name: 'css',
      message: 'Do you want to include CSS styling, including Sass preprocessing?',
      default: defaults.css
    }, {
      type: 'confirm',
      name: 'ie8',
      message: 'Do you want to support Internet Explorer 8?',
      default: defaults.ie8
    }, {
      type: 'confirm',
      name: 'docs',
      message: 'Do you want to include documentation support?',
      default: defaults.docs
    }, {
      type: 'confirm',
      name: 'lang',
      message: tsmlj`
        Do you need a Video.js language file setup for
        internationalized strings?
      `,
      default: defaults.lang
    }, {
      type: 'confirm',
      name: 'bower',
      message: 'Do you want to support Bower with special versioning handling?',
      default: defaults.bower
    }, {
      type: 'list',
      name: 'ghooks',
      message: 'What should be done before you git push?',
      default: defaults.ghooks,
      choices: objectToChoices(this._ghooksOptions)
    }];

    return prompts.filter(p => !_.includes(this._promptsToFilter, p.name));
  },

  /**
   * Sets up the generator.
   *
   * @method constructor
   */
  // NOTE: because this method is named `constructor`, but is not a true
  // constructor, it cannot use the object method shorthand in Node 4. An
  // error will be thrown by Node.
  constructor: function() { // eslint-disable-line
    yeoman.generators.Base.apply(this, arguments);

    this.option('bcov', {
      type: 'boolean',
      defaults: false
    });

    this.option('skip-prompt', {
      type: 'boolean',
      defaults: false
    });

    this.option('hurry', {
      type: 'boolean',
      defaults: false
    });

    this.option('limit-to', {
      desc: tsmlj`
        Limit files to be updated by passing any comma-separated combination
        of: dotfiles and or pkg
      `,
      type: 'string',
      defaults: ''
    });

    this.option('limit-to-meta', {
      desc: 'Only update "meta files" - dotfiles, bower.json, and package.json',
      type: 'boolean',
      defaults: false
    });

    this._currentPkgJSON = this.fs.readJSON(this.destinationPath('package.json'), null);

    this._ghooksOptions = {
      lint: 'Check code quality',
      test: 'Check code quality and run tests',
      none: 'Nothing'
    };

    this._licenseNames = {
      apache2: 'Apache-2.0',
      mit: 'MIT',
      private: 'UNLICENSED'
    };

    this._licenseFiles = {
      apache2: 'licenses/_apache2',
      mit: 'licenses/_mit'
    };

    this._licenseDefault = 'mit';

    this._types = {
      basic: 'Basic (function-based)',
      advanced: 'Advanced (class-based, Video.js 6 only)'
    };

    this._typeDefault = 'basic';

    this._filesToCopy = [
      '_.editorconfig',
      '_.gitignore',
      '_.npmignore',
      '_CHANGELOG.md'
    ];

    this._templatesToCopy = [
      'test/_index.test.js',
      '_index.html',
      '_CONTRIBUTING.md',
      '_README.md'
    ];

    this._promptsToFilter = [];

    // The "hurry" option skips both prompts and installation.
    if (this.options.hurry) {
      this.options.skipPrompt = this.options.skipInstall = true;
    }

    this._configsTemp = {
      bcov: this.options.bcov || !!this.config.get('bcov')
    };

    // Defines the files that are allowed for various `--limit-to` options.
    this._limits = {
      dotfiles: {
        files: [
          '_.editorconfig',
          '_.gitignore',
          '_.npmignore',
          '_.travis.yml',
          '.github/_ISSUE_TEMPLATE.md',
          '.github/_PULL_REQUEST_TEMPLATE.md'
        ],
        templates: [
          '_bower.json'
        ]
      },

      // These are empty because package.json has special handling.
      pkg: {
        files: [],
        templates: []
      }
    };

    // this._limitTo will always be an array of the requested keys that are
    // valid (i.e. found in the this._limits object).
    if (this.options.limitToMeta) {
      this._limitTo = Object.keys(this._limits);
    } else if (this.options.limitTo) {
      this._limitTo = _.intersection(
        this.options.limitTo.split(',').map(s => s.trim()).filter(_.identity),
        Object.keys(this._limits)
      );
    } else {
      this._limitTo = [];
    }

    // Handle the Brightcove option/config.
    if (this._configsTemp.bcov) {

      // All Brightcove plugins use the same author string.
      this._promptsToFilter.push('author');
      this._configsTemp.author = 'Brightcove, Inc.';

      // Brightcove plugins are either Apache-2.0 or private/closed-source.
      this._licenseNames = _.pick(this._licenseNames, 'apache2', 'private');
      this._licenseDefault = 'apache2';

    // Make sure we filter out the author prompt if there is a current
    // package.json file with an object for the author field.
    } else if (this._currentPkgJSON && _.isPlainObject(this._currentPkgJSON.author)) {
      this._promptsToFilter.push('author');
      this._configsTemp.author = this._currentPkgJSON.author;
    }
  },

  /**
   * Display prompts to the user.
   *
   * @method prompting
   */
  prompting() {
    if (this.options.skipPrompt) {
      return;
    }

    this.log(yosay(`Welcome to the ${chalk.green(`${PREFIX}plugin`)} generator!`));

    const done = this.async();

    this.prompt(this._getPrompts(), responses => {
      _.assign(this._configsTemp, responses);
      done();
    });
  },

  /**
   * Generates a context object used for providing data to EJS file templates.
   *
   * @param {Object} [configs]
   *        Optionally provide custom configs.
   *
   * @return {Object}
   */
  _getContext(configs) {
    configs = configs || this.config.getAll();

    const camelName = _.camelCase(configs.name);

    return _.assign(configs, {
      className: `vjs-${configs.name}`,
      functionName: camelName,
      constructorName: camelName.charAt(0).toUpperCase() + camelName.substr(1),
      isPrivate: this._isPrivate(),
      licenseName: this._licenseNames[configs.license],
      packageName: this._getPackageName(configs.name, configs.scope),
      pluginName: this._getPackageName(configs.name),
      version: this._currentPkgJSON && this._currentPkgJSON.version || '0.0.0'
    });
  },

  /**
   * Store configs, generate template rendering context, alter the setup for
   * file structure.
   *
   * @method configuring
   */
  configuring() {
    this.config.set(this._configsTemp);
    delete this._configsTemp;

    this.context = this._getContext();

    if (!this._isPrivate()) {
      this._filesToCopy.push('_.travis.yml');
      this._filesToCopy.push('.github/_ISSUE_TEMPLATE.md');
      this._filesToCopy.push('.github/_PULL_REQUEST_TEMPLATE.md');
    }

    if (this.context.lang) {
      this._filesToCopy.push('lang/_en.json');
    }

    if (this.context.docs) {
      this._templatesToCopy.push('docs/_index.md');
    }

    if (this.context.css) {
      this._templatesToCopy.push('src/css/_index.scss');
    }

    if (this.context.bower) {
      this._templatesToCopy.push('_bower.json');
    }

    if (this._limitTo && this._limitTo.length) {
      const files = _.union.apply(_, this._limitTo.map(k => this._limits[k].files));
      const templates = _.union.apply(_, this._limitTo.map(k => this._limits[k].templates));

      this._filesToCopy = _.intersection(this._filesToCopy, files);
      this._templatesToCopy = _.intersection(this._templatesToCopy, templates);
    }
  },

  /**
   * Perform various writing tasks.
   *
   * @property {Object} writing
   */
  writing: {

    /**
     * intialize git if there is no _.git directory
     *
     * @function gitInit
     */
    gitInit() {
      const git = this._dest('_.git');

      try {
        this.fs.statSync(git);
      } catch (e) {
        shelljs.exec('git init', {silent: true});
      }
    },
    /**
     * Writes common files.
     *
     * @function common
     */
    common() {
      this._templatesToCopy.forEach(src => {
        this.fs.copyTpl(this.templatePath(src), this._dest(src), this.context);
      });

      this._filesToCopy.forEach(src => {
        this.fs.copy(this.templatePath(src), this._dest(src));
      });
    },

    /**
     * Writes the LICENSE file based on the chosen license.
     *
     * @function license
     */
    license() {
      const file = this._licenseFiles[this.config.get('license')];

      // There is no _limitTo setting that includes LICENSE, so we only
      // need to check for it existing to know to skip this.
      if (!file || this._limitTo.length) {
        return;
      }

      this.fs.copyTpl(
        this.templatePath(file),
        this.destinationPath('LICENSE'),
        this.context
      );
    },

    /**
     * Writes the plugin's index.js file based on the chosen plugin type.
     */
    plugin() {
      if (this._limitTo.length) {
        return;
      }

      this.fs.copyTpl(
        this.templatePath(`src/js/_index-${this.context.type}.js`),
        this._dest('src/js/index.js'),
        this.context
      );
    },

    /**
     * Writes/updates the package.json file.
     *
     * @function package
     */
    packageJSON() {

      // The only time we don't want to write package.json is when there are
      // any _limitTo values and "pkg" is not one of them.
      if (this._limitTo.length && !_.includes(this._limitTo, 'pkg')) {
        return;
      }

      const json = packageJSON(this._currentPkgJSON, this.context);

      // We want to use normal JSON.stringify here because we want to
      // preserve whatever ordering existed in the _currentPkgJSON object.
      const contents = JSON.stringify(json, null, 2);

      this.fs.write(this.destinationPath('package.json'), contents);
    }
  },

  /**
   * Install npm dependencies; we don't have any Bower dependencies; so,
   * we don't want to run that (or depend on it in any way).
   *
   * @method install
   */
  install() {
    this.npmInstall();
  },

  /**
   * Display a final message to the user.
   *
   * @method end
   */
  end() {
    if (this.options.hurry) {
      return;
    }
    this.log(yosay(tsmlj`
      All done; ${chalk.green(this.context.pluginName)} is ready to go!
    `));
  }
});
