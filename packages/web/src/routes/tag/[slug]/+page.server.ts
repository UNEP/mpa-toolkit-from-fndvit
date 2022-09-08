import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/db';

export const load: PageServerLoad = async ({ locals, params }) => {
  const slug = params.slug.toLowerCase();
  if (slug !== params.slug) throw redirect(301, `/tag/${slug}`);

  const tag = await db.tag.get(slug);
  if (!tag) {
    locals.cacheKeys.add('tags');
    throw error(404, 'Page not found');
  }

  const pages = await db.page.getByTag(tag.id, 'collection');

  pages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  pages.flatMap(p => p.tags).forEach(t => locals.cacheKeys.add(`tag-${t.tag.id}`));

  locals.cacheKeys.add('pages');

  return { pages, tag, highlightTagIds: [tag.id] };
};
