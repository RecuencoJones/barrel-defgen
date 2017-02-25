/**
 * Yargs CLI application, run with -h for detailed information.
 * @module CLI
 */

const yargs = require('yargs'),
  pkg = require('../package.json'),
  barrelDefGen = require('./lib');

var argv = yargs
.usage(`
Usage:
  ${pkg.name} [options]

Description:
  ${pkg.description}.`)
.option('name', {
  describe: 'Id of the namespace to declare. Defaults to pascal cased directory name',
  type: 'string'
})
.option('out', {
  describe: 'Output file for definitions. Defaults to index.d.ts',
  type: 'string',
  normalize: true
})
.option('project', {
  describe: 'Directory of TypeScript project where tsconfig.json exists',
  type: 'string',
  normalize: true
})
.help('help')
.alias('help', 'h')
.version()
.alias('version', 'v')
.epilog(`See ${pkg.repository.url} for sources and further information.`)
  .argv;

barrelDefGen({
  name: argv.name,
  project: argv.project,
  out: argv.out
});
