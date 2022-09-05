import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/db';

export const load: PageServerLoad = async ({ locals, params: { slug } }) => {
  const page = await db.page.get({ slug, draft: false });
  if (!page) {
    locals.cacheKeys.add('pages');
    throw error(404, 'Page not found');
  }
  const recommendedPages = await db.page.recommended(page);
  locals.cacheKeys.add(`page-${page.id}`);
  page.tags.forEach(tag => locals.cacheKeys.add(`tag-${tag.tag.id}`));
  page.chapter?.authors.forEach(author => locals.cacheKeys.add(`author-${author.id}`));
  return { page, recommendedPages };
};
