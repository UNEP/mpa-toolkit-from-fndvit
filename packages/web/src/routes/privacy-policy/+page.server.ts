import { Queries } from '@mpa/db';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { slugify } from '$lib/utils';
import { db } from '$lib/db';

export const load: PageServerLoad = async ({ locals }) => {
  return {};
};
