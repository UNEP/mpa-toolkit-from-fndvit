import { authMiddleware } from "$lib/auth";
import { prisma } from "$lib/prisma";
import { deleteUser } from "$lib/prisma/wrappers";
import { validate } from "$lib/schema/validation";
import type { UserRequest } from "$lib/types";

export const patch = authMiddleware(
  {role:'ADMIN'},
  async ({ params, request }) => {

  const body = await request.json() as UserRequest;
  
  validate('user', body);

  try {
    const user = await prisma.user.update({
      where: { id: parseInt(params.id), },
      data: body
    });
    return {
      status: 200,
      body: { user }
    };
  } catch (e) {
    return {
      status: 500
    };
  }
})

export const del = authMiddleware(
  { role:'ADMIN' },
  async ({ params }) => {
   
    const userId = parseInt(params.id);

    await deleteUser(userId);

    return {
      status: 200
    };
  }

);
