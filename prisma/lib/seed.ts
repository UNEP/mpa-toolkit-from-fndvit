import type { ContentBlock, ContentDocument, PageRequest, ParagraphBlock } from '../../src/lib/types';
import { Tag, TagCategory } from '@prisma/client';
import { Role, TagType } from '@prisma/client';
import content from './data/content.json';
import tags from './data/tags.json';
import milestones from './data/milestones.json';
import { LoremIpsum } from "lorem-ipsum";
import SeedRandom from 'seedrandom';
import { prisma } from '../../src/lib/prisma';
import { groupBy } from '../../src/lib/helpers/utils';
import { createPage } from '../../src/lib/prisma/wrappers';

const FIXED_SEED = 'fixed';
const NUM_RANDOM_CHAPTERS = 20;

const rand = SeedRandom(FIXED_SEED);

const titleLorem = new LoremIpsum({
  seed: FIXED_SEED,
  wordsPerSentence: { min: 10, max: 16 }
});

const headingLorem = new LoremIpsum({
  seed: FIXED_SEED,
  wordsPerSentence: { min: 2, max: 4 }
});

const summaryLorem = new LoremIpsum({
  seed: FIXED_SEED,
  sentencesPerParagraph: { min: 2, max: 2},
  wordsPerSentence: { min: 10, max: 20 }
});

const paragraphLorem = new LoremIpsum({
  seed: FIXED_SEED,
  sentencesPerParagraph: { min: 3, max: 5},
  wordsPerSentence: { min: 10, max: 20 }
});

const randInt = (min: number, max: number) =>
  Math.floor(rand() * (max - min + 1)) + min;

const getRandItem = <T>(items: T[]): T => getXRandItems(items, 1)[0];

function getXRandItems<T>(items: T[], x: number): T[] {
  const _items = [...items];
  const result = [];
  for (let i = 0; i < x; i++) {
    const index = Math.floor(rand() * _items.length);
    result.push(_items[index]);
    _items.splice(index, 1);
  }
  return result;
}

const generateRandomContent = (): ContentDocument => ({
  type: "doc",
  content: new Array(randInt(1, 3)).fill(0).map<ContentBlock[]>(() => ([
    {
      type: "heading",
      attrs: { level: 1, showmore: 'Show more on this topic' },
      content: [ { text: headingLorem.generateSentences(1), type: "text" } ]
    },
    ...new Array(randInt(1, 3)).fill(0).map<ParagraphBlock>(() => ({
      type: "paragraph",
      content: [ { text: paragraphLorem.generateParagraphs(1), type: "text" } ]
    }))
  ])).flat()
});

export async function createTags() {
  await prisma.tag.createMany({
    data: [
      ...tags.stage.map((value, i) => ({id: i, value, type: TagType.STAGE})),
      ...tags.topic.map(value => ({value, type: TagType.TOPIC})),
      ...tags.user.map(value => ({value, type: TagType.USER})),
    ]
  });
}

async function createDevData() {
  const names = [ "Emma Doyle", "Nicolas Smith", "Kirby Heath", "Todd Frey", "Del Robertson" ];

  await prisma.user.createMany({
    data: names.map((name, i) => ({
      email: `user${i}@example.com`,
      name,
      role: Role.CONTENT_MANAGER
    }))
  });

  const users = await prisma.user.findMany();
  const userIds = users.map(user => user.id);

  const allTags = await prisma.tag.findMany();

  await createPage({
    slug: "blue-economy",
    title: "What should MPA managers know about the blue economy and business planning?",
    draft: false,
    img: "img/92a18fa2-b8a3-45ca-8196-0b816644e9d2.jpeg",
    content: content as any as ContentDocument,
    tags: getRandomTagsForContent(allTags),
    chapter: {
      keyTakeaways: [
        summaryLorem.generateSentences(2),
        summaryLorem.generateSentences(2),
        summaryLorem.generateSentences(2),
      ],
      summary: "The blue economy is the use of marine resources for sustainable economic development while improving livelihoods, creating jobs, and protecting and supporting marine ecosystems. Find out how to leverage this for your MPA.",
      authors: [userIds[0]]
    }
  });

  await createPage({
      slug: "raja-ampat-mpa-network-adaptation-strate",
      title: "Adaptation strategies for a changing climate",
      draft: false,
      img: "img/92a18fa2-b8a3-45ca-8196-0b816644e9d2.jpeg",
      content: content as any as ContentDocument,
      tags: getRandomTagsForContent(allTags),
      caseStudy: {
        name: "Raja Ampat MPA Network",
        established: 2008,
        size: 20002,
        governance: "Co-management with the regional public service agency",
        staff: "56 workers",
        budget: "Entrance fees (87–88%) + grants (11–12%):US$1,470,000. The pandemic caused a drastic reduction in 2020/2021.",
        budgetLevel: "Between basic (IDR 13-14 billion ~ US$950,000) and optimal (IDR 30 billion ~ US$2.1 million)",
        lat: -0.23333324,
        long: 130.51666646,
        milestones
      }
  });

  for (let i = 0; i < NUM_RANDOM_CHAPTERS; i++) {
    await createRandomPage(userIds, allTags);
  }
}

