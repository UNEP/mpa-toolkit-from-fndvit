import { Queries } from '@mpa/db';
import type { PageServerLoad } from './$types';
import { db } from '$lib/db';
import content from './content.json';

export const load: PageServerLoad = async ({ locals, url }) => {
  return {content};
};
