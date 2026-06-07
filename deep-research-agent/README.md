# DeepResearch Agent v4.4.1

> **Operit AI 插件包** — 14 阶段自动化深度研究流水线，集双轨权威分类、15 条质量门控、六级置信度标记、V4 因果链推演、Resilience Spine 韧性脊柱与五维加权评分为一体的工业级 AI 研究工具链。

[![Version](https://img.shields.io/badge/version-4.4.1-blue)](https://github.com/a-yuanwei/OperitForge/tree/main/deep-research-agent)
[![Tools](https://img.shields.io/badge/tools-12-green)](https://github.com/a-yuanwei/OperitForge/tree/main/deep-research-agent)
[![Pipeline](https://img.shields.io/badge/pipeline-14_stages-orange)](https://github.com/a-yuanwei/OperitForge/tree/main/deep-research-agent)
[![Gates](https://img.shields.io/badge/quality-15_gates-red)](https://github.com/a-yuanwei/OperitForge/tree/main/deep-research-agent)
[![Audit](https://img.shields.io/badge/audit-passed-success)](https://github.com/a-yuanwei/OperitForge/tree/main/deep-research-agent)

---

## 产品定位

DeepResearch Agent 不是搜索引擎包装器，也不是简单的"联网搜索"工具。它是一个**完整的、带门控与质量闭环的学术级深度研究流水线引擎**。

**一句话：** 你给一个命题，它还你一份有权威分级、置信度标记、交叉验证和因果推演的结构化研究报告。

**核心差异：**

| 普通"联网搜索" | DeepResearch Agent |
|-------------|-------------------|
| 搜了就给 | 搜 → 验 → 分级 → 交叉验证 → 补搜 → 评分 → 编译 → 输出 |
| 无权威判断 | 双轨 Tier 0-4 权威分级（中/英独立匹配器） |
| 无质量保证 | 15 条门控（7基础+5中文专项+3强本地化） |
| 无置信度 | 六级标记 [V]/[L]/[U]/[X]/[?]/[-] |
| 断了就断 | 4 自动断点 + 零闸门恢复 + 错误分类全覆盖 |
| AI 不可感知 | AI 探针实时读取流水线状态，自主决策下一步 |

---

## 架构概览

```
┌─────────────────────────────────────────────────┐
│                    菜单层                         │
│  deep_research_mode (OFF ↔ FORCE)               │
│  解耦：菜单只设布尔开关，不触发逻辑                 │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│                AI 探针层                          │
│  check_research_status() — 零参数，始终可调用     │
│  → toggle / session / stage / progress           │
│  → summary / lastError / planIntegration         │
│  → sessionQuality { score, grade, breakdown }    │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│              流水线执行层 (14 阶段)                │
│                                                  │
│  INIT → QUERY_PLAN → SEARCH → FETCH → EXTRACT   │
│  → AUTHORITY_CLASSIFY → CROSS_VALIDATE           │
│  → GAP_DETECT → DEEP_ANALYZE → THESIS_BUILD     │
│  → QUALITY_GATE → CONFIDENCE_TAG → COMPILE       │
│  → OUTPUT                                        │
│                                                  │
│  4 条反馈边：                                     │
│  feedbackOnEmpty / feedbackOnGaps                │
│  feedbackOnFail / feedbackOnIncomplete           │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│              Resilience Spine (韧性脊柱)          │
│  _writeAutoCheckpoint — 4 注入点自动断点          │
│  resume_research      — 零闸门断点恢复            │
│  _classifyError       — 13 调用点错误分类全覆盖   │
│  InputGuard           — 参数必填校验统一工厂       │
└─────────────────────────────────────────────────┘
```

### 设计原则

| 原则 | 实现方式 |
|------|---------|
| **菜单写请求，调度器读请求** | 菜单只负责 `deep_research_mode` 布尔开关，不直接触发流水线 |
| **持久互斥锁 + 60s 幂等** | 同一查询只触发一次完整流水线，防重复 |
| **二进制触发，五态反馈** | OFF/READY/RUNNING/DONE/FAIL 通过 AI 探针暴露 |
| **中英双轨自适应** | `detectLanguage → resolveLanguagePriority → 选择权威分类器 → GatePolicy.enabledBy` |
| **AI 驱动推进，非全自动** | 每个阶段完成后 AI 自行判断 `_suggestNext`，非盲目自动执行 |
| **不可跳过强制入口** | `orchestrate_research` 是所有事实性研究的第一步，不可绕过 |

---

## 12 工具矩阵

| # | 工具名 | 职能 | 门控要求 | 调用约束 |
|---|--------|------|---------|---------|
| 0 | `check_research_status` | **AI 探针**：零参数读取完整流水线状态 | **无** | 始终可调用，不依赖任何前置条件 |
| 1 | `orchestrate_research` | **强制入口**：编排启动，不可跳过 | toggle=ON 才可推进 | 处理事实性消息的第一步 |
| 2 | `start_research` | 初始化状态机，构建语言自适应配置 | toggle=ON | 编排后可调用 |
| 3 | `advance_search_round` | 搜索轮次计数器推进（幂等保护） | toggle=ON | 仅新轮次开始时调用 |
| 4 | `ingest_source` | 来源规范化注入 + 自动权威分类 | toggle=ON | 每源一次，自动去重 |
| 5 | `classify_authority` | 中英双 Tier 0-4 权威分级 | toggle=ON | 可单独调用检查 URL |
| 6 | `check_quality_gate` | 15 条门控逐条检查（自适应激活） | toggle=ON | 搜索完成后调用 |
| 7 | `tag_confidence` | 六级置信度标记 [V]/[L]/[U]/[X]/[?]/[-] | toggle=ON | 门控通过后调用 |
| 8 | `deep_analyze` | V4 因果链推演（standard/deep） | toggle=ON | 证据充足后调用 |
| 9 | `create_checkpoint` | 手动研究快照 | toggle=ON | 与自动断点互补 |
| 10 | `sync_to_plan` | 进度同步为 plan-mode plantodo 格式 | toggle=ON | 计划模式下可用 |
| 12 | `resume_research` | **断点恢复**：从检查点重建会话 | **无**（零闸门） | 传入 session_id 即可 |

> 工具编号 12（跳过 11，与旧版 manifest 兼容）

---

## 工具详解

### 0. `check_research_status` — AI 探针

**设计意图：** AI 需要一个零成本、零前提的方式感知研究流水线的实时状态。本工具无参数、无门控、始终可调用。

```json
{
  "toggle": { "enabled": true, "mode": "force" },
  "session": {
    "active": true,
    "sessionId": "uuid-xxx",
    "currentStage": "SEARCH",
    "progress": "[深度研究] SEARCH | 轮次 2 | 来源 8"
  },
  "planIntegration": true,
  "planProgress": "25%",
  "sessionQuality": {
    "score": 78,
    "grade": "B",
    "breakdown": {
      "tierScore": 85, "gateScore": 80,
      "confidenceScore": 71, "quantScore": 67,
      "roundScore": 100,
      "weights": "tier:30% gate:25% conf:20% quant:15% rounds:10%"
    }
  }
}
```

| 关键字段 | 类型 | 说明 |
|---------|------|------|
| `toggle.mode` | string | `off` / `suggest` / `force` |
| `session.currentStage` | string | 当前 14 阶段名 |
| `sessionQuality.score` | int | 五维加权综合评分 (0-100) |
| `sessionQuality.grade` | string | A / B / C / D / F |

---

### 1. `orchestrate_research` — 强制入口（不可跳过）

> ⚠️ **设计哲学：** 不要由 AI 判断"是否需要深度研究"——让本工具判断。跳过本工具直接搜索 = 丧失权威分类、质量门控、来源归档。

```
参数：
  query               (required) — 用户原始消息 / 研究命题
  language_priority   (optional) — auto / zh / en
  plan_aware          (optional) — 是否启用计划模式集成
```

| 开关状态 | 行为 |
|---------|------|
| OFF | 快速拒绝 (~5ms)，返回提示引导用户开启 |
| ON (suggest) | 启动 INIT→QUERY_PLAN，返回编排方案 |
| FORCE | 一次性执行到 QUERY_PLAN 后自动关闭 |

---

### 4. `ingest_source` — 来源注入（自动权威分类）

每注入一个来源，自动触发 `classify_authority` 进行 Tier 分级，更新会话统计。同一 URL 自动去重。

```
参数：
  session_state  (required) — 当前会话状态对象
  source         (required) — { url, title, snippet, language, stance, extractedFacts, ... }
```

---

### 8. `deep_analyze` — V4 因果链推演

```
参数：
  thesis       (required) — 待分析命题
  variables    (required) — 相关变量数组
  known_facts  (required) — 已知事实数组
  depth        (optional) — standard / deep
```

- **standard：** A→B→C 直接因果链
- **deep：** A→B→C→D→E 二阶/三阶间接效应展开

---

### 12. `resume_research` — 断点恢复（零闸门）

从 `/sdcard/Operit/deep_research/pipeline/{session_id}/` 读取最近检查点，返回恢复后的 `sessionState` + `nextActions`。无任何门控限制——即使 toggle=OFF 也能恢复查看。

---

## 14 阶段流水线状态机

```
INIT ───────────► 初始化会话，构建语言配置
  │
QUERY_PLAN ────► 查询计划生成，中英文搜索策略
  │
SEARCH ────────► 多轮搜索（至少 2 轮通过 G2）
  │  └─ feedbackOnEmpty ──► QUERY_PLAN（搜索枯竭回退）
  │
FETCH ─────────► 抓取搜索结果页面内容
  │  └─ feedbackOnEmpty ──► SEARCH
  │
EXTRACT ───────► 事实抽取与结构化
  │
AUTHORITY_CLASSIFY► 中文 Tier 0-4 / 英文 Tier 0-4
  │
CROSS_VALIDATE ► 跨来源交叉验证
  │
GAP_DETECT ────► 信息缺口检测
  │  └─ feedbackOnGaps ──► SEARCH（发现缺口自动补搜）
  │
DEEP_ANALYZE ──► V4 因果链推演
  │
THESIS_BUILD ──► 论点构建与证据链拼装
  │
QUALITY_GATE ──► 15 条门控逐一检查
  │  └─ feedbackOnFail ──► GAP_DETECT（门控未过回退补源）
  │
CONFIDENCE_TAG ► 六级置信度标记
  │
COMPILE ───────► 最终报告编译
  │  └─ feedbackOnIncomplete ──► GAP_DETECT
  │
OUTPUT ────────► 研究完成，菜单复位
```

### 四条反馈边（自愈机制）

| 反馈边 | 触发条件 | 目标 | 效果 |
|--------|---------|------|------|
| `feedbackOnEmpty` | SEARCH/FETCH 枯竭 | QUERY_PLAN/SEARCH | 换搜索策略重试 |
| `feedbackOnGaps` | GAP_DETECT 发现缺口 | SEARCH | 自动扩充搜索 |
| `feedbackOnFail` | 门控未通过 | GAP_DETECT→SEARCH | 补源后重新验证 |
| `feedbackOnIncomplete` | COMPILE 报告不完整 | GAP_DETECT | 补充缺失部分 |

---

## 15 条质量门控 (7+5+3)

### 基础门控（7 条，始终激活）

| # | 门控项 | 阈值 | 说明 |
|---|--------|------|------|
| G0 | minSources | ≥ 6 | 最小编码来源数 |
| G1 | minRounds | ≥ 2 | 最小搜索轮次 |
| G2 | minQuantSources | ≥ 2 | 最小量化来源（含数据） |
| G3 | maxBiasRatio | ≤ 0.6 | 最大偏见占比 |
| G4 | primaryRatio | ≥ 0.3 | 一手来源最低比例 |
| G5 | factDensity | ≥ 0.4 | 事实密度最低阈值 |
| G6 | recencyCheck | 无过期 | 时效性检查 |

### 中文专项门控（5 条，语言自适应）

| # | 门控项 | 阈值 | 触发条件 |
|---|--------|------|---------|
| G7 | minCnTier01 | ≥ 1 | 中文话题 `needsCn` |
| G8 | minCnCases | ≥ 1 | 中文话题 `needsCn` |
| G9 | minEnSources | ≥ 2 | 中文话题 `strongCn`（对照源） |
| G10 | stanceBalance | 无极端偏 | 中文话题 `needsCn` |
| G11 | sourceDiversity | ≥ 3 种 | 中文话题 `needsCn` |

### 强本地化门控（3 条，关键词触发）

| # | 门控项 | 阈值 | 触发条件 |
|---|--------|------|---------|
| G12 | strongCnMinZhCount | ≥ 4 | 含"国产""自主""国内"等关键词 |
| G13 | policyAlignment | 已对齐 | 政策相关话题 |
| G14 | noBannedSources | 无封锁 | 强本地化研究 |

### 门控失败恢复闭环

```
QUALITY_GATE → feedbackOnFail → GAP_DETECT → feedbackOnGaps → SEARCH（补充搜索后重新验证）
```

---

## 双轨权威体系 (Dual Tier 0-4)

中英文各维护独立 Tier 0-4 权威分级匹配器，通过 `AuthorityPolicy` 策略引擎统一调度。

```
AuthorityPolicy.matchTier(source)
  ├── 提取 host + language
  ├── _langMatchers[lang](host, url, metadata)  ← 多态分发
  ├── 回退 matchEnTier（未匹配语言的兜底）
  ├── applyAuthorBoost（作者/机构加权）
  └── checkChannelMismatch（渠道一致性校验）
```

### 中文匹配器覆盖

| Tier | 来源类型 | 示例 | 得分 |
|------|---------|------|------|
| **0** | 政府/官方 | `.gov.cn`、`.edu.cn`、国家统计局、国务院、白皮书 | 1.0 |
| **1** | 国家级学术/标准 | 中科院、CAICT、信通院、CNKI 核心期刊 | 0.8 |
| **2** | 权威媒体/省级 | 新华社、人民日报、省级政府网站 | 0.5 |
| **3** | 知名社区/深度内容 | 知乎深度长文、CSDN 高赞、掘金热门 | 0.3 |
| **4** | 未匹配 | 其他/未分类 | 0.1 |

### 英文匹配器覆盖

| Tier | 示例 |
|------|------|
| **0** | `arxiv.org` (≥50 citations)、`nature.com`、`science.org`、`.gov`、`.edu` |
| **1** | `ieee.org`、`acm.org`、`mit.edu`、`stanford.edu` |
| **2** | `reuters.com`、`bloomberg.com`、`bbc.com` |
| **3** | `medium.com` (Verified)、知名技术博客 |
| **4** | 未匹配 |

### 扩展性

通过 `AuthorityPolicy.register('xx', matcherFn)` 可注册新语言匹配器，与现有双轨无缝并行。

---

## 语言自适应管道

```
用户输入 query
  │
  ▼
resolveLanguagePriority (auto/zh/en)
  │
  ▼
decomposeQuery → generateSearchPlan (中/英/双语策略)
  │
  ▼
detectCnAdaptive → 分析话题是否触发本地化需求
  │  ├─ needsCn: 中文话题
  │  ├─ strongCn: 强本地化（含"国产""自主"等关键词）
  │  └─ needsLocal: 需本地源
  │
  ▼
GatePolicy.enabledBy → 基于 adaptResult 直接 push 门控
  ├─ needsCn/needsLocal → push G8, G11, G12
  └─ strongCn/strongLocal → push G9
```

> **v4.4.1 修复：** `enabledBy` 回退到 v3.3.2 的直接 push 逻辑，不再遍历全部 language profile。消除了添加新语言 profile 时可能误触发 CN 门控的隐性缺陷。

---

## 六级置信度标记

| 符号 | 含义 | 触发条件 |
|------|------|---------|
| `[V]` | VERIFIED 已验证 | Tier 0-1 来源 + 2+ 独立交叉验证 + 无矛盾 |
| `[L]` | LIKELY 很可能 | Tier 0-2 来源 + ≥1 交叉验证 + 多数源一致 |
| `[U]` | UNCERTAIN 不确定 | 来源不足或 Tier 偏高，无法形成充分证据链 |
| `[X]` | DISPUTED 有争议 | 权威来源之间存在实质性矛盾 |
| `[?]` | UNVERIFIABLE 无法验证 | 声明无法通过可获取的公开来源验证 |
| `[-]` | UNMARKED 未标记 | 默认初始状态 |

---

## 五维加权评分

`_scoreSession` 在 `check_research_status` 和每个自动检查点中暴露综合评分。

| 维度 | 权重 | 计算方式 |
|------|------|---------|
| **权威层级 (Tier)** | 30% | 加权 Tier 分布：Tier0×5 + Tier1×4 + Tier2×3 + Tier3×2 + Tier4×1 |
| **质量门控 (Gate)** | 25% | 通过门数 / 总门数 × 100 |
| **置信度 (Confidence)** | 20% | 标记符号折算：[V]=100 / [L]=75 / [U]=40 / 其他=20 |
| **量化来源 (Quant)** | 15% | 定量数据源 / min(6, totalSources) × 100 |
| **搜索轮次 (Rounds)** | 10% | rounds ≥ 2 → 100，否则 rounds × 50 |

### 等级映射

| 分数 | 等级 | 含义 |
|------|------|------|
| ≥ 90 | **A** | 优秀：权威源充分，门控全通过，高置信度 |
| 75-89 | **B** | 良好：多数门控通过，置信度可接受 |
| 60-74 | **C** | 合格：基本门控通过，存在信息缺口 |
| 40-59 | **D** | 不足：来源不足或权威性低 |
| < 40 | **F** | 不合格：无法形成有效研究 |

---

## Resilience Spine（韧性脊柱）

```
          ┌──────────────────────────────┐
          │  _writeAutoCheckpoint         │
          │  4 注入点（fail-soft）         │
          │  start / orchestrate          │
          │  ingest / advance             │
          │  路径：/sdcard/Operit/        │
          │  deep_research/pipeline/{id}/ │
          └─────────────┬────────────────┘
                        │
          ┌─────────────▼────────────────┐
          │  _classifyError               │
          │  13 调用点全覆盖               │
          │  12 工具 catch + 1 工厂 catch  │
          │  → { code, cat, hint }        │
          └─────────────┬────────────────┘
                        │
          ┌─────────────▼────────────────┐
          │  resume_research（零闸门）     │
          │  传入 session_id              │
          │  返回 sessionState            │
          │      + nextActions            │
          └──────────────────────────────┘
```

| 特性 | 实现 |
|------|------|
| 自动断点 | 4 状态变更工具注入，断电不丢进度 |
| 容量保护 | 每会话保留最近 50 个自动检查点，自动清理 |
| 错误分类全覆盖 | 13 个调用点，12 个错误码 + 1 兜底 |
| InputGuard | `_wrapTool` 工厂统一参数必填校验 |
| fail-soft | 断点写入失败不中断工具执行 |
| 版本可追溯 | 每个检查点记录 `version: 'v4.4.1'` |

---

## 计划模式集成

| 工具 | 计划模式行为 |
|------|------------|
| `orchestrate_research` | `plan_aware=true` 时注入 `planIntegration` + `planProgress` |
| `check_research_status` | 返回 `planIntegration` / `planProgress` / `planTodoAvailable` |
| `sync_to_plan` | 研究进度 → plantodo 格式（snapshot / complete） |

---

## 使用场景

### 场景 1：事实核查与研究验证

**输入：** AI 收到一条事实性声明，需验证真实性。

```
check_research_status()                          → 确认 toggle=ON
orchestrate_research(query="声称内容")            → INIT → QUERY_PLAN
start_research(query="声称内容")                  → SEARCH
advance_search_round(sessionState)               → rounds=1
ingest_source(sessionState, source1)             → 自动 Tier 分级
ingest_source(sessionState, source2...N)         → 累积来源
advance_search_round(sessionState)               → rounds=2 (G2✓)
check_quality_gate(sessionState, topic)          → 通过/失败统计
tag_confidence(assertion, sources)               → [V]/[L]/[U]/[X]/[?]
check_research_status()                          → sessionQuality
```

**预期产出：** 每个事实附带置信度标记，所有来源附带 Tier 分级，综合评分 A-F。

---

### 场景 2：学术文献综述

**输入：** 对特定学术主题进行系统性文献综述。

关键工具调用：
```
orchestrate_research(query="transformer注意力机制最新进展", plan_aware=true)
  → 自动中英双语搜索
  → G9 确保英文源 ≥ 2
  → G11 确保来源多样性 ≥ 3 种

deep_analyze(thesis="注意力机制已收敛到几个主流范式",
             variables=[...], known_facts=[...], depth="deep")
  → 因果链推演技术路线分化原因

sync_to_plan(sessionState, action="snapshot")
  → 同步到计划模式，plantodo 可追踪
```

**预期产出：** 结构化文献综述，技术路线因果图，计划模式可追踪进度。

---

### 场景 3：技术竞争情报

**输入：** 分析某技术赛道的竞争格局。

```
orchestrate_research(query="RISC-V生态2025年竞争格局")
  → 中英双语搜索
  → 自动 classify_authority 对每个来源打分

check_quality_gate(sessionState, topic)
  → G9 确保英文源 ≥ 2
  → G11 确保来源多样性

deep_analyze(thesis="RISC-V碎片化风险", variables=[...], known_facts=[...])
  → 因果链分析碎片化根源

tag_confidence(assertion, sources)
  → 标记每个竞争论断的可信度
```

**预期产出：** 技术路线图 + 竞争态势矩阵，每个论断有置信度标记，来源有权威分级。

---

### 场景 4：政策分析

**输入：** 分析政策文本及其影响。

```
orchestrate_research(query="中国人工智能法对产业的影响", language_priority="zh")
  → 自动激活 G7-G11 中文专项门控
  → G7: minCnTier01 ≥ 1（政府/官方源必备）
  → G8: minCnCases ≥ 1（中国案例必备）

ingest_source(sessionState, {url:"xxx.gov.cn", ...})
  → 自动 Tier 0 分级

deep_analyze(thesis="AI法→产业合规成本上升", ...)
  → 因果链推演政策传导路径
```

**预期产出：** Tier 0-1 权威源优先，政策传导因果图，强本地化门控全通过。

---

### 场景 5：跨会话持续性研究

**输入：** 研究被中断（断电/切换会话），需要从断点恢复。

```
会话 A（中断前）：
  SEARCH 阶段第 2 轮
  自动断点：/sdcard/Operit/deep_research/pipeline/{id}/checkpoint_auto_SEARCH_3.json

会话 B（恢复）：
  check_research_status()
    → toggle=ON, session.active=true

  resume_research(session_id="{id}")
    → 返回 sessionState + nextActions
    → _suggestNext: "ingest_source" 或 "advance_search_round"

  继续：ingest_source(...) → advance_search_round(...) → ...
```

**预期产出：** 无缝恢复，sessionQuality 跨会话累积评分。

---

## 快速开始

### 在 Operit AI 中部署

1. 将 `deep-research-agent/` 目录放入 Operit 的 Packages 目录
2. 重启 Operit AI
3. 在输入框菜单中开启 Deep Research 开关（OFF → FORCE）
4. 发送任意事实性消息，AI 会自动调用 `orchestrate_research`

### AI 视角的典型调用序列

```javascript
// 1. 探针（始终先调用，零成本）
check_research_status()
→ { toggle: {enabled:true, mode:"force"}, session: null }

// 2. 编排启动（强制入口，不可跳过）
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
├── manifest.json                             # 包元数据（版本/入口/依赖）
├── build.sh                                  # 构建脚本（cat 拼接 + 断言校验）
├── README.md                                 # 本文件
├── src/
│   ├── 00_core.js                            # METADATA + 常量 + IIFE 入口 + 核心框架
│   │   ├── KEY / STAGE_ORDER / ERROR         #   v3.7.0 常量标准化
│   │   ├── Toggle Integration                #   读写 Operit ApiPreferences
│   │   ├── _classifyError / _writeAutoCheckpoint / _wrapTool
│   │   ├── _scoreSession                     #   v4.2.0 五维评分
│   │   └── advanceSearchRound                #   幂等轮次推进
│   ├── 01_policies.js                        # 权威策略 + 语言策略 + 门控策略
│   │   ├── AuthorityPolicy (matchTier/score/isPreferred/register)
│   │   ├── LanguagePolicy (detect/buildQuery/listProfiles/adapt)
│   │   └── GatePolicy (enabledBy)            #   v4.4.1 回退直接 push
│   ├── 02_store.js                           # 存储层
│   └── 03_main.js                            # 12 工具实现 + exports
├── dist/
│   └── deep_research_agent_v3_4.js           # 2327 行单文件产物
└── main.js                                   # Operit 入口
```

---

## v4.4.1 变更说明

### 修复：Bug #1 — GatePolicy.enabledBy 遍历全语言 profile 的隐性缺陷

**位置：** `src/01_policies.js` L80-100

**根因：** v3.4.0 将 `enabledBy` "multilingualized" 为遍历 `LanguagePolicy.listProfiles()` 返回的所有 language profile 的 `gateHints`。在仅有 `zh`/`en` 两个 profile 时无实际问题，但未来添加 `ja`/`ko` 等 profile 时，其 `gateHints` 可能误触发 G8/G11/G12（CN 门控）。

**修复：** 回退到 v3.3.2 的直接 push 逻辑——基于 `adaptResult.needsCn`/`strongCn` 直接决定 push 哪些门控，不再遍历 profile 列表。

```diff
- const profiles = LanguagePolicy.listProfiles();
- for (let i = 0; i < profiles.length; i++) {
-   const hints = profiles[i].gateHints || {};
-   if (hints.preferZh || hints.requireLocal) {
-     gates.push('G8', 'G11', 'G12');
-   }
-   if (hints.requireLocalSources) {
-     gates.push('G9');
-   }
- }
- // dedup
- gates = [...new Set(gates)];
+ if (adaptResult.needsCn || adaptResult.needsLocal) {
+   gates.push('G8', 'G11', 'G12');
+ }
+ if (adaptResult.strongCn || adaptResult.strongLocal) {
+   gates.push('G9');
+ }
```

**影响范围：** 无 API 变更，`GatePolicy.enabledBy` 调用方 (`orchestrate_research` / `start_research`) 签名和行为完全兼容。`LanguagePolicy.listProfiles()` 保留作为公开 API，当前零调用方。

### 版本演进

| 版本 | Phase | 核心交付 | 工具数 |
|------|-------|---------|--------|
| v3.6.1 | 基线 | 10 工具，14 阶段流水线，15 门控，中英双轨 | 10 |
| v3.7.0 | Phase 0 | 常量标准化 (KEY/STAGE_ORDER/ERROR)，`_wrapTool` 工厂，`check_research_status` | 11 |
| v3.8.0 | Phase 1 | `summary` 字段，版本三阶标记 | 11 |
| v3.9.0 | Phase 2 | Resilience Spine：`_classifyError` + `_writeAutoCheckpoint` + `resume_research`，Error Taxonomy 12 码 | 12 |
| v4.0.0 | Phase 3 | 12 工具 `_classifyError` 全覆盖，4 工具注入 `autoCheckpoint` | 12 |
| v4.1.0 | Phase 4 | Plan-Mode 深度集成：`planIntegration`/`planProgress`/`planTodoAvailable` | 12 |
| v4.2.0 | Phase 5 | `_scoreSession` 五维加权评分，`sessionQuality` 入驻探针与检查点，审计评分 19.60/20 | 12 |
| v4.4.0 | Phase 6 | Bug 审计，`listProfiles` 死代码识别，构建断言强化 | 12 |
| **v4.4.1** | **Phase 7** | **Bug #1 修复：GatePolicy.enabledBy 回退 v3.3.2 直接 push** | **12** |

---

## 技术指标

| 指标 | 数值 |
|------|------|
| 工具总数 | 12 |
| 流水线阶段 | 14 |
| 质量门控 | 15（7 基础 + 5 中文专项 + 3 强本地化） |
| 置信度等级 | 6（V / L / U / X / ? / -） |
| 权威 Tier | 5（0-4，中英独立） |
| 错误分类码 | 13（12 语义 + 1 兜底） |
| 支持语言 | 2（zh / en，可扩展） |
| 评分维度 | 5（Tier:30% Gate:25% Conf:20% Quant:15% Rounds:10%） |
| 自动断点注入点 | 4（start / orchestrate / ingest / advance） |
| 错误分类调用点 | 13（12 工具 catch + 1 工厂 catch） |
| dist 行数 | 2,327 |
| 构建断言 | BUILD_ASSERT_V1（key 一致性）+ V2（工具数 ≥ 12）+ V3（main↔dist KEY 匹配） |
| 断点容量保护 | 每会话 50 个自动检查点 |
| 幂等保护 | 60s 互斥锁 |

---

## 架构决策记录 (ADR)

### ADR-001：常量标准化（v3.7.0）
**决策：** KEY、STAGE_ORDER、ERROR 作为全局常量注入 METADATA 与 IIFE 之间。
**理由：** 消除 `DEFAULT_STAGES` 与 `STAGE_CONFIG.order` 之间的双源不一致风险。`STAGE_CONFIG.order = STAGE_ORDER` 实现统一。

### ADR-002：探针工具零门控（v3.7.0）
**决策：** `check_research_status` 无 toggle 门控，始终可调用。
**理由：** AI 需要随时感知研究状态，不应因开关状态而阻断探针。

### ADR-003：强制入口工具（v3.3.0）
**决策：** `orchestrate_research` 设计为"不可跳过"的第一步。
**理由：** 跳过编排直接搜索 = 丧失权威分类、质量门控和来源归档。让工具判断是否需要研究，而非 AI 判断。

### ADR-004：fail-soft 断点（v3.9.0）
**决策：** `_writeAutoCheckpoint` 失败不中断工具执行。
**理由：** 断点是增强功能而非核心路径，写入失败不应阻断研究流水线。

### ADR-005：菜单仅存布尔（v3.7.0）
**决策：** `MENU_STATE_KEY` 仅存储 boolean（运行时/持久），不存 JSON。
**理由：** Operit `ApiPreferences` 仅支持 `getFeatureToggleBlocking` / `setFeatureToggleBlocking` 布尔接口。复杂状态通过 `check_research_status` 以文本传递。

### ADR-006：回退 v3.3.2 直接 push（v4.4.1）
**决策：** `GatePolicy.enabledBy` 从遍历 `listProfiles()` 回退到基于 `adaptResult` 的直接 push。
**理由：** 遍历全 profile 的 gateHints 在新增语言 profile 时可能误触发不相关门控。直接 push 语义更精确、更安全。`listProfiles()` 保留作为公开 API。

---

## 许可与仓库

本工具包为 Operit AI 平台专用插件。

仓库：`a-yuanwei/OperitForge`
路径：`deep-research-agent/`

---

*DeepResearch Agent v4.4.1 — 不是搜了就给，而是验了才信。*