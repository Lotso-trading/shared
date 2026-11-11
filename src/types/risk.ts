import type { z } from "zod";
import type {
  RiskConfigSchema,
  UpdateRiskConfigInputSchema,
  ValidationResultSchema,
  WalletAdjustmentInputSchema,
  WalletDepositInputSchema,
  WalletWithdrawInputSchema,
} from "../schemas/risk.schema.ts";

export type RiskConfig = z.infer<typeof RiskConfigSchema>;
export type UpdateRiskConfigInput = z.infer<typeof UpdateRiskConfigInputSchema>;
export type ValidationResult = z.infer<typeof ValidationResultSchema>;
export type WalletAdjustmentInput = z.infer<typeof WalletAdjustmentInputSchema>;
export type WalletDepositInput = z.infer<typeof WalletDepositInputSchema>;
export type WalletWithdrawInput = z.infer<typeof WalletWithdrawInputSchema>;
