import type { z } from "zod";
import type {
    ApiErrorResponseSchema,
    ClosedPositionsTotalsSchema,
    PaginationQuerySchema,
    PeriodGranularitySchema,
    PeriodSortFieldSchema,
    PeriodSummaryItemSchema,
    PeriodSummaryQuerySchema,
    PeriodSummaryResponseSchema,
    ServiceVersionsSchema,
    SortOrderSchema,
    SyncRequestResponseSchema,
    TradeModeFilterSchema,
    TradeSortFieldSchema,
    TradesQuerySchema,
} from "../schemas/api.schema.ts";

export type SortOrder = z.infer<typeof SortOrderSchema>;
export type TradeSortField = z.infer<typeof TradeSortFieldSchema>;
export type TradeModeFilter = z.infer<typeof TradeModeFilterSchema>;
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export type TradesQuery = z.infer<typeof TradesQuerySchema>;
export type TradesQueryInput = z.input<typeof TradesQuerySchema>;
export type ClosedPositionsTotals = z.infer<typeof ClosedPositionsTotalsSchema>;
export type PeriodGranularity = z.infer<typeof PeriodGranularitySchema>;
export type PeriodSortField = z.infer<typeof PeriodSortFieldSchema>;
export type PeriodSummaryQueryParsed = z.infer<typeof PeriodSummaryQuerySchema>;
export type PeriodSummaryItem = z.infer<typeof PeriodSummaryItemSchema>;
export type PeriodSummaryResponse = z.infer<typeof PeriodSummaryResponseSchema>;
export type ServiceVersions = z.infer<typeof ServiceVersionsSchema>;
export type SyncRequestResponse = z.infer<typeof SyncRequestResponseSchema>;
export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;

export interface ApiSuccessResponse<T> {
    readonly success: true;
    readonly data: T;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PositionRedeemedPayload {
    readonly conditionId: string;
    readonly txHash: string;
    readonly settledPayoutUsdc?: number;
}
