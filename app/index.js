'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var _ = require('underscore.string');

var VideojsPluginGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // greet the user
    this.log(this.yeoman);

    // short generator description
    this.log(chalk.magenta('Build a video.js plugin with Grunt, npm, and qunit.'));

    var prompts = [{
      name: 'pluginName',
      message: 'What would you like to call your plugin?',
      default: 'videojs-' +
        process.cwd().split(path.sep).slice(-1)[0]
        .replace(/^videojs-/, '')
        .replace(/^vjs-/, '')
    }, {
      name: 'description',
      message: 'Describe your plugin in one short sentence:',
      default: 'A revolutionary plugin for video.js'
    },{
      name: 'author',
      message: 'What is your name?'
    }, {
      name: 'license',
      message: 'What license is your plugin released under?',
      default: 'Apache-2.0'
    }];

    this.prompt(prompts, function (props) {
      var now = new Date();
      this.pluginName = props.pluginName;
      this.camelPluginName =
        _.camelize(this.pluginName.replace(/^videojs-/, ''));
      this.humanPluginName =
        _.titleize(_.humanize(this.pluginName.replace('videojs', 'video.js')));

      this.author = props.author;
      this.version = '0.1.0';
      this.today =
        now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + (now.getDate());
      this.year = now.getFullYear();

      this.description = props.description;

      if ((/Apache(-)?2(\.0)?/i).test(props.license)) {
        this.license = 'Apache-2.0';
      } else if ((/MIT/i).test(props.license)) {
        this.license = 'MIT';
      }

      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir('lib');
    this.mkdir('test');

    this.copy('jshintrc', '.jshintrc');

    this.template('_package.json', 'package.json');
    this.template('_videojs-plugin.js', path.join('lib', this.pluginName + '.js'));

    this.template('_index.html', path.join('test', 'index.html'));
    this.template('_videojs-plugin.test.js',
                  path.join('test', this.pluginName + '.test.js'));
    this.copy('_Gruntfile.js', 'Gruntfile.js');
    this.template('_README.md', 'README.md');
    this.template('_example.html', 'example.html');

    if (this.license) {
      this.template('_LICENSE-' + this.license,
                    'LICENSE-' + this.license);
    }
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
  }
});

module.exports = VideojsPluginGenerator;
