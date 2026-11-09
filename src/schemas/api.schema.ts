import { z } from "zod";
import { EthereumAddressSchema } from "./common.schema.ts";
import { TradeSideSchema, TradeStatusSchema } from "./trade.schema.ts";

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1, "La page doit être >= 1").default(1),
  limit: z.coerce.number().int().min(1).max(100, "La limite maximale est de 100").default(20),
  status: TradeStatusSchema.optional(),
  targetAddress: EthereumAddressSchema.optional(),
  side: TradeSideSchema.optional(),
});

export const ApiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string().min(1),
    message: z.string().min(1),
    details: z.unknown().optional(),
  }),
});
