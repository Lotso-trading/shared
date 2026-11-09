import { z } from "zod";
import {
  EthereumAddressSchema,
  NonNegativeNumberSchema,
  PositiveNumberSchema,
  ProbabilityPriceSchema,
  RatioPercentSchema,
  UnixTimestampSchema,
} from "./common.schema.ts";

export const PositionStatusSchema = z.enum(["OPEN", "CLOSED"]);

export const PositionCloseReasonSchema = z.enum([
  "RESOLVED_WIN",
  "RESOLVED_LOSS",
  "WHALE_SELL",
  "MANUAL",
]);

export const OpenPositionSchema = z.object({
  id: z.string().min(1, "L'identifiant de la position est requis"),
  conditionId: z.string().min(1, "L'identifiant de condition est requis"),
  assetAddress: EthereumAddressSchema,
  marketSlug: z.string().min(1, "Le slug du marché est requis"),
  marketQuestion: z.string().min(1, "La question du marché est requise"),
  outcomeLabel: z.string().min(1, "Le libellé de l'issue est requis"),
  endDate: z.string().optional(),
  status: PositionStatusSchema.default("OPEN"),
  closeReason: PositionCloseReasonSchema.optional(),
  settledPayoutUsdc: z.number().optional(),
  realizedPnlUsdc: z.number().optional(),
  closedAt: UnixTimestampSchema.optional(),
  totalShares: PositiveNumberSchema,
  avgEntryPrice: ProbabilityPriceSchema,
  totalInvestedUsdc: PositiveNumberSchema,
  currentMarketPrice: ProbabilityPriceSchema,
  currentMarketValueUsdc: NonNegativeNumberSchema,
  unrealizedPnlUsdc: z.number(),
  unrealizedPnlPercent: z.number(),
  targetAddress: EthereumAddressSchema,
  openedAt: UnixTimestampSchema,
  updatedAt: UnixTimestampSchema,
});

export const PositionExitOrderSchema = z.object({
  positionId: z.string().min(1, "L'identifiant de position est requis"),
  conditionId: z.string().min(1, "L'identifiant de condition est requis"),
  assetAddress: EthereumAddressSchema,
  sharesToSell: PositiveNumberSchema,
  reason: z.enum(["TARGET_SELL", "EMERGENCY", "MANUAL"]),
  targetSoldRatio: RatioPercentSchema,
});
