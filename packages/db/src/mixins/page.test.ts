import { getEnvFromFile } from '@mpa/env';
import { beforeAll, describe, expect, test } from 'vitest';
import type { Tag } from '..';
import { MpaDatabase } from '..';

const env = getEnvFromFile('test', { DATABASE_URL: true });

const db = new MpaDatabase(env.DATABASE_URL);

describe('db.page', () => {
  let tags: Tag[];

  beforeAll(async () => {
    await db.prisma.tagsOnPages.deleteMany();
    await db.prisma.tag.deleteMany();
    await db.prisma.search.deleteMany();
    await db.prisma.caseStudy.deleteMany();
    await db.prisma.chapter.deleteMany();
    await db.prisma.page.deleteMany();
    tags = [
      await db.tag.create({ value: 'tag1' }),
      await db.tag.create({ value: 'tag2' }),
      await db.tag.create({ value: 'tag3' })
    ];
    await db.page.create({
      ...generateEmptyPage('caseStudy'),
      tags: [{ id: tags[0].id, category: 'PRIMARY' }],
      slug: 'a',
      draft: true
    });
    await db.page.create({
      ...generateEmptyPage('chapter'),
      slug: 'b',
      tags: [{ id: tags[1].id, category: 'PRIMARY' }],
      draft: true
    });
    await db.page.create({
      ...generateEmptyPage('caseStudy'),
      tags: [
        { id: tags[1].id, category: 'PRIMARY' },
        { id: tags[2].id, category: 'PRIMARY' }
      ],
      slug: 'c',
      draft: false
    });
    await db.page.create({
      ...generateEmptyPage('caseStudy'),
      tags: [{ id: tags[2].id, category: 'PRIMARY' }],
      slug: 'd',
      draft: false
    });
  });

  test("all('content-card')", async () => {
    const pages = await db.page.all({ model: 'content-card' });
    expect(pages.length).toBe(2);
    const slugs = pages.map(p => p.slug);
    expect(slugs).toContain('c');
    expect(slugs).toContain('d');
  });

  test("all('cms-list')", async () => {
    const pages = await db.page.all({ model: 'cms-list' });
    expect(pages.length).toBe(4);
  });

  test('collection', async () => {
    const c1 = await db.page.collection({ tag: tags[0].id });
    expect(c1.length).toBe(0);
    const c2 = await db.page.collection({ tag: tags[1].id });
    expect(c2.length).toBe(1);
    const c3 = await db.page.collection({ tag: tags[2].id });
    expect(c3.length).toBe(2);
    const c4 = await db.page.collection({ tags: [tags[0].id, tags[1].id, tags[2].id] });
    expect(c4.length).toBe(2);
  });

  test('get', async () => {
    const g = await db.page.get({ slug: 'a' });
    expect(g.slug).toBe('a');
  });

  test('getByTag', async () => {
    const g1 = await db.page.getByTag(tags[0].id, 'collection');
    expect(g1.length).toBe(0);
    const g2 = await db.page.getByTag(tags[1].id, 'collection');
    expect(g2.length).toBe(1);
    const g3 = await db.page.getByTag(tags[2].id, 'collection');
    expect(g3.length).toBe(2);
  });

  test('recommend', async () => {
    const p1 = await db.page.get({ slug: 'a' });
    const g1 = await db.page.recommended(p1);
    expect(g1.length).toBe(0);

    const p2 = await db.page.get({ slug: 'c' });
    const g2 = await db.page.recommended(p2);
    expect(g2.length).toBe(1);
  });
});

function generateEmptyPage(type: 'chapter' | 'caseStudy') {
  return {
    title: '',
    slug: '',
    img: '',
    content: { type: 'doc' as const, content: [] },
    tags: [],
    caseStudy:
      type !== 'caseStudy'
        ? undefined
        : {
            name: '',
            established: null,
            size: null,
            governance: '',
            staff: '',
            budget: '',
            budgetLevel: '',
            lat: -90,
            long: 0,
            milestones: {},
            keyLearnings: []
          },
    chapter:
      type !== 'chapter'
        ? undefined
        : {
            summary: '',
            keyTakeaways: [],
            authors: []
          }
  };
}
