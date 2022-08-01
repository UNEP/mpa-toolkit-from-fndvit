import { authMiddleware } from "$lib/auth";
import { updatePageOrdering } from "$lib/prisma/wrappers";
import type { PageOrderingRequest } from "$lib/types";

export const patch = authMiddleware(
  { role:'ADMIN' },
  async ({ request, params }) => {
    const body = await request.json() as PageOrderingRequest;

    const page = await updatePageOrdering(parseInt(params.id), body);

    return {
      status: 200,
      body: page
    };
  }
);
