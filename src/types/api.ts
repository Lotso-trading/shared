import type { z } from "zod";
import type { ApiErrorResponseSchema, PaginationQuerySchema } from "../schemas/api.schema.ts";

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;

export interface ApiSuccessResponse<T> {
  readonly success: true;
  readonly data: T;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
