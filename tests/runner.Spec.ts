import { rm, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

import { runner } from '@app/runner';
import { configGenerator } from '@tests/config/configGenerator';
import { CommandUtils } from 'typeorm/commands/CommandUtils';
import { checkDatabase, dropDatabase } from 'typeorm-extension';

import { Article } from '../examples/entity/Article';
import { Tag } from '../examples/entity/Tag';
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

  it('should upload fixtures into an existing database', async (): Promise<void> => {
    const dataSourceFile = await configGenerator({
      database: 'test',
      synchronize: true,
    });

    const dataSource = await CommandUtils.loadDataSource(dataSourceFile);

    await dataSource.initialize();

    await runner({
      dataSourceFile,
      filePatterns: ['examples/fixtures/*'],
      recreate: true,
      quiet: true,
      autoPersist: true,
      runMigration: false,
    });

    //since runner close connection recreate it
    await dataSource.initialize();

    const articles = await dataSource.manager.find(Article, { relations: { author: true } });
    const users = await dataSource.manager.find(User);
    const tags = await dataSource.manager.find(Tag);

    await dataSource.destroy();

    expect((await checkDatabase(dataSource)).exists).toBe(true);

    expect(articles).toHaveLength(2);
    expect([
      {
        content: 'hey',
        createdAt: new Date('2023-01-02T14:33:48.027Z'),
        author: {
          name: 'user_1',
        },
      },
      {
        content: 'hey',
        createdAt: new Date('2023-02-02T14:33:48.027Z'),
        author: {
          name: 'user_2',
        },
      },
    ]).toStrictEqual([
      {
        content: articles[0]?.content,
        createdAt: articles[0]?.createdAt,
        author: {
          name: (await articles[0]?.author)?.name,
        },
      },
      {
        content: articles[1]?.content,
        createdAt: articles[1]?.createdAt,
        author: {
          name: (await articles[1]?.author)?.name,
        },
      },
    ]);

    expect(users).toHaveLength(2);
    expect([
      {
        name: 'user_1',
      },
      {
        name: 'user_2',
      },
    ]).toStrictEqual([
      {
        name: users[0]?.name,
      },
      {
        name: users[1]?.name,
      },
    ]);

    expect(tags).toHaveLength(2);
    expect([
      {
        description: 'tag_1',
      },
      {
        description: 'tag_2',
      },
    ]).toStrictEqual([
      {
        description: tags[0]?.description,
      },
      {
        description: tags[1]?.description,
      },
    ]);
  });

  it('should not upload fixtures into an existing database', async (): Promise<void> => {
    const dataSourceFile = await configGenerator({
      database: 'test',
      synchronize: true,
    });

    const dataSource = await CommandUtils.loadDataSource(dataSourceFile);

    await dataSource.initialize();

    await dataSource.manager.query('DELETE FROM article');
    await dataSource.manager.query('DELETE FROM user');
    await dataSource.manager.query('DELETE FROM tag');

    await runner({
      dataSourceFile,
      filePatterns: ['examples/fixtures/*'],
      recreate: true,
      quiet: true,
      runMigration: false,
    });

    await dataSource.initialize();

    const articles = await dataSource.manager.find(Article);
    const users = await dataSource.manager.find(User);
    const tags = await dataSource.manager.find(Tag);

    await dataSource.destroy();

    expect(articles).toHaveLength(0);
    expect(users).toHaveLength(0);
    expect(tags).toHaveLength(0);
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
    const tagsCount = await dataSource.manager.count(Tag);

    await dropDatabase(dataSource);
    await dataSource.destroy();

    expect(articlesCount).toBe(0);
    expect(usersCount).toBe(0);
    expect(tagsCount).toBe(0);
  });
});
