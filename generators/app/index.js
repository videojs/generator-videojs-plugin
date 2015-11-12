'use strict';

var _ = require('lodash');
var chalk = require('chalk');
var path = require('path');
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
   * Gets prompts for the user.
   *
   * @method _prompts
   * @private
   * @return {Array}
   */
  _prompts: function() {
    var configs = this.config.getAll();
    var prompts = [{
      name: 'name',
      message: 'Enter the name of this plugin ("a-z" and "-" only; prefixed with "videojs-" automatically):',
      default: configs.name,
      validate: function(input) {
        return (/^[a-z][a-z-]+$/).test(input) || 'Names must start with a lower-case letter and contain only lower-case letters and hyphens.';
      }
    }, {
      name: 'author',
      message: 'Enter the author of this plugin:',
      default: configs.author
    }, {
      type: 'list',
      name: 'license',
      message: 'Choose a license for your project',
      default: configs.license || 'mit',
      choices: _.map(LICENSES, function(value, key) {
        return {name: value, value: key};
      })
    }, {
      type: 'confirm',
      name: 'sass',
      message: 'Do you need Sass styling?',
      default: _.isUndefined(configs.sass) ? false : configs.sass
    }, {
      type: 'list',
      name: 'builder',
      message: 'What build tool do you want to use?',
      default: configs.builder || 'grunt',
      choices: _.map(BUILDERS, function(value, key) {
        return {name: value, value: key};
      })
    }];

    return prompts.filter(function(prompt) {
      return !_.contains(this._promptsToFilter, prompt.name);
    }, this);
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

    this._filesToCopy = [
      'docs/_standards.md',
      'scripts/_banner.ejs',
      'scripts/_npm-postversion.sh',
      'scripts/_npm-preversion.sh',
      'scripts/_npm-version.sh',
      '_.editorconfig',
      '_.gitignore',
      '_.npmignore',
      '_CHANGELOG.md',
      '_CONTRIBUTING.md'
    ];

    this._templatesToCopy = [
      'src/_plugin.js',
      'test/unit/_index.html',
      'test/unit/_karma.conf.js',
      'test/unit/_plugin.test.js',
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
      this.prompt(this._prompts(), function(props) {
        _.extend(this.props, props);
        done();
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

      if (builder === 'grunt') {
        this._templatesToCopy.push('scripts/_grunt.js');
        this._filesToCopy.push('_Gruntfile.js');
      } else if (builder === 'npm') {
        this._filesToCopy.push('scripts/_bannerize.js');
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

      var pkg = _.merge(
        this.fs.readJSON(this.destinationPath('package.json'), {}),
        packageJSON(this.context, 'common'),
        packageJSON(this.context, builder)
      );

      if (this.config.get('sass')) {
        _.merge(pkg, packageJSON(this.context, builder, 'sass'));
      }

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
