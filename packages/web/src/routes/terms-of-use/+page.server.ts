import { marked } from 'marked';
import type { PageServerLoad } from './$types';
import termsOfUse from '$lib/about/termsOfUse.md?raw';

export const load: PageServerLoad = async ({ locals }) => {
  let content = marked.parse(termsOfUse);
  let lastUpdated = content.split("</p>\n").shift();
  content = content.replace(lastUpdated, '').replace("</p>\n", '');
  lastUpdated = lastUpdated.replace("<p>",'');
  return {content, lastUpdated};
};