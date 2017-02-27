[![npm package](https://badge.fury.io/js/barrel-defgen.svg)](https://badge.fury.io/js/barrel-defgen)
[![Build Status](https://travis-ci.org/RecuencoJones/barrel-defgen.png?branch=develop)](https://travis-ci.org/RecuencoJones/barrel-defgen)

# barrel-defgen

Simple CLI library based on [dts-generator](https://www.npmjs.com/package/dts-generator) to create TypeScript 
definition files out of barrel files.

In order to work with this CLI, your `tsconfig.json` file must define a `files` entry, pointing to the barrel file.

## Usage

```text
Usage:
  barrel-defgen [options]

Description:
  Generates type definitions into a single file from a barrel file.

Options:
  --name         Id of the namespace to declare. Defaults to pascal cased
                 directory name                                         [string]
  --out          Output file for definitions. Defaults to index.d.ts    [string]
  --project      Directory of TypeScript project where tsconfig.json exists
                                                                        [string]
  --help, -h     Show help                                             [boolean]
  --version, -v  Show version number                                   [boolean]
```

## API

If you prefer to work with the node API, import [app/lib](app/lib.js).

```javascript
const barrelDefgen = require('barrel-defgen/app/lib');

barrelDefGen({
  name: 'some-namespace',
  out: 'output.d.ts',
  project: 'path/to/ts-project'
});
```

See documentation for further information.
