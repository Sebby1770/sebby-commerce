import { ZodError, type ZodSchema } from "zod";

export function jsonError(message: string, status = 400, details?: unknown) {
  return Response.json({ error: message, details }, { status });
}

export async function parseBody<T>(
  request: Request,
  schema: ZodSchema<T>
): Promise<T | Response> {
  try {
    const json = await request.json();
    return schema.parse(json);
  } catch (error) {
    if (error instanceof ZodError) {
      return jsonError("Invalid request body.", 422, error.flatten());
    }

    return jsonError("Invalid JSON body.", 400);
  }
}
