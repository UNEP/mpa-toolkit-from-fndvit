import { authMiddleware } from "$lib/auth";
import { prisma } from "$lib/prisma";
import { authorForCMS } from "$lib/prisma/queries";

export const get = authMiddleware(
  { role: 'CONTENT_MANAGER' },
  async () => {
    return {
      body: {
        authors: await prisma.author.findMany({
          ...authorForCMS,
          orderBy: [
            { name: 'desc' },
            { id: 'asc'}
          ]
        })
      }
    };
  });
