import type { AuthorRequest } from "$lib/types";
import { authMiddleware } from "$lib/auth";
import { createAuthor } from "$lib/prisma/wrappers";

export const put = authMiddleware(
  { role:'CONTENT_MANAGER' },
  async ({ request }) => {

    const body = await request.json() as AuthorRequest;

    const author = await createAuthor(body);

    return {
      status: 200,
      body: author
    };

  }
);
