import { z } from "zod";
import {
  EthereumAddressSchema,
  NonNegativeNumberSchema,
  PositiveNumberSchema,
  RatioPercentSchema,
  UnixTimestampSchema,
} from "./common.schema.ts";

export const AddTargetInputSchema = z.object({
  address: EthereumAddressSchema,
  proxyAddress: EthereumAddressSchema.optional(),
  username: z.string().trim().max(100).optional(),
  alias: z.string().trim().min(1, "L'alias du trader est requis").max(50),
  enabled: z.boolean().default(true),
  maxUsdcPerTrade: PositiveNumberSchema.optional(),
  weightMultiplier: z.number().min(0.01).max(10.0).default(1.0),
});

export const UpdateTargetInputSchema = z.object({
  alias: z.string().trim().min(1).max(50).optional(),
  proxyAddress: EthereumAddressSchema.optional(),
  username: z.string().trim().max(100).optional(),
  enabled: z.boolean().optional(),
  maxUsdcPerTrade: PositiveNumberSchema.nullable().optional(),
  weightMultiplier: z.number().min(0.01).max(10.0).optional(),
});

export const TargetTraderStatsSchema = z.object({
  totalCopiedTrades: NonNegativeNumberSchema,
  totalCopiedVolumeUsdc: NonNegativeNumberSchema,
  realizedPnlUsdc: z.number(),
  winRatePercent: RatioPercentSchema,
});

export const TargetTraderSchema = z.object({
  id: z.string().min(1, "L'identifiant est requis"),
  address: EthereumAddressSchema,
  proxyAddress: EthereumAddressSchema.optional(),
  username: z.string().optional(),
  alias: z.string().min(1),
  enabled: z.boolean(),
  maxUsdcPerTrade: PositiveNumberSchema.optional(),
  weightMultiplier: z.number().positive(),
  stats: TargetTraderStatsSchema,
  createdAt: UnixTimestampSchema,
  updatedAt: UnixTimestampSchema,
});
