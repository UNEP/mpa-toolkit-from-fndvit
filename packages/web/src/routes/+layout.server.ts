import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { checkUserHasRoleForRoute } from '$lib/auth';

export const load: LayoutServerLoad = async ({ url, locals, routeId }) => {
  const hasPerms = checkUserHasRoleForRoute(routeId, locals.user);
  if (!hasPerms) {
    if (locals.user) throw error(400, 'You do not have permission to access this page');
    else {
      const referrer = url.pathname + url.search;
      throw redirect(302, `/cms/login?referrer=${referrer}`);
    }
  }

  return { user: locals.user };
};
