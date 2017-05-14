'use strict';

const _ = require('lodash');

/**
 * Convert an object into "choices" for a prompt. The object keys are the
 * values reported by the prompt and the object values are the texts displayed
 * to the user.
 *
 * @private
 * @param  {Object} o
 * @return {Array}
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

  HUSKY_CHOICES: objectToChoices({
    lint: 'Check code quality',
    test: 'Check code quality and run tests',
    none: 'Nothing'
  }),

  LICENSE_NAMES,

  LICENSE_CHOICES: objectToChoices(LICENSE_NAMES),

  LICENSE_FILES: {
    apache2: 'licenses/_apache2',
    mit: 'licenses/_mit'
  },

  LICENSE_DEFAULT,

  PROMPT_DEFAULTS: {
    changelog: true,
    docs: false,
    husky: 'lint',
    lang: false,
    license: LICENSE_DEFAULT,
    sass: false,
    ie8: false
  }
};
