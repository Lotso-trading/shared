# 📦 Lotso Trading — Contrats Partagés (`packages/shared`)

[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict_Z%C3%A9ro_Any-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zod](https://img.shields.io/badge/Validation-Zod_Runtime-3E67B1?logo=zod&logoColor=white)](https://zod.dev/)
[![Biome](https://img.shields.io/badge/Linter-Biome_Strict-60A5FA?logo=biome&logoColor=white)](https://biomejs.dev/)

Le package `@polymarket-copy/shared` est le **point d'ancrage universel pour tous les contrats de données** de l'écosystème Lotso Trading. Il définit les entités immuables, les unions discriminées et les schémas de validation runtime Zod partagés entre le bot (`services/bot`), l'API (`services/api`) et l'interface utilisateur (`services/dashboard`).

---

## 💎 Règles d'Ingénierie & Typage Strict (Zéro `any`)

1. **Tolérance Zéro pour `any`** :
   - Tout payload provenant d'une source externe (Polymarket API, RPC Polygon, requêtes HTTP) entre sous le type `unknown` et est obligatoirement validé par un schéma **Zod** avant d'être casté en type strict.
   - Les propriétés optionnelles sont explicites (`prop?: Type` ou `prop: Type | null`).
2. **Discriminated Unions (Unions Discriminées)** :
   - Structuration stricte des états de transaction (`TradeStatus`), des types d'événements WebSocket (`WebSocketEvent`) et des retours de validation du risque (`ValidationResult`).
3. **Immutabilité** :
   - Toutes les entités partagées utilisent des propriétés `readonly` pour garantir l'absence d'effets de bord lors de la diffusion asynchrone des événements.

---

## 📚 Types & Contrats Principaux

### 1. Types de Trades (`src/types/trade.ts`)
- `TradeSide` : `"BUY" | "SELL"`
- `TradeStatus` : `"DETECTED" | "VALIDATED" | "REJECTED" | "EXECUTING" | "FILLED" | "FAILED"`
- `DetectedTrade` : Représentation d'un ordre détecté sur une baleine avec toutes ses caractéristiques (conditionId, question, cote, montant USDC, hash de transaction).
- `ExecutedOrder` : Ordre exécuté avec succès sur le CLOB ou simulé en mémoire.

### 2. Portefeuilles Cibles (`src/types/target.ts`)
- `TargetWhale` : Adresse Polygon de la cible, label/pseudo, statut actif et métriques de réplication.

### 3. Gestion du Risque (`src/types/risk.ts`)
- `RiskConfig` : Paramètres de protection active (pourcentage de balance par ordre, slippage max, seuils de prix min/max, bascule de sortie `ALL`).
- `ValidationResult` : Résultat discriminé d'évaluation (`isValid: true` ou `isValid: false` avec motif explicite).

### 4. Télémétrie & Événements WebSocket (`src/types/events.ts`)
- `WebSocketEvent` : Contrat unifié pour tous les flux temps réel consommés par le Dashboard.

---

## 🛠️ Utilisation dans les Micro-Services

```typescript
import {
  type DetectedTrade,
  type RiskConfig,
  type TradeStatus,
  tradeValidationSchema
} from "@polymarket-copy/shared";

// Validation runtime d'un payload externe
const parseResult = tradeValidationSchema.safeParse(incomingPayload);
if (!parseResult.success) {
  console.error("Payload non conforme :", parseResult.error);
}
```

---

<div align="center">
  <sub>Composant officiel de l'écosystème <b><a href="https://github.com/Lotso-trading">Lotso Trading</a></b></sub>
</div>
