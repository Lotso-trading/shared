export interface PolymarketUrlTarget {
    eventSlug?: string | null;
    marketSlug?: string | null;
    marketQuestion?: string | null;
    conditionId?: string | null;
}

const INVALID_SLUGS = new Set([
    "",
    "market",
    "polymarket-market",
    "polygon-onchain",
    "unknown",
    "undefined",
    "null",
]);

const INVALID_QUESTIONS = new Set([
    "",
    "polymarket question",
    "question inconnue",
    "unknown question",
]);

/**
 * Returns a reliable Polymarket URL for a position or market.
 *
 * Logic:
 * 1. If a valid eventSlug is present, points directly to https://polymarket.com/event/{eventSlug} (or /event/{eventSlug}/{marketSlug}).
 * 2. If only a valid marketSlug is present, points to https://polymarket.com/market/{marketSlug} which Polymarket natively 307-redirects to the event page.
 * 3. If slugs are invalid/generic (e.g. "polymarket-market"), falls back to https://polymarket.com/search?q={question} to guarantee no 404.
 * 4. Otherwise, falls back to https://polymarket.com.
 */
export function getPolymarketUrl(target?: PolymarketUrlTarget | null): string {
    if (!target) return "https://polymarket.com";

    const eventSlug = target.eventSlug?.trim();
    const marketSlug = target.marketSlug?.trim();

    // 1. Valid eventSlug
    if (eventSlug && !INVALID_SLUGS.has(eventSlug.toLowerCase())) {
        if (
            marketSlug &&
            !INVALID_SLUGS.has(marketSlug.toLowerCase()) &&
            marketSlug.toLowerCase() !== eventSlug.toLowerCase()
        ) {
            return `https://polymarket.com/event/${eventSlug}/${marketSlug}`;
        }
        return `https://polymarket.com/event/${eventSlug}`;
    }

    // 2. Valid marketSlug (Polymarket handles HTTP 307 redirect to the canonical event)
    if (marketSlug && !INVALID_SLUGS.has(marketSlug.toLowerCase())) {
        return `https://polymarket.com/market/${marketSlug}`;
    }

    // 3. Search query fallback by question
    const question = target.marketQuestion?.trim();
    if (question && !INVALID_QUESTIONS.has(question.toLowerCase())) {
        return `https://polymarket.com/search?q=${encodeURIComponent(question)}`;
    }

    // 4. Default fallback
    return "https://polymarket.com";
}
