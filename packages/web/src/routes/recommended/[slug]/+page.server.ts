import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/db';

export const load: PageServerLoad = async ({ locals, params }) => {
  const slug = params.slug.toLowerCase();

  if (slug !== params.slug) throw redirect(301, `/recommended/${slug}`);

  const tags = await db.tag.get(slug.split('+'));
  const ids = tags.map(t => t.id);

  if (ids.length === 0) {
    locals.cacheKeys.add('tags');
    throw error(404, 'Tag not found');
  }

  const unorderedPages = await db.page.collection({ tags: ids });

  const pages = unorderedPages
    .map(page => ({
      numTags: page.tags.filter(t => ids.includes(t.tag.id)).length,
      page
    }))
    .sort((a, b) => {
      if (a.numTags > b.numTags) return -1;
      else if (a.numTags < b.numTags) return 1;
      return a.page.createdAt.getTime() - b.page.createdAt.getTime();
    })
    .map(p => p.page);

  pages.map(p => p.tags.map(t => locals.cacheKeys.add(`tag-${t.tag.id}`)));
  locals.cacheKeys.add('pages');

  return { pages, highlightTagIds: ids };
};
