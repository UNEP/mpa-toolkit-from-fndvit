import type { PageServerLoad } from './$types';
import { db } from '$lib/db';

export const load: PageServerLoad = async ({ locals: { cacheKeys } }) => {
  const tagsForSearch = await db.tag.searchBarTags();

  const components = await db.homepage.getComponents();

  cacheKeys.add(`pages`);
  cacheKeys.add(`tags`);
  cacheKeys.add(`homepage`);
  

  return {
    tags: tagsForSearch,
    components
  };
};
