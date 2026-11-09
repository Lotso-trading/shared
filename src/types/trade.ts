import type { z } from "zod";
import type {
  DetectedTradeSchema,
  ExecutedTradeSchema,
  PolymarketRawActivityTradeSchema,
  TradeSideSchema,
  TradeStatusSchema,
} from "../schemas/trade.schema.ts";

export type TradeSide = z.infer<typeof TradeSideSchema>;
export type TradeStatus = z.infer<typeof TradeStatusSchema>;
export type DetectedTrade = z.infer<typeof DetectedTradeSchema>;
export type ExecutedTrade = z.infer<typeof ExecutedTradeSchema>;
export type PolymarketRawActivityTrade = z.infer<typeof PolymarketRawActivityTradeSchema>;
