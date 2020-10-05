'use strict';

const _ = require('lodash');
const path = require('path');

/**
 * Convert an object into "choices" for a prompt.
 *
 * @private
 * @param  {Object} o
 *         A plain object whose keys are the values reported by the prompt and
 *         the object values are the texts displayed to the user.
 *
 * @return {Array}
 *         An array of objects with a `name` and `value` property.
 */
const objectToChoices = (o) => _.map(o, (v, k) => ({name: v, value: k}));

const LICENSE_NAMES = {
  apache2: 'Apache-2.0',
  mit: 'MIT',
  private: 'UNLICENSED'
};

const LICENSE_DEFAULT = 'mit';

module.exports = {
  PREFIX: 'videojs-',

  PLUGIN_TYPE_CHOICES: objectToChoices({
    advanced: 'Advanced plugin (class-based)',
    basic: 'Basic plugin (function-based)'
  }),

  LICENSE_NAMES,

  LICENSE_CHOICES: objectToChoices(LICENSE_NAMES),

  LICENSE_FILES: {
    apache2: 'licenses/_apache2',
    mit: 'licenses/_mit'
  },

  LICENSE_DEFAULT,

  PROMPT_DEFAULTS: {
    docs: true,
    css: true,
    prepush: false,
    precommit: true,
    lang: true,
    library: false,
    license: LICENSE_DEFAULT,
    pluginType: 'advanced',
    name: path.basename(process.cwd()).replace(/^videojs-/, '')
  }
};
