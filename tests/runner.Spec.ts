import { rm, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

import { runner } from '@app/runner';
import { configGenerator } from '@tests/config/configGenerator';
import { CommandUtils } from 'typeorm/commands/CommandUtils';
import { checkDatabase, dropDatabase } from 'typeorm-extension';

import { Article } from '../examples/entity/Article';
import { User } from '../examples/entity/User';

describe('runner', () => {
  afterAll(async () => {
    const regex = /ormconfig\.\w+\.ts/;
    const configDir = resolve(__dirname, 'config');

    await Promise.all(
      (await readdir(configDir))
        .filter((file: string): boolean => regex.test(file))
        .map(async (file: string): Promise<void> => rm(resolve(configDir, file)))
    );
  });

  it('should create a new database', async (): Promise<void> => {
    const dataSourceFile = await configGenerator({
      database: `test-${(Math.random() + 1).toString(36).substring(7)}`,
      synchronize: true,
    });

    const dataSource = await CommandUtils.loadDataSource(dataSourceFile);

    await runner({
      dataSourceFile,
      filePatterns: ['examples/fixtures/*'],
      recreate: true,
      quiet: true,
      runMigration: false,
    });

    const { exists } = await checkDatabase(dataSource);

    await dropDatabase(dataSource);

    expect(exists).toBe(true);
  });

  it('should upload fixtures into an existing database', async (): Promise<void> => {
    const dataSourceFile = await configGenerator({
      database: 'test',
      synchronize: true,
    });

    const dataSource = await CommandUtils.loadDataSource(dataSourceFile);

    await dataSource.initialize();

    await dataSource.manager.query('DELETE FROM article');
    await dataSource.manager.query('DELETE FROM user');

    await runner({
      dataSourceFile,
      filePatterns: ['examples/fixtures/*'],
      recreate: true,
      quiet: true,
      runMigration: false,
    });

    await dataSource.initialize();

    const articles = await dataSource.manager.find(Article, { relations: { author: true } });
    const users = await dataSource.manager.find(User);

    await dataSource.destroy();

    const firstUser = new User(1, 'user_1');
    const secondUser = new User(2, 'user_2');

    expect((await checkDatabase(dataSource)).exists).toBe(true);
    expect(articles).toHaveLength(2);
    expect(users).toHaveLength(2);
    expect(articles).toStrictEqual([
      new Article(1, firstUser, 'hey', new Date('2023-01-02T14:33:48.027Z')),
      new Article(2, secondUser, 'hey', new Date('2023-02-02T14:33:48.027Z')),
    ]);
    expect(users).toStrictEqual([firstUser, secondUser]);
  });

  it('should run migrations', async (): Promise<void> => {
    const dataSourceFile = await configGenerator({
      database: `test-${(Math.random() + 1).toString(36).substring(7)}`,
      synchronize: false,
    });

    const dataSource = await CommandUtils.loadDataSource(dataSourceFile);

    await runner({
      dataSourceFile,
      filePatterns: ['examples/fixtures/*'],
      recreate: false,
      quiet: true,
      runMigration: true,
    });

    await dataSource.initialize();

    const articlesCount = await dataSource.manager.count(Article);
    const usersCount = await dataSource.manager.count(User);

    await dropDatabase(dataSource);
    await dataSource.destroy();

    expect(articlesCount).toBe(2);
    expect(usersCount).toBe(2);
  });
});
