# Deepsight Agent v4.5.1

> Operit AI — 14-stage automated deep research pipeline, 15 quality gates, CN/EN dual-track adaptive search.

[![Version](https://img.shields.io/badge/version-4.5.1-blue)](https://github.com/a-yuanwei/OperitForge/releases)
[![Tools](https://img.shields.io/badge/tools-12-green)]()
[![License](https://img.shields.io/github/license/a-yuanwei/OperitForge)](LICENSE)

---

## What's New in v4.5.1

- **Event Bus Decoupling** — Toggle to Pipeline fully decoupled via EventBus
- **Parallel Search** — O(n) const/O(n) dedup with BatchCache
- **FSM State Machine** — Robust pipeline with auto-recovery
- **5 Hooks** — InputMenuToggle + SystemPromptCompose + MessageProcessing + PromptFinalize + ToolPromptCompose
- **Dual Authority System** — Authority classification + MIT inline scoring
- **Progress Feedback** — Real-time progress bar, timer, and telemetry

---

## Features

- **12 tools** — check_research_status / orchestrate_research / start_research / advance_search_round / ingest_source / classify_authority / check_quality_gate / tag_confidence / deep_analyze / create_checkpoint / sync_to_plan / resume_research
- **14 stages** — INIT -> QUERY_PLAN -> SEARCH -> FETCH -> EXTRACT -> AUTHORITY_CLASSIFY -> CROSS_VALIDATE -> GAP_DETECT -> DEEP_ANALYZE -> THESIS_BUILD -> QUALITY_GATE -> CONFIDENCE_TAG -> COMPILE -> OUTPUT
- **15 quality gates** — 7 pre-checks + 5 content reviews + 3 runtime validations
- **5 Hooks** — InputMenuToggle + SystemPromptCompose + MessageProcessing + PromptFinalize + ToolPromptCompose
- **Dual Authority** — dual-authority scoring with MIT inline classifier
- **Checkpoint System** — Auto checkpoints with versioned migration and cache binding
- **Dedup (optimized):** O(n) linear dedup with inspector cycle detection
- **Caching:** BatchCache for authority, gates, sources; batch flush support
- **Progress:** Real-time progress bar, second-level timer, structured telemetry logging
- **5D Scoring:** Tier:0.3 | Gate:0.25 | Conf:0.20 | Quant:1.5 | Rounds:0.10

---

## Quick Start

1. Download deepsight.toolpkg -> Operit Packages
2. Open Operit AI
3. Toggle conversation to Deep Research (OFF -> FORCE)
4. Input research goal, AI auto-executes orchestrate_research
5. Use the 12 pipeline tools to advance through stages

---

## Performance

| Metric | Value |
|--------|-------|
| Tools | 12 |
| Stages | 14 |
| Gates | 15 |
| Hooks | 5 |
| Engines Running | 5 |
| Tier | 5 (CN/EN independent) |
| Qual/Score (non-blocking) | 45/50 |

---

## Reference

- [CHANGELOG](CHANGELOG.md) — Version history
- [Release Guide](RELEASE_GUIDE.m.md) — Publishing workflow
- [GitHub Releases](https://github.com/a-yuanwei/OperitForge/releases) — All releases

---

a-yuanwei/OperitForge | deep-research-agent/