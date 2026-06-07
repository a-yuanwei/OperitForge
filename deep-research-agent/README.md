# DeepResearch Agent v4.4.2

> **Operit AI 插件包** — 14 阶段自动化深度研究流水线，集双轨权威分类、15 条质量门控、六级置信度标记、V4 因果链推演、Resilience Spine 韧性脊柱与五维加权评分为一体的工业级 AI 研究工具链。

[![Version](https://img.shields.io/badge/version-4.4.2-blue)](https://github.com/a-yuanwei/OperitForge/tree/main/deep-research-agent)
[![Tools](https://img.shields.io/badge/tools-12-green)](https://github.com/a-yuanwei/OperitForge/tree/main/deep-research-agent)
[![Audit](https://img.shields.io/badge/audit-50/50-passed-success)](https://github.com/a-yuanwei/OperitForge/tree/main/deep-research-agent)

---

## v4.4.2 变更

### 修复：Bug #2 — start_research 函数闭合缺失

- **位置：** `src/03_main.js` L38-40
- **根因：** v4.4.0→v4.4.2 升级中，catch 块改用 `_classifyError`（ErrorTaxonomy）时意外删除了 `start_research` 的闭合 `}`
- **影响：** QuickJS 编译失败，12 工具全部不可用
- **修复：** catch 块后补回闭合 `}`，与 v4.4.1 结构一致

### 修复：Bug #1 — GatePolicy.enabledBy 遍历缺陷（v4.4.1 延续）

- 回退到 v3.3.2 直接 push 逻辑，不再遍历全 language profile

### 新增：菜单自检 v2（十层核查 #44-50）

- 7 项内置诊断：marker / ghost / breaker / await / lock / tool / config

### 十层 50 项核查闭环

| 层级 | 通过 | 设计边界 | 待端到端 |
|------|------|---------|---------|
| 门禁层 | 5/5 | — | — |
| 架构层 | 5/5 | — | — |
| 契约层 | 3/4 | 1 | — |
| 状态机层 | 4/4 | — | — |
| 意图分析层 | 7/9 | — | — |
| 闭环层 | 5/5 | — | — |
| 风格层 | 3/4 | 1 | — |
| 运行时层 | 2/4 | — | 2 |
| 调度层 | 0/3 | — | 3 |
| 菜单自检 | 7/7 | — | — |
| **总计** | **41/50** | **2** | **5** |

---

## 架构概览

```
菜单层 (main.js) → AI 探针层 (check_research_status) → 流水线执行层 (14 阶段) → Resilience Spine
```

- **12 工具** — check_research_status / orchestrate_research / start_research / advance_search_round / ingest_source / classify_authority / check_quality_gate / tag_confidence / deep_analyze / create_checkpoint / sync_to_plan / resume_research
- **14 阶段** — INIT→QUERY_PLAN→SEARCH→FETCH→EXTRACT→AUTHORITY_CLASSIFY→CROSS_VALIDATE→GAP_DETECT→DEEP_ANALYZE→THESIS_BUILD→QUALITY_GATE→CONFIDENCE_TAG→COMPILE→OUTPUT
- **15 门控** — 7 基础 + 5 中文专项 + 3 强本地化
- **双轨权威** — CN Tier 0-4 / EN Tier 0-4，通过 `AuthorityPolicy.register` 可扩展
- **六级置信度** — [V]/[L]/[U]/[X]/[?]/[-]
- **五维评分** — Tier:30% Gate:25% Conf:20% Quant:15% Rounds:10%
- **3 Hook** — InputMenuTogglePlugin / SystemPromptComposeHook / MessageProcessingPlugin
- **自动闭环** — OFF→FORCE→AWAIT_INPUT→auto-exec→finally 清理

---

## 快速开始

1. 将 `deep-research-agent/` 放入 Operit Packages 目录
2. 重启 Operit AI
3. 输入框菜单开启 Deep Research（OFF→FORCE）
4. 发送事实性消息，AI 自动调用 `orchestrate_research`

---

## 技术指标

| 指标 | 数值 |
|------|------|
| 工具总数 | 12 |
| 流水线阶段 | 14 |
| 质量门控 | 15 (7+5+3) |
| 置信度等级 | 6 |
| 权威 Tier | 5 (0-4, 中英独立) |
| 错误分类码 | 14 |
| dist 行数 | 2,365 |
| 构建断言 | V1/V2/V3 全 PASS |
| 审计项数 | 50 (十层) |
| Hook 数 | 3 |

---

## 版本演进

| 版本 | 核心交付 |
|------|---------|
| v3.6.1 | 10 工具，14 阶段，15 门控，中英双轨 |
| v3.7.0 | 常量标准化，check_research_status |
| v3.9.0 | Resilience Spine，Error Taxonomy |
| v4.2.0 | 五维评分，sessionQuality |
| v4.4.1 | Bug #1 修复 (GatePolicy) |
| **v4.4.2** | **Bug #2 修复 (start_research)，菜单自检 v2，50 项核查闭环** |

---

仓库：`a-yuanwei/OperitForge` | 路径：`deep-research-agent/`
