import type { Author, Tag } from '@prisma/client';
import { TagType } from '@prisma/client';
import type { ContentDocument } from '../../types';
import page1 from '../data/pages/page1.json';
import page2 from '../data/pages/page2.json';
import page3 from '../data/pages/page3.json';
import tags from '../data/tags.json';
import { BaseSeeder } from './base';
import { Generator } from './generator';

export class DevSeeder extends BaseSeeder {
  static NUM_RANDOM_CHAPTERS = 50;
  allTags: Tag[] = [];
  allAuthors: Author[] = [];

  generator = new Generator();

  createTopicTags = () =>
    this.db.prisma.tag.createMany({
      data: [...tags.topic.map(value => ({ value, type: TagType.TOPIC }))],
      skipDuplicates: true
    });

  async createTags() {
    await this.createBaseTags();
    await this.createTopicTags();
    this.allTags = await this.db.prisma.tag.findMany();
  }

  async createAuthors() {
    await this.db.prisma.author.createMany({ data: this.generator.generateRandomAuthors() });
    this.allAuthors = await this.db.prisma.author.findMany();
  }

  async seed() {
    await this.clearContent();

    console.log('Creating tags...');
    await this.createTags();

    console.log('Creating authors...');
    await this.createAuthors();

    console.log('Creating homepage components...');
    await this.createHomepageComponents();

    console.log('Creating pages...');
    await this.createPages();

    console.log('Finished');
  }

  async createPages() {
    await this.db.page.create({ ...page1, content: page1.content as ContentDocument });
    await this.db.page.create({ ...page2, content: page2.content as ContentDocument });
    await this.db.page.create({ ...page3, content: page3.content as ContentDocument });

    for (let i = 0; i < DevSeeder.NUM_RANDOM_CHAPTERS; i++) {
      const page = this.generator.generateRandomPage(this.allTags, this.allAuthors);
      await this.db.page.create(page);
    }
  }
}
