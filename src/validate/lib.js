import fs from 'fs';

const isNonEmptyString = v => typeof v === 'string' && /\S/.test(v);
const isObject = o => !!o && typeof o === 'object';

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
  isObject
};
