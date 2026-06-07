# DeepResearch Agent v4.4.2

> **Operit AI 插件包** — 14 阶段自动化深度研究流水线，集权威分类、质量门控、置信度标记、因果链推演于一体的工业级 AI 研究工具链。

[![Version](https://img.shields.io/badge/version-4.2.0-blue)](https://github.com/Operit/deep-research-agent)
[![Tools](https://img.shields.io/badge/tools-12-green)](https://github.com/Operit/deep-research-agent)
[![Stages](https://img.shields.io/badge/pipeline-14_stages-orange)](https://github.com/Operit/deep-research-agent)
[![Gates](https://img.shields.io/badge/quality-15_gates-red)](https://github.com/Operit/deep-research-agent)

---

## 目录

- [概述](#概述)
- [核心架构](#核心架构)
  - [14 阶段流水线状态机](#14-阶段流水线状态机)
  - [工具全景图](#工具全景图)
  - [错误分类体系](#错误分类体系)
- [12 工具详解](#12-工具详解)
- [功能特性](#功能特性)
  - [权威分类系统](#1-权威分类系统-dual-tier-0-4)
  - [质量门控](#2-15-条质量门控-7-5-3)
  - [置信度标记](#3-六级置信度标记)
  - [因果链推演引擎](#4-v4-统一因果链推演)
  - [Resilience Spine（韧性脊柱）](#5-resilience-spine-韧性脊柱)
  - [计划模式集成](#6-计划模式集成)
  - [跨会话质量评分](#7-跨会话质量评分)
- [使用场景](#使用场景)
  - [场景 1：事实核查与研究验证](#场景-1事实核查与研究验证)
  - [场景 2：学术文献综述](#场景-2学术文献综述)
  - [场景 3：技术竞争情报](#场景-3技术竞争情报)
  - [场景 4：政策分析](#场景-4政策分析)
  - [场景 5：跨会话持续性研究](#场景-5跨会话持续性研究)
- [快速开始](#快速开始)
- [版本演进](#版本演进)
- [技术指标](#技术指标)

---

## 概述

DeepResearch Agent 是一个面向 Operit AI 平台的深度研究工具包。它采用 **菜单触发 → 调度消费 → 流水线执行 → 互斥锁保护** 的四层架构，对事实性消息进行端到端的自动化研究验证。不是简单的搜索包装器——它是一个完整的学术研究流程引擎。

### 核心设计原则

| 原则 | 实现 |
|------|------|
| **菜单写请求，调度器读请求** | 解耦触发与执行，菜单只负责设置布尔开关 |
| **持久互斥锁 + 60s 幂等保护** | 确保一次查询只触发一次流水线 |
| **二进制触发，五态反馈** | OFF/READY/RUNNING/DONE/FAIL 通过 AI 探针读取 |
| **中英双轨自适应** | 自动检测语言 → 选择权威分类器 → 激活对应质量门 |
| **AI 驱动推进** | 每个阶段完成后 AI 自行判断下一动作，非全自动 |

---

## 核心架构

```
┌─────────────────────────────────────────────────┐
│                    菜单层                         │
│  deep_research_mode (OFF ↔ FORCE)               │
│  deep_research_menu_state (boolean)              │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│                AI 探针层                          │
│  check_research_status() — 始终可调用             │
│  返回：toggle / session / stage / progress       │
│        / summary / lastError / planIntegration   │
│        / sessionQuality                          │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│              流水线执行层                          │
│  INIT → QUERY_PLAN → SEARCH → FETCH → EXTRACT   │
│  → AUTHORITY_CLASSIFY → CROSS_VALIDATE           │
│  → GAP_DETECT → DEEP_ANALYZE → THESIS_BUILD     │
│  → QUALITY_GATE → CONFIDENCE_TAG → COMPILE       │
│  → OUTPUT                                        │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│              Resilience Spine                    │
│  _writeAutoCheckpoint (4 注入点)                 │
│  resume_research (断点恢复)                       │
│  _classifyError (13 调用点全覆盖)                 │
└─────────────────────────────────────────────────┘
```

### 14 阶段流水线状态机

```
INIT ────────────► 初始化会话，构建语言配置
  │
QUERY_PLAN ──────► 查询计划生成，中英文搜索策略
  │
SEARCH ──────────► 多轮搜索（至少 2 轮通过 G2 门控）
  │  └─feedbackOnEmpty──► QUERY_PLAN（搜索枯竭时回退）
  │
FETCH ───────────► 抓取搜索结果页面内容
  │  └─feedbackOnEmpty──► SEARCH
  │
EXTRACT ─────────► 事实抽取与结构化
  │
AUTHORITY_CLASSIFY► 中文 Tier 0-4 / 英文 Tier 0-4 权威分级
  │
CROSS_VALIDATE ──► 跨来源交叉验证
  │
GAP_DETECT ──────► 信息缺口检测
  │  └─feedbackOnGaps──► SEARCH（发现缺口则自动扩充搜索）
  │
DEEP_ANALYZE ────► V4 统一因果链推演
  │
THESIS_BUILD ────► 论点构建与证据链拼装
  │
QUALITY_GATE ────► 15 条质量门控逐一检查
  │  └─feedbackOnFail──► GAP_DETECT（门控未过回退补源）
  │
CONFIDENCE_TAG ──► 六级置信度标记
  │
COMPILE ─────────► 最终报告编译
  │  └─feedbackOnIncomplete──► GAP_DETECT
  │
OUTPUT ──────────► 研究完成，菜单状态复位
```

### 工具全景图

| # | 工具名 | 职能 | 门控 |
|---|--------|------|------|
| 0 | `check_research_status` | AI 探针：零参数读取完整状态 | 无（始终可调用） |
| 12 | `resume_research` | 断点恢复：从检查点重建会话 | 无（零闸门） |
| 1 | `orchestrate_research` | **强制入口**：编排启动流水线 | toggle=ON 才可推进 |
| 2 | `start_research` | 启动深度搜索，初始化状态机 | toggle=ON |
| 3 | `advance_search_round` | 搜索轮次计数器推进 | toggle=ON |
| 4 | `ingest_source` | 来源规范化注入 + 自动权威分类 | toggle=ON |
| 5 | `classify_authority` | 中英双 Tier 0-4 权威分类 | toggle=ON |
| 6 | `check_quality_gate` | 15 条质量门控检查 | toggle=ON |
| 7 | `tag_confidence` | 六级置信度标记 | toggle=ON |
| 8 | `deep_analyze` | V4 因果链推演 | toggle=ON |
| 9 | `create_checkpoint` | 手动研究快照 | toggle=ON |
| 10 | `sync_to_plan` | 进度同步为 plan-mode plantodo | toggle=ON |

### 错误分类体系

所有工具错误通过 `_classifyError(e)` 统一分类，输出 `{code, cat, hint}` 结构化对象：

| 错误码 | 类别 | 含义 |
|--------|------|------|
| `GATE_OFF` | FATAL | 深度搜索开关未开启 |
| `NO_SESSION` | FATAL | 需先调用 orchestrate_research |
| `IDEMPOTENT_BLOCK` | INFO | 研究已在进行中 |
| `SEARCH_TIMEOUT` | RETRYABLE | 搜索超时，可重试 |
| `RATE_LIMITED` | RETRYABLE | 速率限制，稍后重试 |
| `SOURCE_UNREACHABLE` | DEGRADED | 来源不可达，已跳过 |
| `GATE_FAILED` | DEGRADED | 质量门控未通过 |
| `PARSE_ERROR` | FATAL | 输入参数无效 |
| `CHECKPOINT_WRITE_FAILED` | DEGRADED | 自动断点写入失败（研究可继续） |
| `CHECKPOINT_READ_FAILED` | FATAL | 断点文件读取失败 |
| `RESUME_NO_CHECKPOINT` | FATAL | 未找到断点文件 |
| `INPUT_INVALID` | FATAL | 输入参数校验失败 |
| `INTERNAL` | FATAL | 内部错误（兜底） |

---

## 12 工具详解

### 0. `check_research_status` — AI 探针

**零参数 · 始终可调用 · 无任何门控**

返回完整的流水线状态快照，供 AI 实时感知研究进度：

```json
{
  "toggle": {
    "enabled": true,
    "mode": "force"
  },
  "session": {
    "active": true,
    "sessionId": "uuid-xxx",
    "currentStage": "SEARCH",
    "progress": "[深度研究] SEARCH | 轮次 2 | 来源 8"
  },
  "summary": "[深度研究] SEARCH | 轮次 2 | 来源 8",
  "lastError": null,
  "lastResult": null,
  "planIntegration": true,
  "planProgress": "25%",
  "planTodoAvailable": true,
  "sessionQuality": {
    "score": 78,
    "grade": "B",
    "breakdown": {
      "tierScore": 85,
      "gateScore": 80,
      "confidenceScore": 71,
      "quantScore": 67,
      "roundScore": 100,
      "weights": "tier:30% gate:25% conf:20% quant:15% rounds:10%"
    }
  }
}
```

**关键字段说明：**

| 字段 | 类型 | 含义 |
|------|------|------|
| `toggle.enabled` | bool | 深度搜索是否开启 |
| `toggle.mode` | string | 触发模式：`off`/`suggest`/`force` |
| `session.currentStage` | string | 当前流水线阶段 |
| `session.progress` | string | 人类可读进度一行 |
| `summary` | string | progress 的别名（兼容 v3.8.0 以前） |
| `planIntegration` | bool | 是否已激活计划模式集成 |
| `planProgress` | string/null | 计划进度百分比 |
| `planTodoAvailable` | bool | 是否有可追踪的 plan todo |
| `sessionQuality` | object | 跨会话五维质量评分 |

---

### 1. `orchestrate_research` — 强制入口

**⚠️ 不可跳过 — 处理事实性消息的第一步**

```
参数：
  query (required)          — 用户原始消息/研究命题
  language_priority (opt)   — auto/zh/en
  plan_aware (opt)          — 是否启用计划模式集成
```

**行为：**

- **OFF →** 5ms 快速拒绝，返回提示信息，建议开启深度搜索
- **ON →** 启动 14 阶段流水线，完成 INIT → QUERY_PLAN 自动推进，返回编排方案
- **FORCE →** 一次性执行，消费 run 请求，推进到 QUERY_PLAN 后自动关闭触发器

**设计理念：** 不要评估"是否需要"——让本工具判断。跳过本工具直接搜索 = 丧失权威分类、质量门控和来源归档。

---

### 2. `start_research` — 研究启动

初始化会话状态，构建语言自适应配置，生成查询计划。支持 `plan_aware` 模式。

```
参数：
  query (required)          — 研究命题
  language_priority (opt)   — auto/zh/en
  plan_aware (opt)          — 计划模式集成开关
```

---

### 3. `advance_search_round` — 搜索轮次推进

**仅在开始新一轮真实搜索时调用**（非每次源注入）。调用两次以通过 G2 质量门控（rounds >= 2）。

```
参数：
  session_state (required)  — 当前会话状态对象
```

内置幂等保护：同一会话同一轮次重复调用不会产生副作用。

---

### 4. `ingest_source` — 来源注入

将外部搜索结果规范化并注入会话状态。**自动进行权威分类**并更新搜索统计。

```
参数：
  session_state (required)  — 当前会话状态
  source (required)         — 规范化来源对象
    { url, title, snippet, language, stance, extractedFacts, ... }
```

---

### 5. `classify_authority` — 权威分类

中英文双 Tier 0-4 权威分级。支持多语言扩展（通过 `AuthorityPolicy.register('xx', matcherFn)` 注册新语言匹配器）。

```
参数：
  url (required)            — 待分类 URL
  metadata (opt)            — 来源元数据
```

**Tier 体系：**

| Tier | 中文示例 | 英文示例 | 得分 |
|------|---------|---------|------|
| 0 | 政府白皮书、国家统计局 | GOV/EDU 域 + 作者署名 | 1.0 |
| 1 | 中科院、CAICT 报告 | Nature/Science、IEEE/ACM | 0.8 |
| 2 | 权威媒体（新华社） | 权威媒体（Reuters/Bloomberg） | 0.5 |
| 3 | 知名技术社区（知乎深度文） | 知名技术博客（Medium Verified） | 0.3 |
| 4 | 未分类/未知来源 | 未分类/未知来源 | 0.1 |

---

### 6. `check_quality_gate` — 质量门控

**15 条门控（7+5+3）**，数据驱动的自适应激活：

```
7 条基础门控（始终激活）：
  G0  minSources    >= 6      最小编码来源
  G1  minRounds     >= 2      最小搜索轮次
  G2  minQuantSources >= 2    最小量化来源
  G3  maxBiasRatio  <= 0.6    最大偏见比例
  G4  primaryRatio  >= 0.3    一手来源最低比例
  G5  factDensity   >= 0.4    事实密度最低阈值
  G6  recencyCheck  无过期    时效性检查

5 条中文专项（语言自适应开启）：
  G7  minCnTier01   >= 1      至少 1 个 Tier 0-1 中文源
  G8  minCnCases    >= 1      至少 1 个中国案例
  G9  minEnSources  >= 2      至少 2 个英文对照源
  G10 stanceBalance 无极端偏    立场均衡性检查
  G11 sourceDiversity >= 3种   来源多样性

3 条强本地化门控（话题触发）：
  G12 strongCnMinZhCount >= 4  强本地化中文源 ≥ 4
  G13 policyAlignment 已对齐    政策维度对齐检查
  G14 noBannedSources  无封锁    无已知虚假/操纵来源
```

---

### 7. `tag_confidence` — 置信度标记

**六级置信度标记体系：**

| 符号 | 含义 | 触发条件 |
|------|------|---------|
| `[V]` VERIFIED | 已验证 | Tier 0-1 来源 + 2+ 独立交叉验证 + 无矛盾 |
| `[L]` LIKELY | 很可能 | Tier 0-2 来源 + 至少 1 个交叉验证 + 多数源一致 |
| `[U]` UNCERTAIN | 不确定 | 来源不足或 Tier 偏高，无法形成充分证据链 |
| `[X]` DISPUTED | 有争议 | 权威来源之间存在实质性矛盾 |
| `[?]` UNVERIFIABLE | 无法验证 | 声明无法通过可获取的公开来源验证 |
| `[-]` UNMARKED | 未标记 | 默认初始状态 |

---

### 8. `deep_analyze` — 因果链推演

V4 统一因果链分析引擎。支持 `standard` 和 `deep` 两种推演深度。

```
参数：
  thesis (required)         — 待分析命题
  variables (required)      — 相关变量数组
  known_facts (required)    — 已知事实数组
  depth (opt)               — standard/deep
```

---

### 9. `create_checkpoint` — 手动快照

创建研究状态快照，支持后续恢复。与自动断点（`_writeAutoCheckpoint`）互补。

---

### 10. `sync_to_plan` — 计划同步

将研究进度同步为 plan-mode 兼容的 plantodo 格式，支持 `snapshot` 和 `complete` 两种操作。

---

### 12. `resume_research` — 断点恢复

从最近检查点恢复研究。传入 `session_id`，返回恢复后的 `sessionState` 和 `nextActions`。

---

## 功能特性

### 1. 权威分类系统（Dual Tier 0-4）

中英双轨各自维护 Tier 0-4 权威分级策略引擎。通过 `AuthorityPolicy.register(lang, matcherFn)` 可扩展新语言。每次 `ingest_source` 自动触发权威分类。

### 2. 15 条质量门控（7+5+3）

数据驱动自适应激活：中文话题自动解锁 G7-G11，强本地化话题解锁 G12-G14。门控失败通过 `feedbackOnFail` 自动回退到 `GAP_DETECT` → `SEARCH` 补源。

### 3. 六级置信度标记

`[V][L][U][X][?][-]` 体系，每个断言基于来源权威等级、交叉验证数量、一致性程度自动打分。

### 4. V4 统一因果链推演

支持多变量因果分析，`standard` 模式做直接因果链，`deep` 模式展开二阶/三阶间接效应。

### 5. Resilience Spine（韧性脊柱）

**v4.4.2 的核心竞争力：**

- **自动断点：** 4 个状态变更工具注入 `_writeAutoCheckpoint`（start→QUERY_PLAN, orchestrate→INIT, ingest→currentStage, advance→currentStage），断电不丢研究进度
- **断点恢复：** `resume_research` 从 `/sdcard/Operit/deep_research/pipeline/{sessionId}/` 读取最新检查点
- **容量保护：** 每个会话保留最近 50 个自动检查点，自动清理
- **错误分类全覆盖：** 12 个工具 + `_wrapTool` 工厂共 13 个 `_classifyError` 调用点，所有异常均带 `_errorCode` + `_errorCategory` 字段
- **InputGuard：** `_wrapTool` 工厂统一参数必填校验
- **fail-soft：** 自动断点写入失败不中断工具执行

### 6. 计划模式集成

- `orchestrate_research` 在 `plan_aware=true` 时注入 `planIntegration` + `planProgress` 到会话状态
- `check_research_status` 返回 `planIntegration` / `planProgress` / `planTodoAvailable` 三个字段
- `sync_to_plan` 将研究进度格式化为 plantodo 可追踪格式

### 7. 跨会话质量评分

**五维加权评分引擎** (`_scoreSession`)，在 `check_research_status` 返回体中暴露：

| 维度 | 权重 | 计算方式 |
|------|------|---------|
| 权威层级 (Tier) | 30% | 加权 Tier 分布 × 归一化 |
| 质量门控 (Gate) | 25% | 通过门数 / 总门数 |
| 置信度 (Confidence) | 20% | 断言符号均值 |
| 量化来源 (Quant) | 15% | 定量数据源 / min(6, totalSources) |
| 搜索轮次 (Rounds) | 10% | rounds ≥ 2 → 100，否则 rounds × 50 |

**等级映射：** A ≥ 90 / B ≥ 75 / C ≥ 60 / D ≥ 40 / F < 40

---

## 使用场景

### 场景 1：事实核查与研究验证

**问题：** AI 收到一条事实性声明，需要验证其真实性。

**流程：**

```
1. AI 调用 check_research_status → 确认 toggle 状态
2. AI 调用 orchestrate_research → 启动流水线（INIT → QUERY_PLAN）
3. AI 执行搜索 → 调用 ingest_source 注入每条结果（自动权威分类）
4. AI 调用 advance_search_round（每轮搜索后）
5. AI 调用 check_quality_gate → 检查是否通过 15 条门控
6. AI 调用 tag_confidence → 为每个断言打置信度标签
7. AI 调用 check_research_status → 获取 sessionQuality 评分
8. 根据评分决定是否补充搜索或结束研究
```

**预期产出：** 每个事实附 [V]/[L]/[U]/[X] 标签，来源附 Tier 分级，整体评分 A-F。

---

### 场景 2：学术文献综述

**问题：** 需要对特定研究主题进行系统性文献综述。

**流程：**

```
1. orchestrate_research(query="transformer注意力机制最新进展", plan_aware=true)
2. 多轮搜索：每轮 advance_search_round + ingest_source
3. deep_analyze(thesis="注意力机制已收敛到几个标准范式")
4. create_checkpoint → 保存当前综述状态
5. check_quality_gate → 确保来源多样性通过 G11
6. sync_to_plan(action="snapshot") → 同步到计划模式
```

**预期产出：** 结构化文献地图，各来源权威等级标注，关键论点因果链可视化，计划模式可追踪进度。

---

### 场景 3：技术竞争情报

**问题：** 分析某技术领域的关键玩家和技术路线。

**流程：**

```
1. orchestrate_research(query="RISC-V生态2026年竞争格局")
2. 中英双轨搜索（自动检测 cn/en 来源）
3. classify_authority 对每个来源打分
4. check_quality_gate → G9 确保英文对照源 ≥ 2
5. deep_analyze → 因果链分析技术路线分叉原因
6. tag_confidence → 标记每个竞争论断的可信度
```

**预期产出：** 技术路线图 + 竞争态势矩阵，每项声明有置信度标签，来源有权威层级。

---

### 场景 4：政策分析

**问题：** 分析政策文本及其影响，确保来源权威。

**流程：**

```
1. orchestrate_research(query="中国人工智能法草案对产业的影响", language_priority="zh")
2. 自动激活 G7-G11 中文专项门控（G7: minCnTier01>=1, G8: minCnCases>=1）
3. ingest_source 注入政府白皮书、CAICT 报告等 Tier 0-1 来源
4. 强本地化关键词触发 G12-G14 门控
5. deep_analyze → 因果链推演政策传导路径
```

**预期产出：** 政策文本证据链，Tier 0-1 权威源优先，政策影响因果链分析。

---

### 场景 5：跨会话持续性研究

**问题：** 研究被中断（停电/切换话题/会话过期），需要从断点恢复。

**流程：**

```
1. 会话 A：进行到 SEARCH 阶段第 2 轮
   自动断点写入：/sdcard/Operit/deep_research/pipeline/{id}/checkpoint_auto_SEARCH_2.json
   
2. 会话 B（新会话）：
   check_research_status → 检测到 toggle=ON，有活跃会话
   resume_research(session_id="{id}") → 恢复 sessionState + nextActions
   
3. 从中断点继续：advance_search_round + ingest_source ...
```

**预期产出：** 无感恢复，sessionQuality 跨会话累积评分。

---

## 快速开始

### 在 Operit AI 中使用

1. **安装：** 将本工具包导入 Operit AI 的 Packages 目录
2. **启用：** 在输入菜单中开启 Deep Research 开关（OFF → FORCE）
3. **首次调用：** 发送任意事实性问题，AI 会自动调用 `orchestrate_research`

### 典型调用序列

```
# 1. 探针（始终先调用，无成本）
check_research_status()
→ { toggle: {enabled:true, mode:"force"}, session: null }

# 2. 编排启动
orchestrate_research(query="你的问题", plan_aware=true)
→ { stage: "QUERY_PLAN", _suggestNext: "start_research" }

# 3. 开始研究
start_research(query="你的问题")
→ { stage: "SEARCH", _suggestNext: "advance_search_round" }

# 4. 搜索循环
advance_search_round(session_state)  → rounds:1
ingest_source(session_state, source) → 自动权威分类
ingest_source(session_state, source) → ...
advance_search_round(session_state)  → rounds:2  ← G2 通过

# 5. 质量验证
check_quality_gate(session_state, topic) → passed:12/15

# 6. 状态查询
check_research_status()
→ { sessionQuality: {score:85, grade:"B"} }
```

### 文件结构

```
deep_research_agent_v3_2_v4_toolpkg/
├── manifest.json           # 包元数据（版本/子包/描述）
├── build.sh                # 构建脚本（cat 拼接 + 双断言校验）
├── src/
│   ├── 00_core.js          # METADATA + 常量 + IIFE 入口 + 核心框架
│   ├── 01_policies.js      # 权威策略 + 语言策略 + 门控策略
│   ├── 02_store.js         # 存储层
│   ├── 03_main.js          # 12 工具实现 + exports
│   └── 99_footer.js        # IIFE 闭合 + package_activate
├── dist/
│   └── deep_research_agent_v3_4.js  # 2277 行单文件产物
└── README.md
```

---

## 版本演进

| 版本 | 阶段 | 核心交付 |
|------|------|---------|
| v3.6.1 | 基线 | 10 工具，14 阶段流水线，15 门控，中英双轨 |
| v3.7.0 | Phase 0 | 常量单源化（KEY/STAGE_ORDER/ERROR），`_wrapTool` 工厂，`check_research_status` 第 11 工具，`MENU_STATE_KEY` |
| v3.8.0 | Phase 1 | `check_research_status` 追加 `summary` 字段，版本三处对齐 |
| v3.9.0 | Phase 2 | Resilience Spine：`_classifyError` + `_writeAutoCheckpoint` + `resume_research`（第 12 工具），Error Taxonomy 4 新错误码 |
| v4.0.0 | Phase 3 | 12 工具 `_classifyError` 全覆盖，4 工具注入 `autoCheckpoint` |
| v4.1.0 | Phase 4 | Plan-Mode 深度集成：`planIntegration`/`planProgress`/`planTodoAvailable` |
| v4.4.2 | Phase 5 | `_scoreSession` 五维加权评分，`sessionQuality` 嵌入探针与检查点 |

---

## 技术指标

| 指标 | 数值 |
|------|------|
| 工具总数 | 12 |
| 流水线阶段 | 14 |
| 质量门控 | 15（7 基础 + 5 中文专项 + 3 强本地化） |
| 置信度等级 | 6（V/L/U/X/?/-） |
| 权威 Tier | 5（0-4，双语言独立） |
| 错误分类码 | 12 |
| 支持语言 | 2（zh/en，可扩展） |
| 评分维度 | 5（Tier 30% + Gate 25% + Conf 20% + Quant 15% + Rounds 10%） |
| 自动断点注入点 | 4（start/orchestrate/ingest/advance） |
| 错误分类调用点 | 13（1 定义 + 12 调用） |
| dist 行数 | 2,277 |
| 构建断言 | BUILD_ASSERT_V1（键名一致性）+ BUILD_ASSERT_V2（工具计数 ≥ 12） |
| 容量保护 | 每会话 50 个自动检查点 |

---

## 许可证

本项目为 Operit AI 平台插件包，由 Operit 团队开发维护。

---

*DeepResearch Agent v4.4.2 — 让每一次搜索都经过学术级的质量检验。*
