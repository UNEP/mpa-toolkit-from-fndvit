import { authMiddleware } from "$lib/auth";
import { prisma } from "$lib/prisma";
import { pageOrderingComponents } from "$lib/prisma/queries";

export const get = authMiddleware(
  { role: 'ADMIN' },
  async ({params}) => {

    const {id} = params;
    const pageComponents = await prisma.pageOrdering.findUnique({
      ...pageOrderingComponents,
      where: { name: "Landing Page" }
    });

    return { body: { id, pageComponents } };
  }
);