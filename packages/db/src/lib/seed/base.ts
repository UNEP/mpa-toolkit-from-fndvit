import { TagType } from '@prisma/client';
import type { MpaDatabase } from '../../db';
import tags from '../data/tags.json';

export class BaseSeeder {
  db: MpaDatabase;

  constructor(db: MpaDatabase) {
    this.db = db;
  }

  async clearContent() {
    const tables = ['search', 'caseStudy', 'chapter', 'tagsOnPages', 'page', 'tag', 'author', 'keyValue'];
    for (const table of tables) {
      console.log(`Clearing table "${table}"...`);
      await this.db.prisma[table].deleteMany();
    }
  }

  createBaseTags = () =>
    this.db.prisma.tag.createMany({
      data: [
        ...tags.stage.map((value, i) => ({ id: i, value, type: TagType.STAGE })),
        ...tags.user.map(value => ({ value, type: TagType.USER }))
      ],
      skipDuplicates: true
    });

  createHomepageComponents = () =>
    this.db.homepage.updateComponents(['lifecycle', 'chapters', 'search', 'madlib', 'casestudies']);
}
