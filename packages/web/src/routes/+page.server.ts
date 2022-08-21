import { Queries } from '@mpa/db';
import { groupBy } from '@mpa/utils';
import type { PageServerLoad } from './$types';
import { db } from '$lib/db';

export const load: PageServerLoad = async ({ locals }) => {
  const pages = await db.prisma.page.findMany({
    where: { draft: false },
    ...Queries.pageForContentCard
  });

  const tags = await db.prisma.tag.findMany({
    where: { type: 'TOPIC' },
    ...Queries.tag
  });

  locals.cacheKeys.add(`pages`);
  locals.cacheKeys.add(`tags`);

  const groups = groupBy(pages, p => (p.chapter ? 'chapters' : 'caseStudies'));

  return { chapters: groups.chapters || [], caseStudies: groups.caseStudies || [], tags };
};
