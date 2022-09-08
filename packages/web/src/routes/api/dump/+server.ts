import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { env } from '$lib/env';

export const GET: RequestHandler = async () => {
  const authors = await db.prisma.author.findMany();
  const tags = await db.prisma.tag.findMany();
  const pages = await db.prisma.page.findMany({
    include: {
      chapter: {
        include: {
          authors: true
        }
      },
      caseStudy: true,
      tags: true
    }
  });
  return json({
    authors,
    tags,
    pages
  });
};

export const POST: RequestHandler = async ({ request }) => {
  if (env.PUBLIC_DB_RESTORE !== 'true') return json({ error: 'Not allowed' }, { status: 403 });

  const data = await request.json();

  await db.prisma.tagsOnPages.deleteMany();
  await db.prisma.tag.deleteMany();
  await db.prisma.author.deleteMany();
  await db.prisma.chapter.deleteMany();
  await db.prisma.caseStudy.deleteMany();
  await db.prisma.search.deleteMany();
  await db.prisma.page.deleteMany();

  await db.prisma.author.createMany({
    data: data.authors
  });
  await db.prisma.tag.createMany({
    data: data.tags
  });
  for (let i = 0; i < data.pages.length; i++) {
    const _page = data.pages[i];
    const page = {
      ..._page,
      tags: _page.tags.map(t => ({ id: t.tagId, category: t.category })),
      caseStudy: !_page.caseStudy ? undefined : _page.caseStudy,
      chapter: !_page.chapter
        ? undefined
        : {
            ..._page.chapter,
            authors: _page.chapter.authors.map(a => a.id)
          }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await db.page.create(page as any, true);
  }

  return json({ status: 'ok' });
};
