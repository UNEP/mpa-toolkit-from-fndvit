import { pageForCollectionCard } from "$lib/prisma/queries";
import { searchPages, searchTags } from "$lib/prisma/wrappers";
import type { RequestHandler } from "@sveltejs/kit";

export const get: RequestHandler<{ slug: string }> = async ({ locals, url }) => {
  const search_text = url.searchParams.get('q');

  const pages = await searchPages(search_text, pageForCollectionCard);
  const tagHighlights = await searchTags(search_text);

  locals.cacheKeys.add('pages');
  locals.cacheKeys.add('tags');
  locals.cacheKeys.add('authors');

  return {
    status: 200,
    body: {
      search: search_text,
      pages,
      tagHighlights
    }
  };
};
