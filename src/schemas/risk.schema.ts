import { z } from "zod";
import { PositiveNumberSchema } from "./common.schema.ts";

export const RiskConfigSchema = z
  .object({
    balancePercentPerTrade: z
      .number()
      .min(0.001, "Le pourcentage de solde par trade doit être d'au moins 0.1% (0.001)")
      .max(0.2, "Le pourcentage de solde par trade ne peut pas dépasser 20% (0.20) par sécurité"),
    maxSlippagePercent: z
      .number()
      .min(0.1, "Le slippage maximum doit être d'au moins 0.1%")
      .max(10.0, "Le slippage maximum ne peut pas dépasser 10.0%"),
    maxCapPerTradeUsdc: PositiveNumberSchema,
    maxExposurePerMarketUsdc: PositiveNumberSchema.default(150.0),
    maxExposurePerTargetUsdc: PositiveNumberSchema.default(300.0),
    minCashReserveUsdc: PositiveNumberSchema.default(5.0),
    minPrice: z
      .number()
      .min(0.01, "La cote minimale doit être au moins de 0.01 (1%)")
      .max(0.5, "La cote minimale ne peut pas dépasser 0.50"),
    maxPrice: z
      .number()
      .min(0.5, "La cote maximale doit être au moins de 0.50")
      .max(0.99, "La cote maximale ne peut pas dépasser 0.99 (99%)"),
    copySellOrders: z.boolean(),
    dryRun: z.boolean(),
    maxAllocatedCapitalUsdc: z
      .number()
      .min(0, "Le capital alloué doit être positif ou nul")
      .default(0),
    profitReinvestmentPercent: z
      .number()
      .min(0, "Le pourcentage de réinvestissement doit être entre 0% et 100%")
      .max(100, "Le pourcentage de réinvestissement ne peut pas dépasser 100%")
      .default(50.0),
    isBotRunning: z.boolean().default(true),
    isBotOnline: z.boolean().default(false),
  })
  .refine((data) => data.minPrice < data.maxPrice, {
    message:
      "La cote minimale (minPrice) doit être strictement inférieure à la cote maximale (maxPrice)",
    path: ["minPrice"],
  });

export const UpdateRiskConfigInputSchema = z
  .object({
    balancePercentPerTrade: z.number().min(0.001).max(0.2).optional(),
    maxSlippagePercent: z.number().min(0.1).max(10.0).optional(),
    maxCapPerTradeUsdc: PositiveNumberSchema.optional(),
    maxExposurePerMarketUsdc: PositiveNumberSchema.optional(),
    maxExposurePerTargetUsdc: PositiveNumberSchema.optional(),
    minCashReserveUsdc: PositiveNumberSchema.optional(),
    minPrice: z.number().min(0.01).max(0.5).optional(),
    maxPrice: z.number().min(0.5).max(0.99).optional(),
    copySellOrders: z.boolean().optional(),
    dryRun: z.boolean().optional(),
    maxAllocatedCapitalUsdc: z.number().min(0).optional(),
    profitReinvestmentPercent: z.number().min(0).max(100).optional(),
    isBotRunning: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.minPrice !== undefined && data.maxPrice !== undefined) {
        return data.minPrice < data.maxPrice;
      }
      return true;
    },
    {
      message:
        "La cote minimale (minPrice) doit être strictement inférieure à la cote maximale (maxPrice)",
      path: ["minPrice"],
    }
  );

export const ValidationResultSchema = z.discriminatedUnion("isValid", [
  z.object({
    isValid: z.literal(true),
    approvedSizeUsdc: PositiveNumberSchema,
  }),
  z.object({
    isValid: z.literal(false),
    reason: z.string().min(1, "Le motif du rejet est obligatoire"),
  }),
]);
