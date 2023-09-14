import { FixtureInterface } from 'fixturio';

import { User } from '../entity/User';

type UserFixtureResultOf = {
  readonly firstUser: User;
  readonly secondUser: User;
};

export class UserFixture implements FixtureInterface<UserFixtureResultOf> {
  async install(): Promise<UserFixtureResultOf> {
    const firstUser = new User('user_1');
    const secondUser = new User('user_2');

    return {
      firstUser,
      secondUser,
    };
  }
}
