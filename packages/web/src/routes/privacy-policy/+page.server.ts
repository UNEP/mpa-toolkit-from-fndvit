import { marked } from 'marked';
import type { PageServerLoad } from './$types';
import content from './content.json';
import { html } from './testA.md';


export const load: PageServerLoad = async ({ locals, url }) => {
  const texto = marked.parse('# Marked in Node.js\n\nRendered by **marked**.');
  console.log({texto});
  return {content};
};
