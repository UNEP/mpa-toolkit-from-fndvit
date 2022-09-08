import type { PageServerLoad } from './$types';
import { db } from '$lib/db';

export const load: PageServerLoad = async () => {
  const authors = await db.author.all();
  const allTags = await db.tag.all();
  return { authors, allTags };
};
