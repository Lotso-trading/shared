import type { DiscordWebhookPayload } from "../types/discord.ts";
import type { OpenPosition } from "../types/position.ts";

export interface ClosedPositionsSummary {
  totalCount: number;
  wonCount: number;
  lostCount: number;
  whaleSellCount: number;
  totalInvestedUsdc: number;
  totalPayoutUsdc: number;
  totalRealizedPnlUsdc: number;
  winRatePercent: number;
}

function formatDuration(ms: number): string {
  if (ms <= 0) return "< 1m";
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    const remHours = hours % 24;
    return remHours > 0 ? `${days}j ${remHours}h` : `${days}j`;
  }
  if (hours > 0) {
    const remMinutes = minutes % 60;
    return remMinutes > 0 ? `${hours}h ${remMinutes}m` : `${hours}h`;
  }
  if (minutes > 0) {
    return `${minutes}m`;
  }
  return `${seconds}s`;
}

export function buildClosedPositionEmbed(
  position: OpenPosition,
  targetAlias?: string
): DiscordWebhookPayload {
  const invested = position.totalInvestedUsdc;
  const isExplicitWin = position.closeReason === "RESOLVED_WIN";

  // En cas de victoire sur marché résolu, le payout par part est contractuellement de 1.000 USDC.
  // On garantit que le payout reflète fidèlement la totalité des parts détenues.
  const nominalWinPayout = isExplicitWin ? Math.round(position.totalShares * 100) / 100 : undefined;

  const payout =
    nominalWinPayout !== undefined
      ? nominalWinPayout
      : position.settledPayoutUsdc !== undefined
        ? position.settledPayoutUsdc
        : position.realizedPnlUsdc !== undefined
          ? Math.max(0, invested + position.realizedPnlUsdc)
          : 0;

  const realizedPnl =
    nominalWinPayout !== undefined
      ? nominalWinPayout - invested
      : position.realizedPnlUsdc !== undefined
        ? position.realizedPnlUsdc
        : payout - invested;

  const roiPercent = invested > 0 ? (realizedPnl / invested) * 100 : 0;
  const pnlSign = realizedPnl >= 0 ? "+" : "";

  const isWin = isExplicitWin || (realizedPnl > 0 && payout > 0);
  const isLoss =
    position.closeReason === "RESOLVED_LOSS" ||
    (realizedPnl < 0 && (payout === 0 || position.closeReason !== "WHALE_SELL"));

  let statusTitle: string;
  let embedColor: number;
  let closeReasonLabel: string;

  if (
    position.closeReason === "RESOLVED_WIN" ||
    (isWin && !position.closeReason?.includes("SELL"))
  ) {
    statusTitle = `🏆 Position Clôturée : VICTOIRE [${pnlSign}${realizedPnl.toFixed(2)} USDC (${pnlSign}${roiPercent.toFixed(1)}%)]`;
    embedColor = 0x00c853; // Vert émeraude
    closeReasonLabel = "Marché Résolu (Victoire 🎉)";
  } else if (position.closeReason === "RESOLVED_LOSS" || isLoss) {
    statusTitle = `❌ Position Clôturée : DÉFAITE [${realizedPnl.toFixed(2)} USDC (-100.0%)]`;
    embedColor = 0xd50000; // Rouge vif
    closeReasonLabel = "Marché Résolu (Défaite 📉)";
  } else {
    // Sortie baleine / SELL
    const sign = realizedPnl >= 0 ? "+" : "";
    statusTitle = `🔴 Position Clôturée : SORTIE BALEINE [${sign}${realizedPnl.toFixed(2)} USDC (${sign}${roiPercent.toFixed(1)}%)]`;
    embedColor = realizedPnl >= 0 ? 0x00c853 : 0xd50000;
    closeReasonLabel = "Sortie Baleine Répliquée 🐋";
  }

  const marketSlug = position.marketSlug || "";
  const marketUrl = marketSlug
    ? `https://polymarket.com/event/${marketSlug}`
    : "https://polymarket.com";

  const targetAddr = position.targetAddress || "";
  const addrShort =
    targetAddr.length >= 10 ? `${targetAddr.slice(0, 6)}...${targetAddr.slice(-4)}` : targetAddr;
  const whaleName = targetAlias || addrShort || "Baleine";

  const closedAtTime = position.closedAt || position.updatedAt || Date.now();
  const openedAtTime = position.openedAt || closedAtTime;
  const durationStr = formatDuration(closedAtTime - openedAtTime);

  const finalPrice =
    position.currentMarketPrice !== undefined
      ? position.currentMarketPrice
      : isWin
        ? 1.0
        : isLoss
          ? 0.0
          : position.totalShares > 0
            ? payout / position.totalShares
            : 0;

  return {
    username: "Lotso",
    embeds: [
      {
        title: statusTitle,
        url: marketUrl,
        description: `Clôture de position sur Polymarket • Copie de **${whaleName}**`,
        color: embedColor,
        fields: [
          {
            name: "Marché / Question",
            value: `[${position.marketQuestion || "Marché Polymarket"}](${marketUrl})`,
            inline: false,
          },
          {
            name: "Issue Détenue",
            value: `**${position.outcomeLabel || "N/A"}**`,
            inline: true,
          },
          {
            name: "Motif de Clôture",
            value: closeReasonLabel,
            inline: true,
          },
          {
            name: "Cible Copiée",
            value: `**${whaleName}** (\`${addrShort}\`)`,
            inline: true,
          },
          {
            name: "Argent Investi (Mise)",
            value: `**${invested.toFixed(2)} USDC**`,
            inline: true,
          },
          {
            name: "Cash Récupéré (Payout Brut)",
            value: `**${payout.toFixed(2)} USDC**`,
            inline: true,
          },
          {
            name: "Gain Net (PnL)",
            value: `**${pnlSign}${realizedPnl.toFixed(2)} USDC** (${pnlSign}${roiPercent.toFixed(1)}%)`,
            inline: true,
          },
          {
            name: "Parts Détenues",
            value: `${position.totalShares.toFixed(2)} parts`,
            inline: true,
          },
          {
            name: "Prix Moyen d'Entrée",
            value: `${position.avgEntryPrice.toFixed(3)} USDC`,
            inline: true,
          },
          {
            name: "Prix Final / Clôture",
            value: `${finalPrice.toFixed(3)} USDC`,
            inline: true,
          },
          {
            name: "Durée du Trade",
            value: durationStr,
            inline: true,
          },
        ],
        timestamp: new Date(closedAtTime).toISOString(),
        footer: {
          text: "Lotso Copy-Trading • Clôture de Position",
        },
      },
    ],
  };
}

