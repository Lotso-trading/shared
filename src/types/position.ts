import type { z } from "zod";
import type { OpenPositionSchema, PositionExitOrderSchema } from "../schemas/position.schema.ts";

export type OpenPosition = z.infer<typeof OpenPositionSchema>;
export type PositionExitOrder = z.infer<typeof PositionExitOrderSchema>;
