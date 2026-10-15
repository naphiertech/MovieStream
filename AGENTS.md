# Agent Directives & Project Rules

## 1. Permanent Communication: Caveman Mode (Always Active)
- **Style**: Ultra-terse, high signal-to-noise ratio. All technical substance stays; only fluff dies.
- **Rules**:
  - Drop pleasantries, filler (just/really/basically/actually), hedging, and redundant recaps.
  - Drop articles (a/an/the) where meaning remains clear.
  - Short sentences, fragments OK. Imperative verbs. One idea per sentence.
  - Keep all technical terms, code blocks, file paths, CLI commands, and exact error strings verbatim.
  - Pattern: `[thing] [action] [reason]. [next step].`
  - Never sacrifice technical correctness or safety for brevity.

## 2. Permanent Engineering: Ponytail YAGNI Mode (Always Active)
- **The Ladder Enforced**: `YAGNI → stdlib → native → one line → minimum`.
- **Rules**:
  - Build strictly what was requested.
  - No speculative abstractions, premature generalizations, or unnecessary config layers.
  - Deletion before addition. Check existing utilities and components before writing new ones.
  - Avoid defensive code for impossible scenarios.
  - Simplest correct solution wins.

## 3. MovieStream Project Guardrails
- **Color Palette**: Sage Green theme (`--color-brand: #84a98c`, `--color-brand-cyan: #98c1a9`, Tailwind v4 `sage-*` tokens in `app/globals.css`). Never revert to red or old teal.
- **Mobile Performance**: Zero animations on mobile viewport (`< 768px`). Keep desktop animations, hover scales, and transitions fully intact.
- **Streaming Pipeline**: Vidy (`vidy.st`) primary stream, VidLink secondary stream, Viduki 3rd backup stream (`color=84a98c`).

## 4. Universal Context Contracts & Graphify
- Architectural invariants codified in [`.context/00_system_architecture.md`](.context/00_system_architecture.md).
- Consult [`.context/01_design_tokens.md`](.context/01_design_tokens.md) for Tailwind v4 theme & mobile zero-animation rules.
- Consult [`.context/02_api_and_server_boundaries.md`](.context/02_api_and_server_boundaries.md) for route handlers & edge cache headers.
- Consult [`.context/03_media_player_and_streaming.md`](.context/03_media_player_and_streaming.md) for HLS.js, stream resolver & security guard.
- Consult [`.context/04_tmdb_integration_and_api.md`](.context/04_tmdb_integration_and_api.md) for TMDB endpoints & ISR caching.
- Consult [`.context/99_icm_execution_protocol.md`](.context/99_icm_execution_protocol.md) for lint, build & verification.
- Interactive AST tree: [`graphify-out/GRAPH_TREE.html`](graphify-out/GRAPH_TREE.html).
- Obsidian visual vault: [`graphify-out/obsidian/`](graphify-out/obsidian/).
