'use strict';

/**
 * Gets the version of the generator.
 *
 * @return {String}
 */
const generatorVersion = () => require('../../package.json').version;

module.exports = generatorVersion;
