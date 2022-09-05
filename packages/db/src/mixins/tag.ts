import { publishEvent } from '@mpa/events';
import { Queries } from '..';
import type { MpaDatabase } from '../db';
import type { APIRequests } from '../types';
import { validate } from '../validation';

export const tagMixin = (db: MpaDatabase) => ({
  all: () => db.prisma.tag.findMany(),

  searchBarTags: () =>
    db.prisma.tag.findMany({
      where: { type: 'TOPIC' },
      ...Queries.tag,
      orderBy: { pageTags: { _count: 'desc' } },
      take: 10
    }),

  update: async (id: number, tag: APIRequests.Tag) => {
    validate('tag', tag);

    const _typeCheckTag = await db.prisma.tag.findFirst({ where: { id }, select: { type: true } });
    if (!_typeCheckTag) throw new Error(`Tag not found with id ${id}`);
    if (_typeCheckTag.type !== 'TOPIC') throw new Error('Only topic tags can be updated');

    const updateTagQuery = db.prisma.tag.update({ where: { id }, data: { value: tag.value } });
    //update all tag search indexes from all tagsonpages tags

    const createPageSearchIndex = db.prisma
      .$queryRaw`SELECT CAST (create_page_search_index("pageId") AS TEXT) FROM "TagsOnPages" WHERE "tagId" = ${id};`;

    const [_tag] = await db.prisma.$transaction([updateTagQuery, createPageSearchIndex]);

    await publishEvent('tag-updated', { id });

    return _tag;
  },
  delete: async (id: number) => {
    const tag = await db.prisma.tag.findFirst({ where: { id } });
    if (!tag) throw new Error(`Tag not found with id ${id}`);
    if (tag.type !== 'TOPIC') throw new Error('Only topic tags can be deleted');
    const cascade = db.prisma.tagsOnPages.deleteMany({ where: { tagId: id } });
    const deleteTag = db.prisma.tag.delete({ where: { id } });
    await db.prisma.$transaction([cascade, deleteTag]);
    await publishEvent('tag-deleted', { id });
    return true;
  },
  create: async (tag: APIRequests.Tag) => {
    validate('tag', tag);
    const createTagQuery = db.prisma.tag.create({ data: { value: tag.value, type: 'TOPIC' } });
    const [_tag] = await db.prisma.$transaction([createTagQuery]);
    await publishEvent('tag-created', { id: _tag.id });
    return _tag;
  },
  search: async (searchText: string) => {
    const results: { tagId: number; highlight: string }[] = await db.prisma
      .$queryRaw`SELECT * FROM tag_highlights(${searchText})`;
    const o = Object.fromEntries(results.map(r => [r.tagId, r.highlight])) as { [tagId: number]: string };
    return o;
  }
});
