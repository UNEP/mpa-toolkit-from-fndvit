import type { ContentDocument, Section, SubTypes } from "../types";
import { slugify } from "./utils";

export const staticUrl = (path: string, fallback = '') =>
  path ? `${import.meta.env.VITE_UPLOAD_BASE_URL}${path}` : fallback;

export function createSections(document: ContentDocument) {
  return document.content.reduce<Section[]>((sections, block, i) => {
    const isHeading = block.type === 'heading';
    if (isHeading || i === 0) {
      sections.push({
        id: isHeading
          ? `h${sections.length}-${slugify(block.content[0].text)}`
          : null,
        title: isHeading ? block.content[0].text : null,
        topic: isHeading ? block.attrs.showmore : null,
        blocks: [block]
      });
    } else {
      sections[sections.length - 1].blocks.push(block);
    }
    return sections;
  }, []);
}

export function createEmptyPage(type: 'chapter' | 'caseStudy'): SubTypes.Page.Full {
  return {
    id: null,
    title: '',
    slug: '',
    img: '',
    content: null,
    draft: true,
    tags: [],
    // editedAt: null,
    // createdAt: null,
    readTime: null,
    caseStudy: type !== 'caseStudy' ? undefined : {
      name: '',
      established: null,
      size: null,
      governance: '',
      staff: '',
      budget: '',
      budgetLevel: '',
      lat: -90,
      long: 0,
      milestones: {},
      keyLearnings: []
    },
    chapter: type !== 'chapter' ? undefined : {
      summary: '',
      keyTakeaways: [],
      authors: []
    },
  };
}

export function getPageDisplayTitle(page: {title: string, caseStudy?: { name: string } }) {
  return page.caseStudy ? `${page.caseStudy.name} - ${page.title}` :  page.title;
}

export function getPageTypeStr (p: SubTypes.Page.Full): string {
  if (p.caseStudy) {
    const hasMilestones = p.caseStudy.milestones && Object.keys(p.caseStudy.milestones).length;
    return hasMilestones ? "casestudy-with-milestones" : "casestudy";
  }
  else if (p.chapter) p.chapter.keyTakeaways ? "chapter-with-key-takeaways" : "chapter";
};
