import type { ContentBlock, ContentDocument, Page, Section, DiagramData } from '@mpa/db';
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

export function createEmptyDiagram(): DiagramData {
  return {
    layers: [
      {
        card: { heading: 'Layer 1', body: 'This is the first layer' },
        image: { mobile: null, desktop: null }
      },
      {
        card: { heading: 'Layer 2', body: 'This is the second layer' },
        image: { mobile: null, desktop: null }
      }
    ],
    resources: [],
    baselayer: { desktop: null, mobile: null },
    caption: { title: 'Caption', body: 'Description' }
  };
}

export function getSectionSize(section: Section): number {
  // size = a proxy for visual size for inserting dynamic content
  return section.blocks.map(getBlockSize).reduce((a, b) => a + b, 0);
}

export function getBlockSize(b: ContentBlock): number {
  if (b.type === 'paragraph') {
    return b.content?.reduce((agg, c) => agg + c.text.length, 0);
  }
  // TODO: return est sizes of other block types
  return 0;
}
