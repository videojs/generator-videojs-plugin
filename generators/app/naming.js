const PREFIX = require('./constants').PREFIX;

module.exports = {

  /**
   * Gets the name of the scope including the "@" symbol. Will not prepend
   * the "@" if it is already included.
   *
   * @param  {String} scope
   * @return {String}
   */
  getScope(scope) {
    if (!scope || typeof scope !== 'string') {
      return '';
    }
    return scope.charAt(0) === '@' ? scope : `@${scope}`;
  },

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
   * Gets the full package name, taking scope into account.
   *
   * @param  {String} name
   * @param  {String} [scope='']
   * @return {String}
   */
  getPackageName(name, scope) {
    scope = scope ? this.getScope(scope) : '';
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
   * Gets the core/default - that is, without scope or "videojs-"
   * prefix - name of the plugin.
   *
   * @param  {String} name
   * @return {String}
   */
  getDefaultNameFromPackageName(name) {
    if (!name) {
      return '';
    }
    return name.split('/').reverse()[0].replace(PREFIX, '');
  }
};
