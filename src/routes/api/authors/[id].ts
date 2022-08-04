import { authMiddleware } from "$lib/auth";
import { deleteAuthor, updateAuthor } from "$lib/prisma/wrappers";
import type { AuthorRequest } from "$lib/types";

export const patch = authMiddleware(
  { role:'CONTENT_MANAGER' },
  async ({ request, params }) => {

    const body = await request.json() as AuthorRequest;

    const author = await updateAuthor(parseInt(params.id), body);

    return {
      status: 200,
      body: author
    };

  }
);

export const del = authMiddleware(
  { role:'CONTENT_MANAGER' },
  async ({ params }) => {

    await deleteAuthor(parseInt(params.id));

    return {
      status: 200
    };
  }
);