export async function seed(dev: boolean) {

  console.log(`Seeding: ${dev ? 'dev' : 'prod'}`);

  const tables = ['search', 'caseStudy', 'chapter', 'tagsOnPages', 'page', 'user', 'tag', 'componetnsonPageOrdering', 'component', 'pageOrdering'];
  for (const table of tables) {
    console.log(`Clearing table "${table}"...`);
    await prisma[table].deleteMany();
  }

  console.log('Creating page components...');
  await createPageComponents();

  console.log('Creating tags...');
  await createTags();

  if (dev) {
    console.log('Creating dev data...');
    await createDevData();
  }

  console.log('Finished');

}

function getRandomTagsForContent(allTags: Tag[]): PageRequest['tags'] {
  const NUM_TAGS = {
    primary: 2,
    secondary: 4,
    topic: 6,
    user: 3
  };
  const tags = groupBy(allTags, t => t.type);
  return [
    ...getXRandItems(tags.STAGE, NUM_TAGS.primary + NUM_TAGS.secondary)
      .map((t, i) => ({
        id: t.id,
        category: i < NUM_TAGS.primary ? TagCategory.PRIMARY : TagCategory.SECONDARY
      })),
    ...getXRandItems(tags.TOPIC, NUM_TAGS.topic).map(t => ({id: t.id, category: TagCategory.PRIMARY})),
    ...getXRandItems(tags.USER, NUM_TAGS.user).map(t => ({id: t.id, category: TagCategory.PRIMARY})),
  ];
}

async function createRandomPage(userIds: number[], allTags: Tag[]) {
  const title = titleLorem.generateSentences(1);
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
  const summary = summaryLorem.generateParagraphs(1);
  const pageType = rand() < 0.2 ? 'case study' : 'chapter';

  await createPage({
    slug, title,
    draft: false,
    img: "img/92a18fa2-b8a3-45ca-8196-0b816644e9d2.jpeg",
    content: generateRandomContent(),
    tags: getRandomTagsForContent(allTags),
    caseStudy: pageType !== 'case study' ? undefined : {
      name: headingLorem.generateSentences(1),
      established: 2000 ,
      size: 100 ,
      governance: "" ,
      staff: "" ,
      budget: "" ,
      budgetLevel: "" ,
      lat: rand() * 180 - 90,
      long: rand() * 360 - 180,
      milestones: {'2000': [titleLorem.generateSentences(1)]}
    },
    chapter: pageType !== 'chapter' ? undefined : {
      summary,
      authors: getXRandItems(userIds, Math.ceil(Math.random() * 2)),
      keyTakeaways: Array(Math.floor(Math.random() * 4)).fill(null).map(() => summaryLorem.generateSentences(2))
    }
  });
}

async function createPageComponents() {
  //create page components
  await prisma.component.createMany({
    data: [
      {
        id: 1,
        name: 'MpaManagementLifecycle',
        icon: 'incomplete_circle',
        component: 'MpaManagementLifecycle',
        display: 'MPA Management Lifecycle',
      },
      {
        id: 2,
        name: 'LandingCarouselChapters',
        icon: 'view_carousel',
        component: 'LandingCarousel',
        display: 'Chapters',
      },
      {
        id: 3,
        name: 'LandingSearchBar',
        icon: 'search',
        component: 'LandingSearchBar',
        display: 'Search Bar',
      },
      {
        id: 4,
        name: 'LandingCarouselCaseStudies',
        icon: 'view_carousel',
        component: 'LandingCarousel',
        display: 'Case Studies',
      },
      {
        id: 5,
        name: 'LandingMadlib',
        icon: 'arrow_drop_down_circle',
        component: 'LandingMadlib',
        display: 'Madlib',
      },
    ]
  });

  //create a page componenet
  await prisma.pageOrdering.create({
    data: {
      name: 'landingPage',
      icon: 'home',
      display: 'Landing Page',
      components: {
        create: [
          {
            componentId: 1,
            position: 0,
          },
          {
            componentId: 2,
            position: 1,
          },
          {
            componentId: 3,
            position: 2,
          },
          {
            componentId: 4,
            position: 3,
          },
          {
            componentId: 5,
            position: 4,
          },
        ]
      }
    }
  });
}