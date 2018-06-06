const _ = require('lodash');
const PREFIX = require('./constants').PREFIX;

module.exports = {

  /**
   * Gets the name of the scope including the "@" symbol. Will not prepend
   * the "@" if it is already included.
   *
   * @private
   * @param  {string} scope
   *         An initial scope to normalize (e.g. "scope").
   *
   * @return {string}
   *         A normalized scope (e.g. "@scope") or an empty string.
   */
  _getScope(scope) {
    if (!scope || typeof scope !== 'string') {
      return '';
    }
    return scope.charAt(0) === '@' ? scope : `@${scope}`;
  },

  /**
   * Gets the name of the plugin (without scope) including the "videojs-"
   * prefix.
   *
   * @private
   * @param  {string} name
   *         A plugin name without scope or "videojs-" prefix (e.g. "foo-bar").
   *
   * @return {string}
   *         A plugin name without scope and including the "videojs-" prefix.
   */
  _getPrefixedName(name) {
    if (!name || typeof name !== 'string') {
      return '';
    }
    name = this.getBasicName(name);
    return name.substr(0, PREFIX.length) === PREFIX ? name : PREFIX + name;
  },

  /**
   * Gets the full package name, taking scope into account.
   *
   * @param  {string} name
   *         A plugin name without scope or "videojs-" prefix (e.g. "foo-bar").
   *
   * @param  {string} [scope='']
   *         An optional package scope with or without "@" (e.g. "scope").
   *
   * @return {string}
   *         A full package name (e.g. "@scope/videojs-foo-bar")
   */
  getPackageName(name, scope) {
    scope = this._getScope(scope);
    name = this._getPrefixedName(name);
    return scope ? `${scope}/${name}` : name;
  },

  /**
   * Gets the scope from a package name.
   *
   * @param  {string} name
   *         A full package name, including scope (e.g. "@scope/videojs-foo-bar").
   *
   * @return {string}
   *         The scope only (e.g. "scope") or an empty string.
   */
  getScope(name) {
    if (!name) {
      return '';
    }

    const match = name.match(/^@([^/]+)\//);

    return match ? match[1] : '';
  },

  /**
   * Gets the basic - that is, without scope or "videojs-" prefix - name of
   * a plugin from a package name, prefixed name, or basic name.
   *
   * @param  {string} name
   *         A plugin name, possibly with scope and "videojs-" prefix (e.g.
   *         "@scope/videojs-foo-bar").
   *
   * @return {string}
   *         A basic plugin name (e.g. "foo-bar").
   */
  getBasicName(name) {
    if (!name) {
      return '';
    }
    return name.split('/').reverse()[0].replace(PREFIX, '');
  },

  /**
   * Gets a function-friendly name for the plugin (e.g. "fooBar") from
   * either a basic name (e.g. "foo-bar") or a prefixed name.
   *
   * @param  {string} name
   *         A plugin name (e.g. "videojs-foo-bar").
   *
   * @return {string}
   *         A function name equivalent (e.g. "fooBar").
   */
  getPluginFunctionName(name) {
    return _.camelCase(this.getBasicName(name));
  },

  /**
   * Gets a class-friendly name for the plugin (e.g. "FooBar") from
   * either a basic name (e.g. "foo-bar") or a prefixed name.
   *
   * @param  {string} name
   *         A plugin name (e.g. "videojs-foo-bar").
   *
   * @return {string}
   *         A function name equivalent (e.g. "FooBar").
   */
  getPluginClassName(name) {
    return _.upperFirst(_.camelCase(this.getBasicName(name)));
  },

  /**
   * Gets a module-friendly name for the plugin (e.g. "videojsFooBar") from
   * either a basic name (e.g. "foo-bar") or a prefixed name.
   *
   * @param  {string} name
   *         A plugin name (e.g. "videojs-foo-bar").
   *
   * @return {string}
   *         A function name equivalent (e.g. "videojsFooBar").
   */
  getModuleName(name) {
    return _.camelCase(this._getPrefixedName(name));
  }
};
