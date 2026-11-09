import type { z } from "zod";
import type {
  AddTargetInputSchema,
  TargetTraderSchema,
  TargetTraderStatsSchema,
  UpdateTargetInputSchema,
} from "../schemas/target.schema.ts";

export type AddTargetInput = z.infer<typeof AddTargetInputSchema>;
export type UpdateTargetInput = z.infer<typeof UpdateTargetInputSchema>;
export type TargetTraderStats = z.infer<typeof TargetTraderStatsSchema>;
export type TargetTrader = z.infer<typeof TargetTraderSchema>;
