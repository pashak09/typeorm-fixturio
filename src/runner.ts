import { resolve } from 'node:path';
import { cwd } from 'node:process';

import { containerImporter } from '@app/container/containerImporter';
import { TypeOrmContainer } from '@app/container/TypeOrmContainer';
import { Logger, LogLevel } from '@app/logger/Logger';
import { entityResolver } from '@app/orm/entityResolver';
import { FixtureContainer } from 'fixturio';
import { CommandUtils } from 'typeorm/commands/CommandUtils';
import { checkDatabase, createDatabase, dropDatabase } from 'typeorm-extension';

export type Options = {
  readonly recreate: boolean;
  readonly runMigration: boolean;
  readonly quiet: boolean;
  readonly autoPersist?: boolean | undefined;
  readonly containerFile?: string | undefined;
  readonly dataSourceFile: string;
  readonly filePatterns: readonly string[];
};

export const runner = async ({
  dataSourceFile,
  recreate,
  runMigration,
  autoPersist,
  filePatterns,
  containerFile,
  quiet,
}: Options): Promise<void> => {
  const logger = new Logger(quiet ? LogLevel.ERROR : LogLevel.INFO);
  const dataSource = await CommandUtils.loadDataSource(resolve(cwd(), dataSourceFile));

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
    const fixtureContainer = new FixtureContainer(
      containerFile !== undefined
        ? await containerImporter(containerFile)
        : new TypeOrmContainer(dataSource),
    );

    const { loadedResults } = await fixtureContainer.installFixtures({
      filePatterns,
      rootDir: cwd(),
    });

    if (autoPersist === true) {
      //it's important to save the fixtures in the right order
      await dataSource.manager.transaction(async (): Promise<void> => {
        for (const entity of entityResolver(loadedResults)) {
          await dataSource.manager.save(entity);
        }
      });
    }
  } catch (error: unknown) {
    throw error;
  } finally {
    await dataSource.destroy();
  }

  logger.info('Done');
};
