'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var _ = require('underscore.string');
var spawn = require('child_process').spawn;

var TV2PlayerPluginGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    var gitConfig,
        author = '',
        done = this.async(),
        yo = this;

    // greet the user
    this.log(this.yeoman);

    // short generator description
    this.log(chalk.magenta('Build a TV 2 Player (video.js) plugin with Grunt, npm, and qunit.'));

    // look up a default author name through git config
    gitConfig = spawn('git', ['config', 'user.name']);
    gitConfig.stdout.on('data', function(chunk) {
      author += chunk;
    });
    gitConfig.on('close', function() {
      var prompts = [{
            name: 'pluginName',
            message: 'What would you like to call your plugin?',
            default: 'tv2-player-' +
              process.cwd().split(path.sep).slice(-1)[0]
              .replace(/^tv2-player-/, '')
              .replace(/^vjs-/, '')
          }, {
            name: 'description',
            message: 'Describe your plugin in one short sentence:',
            default: 'A revolutionary plugin for the TV 2 Player'
          },{
            name: 'author',
            message: 'What is your name?'
          }, {
            name: 'license',
            message: 'What license is your plugin released under?',
            default: 'Apache-2.0'
          }];

      if (author !== '') {
        prompts[2].default = _.trim(author);
      }

      yo.prompt(prompts, function (props) {
        var now = new Date();

        this.pluginName = props.pluginName;
        this.camelPluginName =
          _.camelize(this.pluginName.replace(/^tv2-player-/, ''));
        this.humanPluginName =
          _.titleize(_.humanize(this.pluginName.replace('tv2-player', 'video.js')));

        this.author = props.author;
        this.version = '0.0.0';
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
      }.bind(yo));
    });
  },

  app: function () {
    this.mkdir('lib');
    this.mkdir('test');

    this.template('_package.json', 'package.json');
    this.template('_tv2-player-plugin.js', path.join('lib', this.pluginName + '.js'));

    this.template('_index.html', path.join('test', 'index.html'));
    this.template('_tv2-player-plugin.test.js',
                  path.join('test', this.pluginName + '.test.js'));

    this.template('_README.md', 'README.md');
    this.template('_example.html', 'example.html');

    if (this.license) {
      this.template('_LICENSE-' + this.license,
                    'LICENSE-' + this.license);
    }
  },

  projectfiles: function () {
    this.copy('gitignore', '.gitignore');
    this.copy('npmignore', '.npmignore');

    this.copy('_Gruntfile.js', 'Gruntfile.js');

    this.copy('editorconfig', '.editorconfig');
  }
});

module.exports = TV2PlayerPluginGenerator;
