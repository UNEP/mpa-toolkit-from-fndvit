import type { GetSession, Handle, RequestEvent } from '@sveltejs/kit';
import * as cookie from 'cookie';
import { getSessionAndUser } from '$lib/prisma/wrappers';
import env, { checkRequiredEnvVars } from '$lib/env';

checkRequiredEnvVars(env.IS_DEV ? 'DEV_SERVER' : 'SERVER');

const RouteCache: { [routeId: string]: string } = {
  '': 's-maxage=604800, max-age=0', // index/homepage route
  '[slug]': 's-maxage=604800, max-age=0',
  search: 's-maxage=604800, max-age=0',
  'globe.svg': 'max-age=604800'
};

const DEFAULT_CACHE = 'private, max-age=0';

function getCacheControl(event: RequestEvent): string {
  if (!(event.routeId in RouteCache)) {
    console.log('missing cache config for', event.routeId);
  }
  return RouteCache[event.routeId] || DEFAULT_CACHE;
}

interface CacheHeaders {
  'Cache-Control'?: string;
  'Surrogate-Key'?: string;
  'Surrogate-Control'?: string;
}

function getCacheHeaders(event: RequestEvent): CacheHeaders {
  if (event.routeId == null) return {};
  return {
    'Cache-Control': getCacheControl(event),
    'Surrogate-Key': event.locals.cacheKeys.size > 0 ? Array.from(event.locals.cacheKeys).join(' ') : undefined,
    'Surrogate-Control': 'stale-while-revalidate=30, stale-if-error=3600'
  };
}

async function attachUserToRequest(sessionId: string, event: RequestEvent) {
  const session = await getSessionAndUser(sessionId);
  if (session && session.expires >= new Date()) {
    event.locals.user = session.user;
  }
}

export const getSession: GetSession = async event => {
  return event.locals.user ? { user: event.locals.user } : {};
};

export const handle: Handle = async ({ event, resolve }) => {
  const cookies = cookie.parse(event.request.headers.get('Cookie') || '');
  if (cookies.session) {
    await attachUserToRequest(cookies.session, event);
  }

  event.locals.cacheKeys = new Set();
  const response = await resolve(event);
  if (response.ok) {
    const cacheHeaders = getCacheHeaders(event);
    for (const [key, value] of Object.entries(cacheHeaders)) {
      if (value != null) response.headers.set(key, value);
    }
  }
  return response;
};
