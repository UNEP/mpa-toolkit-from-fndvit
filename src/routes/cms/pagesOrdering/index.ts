import { authMiddleware } from "$lib/auth";
import { prisma } from "$lib/prisma";
import { pageOrdering } from "$lib/prisma/queries";

export const get = authMiddleware(
  { role: 'ADMIN' },
  async () => {

    const pages = await prisma.pageOrdering.findMany({
      ...pageOrdering
    });

    return { body: { pages } };
  }
);
