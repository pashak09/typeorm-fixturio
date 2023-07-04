# typeorm-fixturio

<p align="center">
  <a href="https://github.com/pashak09/typeorm-fixturio/actions">
    <img src="https://github.com/pashak09/typeorm-fixturio/actions/workflows/ci/badge.svg" alt="test" />
  </a>
  <a href="https://coveralls.io/github/pashak09/typeorm-fixturio?branch=master">
    <img src="https://coveralls.io/repos/github/pashak09/typeorm-fixturio/badge.svg?branch=master" alt="Coverage Status" />
  </a>
  <a href="https://www.npmjs.com/package/typeorm-fixturio">
    <img src="https://img.shields.io/npm/v/typeorm-fixturio" alt="npm shield" />
  </a>
</p>

### Installation
```bash
yarn add -D typeorm-fixturio
```

### Options

| Option           | Short | Type     | Description                                                   |
| ---------------- | ----- | -------- |---------------------------------------------------------------|
| recreate         |       | boolean  | Determines whether to recreate the database                   |
| runMigration     |       | boolean  | Determines whether to run the migration                       |
| quiet            |       | boolean  | Suppresses console output during execution                    |
| dataSourceFile   | -d    | string   | Path to the orm data source file                              |
| containerFile    |       | string   | Path to the container file                                    |
| filePatterns     |       | string[] | Array of fixture patterns to match and process multiple files |


An example how to run cli command

```json
//package.json
...
"scripts": {
  "prepare-database": "node -r ts-node/register -r tsconfig-paths/register ./node_modules/typeorm-fixturio/dist/cli.js -d ormconfig.ts --filePatterns 'tests/fixtures/**/*.ts' --recreate --runMigration"
}
//...
```

This library is based on https://github.com/pashak09/fixturio.

### Examples

Examples of usage can be found in <a href="https://github.com/pashak09/typeorm-fixturio/tree/master/examples">examples</a> folder

### License
MIT
