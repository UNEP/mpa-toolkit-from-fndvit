/* eslint import/no-duplicates: 0 */
import type { Role, TagCategory, Prisma } from '@prisma/client';
import type * as DBTypes from '@prisma/client';
export { Role, TagCategory, TagType } from '@prisma/client';
import type { Modify } from '@mpa/utils';
import type * as queries from './queries';

// type Prisma = DBTypes.Prisma;

// ************************
//   Extended model types
// ************************

export namespace User {
  export type Session = Prisma.UserGetPayload<typeof queries.userSession>;
  export type DB = DBTypes.User;
}

export namespace Author {
  export type Full = Prisma.AuthorGetPayload<typeof queries.author>;
  export type ForCMS = Prisma.AuthorGetPayload<typeof queries.authorForCMS>;
  export type DB = DBTypes.Author;
}

export namespace Chapter {
  export type PageHead = Prisma.ChapterGetPayload<typeof queries.chapterForPageHead>;
  export type DB = DBTypes.Chapter;
}

export namespace Page {
  export type Full = Modify<
    Prisma.PageGetPayload<typeof queries.pageFull>,
    { caseStudy?: CaseStudy.PageHead; chapter?: Chapter.PageHead; content: ContentDocument }
  >;
  export type CollectionCard = Prisma.PageGetPayload<typeof queries.pageForCollectionCard> & {
    rank?: number;
    highlights?: string;
  };
  export type CmsList = Prisma.PageGetPayload<typeof queries.pageForCmsList>;
  export type ContentCard = Prisma.PageGetPayload<typeof queries.pageForContentCard>;
  export type DB = DBTypes.Page;
}

export namespace CaseStudy {
  export type PageHead = Modify<
    Prisma.CaseStudyGetPayload<typeof queries.caseStudyForPageHead>,
    { milestones: MilestonesData; keyLearnings: KeyLearningsData[] }
  >;
  export type DB = DBTypes.CaseStudy;
}

export namespace PageTag {
  export type Full = Prisma.TagsOnPagesGetPayload<typeof queries.pageTag>;
  export type DB = DBTypes.TagsOnPages;
}

export namespace Session {
  export type Full = Prisma.SessionGetPayload<typeof queries.session>;
  export type DB = DBTypes.Session;
}

export namespace Tag {
  export type Full = Prisma.TagGetPayload<typeof queries.tag>;
  export type WithPageCount = Prisma.TagGetPayload<typeof queries.countTags>;
  export type DB = DBTypes.Tag;
}

// ***********************
//   Default model types
// ***********************

export type Tag = Tag.Full;
export type Author = Author.Full;
export type Session = Session.Full;
export type PageTag = PageTag.Full;
export type Page = Page.Full;
export type CaseStudy = CaseStudy.PageHead;
export type Chapter = Chapter.PageHead;
export type User = User.Session;

// ***********************
//   Content data types
// ***********************

export type MilestonesData = {
  [year: string]: string[];
};

export type KeyLearningsData = {
  subject: string;
  body: string[];
};

export type CardData = {
  heading: string;
  body: string;
};

export type HomepageComponentName = 'lifecycle' | 'chapters' | 'search' | 'madlib' | 'casestudies';

export type HomepageComponents = HomepageComponentName[];

export type DiagramImage = {
  mobile: string;
  desktop: string;
};

export type DiagramLayer = {
  image: DiagramImage;
  card: CardData;
};

export type DiagramResource = {
  label: string;
  url: string;
};

export type DiagramData = {
  baselayer: DiagramImage;
  layers: DiagramLayer[];
  caption: {
    title: string;
    body: string;
  };
  resources: DiagramResource[];
};

// ***********************
//   API request bodies
// ***********************

export namespace APIRequests {
  export type User = {
    name?: string;
    role?: Role;
  };

  export type Author = {
    name?: string;
    bio?: string;
    img?: string;
  };

  export type Page = {
    title: string;
    draft: boolean;
    slug: string;
    content: ContentDocument;
    img: string;
    tags: {
      id: number;
      category: TagCategory;
    }[];
    caseStudy?: CaseStudy.PageHead;
    chapter?: {
      summary: string;
      authors: number[];
      keyTakeaways: string[];
    };
  };

  export type Tag = {
    value: string;
  };

  export type HomepageComponents = HomepageComponentName[];
}

// **************************
//    Top level components
// **************************

export type HeadingBlock = {
  type: 'heading';
  attrs: {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    showmore: string;
  };
  content: InlineBlock[];
};

export type ParagraphBlock = {
  type: 'paragraph';
  content?: InlineBlock[];
};

export type CardsBlock = {
  type: 'cards';
  attrs: {
    style: 'default' | 'no-heading';
    cards: CardData[];
  };
};

export type DiagramBlock = {
  type: 'diagram';
  attrs: DiagramData;
};

export type ImageBlock = {
  type: 'image';
  attrs: {
    src: string;
    alt?: string;
    title?: string;
    style: 'regular' | 'full';
  };
};

export type ListItemBlock = {
  type: 'list_item';
  content?: [ParagraphBlock, ...ContentBlock[]];
};

export type BulletListBlock = {
  type: 'bullet_list';
  content: ListItemBlock[];
};

export type OrderedListBlock = {
  type: 'ordered_list';
  content: ListItemBlock[];
};

export type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | CardsBlock
  | BulletListBlock
  | OrderedListBlock
  | ImageBlock
  | DiagramBlock;

// ***********************
//          Marks
// ***********************

export type LinkMark = {
  type: 'link';
  attrs: {
    href: string;
    title?: string;
  };
};

export type GenericMark = {
  type: 'strong' | 'em';
};

export type Mark = LinkMark | GenericMark;

// ***********************
//    Nested Components
// ***********************

export type TextBlock = {
  type: 'text';
  text: string;
  marks?: Mark[];
};

export type InlineBlock = TextBlock;

export type ContentDocument = {
  type: 'doc';
  content: ContentBlock[];
};

export type Section = {
  id: string;
  title: string;
  topic: string;
  blocks: ContentBlock[];
};

type UnwrapContent<T> = T extends { content: (infer U)[] } ? U | UnwrapContent<U> : T;

export type Block = UnwrapContent<ContentDocument>;
