import { authMiddleware } from "$lib/auth";
import { prisma } from "$lib/prisma";
import { pageComponentsOrder } from "$lib/prisma/queries";

export const get = authMiddleware(
  { role: 'ADMIN' },
  async () => {

    const componentsOrder = await prisma.keyValue.findUnique({
      ...pageComponentsOrder,
      where: { key: 'landingPage' }
    });

    return { body: { componentsOrder } };
  }
);