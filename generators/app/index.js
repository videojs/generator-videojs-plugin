'use strict';

const _ = require('lodash');
const execSync = require('child_process').execSync;
const path = require('path');
const tsmlj = require('tsmlj');
const yeoman = require('yeoman-generator');
const PREFIX = require('./constants').PREFIX;
const packageJSON = require('./package-json');
const utils = require('./utils');
const validators = require('./validators');

const licenseNames = {
  apache2: 'Apache-2.0',
  mit: 'MIT',
  private: 'UNLICENSED'
};

const licenseFiles = {
  apache2: 'licenses/apache2',
  mit: 'licenses/mit'
};

module.exports = yeoman.generators.Base.extend({

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

    const defaults = {

      // ghooks was replaced by husky, so we support both here.
      husky: _.get(configs, 'husky', _.get(configs, 'ghooks', 'lint')),
      license: 'mit',
      type: configs.type || 'basic',
      docs: _.get(configs, 'docs', false),
      lang: _.get(configs, 'lang', false),

      // sass was replaced by css, so we support both here.
      css: _.get(configs, 'css', _.get(configs, 'sass', false))
    };

    ['author', 'license', 'name', 'description'].forEach(key => {
      if (_.has(pkg, key)) {
        defaults[key] = pkg[key];
      } else if (_.has(configs, key)) {
        defaults[key] = configs[key];
      }
    });

    // At this point, the `defaults.name` may still have the full scope and
    // prefix included; so, we get the scope now.
    defaults.scope = utils.getScopeFromPackageName(defaults.name);

    // Strip out the "videojs-" prefix from the name for the purposes of
    // the prompt (otherwise it will be rejected by validation).
    defaults.name = utils.getEssentialName(defaults.name);

    // The package.json stores a value from `licenseNames`, so in that
    // case, we need to find the key instead of the value.
    if (pkg && pkg.license && pkg.license === defaults.license) {
      defaults.license = _.find(_.keys(licenseNames), k => {
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
      choices: utils.objectToChoices(licenseNames)
    }, {
      type: 'list',
      name: 'type',
      message: 'Choose a plugin type',
      default: defaults.type,
      choices: utils.objectToChoices({
        basic: 'Basic (function-based)',
        advanced: 'Advanced (class-based, Video.js 6 only)'
      })
    }, {
      type: 'confirm',
      name: 'css',
      message: 'Do you want to include CSS styling, including Sass preprocessing?',
      default: defaults.css
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
      type: 'list',
      name: 'husky',
      message: 'What should be done before you git push?',
      default: defaults.husky,
      choices: utils.objectToChoices({
        lint: 'Check code quality',
        test: 'Check code quality and run tests',
        none: 'Nothing'
      })
    }];

    return prompts.filter(p => !_.includes(this._promptsToFilter, p.name));
  },

  /**
   * Generates a context object used for providing data to EJS file templates.
   *
   * @return {Object}
   */
  _getContext() {
    const configs = this.config.getAll();
    const camelName = _.camelCase(configs.name);

    return _.assign(configs, {
      className: `vjs-${configs.name}`,
      functionName: camelName,
      constructorName: camelName.charAt(0).toUpperCase() + camelName.substr(1),
      isPrivate: configs.license === 'private',
      licenseName: licenseNames[configs.license],
      packageName: utils.getPackageName(configs.name, configs.scope),
      pluginName: utils.getPackageName(configs.name),
      version: this._currentPkgJSON && this._currentPkgJSON.version || '0.0.0'
    });
  },

  /**
   * Same as the inherited method, but replaces path elements with leading
   * underscores with dots. This way, dotfiles/dirs are never ignored.
   *
   * @method _normalizedDestinationPath
   * @private
   * @example
   *         this.destinationPath('_some-file.js')  // "/path/to/.some-file.js"
   *         this.destinationPath('dir/_dir/some-file.js')  // "/path/to/dir/.dir/some-file.js"
   *         this.destinationPath('some-file.js')   // "/path/to/some-file.js"
   *         this.destinationPath('some_file.js')   // "/path/to/some_file.js"
   *
   * @param  {String} src
   * @return {String}
   */
  _normalizedDestinationPath(src) {

    // Paths coming into this function are formatted in Unix style as strings;
    // so, we don't need to vary support for Windows-style paths.
    const sep = '/';
    const parsed = path.parse(src);
    const parts = parsed.dir ? parsed.dir.split(sep).filter(Boolean) : [];

    const dest = parts
      .concat(parsed.base)
      .map(s => (s.charAt(0) === '_') ? '.' + s.substr(1) : s)
      .join(sep);

    return this.destinationPath(dest);
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

    this.option('skip-prompt', {
      type: 'boolean',
      defaults: false
    });

    this.option('hurry', {
      type: 'boolean',
      defaults: false
    });

    this._currentPkgJSON = this.fs.readJSON(this.destinationPath('package.json'), null);
    this._promptsToFilter = [];

    // The "hurry" option skips both prompts and installation.
    if (this.options.hurry) {
      this.options.skipPrompt = this.options.skipInstall = true;
    }

    this._configsTemp = {};

    // Make sure we filter out the author prompt if there is a current
    // package.json file with an object for the author field.
    if (this._currentPkgJSON && _.isPlainObject(this._currentPkgJSON.author)) {
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

    const done = this.async();

    this.prompt(this._getPrompts(), responses => {
      _.assign(this._configsTemp, responses);
      done();
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
  },

  /**
   * Perform various writing tasks.
   *
   * @method writing
   */
  writing() {
    const git = this.destinationPath('.git');

    // Initialize a Git repository if none exists.
    try {
      this.fs.statSync(git);
    } catch (e) {
      execSync('git init');
    }

    // Render template files.
    [
      'test/index.test.js',
      'index.html',
      'CONTRIBUTING.md',
      'README.md'
    ]
      .concat(this.context.css && 'src/css/index.scss')
      .filter(Boolean)
      .forEach(src => this.fs.copyTpl(this.templatePath(src), this._normalizedDestinationPath(src), this.context));

    // Special license template handling.
    const license = licenseFiles[this.context.license];

    if (license) {
      this.fs.copyTpl(
        this.templatePath(license),
        this._normalizedDestinationPath('LICENSE'),
        this.context
      );
    }

    // Special index template handling.
    this.fs.copyTpl(
      this.templatePath(`src/js/index-${this.context.type}.js`),
      this._normalizedDestinationPath('src/js/index.js'),
      this.context
    );

    // Copy non-template files.
    [
      '_editorconfig',
      '_gitignore',
      '_npmignore',
      'CHANGELOG.md'
    ]
      .concat(
        !this.context.isPrivate && [
          '_travis.yml',
          '_github/ISSUE_TEMPLATE.md',
          '_github/PULL_REQUEST_TEMPLATE.md'
        ],
        this.context.lang && 'lang/en.json',
        this.context.docs && 'docs/index.md'
      )
      .filter(Boolean)
      .forEach(src => this.fs.copy(this.templatePath(src), this._normalizedDestinationPath(src)));

    // Write out the new package.json
    const json = packageJSON(this._currentPkgJSON, this.context);

    // We want to use normal JSON.stringify here because we want to
    // preserve whatever ordering existed in the _currentPkgJSON object.
    const contents = JSON.stringify(json, null, 2);

    this.fs.write(this._normalizedDestinationPath('package.json'), contents);
  },

  /**
   * Install npm dependencies; we don't have any Bower dependencies; so,
   * we don't want to run that (or depend on it in any way).
   *
   * @method install
   */
  install() {
    this.npmInstall();
  }
});
