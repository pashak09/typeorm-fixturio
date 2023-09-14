import { FixtureInterface } from 'fixturio';

import { Tag } from '../entity/Tag';

type TagFixtureResultOf = readonly Tag[];

export class TagFixture implements FixtureInterface<TagFixtureResultOf> {
  async install(): Promise<TagFixtureResultOf> {
    return [new Tag('tag_1'), new Tag('tag_2')];
  }
}