export function buildClosedPositionsSummaryEmbed(
  summary: ClosedPositionsSummary
): DiscordWebhookPayload {
  const pnlSign = summary.totalRealizedPnlUsdc >= 0 ? "+" : "";
  const totalRoi =
    summary.totalInvestedUsdc > 0
      ? (summary.totalRealizedPnlUsdc / summary.totalInvestedUsdc) * 100
      : 0;
  const embedColor = summary.totalRealizedPnlUsdc >= 0 ? 0x00c853 : 0xd50000;

  return {
    username: "Lotso",
    embeds: [
      {
        title: "📊 Bilan Global des Positions Clôturées",
        description: `Synthèse financière et performance de **${summary.totalCount}** positions clôturées`,
        color: embedColor,
        fields: [
          {
            name: "Positions Clôturées",
            value: `**${summary.totalCount}** trades (${summary.wonCount} 🏆 / ${summary.lostCount} ❌ / ${summary.whaleSellCount} 🐋)`,
            inline: true,
          },
          {
            name: "Taux de Réussite (Win Rate)",
            value: `**${summary.winRatePercent.toFixed(1)}%**`,
            inline: true,
          },
          {
            name: "Capital Total Investi",
            value: `**${summary.totalInvestedUsdc.toFixed(2)} USDC**`,
            inline: true,
          },
          {
            name: "Cash Total Récupéré",
            value: `**${summary.totalPayoutUsdc.toFixed(2)} USDC**`,
            inline: true,
          },
          {
            name: "Bénéfice Net Réalisé",
            value: `**${pnlSign}${summary.totalRealizedPnlUsdc.toFixed(2)} USDC** (${pnlSign}${totalRoi.toFixed(1)}%)`,
            inline: true,
          },
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: "Lotso Copy-Trading • Rapport de Performance",
        },
      },
    ],
  };
}
