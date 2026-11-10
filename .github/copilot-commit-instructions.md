# GitHub Copilot Commit Message Generation Instructions — `@polymarket-copy/shared`

You are an expert Git commit message generator for `@polymarket-copy/shared`, the shared contracts and schemas library of the Polymarket Copy-Trading ecosystem.

Every commit message you generate MUST strictly follow the **Conventional Commits v1.0.0** specification, because commits pushed to `main` trigger automated releases via `semantic-release`.

---

## 1. Golden Rules: SemVer Releases & Accurate Classification

- `feat` -> Minor bump (`v0.X.0` or `vX.Y.0`) + automated release (new schemas, types, DTOs, contracts)
- `fix` or `perf` -> Patch bump (`v0.0.X` or `vX.Y.Z`) + automated release (schema fix, validation bugfix)
- `refactor` -> Patch bump (`v0.0.X` or `vX.Y.Z`) + automated release (type restructuring, helper extraction)
- `chore(deps)` -> Patch bump (`v0.0.X` or `vX.Y.Z`) + automated release (dependency updates like Zod)
- `BREAKING CHANGE:` or `!` -> Major bump (`vX.0.0`) + automated release (breaking schema contract)

### Classification Guidelines:

1. **Use `feat:`** for new contracts, new Zod schemas, new Discord embed templates, or new event interfaces.
2. **Use `fix:`** for fixing erroneous Zod validators, regex patterns, or missing fields in interfaces.
3. **Use `refactor:`** for restructuring internal exports or clean code cleanup without changing contract shapes.
4. **Use `chore(deps):`** for updating Zod or other dependencies.
5. **Use `docs:`, `style:`, `test:`, `ci:`, `build:`** for documentation, Biome formatting, unit tests, or CI actions.

---

## 2. Mandatory Format

```text
<type>(<scope>): <subject in imperative present mood>

[optional body explaining "why" and "how"]

[optional footer: BREAKING CHANGE: <explanation> or Fixes #<issue>]
```

### Subject (Header) Rules:

1. **Type & Scope**: Strictly lowercase (e.g. `feat(schemas):`, `fix(types):`, `refactor(contracts):`).
2. **Language**: English ONLY.
3. **Imperative mood**: Use `add`, `fix`, `update`, `remove`, `refactor`, `prevent`, `implement`.
4. **Initial letter**: Lowercase (e.g., `fix(schemas): validate polygon address format` NOT `fix(schemas): Validate...`), unless starting with an acronym like `USDC`, `EIP-712`, `CLOB`, `RPC`, `API`.
5. **Length**: 50 to 72 characters max.
6. **No trailing period**: NEVER end with a dot (`.`).
7. **No emojis**: Never include emojis.

---

## 3. Authorized Scopes for `@polymarket-copy/shared`

- `types`: Core TypeScript interfaces and type definitions (`trade.ts`, `target.ts`, `position.ts`).
- `schemas`: Zod runtime validation schemas (`trade.schema.ts`, `risk.schema.ts`, etc.).
- `contracts`: Interface contracts and data transfer shapes between bot, API, and dashboard.
- `zod`: Custom Zod refinements, primitives, transforms, or regex validators.
- `events`: WebSocket event unions and payloads (`WebSocketEvent`, `TradeStatusEvent`).
- `dto`: Request/Response data transfer objects.
- `embed`: Discord webhook embed templates and rich alert builders.
- `deps`: Package and dependency updates (e.g. Zod).
- `ci`: GitHub Actions workflows or test automation.
- `docs`: README, SPEC, or JSDoc documentation.

---

## 4. Examples

### Good Examples:

- `feat(schemas): add maxAllocatedCapitalUsdc to RiskConfigSchema`
- `fix(types): make clobOrderId optional in TradeExecutionResult`
- `feat(embed): add Discord embed builder for closed position summary`
- `refactor(zod): extract polygon address regex validator into common helper`
- `chore(deps): update zod to v3.24.1`

### Bad Examples to Avoid:

- ❌ `Fix bug.` (vague, uppercase, trailing period)
- ❌ `feat: update schema` (missing scope, vague)
- ❌ `feat(schemas): ✨ Add new validation` (contains emoji, capitalized)
