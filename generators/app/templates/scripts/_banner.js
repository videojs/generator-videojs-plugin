const pkg = require('../package.json');

const bannerString =  `@name ${pkg.name} @version ${pkg.version} @copyright ${pkg.author} @license ${pkg.license}`;

module.exports = {
  string: bannerString,
  comment: `/*! ${bannerString} */`
};
