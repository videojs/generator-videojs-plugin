'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const Generator = require('yeoman-generator');
const constants = require('./constants');
const naming = require('./naming');
const packageJSON = require('./package-json');
const validators = require('./validators');
const spawnSync = require('child_process').spawnSync;

module.exports = class extends Generator {

  /**
   * Whether or not this plugin is privately licensed.
   *
   * @return {boolean}
   *         True if the plugin is privately licensed.
   */
  _isPrivate() {
    return this.config.get('license') === 'private';
  }

  /**
   * Removes the leading underscore from a template file name and
   * generates the full destination path for it.
   *
   * @private
   * @example
   *         this._dest('some-dir/__foo') // "/path/to/some-dir/_foo"
   *         this._dest('_some-file.js')  // "/path/to/some-file.js"
   *         this._dest('some-file.js')   // "/path/to/some-file.js"
   *
   * @param  {string} src
   *         A template file path.
   *
   * @return {string}
   *         A destination file path.
   */
  _dest(src) {
    const basename = path.basename(src);
    let destname = src;

    if (_.startsWith(basename, '_')) {
      destname = src.replace(basename, basename.substr(1));
    }

    return this.destinationPath(destname);
  }

  /**
   * Attempts to get default values for prompts. Async because it may call
   * out to external processes (e.g. Git) to attempt to gather this info.
   *
   * @private
   * @return {Object}
   *         An object containing default prompt values.
   */
  _getPromptDefaults() {
    const configs = this.config.getAll();
    const pkg = this._currentPkgJSON || {};

    const defaults = _.assign(
      {},
      constants.PROMPT_DEFAULTS,
      configs,
      _.pick(pkg, ['author', 'license', 'name', 'description'])
    );

    // At this point, the `defaults.name` may still have the full scope and
    // constants.PREFIX included; so, we get the scope now.
    defaults.scope = naming.getScope(defaults.name);

    // Strip out the "videojs-" constants.PREFIX from the name for the
    // purposes of the prompt (otherwise it will be rejected by validation).
    defaults.name = naming.getBasicName(defaults.name);

    // we need to default the description to an empty string for
    // --hurry
    defaults.description = '';

    // The package.json stores a value from `LICENSE_NAMES`, so in that
    // case, we need to find the key instead of the value.
    if (pkg && pkg.license && pkg.license === defaults.license) {
      defaults.license = _.find(_.keys(constants.LICENSE_NAMES), (k) => {
        return constants.LICENSE_NAMES[k] === pkg.license;
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
  }

  /**
   * Gets prompts for the user.
   *
   * @private
   * @return {Array}
   *         An array of prompt definition objects.
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
      message: `Enter the name of this plugin (a-z/0-9/- only; will be prefixed with "${constants.PREFIX}"):`,
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
      message: 'Choose a license for your plugin',
      default: defaults.license,
      choices: constants.LICENSE_CHOICES
    }, {
      type: 'list',
      name: 'pluginType',
      message: 'Choose a type for your plugin',
      default: defaults.pluginType,
      choices: constants.PLUGIN_TYPE_CHOICES
    }, {
      type: 'confirm',
      name: 'css',
      message: 'Do you want to use css tooling?',
      default: defaults.css
    }, {
      type: 'confirm',
      name: 'docs',
      message: 'Do you want to include documentation tooling?',
      default: defaults.docs
    }, {
      type: 'confirm',
      name: 'lang',
      message: 'Do you need video.js language file infrastructure for internationalized strings?',
      default: defaults.lang
    }, {
      type: 'confirm',
      name: 'library',
      message: 'Do you want to every file in ./src available for use as ./cjs and ./es in other packages?',
      default: defaults.library
    }, {
      type: 'confirm',
      name: 'precommit',
      message: 'Should we lint changed files before allowing `git commit`',
      default: defaults.precommit
    }, {
      type: 'confirm',
      name: 'prepush',
      message: 'Should we run tests before allowing `git push`',
      default: defaults.prepush
    }];

    return prompts.filter(p => !_.includes(this._promptsToFilter, p.name));
  }

  /**
   * Generates a context object used for providing data to EJS file templates.
   *
   * @param  {Object} [configs]
   *         Optionally provide custom configs.
   *
   * @return {Object}
   *         An object to be used in EJS file templates.
   */
  _getContext(configs) {
    configs = configs || this.config.getAll();

    return _.assign(configs, {
      className: `vjs-${configs.name}`,
      pluginFunctionName: naming.getPluginFunctionName(configs.name),
      pluginClassName: naming.getPluginClassName(configs.name),
      moduleName: naming.getModuleName(configs.name),
      isPrivate: this._isPrivate(),
      licenseName: constants.LICENSE_NAMES[configs.license],
      packageName: naming.getPackageName(configs.name, configs.scope),
      pluginName: naming.getPackageName(configs.name),
      version: this._currentPkgJSON && this._currentPkgJSON.version || '0.0.0'
    });
  }

  initializing() {
    this._currentPkgJSON = this.fs.readJSON(this.destinationPath('package.json'), null);

    this._filesToCopy = [
      '_.editorconfig',
      '_.gitignore',
      '_.npmignore',
      '_.nvmrc'
    ];

    this._templatesToCopy = [
      'scripts/_rollup.config.js',
      'scripts/_karma.conf.js',
      'test/_plugin.test.js',
      '_index.html',
      '_CONTRIBUTING.md',
      '_README.md'
    ];

    this._promptsToFilter = [];

    // The "hurry" option skips both prompts and installation.
    if (this.options.hurry) {
      this.options.skipPrompt = this.options.skipInstall = true;
    }

    this._preconfigs = {};

    // Make sure we filter out the author prompt if there is a current
    // package.json file with an object for the author field.
    if (this._currentPkgJSON && _.isPlainObject(this._currentPkgJSON.author)) {
      this._promptsToFilter.push('author');
      this._preconfigs.author = this._currentPkgJSON.author;
    }
  }

  /**
   * Display prompts to the user.
   */
  prompting() {
    if (this.options.skipPrompt) {
      _.assign(this._preconfigs, this._getPromptDefaults());
      return;
    }

    this.log('Welcome to the Video.js plugin generator!');

    return this.prompt(this._getPrompts()).then((responses) => {
      _.assign(this._preconfigs, responses);
    });
  }

  /**
   * Store configs, generate template rendering context, alter the setup for
   * file structure.
   */
  configuring() {
    this.config.set(this._preconfigs);
    delete this._preconfigs;

    this.context = this._getContext();

    if (!this._isPrivate()) {
      this._filesToCopy.push('_.travis.yml');
    }

    if (this.context.lang) {
      this._filesToCopy.push('lang/_en.json');
    }

    if (this.context.css) {
      this._templatesToCopy.push('src/_plugin.css');
      this._templatesToCopy.push('scripts/_postcss.config.js');
    }
  }

  /**
   * Perform various writing tasks.
   *
   * @property {Object} writing
   */
  writing() {
    try {
      fs.statSync(this._dest('CHANGELOG.md'));
    } catch (x) {
      this.fs.copy(this.templatePath('_CHANGELOG.md'), this._dest('CHANGELOG.md'));
    }

    this.fs.copyTpl(
      this.templatePath(`src/_plugin-${this.context.pluginType}.js`),
      this._dest('src/_plugin.js'),
      this.context
    );

    this._templatesToCopy.forEach(src => {
      this.fs.copyTpl(this.templatePath(src), this._dest(src), this.context);
    });

    this._filesToCopy.forEach(src => {
      this.fs.copy(this.templatePath(src), this._dest(src));
    });

    const file = constants.LICENSE_FILES[this.config.get('license')];

    if (file) {
      this.fs.copyTpl(
        this.templatePath(file),
        this.destinationPath('LICENSE'),
        this.context
      );
    }

    const pkg = packageJSON(this._currentPkgJSON, this.context);
    const lock = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'plugin', 'package-lock.json')));

    lock.name = pkg.name;
    lock.version = pkg.version;

    // We want to use normal JSON.stringify here because we want to
    // preserve whatever ordering existed in the _currentPkgJSON object.
    this.fs.write(this.destinationPath('package.json'), JSON.stringify(pkg, null, 2));
    this.fs.write(this.destinationPath('package-lock.json'), JSON.stringify(lock, null, 2));
  }

  /**
   * Install npm dependencies; we don't have any Bower dependencies; so,
   * we don't want to run that (or depend on it in any way).
   */
  install() {
    const result = spawnSync('npm', ['--version']);

    // no access to npm uh oh, lets let yeoman throw an error
    if (result.status !== 0) {
      return this.npmInstall();
    }

    // get the major version for npm
    const major = parseFloat(result.stdout.toString().trim().split('.')[0]);

    if (!major || major <= 5) {
      return this.npmInstall();
    }

    // this.npmInstall automaticall handles
    // skipInstall, but our custom  install does not.
    // handle it now.
    if (this.options.skipInstall) {
      this.log('Skipping Install, to install later please run: npm i --package-lock-only && npm ci');
      return;
    }

    spawnSync('npm', ['i', '--prefer-offline', '--no-audit', '--progress=false'], {stdio: 'inherit', cwd: this.destinationRoot()});
  }

  /**
   * Display a final message to the user.
   */
  end() {
    if (this.options.hurry) {
      return;
    }

    this.log(`All done; ${this.context.pluginName} is ready to go!`);
  }
};
