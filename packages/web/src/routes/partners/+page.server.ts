import { marked } from 'marked';
import type { PageServerLoad } from './$types';
import partners from '$lib/about/partners.md?raw';

export const load: PageServerLoad = async () => {
  const content = marked.parse(partners);
  return { content };
};
