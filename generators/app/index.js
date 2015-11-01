'use strict';

var _ = require('lodash');
var chalk = require('chalk');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var bcov = require('./bcov');
var packageJSON = require('./package-json');

var LICENSE_NAMES = {
  apache2: 'Apache-2.0',
  mit: 'MIT',
  none: 'None',
};

module.exports = yeoman.generators.Base.extend({

  /**
   * Removes the leading underscore from a template file name.
   *
   * @method _dest
   * @private
   * @example
   *         this._dest('some-dir/__foo') // "some-dir/_foo"
   *         this._dest('_some-file.js')  // "some-file.js"
   *         this._dest('some-file.js')   // "some-file.js"
   *
   * @param  {String} src
   * @return {String}
   */
  _dest: function (src) {
    var parsed = path.parse(src);
    if (_.startsWith(parsed.base, '_')) {
      parsed.base = parsed.base.substr(1);
    }
    return this.destinationPath(path.format(parsed));
  },

  /**
   * Gets the context for template files.
   *
   * @return {Object}
   */
  _context: function () {
    var name = this.config.get('name');
    return {
      author: this.config.get('author'),
      hasStyle: this.config.get('style') !== 'none',
      licenseName: LICENSE_NAMES[this.config.get('license')],
      packageName: 'videojs-' + name,
      pluginClassName: 'vjs-' + name,
      pluginName: name,
      pluginFunctionName: name.replace(/-([a-z])/g, function (match, char) {
        return char.toUpperCase();
      }),
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
  _cpfile: function (src) {
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
  _cptmpl: function (src) {
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
  _prompts: function () {
    var configs = this.config.getAll();
    return [{
      name: 'name',
      message: 'Enter the name of this plugin ("a-z" and "-" only; prefixed with "videojs-" automatically):',
      default: configs.name,
      validate: function (input) {
        return /^[a-z][a-z-]+$/.test(input) || 'Names must start with a lower-case letter and contain only lower-case letters and hyphens.';
      }
    }, {
      name: 'author',
      message: 'Enter the author of this plugin:',
      default: configs.author
    }, {
      type: 'list',
      name: 'license',
      message: 'Choose a license for your project',
      default: configs.license || 'apache2',
      choices: [{
        name: LICENSE_NAMES.apache2,
        value: 'apache2'
      }, {
        name: LICENSE_NAMES.mit,
        value: 'mit'
      }, {
        name: LICENSE_NAMES.none,
        value: 'none'
      }]
    }, {
      type: 'list',
      name: 'style',
      message: 'What styling do you need?',
      default: configs.style || 'none',
      choices: [{
        name: 'None',
        value: 'none'
      }, {
        name: 'CSS',
        value: 'css'
      }, {
        name: 'SCSS',
        value: 'scss'
      }],
    }, {
      type: 'list',
      name: 'builder',
      message: 'What build tool do you want to use?',
      default: configs.builder || 'grunt',
      choices: [{
        name: 'Grunt',
        value: 'grunt'
      }, {
        name: 'npm',
        value: 'npm'
      }]
    }];
  },

  /**
   * Sets up the generator.
   *
   * @method constructor
   */
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    this.option('bcov', {
      type: 'boolean',
      defaults: false
    });

    this.option('prompt', {
      type: 'boolean',
      defaults: true
    });

    this.option('install', {
      type: 'boolean',
      defaults: true
    });

    this._filesToCopy = [
      'docs/_standards.md',
      '_.editorconfig',
      '_.gitignore',
      '_.jshintrc',
      '_.npmignore',
      '_CHANGELOG.md',
      '_CONTRIBUTING.md'
    ];

    this._templatesToCopy = [
      'src/_plugin.js',
      'test/unit/_.jshintrc',
      'test/unit/_index.html',
      'test/unit/_plugin.test.js',
      '_bower.json',
      '_index.html',
      '_README.md'
    ];

    // Apply Brightcove-specific decoration.
    if (this.options.bcov) {
      bcov(this);
    }
  },

  /**
   * Display prompts to the user.
   *
   * @method prompting
   */
  prompting: function () {
    var done;

    this.log(yosay(
      'Welcome to the excellent ' + chalk.red('videojs-plugin') + ' generator!'
    ));

    if (this.options.prompt) {
      done = this.async();
      this.prompt(this._prompts(), function (props) {
        this.props = props;
        done();
      }.bind(this));
    }
  },

  /**
   * Store configs and generate template rendering context.
   *
   * @method configuring
   */
  configuring: function () {
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
    common: function () {
      var builder = this.config.get('builder');

      if (builder === 'grunt') {
        this._filesToCopy.push('_Gruntfile.js');
      } else if (builder === 'npm') {
        this._filesToCopy.push('scripts/_server.js');
      }

      this._templatesToCopy.forEach(this._cptmpl, this);
      this._filesToCopy.forEach(this._cpfile, this);
    },

    /**
     * Writes the entry file for the chosen styling option.
     *
     * @function css
     */
    css: function () {
      var style = this.config.get('style');
      if (style !== 'none') {
        this._cptmpl('src/_plugin.' + style);
      }
    },

    /**
     * Writes the LICENSE file based on the chosen license.
     *
     * @function license
     */
    license: function () {
      var file = {
        apache2: '_LICENSE_APACHE2',
        mit: '_LICENSE_MIT',
      }[this.config.get('license')];

      if (file) {
        this.fs.copyTpl(
          this.templatePath(file),
          this.destinationPath('LICENSE'),
          this.context
        );
      }
    },

    package: function () {
      var builder = this.config.get('builder');
      var style = this.config.get('style');

      var pkg = _.merge(
        this.fs.readJSON(this.destinationPath('package.json'), {}),
        packageJSON(this.context, 'common'),
        packageJSON(this.context, builder),
        packageJSON(this.context, builder, style)
      );

      this.fs.writeJSON(this.destinationPath('package.json'), pkg);
    }
  },

  /**
   * Install npm dependencies; we don't have any Bower dependencies; so,
   * we don't want to run that (or depend on it in any way).
   *
   * @method install
   */
  install: function () {
    if (this.options.install) {
      this.npmInstall();
    }
  },

  /**
   * Display a final message to the user.
   *
   * @method end
   */
  end: function () {
    this.log(yosay(
      'All done; ' + chalk.red(this.context.packageName) + ' is ready to go!'
    ));
  }
});
