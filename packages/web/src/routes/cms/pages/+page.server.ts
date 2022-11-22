import type { PageServerLoad } from './$types';
import { db } from '$lib/db';

export const load: PageServerLoad = async () => {
  return {
    pages: await db.page.all.cmsList(),
    allTags: await db.tag.all()
  };
};
