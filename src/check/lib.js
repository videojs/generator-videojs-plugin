import fs from 'fs';

const isNonEmptyString = v =>
  typeof v === 'string' && (/\S/).test(v);

const isPlainObject = o =>
  Object.prototype.toString.call(o) === '[object Object]';

const statChecker = method => {
  return p => {
    try {
      return fs.statSync(p)[method]();
    } catch (x) {
      return false;
    }
  };
};

const isDir = statChecker('isDirectory');
const isFile = statChecker('isFile');

export {
  isDir,
  isFile,
  isNonEmptyString,
  isPlainObject
};
