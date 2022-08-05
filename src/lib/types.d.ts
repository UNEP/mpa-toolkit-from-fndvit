import type { TagCategory, Role, TagType } from '@prisma/client';
import type { CardData } from './components/Cards/Cards.svelte';
import type * as SubTypes from './prisma/queries';
export type * as SubTypes from './prisma/queries';
export type * from '@prisma/client';

export interface Locals {
	userid: string;
}

export interface UserInfo {
  id: number;
  email: string;
  name: string;
}

export type MilestonesData = {
  [year: string]: string[];
}

export type KeyLearningsData = {
  subject: string,
  body: string[]
}

// *******************
// API REQUEST BODIES
// *******************

export type UserRequest = {
  role?: Role;
}

export type AuthorRequest = {
  name?: string;
  bio?: string;
  img?: string;
}

export type PageRequest = {
  title: string;
  draft: boolean;
  slug: string;
  content: ContentDocument;
  img: string;
  tags: {
    id: number,
    category: TagCategory
  }[];
  caseStudy?: SubTypes.CaseStudy.PageHead;
  chapter?: {
    summary: string;
    authors: number[];
    keyTakeaways: string[];
  }
}

export type TagRequest = {
  value: string;
}

// **********************
//  TOP LEVEL COMPONENTS
// **********************

export type HeadingBlock = {
  type: 'heading';
  attrs: {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    showmore: string;
  };
  content: InlineBlock[];
}

export type ParagraphBlock = {
  type: 'paragraph';
  content?: InlineBlock[];
}

export type CardsBlock = {
  type: 'cards';
  attrs: {
    style: 'default' | 'no-heading',
    cards: CardData[];
  }
};

export type ImageBlock = {
  type: 'image';
  attrs: {
    src: string;
    alt?: string;
    title?: string;
    style: 'regular' | 'full';
  };
}

// *******************
//  NESTED COMPONENTS
// *******************

export type Mark = {
  type: 'strong' | 'em' | 'underline';
}

export type TextBlock = {
  type: 'text';
  text: string;
  marks?: Mark[];
}

export type InlineBlock = TextBlock;

export type ContentBlock = HeadingBlock | ParagraphBlock | CardsBlock;

export type ContentDocument = {
  type: 'doc';
  content: ContentBlock[];
}

export type Section = {
  id: string;
  title: string;
  topic: string;
  blocks: ContentBlock[];
};

type UnwrapContent<T> = T extends { content: (infer U)[] } ? U | UnwrapContent<U> : T;

export type Block = UnwrapContent<ContentDocument>;