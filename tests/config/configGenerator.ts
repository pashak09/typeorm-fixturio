import { writeFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { cwd } from 'node:process';

type ConfigGeneratorArgs = {
  readonly database: string;
  readonly synchronize: boolean;
};

export async function configGenerator({
  database,
  synchronize,
}: ConfigGeneratorArgs): Promise<string> {
  const migrations = `${resolve(cwd(), 'examples', 'migrations')}${sep}*.ts`;
  const filePath = resolve(
    __dirname,
    `ormconfig.${(Math.random() + 1).toString(36).substring(7)}.ts`
  );

  const content = `import { DataSource } from 'typeorm';
import { ENTITIES } from '../../examples/entity';

export default new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'typeorm',
  database: '${database}',
  synchronize: ${synchronize},
  migrations: ['${migrations}'],
  entities: ENTITIES,
});`;

  await writeFile(filePath, content);

  return filePath;
}
