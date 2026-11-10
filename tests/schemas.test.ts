import { assertEquals, assertThrows } from "jsr:@std/assert";
import {
  AddTargetInputSchema,
  buildClosedPositionEmbed,
  buildClosedPositionsSummaryEmbed,
  DetectedTradeSchema,
  DiscordWebhookPayloadSchema,
  EthereumAddressSchema,
  ExecutedTradeSchema,
  PaginationQuerySchema,
  PolymarketRawActivityTradeSchema,
  RiskConfigSchema,
  UpdateRiskConfigInputSchema,
} from "../src/index.ts";

Deno.test("EthereumAddressSchema - valide et normalise en minuscules", () => {
  const mixedCase = "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E";
  const result = EthereumAddressSchema.parse(mixedCase);
  assertEquals(result, mixedCase.toLowerCase());
});

Deno.test("EthereumAddressSchema - rejette les adresses invalides", () => {
  assertThrows(() => EthereumAddressSchema.parse("0xinvalid"), Error);
  assertThrows(
    () => EthereumAddressSchema.parse("4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E"),
    Error
  );
  assertThrows(() => EthereumAddressSchema.parse("0x123"), Error);
});

Deno.test("AddTargetInputSchema - applique les valeurs par défaut", () => {
  const input = {
    address: "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E",
    alias: "Whale Alpha",
  };
  const parsed = AddTargetInputSchema.parse(input);
  assertEquals(parsed.enabled, true);
  assertEquals(parsed.weightMultiplier, 1.0);
  assertEquals(parsed.address, input.address.toLowerCase());
});

Deno.test("AddTargetInputSchema - rejette un alias vide ou un multiplicateur négatif", () => {
  assertThrows(
    () =>
      AddTargetInputSchema.parse({
        address: "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E",
        alias: "",
      }),
    Error
  );
  assertThrows(
    () =>
      AddTargetInputSchema.parse({
        address: "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E",
        alias: "Whale Alpha",
        weightMultiplier: -1,
      }),
    Error
  );
});

Deno.test("RiskConfigSchema - valide une configuration conforme", () => {
  const validConfig = {
    balancePercentPerTrade: 0.03, // 3%
    maxSlippagePercent: 2.0, // 2%
    maxCapPerTradeUsdc: 50.0,
    minPrice: 0.05,
    maxPrice: 0.9,
    copySellOrders: true,
    dryRun: true,
  };
  const parsed = RiskConfigSchema.parse(validConfig);
  assertEquals(parsed.balancePercentPerTrade, 0.03);
  assertEquals(parsed.maxAllocatedCapitalUsdc, 0); // valeur par défaut
  assertEquals(parsed.profitReinvestmentPercent, 50.0); // valeur par défaut
});

Deno.test("RiskConfigSchema - valide les paramètres d'allocation de capital et réinvestissement", () => {
  const customConfig = {
    balancePercentPerTrade: 0.05,
    maxSlippagePercent: 1.0,
    maxCapPerTradeUsdc: 25.0,
    minPrice: 0.1,
    maxPrice: 0.8,
    copySellOrders: true,
    dryRun: false,
    maxAllocatedCapitalUsdc: 100.0,
    profitReinvestmentPercent: 50.0,
  };
  const parsed = RiskConfigSchema.parse(customConfig);
  assertEquals(parsed.maxAllocatedCapitalUsdc, 100.0);
  assertEquals(parsed.profitReinvestmentPercent, 50.0);
});

Deno.test("RiskConfigSchema - rejette un pourcentage de solde excessif (> 20%)", () => {
  assertThrows(
    () =>
      RiskConfigSchema.parse({
        balancePercentPerTrade: 0.5, // 50% non autorisé par sécurité
        maxSlippagePercent: 2.0,
        maxCapPerTradeUsdc: 50.0,
        minPrice: 0.05,
        maxPrice: 0.9,
        copySellOrders: true,
        dryRun: true,
      }),
    Error
  );
});

Deno.test("RiskConfigSchema - rejette si minPrice >= maxPrice", () => {
  assertThrows(
    () =>
      RiskConfigSchema.parse({
        balancePercentPerTrade: 0.03,
        maxSlippagePercent: 2.0,
        maxCapPerTradeUsdc: 50.0,
        minPrice: 0.85,
        maxPrice: 0.6, // Erreur : minPrice > maxPrice
        copySellOrders: true,
        dryRun: true,
      }),
    Error
  );
});

Deno.test("UpdateRiskConfigInputSchema - valide une mise à jour partielle", () => {
  const partial = {
    maxSlippagePercent: 1.5,
    dryRun: false,
  };
  const parsed = UpdateRiskConfigInputSchema.parse(partial);
  assertEquals(parsed.maxSlippagePercent, 1.5);
  assertEquals(parsed.dryRun, false);
});

