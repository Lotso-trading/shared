import { z } from "zod";
import { EthereumAddressSchema, UnixTimestampSchema } from "./common.schema.ts";
import { TradeSideSchema, TradeStatusSchema } from "./trade.schema.ts";

export const SortOrderSchema = z.enum(["asc", "desc"]);

export const TradeSortFieldSchema = z.enum([
    "executedAt",
    "costUsdc",
    "shares",
    "executedPrice",
    "slippagePercent",
]);

export const TradeModeFilterSchema = z.enum(["ALL", "DRY_RUN", "LIVE"]);

export const PaginationQuerySchema = z.object({
    page: z.coerce.number().int().min(1, "La page doit être >= 1").default(1),
    limit: z.coerce.number().int().min(1).max(100, "La limite maximale est de 100").default(20),
    status: TradeStatusSchema.optional(),
    targetAddress: EthereumAddressSchema.optional(),
    side: TradeSideSchema.optional(),
    isDryRun: TradeModeFilterSchema.optional(),
    search: z.string().trim().max(100).optional(),
    sortBy: TradeSortFieldSchema.default("executedAt"),
    sortOrder: SortOrderSchema.default("desc"),
});

export const TradesQuerySchema = PaginationQuerySchema;

export const ClosedPositionsQuerySchema = z.object({
    page: z.coerce.number().int().min(1, "La page doit être >= 1").default(1),
    limit: z.coerce.number().int().min(1).max(100, "La limite maximale est de 100").default(20),
    status: z.enum(["ALL", "WIN", "LOSS"]).optional().default("ALL"),
    since: z.coerce.number().int().min(0).optional(),
});
export type ClosedPositionsQuery = z.input<typeof ClosedPositionsQuerySchema>;

export const ClosedPositionsTotalsSchema = z.object({
    count: z.number().int().min(0),
    totalInvested: z.number(),
    totalPayout: z.number(),
    totalGains: z.number(),
    totalLosses: z.number(),
    netPnl: z.number(),
    totalShares: z.number(),
    avgEntryPrice: z.number(),
    winCount: z.number().int().min(0),
    lossCount: z.number().int().min(0),
    winRate: z.number(),
    roiPercent: z.number(),
});

export const PeriodGranularitySchema = z.enum(["day", "week", "month", "year"]);

export const PeriodSortFieldSchema = z.enum([
    "period",
    "count",
    "winRate",
    "totalInvested",
    "netPnl",
    "roiPercent",
]);

export const PeriodSummaryQuerySchema = z.object({
    granularity: PeriodGranularitySchema.default("day"),
    page: z.coerce.number().int().min(1, "La page doit être >= 1").default(1),
    limit: z.coerce.number().int().min(1).max(100, "La limite maximale est de 100").default(20),
    sortBy: PeriodSortFieldSchema.default("period"),
    sortOrder: SortOrderSchema.default("desc"),
    tz: z.string().trim().min(1).max(64).default("UTC"),
});
export type PeriodSummaryQuery = z.input<typeof PeriodSummaryQuerySchema>;

export const PeriodSummaryItemSchema = ClosedPositionsTotalsSchema.extend({
    periodKey: z.string().min(1),
    periodLabel: z.string().min(1),
    startTimestamp: z.number(),
    endTimestamp: z.number(),
    tradesCount: z.number().int().min(0).default(0),
});

export const PeriodSummaryResponseSchema = z.object({
    granularity: PeriodGranularitySchema,
    items: z.array(PeriodSummaryItemSchema),
    total: z.number().int().min(0),
    page: z.number().int().min(1),
    limit: z.number().int().min(1),
    totalPages: z.number().int().min(1),
    totals: ClosedPositionsTotalsSchema,
    bestPeriod: PeriodSummaryItemSchema.nullable(),
    worstPeriod: PeriodSummaryItemSchema.nullable(),
    avgNetPnlPerPeriod: z.number(),
});

export const ServiceVersionsSchema = z.object({
    api: z.string().min(1),
    bot: z.string().nullable(),
    shared: z.string().min(1),
    botOnline: z.boolean().default(false),
    updatedAt: UnixTimestampSchema,
});

export const SyncRequestResponseSchema = z.object({
    requested: z.boolean(),
    botOnline: z.boolean(),
    message: z.string().min(1),
    requestedAt: UnixTimestampSchema,
});

export const ApiErrorResponseSchema = z.object({
    success: z.literal(false),
    error: z.object({
        code: z.string().min(1),
        message: z.string().min(1),
        details: z.unknown().optional(),
    }),
});
