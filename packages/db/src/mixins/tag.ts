import { publishEvent } from '@mpa/events';
import { slugify } from '@mpa/utils';
import { Queries } from '..';
import type { MpaDatabase } from '../db';
import type { APIRequests, Tag, TagType } from '../types';
import { validate } from '../validation';

export const tagMixin = (db: MpaDatabase) => {
  const all = async (tagType?: TagType): Promise<Tag[]> =>
    tagType ? db.prisma.tag.findMany({ where: { type: tagType } }) : db.prisma.tag.findMany();

  return {
    all,

    searchBarTags: () =>
      db.prisma.tag.findMany({
        ...Queries.tag,
        where: {
          type: 'TOPIC',
          pageTags: { some: { page: { draft: false } } }
        },
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

    allForCms: () =>
      db.prisma.tag.findMany({
        where: { type: 'TOPIC' },
        ...Queries.countTags,
        orderBy: {
          value: 'asc'
        }
      }),

    get: <
      {
        // overloads
        (id: number): Promise<Tag>;
        (slug: string): Promise<Tag>;
        (slugs: string[]): Promise<Tag[]>;
      }
    >(async (val: number | string | string[]) => {
      if (typeof val === 'number') {
        return db.prisma.tag.findUnique({ where: { id: val } });
      } else {
        // can't directly query db by slug using prisma
        // so doing the query clien
        const allTags = await all();
        if (Array.isArray(val)) {
          return allTags.filter(tag => val.includes(slugify(tag.value)));
        } else if (typeof val === 'string') {
          return allTags.find(t => slugify(t.value) === val);
        }
      }
    }),

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
  };
};
