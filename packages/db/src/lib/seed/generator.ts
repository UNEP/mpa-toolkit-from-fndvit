import { groupBy, slugify } from '@mpa/utils';
import type { Author, Tag } from '@prisma/client';
import { TagCategory } from '@prisma/client';
import { LoremIpsum } from 'lorem-ipsum';
import SeedRandom from 'seedrandom';
import type { APIRequests, ContentBlock, ContentDocument, ParagraphBlock } from '../../types';

export class Generator {
  static FIXED_SEED = 'fixed';

  private rand = SeedRandom(Generator.FIXED_SEED);

  private titleLorem = new LoremIpsum({
    seed: Generator.FIXED_SEED,
    wordsPerSentence: { min: 10, max: 16 }
  });

  private headingLorem = new LoremIpsum({
    seed: Generator.FIXED_SEED,
    wordsPerSentence: { min: 2, max: 4 }
  });

  private summaryLorem = new LoremIpsum({
    seed: Generator.FIXED_SEED,
    sentencesPerParagraph: { min: 2, max: 2 },
    wordsPerSentence: { min: 10, max: 20 }
  });

  private paragraphLorem = new LoremIpsum({
    seed: Generator.FIXED_SEED,
    sentencesPerParagraph: { min: 3, max: 5 },
    wordsPerSentence: { min: 10, max: 20 }
  });

  private randInt = (min: number, max: number) => Math.floor(this.rand() * (max - min + 1)) + min;

  private getXRandItems<T>(items: T[], x: number): T[] {
    const _items = [...items];
    const result: T[] = [];
    for (let i = 0; i < x; i++) {
      const index = Math.floor(this.rand() * _items.length);
      result.push(_items[index]);
      _items.splice(index, 1);
    }
    return result;
  }

  private generateRandomContent = (): ContentDocument => ({
    type: 'doc',
    content: new Array(this.randInt(1, 3))
      .fill(0)
      .map<ContentBlock[]>(() => [
        {
          type: 'heading',
          attrs: { level: 1, showmore: 'Show more on this topic' },
          content: [{ text: this.headingLorem.generateSentences(1), type: 'text' }]
        },
        ...new Array(this.randInt(1, 3)).fill(0).map<ParagraphBlock>(() => ({
          type: 'paragraph',
          content: [{ text: this.paragraphLorem.generateParagraphs(1), type: 'text' }]
        }))
      ])
      .flat()
  });

  private getRandomAuthorsForContent = (allAuthors: Author[], num: number): number[] => {
    if (num > allAuthors.length) throw new Error('Not enough authors');
    return this.getXRandItems(
      allAuthors.map(a => a.id),
      Math.ceil(Math.random() * num)
    );
  };
  private getRandomTagsForContent(allTags: Tag[]): APIRequests.Page['tags'] {
    const NUM_TAGS = { primary: 2, secondary: 4, topic: 6, user: 3 };
    const tags = groupBy(allTags, t => t.type);
    return [
      ...this.getXRandItems(tags.STAGE!, NUM_TAGS.primary + NUM_TAGS.secondary).map((t, i) => ({
        id: t.id,
        category: i < NUM_TAGS.primary ? TagCategory.PRIMARY : TagCategory.SECONDARY
      })),
      ...this.getXRandItems(tags.TOPIC!, NUM_TAGS.topic).map(t => ({ id: t.id, category: TagCategory.PRIMARY })),
      ...this.getXRandItems(tags.USER!, NUM_TAGS.user).map(t => ({ id: t.id, category: TagCategory.PRIMARY }))
    ];
  }

  generateRandomAuthors() {
    const names = ['Emma Doyle', 'Nicolas Smith', 'Kirby Heath', 'Todd Frey', 'Del Robertson'];
    return names.map(name => ({
      name,
      bio: this.summaryLorem.generateParagraphs(1)
    }));
  }

  generateRandomPage(allTags: Tag[], allAuthors: Author[]): APIRequests.Page {
    const pageType = this.rand() < 0.2 ? 'case study' : 'chapter';
    const title = this.titleLorem.generateSentences(1);

    return {
      slug: slugify(title),
      title,
      draft: true,
      img: '',
      content: this.generateRandomContent(),
      tags: this.getRandomTagsForContent(allTags),
      caseStudy:
        pageType !== 'case study'
          ? undefined
          : {
              name: this.headingLorem.generateSentences(1),
              established: 2000,
              size: 100,
              governance: '',
              staff: '',
              budget: '',
              budgetLevel: '',
              lat: this.rand() * 180 - 90,
              long: this.rand() * 360 - 180,
              milestones: { '2000': [this.titleLorem.generateSentences(1)] },
              keyLearnings: [
                {
                  subject: 'What works',
                  body: [
                    this.titleLorem.generateSentences(1),
                    this.titleLorem.generateSentences(1),
                    this.titleLorem.generateSentences(1)
                  ]
                },
                {
                  subject: "What doesn't work",
                  body: [
                    this.titleLorem.generateSentences(1),
                    this.titleLorem.generateSentences(1),
                    this.titleLorem.generateSentences(1)
                  ]
                }
              ]
            },
      chapter:
        pageType !== 'chapter'
          ? undefined
          : {
              summary: this.summaryLorem.generateParagraphs(1),
              authors: this.getRandomAuthorsForContent(allAuthors, 2),
              keyTakeaways: Array(Math.floor(Math.random() * 4))
                .fill(null)
                .map(() => this.summaryLorem.generateSentences(2))
            }
    };
  }
}
