const _ = require('lodash');
const PREFIX = require('./constants').PREFIX;

/**
 * A collection of functions of various utility.
 *
 * @type {Object}
 */
module.exports = {

  /**
   * Gets the name of the plugin (without scope) including the "videojs-"
   * prefix.
   *
   * @param  {String} name
   * @return {String}
   */
  getPluginName(name) {
    return name && typeof name === 'string' ? PREFIX + name : '';
  },

  /**
   * Gets the name of the scope including the "@" symbol. Will not prepend
   * the "@" if it is already included.
   *
   * @param  {String} scope
   * @return {String}
   */
  getPackageScope(scope) {
    if (!scope || typeof scope !== 'string') {
      return '';
    }
    return scope.charAt(0) === '@' ? scope : `@${scope}`;
  },

  /**
   * Gets the full package name, taking scope into account.
   *
   * @param  {String} name
   * @param  {String} [scope]
   * @return {String}
   */
  getPackageName(name, scope) {
    scope = this.getPackageScope(scope);
    name = this.getPluginName(name);
    return scope ? `${scope}/${name}` : name;
  },

  /**
   * Gets the scope of the plugin (without scope or "videojs-" prefix).
   *
   * @param  {String} name
   * @return {String}
   */
  getScopeFromPackageName(name) {
    if (!name) {
      return '';
    }

    const match = name.match(/^@([^/]+)\//);

    return match ? match[1] : '';
  },

  /**
   * Gets the essential - that is, without scope or "videojs-" prefix - name
   * of a plugin.
   *
   * @param  {String} name
   * @return {String}
   */
  getEssentialName(name) {
    if (!name) {
      return '';
    }
    return name.split('/').reverse()[0].replace(PREFIX, '');
  },

  /**
   * Convert an object into "choices" for a prompt. The object keys are the
   * values reported by the prompt and the object values are the texts displayed
   * to the user.
   *
   * @param  {Object} o
   * @return {Array}
   */
  objectToChoices(o) {
    return _.map(o, (v, k) => ({name: v, value: k}));
  }
};