Deno.test("DetectedTradeSchema - valide un trade détecté complet", () => {
  const trade = {
    id: "dt-12345",
    targetAddress: "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E",
    marketSlug: "presidential-election-2024",
    marketQuestion: "Will Trump win the 2024 election?",
    conditionId: "cond-999",
    assetAddress: "0xE111180000d2663C0091e4f400237545B87B996B",
    outcomeIndex: 0,
    outcomeLabel: "Yes",
    side: "BUY",
    price: 0.52,
    sizeShares: 100,
    sizeUsdc: 52,
    detectedAt: 1731000000000,
    source: "POLYMARKET_API",
  };
  const parsed = DetectedTradeSchema.parse(trade);
  assertEquals(parsed.id, "dt-12345");
  assertEquals(parsed.side, "BUY");
});

Deno.test("ExecutedTradeSchema - valide un trade exécuté avec slippage", () => {
  const executed = {
    id: "et-999",
    detectedTradeId: "dt-12345",
    targetAddress: "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E",
    conditionId: "cond-999",
    side: "BUY",
    targetPrice: 0.52,
    executedPrice: 0.525,
    slippagePercent: 0.96,
    shares: 50,
    costUsdc: 26.25,
    status: "FILLED",
    isDryRun: true,
    executedAt: 1731000001000,
  };
  const parsed = ExecutedTradeSchema.parse(executed);
  assertEquals(parsed.status, "FILLED");
});

Deno.test("PolymarketRawActivityTradeSchema - convertit les chaînes numériques de l'API Polymarket", () => {
  const rawApiData = {
    id: "act-1",
    timestamp: "1731000000000",
    user: "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E",
    side: "buy",
    price: "0.45",
    size: "200.5",
    asset: "0xE111180000d2663C0091e4f400237545B87B996B",
  };
  const parsed = PolymarketRawActivityTradeSchema.parse(rawApiData);
  assertEquals(parsed.side, "BUY");
  assertEquals(parsed.price, 0.45);
  assertEquals(parsed.size, 200.5);
  assertEquals(parsed.timestamp, 1731000000000);
});

Deno.test("DiscordWebhookPayloadSchema - valide un payload d'alerte", () => {
  const payload = {
    username: "[TEST] Lotso",
    embeds: [
      {
        title: "🟢 Achat Répliqué",
        description: "Copie exécutée avec succès",
        color: 0x00c853,
        fields: [
          { name: "Cible", value: "Whale Alpha", inline: true },
          { name: "Prix", value: "0.52 USDC", inline: true },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };
  const parsed = DiscordWebhookPayloadSchema.parse(payload);
  assertEquals(parsed.embeds.length, 1);
});

Deno.test("PaginationQuerySchema - convertit et assigne les valeurs par défaut", () => {
  const parsedDefault = PaginationQuerySchema.parse({});
  assertEquals(parsedDefault.page, 1);
  assertEquals(parsedDefault.limit, 20);

  const parsedCustom = PaginationQuerySchema.parse({ page: "3", limit: "50", side: "BUY" });
  assertEquals(parsedCustom.page, 3);
  assertEquals(parsedCustom.limit, 50);
  assertEquals(parsedCustom.side, "BUY");
});

Deno.test("buildClosedPositionEmbed - construit et valide un payload pour une victoire", () => {
  const position = {
    id: "pos-win-1",
    conditionId: "0x1234567890abcdef1234567890abcdef12345678",
    assetAddress: "0x2005d16a84ceefa912d4e380cd32e7ff827875ea",
    marketSlug: "presidential-election-2026",
    marketQuestion: "Who will win the 2026 election?",
    outcomeLabel: "Democrat",
    status: "CLOSED" as const,
    closeReason: "RESOLVED_WIN" as const,
    settledPayoutUsdc: 60.0,
    realizedPnlUsdc: 30.0,
    totalShares: 60.0,
    avgEntryPrice: 0.5,
    totalInvestedUsdc: 30.0,
    currentMarketPrice: 1.0,
    currentMarketValueUsdc: 60.0,
    unrealizedPnlUsdc: 0,
    unrealizedPnlPercent: 0,
    targetAddress: "0x2005d16a84ceefa912d4e380cd32e7ff827875ea",
    openedAt: Date.now() - 3600000,
    closedAt: Date.now(),
    updatedAt: Date.now(),
  };

  const payload = buildClosedPositionEmbed(position, "RN1 (+13.4M$)");
  const parsed = DiscordWebhookPayloadSchema.parse(payload);
  assertEquals(parsed.embeds.length, 1);
  assertEquals(parsed.embeds[0]?.title?.includes("VICTOIRE"), true);
  assertEquals(parsed.embeds[0]?.color, 0x00c853);
});

Deno.test("buildClosedPositionsSummaryEmbed - construit et valide un payload de synthèse", () => {
  const summary = {
    totalCount: 28,
    wonCount: 24,
    lostCount: 4,
    whaleSellCount: 0,
    totalInvestedUsdc: 653.11,
    totalPayoutUsdc: 1231.9,
    totalRealizedPnlUsdc: 578.79,
    winRatePercent: 85.71,
  };

  const payload = buildClosedPositionsSummaryEmbed(summary);
  const parsed = DiscordWebhookPayloadSchema.parse(payload);
  assertEquals(parsed.embeds.length, 1);
  assertEquals(parsed.embeds[0]?.title?.includes("Bilan Global"), true);
  assertEquals(parsed.embeds[0]?.color, 0x00c853);
});
