import type { ContentDocument, KeyLearningsData, MilestonesData } from "$lib/types";
import type { ExpandRecursively, Exact, Modify, Expand } from "$lib/helpers/utils";
import { Prisma, TagType } from "@prisma/client";
import clone from "clone";

export const tag = validate<Prisma.TagSelect>()({
  id: true,
  value: true,
  type: true,
});

export const pageTag = validate<Prisma.TagsOnPagesSelect>()({
    tag,
    category: true
});

export const author = validate<Prisma.AuthorSelect>()({
  id: true,
  name: true,
  img: true,
  bio: true
});

export const userSession = validate<Prisma.UserSelect>()({
  id: true,
  email: true,
  name: true,
  role: true
});

export const authorForCMS = validate<Prisma.AuthorSelect>()({
  id: true,
  name: true,
  bio: true,
  img: true,
  chapter: {
    select: { pageId: true }
  }
});

export const chapterForPageHead = validate<Prisma.ChapterSelect>()({
  keyTakeaways: true,
  summary: true,
  authors: author
});

export const caseStudyForPageHead = validate<Prisma.CaseStudySelect>()({
    name: true,
    established: true,
    size: true,
    governance: true,
    staff: true,
    budget: true,
    budgetLevel: true,
    lat: true,
    long: true,
    milestones: true,
    keyLearnings: true
});

export const countTags = validate<Prisma.TagSelect>()({
  id: true,
  value: true,
  type: true,
  _count: {
    select: {
      pageTags: true
    }
  }
});

export const pageFull = validate<Prisma.PageSelect>()({
  id: true,
  slug: true,
  draft: true,
  title: true,
  img: true,
  content: true,
  readTime: true,
  tags: pageTag,
  chapter: chapterForPageHead,
  caseStudy: caseStudyForPageHead
});

export const pageForContentCard = validate<Prisma.PageSelect>()({
  id: true,
  tags: {
    ...pageTag,
    where: { tag: { type: TagType.TOPIC } },
  },
  title: true,
  img: true,
  slug: true,
  chapter: { select: { pageId: true } },
  caseStudy: { select: { pageId: true, name: true } },
});

export const pageForCollectionCard = validate<Prisma.PageSelect>()({
  id: true,
  draft: true,
  title: true,
  slug: true,
  img: true,
  readTime: true,
  tags: {
    ...pageTag,
    where: { tag: { type: TagType.TOPIC } },
  },
  chapter: {
    select: {
      authors: {
        select: { name: true }
      }
    }
  },
  caseStudy: { select: { name: true } },
});


export const pageForCmsList = clone(pageForCollectionCard);
pageForCmsList.select.tags.where = undefined;

export namespace User {
  export type Session = Prisma.UserGetPayload<typeof userSession>;
}

export namespace Author {
  export type ForCMS = Prisma.AuthorGetPayload<typeof authorForCMS>;
}

export namespace Chapter {
  export type PageHead = Prisma.ChapterGetPayload<typeof chapterForPageHead>;
}

export namespace Page {
  export type Full = Modify<
    Prisma.PageGetPayload<typeof pageFull>,
    { caseStudy?: CaseStudy.PageHead, chapter?: Chapter.PageHead, content: ContentDocument}
  >;
  export type CollectionCard =
    Prisma.PageGetPayload<typeof pageForCollectionCard>
    & { rank?: number, highlights?: string};
  export type CmsList = Prisma.PageGetPayload<typeof pageForCmsList>;
  export type ContentCard = Prisma.PageGetPayload<typeof pageForContentCard>;
}

export namespace CaseStudy {
  export type PageHead = Modify<
    Prisma.CaseStudyGetPayload<typeof caseStudyForPageHead>,
    { milestones: MilestonesData, keyLearnings: KeyLearningsData[] }
  >
}

export type PageTag = Prisma.TagsOnPagesGetPayload<typeof pageTag>;

export type Tag = Prisma.TagGetPayload<typeof tag>;
export type Author = Prisma.AuthorGetPayload<typeof author>;

export namespace Tag{
  export type WithPageCount = Prisma.TagGetPayload<typeof countTags>;
}

// ***********************
//   Typescript helpers
// ***********************

type MapToSelect<T> = Expand<{select: T}>;

function validate<V>(): <S>(q: Exact<S, V>) => ExpandRecursively<MapToSelect<S>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return q => ({ select: q }) as any;
}
