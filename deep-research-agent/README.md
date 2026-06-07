# DeepResearch Agent v4.4.2

> Operit AI 插件包 — 14阶段自动化深度研究流水线，双轨权威分类、15质量门控、六级置信度标记、因果链推演引擎。

[![Version](https://img.shields.io/badge/version-4.4.2-blue)](https://github.com/a-yuanwei/OperitForge/releases)
[![Tools](https://img.shields.io/badge/tools-12-green)]()
[![Pipeline](https://img.shields.io/badge/pipeline-14_stages-orange)]()
[![Audit](https://img.shields.io/badge/audit-45/50-success)]()

---

## v4.4.2 修复

| # | 修复 | 优先级 |
|---|------|--------|
| 3 | clearActiveSession 移到幂等判断之后 | P0 |
| 6 | marker 检查不再永远通过 (5种异常检测) | P0 |
| 1 | G15 空维度不误报 | P1 |
| 2 | decomposeSubtasks 收紧 (去and, 实体>=5) | P1 |
| 4 | suggestNext 门控失败回 SEARCH/ingest | P1 |

## 架构

```
菜单层 (main.js) -> AI探针层 -> 流水线执行层 (14阶段) -> Resilience Spine
```

- **12工具** — check_research_status / orchestrate_research / start_research / advance_search_round / ingest_source / classify_authority / check_quality_gate / tag_confidence / deep_analyze / create_checkpoint / sync_to_plan / resume_research
- **14阶段** — INIT->QUERY_PLAN->SEARCH->FETCH->EXTRACT->AUTHORITY_CLASSIFY->CROSS_VALIDATE->GAP_DETECT->DEEP_ANALYZE->THESIS_BUILD->QUALITY_GATE->CONFIDENCE_TAG->COMPILE->OUTPUT
- **15门控** — 7基础 + 5中文专项 + 3强本地化
- **3 Hook** — InputMenuTogglePlugin / SystemPromptComposeHook / MessageProcessingPlugin
- **五维评分** — Tier:30% Gate:25% Conf:20% Quant:15% Rounds:10%

## 快速开始

1. 将 deep-research-agent/ 放入 Operit Packages 目录
2. 重启 Operit AI
3. 输入框菜单开启 Deep Research (OFF->FORCE)
4. 发送事实性消息，AI 自动调用 orchestrate_research

## 技术指标

| 指标 | 数值 |
|------|------|
| 工具总数 | 12 |
| 流水线阶段 | 14 |
| 质量门控 | 15 (7+5+3) |
| 置信度等级 | 6 |
| 权威 Tier | 5 (0-4 中英独立) |
| 错误分类码 | 14 |
| 审查项数 | 50 (十层) |
| Hook 数 | 3 |

---

仓库: a-yuanwei/OperitForge | 路径: deep-research-agent/
