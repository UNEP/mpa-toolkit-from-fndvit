import type { ContentDocument, Page, Section } from '@mpa/db';
import { slugify } from '$lib/utils';
import { env } from '$env/dynamic/public';

export const staticUrl = (path: string) => (path ? `${env.PUBLIC_UPLOAD_BASE_URL}${path}` : null);

export function createSections(document: ContentDocument) {
  return document.content.reduce<Section[]>((sections, block, i) => {
    const isSectionHeading = block.type === 'heading' && block.attrs.level === 1;
    if (isSectionHeading || i === 0) {
      sections.push({
        id: isSectionHeading ? `h${sections.length}-${slugify(block.content[0].text)}` : null,
        title: isSectionHeading ? block.content[0].text : null,
        topic: isSectionHeading ? block.attrs.showmore : null,
        blocks: [block]
      });
    } else {
      sections[sections.length - 1].blocks.push(block);
    }
    return sections;
  }, []);
}

export function createEmptyPage(type: 'chapter' | 'caseStudy'): Page {
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
    caseStudy:
      type !== 'caseStudy'
        ? undefined
        : {
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
    chapter:
      type !== 'chapter'
        ? undefined
        : {
            summary: '',
            keyTakeaways: [],
            authors: []
          }
  };
}

export function getPageDisplayTitle(page: { title: string; caseStudy?: { name: string } }) {
  return page.caseStudy ? `${page.caseStudy.name} - ${page.title}` : page.title;
}

export function getPageTypeStr(p: Page): string {
  if (p.caseStudy) {
    const hasMilestones = p.caseStudy.milestones && Object.keys(p.caseStudy.milestones).length;
    return hasMilestones ? 'casestudy-with-milestones' : 'casestudy';
  } else if (p.chapter) return p.chapter.keyTakeaways ? 'chapter-with-key-takeaways' : 'chapter';
  throw new Error(`Unknown page type`);
}
