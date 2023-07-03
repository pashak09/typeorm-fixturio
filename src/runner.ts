import { resolve } from 'node:path';

import { containerImporter } from '@app/container/containerImporter';
import { TypeOrmContainer } from '@app/container/TypeOrmContainer';
import { Logger, LogLevel } from '@app/logger/Logger';
import { FixtureContainer } from 'fixturio';
import { CommandUtils } from 'typeorm/commands/CommandUtils';
import { checkDatabase, createDatabase, dropDatabase } from 'typeorm-extension';

export type Options = {
  readonly recreate: boolean;
  readonly runMigration: boolean;
  readonly quiet: boolean;
  readonly containerFile?: string | undefined;
  readonly dataSourceFile: string;
  readonly filePatterns: readonly string[];
};

export const runner = async ({
  dataSourceFile,
  recreate,
  runMigration,
  filePatterns,
  containerFile,
  quiet,
}: Options): Promise<void> => {
  const logger = new Logger(quiet ? LogLevel.ERROR : LogLevel.INFO);
  const dataSource = await CommandUtils.loadDataSource(resolve(process.cwd(), dataSourceFile));

  const databaseName =
    'replication' in dataSource.options && 'database' in dataSource.options.replication.master
      ? dataSource.options.replication.master.database
      : dataSource.options.database;

  const { exists } = await checkDatabase({ dataSource });

  if (exists === false) {
    logger.info(`Create a new ${databaseName} database`);
    await createDatabase({ options: dataSource.options });
  }

  if (recreate === true && exists === true) {
    logger.info(`Recreate ${databaseName} database`);

    await dropDatabase({ options: dataSource.options });
    await createDatabase({ options: dataSource.options });
  }

  if (dataSource.isInitialized === false) {
    await dataSource.initialize();
  }

  if (runMigration === true) {
    logger.info('Run migrations');
    await dataSource.runMigrations({ transaction: 'all' });
  }

  logger.info('Start loading fixtures');

  try {
    const fixtureContainer = new FixtureContainer({
      filePatterns,
      serviceContainer:
        containerFile !== undefined
          ? await containerImporter(containerFile)
          : new TypeOrmContainer(dataSource),
    });

    await fixtureContainer.loadFiles();
    await fixtureContainer.installFixtures();
  } catch (err) {
    throw err;
  } finally {
    await dataSource.destroy();
  }

  logger.info('Done');
};
