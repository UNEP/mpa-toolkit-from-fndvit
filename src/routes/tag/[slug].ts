import type { RequestHandler } from "@sveltejs/kit";
import { error404 } from "$lib/errors";
import { prisma } from "$lib/prisma";
import { pageForCollectionCard, tag as tagQuery } from "$lib/prisma/queries";
import { slugify } from "$lib/helpers/utils";

async function getTagIdBySlug(slug: string) {

  // can't directly query db by slug using prisma
  // so doing the query client-side

  const allTags = await prisma.tag.findMany({
    select: { id: true, value: true }
  });

  const tag = allTags.find(t => slugify(t.value) === slug);

  return tag?.id;
}

export const get: RequestHandler<{ slug: string }> = async ({ locals, params }) => {
  const slug = params.slug.toLowerCase();
  if (slug !== params.slug) return { status: 301, redirect: `/tag/${slug}` };

  const slugId = parseInt(slug);

  const id = !isNaN(slugId) ? slugId : await getTagIdBySlug(slug);

  if (id == null) return error404('Page not found');

  const tag = await prisma.tag.findUnique({
    where: { id },
    select: {
      ...tagQuery.select,
      pageTags: {
        where: { page: {draft: false } },
        select: { page: pageForCollectionCard }
      }
    }
  });

  if (!tag) return error404('Page not found');

  const pages = tag.pageTags.map(t => t.page);

  pages.map(p => p.tags.map(t => locals.cacheKeys.add(`tag-${t.tag.id}`)));
  locals.cacheKeys.add('pages');
  locals.cacheKeys.add('authors');

  return pages
    ? { body: { pages, tag } }
    : error404('Page not found');
};
