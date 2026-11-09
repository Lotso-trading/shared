import type { z } from "zod";
import type {
  RiskConfigSchema,
  UpdateRiskConfigInputSchema,
  ValidationResultSchema,
} from "../schemas/risk.schema.ts";

export type RiskConfig = z.infer<typeof RiskConfigSchema>;
export type UpdateRiskConfigInput = z.infer<typeof UpdateRiskConfigInputSchema>;
export type ValidationResult = z.infer<typeof ValidationResultSchema>;
