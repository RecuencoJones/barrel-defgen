/**
 * barrel-defgen main library.
 * @module Lib
 */

const path = require('path'),
  fs = require('fs'),
  _ = require('lodash'),
  del = require('del'),
  mkdirp = require('mkdirp'),
  dtsGen = require('dts-generator'),
  cwd = process.cwd();

/**
 * Generate TypeScript definitions from barrel file.
 * @param {Object} options - lib options.
 * @property {string} [options.name=PascalCasedCwd] - Id of the namespace to declare.
 * @property {string} [options.out=index.d.ts] - Output file for definitions.
 * @property {string} [options.project=cwd] - Directory of TypeScript project where tsconfig.json exists.
 * @returns {Promise} promise handler.
 */
module.exports = (options) => {
  const _options = _.defaults(options, {
      name: path.basename(cwd),
      out: path.join(cwd, 'index.d.ts'),
      project: cwd
    }),
    out = path.resolve(_options.out),
    tmpDirName = '.barrel-defgen-staging',
    tmpDir = path.join(cwd, tmpDirName),
    tmpDefsFileName = 'definitions.d.ts',
    tmpDefsFile = path.join(tmpDir, tmpDefsFileName);

  try {
    fs.mkdirSync(tmpDir);
  } catch (e) {}

  return dtsGen.default({
    name: _options.name,
    project: _options.project,
    out: tmpDefsFile
  })
  .then(() => {
    const namespace = _.upperFirst(_.camelCase(_options.name));

    let contents = fs.readFileSync(tmpDefsFile).toString()

    // split in lines easier to work with
    .split('\n')

    // remove all declare module
    .map((line) => line.replace(/declare module .*/, ''))

    // remove all extra closing braces
    .map((line) => line.replace(/^}$/, ''))

    // remove all barrel exports
    .map((line) => line.replace(/export .* from '.*';\s*/, ''))

    // remove all local imports
    .map((line) => line.replace(new RegExp(`import .* from '${_options.name}.*`), ''))

    // replace tabs with spaces
    .map((line) => line.replace(/\t/g, '    '))

    // space doc comments for readability
    .map((line) => line.replace(/^(\s*)\/\*\*/, '\n$1/**'))

    // space exports for readability
    .map((line) => line.replace(/^(\s*)export (type|class|interface)/, '\n$1export $2'))

    // remove extra empty lines
    .filter((line) => !!line.trim());

    // add global declaration of namespace
    contents.unshift(`declare namespace ${namespace} {`);
    contents.push('}');

    // add declaration of module
    contents.push(`\ndeclare module '${_options.name}' { export = ${namespace}; }`);

    // join everything back
    contents = contents.join('\n');

    try {
      mkdirp.sync(path.dirname(out));
    } catch (e) {}

    fs.writeFileSync(out, contents);
    del(tmpDir);
  });
};
