import { Queries } from '@mpa/db';
import { groupBy } from '@mpa/utils';
import type { PageServerLoad } from './$types';
import { db } from '$lib/db';

const NUM_TAGS = 10; //number of tags showed in the serach component

export const load: PageServerLoad = async ({ locals }) => {
  const pages = await db.prisma.page.findMany({
    where: { draft: false },
    ...Queries.pageForContentCard
  });

  const tags = await db.prisma.tag.findMany({
    where: { type: 'TOPIC' },
    ...Queries.countTags,
    orderBy: { pageTags: {_count: 'desc'} }
  });

  const components = await db.homepage.getComponents();

  locals.cacheKeys.add(`pages`);
  locals.cacheKeys.add(`tags`);
  locals.cacheKeys.add(`homepage`);

  const groups = groupBy(pages, p => (p.chapter ? 'chapters' : 'caseStudies'));

  return { chapters: groups.chapters || [], caseStudies: groups.caseStudies || [], tags: tags.slice(0, NUM_TAGS), components };
};
