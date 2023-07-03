import { parseArgs } from 'node:util';

export type RawOptions = {
  readonly recreate: boolean;
  readonly runMigration: boolean;
  readonly quiet: boolean;
  readonly containerFile?: string | undefined;
  readonly dataSourceFile: string | undefined;
  readonly filePatterns: readonly string[] | undefined;
};

export function argumentsParser(): RawOptions {
  const {
    values: {
      recreate = false,
      runMigration = true,
      quiet = false,
      filePatterns,
      dataSourceFile,
      containerFile,
    },
  } = parseArgs({
    options: {
      recreate: {
        type: 'boolean',
      },
      runMigration: {
        type: 'boolean',
      },
      quiet: {
        type: 'boolean',
      },
      dataSourceFile: {
        short: 'd',
        type: 'string',
      },
      containerFile: {
        type: 'string',
      },
      filePatterns: {
        type: 'string',
        multiple: true,
      },
    },
  });

  return {
    recreate,
    runMigration,
    quiet,
    dataSourceFile,
    containerFile,
    filePatterns,
  };
}
