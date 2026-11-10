# Polymarket Copy-Trading — `@polymarket-copy/shared` GitHub Copilot Instructions

## Repository Overview

`@polymarket-copy/shared` (`packages/shared`) is the **universal single source of truth for all data contracts** of the Polymarket Copy-Trading ecosystem (`Lotso-trading`):
- Exports immutable TypeScript interfaces, discriminated union types, and runtime **Zod** validation schemas.
- Consumed by `services/api`, `services/bot`, and `services/dashboard`.

---

## 💎 Key Engineering Rules (Zero `any`)

1. **Zero Tolerance for `any`**:
   - Any external payload (from Polymarket API, Polygon RPC, WebSocket, or HTTP requests) enters typed strictly as `unknown`.
   - Must be parsed and validated through a **Zod** schema before being cast or exported.
   - Optional properties must be explicit (`prop?: Type` or `prop: Type | null`).
2. **Discriminated Unions**:
   - Strict structuring for transaction states (`TradeStatus`), WebSocket event types (`WebSocketEvent`), and risk evaluation verdicts (`ValidationResult`).
3. **Immutabilité**:
   - Shared entities, detected trades, and events MUST use `Readonly<T>` to avoid side effects across async microservice pipelines.
4. **Single Biome Standard**:
   - All code is formatted and linted by Biome (`biome check .`).

---

## Commit Message Guidelines (Conventional Commits v1.0.0)

- Always follow `<type>(<scope>): <subject>` in imperative present mood (e.g. `feat(schemas): add maxAllocatedCapitalUsdc to RiskConfigSchema`).
- Primary scopes: `types`, `schemas`, `contracts`, `zod`, `events`, `dto`, `embed`, `deps`, `ci`, `docs`.
- Detailed commit instructions: See `.github/copilot-commit-instructions.md`.
