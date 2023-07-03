import { DependencyInjectable, FixtureInterface, InjectDependency } from 'fixturio';
import { EntityManager } from 'typeorm';

import { User } from '../entity/User';

type UserFixtureResultOf = {
  readonly firstUser: User;
  readonly secondUser: User;
};

export class UserFixture implements FixtureInterface<UserFixtureResultOf>, DependencyInjectable {
  constructor(private readonly entityManager: EntityManager) {}

  getInjectDependencies(): readonly InjectDependency[] {
    return [EntityManager];
  }

  async install(): Promise<UserFixtureResultOf> {
    const firstUser = new User(1, 'user_1');
    const secondUser = new User(2, 'user_2');

    await this.entityManager.save([firstUser, secondUser]);

    return {
      firstUser,
      secondUser,
    };
  }
}
