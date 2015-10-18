'use strict';

var _ = require('lodash');

var excludedFilesToCopy = [
  '_CONTRIBUTING.md',
];

var excludedPromptNames = [
  'author',
  'license'
];

/**
 * Decorates the videojs-plugin generator with Brightcove defaults/behavior.
 *
 * This must be called in the `constructor` in order to modify prototype
 * methods _before_ the Yeoman run context starts. For some reason, Yeoman
 * treats prototype methods as special in its run context.
 *
 * @function bcov
 * @param {yeoman.generators.Base} generator
 */
module.exports = function bcov(generator) {
  var __super__ = Object.getPrototypeOf(generator);
  var originals = _.clone(__super__);

  _.extend(generator, {
    _filesToCopy: _.difference(generator._filesToCopy, excludedFilesToCopy),
  });

  _.extend(__super__, {

    /**
     * Modifies prompts for the user.
     *
     * @method _prompts
     * @private
     * @return {Array}
     */
    _prompts: function () {
      var prompts = originals._prompts.apply(this, arguments);
      var style = _.findWhere(prompts, {name: 'style'});

      // Remove "css" choice from the "style" option.
      style.choices = style.choices.filter(function (choice) {
        return choice.value !== 'css';
      });

      // Remove the "author" and "license" prompts.
      return prompts.filter(function (prompt) {
        return excludedPromptNames.indexOf(prompt.name) === -1;
      });
    },

    /**
     * Modify configs to be set.
     *
     * @method configuring
     */
    configuring: function () {

      // Adjust properties before setting. These are not optional.
      _.extend(this.props, {
        author: 'Brightcove, Inc.',
        license: 'apache2',
      });

      originals.configuring.apply(this, arguments);
    }
  });
};
