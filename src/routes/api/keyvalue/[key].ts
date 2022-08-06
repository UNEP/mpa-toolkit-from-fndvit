import { authMiddleware } from "$lib/auth";
import { updateKeyValue } from "$lib/prisma/wrappers";
import type { KeyValueRequest } from "$lib/types";

export const patch = authMiddleware(
  { role:'ADMIN' },
  async ({ request, params }) => {

    const body = await request.json() as KeyValueRequest;

    const keyValue = await updateKeyValue(params.key, body);

    return {
      status: 200,
      body: keyValue
    };
  }
);
