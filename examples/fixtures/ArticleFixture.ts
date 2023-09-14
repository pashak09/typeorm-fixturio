import {
  DependentFixtureInterface,
  FixtureInterface,
  FixtureBucket,
  FixtureDependency,
} from 'fixturio';

import { Article } from '../entity/Article';

import { UserFixture } from './UserFixture';

type ArticleFixtureResultOf = {
  readonly firstArticle: Article;
  readonly secondArticle: Article;
};

export class ArticleFixture
  implements FixtureInterface<ArticleFixtureResultOf>, DependentFixtureInterface
{
  getFixtureDependencies(): readonly FixtureDependency[] {
    return [UserFixture];
  }

  async install(fixtureBucket: FixtureBucket): Promise<ArticleFixtureResultOf> {
    const { firstUser, secondUser } = fixtureBucket.fixtureResultOf(UserFixture);

    const firstArticle = new Article(firstUser, 'hey', new Date('2023-01-02T14:33:48.027Z'));
    const secondArticle = new Article(secondUser, 'hey', new Date('2023-02-02T14:33:48.027Z'));

    return {
      firstArticle,
      secondArticle,
    };
  }
}
