# DeepResearch Agent v4.2.0

> **Operit AI 插件包** — 14 阶段自动化深度研究流水线，集权威分类、质量门控、置信度标记、因果链推演于一体的工业级 AI 研究工具链。

[![Version](https://img.shields.io/badge/version-4.2.0-blue)](https://github.com/a-yuanwei/OperitForge/tree/main/deep-research-agent)
[![Tools](https://img.shields.io/badge/tools-12-green)](https://github.com/a-yuanwei/OperitForge/tree/main/deep-research-agent)
[![Pipeline](https://img.shields.io/badge/pipeline-14_stages-orange)](https://github.com/a-yuanwei/OperitForge/tree/main/deep-research-agent)
[![Gates](https://img.shields.io/badge/quality-15_gates-red)](https://github.com/a-yuanwei/OperitForge/tree/main/deep-research-agent)
[![Score](https://img.shields.io/badge/audit-19.60/20-success)](https://github.com/a-yuanwei/OperitForge/tree/main/deep-research-agent)

---

## 目录

1. [概述](#概述)
2. [核心架构](#核心架构)
3. [12 工具详解](#12-工具详解)
4. [14 阶段流水线状态机](#14-阶段流水线状态机)
5. [错误分类体系](#错误分类体系)
6. [功能深度剖析](#功能深度剖析)
   - [权威分类系统 (Dual Tier 0-4)](#1-权威分类系统-dual-tier-0-4)
   - [15 条质量门控 (7+5+3)](#2-15-条质量门控-753)
   - [六级置信度标记](#3-六级置信度标记)
   - [V4 因果链推演引擎](#4-v4-统一因果链推演)
   - [Resilience Spine 韧性脊柱](#5-resilience-spine-韧性脊柱)
   - [计划模式集成](#6-计划模式集成)
   - [跨会话质量评分](#7-跨会话质量评分)
7. [使用场景](#使用场景)
   - [场景 1：事实核查](#场景-1事实核查与研究验证)
   - [场景 2：学术文献综述](#场景-2学术文献综述)
   - [场景 3：技术竞争情报](#场景-3技术竞争情报)
   - [场景 4：政策分析](#场景-4政策分析)
   - [场景 5：跨会话持续性研究](#场景-5跨会话持续性研究)
8. [快速开始](#快速开始)
9. [文件结构](#文件结构)
10. [版本演进](#版本演进)
11. [技术指标](#技术指标)
12. [架构决策记录](#架构决策记录)

---

## 概述

DeepResearch Agent 不是搜索引擎包装器——它是一个**完整的学术研究流程引擎**，面向 Operit AI 平台设计。

### 核心设计

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
│  InputGuard (参数必填校验)                        │
└─────────────────────────────────────────────────┘
```

| 原则 | 实现 |
|------|------|
| **菜单写请求，调度器读请求** | 解耦触发与执行，菜单只负责设置布尔开关 |
| **持久互斥锁 + 60s 幂等保护** | 确保一次查询只触发一次流水线 |
| **二进制触发，五态反馈** | OFF/READY/RUNNING/DONE/FAIL 通过 AI 探针读取 |
| **中英双轨自适应** | 自动检测语言 → 选择权威分类器 → 激活对应质量门 |
| **AI 驱动推进** | 每个阶段完成后 AI 自行判断下一动作，非全自动 |

---

## 核心架构

### 触发模型

```
用户输入事实性消息
        │
        ▼
AI 调用 check_research_status()  ← 探针：零参数，始终可调用
        │
        ├── toggle=OFF  → AI 提示用户开启
        │
        ▼ toggle=ON|FORCE
AI 调用 orchestrate_research()   ← 强制入口，不可跳过
        │
        ├── OFF → 5ms 快速拒绝
        │
        ▼ ON/FORCE → INIT → QUERY_PLAN（自动）
AI 按 _suggestNext 逐步推进
  start_research → SEARCH
  advance_search_round ×2
  ingest_source ×N（自动权威分类）
  check_quality_gate
  tag_confidence
  deep_analyze
  sync_to_plan
        │
        ▼
AI 调用 check_research_status()
  → 获取 sessionQuality（五维评分）
  → 决定是否补源或结束
```

---

## 12 工具详解

### 工具全景

| # | 工具名 | 职能 | 门控要求 |
|---|--------|------|---------|
| 0 | `check_research_status` | AI 探针：零参数读取完整状态 | **无**（始终可调用） |
| 1 | `orchestrate_research` | **强制入口**：编排启动流水线 | toggle=ON 才可推进 |
| 2 | `start_research` | 启动深度搜索，初始化状态机 | toggle=ON |
| 3 | `advance_search_round` | 搜索轮次计数器推进（幂等保护） | toggle=ON |
| 4 | `ingest_source` | 来源规范化注入 + 自动权威分类 | toggle=ON |
| 5 | `classify_authority` | 中英双 Tier 0-4 权威分类 | toggle=ON |
| 6 | `check_quality_gate` | 15 条质量门控检查 | toggle=ON |
| 7 | `tag_confidence` | 六级置信度标记 | toggle=ON |
| 8 | `deep_analyze` | V4 因果链推演 | toggle=ON |
| 9 | `create_checkpoint` | 手动研究快照 | toggle=ON |
| 10 | `sync_to_plan` | 进度同步为 plan-mode plantodo | toggle=ON |
| 12 | `resume_research` | 断点恢复：从检查点重建会话 | **无**（零闸门） |

---

### 0. `check_research_status` — AI 探针

**零参数 · 始终可调用 · 无任何门控**

返回完整的流水线状态快照，供 AI 实时感知研究进度。

**返回结构：**

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

| 关键字段 | 类型 | 含义 |
|---------|------|------|
| `toggle.enabled` | bool | 深度搜索开关是否开启 |
| `toggle.mode` | string | 触发模式：`off` / `suggest` / `force` |
| `session.currentStage` | string | 当前流水线阶段（14 阶段之 1） |
| `session.progress` | string | 人类可读进度一行 |
| `planIntegration` | bool | 是否已激活计划模式集成 |
| `sessionQuality.score` | int | 五维加权综合评分（0-100） |
| `sessionQuality.grade` | string | 等级：A / B / C / D / F |

---

### 1. `orchestrate_research` — 强制入口

> ⚠️ **不可跳过 — 处理事实性消息的第一步**

```
参数：
  query               (required, string)   — 用户原始消息 / 研究命题
  language_priority   (optional, string)   — auto / zh / en
  plan_aware          (optional, boolean)  — 是否启用计划模式集成
```

**三重行为路径：**

| 开关状态 | 行为 | 耗时 |
|---------|------|------|
| **OFF** | 快速拒绝，返回 `GATE_OFF` 提示 | ~5ms |
| **ON (suggest)** | 启动流水线 INIT→QUERY_PLAN，返回编排方案 + 幂等保护 | ~50ms |
| **FORCE** | 一次性执行，推进到 QUERY_PLAN 后自动关闭触发器 | ~50ms |

**设计哲学：** 不要评估"是否需要研究"——让本工具判断。跳过本工具直接搜索 = 丧失权威分类、质量门控和来源归档。

---

### 2. `start_research` — 研究启动

初始化会话状态，构建语言自适应配置，生成查询计划。

```
参数：
  query               (required, string)   — 研究命题
  language_priority   (optional, string)   — auto / zh / en
  plan_aware          (optional, boolean)  — 计划模式集成
```

**注入点：** `_writeAutoCheckpoint` 在成功执行后自动写入断点（stage=QUERY_PLAN）。

---

### 3. `advance_search_round` — 搜索轮次推进

**仅在开始新一轮真实搜索时调用**（非每次源注入）。调用两次以通过 G2 质量门控（rounds >= 2）。

```
参数：
  session_state  (required, object)  — 当前会话状态对象
```

**幂等保护：** 同一会话同一轮次重复调用不会产生副作用。`_writeAutoCheckpoint` 注入点：stage=currentStage。

---

### 4. `ingest_source` — 来源注入

将外部搜索结果规范化并注入会话状态。**自动进行权威分类**并更新搜索统计。

```
参数：
  session_state  (required, object)  — 当前会话状态
  source         (required, object)  — 规范化来源对象
    { url, title, snippet, language, stance, extractedFacts, ... }
```

**注入点：** `_writeAutoCheckpoint`（stage=currentStage）。

---

### 5. `classify_authority` — 权威分类

中英文双 Tier 0-4 权威分级。支持多语言扩展（`AuthorityPolicy.register('xx', matcherFn)`）。

```
参数：
  url       (required, string)  — 待分类 URL
  metadata  (optional, object)  — 来源元数据
```

**Tier 体系：**

| Tier | 中文示例 | 英文示例 | 得分 |
|------|---------|---------|------|
| **0** | 政府白皮书、国家统计局 | GOV/EDU 域 + 作者署名 | 1.0 |
| **1** | 中科院、CAICT 报告 | Nature/Science、IEEE/ACM | 0.8 |
| **2** | 权威媒体（新华社） | 权威媒体（Reuters/Bloomberg） | 0.5 |
| **3** | 知名技术社区（知乎深度文） | 知名技术博客（Medium Verified） | 0.3 |
| **4** | 未分类 / 未知来源 | 未分类 / 未知来源 | 0.1 |

---

### 6. `check_quality_gate` — 质量门控

**15 条门控（7+5+3）**，数据驱动自适应激活。

```
参数：
  session_state  (required, object)  — 当前会话状态对象
  topic          (required, string)  — 研究主题
```

### 7. `tag_confidence` — 置信度标记

**六级置信度标记体系：**

| 符号 | 含义 | 触发条件 |
|------|------|---------|
| `[V]` | VERIFIED 已验证 | Tier 0-1 来源 + 2+ 独立交叉验证 + 无矛盾 |
| `[L]` | LIKELY 很可能 | Tier 0-2 来源 + 至少 1 交叉验证 + 多数源一致 |
| `[U]` | UNCERTAIN 不确定 | 来源不足或 Tier 偏高，无法形成充分证据链 |
| `[X]` | DISPUTED 有争议 | 权威来源之间存在实质性矛盾 |
| `[?]` | UNVERIFIABLE 无法验证 | 声明无法通过可获取的公开来源验证 |
| `[-]` | UNMARKED 未标记 | 默认初始状态 |

```
参数：
  assertion  (required, string)  — 待标记断言
  sources    (required, array)   — 支撑来源数组
```

---

### 8. `deep_analyze` — 因果链推演

V4 统一因果链分析引擎。

```
参数：
  thesis       (required, string)   — 待分析命题
  variables    (required, array)    — 相关变量数组
  known_facts  (required, array)    — 已知事实数组
  depth        (optional, string)   — standard / deep
```

- **standard：** 直接因果链，A→B→C
- **deep：** 展开二阶/三阶间接效应，A→B→C→D→E

---

### 9. `create_checkpoint` — 手动快照

创建研究状态快照，与自动断点（`_writeAutoCheckpoint`）互补。

```
参数：
  session_state  (required, object)  — 当前会话状态对象
```

---

### 10. `sync_to_plan` — 计划同步

将研究进度同步为 plan-mode 兼容的 plantodo 格式。

```
参数：
  session_state  (required, object)  — 当前会话状态
  action         (optional, string)  — snapshot / complete
```

---

### 12. `resume_research` — 断点恢复

> ⚠️ 工具编号 12（跳过 11，与旧版兼容）

从最近检查点恢复研究。传入 `session_id`，返回恢复后的 `sessionState` 和 `nextActions`。

```
参数：
  session_id  (required, string)  — 要恢复的会话 ID
```

**恢复路径：** `/sdcard/Operit/deep_research/pipeline/{session_id}/`

---

## 14 阶段流水线状态机

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

**状态转移表：**

| 当前阶段 | 默认下一阶段 | 反馈边（条件触发） |
|---------|-------------|-------------------|
| INIT | QUERY_PLAN | — |
| QUERY_PLAN | SEARCH | — |
| SEARCH | FETCH | → QUERY_PLAN（来源枯竭） |
| FETCH | EXTRACT | → SEARCH（抓取失败） |
| EXTRACT | AUTHORITY_CLASSIFY | — |
| AUTHORITY_CLASSIFY | CROSS_VALIDATE | — |
| CROSS_VALIDATE | GAP_DETECT | — |
| GAP_DETECT | DEEP_ANALYZE | → SEARCH（发现缺口） |
| DEEP_ANALYZE | THESIS_BUILD | — |
| THESIS_BUILD | QUALITY_GATE | — |
| QUALITY_GATE | CONFIDENCE_TAG | → GAP_DETECT（门控未过） |
| CONFIDENCE_TAG | COMPILE | — |
| COMPILE | OUTPUT | → GAP_DETECT（报告不完整） |
| OUTPUT | null（终止） | — |

---

## 错误分类体系

所有工具错误通过 `_classifyError(e)` 统一分类，输出 `{code, cat, hint}` 结构化对象。**13 个调用点全覆盖**（12 工具 catch + 1 工厂 catch）。

| 错误码 | 类别 | 含义 | 建议处理 |
|--------|------|------|---------|
| `GATE_OFF` | FATAL | 深度搜索开关未开启 | 提示用户开启开关 |
| `NO_SESSION` | FATAL | 需先调用 orchestrate_research | 引导 AI 先编排 |
| `IDEMPOTENT_BLOCK` | INFO | 研究已在进行中 | 等待完成或查状态 |
| `SEARCH_TIMEOUT` | RETRYABLE | 搜索超时 | 可重试 |
| `RATE_LIMITED` | RETRYABLE | 速率限制 | 稍后重试 |
| `SOURCE_UNREACHABLE` | DEGRADED | 来源不可达，已跳过 | 继续，来源已跳过 |
| `GATE_FAILED` | DEGRADED | 质量门控未通过 | 回退 GAP_DETECT→SEARCH |
| `PARSE_ERROR` | FATAL | 输入参数无效 | 检查参数格式 |
| `CHECKPOINT_WRITE_FAILED` | DEGRADED | 自动断点写入失败 | 研究可继续，断点缺失 |
| `CHECKPOINT_READ_FAILED` | FATAL | 断点文件读取失败 | 无法恢复，需重新开始 |
| `RESUME_NO_CHECKPOINT` | FATAL | 未找到断点文件 | 确认 session_id 正确 |
| `INPUT_INVALID` | FATAL | 输入参数校验失败 | 检查必填字段 |
| `INTERNAL` | FATAL | 内部错误（兜底） | 查看详细消息 |

**三类错误语义：**

| 类别 | 语义 | 行为 |
|------|------|------|
| **FATAL** | 致命：请求无法完成 | 立即终止，返回错误 |
| **RETRYABLE** | 可重试：临时性故障 | 返回错误，AI 可稍后重试 |
| **DEGRADED** | 降级：部分功能受损但研究可继续 | 记录错误，继续流水线 |
| **INFO** | 信息：非错误，状态提示 | 返回提示信息 |

---

## 功能深度剖析

### 1. 权威分类系统 (Dual Tier 0-4)

中英双轨各自维护 Tier 0-4 权威分级策略引擎。

**架构：**
```
AuthorityPolicy.matchTier(source)
  ├── 提取 host + language
  ├── _langMatchers[lang](host, url, metadata)  ← 多态分发
  ├── 回退 matchEnTier（未匹配语言的兜底）
  ├── applyAuthorBoost（作者/机构加权）
  └── checkChannelMismatch（渠道一致性校验）
```

**中文匹配器 (matchCnTier) 覆盖：**
- Tier 0: `.gov.cn`, `.edu.cn`, 国家统计局, 国务院, 白皮书
- Tier 1: 中科院, CAICT, 信通院, CNKI 核心期刊
- Tier 2: 新华社, 人民日报, 省级政府网站
- Tier 3: 知乎（深度长文）、CSDN（高赞）、掘金（热门）
- Tier 4: 未匹配

**扩展性：** 通过 `AuthorityPolicy.register('xx', matcherFn)` 可注册新语言匹配器，与现有双轨无缝并行。

---

### 2. 15 条质量门控 (7+5+3)

**基础门控（7 条，始终激活）：**

| 编号 | 门控项 | 阈值 | 说明 |
|------|--------|------|------|
| G0 | minSources | ≥ 6 | 最小编码来源数 |
| G1 | minRounds | ≥ 2 | 最小搜索轮次 |
| G2 | minQuantSources | ≥ 2 | 最小量化来源（含数据） |
| G3 | maxBiasRatio | ≤ 0.6 | 最大偏见占比 |
| G4 | primaryRatio | ≥ 0.3 | 一手来源最低比例 |
| G5 | factDensity | ≥ 0.4 | 事实密度最低阈值 |
| G6 | recencyCheck | 无过期 | 时效性检查（2024+） |

**中文专项门控（5 条，语言自适应开启）：**

| 编号 | 门控项 | 阈值 | 触发条件 |
|------|--------|------|---------|
| G7 | minCnTier01 | ≥ 1 | 中文话题自动激活 |
| G8 | minCnCases | ≥ 1 | 中文话题自动激活 |
| G9 | minEnSources | ≥ 2 | 中文话题自动激活（对照源） |
| G10 | stanceBalance | 无极端偏 | 中文话题自动激活 |
| G11 | sourceDiversity | ≥ 3 种 | 中文话题自动激活 |

**强本地化门控（3 条，话题触发）：**

| 编号 | 门控项 | 阈值 | 触发条件 |
|------|--------|------|---------|
| G12 | strongCnMinZhCount | ≥ 4 | 含"国产""自主""国内"等关键词 |
| G13 | policyAlignment | 已对齐 | 政策相关话题 |
| G14 | noBannedSources | 无封锁 | 强本地化研究 |

**门控失败恢复路径：** QUALITY_GATE → feedbackOnFail → GAP_DETECT → feedbackOnGaps → SEARCH（补充搜索后重新验证）。

---

### 3. 六级置信度标记

标记体系通过 `tag_confidence` 工具暴露，基于：
1. 支撑来源的最高权威 Tier
2. 独立交叉验证的来源数量
3. 来源间的一致性程度
4. 是否存在 Tier 0-1 的直接证据

---

### 4. V4 统一因果链推演

`deep_analyze` 工具支持两种深度：
- **standard：** 直接因果链 A→B→C，适合简单命题
- **deep：** 二阶/三阶间接效应展开，适合复杂系统分析

输入要求 `thesis`（命题）、`variables`（变量数组）、`known_facts`（已知事实），引擎自动构建因果关系图。

---

### 5. Resilience Spine 韧性脊柱

**v4.2.0 的核心竞争力。**

```
          ┌──────────────────────┐
          │   _writeAutoCheckpoint│  ← 4 注入点
          │   (fail-soft)         │     start → QUERY_PLAN
          │                      │     orchestrate → INIT
          │   断点路径：           │     ingest → currentStage
          │   /sdcard/Operit/     │     advance → currentStage
          │   deep_research/      │
          │   pipeline/{id}/      │
          └──────────┬───────────┘
                     │
          ┌──────────▼───────────┐
          │   _classifyError     │  ← 13 调用点全覆盖
          │   所有异常 → 结构化    │     12 工具 catch
          │   {code,cat,hint}    │     + 1 工厂 catch
          └──────────┬───────────┘
                     │
          ┌──────────▼───────────┐
          │   resume_research    │  ← 零闸门工具
          │   从最新检查点恢复     │     传入 session_id
          │   返回 sessionState   │     返回 nextActions
          │   + nextActions      │
          └──────────────────────┘
```

| 特性 | 实现 |
|------|------|
| **自动断点** | 4 状态变更工具注入 `_writeAutoCheckpoint`，断电不丢进度 |
| **容量保护** | 每会话保留最近 50 个自动检查点，自动清理旧文件 |
| **错误分类全覆盖** | 13 个 `_classifyError` 调用点，所有异常带 `_errorCode` + `_errorCategory` |
| **InputGuard** | `_wrapTool` 工厂统一参数必填校验，工具级零成本接入 |
| **fail-soft** | 自动断点写入失败不中断工具执行 |
| **版本标记** | 每个检查点记录 `version: 'v4.2.0'`，可追溯产生版本 |

---

### 6. 计划模式集成

**v4.1.0 引入，v4.2.0 增强。**

| 工具/函数 | 计划模式行为 |
|----------|------------|
| `orchestrate_research` | `plan_aware=true` 时注入 `planIntegration` + `planProgress` |
| `check_research_status` | 返回 `planIntegration` / `planProgress` / `planTodoAvailable` |
| `sync_to_plan` | 研究进度 → plantodo 可追踪格式（snapshot/complete） |

---

### 7. 跨会话质量评分

**五维加权评分引擎** (`_scoreSession`)，在 `check_research_status` 和每个自动检查点中暴露。

| 维度 | 权重 | 计算方式 |
|------|------|---------|
| **权威层级 (Tier)** | 30% | 加权 Tier 分布 × 归一化（Tier0×5 + Tier1×4 + Tier2×3 + Tier3×2 + Tier4×1）|
| **质量门控 (Gate)** | 25% | 通过门数 / 总门数 × 100 |
| **置信度 (Confidence)** | 20% | 断言符号均值（[V]=100 / [L]=75 / [U]=40 / 其他=20）|
| **量化来源 (Quant)** | 15% | 定量数据源 / min(6, totalSources) × 100 |
| **搜索轮次 (Rounds)** | 10% | rounds ≥ 2 → 100，否则 rounds × 50 |

**等级映射：**

| 评分 | 等级 | 含义 |
|------|------|------|
| ≥ 90 | **A** | 优秀：权威源充分，门控全通过，高置信度 |
| 75-89 | **B** | 良好：多数门控通过，置信度可接受 |
| 60-74 | **C** | 合格：基本门控通过，存在信息缺口 |
| 40-59 | **D** | 较差：来源不足或权威性低 |
| < 40 | **F** | 不合格：无法形成有效研究 |

---

## 使用场景

### 场景 1：事实核查与研究验证

**输入：** AI 收到一条事实性声明，需验证真实性。

**调用序列：**
```
1. check_research_status()                     → 确认 toggle=ON
2. orchestrate_research(query="待验证声明")      → INIT → QUERY_PLAN
3. start_research(query="待验证声明")            → SEARCH 阶段
4. advance_search_round(sessionState)           → rounds=1
5. ingest_source(sessionState, source1)         → 自动权威分类
6. ingest_source(sessionState, source2...N)     → 累积来源
7. advance_search_round(sessionState)           → rounds=2 (G2✓)
8. check_quality_gate(sessionState, topic)      → 通过/失败统计
9. tag_confidence(assertion, sources)           → [V]/[L]/[U]/[X]/[?]
10. check_research_status()                     → sessionQuality
```

**预期产出：** 每个事实附置信度标签，所有来源附 Tier 分级，整体评分 A-F。

---

### 场景 2：学术文献综述

**输入：** 对特定研究主题进行系统性文献综述。

**关键工具调用：**
```
orchestrate_research(query="transformer注意力机制最新进展", plan_aware=true)
  → 自动中英双轨搜索
  → G9 确保英文对照源 ≥ 2
  → G11 确保来源多样性 ≥ 3 种

deep_analyze(thesis="注意力机制已收敛到几个标准范式", variables=[...], known_facts=[...], depth="deep")
  → 因果链推演技术路线分叉

sync_to_plan(sessionState, action="snapshot")
  → 同步到计划模式，plantodo 可追踪
```

**预期产出：** 结构化文献地图，各来源权威等级，关键论点因果链，计划模式可追踪。

---

### 场景 3：技术竞争情报

**输入：** 分析某技术领域的关键玩家和技术路线。

**关键工具调用：**
```
orchestrate_research(query="RISC-V生态2026年竞争格局")
  → 中英双轨搜索
  → 自动 classify_authority 对每个来源打分

check_quality_gate(sessionState, topic)
  → G9 确保英文对照源 ≥ 2
  → G11 确保来源多样性

deep_analyze(thesis="RISC-V碎片化风险", variables=[...], known_facts=[...])
  → 因果链分析技术路线分叉原因

tag_confidence(assertion, sources)
  → 标记每个竞争论断的可信度
```

**预期产出：** 技术路线图 + 竞争态势矩阵，每项声明有置信度标签，来源有权威层级。

---

### 场景 4：政策分析

**输入：** 分析政策文本及其影响，确保来源权威。

**关键工具调用：**
```
orchestrate_research(query="中国人工智能法草案对产业的影响", language_priority="zh")
  → 自动激活 G7-G11 中文专项门控
  → G7: minCnTier01 ≥ 1（政府/智库源必含）
  → G8: minCnCases ≥ 1（中国案例必含）

ingest_source(sessionState, {url:"xxx.gov.cn", ...})
  → 自动 Tier 0 分类

deep_analyze(thesis="AI法案→产业合规成本上升", ...)
  → 因果链推演政策传导路径
```

**预期产出：** Tier 0-1 权威源优先，政策影响因果链，强本地化门控通过。

---

### 场景 5：跨会话持续性研究

**输入：** 研究被中断（停电/切换话题/会话过期），需从断点恢复。

**流程：**
```
会话 A (中断前)：
  SEARCH 阶段第 2 轮
  自动断点：/sdcard/Operit/deep_research/pipeline/{id}/checkpoint_auto_SEARCH_3.json

会话 B (新会话)：
  check_research_status()
    → toggle=ON, session.active=true
  
  resume_research(session_id="{id}")
    → 返回 sessionState + nextActions
    → _suggestNext: "ingest_source" 或 "advance_search_round"
  
  继续：ingest_source(...) → advance_search_round(...) → ...
```

**预期产出：** 无感恢复，sessionQuality 跨会话累积评分。

---

## 快速开始

### 在 Operit AI 中部署

1. 将 `deep-research-agent/` 目录放入 Operit 的 Packages 目录
2. 重启 Operit AI
3. 在输入菜单中开启 Deep Research 开关（OFF → FORCE）
4. 发送任意事实性问题，AI 会自动调用 `orchestrate_research`

### 典型调用序列（AI 视角）

```javascript
// 1. 探针（始终先调用，零成本）
check_research_status()
→ { toggle: {enabled:true, mode:"force"}, session: null }

// 2. 编排启动（强制入口·不可跳过）
orchestrate_research(query="你的问题", plan_aware=true)
→ { stage: "QUERY_PLAN", _suggestNext: "start_research" }

// 3. 开始研究
start_research(query="你的问题")
→ { stage: "SEARCH", _suggestNext: "advance_search_round" }

// 4. 搜索循环
advance_search_round(session_state)  → rounds:1
ingest_source(session_state, source) → 自动权威分类
ingest_source(session_state, source) → ...
advance_search_round(session_state)  → rounds:2  ← G2 通过

// 5. 质量验证
check_quality_gate(session_state, topic) → passed:12/15

// 6. 置信度标记
tag_confidence(assertion, sources) → { symbol: "[L]", ... }

// 7. 状态查询（获取综合评分）
check_research_status()
→ { sessionQuality: { score:85, grade:"B", breakdown:{...} } }
```

---

## 文件结构

```
deep_research_agent_v3_2_v4_toolpkg/
├── manifest.json                        # 包元数据（版本/子包/描述）
├── build.sh                             # 构建脚本（cat 拼接 + 双断言校验）
├── README.md                            # 本文档
├── src/
│   ├── 00_core.js                       # METADATA + 常量块 + IIFE 入口 + 核心框架
│   │   ├── KEY / STAGE_ORDER / ERROR     #  v3.7.0 常量单源化
│   │   ├── Toggle Integration            #  读写 Operit ApiPreferences
│   │   ├── _classifyError / _writeAutoCheckpoint / _wrapTool
│   │   ├── _scoreSession                 #  v4.2.0 五维评分
│   │   └── advanceSearchRound            #  幂等轮次推进
│   ├── 01_policies.js                   # 权威策略 + 语言策略 + 门控策略
│   │   ├── AuthorityPolicy (matchTier/score/isPreferred/register)
│   │   ├── LanguagePolicy (detect/buildQuery/listProfiles/adapt)
│   │   └── GatePolicy (enabledBy)
│   ├── 02_store.js                      # 存储层
│   └── 03_main.js                       # 12 工具实现 + exports
├── dist/
│   └── deep_research_agent_v3_4.js      # 2277 行单文件产物
```

---

## 版本演进

| 版本 | Phase | 核心交付 | 工具数 |
|------|-------|---------|--------|
| v3.6.1 | 基线 | 10 工具，14 阶段流水线，15 门控，中英双轨 | 10 |
| v3.7.0 | Phase 0 | 常量单源化 (KEY/STAGE_ORDER/ERROR)，`_wrapTool` 工厂，`check_research_status` | 11 |
| v3.8.0 | Phase 1 | `summary` 字段，版本三处对齐 | 11 |
| v3.9.0 | Phase 2 | Resilience Spine：`_classifyError` + `_writeAutoCheckpoint` + `resume_research`，Error Taxonomy 12 码 | 12 |
| v4.0.0 | Phase 3 | 12 工具 `_classifyError` 全覆盖，4 工具注入 `autoCheckpoint` | 12 |
| v4.1.0 | Phase 4 | Plan-Mode 深度集成：`planIntegration`/`planProgress`/`planTodoAvailable` | 12 |
| **v4.2.0** | **Phase 5** | **`_scoreSession` 五维加权评分，`sessionQuality` 嵌入探针与检查点，审计闭合** | **12** |

---

## 技术指标

| 指标 | 数值 |
|------|------|
| 工具总数 | 12 |
| 流水线阶段 | 14 |
| 质量门控 | 15（7 基础 + 5 中文专项 + 3 强本地化） |
| 置信度等级 | 6（V / L / U / X / ? / -） |
| 权威 Tier | 5（0-4，双语言独立） |
| 错误分类码 | 12 |
| 支持语言 | 2（zh / en，可扩展） |
| 评分维度 | 5（Tier:30% Gate:25% Conf:20% Quant:15% Rounds:10%） |
| 自动断点注入点 | 4（start / orchestrate / ingest / advance） |
| 错误分类调用点 | 13（1 定义 + 12 调用） |
| dist 行数 | 2,277 |
| 构建断言 | BUILD_ASSERT_V1（键名一致性）+ V2（工具计数 ≥ 12） |
| 容量保护 | 每会话 50 个自动检查点 |
| 审计评分 | 19.60 / 20（施工类） |

---

## 架构决策记录

### ADR-001: 常量单源化（v3.7.0）
**决策：** KEY、STAGE_ORDER、ERROR 作为全局常量注入 METADATA 与 IIFE 之间。
**理由：** 消除 `DEFAULT_STAGES` 与 `STAGE_CONFIG.order` 之间的双源不一致风险。`STAGE_CONFIG.order = STAGE_ORDER` 实现引用统一。

### ADR-002: 探针工具零闸门（v3.7.0）
**决策：** `check_research_status` 无 toggle 门控，始终可调用。
**理由：** AI 需要随时感知研究状态，不应因开关状态而阻断探针。

### ADR-003: 强制入口工具（v3.3.0）
**决策：** `orchestrate_research` 设计为"不可跳过"的第一步。
**理由：** 跳过编排直接搜索 = 丧失权威分类、质量门控、来源归档。让工具判断是否需要研究，而非让 AI 判断。

### ADR-004: fail-soft 断点（v3.9.0）
**决策：** `_writeAutoCheckpoint` 失败不中断工具执行。
**理由：** 断点是增强功能而非核心路径，写入失败不应阻塞研究。

### ADR-005: 菜单仅存布尔值（v3.7.0）
**决策：** `MENU_STATE_KEY` 仅存储 boolean（运行中/空闲），不存 JSON。
**理由：** Operit `ApiPreferences` 仅支持 `getFeatureToggleBlocking` / `setFeatureToggleBlocking` 布尔接口。富文本状态通过 `check_research_status` 返回体传递。

### ADR-006: 裸导出 + 软迁移（v3.9.0）
**决策：** `_wrapTool` 工厂已定义，但 12 工具仍裸导出（直接 `exports.xxx = async function(args){...}`）。
**理由：** 渐进式迁移，避免一次性重构引入回归风险。新工具优先使用工厂。

---

## 许可证

本工具包为 Operit AI 平台专用插件。发布仓库：`a-yuanwei/OperitForge`。
