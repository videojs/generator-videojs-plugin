'use strict';

var _ = require('lodash');
var chalk = require('chalk');
var path = require('path');
var spawn = require('child_process').spawn;
var util = require('util');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var packageJSON = require('./package-json');

var toChoices = function(obj) {
  return _.map(obj, function(value, key) {
    return {name: value, value: key};
  });
};

var validateName = function(input) {
  if (!(/^[a-z][a-z0-9-]+$/).test(input)) {
    return 'Names must start with a lower-case letter and contain only lower-case letters (a-z), digits (0-9), and hyphens (-).';
  } else if (_.startsWith(input, 'videojs-')) {
    return 'Plugins cannot start with "videojs-"; it will automatically be prepended!';
  }
  return true;
};

module.exports = yeoman.generators.Base.extend({

  /**
   * Whether or not this plugin is privately licensed.
   *
   * @return {Boolean}
   */
  _isPrivate: function() {
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
  _dest: function(src) {
    var basename = path.basename(src);
    var destname = src;

    if (_.startsWith(basename, '_')) {
      destname = src.replace(basename, basename.substr(1));
    }

    return this.destinationPath(destname);
  },

  /**
   * Attempts to get default values for prompts. Async because it may call
   * out to external processes (e.g. Git) to attempt to gather this info.
   *
   * @method _getPromptDefaults
   * @private
   * @param  {Function} callback Callback called with author string.
   */
  _getPromptDefaults: function(callback) {
    var configs = this.config.getAll();
    var pkg = this._currentPkgJSON;
    var licenseNames = this._licenseNames;

    var defaults = {
      license: this._licenseDefault,
      sass: configs.hasOwnProperty('sass') ? configs.sass : false
    };

    var git;

    ['author', 'license', 'name'].forEach(function(key) {
      if (pkg && pkg.hasOwnProperty(key)) {
        defaults[key] = pkg[key];
      } else if (configs.hasOwnProperty(key)) {
        defaults[key] = configs[key];
      }
    });

    // Strip out the "videojs-" prefix from the name for the purposes of
    // the prompt (otherwise it will be rejected by validation).
    if (defaults.name && _.startsWith(pkg.name, 'videojs-')) {
      defaults.name = pkg.name.substr(8);
    }

    // The package.json stores a value from `_licenseNames`, so in that
    // case, we need to find the key instead of the value.
    if (pkg && pkg.license && pkg.license === defaults.license) {
      defaults.license = _.find(Object.keys(licenseNames), function(k) {
        return licenseNames[k] === pkg.license;
      });
    }

    // If we don't have an author yet, make one last-ditch effort to find
    // the author's name with `git config`.
    if (!defaults.author) {

      // Make sure it's a string, so we can concat without worrying!
      defaults.author = '';

      git = spawn('git', ['config', 'user.name']);

      git.stdout.on('data', function(chunk) {
        defaults.author += chunk;
      });

      git.on('close', function() {
        defaults.author = defaults.author.trim();
        callback(defaults);
      });
    } else {
      callback(defaults);
    }
  },

  /**
   * Gets prompts for the user.
   *
   * @method _createPrompts
   * @private
   * @param  {Function} callback Callback when prompts array is ready.
   * @return {Array}
   */
  _createPrompts: function(callback) {
    this._getPromptDefaults(function(defaults) {
      var toFilter = this._promptsToFilter;
      var prompts = [{
        name: 'name',
        message: 'Enter the name of this plugin (a-z/0-9/- only; will be prefixed with "videojs-"):',
        default: defaults.name,
        validate: validateName
      }, {
        name: 'author',
        message: 'Enter the author of this plugin:',
        default: defaults.author
      }, {
        type: 'list',
        name: 'license',
        message: 'Choose a license for your project',
        default: defaults.license,
        choices: toChoices(this._licenseNames)
      }, {
        type: 'confirm',
        name: 'sass',
        message: 'Do you need Sass styling?',
        default: defaults.sass
      }].filter(function(prompt) {
        return !_.contains(toFilter, prompt.name);
      });

      callback(prompts);
    }.bind(this));
  },

  /**
   * Sets up the generator.
   *
   * @method constructor
   */
  constructor: function() {
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

    this._currentPkgJSON = this.fs.readJSON(this.destinationPath('package.json'), null);

    this._licenseNames = {
      apache2: 'Apache-2.0',
      mit: 'MIT',
      none: 'None/Other',
      private: 'Private/Closed Source'
    };

    this._licenseFiles = {
      apache2: 'licenses/_apache2',
      mit: 'licenses/_mit',
    };

    this._licenseDefault = 'mit';

    this._filesToCopy = [
      'scripts/_banner.ejs',
      'scripts/_npm-postversion.sh',
      'scripts/_npm-preversion.sh',
      'scripts/_npm-version.sh',
      'scripts/_server.js',
      'test/karma/_chrome.js',
      'test/karma/_detected.js',
      'test/karma/_firefox.js',
      'test/karma/_ie.js',
      'test/karma/_opera.js',
      'test/karma/_safari.js',
      '_.editorconfig',
      '_.gitignore',
      '_.npmignore',
      '_CHANGELOG.md'
    ];

    this._templatesToCopy = [
      'src/_plugin.js',
      'test/karma/_common.js',
      'test/_index.html',
      'test/_plugin.test.js',
      '_bower.json',
      '_index.html',
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

    // Handle the Brightcove option/config.
    if (this._configsTemp.bcov) {

      // All Brightcove plugins use the same author string.
      this._promptsToFilter.push('author');
      this._configsTemp.author = 'Brightcove, Inc.';

      // Brightcove plugins are either Apache-2.0 or private/closed-source.
      this._licenseNames = _.pick(this._licenseNames, 'apache2', 'private');
      this._licenseDefault = 'apache2';
    }
  },

  /**
   * Display prompts to the user.
   *
   * @method prompting
   */
  prompting: function() {
    var done;

    if (this.options.skipPrompt) {
      return;
    }

    this.log(yosay([
      'Welcome to the ' + chalk.red('videojs-plugin') + ' generator!'
    ].join(' ')));

    done = this.async();

    this._createPrompts(function(prompts) {
      this.prompt(prompts, function(responses) {
        _.assign(this._configsTemp, responses);
        done();
      }.bind(this));
    }.bind(this));
  },

  /**
   * Store configs, generate template rendering context, alter the setup for
   * file structure.
   *
   * @method configuring
   */
  configuring: function() {
    var configs, isPrivate;

    this.config.set(this._configsTemp);
    delete this._configsTemp;

    configs = this.config.getAll();
    isPrivate = this._isPrivate();

    this.context = {
      author: configs.author,
      licenseName: this._licenseNames[configs.license],
      packageName: 'videojs-' + configs.name,
      pluginClassName: 'vjs-' + configs.name,
      pluginName: configs.name,
      pluginFunctionName: _.camelCase(configs.name),
      isPrivate: isPrivate,
      sass: configs.sass,
      version: this._currentPkgJSON && this._currentPkgJSON.version || '0.0.0',
      year: (new Date()).getFullYear(),
    };

    if (!isPrivate) {
      this._filesToCopy.push('_.travis.yml');
      this._filesToCopy.push('_CONTRIBUTING.md');
    }

    if (configs.sass) {
      this._templatesToCopy.push('src/_plugin.scss');
    }
  },

  /**
   * Perform various writing tasks.
   *
   * @property {Object} writing
   */
  writing: {

    /**
     * Writes common files.
     *
     * @function common
     */
    common: function() {
      this._templatesToCopy.forEach(function(src) {
        this.fs.copyTpl(this.templatePath(src), this._dest(src), this.context);
      }, this);

      this._filesToCopy.forEach(function(src) {
        this.fs.copy(this.templatePath(src), this._dest(src));
      }, this);
    },

    /**
     * Writes the LICENSE file based on the chosen license.
     *
     * @function license
     */
    license: function() {
      var file = this._licenseFiles[this.config.get('license')];

      if (file) {
        this.fs.copyTpl(
          this.templatePath(file),
          this.destinationPath('LICENSE'),
          this.context
        );
      }
    },

    /**
     * Writes/updates the package.json file.
     *
     * @function package
     */
    package: function() {
      this.fs.writeJSON(this.destinationPath('package.json'), packageJSON(
        this._currentPkgJSON,
        this.context
      ));
    }
  },

  /**
   * Install npm dependencies; we don't have any Bower dependencies; so,
   * we don't want to run that (or depend on it in any way).
   *
   * @method install
   */
  install: function() {
    this.npmInstall();
  },

  /**
   * Display a final message to the user.
   *
   * @method end
   */
  end: function() {
    if (this.options.hurry) {
      return;
    }
    this.log(yosay(
      'All done; ' + chalk.red(this.context.packageName) + ' is ready to go!'
    ));
  }
});
