import { z } from "zod";
import {
  EthereumAddressSchema,
  NonNegativeNumberSchema,
  PositiveNumberSchema,
  ProbabilityPriceSchema,
  UnixTimestampSchema,
} from "./common.schema.ts";

export const TradeSideSchema = z.enum(["BUY", "SELL"]);

export const TradeStatusSchema = z.enum([
  "DETECTED",
  "VALIDATED",
  "REJECTED",
  "EXECUTING",
  "FILLED",
  "FAILED",
]);

export const DetectedTradeSchema = z.object({
  id: z.string().min(1, "L'identifiant du trade détecté est requis"),
  targetAddress: EthereumAddressSchema,
  marketSlug: z.string().min(1, "Le slug du marché est requis"),
  marketQuestion: z.string().min(1, "La question du marché est requise"),
  conditionId: z.string().min(1, "L'identifiant de condition est requis"),
  assetAddress: EthereumAddressSchema,
  outcomeIndex: z.number().int().min(0, "L'index de l'issue doit être positif"),
  outcomeLabel: z.string().min(1, "Le libellé de l'issue est requis"),
  endDate: z.string().optional(),
  side: TradeSideSchema,
  price: ProbabilityPriceSchema,
  sizeShares: PositiveNumberSchema,
  sizeUsdc: PositiveNumberSchema,
  transactionHash: z
    .string()
    .regex(
      /^0x[a-fA-F0-9]{64}$/,
      "Le hash de transaction doit faire 64 caractères hexadécimaux précédés de 0x"
    )
    .optional(),
  detectedAt: UnixTimestampSchema,
  source: z.enum(["POLYMARKET_API", "POLYGON_RPC"]),
});

export const ExecutedTradeSchema = z.object({
  id: z.string().min(1, "L'identifiant du trade exécuté est requis"),
  detectedTradeId: z.string().min(1, "La référence au trade détecté est requise"),
  targetAddress: EthereumAddressSchema,
  conditionId: z.string().min(1, "L'identifiant de condition est requis"),
  marketSlug: z.string().optional(),
  marketQuestion: z.string().optional(),
  outcomeLabel: z.string().optional(),
  endDate: z.string().optional(),
  side: TradeSideSchema,
  targetPrice: ProbabilityPriceSchema,
  executedPrice: ProbabilityPriceSchema,
  slippagePercent: z.number(),
  shares: NonNegativeNumberSchema,
  costUsdc: NonNegativeNumberSchema,
  orderId: z.string().optional(),
  transactionHash: z.string().optional(),
  status: TradeStatusSchema,
  rejectionReason: z.string().optional(),
  isDryRun: z.boolean(),
  executedAt: UnixTimestampSchema,
});

export const PolymarketRawActivityTradeSchema = z
  .object({
    id: z.string().optional(),
    transactionHash: z.string().optional(),
    transaction_hash: z.string().optional(),
    timestamp: z.coerce.number(),
    user: EthereumAddressSchema.optional(),
    proxy_wallet: EthereumAddressSchema.optional(),
    side: z
      .string()
      .optional()
      .transform((val) => (val?.toUpperCase() === "SELL" ? "SELL" : "BUY")),
    price: z.coerce.number().optional().default(0.5),
    size: z.coerce.number().optional().default(10),
    usdcSize: z.coerce.number().optional(),
    usdc_size: z.coerce.number().optional(),
    asset: z.string().optional(),
    token_id: z.string().optional(),
    conditionId: z.string().optional(),
    condition_id: z.string().optional(),
    title: z.string().optional(),
    slug: z.string().optional(),
    market: z
      .object({
        slug: z.string().optional(),
        question: z.string().optional(),
      })
      .optional(),
    outcome: z.string().optional(),
    outcomeIndex: z.coerce.number().int().min(0).optional(),
    outcome_index: z.coerce.number().int().min(0).optional(),
    endDate: z.string().optional(),
    end_date_iso: z.string().optional(),
    game_start_time: z.string().optional(),
  })
  .passthrough();
