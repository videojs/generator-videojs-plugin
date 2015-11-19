'use strict';

var _ = require('lodash');
var chalk = require('chalk');
var path = require('path');
var spawn = require('child_process').spawn;
var util = require('util');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var packageJSON = require('./package-json');

var BUILDERS = {
  grunt: 'Grunt',
  npm: 'npm'
};

var LICENSES = {
  apache2: 'Apache-2.0',
  mit: 'MIT',
  none: 'None',
  priv: 'Private/Proprietary'
};

var toChoices = function(obj) {
  return _.map(obj, function(value, key) {
    return {name: value, value: key};
  });
};

module.exports = yeoman.generators.Base.extend({

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
   * Creates the rendering context for template files.
   *
   * @method _context
   * @private
   * @return {Object}
   */
  _context: function() {
    var name = this.config.get('name');
    return {
      author: this.config.get('author'),
      licenseName: LICENSES[this.config.get('license')],
      packageName: 'videojs-' + name,
      pluginClassName: 'vjs-' + name,
      pluginName: name,
      pluginFunctionName: name.replace(/-([a-z])/g, function(match, char) {
        return char.toUpperCase();
      }),
      private: this.config.get('priv'),
      sass: this.config.get('sass'),
      year: (new Date()).getFullYear(),
    };
  },

  /**
   * Processes a single copy-able file.
   *
   * @method _cpfile
   * @private
   * @param {String} src
   */
  _cpfile: function(src) {
    var source = this.templatePath(src);
    var dest = this._dest(src);
    this.fs.copy(source, dest);
  },

  /**
   * Processes a single copy-able file as a template.
   *
   * @method _cptmpl
   * @private
   * @param {String} src
   */
  _cptmpl: function(src) {
    var source = this.templatePath(src);
    var dest = this._dest(src);
    this.fs.copyTpl(source, dest, this.context);
  },

  /**
   * Attempts to get default values for prompts. Async because it may call
   * out to external processes (e.g. Git) to attempt to gather this info.
   *
   * @method _getPromptDefaults
   * @private
   * @param  {Function} cb Callback called with author string.
   */
  _getPromptDefaults: function(cb) {
    var configs = this.config.getAll();
    var pkg = this._currentPkgJSON;
    var defaults = {};
    var git;

    ['author', 'name', 'license'].forEach(function(key) {

      // Look for configs in the configs object first. It takes precedence
      // over everything!
      if (configs.hasOwnProperty(key)) {
        defaults[key] = configs[key];

      // Look in the package.json (if one exists) for a way to determine
      // a default value.
      } else if (pkg && pkg.hasOwnProperty(key)) {
        if (key === 'license') {

          // The package.json stores a value from `LICENSES`, so in that
          // case, we need to find the key instead of the value.
          defaults.license = _.find(_.keys(LICENSES), function(k) {
            return LICENSES[k] === pkg.license;
          });
        } else {
          defaults[key] = pkg[key];
        }
      }
    });

    // Special handling to try to get the author from `git config`
    if (!defaults.author) {

      // Make sure it's a string, so we don't concat onto something like
      // undefined and get undesirable strings!
      defaults.author = '';

      git = spawn('git', ['config', 'user.name']);

      git.stdout.on('data', function(chunk) {
        defaults.author += chunk;
      });

      git.on('close', function() {
        defaults.author = defaults.author.trim();
        cb(defaults);
      });
    } else {
      cb(defaults);
    }
  },

  /**
   * Gets prompts for the user.
   *
   * @method _prompts
   * @private
   * @param  {Function} cb Callback when prompts array is ready.
   * @return {Array}
   */
  _prompts: function(cb) {
    this._getPromptDefaults(function(defaults) {
      var sass = this.config.get('sass');
      var builder = this.config.get('builder');
      var prompts = [{
        name: 'name',
        message: 'Enter the name of this plugin ("a-z", "0-9" and "-" only; prefixed with "videojs-" automatically):',
        default: defaults.name,
        validate: function(input) {
          if (!(/^[a-z][a-z0-9-]+$/).test(input)) {
            return 'Names must start with a lower-case letter and contain only lower-case letters, digits, and hyphens.';
          } else if (_.startsWith(input, 'videojs-')) {
            return 'Plugins cannot start with "videojs-"; it will automatically be prepended!';
          }
          return true;
        }
      }, {
        name: 'author',
        message: 'Enter the author of this plugin:',
        default: defaults.author
      }, {
        type: 'list',
        name: 'license',
        message: 'Choose a license for your project',
        default: defaults.license || 'mit',
        choices: toChoices(LICENSES)
      }, {
        type: 'confirm',
        name: 'sass',
        message: 'Do you need Sass styling?',
        default: _.isUndefined(sass) ? false : sass
      }, {
        type: 'list',
        name: 'builder',
        message: 'What build tool do you want to use?',
        default: builder || 'grunt',
        choices: toChoices(BUILDERS)
      }];

      cb(prompts.filter(function(prompt) {
        return !_.contains(this._promptsToFilter, prompt.name);
      }, this));
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

    this.option('private', {
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

    this._filesToCopy = [
      'scripts/_banner.ejs',
      'scripts/_npm-postversion.sh',
      'scripts/_npm-preversion.sh',
      'scripts/_npm-version.sh',
      'test/karma/_chrome.js',
      'test/karma/_detected.js',
      'test/karma/_firefox.js',
      'test/karma/_ie.js',
      'test/karma/_opera.js',
      'test/karma/_safari.js',
      '_.editorconfig',
      '_.gitignore',
      '_.npmignore',
      '_CHANGELOG.md',
      '_CONTRIBUTING.md'
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

    if (this.options.hurry) {
      this.options.skipPrompt = this.options.skipInstall = true;
    }

    this.props = {
      bcov: this.options.bcov === true || this.config.get('bcov') === true,
      priv: this.options.private === true || this.config.get('priv') === true
    };

    // Handle general closed-source plugins.
    if (this.props.priv) {
      this._filesToCopy = _.without(this._filesToCopy, '_CONTRIBUTING.md');
      this._promptsToFilter.push('license');
      this.props.license = 'priv';
    }

    if (this.props.bcov) {

      // All Brightcove plugins use the same author string.
      this._promptsToFilter.push('author');
      this.props.author = 'Brightcove, Inc.';

      // Open-source Brightcove plugins MUST use the Apache-2.0 license.
      if (!this.props.priv) {
        this._promptsToFilter.push('license');
        this.props.license = 'apache2';
      }
    }
  },

  /**
   * Display prompts to the user.
   *
   * @method prompting
   */
  prompting: function() {
    var done;
    var type = (this.props.bcov || this.props.priv ? 'a ' : 'an ') +
      chalk.green([
        this.props.bcov ? 'Brightcove ' : '',
        this.props.priv ? 'closed' : 'open',
        '-source'
      ].join(''));

    if (!this.options.hurry) {
      this.log(yosay([
        'Welcome to the ' + chalk.red('videojs-plugin') + ' generator!',
        util.format('Let’s build %s plugin.', type)
      ].join(' ')));
    }

    if (!this.options.skipPrompt) {
      done = this.async();
      this._prompts(function(prompts) {
        this.prompt(prompts, function(props) {
          _.extend(this.props, props);
          done();
        }.bind(this));
      }.bind(this));
    }
  },

  /**
   * Store configs and generate template rendering context.
   *
   * @method configuring
   */
  configuring: function() {
    this.config.set(this.props);
    delete this.props;
    this.context = this._context();
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
      var builder = this.config.get('builder');
      var sass = this.config.get('sass');

      if (!this.config.get('priv')) {
        this._filesToCopy.push('_.travis.yml');
      }

      if (builder === 'grunt') {
        this._templatesToCopy.push('scripts/_grunt.js');
        this._filesToCopy.push('_Gruntfile.js');
      } else if (builder === 'npm') {
        this._filesToCopy.push('scripts/_server.js');
      }

      if (sass) {
        this._templatesToCopy.push('src/_plugin.scss');
      }

      this._templatesToCopy.forEach(this._cptmpl, this);
      this._filesToCopy.forEach(this._cpfile, this);
    },

    /**
     * Writes the LICENSE file based on the chosen license.
     *
     * @function license
     */
    license: function() {
      var file = {
        apache2: 'licenses/_apache2',
        mit: 'licenses/_mit',
      }[this.config.get('license')];

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
      var builder = this.config.get('builder');
      var sass = this.config.get('sass');
      var generated = packageJSON(this.context, builder, sass);

      // In the case of certain properties that would otherwise be over-
      // written by the merge, make sure the existing package.json takes
      // precedence.
      var ignored = _.pick(this._currentPkgJSON, ['version']);
      var pkg = _.merge(this._currentPkgJSON, generated, ignored);

      this.fs.writeJSON(this.destinationPath('package.json'), pkg);
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
    if (!this.options.hurry) {
      this.log(yosay(
        'All done; ' + chalk.red(this.context.packageName) + ' is ready to go!'
      ));
    }
  }
});
