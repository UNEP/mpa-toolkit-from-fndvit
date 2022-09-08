import { groupBy } from '@mpa/utils';
import type { PageServerLoad } from './$types';
import { db } from '$lib/db';

export const load: PageServerLoad = async ({ locals }) => {
  const pages = await db.page.all({ model: 'content-card' });
  const tagsForSearch = await db.tag.searchBarTags();

  const components = await db.homepage.getComponents();

  locals.cacheKeys.add(`pages`);
  locals.cacheKeys.add(`tags`);
  locals.cacheKeys.add(`homepage`);

  const groups = groupBy(pages, p => (p.chapter ? 'chapters' : 'caseStudies'));

  return {
    chapters: groups.chapters || [],
    caseStudies: groups.caseStudies || [],
    tags: tagsForSearch,
    components
  };
};
