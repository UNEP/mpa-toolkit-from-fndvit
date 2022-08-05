import { authMiddleware } from '$lib/auth';
import { deleteUser, updateUser } from '$lib/prisma/wrappers';
import type { UserRequest } from '$lib/types';

export const patch = authMiddleware({ role: 'ADMIN' }, async ({ params, request }) => {
  const body = (await request.json()) as UserRequest;
  const user = await updateUser(parseInt(params.id), body);

  return {
    status: 200,
    body: user
  };
});

export const del = authMiddleware({ role: 'ADMIN' }, async ({ params }) => {
  const userId = parseInt(params.id);

  await deleteUser(userId);

  return {
    status: 200
  };
});
