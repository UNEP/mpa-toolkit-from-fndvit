import { Queries } from '@mpa/db';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { slugify } from '$lib/utils';
import { db } from '$lib/db';

async function getTagIdBySlug(slug: string) {
  // can't directly query db by slug using prisma
  // so doing the query client-side

  const allTags = await db.prisma.tag.findMany({
    select: { id: true, value: true }
  });

  const tag = allTags.find(t => slugify(t.value) === slug);

  return tag?.id;
}

export const load: PageServerLoad = async ({ locals, params }) => {
  const slug = params.slug.toLowerCase();
  if (slug !== params.slug) throw redirect(301, `/tag/${slug}`);

  const slugId = parseInt(slug);

  const id = !isNaN(slugId) ? slugId : await getTagIdBySlug(slug);

  const throw404 = () => {
    locals.cacheKeys.add('tags');
    throw error(404, 'Page not found');
  };

  if (id == null) throw404();

  const tag = await db.prisma.tag.findUnique({
    where: { id },
    select: {
      ...Queries.tag.select,
      pageTags: {
        where: { page: { draft: false } },
        select: { page: Queries.pageForCollectionCard }
      }
    }
  });

  if (!tag) throw404();

  const pages = tag.pageTags.map(t => t.page);

  pages.sort((a, b) => {
    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  pages.map(p => p.tags.map(t => locals.cacheKeys.add(`tag-${t.tag.id}`)));
  locals.cacheKeys.add('pages');

  return { pages, tag, highlightTagIds: [tag.id] };
};
