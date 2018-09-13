'use strict';

const _ = require('lodash');
const PREFIX = require('./constants');

/**
 * Validates that a plugin name does not include invalid characters or start
 * with the "videojs-" prefix.
 *
 * @param  {string} input
 *         A value to test.
 *
 * @return {string|boolean}
 *         A string if erroneous and `true` if not.
 */
const name = (input) => {

  if (!(/^[a-z][a-z0-9-]*$/).test(input)) {
    return 'Names must start with a lower-case letter and contain' +
      ' only lower-case letters (a-z), digits (0-9), and hyphens (-).';
  }

  if (_.startsWith(input, PREFIX)) {
    return `Plugins cannot start with "${PREFIX}"; it will automatically be prepended!`;
  }

  return true;
};

/**
 * Validates that an npm package scope includes @, but not /.
 *
 * @param  {string} input
 *         A value to test.
 *
 * @return {string|boolean}
 *         A string if erroneous and `true` if not.
 */
const scope = (input) => {

  if (input && _.startsWith(input, '@')) {
    return 'Do not begin your scope with "@", it will be automatically added.';
  }

  if (input && _.endsWith(input, '/')) {
    return 'Do not include a trailing "/" in your package scope, it will be automatically added.';
  }

  return true;
};

module.exports = {name, scope};
