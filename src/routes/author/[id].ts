import type { RequestHandler } from "@sveltejs/kit";
import { error404 } from "$lib/errors";
import { prisma } from "$lib/prisma";
import { author, pageForCollectionCard } from "$lib/prisma/queries";

export const get: RequestHandler<{ id: string }> = async ({ locals, params }) => {
  const id = parseInt(params.id);

  if (isNaN(id)) return error404('Page not found');

  const _author = await prisma.author.findFirst({
    where: { id },
    select: {
      ...author.select,
      chapter: {
        where: {
          page: {
            draft: false,
          }
        },
        select: {
          page: pageForCollectionCard
        }
      }
    }
  });

  if (!_author) return error404('Page not found');

  const pages = _author.chapter.map(c => c.page);
  pages.map(p => p.chapter.authors.map(a => locals.cacheKeys.add(`author-${a.id}`)));
  locals.cacheKeys.add('pages');
  locals.cacheKeys.add('tags');

  return pages
    ? { body: { pages, _author } }
    : error404('Page not found');
};
