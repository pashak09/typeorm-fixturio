import { ServiceContainerInterface, InjectDependency } from 'fixturio';
import { DataSource, EntityManager } from 'typeorm';

export class TypeOrmContainer implements ServiceContainerInterface {
  private readonly container: Record<string, EntityManager>;

  constructor(dataSource: DataSource) {
    this.container = { [EntityManager.toString()]: dataSource.manager };
  }

  getService<TInput = unknown, TResult = TInput>(
    typeOrToken: InjectDependency<TInput> | string,
  ): TResult {
    const service = this.container[typeOrToken.toString()];

    if (service === undefined) {
      throw new Error(
        `service ${typeOrToken} is not registered is the base container provided by typeorm-fixturio`,
      );
    }

    return <TResult>service;
  }
}
