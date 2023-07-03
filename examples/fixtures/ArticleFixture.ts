import {
  DependentFixtureInterface,
  FixtureInterface,
  FixtureBucket,
  DependencyInjectable,
  FixtureDependency,
  InjectDependency,
} from 'fixturio';
import { EntityManager } from 'typeorm';

import { Article } from '../entity/Article';

import { UserFixture } from './UserFixture';

type ArticleFixtureResultOf = {
  readonly firstArticle: Article;
  readonly secondArticle: Article;
};

export class ArticleFixture
  implements
    FixtureInterface<ArticleFixtureResultOf>,
    DependentFixtureInterface,
    DependencyInjectable
{
  constructor(private readonly entityManager: EntityManager) {}

  getInjectDependencies(): readonly InjectDependency[] {
    return [EntityManager];
  }

  getFixtureDependencies(): readonly FixtureDependency[] {
    return [UserFixture];
  }

  async install(fixtureBucket: FixtureBucket): Promise<ArticleFixtureResultOf> {
    const { firstUser, secondUser } = fixtureBucket.fixtureResultOf(UserFixture);

    const firstArticle = new Article(1, firstUser, 'hey', new Date('2023-01-02T14:33:48.027Z'));
    const secondArticle = new Article(2, secondUser, 'hey', new Date('2023-02-02T14:33:48.027Z'));

    await this.entityManager.save([firstArticle, secondArticle]);

    return {
      firstArticle,
      secondArticle,
    };
  }
}
