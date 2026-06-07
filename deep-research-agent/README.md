# Deepsight Agent v4.4.2

> Operit AI — 14阶段自动化深度研究流水线，双轨权威分类、15质量门控、六级置信度标记、因果链推演引擎。

[![Version](https://img.shields.io/badge/version-4.4.2-blue)](https://github.com/a-yuanwei/OperitForge/releases)
[![Tools](https://img.shields.io/badge/tools-12-green)]()
[![Audit](https://img.shields.io/badge/audit-45/50-success)]()

---

## v4.4.2 修复

| # | 修复 | 优先级 |
|---|------|--------|
| 3 | clearActiveSession after idempotency | P0 |
| 6 | marker real check (5 anomaly detections) | P0 |
| 1 | G15 dim guard (empty -> passed) | P1 |
| 2 | decomposeSubtasks tighten | P1 |
| 4 | suggestNext -> SEARCH/ingest | P1 |

## 架构

- **12工具** — check_research_status / orchestrate_research / start_research / advance_search_round / ingest_source / classify_authority / check_quality_gate / tag_confidence / deep_analyze / create_checkpoint / sync_to_plan / resume_research
- **14阶段** — INIT->QUERY_PLAN->SEARCH->FETCH->EXTRACT->AUTHORITY_CLASSIFY->CROSS_VALIDATE->GAP_DETECT->DEEP_ANALYZE->THESIS_BUILD->QUALITY_GATE->CONFIDENCE_TAG->COMPILE->OUTPUT
- **15门控** — 7基础 + 5中文专项 + 3强本地化
- **3 Hook** — InputMenuToggle + SystemPromptCompose + MessageProcessing
- **五维评分** — Tier:30% Gate:25% Conf:20% Quant:15% Rounds:10%

## 快速开始

1. 导入 deepsight.toolpkg 到 Operit Packages
2. 重启 Operit AI
3. 输入框菜单开启 Deep Research (OFF->FORCE)
4. 发送事实性消息，AI 自动调用 orchestrate_research

## 技术指标

| 指标 | 数值 |
|------|------|
| 工具 | 12 |
| 阶段 | 14 |
| 门控 | 15 |
| 置信度 | 6级 |
| Tier | 5 (中英独立) |
| 审查 | 45/50 |

---

a-yuanwei/OperitForge | deep-research-agent/
