'use strict';

/**
 * Gets the version of the generator.
 *
 * @return {string}
 *         The version of the generator.
 */
const generatorVersion = () => require('../../package.json').version;

module.exports = generatorVersion;
