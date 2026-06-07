/* METADATA
{
  "name": "deepsight_v4_4_2",
  "display_name": {
    "zh": "Deepsight 工具 v4.4.2",
    "en": "Deepsight Tools v4.4.2"
  },
  "description": {
    "zh": "12 个工具：check_research_status / resume_research / start_research / classify_authority / check_quality_gate / tag_confidence / deep_analyze / create_checkpoint / sync_to_plan / orchestrate_research / ingest_source / advance_search_round",
    "en": "12 tools: check_research_status / resume_research / start_research / classify_authority / check_quality_gate / tag_confidence / deep_analyze / create_checkpoint / sync_to_plan / orchestrate_research / ingest_source / advance_search_round"
  },
  "enabledByDefault": true,
  "category": "research",
  "author": "Operit",
  "version": "4.4.2",
  "tools": [
    { "name": "check_research_status", "description": { "zh": "AI 探针·零参数·始终可调用。返回结构化状态块：开关状态/流水线阶段/搜索轮次/来源数量/最后错误。可选传入 session_state 获取活跃会话详情。", "en": "AI probe · zero params · always callable. Returns structured status block: toggle state / pipeline stage / search rounds / source count / last error. Optionally pass session_state for active session details." }, "parameters": [{"name":"session_state","description":{"zh":"可选：当前会话状态对象","en":"Optional: current session state object"},"type":"object","required":false}] },
    { "name": "resume_research", "description": { "zh": "断点恢复·传入 session_id 从最近检查点恢复研究。返回恢复后的 sessionState 和 nextActions。", "en": "Resume from checkpoint · pass session_id to restore research from the latest checkpoint. Returns restored sessionState and nextActions." }, "parameters": [{"name":"session_id","description":{"zh":"要恢复的会话 ID","en":"Session ID to resume"},"type":"string","required":true}] },
    { "name": "start_research", "description": { "zh": "启动深度搜索，初始化 14 阶段状态机。支持 plan_aware 模式。", "en": "Start research and initialize the 14-stage FSM. Plan-aware mode supported." }, "parameters": [{"name":"query","description":{"zh":"研究命题/查询字符串","en":"Research query string"},"type":"string","required":true},{"name":"language_priority","description":{"zh":"语言优先级：auto/zh/en","en":"Language priority: auto/zh/en"},"type":"string","required":false},{"name":"plan_aware","description":{"zh":"是否启用计划模式集成","en":"Enable plan-mode integration"},"type":"boolean","required":false}] },
    { "name": "classify_authority", "description": { "zh": "中英文双 Tier 0-4 权威分类", "en": "CN/EN dual Tier 0-4 authority classification" }, "parameters": [{"name":"url","description":{"zh":"要分类的 URL","en":"URL to classify"},"type":"string","required":true},{"name":"metadata","description":{"zh":"可选的来源元数据","en":"Optional source metadata"},"type":"object","required":false}] },
    { "name": "check_quality_gate", "description": { "zh": "15 条质量门控（7+5+3）", "en": "15 quality gates (7+5+3)" }, "parameters": [{"name":"session_state","description":{"zh":"当前会话状态对象","en":"Current session state object"},"type":"object","required":true},{"name":"topic","description":{"zh":"研究主题","en":"Research topic"},"type":"string","required":true}] },
    { "name": "tag_confidence", "description": { "zh": "六级置信度标记 [V][L][U][X][?][-]", "en": "6-level confidence tagging" }, "parameters": [{"name":"assertion","description":{"zh":"待标记断言","en":"Assertion to tag"},"type":"string","required":true},{"name":"sources","description":{"zh":"支撑来源数组","en":"Supporting sources array"},"type":"array","required":true}] },
    { "name": "deep_analyze", "description": { "zh": "V4 统一因果链推演", "en": "V4 unified causal-chain analysis" }, "parameters": [{"name":"thesis","description":{"zh":"待分析命题","en":"Thesis to analyze"},"type":"string","required":true},{"name":"variables","description":{"zh":"相关变量数组","en":"Relevant variables array"},"type":"array","required":true},{"name":"known_facts","description":{"zh":"已知事实数组","en":"Known facts array"},"type":"array","required":true},{"name":"depth","description":{"zh":"推演深度：standard/deep","en":"Analysis depth: standard/deep"},"type":"string","required":false}] },
    { "name": "create_checkpoint", "description": { "zh": "研究状态快照", "en": "Research state snapshot" }, "parameters": [{"name":"session_state","description":{"zh":"当前会话状态对象","en":"Current session state object"},"type":"object","required":true}] },
    { "name": "sync_to_plan", "description": { "zh": "将研究进度同步为计划模式可追踪的 plantodo 格式", "en": "Sync research progress to plan-mode-compatible plantodo format" }, "parameters": [{"name":"session_state","description":{"zh":"当前会话状态对象","en":"Current session state object"},"type":"object","required":true},{"name":"action","description":{"zh":"操作：snapshot（快照）/ complete（完成）","en":"Action: snapshot/complete"},"type":"string","required":false}] },
    { "name": "orchestrate_research", "description": { "zh": "【强制入口·不可跳过】处理事实性消息的第一步。立即返回开关状态：OFF→5ms快速拒绝并提示开启；ON→启动14阶段流水线返回编排方案（INIT→QUERY_PLAN完成，其余阶段需AI逐步调用工具推进）。参数query=用户原话。不要评估'是否需要'——让本工具判断。跳过本工具直接搜索=丧失权威分类、质量门控和来源归档。", "en": "[MANDATORY ENTRY · DO NOT SKIP] First step for any factual message. Returns toggle status instantly: OFF→5ms rejection with hint; ON→launches 14-stage pipeline with orchestration plan (INIT→QUERY_PLAN done, remaining stages require AI to advance). Pass user's original message in query. Do NOT evaluate 'is this needed' — let this tool decide. Bypassing this tool = no authority classification, no quality gates, no source archiving." }, "parameters": [{"name":"query","description":{"zh":"用户原始消息/研究命题","en":"User's original message / research query"},"type":"string","required":true},{"name":"language_priority","description":{"zh":"语言优先级：auto/zh/en","en":"Language priority: auto/zh/en"},"type":"string","required":false},{"name":"plan_aware","description":{"zh":"是否启用计划模式集成","en":"Enable plan-mode integration"},"type":"boolean","required":false}] },
    { "name": "ingest_source", "description": { "zh": "将外部搜索结果规范化并注入研究会话状态，自动进行权威分类并更新搜索统计", "en": "Normalize and ingest external search results into session state with automatic authority classification and search-statistics updates" }, "parameters": [{"name":"session_state","description":{"zh":"当前会话状态对象","en":"Current session state object"},"type":"object","required":true},{"name":"source","description":{"zh":"规范化的来源对象（url/title/snippet/language/stance/extractedFacts 等）","en":"Normalized source object (url/title/snippet/language/stance/extractedFacts etc.)"},"type":"object","required":true}] },
    { "name": "advance_search_round", "description": { "zh": "推进搜索轮次计数器。仅在开始新一轮真实搜索时调用（非每次源注入）。调用两次以通过 G2 质量门控（rounds >= 2）。", "en": "Advance the search-round counter. Call only when starting a new round of real search (not for every source ingestion). Call it twice to satisfy the G2 quality gate (rounds >= 2)." }, "parameters": [{"name":"session_state","description":{"zh":"当前会话状态对象","en":"Current session state object"},"type":"object","required":true}] }
  ]
 }
 */
 
 /* ═══════════════════════════════════════════════════════════
  * RETURN CONTRACT (v4.4.2)
  *
  * All 12 tools MUST return one of these shapes:
  *
  *   SUCCESS:
  *     { success: true, data: <T> }
  *     { success: true, sessionState: <SS> }
  *     { success: true, data: <T>, sessionState: <SS> }
  *
  *   FAILURE:
  *     { success: false, error: <string>, _errorCode: <code>, _errorCategory: <cat> }
  *
  *   META fields (appended by _wrapTool, never set in impl):
  *     _suggestNext  : string   — next suggested tool name
  *     _pipeline     : string   — human-readable pipeline one-liner
  *     plantodo      : string   — plan-mode integration markup
  *
  *   New tools added to this package must follow this contract.
 *   Existing tools are aligned with this contract as of v4.4.2.
 * ═══════════════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════════════════
// Single Source of Truth — Key Names, Error Codes, Stage Order
// v3.7.0 Phase 0: constants injected between METADATA and IIFE.
// These are global variables, accessible inside the IIFE scope.
// ═══════════════════════════════════════════════════════════
var KEY = {
    TOGGLE:       'deep_research_mode',
    FORCE:        'deep_research_mode_force',
    RUN_PENDING:  'deep_research_run_pending',
    LAST_DONE:    'deep_research_last_done',
    LAST_FAILED:  'deep_research_last_failed',
    EXEC_LOCK:    'deep_research_exec_lock',
    MENU_STATE:   'deep_research_menu_state'
};

var STAGE_ORDER = [
    'INIT','QUERY_PLAN','SEARCH','FETCH','EXTRACT',
    'AUTHORITY_CLASSIFY','CROSS_VALIDATE','GAP_DETECT',
    'DEEP_ANALYZE','THESIS_BUILD','QUALITY_GATE',
    'CONFIDENCE_TAG','COMPILE','OUTPUT'
];

var ERROR = {
    code: {
        GATE_OFF:           { cat: 'FATAL',     hint: '请在菜单中选择开启深度搜索开关' },
        NO_SESSION:         { cat: 'FATAL',     hint: '需先调用 orchestrate_research 启动研究' },
        IDEMPOTENT_BLOCK:   { cat: 'INFO',      hint: '研究已在进行中' },
        SEARCH_TIMEOUT:     { cat: 'RETRYABLE', hint: '搜索超时，可重试' },
        RATE_LIMITED:       { cat: 'RETRYABLE', hint: '速率限制，稍后重试' },
        SOURCE_UNREACHABLE: { cat: 'DEGRADED',  hint: '来源不可达，已跳过' },
        GATE_FAILED:        { cat: 'DEGRADED',  hint: '质量门控未通过' },
        PARSE_ERROR:        { cat: 'FATAL',     hint: '输入参数无效' },
        INTERNAL:           { cat: 'FATAL',     hint: '内部错误' },
        CHECKPOINT_WRITE_FAILED: { cat: 'DEGRADED',  hint: '自动断点写入失败，研究可继续' },
        CHECKPOINT_READ_FAILED: { cat: 'FATAL',     hint: '断点文件读取失败，无法恢复' },
        RESUME_NO_CHECKPOINT: { cat: 'FATAL',     hint: '未找到断点文件，无法恢复研究' },
        INPUT_INVALID:      { cat: 'FATAL',     hint: '输入参数校验失败，请检查必填字段' },
        LOCK_MISSING:       { cat: 'FATAL',     hint: '执行锁未设置，请重新开关菜单' },
        NO_RUN_PENDING:     { cat: 'INFO',      hint: '无待执行请求，请在输入菜单中开启深度搜索' }
    }
};

 (function() {
    'use strict';

    // ── Toggle Integration (v3.3.1 → v3.7.0) ─────────────────────────
    // v3.7.0: key names now reference KEY.* from the canonical constants block.
    var TOGGLE_KEY = KEY.TOGGLE;
    var FORCE_KEY  = KEY.FORCE;
    var RUN_PENDING_KEY = KEY.RUN_PENDING;
    var LAST_DONE_KEY   = KEY.LAST_DONE;
    var LAST_FAILED_KEY = KEY.LAST_FAILED;
    var EXEC_LOCK_KEY   = KEY.EXEC_LOCK;

    var ApiPreferences = Java.com.ai.assistance.operit.data.preferences.ApiPreferences;

    function getAppContext() {
        var fn = Java.getApplicationContext;
        return typeof fn === "function" ? fn() : null;
    }

    function readToggle() {
        var ctx = getAppContext();
        if (!ctx) return { enabled: false, error: "no_context" };
        var val = Boolean(ApiPreferences.getFeatureToggleBlocking(ctx, TOGGLE_KEY, false));
        return { enabled: val };
    }

    function readMode() {
        var ctx = getAppContext();
        if (!ctx) return "off";
        if (!Boolean(ApiPreferences.getFeatureToggleBlocking(ctx, TOGGLE_KEY, false))) return "off";
        if (Boolean(ApiPreferences.getFeatureToggleBlocking(ctx, FORCE_KEY, false))) return "force";
        return "suggest";
    }

    // v4.2.1: menuState param — 'OUTPUT' (pipeline done, default) or 'RUNNING' (FORCE window closed, pipeline alive)
    function closeToggle(menuState) {
        var ctx = getAppContext();
        if (!ctx) return;
        // TOGGLE_KEY preserved: main switch stays ON for pipeline duration.
        // Only clear one-shot control keys (FORCE, RUN_PENDING, EXEC_LOCK).
        ApiPreferences.setFeatureToggleBlocking(ctx, FORCE_KEY, false);
        ApiPreferences.setFeatureToggleBlocking(ctx, RUN_PENDING_KEY, false);
        ApiPreferences.setFeatureToggleBlocking(ctx, EXEC_LOCK_KEY, false);
        // v4.2.1: menuState allows caller to differentiate FORCE-window-close vs pipeline-complete
        _updateMenuState(menuState || 'OUTPUT');
    }

    // v3.3.3: Tool-level toggle gate. v3.6.1: _activeSessionId fallback.
    function requireToggleOn() {
        var mode = readMode();
        if (mode === 'off') {
            // Defense-in-depth: if an orchestrated session is active, allow tools through
            if (_activeSessionId) {
                return { blocked: false, mode: 'session_fallback', note: 'Active session fallback' };
            }
            return { blocked: true, mode: 'off', error: 'Deep Research 开关处于 OFF 状态。请在输入菜单中开启 Deep Research 后重试。' };
        }
        return { blocked: false, mode: mode };
    }

    // v3.6.1: Defense-in-depth session tracking.
    // Set by orchestrate_research FORCE path, cleared on new orchestration.
    // Provides fallback if TOGGLE_KEY is unexpectedly cleared during pipeline.
    var _activeSessionId = null;

    function setActiveSession(sessionId) {
        _activeSessionId = sessionId;
    }

    function clearActiveSession() {
        _activeSessionId = null;
    }

    // ═══════════════════════════════════════════════════════════
    // v3.7.0 Phase 0: Core framework additions
    // ═══════════════════════════════════════════════════════════

    // ── _errorBody: standardized error response ──
    function _errorBody(errDef) {
        return '[ERROR:' + errDef.cat + '] ' + errDef.hint;
    }

    // ── _pipelineStatus: human-readable pipeline one-liner ──
    function _pipelineStatus(ss) {
        if (!ss) return '[深度研究] 就绪';
        var stage = ss.currentStage || '?';
        var round = (ss.search && typeof ss.search.rounds === 'number') ? ss.search.rounds : 0;
        var nSrc  = (ss.sources && ss.sources.length) || 0;
        return '[深度研究] ' + stage + ' | 轮次 ' + round + ' | 来源 ' + nSrc;
    }

    // ── _updateMenuState: write boolean MENU_STATE_KEY ──
    // Operit ApiPreferences only supports boolean values.
    // Rich state (stage name, round, sources) is only available via check_research_status.
    function _updateMenuState(stage) {
        var ctx = getAppContext();
        if (!ctx) return;
        try {
            var MENU_STATE_KEY = KEY.MENU_STATE;
            // true = pipeline running (not OUTPUT); false = idle/completed
            ApiPreferences.setFeatureToggleBlocking(ctx, MENU_STATE_KEY, stage !== 'OUTPUT');
        } catch(e) {
            // Silent degradation — menu state is best-effort
        }
    }

 // ── _classifyError: map JS exceptions to ERROR codes (v3.9.0 Phase2) ──
      function _classifyError(e) {
          var msg = (e && e.message) ? String(e.message) : '';
          if (msg.indexOf('timeout') !== -1 || msg.indexOf('Timeout') !== -1) return { code: 'SEARCH_TIMEOUT', cat: ERROR.code.SEARCH_TIMEOUT.cat, hint: ERROR.code.SEARCH_TIMEOUT.hint };
          if (msg.indexOf('rate limit') !== -1 || msg.indexOf('Rate') !== -1 || msg.indexOf('429') !== -1) return { code: 'RATE_LIMITED', cat: ERROR.code.RATE_LIMITED.cat, hint: ERROR.code.RATE_LIMITED.hint };
          if (msg.indexOf('unreachable') !== -1 || msg.indexOf('ENOTFOUND') !== -1) return { code: 'SOURCE_UNREACHABLE', cat: ERROR.code.SOURCE_UNREACHABLE.cat, hint: ERROR.code.SOURCE_UNREACHABLE.hint };
          if (msg.indexOf('parse') !== -1 || msg.indexOf('JSON') !== -1) return { code: 'PARSE_ERROR', cat: ERROR.code.PARSE_ERROR.cat, hint: ERROR.code.PARSE_ERROR.hint };
          return { code: 'INTERNAL', cat: ERROR.code.INTERNAL.cat, hint: ERROR.code.INTERNAL.hint };
      }
 
     // ── _writeAutoCheckpoint: fail-soft auto checkpoint via Java I/O (v3.9.0 Phase2) ──
     var _autoCheckpointSeq = 0;
     function _writeAutoCheckpoint(stage, ss) {
         if (!ss || !ss.sessionId) return;
         try {
             var dir = '/sdcard/Operit/deep_research/pipeline/' + ss.sessionId + '/';
             var fDir = new java.io.File(dir);
             if (!fDir.exists()) fDir.mkdirs();
             _autoCheckpointSeq++;
             var filename = dir + 'checkpoint_auto_' + stage + '_' + _autoCheckpointSeq + '.json';
             var ckpt = {
                 checkpointId: 'auto_' + stage + '_' + _autoCheckpointSeq,
                 timestamp: new Date().toISOString(),
                 version: 'v4.4.2',
                 stage: stage,
                 currentStage: ss.currentStage,
                 searchRounds: (ss.search && ss.search.rounds) || 0,
                sourceCount: (ss.sources && ss.sources.length) || 0,
                sessionQuality: _scoreSession(ss), // v4.2.0 Phase5
                sessionState: ss
             };
             var writer = null;
             try {
                 writer = new java.io.FileOutputStream(filename);
                 var jsonStr = JSON.stringify(ckpt);
                 writer.write(new java.lang.String(jsonStr).getBytes('UTF-8'));
             } finally {
                 if (writer) { try { writer.close(); } catch(ignored) {} }
             }
             // Capacity protection: keep last 50 auto-checkpoints
             var files = fDir.listFiles();
             if (files && files.length > 50) {
                 var autoFiles = [];
                 for (var i = 0; i < files.length; i++) {
                     if (files[i].getName().indexOf('checkpoint_auto_') === 0) {
                         autoFiles.push(files[i]);
                     }
                 }
                 if (autoFiles.length > 50) {
                     autoFiles.sort(function(a, b) { return a.lastModified() - b.lastModified(); });
                     for (var j = 0; j < autoFiles.length - 50; j++) {
                         try { autoFiles[j].delete(); } catch(ignored) {}
                     }
                 }
             }
         } catch(e) {
             // fail-soft: auto-checkpoint failure must not break tool execution
         }
     }
 
     // ── _wrapTool: declarative tool wrapper (v4.4.0 industrial) ──
     // Consolidates: toggle gate + InputGuard + ErrorTaxonomy + _suggestNext + autoCheckpoint + pipeline status.
     // Eliminates 3 layers of manual boilerplate (gate/guard/catch) per tool.
     // @param {object} spec
     //   spec.name            — string, tool name for error trace
     //   spec.impl            — async function(params, sessionState) → result object
     //   spec.checkToggle     — bool, reject if toggle is OFF
     //   spec.requiresSession — bool, reject if no active sessionId
     //   spec.injectPipeline  — bool, prepend _pipelineStatus to result
     //   spec.stage           — string, optional stage label for menu state
     //   spec.autoCheckpoint  — bool, auto-write checkpoint after success
     //   spec.params          — array, param schemas delegated to _inputGuard
     //   spec.suggestNext     — string, tool name for _makeSuggestNext injection
     // @returns {function}    — async function(params) → { success, ... }
     function _wrapTool(spec) {
         return async function(params) {
             // 1. Toggle gate
             if (spec.checkToggle) {
                 var gate = requireToggleOn();
                 if (gate.blocked) return gate;
             }
             // 2. InputGuard — delegates to full _inputGuard (empty-string/empty-array aware)
             if (spec.params) {
                 var ig = _inputGuard(params, spec.params);
                 if (ig) return ig;
             }
             // 3. Session extraction
             var ss = (params && params.session_state) || null;
             if (spec.requiresSession && (!ss || !ss.sessionId)) {
                 return { success: false, error: ERROR.code.NO_SESSION.hint, _errorCode: 'NO_SESSION', _errorCategory: ERROR.code.NO_SESSION.cat };
             }
             // 4. Execute with ErrorTaxonomy
             var result;
             try {
                 result = await spec.impl(params, ss);
             } catch(e) {
                 var ce = _classifyError(e);
                 return { success: false, error: ce.hint + ' (' + (spec.name || 'tool') + ': ' + e.message + ')', _errorCode: ce.code, _errorCategory: ce.cat };
             }
             // 5. Inject _suggestNext (only on success, only if session available)
             if (spec.suggestNext && ss && result && result.success !== false && !result._suggestNext) {
                 if (typeof _makeSuggestNext === 'function') {
                     result._suggestNext = _makeSuggestNext(spec.suggestNext, ss);
                 }
             }
             // 6. Inject pipeline status
             if (spec.injectPipeline && ss && result && result.success !== false) {
                 result._pipeline = _pipelineStatus(ss);
             }
             // 7. Update menu state
             if (spec.stage) {
                 _updateMenuState(spec.stage);
             }
             // 8. Auto-checkpoint after success
             if (spec.autoCheckpoint && ss && ss.sessionId && result && result.success !== false) {
                 _writeAutoCheckpoint(spec.stage || 'UNKNOWN', ss);
             }
             // 9. Session-state injection (v4.4.2 D6-D8 fix)
             // Tools that mutate ss in-place (advanceSearchRound, ingest, etc.)
             // must return the mutated state so the AI can pass it to the next tool.
             // Without this, counters, sources, and checkpoint data are lost between calls.
             if (ss && result && result.success !== false && result.sessionState === undefined) {
                 result.sessionState = ss;
             }
             return result;
         };
     }

    // ── _inputGuard: standalone param validation (v4.4.0) ──
    // Returns error body if any required param is missing/empty, null if valid.
    function _inputGuard(args, required) {
        if (!args || !required) return null;
        for (var i = 0; i < required.length; i++) {
            var r = required[i];
            var val = args[r.name];
            if (val === undefined || val === null || val === '' ||
                (typeof val === 'string' && val.trim() === '') ||
                (Array.isArray(val) && val.length === 0)) {
                return { success: false, error: ERROR.code.INPUT_INVALID.hint + ': ' + (r.hint || r.name), _errorCode: 'INPUT_INVALID', _errorCategory: ERROR.code.INPUT_INVALID.cat };
            }
        }
        return null;
    }

    var _lastAdvancedSession = null;
    var _lastAdvancedRound = -1;

    function advanceSearchRound(sessionState) {
        if (!sessionState || !sessionState.search) return;
        var sid = sessionState.sessionId;
        var currentRound = sessionState.search.rounds || 0;
        if (sid === _lastAdvancedSession && currentRound === _lastAdvancedRound) return;
        _lastAdvancedRound = currentRound;
        sessionState.search.rounds = currentRound + 1;
        sessionState.search.roundAdvances = (sessionState.search.roundAdvances || 0) + 1;
        _lastAdvancedSession = sid;
        Metrics.inc('searchRoundAdvances');
    }

    var STAGE_CONFIG = {
        stages: [
            { id: 'INIT', name: 'Init' }, { id: 'QUERY_PLAN', name: 'Query Plan' },
            { id: 'SEARCH', name: 'Search' }, { id: 'FETCH', name: 'Fetch' },
            { id: 'EXTRACT', name: 'Extract' }, { id: 'AUTHORITY_CLASSIFY', name: 'Authority Classify' },
            { id: 'CROSS_VALIDATE', name: 'Cross Validate' }, { id: 'GAP_DETECT', name: 'Gap Detect' },
            { id: 'DEEP_ANALYZE', name: 'Deep Analyze' }, { id: 'THESIS_BUILD', name: 'Thesis Build' },
            { id: 'QUALITY_GATE', name: 'Quality Gate' }, { id: 'CONFIDENCE_TAG', name: 'Confidence Tag' },
            { id: 'COMPILE', name: 'Compile' }, { id: 'OUTPUT', name: 'Output' }
        ],
        transitions: {
            INIT: { next: 'QUERY_PLAN' }, QUERY_PLAN: { next: 'SEARCH' },
            SEARCH: { next: 'FETCH', feedbackOnEmpty: 'QUERY_PLAN' },
            FETCH: { next: 'EXTRACT', feedbackOnEmpty: 'SEARCH' },
            EXTRACT: { next: 'AUTHORITY_CLASSIFY' }, AUTHORITY_CLASSIFY: { next: 'CROSS_VALIDATE' },
            CROSS_VALIDATE: { next: 'GAP_DETECT' },
            GAP_DETECT: { next: 'DEEP_ANALYZE', feedbackOnGaps: 'SEARCH' },
            DEEP_ANALYZE: { next: 'THESIS_BUILD' }, THESIS_BUILD: { next: 'QUALITY_GATE' },
            QUALITY_GATE: { next: 'CONFIDENCE_TAG', feedbackOnFail: 'GAP_DETECT' },
            CONFIDENCE_TAG: { next: 'COMPILE' },
            COMPILE: { next: 'OUTPUT', feedbackOnIncomplete: 'GAP_DETECT' },
            OUTPUT: { next: null }
        },
        gateCount: 15,
        stageCount: 14,
        gates: { minSources: 6, minRounds: 2, minQuantSources: 2, minCnTier01: 1, minCnCases: 1, strongCnMinZhCount: 4, maxBiasRatio: 0.6 },
        order: ['INIT','QUERY_PLAN','SEARCH','FETCH','EXTRACT','AUTHORITY_CLASSIFY','CROSS_VALIDATE','GAP_DETECT','DEEP_ANALYZE','THESIS_BUILD','QUALITY_GATE','CONFIDENCE_TAG','COMPILE','OUTPUT']
    };
    STAGE_CONFIG.order = STAGE_ORDER;  // v3.7.0: eliminate dual source, reference canonical truth source
    var DEFAULT_STAGES = STAGE_CONFIG.stages;

    // ── Language Profiles ──────────────────────────
    // v3.4.0: matchTier dispatch is now fully polymorphic via _langMatchers[lang].
    // Adding a new language requires: (1) profile below, (2) AuthorityPolicy.register('xx', matchXxTier).
    // Gate G8/G9/G11/G12 activation is data-driven via gateHints in each profile.
    var LANGUAGE_PROFILES = {
        zh: {
            code: 'zh', label: 'Chinese',
            urlMarkers: ['.cn', 'zhihu', 'csdn', 'cnki', 'juejin', 'caict'],
            contextSearchTerms: ' 中国 市场 政策 发展',
            querySuffix: ' 中国 现状 2026',
            sourceTypes: ['government', 'academic'],
            languageHints: {
                needsPolicyDimension: true,
                strongLocalKeywords: ['domestic','indigenous','self-reliant'],
                needsLocalKeywords: ['china','chinese','beijing','cn']
            },
            gateHints: {
                minTier01: 1,
                minLocalCases: 1,
                minLocalSourceCount: 4
            }
        },
        en: {
            code: 'en', label: 'English',
            urlMarkers: [],
            contextSearchTerms: null,
            querySuffix: ' analysis report 2026',
            sourceTypes: ['primary', 'academic']
        }
    };

    // ── _scoreSession: cross-session quality scoring (v4.2.0 Phase5) ──
    function _scoreSession(ss) {
        if (!ss) return { score: 0, grade: 'N/A', breakdown: {} };
        var sources = ss.sources || [];
        var nSrc = sources.length;
        var tiers = {0:0,1:0,2:0,3:0,4:0};
        for (var i = 0; i < sources.length; i++) {
            var t = sources[i].authorityTier;
            if (t !== undefined && t >= 0 && t <= 4) tiers[t] = (tiers[t] || 0) + 1;
        }
        var tierWeighted = (tiers[0]||0)*5 + (tiers[1]||0)*4 + (tiers[2]||0)*3 + (tiers[3]||0)*2 + (tiers[4]||0)*1;
        var maxTierWeighted = nSrc * 5;
        var tierScore = maxTierWeighted > 0 ? Math.round(tierWeighted / maxTierWeighted * 100) : 0;
        var gateResult = (ss.qualityGate && ss.qualityGate.lastResult) ? ss.qualityGate.lastResult : null;
        var gateScore = gateResult ? (gateResult.passedCount / gateResult.gateCount * 100) : 0;
        var assertions = ss.assertions || [];
        var confScore = 0;
        for (var j = 0; j < assertions.length; j++) {
            var a = assertions[j];
            if (a.symbol === '[V]' || a.symbol === 'VERIFIED') confScore += 100;
            else if (a.symbol === '[L]' || a.symbol === 'LIKELY') confScore += 75;
            else if (a.symbol === '[U]' || a.symbol === 'UNCERTAIN') confScore += 40;
            else confScore += 20;
        }
        var avgConf = assertions.length > 0 ? Math.round(confScore / assertions.length) : 0;
        var quantSources = 0;
        for (var k = 0; k < sources.length; k++) {
            if (sources[k].hasQuantitative) quantSources++;
        }
        var quantScore = nSrc >= 6 ? Math.min(100, quantSources / 6 * 100) : Math.min(100, quantSources / nSrc * 100);
        var rounds = (ss.search && ss.search.rounds) || 0;
        var roundScore = rounds >= 2 ? 100 : rounds * 50;
        var finalScore = Math.round(tierScore * 0.30 + gateScore * 0.25 + avgConf * 0.20 + quantScore * 0.15 + roundScore * 0.10);
        var grade = finalScore >= 90 ? 'A' : finalScore >= 75 ? 'B' : finalScore >= 60 ? 'C' : finalScore >= 40 ? 'D' : 'F';
        return {
            score: finalScore,
            grade: grade,
            breakdown: {
                tierScore: tierScore,
                gateScore: Math.round(gateScore),
                confidenceScore: avgConf,
                quantScore: Math.round(quantScore),
                roundScore: roundScore,
                weights: 'tier:30% gate:25% conf:20% quant:15% rounds:10%'
            }
        };
    }

// ── Authority Policy (v3.3.0→v3.4.0) ─────────────────────────────
    // v3.4.0: matchTier dispatch is now polymorphic via _langMatchers[lang].
    var AuthorityPolicy = (function() {
        function matchTier(source) {
            if (!source || !source.url) {
                return { tier: 4, level: 'tier4', label: 'Unclassified', score: 0.1, authority: 'unknown' };
            }
            var metadata = source.metadata || {};
            var host = source.host || extractHost(source.url);
            var lang = source.language || detectLanguage(source.url, metadata);
            var result = null;
            var matcher = _langMatchers[lang];
            if (matcher) result = matcher(host, source.url, metadata);
            if (!result) result = matchEnTier(host, source.url, metadata);
            if (!result) result = { tier: 4, level: 'tier4', label: 'Unclassified', score: 0.1, authority: 'unknown' };
            result = applyAuthorBoost(result, metadata);
            result = checkChannelMismatch(result, source.url, metadata);
            return result;
        }

        function score(source, context) { return matchTier(source).score; }
        function isPreferred(source, context) { return matchTier(source).tier <= 2; }

        function register(language, matcherFn) {
            if (typeof matcherFn !== 'function') return false;
            _langMatchers[language] = matcherFn;
            return true;
        }

        var _langMatchers = {};
        _langMatchers.zh = matchCnTier;
        _langMatchers.en = matchEnTier;

        return { matchTier: matchTier, score: score, isPreferred: isPreferred, register: register };
    })();

    // ── Language Policy (v3.3.0) ──────────────────────────────
    var LanguagePolicy = (function() {
        function detect(url, metadata) {
            return { language: detectLanguage(url, metadata || {}), confidence: (metadata && metadata.language) ? 1.0 : 0.7 };
        }

        function buildQuery(query, profile) {
            return { querySuffix: profile.querySuffix || '', contextSearchTerms: profile.contextSearchTerms || '',
                sourceTypes: profile.sourceTypes || ['primary', 'academic'] };
        }

        function listProfiles() {
            var result = [];
            for (var code in LANGUAGE_PROFILES) result.push(LANGUAGE_PROFILES[code]);
            return result;
        }

        function adapt(topic, languageCode) {
            var lc = languageCode || 'zh';
            var profile = LANGUAGE_PROFILES[lc] || LANGUAGE_PROFILES.zh;
            var hints = profile.languageHints;
            var needsLocal = false, strongLocal = false, policyRelevant = false;
            var tl = (topic || '').toLowerCase();
            if (hints && hints.needsLocalKeywords) {
                for (var i = 0; i < hints.needsLocalKeywords.length; i++) {
                    if (tl.indexOf(hints.needsLocalKeywords[i]) !== -1) { needsLocal = true; break; }
                }
            }
            if (hints && hints.strongLocalKeywords) {
                for (var j = 0; j < hints.strongLocalKeywords.length; j++) {
                    if (tl.indexOf(hints.strongLocalKeywords[j]) !== -1) { strongLocal = true; break; }
                }
            }
            if (hints && hints.needsPolicyDimension) policyRelevant = true;
            return { needsLocal: needsLocal, strongLocal: strongLocal, policyRelevant: policyRelevant,
                needsCn: needsLocal, strongCn: strongLocal };
        }

        return { detect: detect, buildQuery: buildQuery, listProfiles: listProfiles, adapt: adapt };
    })();

    // ── Gate Policy (v3.3.0→v4.4.1) ──────────────────────────────────
    // v4.4.1: enabledBy reverted to direct-push from v3.3.2.
    // G8/G9/G11/G12 are CN-specific gates (evaluate hardcodes CN counting).
    // Profile-iteration removed — adding ja/ko profiles must not trigger CN gates.
    var GatePolicy = (function() {
        function enabledBy(adaptResult) {
            var gates = [];
            if (!adaptResult) return { gates: gates, reason: 'no adapt result' };
            if (adaptResult.needsCn || adaptResult.needsLocal) {
                gates.push('G8', 'G11', 'G12');
            }
            if (adaptResult.strongCn || adaptResult.strongLocal) {
                gates.push('G9');
            }
            return { gates: gates, reason: gates.length ? gates.join(',') : 'no conditional gates triggered' };
        }

        function evaluate(gateId, sources, thresholds) {
            var zhCount = 0;
            for (var i = 0; i < (sources ? sources.length : 0); i++) {
                if (sources[i].language === 'zh') zhCount++;
            }
            switch (gateId) {
                case 'G8': {
                    var t = (thresholds && thresholds.minCnTier01) || 1;
                    var c = countCnTier01(sources);
                    return { id: 'G8', name: 'CN authority', passed: c >= t,
                        detail: c + '/' + t, required: String(t), actual: String(c) };
                }
                case 'G9': {
                    var t = (thresholds && thresholds.strongCnMinZhCount) || 4;
                    return { id: 'G9', name: 'CN count(strong)', passed: zhCount >= t,
                        detail: zhCount + '/' + t, required: String(t), actual: String(zhCount) };
                }
                case 'G11': {
                    var t = (thresholds && thresholds.minCnCases) || 1;
                    var c = countCnCases(sources);
                    return { id: 'G11', name: 'CN cases', passed: c >= t,
                        detail: c + '/' + t, required: String(t), actual: String(c) };
                }
                case 'G12': {
                    var tc = checkTermConsistency(sources);
                    return { id: 'G12', name: 'Term consistency', passed: tc.consistent,
                        detail: tc.summary, required: 'no ambiguity', actual: tc.summary };
                }
                default:
                    return { id: gateId, name: 'Unknown', passed: true, detail: '', required: '', actual: '' };
            }
        }

        return { enabledBy: enabledBy, evaluate: evaluate };
    })();

    // ── CachePolicy: Three-tier cache (v3.3.2-P0) ──────────────────
    var CachePolicy = (function() {
        var _authorityCache = Object.create(null);
        var _gateCache = null;

        function getAuthority(url) { return _authorityCache[url] || null; }
        function putAuthority(url, result) {
            _authorityCache[url] = result;
            var keys = Object.keys(_authorityCache);
            if (keys.length > 2000) {
                for (var i = 0; i < keys.length - 1000; i++) delete _authorityCache[keys[i]];
            }
        }
        function invalidateGate() { _gateCache = null; }
        function getGate(sourceCount) {
            if (_gateCache && _gateCache.sourceCount === sourceCount) return _gateCache.result;
            return null;
        }
        function putGate(sourceCount, result) { _gateCache = { sourceCount: sourceCount, result: result }; }

        return { getAuthority: getAuthority, putAuthority: putAuthority, invalidateGate: invalidateGate,
            getGate: getGate, putGate: putGate };
    })();

    // ── Metrics: Lightweight observability (v3.3.2-P0) ──────────────
    var Metrics = (function() {
        var _metrics = {
            toolCalls: Object.create(null), cacheHits: 0, cacheMisses: 0,
            gateEvaluations: 0, sourceIngestions: 0, authorityClassifications: 0,
            searchRoundAdvances: 0, autoStageAdvances: 0
        };

        function inc(key) { _metrics[key] = (_metrics[key] || 0) + 1; }
        function snapshot() { return JSON.parse(JSON.stringify(_metrics)); }
        function attachTo(result) { result._metrics = snapshot(); return result; }

        return { inc: inc, snapshot: snapshot, attachTo: attachTo };
    })();
// ── Source Index (v3.3.0) ──────────────────────────────────
    var SourceIndex = (function() {
        function create() { return Object.create(null); }

        function has(index, url) { return url in index; }

        function get(index, url) { return index[url]; }

        function put(index, url, idx) { index[url] = idx; }

        function rebuild(sources) {
            var idx = Object.create(null);
            for (var i = 0; i < (sources ? sources.length : 0); i++) {
                if (sources[i] && sources[i].url) idx[sources[i].url] = i;
            }
            return idx;
        }

        function putCache(index, url, key, value) { index['__c_' + key + '_' + url] = value; }
        function getCache(index, url, key) { return index['__c_' + key + '_' + url]; }

        return { create: create, has: has, get: get, put: put, rebuild: rebuild,
            putCache: putCache, getCache: getCache };
    })();

    // ── Store (v3.3.0) ────────────────────────────────────────
    var Store = (function() {
        var MAX_SOURCES = 500;
        var MAX_FACTS   = 500;
        var MAX_HISTORY = 200;

        function _trim(arr, max) {
            if (arr.length > max) {
                var excess = arr.length - max;
                for (var i = 0; i < max; i++) { arr[i] = arr[i + excess]; }
                arr.length = max;
            }
        }

        function ensureSources(sessionState) {
            sessionState.sources = sessionState.sources || [];
            sessionState.sourceIndex = sessionState.sourceIndex || SourceIndex.create();
            return sessionState.sources;
        }

        function ensureFacts(sessionState) {
            sessionState.extractedFacts = sessionState.extractedFacts || [];
            return sessionState.extractedFacts;
        }

        function ensureHistory(sessionState) {
            if (!sessionState.search) sessionState.search = {};
            sessionState.search.searchHistory = sessionState.search.searchHistory || [];
            return sessionState.search.searchHistory;
        }

        function pushSource(sessionState, normalized) {
            var sources = ensureSources(sessionState);
            var idx = sources.length;
            sources.push(normalized);
            SourceIndex.put(sessionState.sourceIndex, normalized.url, idx);
            if (sources.length > MAX_SOURCES) {
                _trim(sources, MAX_SOURCES);
                sessionState.sourceIndex = SourceIndex.rebuild(sources);
            }
            return idx;
        }

        // Contract: fact may carry optional confidence (0-5), stance, authorityTier — all passed through to extractedFacts[]
        function pushFact(sessionState, fact) {
            var facts = ensureFacts(sessionState);
            facts.push(fact);
            _trim(facts, MAX_FACTS);
        }

        function pushHistory(sessionState, entry) {
            var history = ensureHistory(sessionState);
            history.push(entry);
            _trim(history, MAX_HISTORY);
        }

        return { ensureSources: ensureSources, ensureFacts: ensureFacts, ensureHistory: ensureHistory,
            pushSource: pushSource, pushFact: pushFact, pushHistory: pushHistory };
    })();
    async function start_research(params) {
        var gate = requireToggleOn();
        if (gate.blocked) return gate;
        var ig = _inputGuard(params, [{name:'query', hint:'query'}]); if (ig) return ig;
        try {
            var query = params.query;
            // _inputGuard above already validates non-empty query; kept for defense-in-depth
            if (!query || query.trim() === '') return { success: false, error: 'query is required' };  /* unreachable: _inputGuard */
            var languagePriority = params.language_priority || 'auto';
            var planAware = params.plan_aware === true;
            var now = new Date().toISOString();
            var languageConfig = resolveLanguagePriority(query, languagePriority);
            var subQuestions = decomposeQuery(query, languageConfig);
            var dimensions = identifyDimensions(query);
            var searchPlan = generateSearchPlan(query, subQuestions, languageConfig);
            var topicProfile = profileTopic(query);
            var sessionState = buildInitialSessionState(query, languageConfig, subQuestions, dimensions, searchPlan, topicProfile, now);
            var firstAction = { stage: 'QUERY_PLAN', plannedQueries: searchPlan.queries.slice(0, 3),
                targetSourceTypes: searchPlan.targetSourceTypes,
                instruction: 'Execute first search round, prioritize ' + languageConfig.primaryLang.toUpperCase() + ' sources' };
            var result = {
                success: true, sessionState: sessionState,
                firstAction: firstAction,
                meta: { query: query, subQuestionCount: subQuestions.length, dimensions: dimensions,
                    languagePriority: languageConfig.mode, topicProfile: topicProfile, estimatedRounds: searchPlan.estimatedRounds }
            };
            if (planAware) {
                var planTodo = buildInitialPlanTodo(query, sessionState);
                result.plantodo = planTodo.plantodo;
                result.planProgress = planTodo.progress;
                result.plan_aware = true;
                result.meta.planIntegration = 'active';
            }
            result._suggestNext = _makeSuggestNext('start_research', sessionState);
            _writeAutoCheckpoint('QUERY_PLAN', sessionState); // v4.0.0 Phase3
            _updateMenuState('QUERY_PLAN');
            return result;
        } catch (e) { var ce = _classifyError(e); // v4.0.0 Phase3: ErrorTaxonomy
            return { success: false, error: ce.hint + ' (start_research: ' + e.message + ')', _errorCode: ce.code, _errorCategory: ce.cat }; }
    }

    function resolveLanguagePriority(query, priority) {
        var hasCn = /[\u4e00-\u9fff]/.test(query);
        var hasEn = /[a-zA-Z]{4,}/.test(query);
        var mode = priority, primary = 'en', secondary = 'zh', zhR = 0.5;
        if (mode === 'auto') {
            if (hasCn && !hasEn) { mode = 'zh_primary'; primary = 'zh'; secondary = 'en'; zhR = 0.7; }
            else if (hasEn && hasCn) { mode = 'balanced'; zhR = 0.5; }
            else { mode = 'en_primary'; zhR = 0.3; }
        } else if (mode === 'zh') { primary = 'zh'; secondary = 'en'; zhR = 0.8; }
        else if (mode === 'en') { zhR = 0.2; }
        return { mode: mode, primaryLang: primary, secondaryLang: secondary, zhRatio: zhR,
            needsCnSources: zhR >= 0.3, needsEnSources: zhR <= 0.7 };
    }

    // ── Optimized: stemmed keyword extraction for better cache hit rate ──
    function extractKeywords(query) {
        var sw = ['the','a','an','is','are','was','were','in','on','at','to','for','of','and','or','it','its','that','this','with','from','by','as','be','has','have','had','not','but','we','they','he','she','can','will','may','also','such','just','about','into','than','then','no','so','if','when','which','who','how','all','more','some','only','over','other','new','like','these','those','been','being'];
        var words = query.replace(/[,;.!?()\[\]{}"']/g, ' ').split(/\s+/);
        var kw = [], seen = {};
        for (var i = 0; i < words.length; i++) {
            var w = words[i].trim().toLowerCase();
            if (w.length < 2 || sw.indexOf(w) !== -1) continue;
            // Simple stemming: strip common suffixes for cache normalization
            var stem = w.replace(/(ing|tion|ment|ness|able|ible|al|ly|ed|er|est|s|es)$/, '');
            if (stem.length < 2) stem = w;
            if (!seen[stem]) { seen[stem] = true; kw.push(w); if (kw.length >= 8) break; }
        }
        return kw.join(' ');
    }

    // ── Optimized: differentiated search terms per sub-question, cache-friendly ──
    function decomposeQuery(query, languageConfig) {
        var kw = extractKeywords(query);
        var subQuestions = [];
        subQuestions.push({ id: 'q0', type: 'definition', question: query + ' - core concepts',
            searchTerms: kw + ' definition overview', priority: 'high' });
        subQuestions.push({ id: 'q1', type: 'current_state', question: query + ' - current state',
            searchTerms: kw + ' statistics data 2026', priority: 'high' });
        subQuestions.push({ id: 'q2', type: 'causal', question: 'Key drivers for ' + query,
            searchTerms: kw + ' drivers factors causes impact', priority: 'high' });
        subQuestions.push({ id: 'q3', type: 'controversy', question: 'Controversies on ' + query,
            searchTerms: kw + ' debate controversy criticism', priority: 'medium' });
        subQuestions.push({ id: 'q4', type: 'trend', question: query + ' - future trends',
            searchTerms: kw + ' future trend forecast prediction 2026 2027', priority: 'medium' });
        if (languageConfig.needsCnSources && languageConfig.zhRatio >= 0.5) {
            // Differentiated CN search: use Chinese-specific framing from profile
            var zhProfile = LANGUAGE_PROFILES.zh;
            subQuestions.push({ id: 'q5', type: 'cn_context', question: query + ' - China context',
                searchTerms: kw + zhProfile.contextSearchTerms, priority: 'high', language: 'zh' });
        }
        return subQuestions;
    }

    // ── Optimized: adaptive dimension selection based on query semantics ──
    function identifyDimensions(query) {
        var ad = [
            { name: 'market', keywords: ['market','competition','landscape','share','industry','sector','revenue','growth'] },
            { name: 'technology', keywords: ['technology','architecture','model','algorithm','framework','infrastructure','protocol'] },
            { name: 'security', keywords: ['security','vulnerability','attack','defense','threat','privacy','encrypt'] },
            { name: 'pricing', keywords: ['pricing','price','cost','billing','subscription','revenue model','monetization'] },
            { name: 'regulation', keywords: ['regulation','policy','compliance','standard','governance','law','legal','gdpr','ccpa'] },
            { name: 'adoption', keywords: ['adoption','usage','deployment','migration','implementation','rollout'] },
            { name: 'ecosystem', keywords: ['ecosystem','open source','community','platform','integration','plugin','extension'] },
            { name: 'talent', keywords: ['talent','skill','developer','engineer','hiring','workforce','training'] },
            { name: 'performance', keywords: ['performance','latency','throughput','benchmark','speed','efficiency','scalability'] },
            { name: 'reliability', keywords: ['reliability','availability','uptime','fault tolerance','resilience','redundancy'] }
        ];
        var m = [], lq = query.toLowerCase();
        for (var i = 0; i < ad.length; i++) {
            for (var j = 0; j < ad[i].keywords.length; j++) {
                if (lq.indexOf(ad[i].keywords[j]) !== -1) {
                    if (m.indexOf(ad[i].name) === -1) { m.push(ad[i].name); break; }
                }
            }
        }
        // Adaptive fallback: pick top-scoring dimensions by keyword density
        if (m.length < 3) {
            var scores = [];
            for (var k = 0; k < ad.length; k++) {
                if (m.indexOf(ad[k].name) !== -1) continue;
                var score = 0;
                for (var l = 0; l < ad[k].keywords.length; l++) {
                    if (lq.indexOf(ad[k].keywords[l]) !== -1) score += 1;
                }
                scores.push({ name: ad[k].name, score: score });
            }
            scores.sort(function(a, b) { return b.score - a.score; });
            for (var n = 0; n < scores.length && m.length < 3; n++) {
                if (scores[n].score > 0 || m.length === 0) m.push(scores[n].name);
            }
        }
        return m;
    }

    // ── Optimized: deduplicated search plan with parallel groups ──
    function generateSearchPlan(query, subQuestions, languageConfig) {
        var queries = [], seenTerms = {};
        for (var i = 0; i < subQuestions.length; i++) {
            if (subQuestions[i].priority === 'high') {
                var termKey = (subQuestions[i].searchTerms || '').toLowerCase().trim();
                if (!seenTerms[termKey]) {
                    seenTerms[termKey] = true;
                    queries.push({ query: subQuestions[i].searchTerms, subQuestionId: subQuestions[i].id,
                        language: subQuestions[i].language || languageConfig.primaryLang, sourceTypes: ['primary', 'academic'],
                        parallelGroup: 'round1' });
                }
            }
        }
        // Deduplicated language-specific queries with distinct terms
        if (languageConfig.needsCnSources) {
            var zhProfile = LANGUAGE_PROFILES.zh;
            var cnTerm = extractKeywords(query) + zhProfile.querySuffix;
            if (!seenTerms[cnTerm.toLowerCase()]) {
                queries.push({ query: cnTerm, subQuestionId: 'q5_cn',
                    language: 'zh', sourceTypes: zhProfile.sourceTypes, parallelGroup: 'round1' });
            }
        }
        if (languageConfig.needsEnSources) {
            var enProfile = LANGUAGE_PROFILES.en;
            var enTerm = extractKeywords(query) + enProfile.querySuffix;
            if (!seenTerms[enTerm.toLowerCase()]) {
                queries.push({ query: enTerm, subQuestionId: 'q1_en',
                    language: 'en', sourceTypes: enProfile.sourceTypes, parallelGroup: 'round1' });
            }
        }
        return { queries: queries, targetSourceTypes: ['primary', 'academic', 'industry-report', 'government'],
            estimatedRounds: Math.max(2, Math.ceil(subQuestions.length / 3)), strategy: 'authority-first',
            parallelGroups: groupByParallel(queries) };
    }

    function groupByParallel(queries) {
        var groups = {};
        for (var i = 0; i < queries.length; i++) {
            var g = queries[i].parallelGroup || 'default';
            if (!groups[g]) groups[g] = [];
            groups[g].push(i);
        }
        return groups;
    }

    function profileTopic(query) {
        var p = { isTechnology: false, isPolicyRelevant: false, isCnRelevant: false, isControversial: false, needsRealTimeData: false };
        var l = query.toLowerCase();
        var tk = ['ai','ml','llm','model','code','software','algorithm','data','cloud'];
        for (var i = 0; i < tk.length; i++) { if (l.indexOf(tk[i]) !== -1) { p.isTechnology = true; break; } }
        var pk = ['regulation','policy','law','compliance','standard','governance'];
        for (var j = 0; j < pk.length; j++) { if (l.indexOf(pk[j]) !== -1) { p.isPolicyRelevant = true; break; } }
        var ck = ['china','chinese','beijing'];
        for (var k = 0; k < ck.length; k++) { if (l.indexOf(ck[k]) !== -1) { p.isCnRelevant = true; break; } }
        var ym = query.match(/20\d{2}/);
        if (ym && parseInt(ym[0]) >= 2025) p.needsRealTimeData = true;
        return p;
    }

    function buildInitialSessionState(query, languageConfig, subQuestions, dimensions, searchPlan, topicProfile, now) {
        // Deterministic sessionId for AI cache affinity (same query + 15-min bucket → same id)
        var cachePrefix = 'dr_';
        for (var i = 0; i < Math.min(query.length, 32); i++) {
            var c = query.charCodeAt(i);
            cachePrefix += (c % 36).toString(36);
        }
        var timeBucket = Math.floor(Date.now() / 900000);  // 15-min granularity
        return {
            sessionId: cachePrefix + '_t' + timeBucket.toString(36), startedAt: now, updatedAt: now,
            query: query, thesis: null, languageConfig: languageConfig, topicProfile: topicProfile,
            currentStage: 'INIT', completedStages: [], stageResults: {},
            stageDefinitions: STAGE_CONFIG.stages.slice(0),
            stageTransitions: STAGE_CONFIG.transitions,
            search: { plan: searchPlan, rounds: 0, roundAdvances: 0, totalSearches: 0, totalIngested: 0, pendingQueries: searchPlan.queries, executedQueries: [], searchHistory: [], failedSearches: [] },
            sources: [], sourceIndex: SourceIndex.create(), extractedFacts: [], assertions: [],
            subQuestions: subQuestions, dimensions: dimensions, subQuestionCoverage: {}, conflicts: [], gaps: [],
            qualityGate: { lastCheck: null, lastResult: null, failedGates: [], checkCount: 0 },
            deepAnalysisResult: null, thesisStatement: null,
            constraints: { authorityFirst: true, crossValidate: true, maxRounds: 5, minSources: 6,
                minCnSources: languageConfig.needsCnSources ? 2 : 0, minEnSources: languageConfig.needsEnSources ? 2 : 0, maxSingleStanceRatio: 0.6 },
            errors: [], checkpoints: []
        };
    }

    function buildInitialPlanTodo(query, sessionState) {
        var stages = (sessionState.stageDefinitions && sessionState.stageDefinitions.length > 0) ? sessionState.stageDefinitions : DEFAULT_STAGES;
        var lines = [];
        lines.push('<plantodo>');
        lines.push('## 🔬 DeepResearch: ' + query);
        lines.push('');
        var progress = 0, total = stages.length;
        for (var i = 0; i < stages.length; i++) {
            var s = stages[i];
            var status = s.id === 'INIT' ? '[~]' : '[ ]';
            if (status === '[~]') progress = Math.round(((i + 1) / total) * 100);
            lines.push('- ' + status + ' ' + s.id + ': ' + s.name);
        }
        lines.push('');
        lines.push('**Progress**: ' + progress + '% | **Stage**: INIT | **Updated**: ' + new Date().toISOString());
        lines.push('</plantodo>');
        return {
            plantodo: lines.join('\n'),
            progress: progress + '%',
            stageProgress: stages.map(function(s) { return { id: s.id, name: s.name, status: s.id === 'INIT' ? 'active' : 'pending' }; })
        };
    }

    // ==================== Tool 2: classify_authority ====================
    var classify_authority = _wrapTool({
        name: 'classify_authority',
        checkToggle: true,
        params: [{name:'url', hint:'url'}],
        suggestNext: 'classify_authority',
        impl: async function(params, ss) {
            var url = params.url, metadata = params.metadata || {};
            if (!url) return { success: false, error: 'url is required' };  /* unreachable: _inputGuard */
            return { success: true, data: classifyAuthorityV4(url, metadata) };
        }
    });

    // v3.3.0: delegates to AuthorityPolicy.matchTier.
    // Old (url, metadata) signature preserved for backward compat.
    // v3.3.2: cached via CachePolicy — same URL returns memoized TierResult.
    function classifyAuthorityV4(url, metadata) {
        var cached = CachePolicy.getAuthority(url);
        if (cached) { Metrics.inc('cacheHits'); return cached; }
        Metrics.inc('cacheMisses');
        Metrics.inc('authorityClassifications');
        var result = AuthorityPolicy.matchTier({ url: url, metadata: metadata || {} });
        // Only cache meaningful results (not Tier 4 unclassified with unknown authority)
        if (result.tier !== 4 || result.authority !== 'unknown') {
            CachePolicy.putAuthority(url, result);
        }
        return result;
    }

    function extractHost(url) { if (!url) return ''; var m = url.match(/https?:\/\/([^\/]+)/i); return m ? m[1].toLowerCase() : url.toLowerCase(); }
    function detectLanguage(url, metadata) {
        if (metadata.language === 'zh' || metadata.language === 'en') return metadata.language;
        var profiles = LANGUAGE_PROFILES;
        for (var lang in profiles) {
            var markers = profiles[lang].urlMarkers;
            for (var i = 0; i < markers.length; i++) {
                if (url.indexOf(markers[i]) !== -1) return lang;
            }
        }
        return 'en';
    }

    function matchCnTier(host, url, metadata) {
        var t0 = ['caict.ac.cn','cncert.org.cn','cert.org.cn','cac.gov.cn','miit.gov.cn','stats.gov.cn','moe.gov.cn'];
        for (var i = 0; i < t0.length; i++) { if (host.indexOf(t0[i]) !== -1) return { tier: 0, level: 'tier0', label: 'National Authority', score: 1.0, authority: 'government' }; }
        var t1 = ['cnki.net','wanfangdata.com','cas.cn','cae.cn','ccf.org.cn','nsfc.gov.cn'];
        for (var j = 0; j < t1.length; j++) { if (host.indexOf(t1[j]) !== -1) return { tier: 1, level: 'tier1', label: 'Top Academic', score: 0.9, authority: 'academic' }; }
        var t2 = ['tech.meituan.com','developer.huawei.com','tech.bytedance.com'];
        for (var k = 0; k < t2.length; k++) { if (url.indexOf(t2[k]) !== -1) return { tier: 2, level: 'tier2', label: 'Official Tech Blog', score: 0.7, authority: 'industry-official' }; }
        var t3 = ['csdn.net','juejin.cn','segmentfault.com','zhihu.com','cnblogs.com'];
        for (var l = 0; l < t3.length; l++) { if (host.indexOf(t3[l]) !== -1) { if (metadata.author && metadata.verified) return { tier: 3, level: 'tier3', label: 'Verified Community Author', score: 0.45, authority: 'community-verified' }; return { tier: 4, level: 'tier4', label: 'UGC (clue source)', score: 0.15, authority: 'ugc', role: 'clue_source' }; } }
        if (host.indexOf('blog.51cto.com') !== -1) return { tier: 3, level: 'tier3', label: 'Tech Edu Platform', score: 0.4, authority: 'tech-edu' };
        return null;
    }

    function matchEnTier(host, url, metadata) {
        var t0 = ['github.blog','anthropic.com','openai.com','swebench.com','arxiv.org','nist.gov','owasp.org','acm.org','ieee.org','stackoverflow.com'];
        for (var i = 0; i < t0.length; i++) { if (host.indexOf(t0[i]) !== -1) { var sl = 'Primary Source'; if (host.indexOf('arxiv') !== -1) sl = 'Preprint (no peer review)'; if (host.indexOf('stackoverflow') !== -1) sl = 'Authoritative Q&A'; return { tier: 0, level: 'tier0', label: sl, score: 0.95, authority: 'primary' }; } }
        var t1 = ['nature.com','science.org','springer.com','elsevier.com','mit.edu','stanford.edu','berkeley.edu','cmu.edu','ox.ac.uk','cam.ac.uk','cset.georgetown.edu','rand.org','brookings.edu','csis.org','cfr.org','belfercenter.org','cnas.org','iiss.org','chathamhouse.org','wilsoncenter.org','carnegieendowment.org'];
        for (var j = 0; j < t1.length; j++) { if (host.indexOf(t1[j]) !== -1) return { tier: 1, level: 'tier1', label: 'Academic/Research/Think Tank', score: 0.85, authority: 'academic' }; }
        var t2 = ['gartner.com','forrester.com','idc.com','veracode.com','snyk.io','sonatype.com','techcrunch.com','wired.com','theverge.com','arstechnica.com'];
        for (var k = 0; k < t2.length; k++) { if (host.indexOf(t2[k]) !== -1) return { tier: 2, level: 'tier2', label: 'Industry Report/Tech Media', score: 0.6, authority: 'industry-report' }; }
        var t3 = ['medium.com','dev.to','substack.com'];
        for (var l = 0; l < t3.length; l++) { if (host.indexOf(t3[l]) !== -1) return { tier: 3, level: 'tier3', label: 'Expert Blog Platform', score: 0.3, authority: 'expert-blog' }; }
        var t4 = ['blogspot','wordpress','github.io','netlify.app','vercel.app'];
        for (var m = 0; m < t4.length; m++) { if (host.indexOf(t4[m]) !== -1) return { tier: 4, level: 'tier4', label: 'Personal/UGC', score: 0.1, authority: 'ugc' }; }
        return null;
    }

    function applyAuthorBoost(result, metadata) {
        if (!metadata.author) return result;
        var known = ['alex graveley','simon willison','kent beck','martin fowler','andrew ng','yann lecun','geoffrey hinton'];
        var al = metadata.author.toLowerCase(), isKnown = false;
        for (var i = 0; i < known.length; i++) { if (al.indexOf(known[i]) !== -1) { isKnown = true; break; } }
        if (isKnown && result.tier >= 3) { result.originalTier = result.tier; result.tier = Math.max(0, result.tier - 1); result.score = Math.min(1.0, result.score + 0.3); result.authorBoost = true; result.boostedBy = metadata.author; }
        return result;
    }

    function checkChannelMismatch(result, url, metadata) {
        if (metadata.references && result.tier >= 3) { for (var i = 0; i < metadata.references.length; i++) { var ref = metadata.references[i]; if (ref && (ref.indexOf('arxiv') !== -1 || ref.indexOf('github.blog') !== -1 || ref.indexOf('anthropic') !== -1)) { result.channelNote = 'Authoritative content via non-authoritative channel, ref chain verified'; result.score = Math.min(1.0, result.score + 0.15); break; } } }
        return result;
    }

    // ==================== Tool 3: check_quality_gate ====================
    var check_quality_gate = _wrapTool({
        name: 'check_quality_gate',
        checkToggle: true,
        requiresSession: true,
        stage: 'QUALITY_GATE',
        params: [{name:'session_state', hint:'session_state'}, {name:'topic', hint:'topic'}],
        suggestNext: 'check_quality_gate',
        impl: async function(params, ss) {
            var sessionState = ss, topic = params.topic || '';
            var _data = checkQualityGateV4(sessionState, topic);
            return { success: true, data: _data };
        }
    });

    function checkQualityGateV4(sessionState, topic) {
        // ── Cache short-circuit: same source count → return cached result ──
        var sources = sessionState.sources || [];
        var cachedGate = CachePolicy.getGate(sources.length);
        if (cachedGate) { Metrics.inc('cacheHits'); return cachedGate; }
        Metrics.inc('cacheMisses');
        Metrics.inc('gateEvaluations');
        var rounds = (sessionState.search && sessionState.search.rounds) || 0,
            subQuestions = sessionState.subQuestions || [], conflicts = sessionState.conflicts || [],
            dimensions = sessionState.dimensions || [];
        var results = [], allPassed = true;
        var G = STAGE_CONFIG.gates;

        var g1 = { id: 'G1', name: 'Sources', passed: sources.length >= G.minSources, detail: sources.length + '/' + G.minSources, required: G.minSources, actual: sources.length }; results.push(g1); if (!g1.passed) allPassed = false;
        var g2 = { id: 'G2', name: 'Rounds', passed: rounds >= G.minRounds, detail: rounds + '/' + G.minRounds, required: G.minRounds, actual: rounds }; results.push(g2); if (!g2.passed) allPassed = false;
        var zhCount = countByLang(sources, 'zh'), enCount = countByLang(sources, 'en');
var topicLang = (sessionState.constraints && sessionState.constraints.topicLanguage) || 'auto';
var minZh = (topicLang === 'en') ? 0 : ((topicLang === 'zh') ? 2 : (sessionState.constraints && sessionState.constraints.minCnSources) || 0);
var minEn = (topicLang === 'zh') ? 0 : ((topicLang === 'en') ? 2 : (sessionState.constraints && sessionState.constraints.minEnSources) || 0);
var g3 = { id: 'G3', name: 'ZH/EN dist', passed: zhCount >= minZh && enCount >= minEn, detail: 'zh:' + zhCount + '/' + minZh + ' en:' + enCount + '/' + minEn, required: 'zh>=' + minZh + ' en>=' + minEn, actual: 'zh:' + zhCount + ' en:' + enCount }; results.push(g3); if (!g3.passed) allPassed = false;
        var quantCount = countQuantitative(sources);
        var g4 = { id: 'G4', name: 'Quant data', passed: quantCount >= G.minQuantSources, detail: quantCount + '/' + G.minQuantSources, required: G.minQuantSources, actual: quantCount }; results.push(g4); if (!g4.passed) allPassed = false;
        var subCoverage = checkSubQuestionCoverage(sources, subQuestions);
        var g5 = { id: 'G5', name: 'Sub-Q coverage', passed: subCoverage.allCovered, detail: subCoverage.summary, required: '>=2 per', actual: subCoverage.summary }; results.push(g5); if (!g5.passed) allPassed = false;
        sessionState.conflicts = detectConflicts(sessionState);
        var unresolvedConflicts = countUnresolved(sessionState.conflicts);
        var g6 = { id: 'G6', name: 'Conflicts', passed: unresolvedConflicts === 0, detail: unresolvedConflicts + ' unresolved', required: 0, actual: unresolvedConflicts }; results.push(g6); if (!g6.passed) allPassed = false;
        var biasCheck = checkBiasBalance(sources);
        var g7 = { id: 'G7', name: 'Bias balance', passed: !biasCheck.severe, detail: (biasCheck.maxRatio * 100).toFixed(0) + '%', required: '<=60%', actual: (biasCheck.maxRatio * 100).toFixed(0) + '%' }; results.push(g7); if (!g7.passed) allPassed = false;

        var cnAdaptive = detectCnAdaptive(topic);
// v3.3.0: G8/G9/G11/G12 delegated to GatePolicy
var gatePlan = GatePolicy.enabledBy(cnAdaptive);
if (gatePlan.gates.indexOf('G8') !== -1) {
var g8 = GatePolicy.evaluate('G8', sources, G); results.push(g8); if (!g8.passed) allPassed = false;
}
if (gatePlan.gates.indexOf('G11') !== -1) {
var g11 = GatePolicy.evaluate('G11', sources, G); results.push(g11); if (!g11.passed) allPassed = false;
}
if (gatePlan.gates.indexOf('G12') !== -1) {
var g12 = GatePolicy.evaluate('G12', sources, G); results.push(g12); if (!g12.passed) allPassed = false;
}
if (gatePlan.gates.indexOf('G9') !== -1) {
var g9 = GatePolicy.evaluate('G9', sources, G); results.push(g9); if (!g9.passed) allPassed = false;
}
if (cnAdaptive.policyRelevant) { var hasPolicy = checkDimensionCoverage(dimensions, ['policy','regulation','compliance']); var g10 = { id: 'G10', name: 'Policy dim', passed: hasPolicy, detail: hasPolicy ? 'covered' : 'missing', required: '>=1', actual: hasPolicy ? 'covered' : 'missing' }; results.push(g10); if (!g10.passed) allPassed = false; }

        var echoCheck = checkCitationIndependence(sources);
        var g13 = { id: 'G13', name: 'Citation independence', passed: !echoCheck.hasEcho, detail: echoCheck.summary, required: 'no echo', actual: echoCheck.summary }; results.push(g13); if (!g13.passed) allPassed = false;
        var oppQuality = checkOpposingQuality(sources);
        var g14 = { id: 'G14', name: 'Opposition quality', passed: oppQuality.passed, detail: oppQuality.summary, required: '>=Tier2', actual: oppQuality.summary }; results.push(g14); if (!g14.passed) allPassed = false;
        var dimComplete = checkDimensionCompleteness(dimensions, topic);
        var g15 = { id: 'G15', name: 'Dimension completeness', passed: dimComplete.passed, detail: dimComplete.summary, required: 'no blind spots', actual: dimComplete.summary }; results.push(g15); if (!g15.passed) allPassed = false;

        // ── P2 (v3.6.0) Item 4-B: correctionHints for failed gates ──
        var _hintMap = {
            G1: 'advance_search_round + new searches to get more sources (need ' + G.minSources + ')',
            G2: 'advance_search_round twice to pass minimum rounds (need ' + G.minRounds + ')',
            G3: 'add sources in missing language (zh/en distribution insufficient)',
            G4: 'ingest sources with quantitative data (need ' + G.minQuantSources + ')',
            G5: 'search specifically for uncovered sub-questions',
            G6: 'deep_analyze opposing arguments for each unresolved conflict',
            G7: 'add sources with opposing stances to balance bias',
            G8: 'add Tier 0-1 Chinese sources',
            G9: 'add Chinese sources with case studies',
            G10: 'search for policy/regulation dimension coverage',
            G11: 'add more strong-local Chinese sources',
            G12: 'increase Chinese source count',
            G13: 'cross-check citations for independence; avoid echo chambers',
            G14: 'include opposing viewpoints from Tier 0-2 sources',
            G15: 'search for missing dimensions to eliminate blind spots'
        };
        var _failedIds = results.filter(function(r) { return !r.passed; }).map(function(r) { return r.id; });
        var _correctionHints = _failedIds.map(function(id) { return { gate: id, hint: _hintMap[id] || 'Re-evaluate gate ' + id }; });
        // ── END P2 Item 4-B ──
        var result = { allPassed: allPassed, gateCount: results.length,
            passedCount: results.filter(function(r) { return r.passed; }).length,
            failedGates: results.filter(function(r) { return !r.passed; }).map(function(r) { return r.id + ' ' + r.name; }),
            correctionHints: _correctionHints,
            details: results, cnAdaptive: cnAdaptive };
        // ── Cache result for subsequent calls with same source count ──
        CachePolicy.putGate(sources.length, result);
        return result;
    }

    function countByLang(sources, lang) { var c = 0; for (var i = 0; i < sources.length; i++) { if (sources[i].language === lang) c++; } return c; }
    function countQuantitative(sources) { var c = 0; for (var i = 0; i < sources.length; i++) { if (sources[i].hasQuantitative) c++; } return c; }
    function checkSubQuestionCoverage(sources, subQuestions) { if (!subQuestions || subQuestions.length === 0) return { allCovered: true, summary: 'N/A' }; var gaps = []; for (var i = 0; i < subQuestions.length; i++) { var cov = 0; for (var j = 0; j < sources.length; j++) { if (sources[j].coversQuestion && sources[j].coversQuestion.indexOf(subQuestions[i].id) !== -1) cov++; } if (cov < 2) gaps.push(subQuestions[i].id + '(' + cov + '/2)'); } if (gaps.length === 0) return { allCovered: true, summary: 'All >=2' }; return { allCovered: false, summary: 'Gaps: ' + gaps.join(',') }; }
    function countUnresolved(conflicts) { if (!conflicts) return 0; var c = 0; for (var i = 0; i < conflicts.length; i++) { if (!conflicts[i].resolved) c++; } return c; }
    function checkBiasBalance(sources) { var st = {}, nonNeutral = 0; for (var i = 0; i < sources.length; i++) { var s = sources[i], stc = s.stance || 'neutral'; if (stc !== 'neutral') { st[stc] = (st[stc] || 0) + 1; nonNeutral++; } } if (nonNeutral < 3) return { severe: false, maxRatio: 0, maxStance: 'insufficient' }; var maxR = 0, maxS = ''; for (var k in st) { if (st[k] / nonNeutral > maxR) { maxR = st[k] / nonNeutral; maxS = k; } } return { severe: maxR > STAGE_CONFIG.gates.maxBiasRatio, maxRatio: maxR, maxStance: maxS }; }
    // v3.3.0: delegates to LanguagePolicy.adapt.
// Old CN/EN keyword arrays migrated to zh profile languageHints.
function detectCnAdaptive(topic) {
    return LanguagePolicy.adapt(topic);
}
    function countCnTier01(sources) { var c = 0; for (var i = 0; i < sources.length; i++) { if (sources[i].language === 'zh' && sources[i].authorityTier !== undefined && sources[i].authorityTier <= 1) c++; } return c; }
    function countCnCases(sources) { var c = 0; for (var i = 0; i < sources.length; i++) { if (sources[i].language === 'zh' && sources[i].hasCaseStudy) c++; } return c; }
    function checkTermConsistency(sources) {
    if (!sources || sources.length < 2) return { consistent: true, summary: 'insufficient sources (need >=2)' };
    var termMap = {};
    var zhEnPairs = [];
    var ambiguousTerms = [];
    for (var i = 0; i < sources.length; i++) {
        var s = sources[i];
        var terms = Array.isArray(s.extractedTerms) ? s.extractedTerms : [];
        var lang = s.language || 'en';
        for (var j = 0; j < terms.length; j++) {
            var t = terms[j];
            var key = t.name || t;
            if (typeof key !== 'string') continue;
            key = key.toLowerCase().trim();
            if (key.length < 3) continue;
            if (!termMap[key]) termMap[key] = { count: 0, langs: {}, meanings: [] };
            termMap[key].count++;
            termMap[key].langs[lang] = (termMap[key].langs[lang] || 0) + 1;
            if (t.meaning) termMap[key].meanings.push(t.meaning);
        }
        if (s.zhTerms && s.enTerms) {
            for (var k = 0; k < Math.min(s.zhTerms.length, s.enTerms.length); k++) {
                zhEnPairs.push({ zh: s.zhTerms[k], en: s.enTerms[k], url: s.url });
            }
        }
    }
    var issues = [];
    var keys = Object.keys(termMap);
    for (var m = 0; m < keys.length; m++) {
        var entry = termMap[keys[m]];
        if (entry.count >= 2 && Object.keys(entry.langs).length >= 2) {
            var meanings = [];
            for (var n = 0; n < entry.meanings.length; n++) {
                if (entry.meanings[n] && meanings.indexOf(entry.meanings[n]) === -1) meanings.push(entry.meanings[n]);
            }
            if (meanings.length > 1) {
                ambiguousTerms.push({ term: keys[m], meanings: meanings, sourceCount: entry.count });
                issues.push(keys[m] + '=' + meanings.join('|'));
            }
        }
    }
    var cnTerms = countCnTerms(sources);
    var enTerms = countEnTerms(sources);
    if (issues.length > 0) {
        return { consistent: false, summary: 'ambiguity: ' + issues.join('; '),
            ambiguousTerms: ambiguousTerms, cnTermCount: cnTerms, enTermCount: enTerms,
            recommendation: 'Standardize terminology across sources; define each ambiguous term explicitly.' };
    }
    if (cnTerms > 0 && enTerms > 0 && zhEnPairs.length === 0) {
        return { consistent: true, summary: 'no cross-lang term mapping found (' + cnTerms + 'zh/' + enTerms + 'en)',
            note: 'CN and EN sources present but no bilingual term pairs extracted', cnTermCount: cnTerms, enTermCount: enTerms };
    }
    var totalTerms = cnTerms + enTerms;
    var summary = totalTerms > 0 ? (totalTerms + ' terms consistent (' + cnTerms + 'zh/' + enTerms + 'en)') : 'no terms extracted';
    return { consistent: true, summary: summary, cnTermCount: cnTerms, enTermCount: enTerms,
        crossLangPairs: zhEnPairs.length, termDiversity: keys.length };
}

    // ═══════════════════════════════════════════════════════════════
    // P0 (v3.4.1): detectConflicts skeleton with stance contract
    // P1 (Item 4-A) will implement the full algorithm below.
    // ═══════════════════════════════════════════════════════════════

    /**
     * detectConflicts(sessionState) — heuristic conflict detection
     *
     * P0 STANCE MATCHING CONTRACT (enforced in P1 implementation):
     *   isSupport(st): (st || '').toLowerCase().indexOf('support') !== -1
     *   isOppose(st):  (st || '').toLowerCase().indexOf('oppos')  !== -1
     *   DO NOT use === 'support' / === 'oppose' — AI stance values
     *   are free-form strings ("supporting", "opposed", "supports", etc.)
     *
     * DETECTION SCOPE (design boundaries, not bugs):
     *   - Detects: same coversQuestion + opposing stance + same Tier
     *   - Does NOT detect: sarcasm, metaphor, partial agreement
     *   - Depends on AI-annotated stance and authorityTier accuracy
     *   - False negatives more likely than false positives
     *   - Confidence ceiling: 0.7
     *
     * CONFLICT ENTRY FORMAT:
     *   { sourceA, sourceB, sourceAIndex, sourceBIndex,
     *     stanceA, stanceB, questionOverlap, severity,
     *     resolved: false,
     *     detectionMethod: "heuristic_stance_lexical",
     *     detectedAt: ISO8601 }
     *
     * INJECTION POINTS (P1):
     *   - ingest_source L1063 (after Store.pushSource, before tryAdvanceStage)
     *   - check_quality_gate L355 (idempotent: skip if conflicts.length > 0)
     */

    var MAX_SOURCES_FOR_CONFLICT = 200;

    function detectConflicts(sessionState) {
        // P1 (v3.5.0): Full heuristic conflict detection with complexity protection
        var sources = sessionState.sources || [];
        if (sources.length === 0) return [];
        if (sources.length > MAX_SOURCES_FOR_CONFLICT) {
            sessionState._conflictSkipped = true;
            sessionState._conflictSkipReason = 'sources=' + sources.length + ' > MAX=' + MAX_SOURCES_FOR_CONFLICT;
            return [];
        }
        if (sources.length <= 60) {
            return _detectConflictsFull(sources);
        }
        return _detectConflictsBucketed(sources);
    }

    function _detectConflictsFull(sources, origIndices) {
        var conflicts = [];
        for (var i = 0; i < sources.length; i++) {
            for (var j = i + 1; j < sources.length; j++) {
                var a = sources[i], b = sources[j];
                var conflict = _checkPairConflict(a, b, origIndices ? origIndices[i] : i, origIndices ? origIndices[j] : j);
                if (conflict) conflicts.push(conflict);
            }
        }
        return conflicts;
    }

    function _detectConflictsBucketed(sources) {
        var buckets = {};
        for (var i = 0; i < sources.length; i++) {
            var q = sources[i].coversQuestion || '__default__';
            (buckets[q] = buckets[q] || []).push({ source: sources[i], index: i });
        }
        var conflicts = [];
        for (var key in buckets) {
            if (buckets[key].length < 2) continue;
            var bucketConflicts = _detectConflictsFull(
                buckets[key].map(function(b) { return b.source; }),
                buckets[key].map(function(b) { return b.index; })
            );
            conflicts = conflicts.concat(bucketConflicts);
        }
        return conflicts;
    }

    function _isSupport(stance) {
        return (stance || '').toLowerCase().indexOf('support') !== -1;
    }

    function _isOppose(stance) {
        return (stance || '').toLowerCase().indexOf('oppos') !== -1;
    }

    function _checkPairConflict(a, b, ai, bi) {
        var sa = a.stance || '', sb = b.stance || '';
        var aSup = _isSupport(sa), aOpp = _isOppose(sa);
        var bSup = _isSupport(sb), bOpp = _isOppose(sb);
        var ta = a.authorityTier !== undefined ? a.authorityTier : a.tier;
        var tb = b.authorityTier !== undefined ? b.authorityTier : b.tier;
        if (ta !== undefined && tb !== undefined && Math.abs(ta - tb) > 1) return null;
        var qa = a.coversQuestion || '', qb = b.coversQuestion || '';
        if ((qa === qb || (qa && qb && qa.indexOf(qb) !== -1) || (qb && qa && qb.indexOf(qa) !== -1)) &&
            (aSup !== bSup || aOpp !== bOpp)) {
            return {
                sourceA: a.url || 'source_' + ai, sourceB: b.url || 'source_' + bi,
                sourceAIndex: ai, sourceBIndex: bi,
                stanceA: sa, stanceB: sb,
                questionOverlap: qa || qb,
                severity: (ta <= 1 && tb <= 1) ? 'high' : 'medium',
                resolved: false,
                detectionMethod: 'heuristic_stance_lexical',
                detectedAt: new Date().toISOString()
            };
        }
        return null;
    }

function countTermsByLang(sources, targetLang) { var c = 0; for (var i = 0; i < sources.length; i++) { var t = Array.isArray(sources[i].extractedTerms) ? sources[i].extractedTerms : []; c += t.filter(function(x) { return (x.language || sources[i].language || 'en') === targetLang; }).length; } return c; }
function countCnTerms(sources) { return countTermsByLang(sources, 'zh'); }
function countEnTerms(sources) { return countTermsByLang(sources, 'en'); }
    function checkCitationIndependence(sources) { var rm = {}; for (var i = 0; i < sources.length; i++) { var refs = sources[i].references || [], key = sources[i].url; if (!rm[key]) rm[key] = []; for (var j = 0; j < refs.length; j++) rm[key].push(refs[j]); } var echo = false, pairs = [], keys = Object.keys(rm); for (var a = 0; a < keys.length && !echo; a++) { for (var b = a + 1; b < keys.length && !echo; b++) { if (rm[keys[a]].indexOf(keys[b]) !== -1 && rm[keys[b]].indexOf(keys[a]) !== -1) { echo = true; pairs.push(keys[a] + '<->' + keys[b]); } } } return { hasEcho: echo, summary: echo ? 'Echo: ' + pairs.join(';') : 'No echo' }; }
    function checkOpposingQuality(sources) { var st = { pro: [], con: [] }; for (var i = 0; i < sources.length; i++) { if (sources[i].stance === 'pro') st.pro.push(sources[i]); if (sources[i].stance === 'con') st.con.push(sources[i]); } if (st.con.length === 0) return { passed: true, summary: 'No opposition' }; var hasQ = false; for (var j = 0; j < st.con.length; j++) { var tier = st.con[j].authorityTier !== undefined ? st.con[j].authorityTier : st.con[j].tier; if (tier !== undefined && tier <= 2) { hasQ = true; break; } } return { passed: hasQ, summary: hasQ ? 'Quality OK' : 'Opposition lacks Tier0-2' }; }
    function checkDimensionCoverage(dimensions, req) { for (var i = 0; i < req.length; i++) { for (var j = 0; j < dimensions.length; j++) { if (dimensions[j].toLowerCase().indexOf(req[i]) !== -1) return true; } } return false; }
    function checkDimensionCompleteness(dimensions, topic) { var ess = ['market','technology','security','pricing','regulation']; var cov = [], mis = []; for (var i = 0; i < ess.length; i++) { var found = false; for (var j = 0; j < dimensions.length; j++) { if (dimensions[j].toLowerCase().indexOf(ess[i]) !== -1) { found = true; break; } } if (found) cov.push(ess[i]); else mis.push(ess[i]); } return { passed: mis.length <= 1, summary: 'Cov:' + cov.join(',') + '; Mis:' + mis.join(',') }; }

// ── P1 (v3.5.0): _suggestNext decision engine with circuit breaker ──
var _suggestNextCircuitBreaker = { tripped: false, lastStage: '', lastAction: '', count: 0 };

function _makeSuggestNext(toolName, sessionState) {
    var currentStage = (sessionState && sessionState.currentStage) || 'INIT';
    
    // ── 10-tool mapping table ──
    var mapping = {
        start_research:          { stage: 'AUTHORITY_CLASSIFY', action: 'classify_authority',     reason: 'Initial session created; classify first sources' },
        classify_authority:      { stage: 'CROSS_VALIDATE',    action: 'ingest_source',           reason: 'Authority classified; proceed to cross-validation' },
        check_quality_gate:      function(ss) {
            var qg = (ss && ss.qualityGate) || {};
            var lr = qg.lastResult;
            if (lr && lr.allPassed) {
                return { stage: 'DEEP_ANALYZE', action: 'deep_analyze', reason: 'All quality gates passed' };
            }
            return { stage: 'GAP_DETECT', action: 'advance_search_round', reason: 'Gates failed; need more sources' };
        },
        tag_confidence:          { stage: 'CONFIDENCE_TAG',    action: 'check_quality_gate',      reason: 'Confidence tagged; re-evaluate quality gates' },
        deep_analyze:            { stage: 'THESIS_BUILD',  action: 'create_checkpoint',       reason: 'Deep analysis complete; save checkpoint' },
        create_checkpoint:       { stage: 'CONFIDENCE_TAG',    action: 'tag_confidence',          reason: 'Checkpoint saved; tag remaining assertions' },
        sync_to_plan:            null,
        orchestrate_research:    { stage: 'QUERY_PLAN',        action: 'advance_search_round',    reason: 'Pipeline initialized; advance to first search round' },
        ingest_source:           { stage: 'AUTHORITY_CLASSIFY', action: 'classify_authority',      reason: 'Source ingested; classify authority' },
        advance_search_round:    { stage: 'SEARCH',            action: 'orchestrate_research',    reason: 'Search round advanced; orchestrate next round' }
    };
    
    var entry = mapping[toolName];
    if (entry === undefined) return null;
    
    // Resolve function entries (e.g. check_quality_gate conditional)
    if (typeof entry === 'function') {
        entry = entry(sessionState);
    }
    
    // sync_to_plan is the pipeline terminus — always null
    if (entry === null) return null;
    
    // ── Circuit breaker: 3 consecutive identical suggestions without stage advance → degrade ──
    var cb = _suggestNextCircuitBreaker;
    if (entry.stage === cb.lastStage && entry.action === cb.lastAction) {
        cb.count++;
    } else {
        cb.lastStage = entry.stage;
        cb.lastAction = entry.action;
        cb.count = 1;
        cb.tripped = false;
    }
    
    if (cb.count >= 3 && currentStage === entry.stage) {
        cb.tripped = true;
        return { stage: 'STUCK', action: null, reason: 'Circuit breaker: 3x same suggestion (' + entry.stage + '/' + entry.action + ') without stage advancement. Pipeline stalled.', degraded: true, originalSuggestion: entry };
    }
    
    return entry;
}

    // ==================== Tool 4: tag_confidence ====================
    var tag_confidence = _wrapTool({
        name: 'tag_confidence',
        checkToggle: true,
        stage: 'CONFIDENCE_TAG',
        params: [{name:'assertion', hint:'assertion'}, {name:'sources', hint:'sources'}],
        suggestNext: 'tag_confidence',
        impl: async function(params, ss) {
            var assertion = params.assertion, sources = params.sources || [];
            if (!assertion) return { success: false, error: 'assertion is required' };  /* unreachable: _inputGuard */
            var _data = tagConfidenceV4(assertion, sources);
            return { success: true, data: _data };
        }
    });

    function tagConfidenceV4(assertion, sources) {
        var uc = detectUnmarkable(assertion);
        if (uc.isUnmarkable) return { level: 'UNMARKABLE', symbol: '[?]', reason: uc.reason, detail: 'unverifiable claim', splitSuggestion: uc.splitSuggestion };
        var cat = categorizeSources(sources);
        var attr = checkAttribution(assertion, sources);
        if (attr.mismatch) return { level: 'ATTRIB_ERR', symbol: '[-]', reason: attr.reason, detail: 'attribution mismatch' };
        var root = analyzeCitationRoots(sources);
        var num = checkNumberConsistency(sources);
        var conf = analyzeConflictType(sources);
        var score = calculateConfidenceScore(cat, root, num, conf);
        var tag = mapScoreToTag(score, cat, num);
        return { level: tag.level, symbol: tag.symbol, score: score, sourceCount: sources.length,
            independentRoots: root.independentCount, numberConsistent: num.consistent,
            conflictType: conf.type, tierBreakdown: cat.tierBreakdown, detail: tag.detail };
    }

function detectUnmarkable(assertion) {
    var text = (assertion || '').toLowerCase();
    // Superlatives: word-boundary match to avoid substring false positives
    var superlatives = ['best','strongest','most important','greatest'];
    for (var i = 0; i < superlatives.length; i++) {
        if (new RegExp('\\b' + superlatives[i].replace(/\s/g,'\\\s') + '\\b','i').test(text))
            return { isUnmarkable: true, reason: 'superlative: ' + superlatives[i], splitSuggestion: 'split into measurable metrics' };
    }
    var normativePhrases = ['should','must','ought to','need to'];
    for (var j = 0; j < normativePhrases.length; j++) {
        if (new RegExp('\\b' + normativePhrases[j].replace(/\s/g,'\\\s') + '\\b','i').test(text))
            return { isUnmarkable: true, reason: 'normative: ' + normativePhrases[j], splitSuggestion: 'separate normative from factual' };
    }
    var hasWill = /\\bwill\\b/i.test(text);
    var isConditional = /\\bif\\b/i.test(text) || /\\bassum/i.test(text);
    if (hasWill && !isConditional)
        return { isUnmarkable: true, reason: 'unconditional prediction', splitSuggestion: 'add constraints' };
    return { isUnmarkable: false };
}

    function categorizeSources(sources) {
        var t = { tier0: 0, tier1: 0, tier2: 0, tier3: 0, tier4: 0, unknown: 0 }, total = sources.length;
        for (var i = 0; i < sources.length; i++) { var tier = sources[i].authorityTier; if (tier === 0) t.tier0++; else if (tier === 1) t.tier1++; else if (tier === 2) t.tier2++; else if (tier === 3) t.tier3++; else if (tier === 4) t.tier4++; else t.unknown++; }
        return { tierBreakdown: t, hasTier0: t.tier0 > 0, hasTier01: (t.tier0 + t.tier1) > 0, onlyTier4: (t.tier4 === total && total > 0),
            dominantTier: (function() { if (t.tier0 / total >= 0.5) return 0; if (t.tier1 / total >= 0.5) return 1; if (t.tier2 / total >= 0.5) return 2; if (t.tier3 / total >= 0.5) return 3; if (t.tier4 / total >= 0.5) return 4; return -1; })() };
    }

    function checkAttribution(assertion, sources) {
        var orgs = ['anthropic','openai','github','google','microsoft'], mentioned = [];
        for (var i = 0; i < orgs.length; i++) { if (assertion.toLowerCase().indexOf(orgs[i]) !== -1 && mentioned.indexOf(orgs[i]) === -1) mentioned.push(orgs[i]); }
        if (mentioned.length === 0) return { mismatch: false };
        for (var k = 0; k < mentioned.length; k++) { var found = false; for (var l = 0; l < sources.length; l++) { if ((sources[l].url || '').toLowerCase().indexOf(mentioned[k]) !== -1) { found = true; break; } } if (!found) return { mismatch: true, reason: 'assertion mentions "' + mentioned[k] + '" but no primary source from that org' }; }
        return { mismatch: false };
    }

    function analyzeCitationRoots(sources) {
        var allUrls = [], allRefs = [];
        for (var i = 0; i < sources.length; i++) { allUrls.push(sources[i].url || ''); var refs = sources[i].references || []; for (var j = 0; j < refs.length; j++) { if (allRefs.indexOf(refs[j]) === -1) allRefs.push(refs[j]); } }
        var roots = []; for (var k = 0; k < allRefs.length; k++) { if (allUrls.indexOf(allRefs[k]) === -1) roots.push(allRefs[k]); }
        var indRoots = [];
        for (var l = 0; l < roots.length; l++) { var m = roots[l].match(/https?:\/\/([^\/]+)/); var host = m ? m[1] : roots[l]; var isNew = true; for (var n = 0; n < indRoots.length; n++) { if (indRoots[n].indexOf(host) !== -1 || host.indexOf(indRoots[n]) !== -1) { isNew = false; break; } } if (isNew) indRoots.push(host); }
        return { rootCount: roots.length, independentCount: indRoots.length, allSameRoot: indRoots.length <= 1 && roots.length > 0 };
    }

    function checkNumberConsistency(sources) {
        var nc = {};
        for (var i = 0; i < sources.length; i++) { var cv = sources[i].claimedValue; if (cv === undefined || cv === null) continue; var key = String(Math.round(cv * 100) / 100); if (!nc[key]) nc[key] = []; nc[key].push(sources[i]); }
        var keys = Object.keys(nc);
        if (keys.length === 0) return { consistent: true, type: 'no_numbers', detail: 'no quantitative data' };
        if (keys.length === 1) return { consistent: true, type: 'single_value', detail: '1 value, ' + nc[keys[0]].length + ' sources' };
        var vals = []; for (var k = 0; k < keys.length; k++) vals.push(parseFloat(keys[k]));
        var maxV = Math.max.apply(null, vals), minV = Math.min.apply(null, vals);
        var dev = (maxV - minV) / Math.max(Math.abs(minV), 0.001);
        return { consistent: dev < 0.15, type: dev < 0.05 ? 'close_match' : (dev < 0.15 ? 'minor_deviation' : 'significant_conflict'),
            values: vals, deviation: dev, detail: vals.length + ' values, dev ' + (dev * 100).toFixed(1) + '%' };
    }

    function analyzeConflictType(sources) {
        var proC = 0, conC = 0; for (var i = 0; i < sources.length; i++) { if (sources[i].stance === 'pro') proC++; if (sources[i].stance === 'con') conC++; }
        var dirConflict = (proC > 0 && conC > 0), numCheck = checkNumberConsistency(sources), numConflict = (numCheck.type === 'significant_conflict');
        if (numConflict && dirConflict) return { type: 'mixed_conflict', severity: 'high', detail: 'both number and direction conflicts' };
        if (numConflict) return { type: 'number_conflict', severity: 'medium', detail: 'divergent numbers' };
        if (dirConflict) return { type: 'directional_conflict', severity: 'medium', detail: 'opposite conclusions' };
        return { type: 'no_conflict', severity: 'none', detail: 'no significant conflict' };
    }

    function calculateConfidenceScore(cat, root, num, conf) {
        var score = 0.5;
        var sc = cat.tierBreakdown.tier0 + cat.tierBreakdown.tier1 + cat.tierBreakdown.tier2 + cat.tierBreakdown.tier3 + cat.tierBreakdown.tier4;
        score += Math.min(0.2, sc * 0.03);
        score += cat.tierBreakdown.tier0 * 0.1; score += cat.tierBreakdown.tier1 * 0.06; score += cat.tierBreakdown.tier2 * 0.02;
        score += Math.min(0.15, root.independentCount * 0.05);
        if (!num.consistent) score -= Math.min(0.3, num.deviation * 0.5);
        if (conf.severity === 'high') score -= 0.2; else if (conf.severity === 'medium') score -= 0.1;
        if (cat.onlyTier4) score -= 0.3;
        return Math.max(0.0, Math.min(1.0, score));
    }

    function mapScoreToTag(score, cat, num) {
        var ind = cat.tierBreakdown.tier0 + cat.tierBreakdown.tier1;
        var hasQuality = (cat.tierBreakdown.tier0 + cat.tierBreakdown.tier1 + cat.tierBreakdown.tier2) > 0;
        if (ind >= 2 && num.consistent && score >= 0.70) return { level: 'VERIFIED', symbol: '[V]', detail: '>=2 Tier0-1 independent, numbers match' };
        if (!hasQuality || score < 0.30) return { level: 'LOW_TRUST', symbol: '[X]', detail: 'no Tier0-2 source or severe data conflict' };
        if ((ind >= 1 || cat.tierBreakdown.tier2 >= 2) && score >= 0.55) return { level: 'LIKELY', symbol: '[L]', detail: 'authoritative support, logically coherent' };
        return { level: 'UNCERTAIN', symbol: '[U]', detail: 'insufficient or inconsistent sources' };
    }

    // ==================== Tool 5: deep_analyze ====================
    var deep_analyze = _wrapTool({
        name: 'deep_analyze',
        checkToggle: true,
        stage: 'DEEP_ANALYZE',
        params: [{name:'thesis', hint:'thesis'}, {name:'variables', hint:'variables'}, {name:'known_facts', hint:'known_facts'}],
        suggestNext: 'deep_analyze',
        impl: async function(params, ss) {
            var thesis = params.thesis, variables = params.variables || [], knownFacts = params.known_facts || [], depth = params.depth || 'standard';
            if (!thesis) return { success: false, error: 'thesis is required' };  /* unreachable: _inputGuard */
            var _data = deepAnalyzeV4(thesis, variables, knownFacts, depth);
            return { success: true, data: _data };
        }
    });

    function deepAnalyzeV4(thesis, variables, facts, depth) {
        depth = depth || 'standard'; var maxL = (depth === 'exhaustive') ? 5 : (depth === 'deep') ? 4 : 3;
        var cc = buildCausalChains(variables, facts);
        var cf = testCounterfactuals(cc, variables, facts);
        var alt = generateAlternatives(thesis, variables, facts);
        var layers = multiLayerReasoning(thesis, variables, cc, maxL);
        var fals = assessFalsifiability(thesis, variables);
        return { thesis: thesis, depth: depth, causalChains: cc, counterfactualTests: cf,
            alternativeExplanations: alt, reasoningLayers: layers, falsifiability: fals,
            metaAudit: { assumptionsMade: countAssumptions(layers),
                confidenceAfterAnalysis: calculateMetaConfidence(cc, cf, alt),
                keyUncertainties: identifyUncertainties(cc, alt) } };
    }

    function getUniqueKeywords(varName) { var name = varName.toLowerCase(), parts = name.split('_').concat(name.split(' ')), uniq = []; for (var i = 0; i < parts.length; i++) { if (parts[i].length > 2 && uniq.indexOf(parts[i]) === -1) uniq.push(parts[i]); } return uniq; }
    function doesFactMention(fact, varName) { if (!fact || !fact.text) return false; var text = fact.text.toLowerCase(), kw = getUniqueKeywords(varName); for (var i = 0; i < kw.length; i++) { if (text.indexOf(kw[i]) !== -1) return true; } return false; }
    function getFirstKeywordPosition(text, v1Name, v2Name) { var lower = text.toLowerCase(), kw1 = getUniqueKeywords(v1Name), kw2 = getUniqueKeywords(v2Name), minP1 = text.length, minP2 = text.length; for (var i = 0; i < kw1.length; i++) { var p = lower.indexOf(kw1[i]); if (p !== -1 && p < minP1) minP1 = p; } for (var j = 0; j < kw2.length; j++) { var q = lower.indexOf(kw2[j]); if (q !== -1 && q < minP2) minP2 = q; } return { p1: minP1 === text.length ? -1 : minP1, p2: minP2 === text.length ? -1 : minP2 }; }
    function hasCausalLanguage(text) { var cw = ['cause','causing','lead to','led to','leads to','result in','drive','drives','trigger','effect','impact','influence','due to','because']; var l = text.toLowerCase(); for (var i = 0; i < cw.length; i++) { if (l.indexOf(cw[i]) !== -1) return true; } return false; }

    // ── Optimized: finer-grained causal evidence scoring ──
    function findCausalEvidence(v1, v2, facts) {
    var s12 = 0, s21 = 0, rf = [], rt = 'correlation', causalHits = 0;
    for (var i = 0; i < facts.length; i++) { var f = facts[i], m1 = doesFactMention(f, v1.name), m2 = doesFactMention(f, v2.name);
    if (m1 && m2) { rf.push(f.id || ('F' + i));
    if (hasCausalLanguage(f.text)) { rt = 'causal_claim'; causalHits++;
        var pos = getFirstKeywordPosition(f.text, v1.name, v2.name);
        if (pos.p1 !== -1 && pos.p2 !== -1) {
            if (pos.p1 < pos.p2) s12 += 0.6;
            else if (pos.p2 < pos.p1) s21 += 0.6;
            else { s12 += 0.3; s21 += 0.3; }
        } else { s12 += 0.3; s21 += 0.3; }
    }
    else { s12 += 0.2; s21 += 0.2; } }
    else if (m1) s12 += 0.08; else if (m2) s21 += 0.08; }
    var dir = s12 > s21 ? 'forward' : (s21 > s12 ? 'reverse' : 'bidirectional');
    var str = Math.max(s12, s21), testable = (causalHits >= 1 && rt === 'causal_claim');
    return { direction: dir, strength: Math.min(1.0, str), type: rt, facts: rf, testable: testable,
        causalHitCount: causalHits, scoreDetail: { s12: s12.toFixed(2), s21: s21.toFixed(2) } };
}

    function buildCausalChains(vars, facts) { var chains = []; for (var i = 0; i < vars.length; i++) { for (var j = i + 1; j < vars.length; j++) { var ev = findCausalEvidence(vars[i], vars[j], facts); if (ev.strength > 0.2) { chains.push({ from: vars[i].name, to: vars[j].name, direction: ev.direction, strength: ev.strength, reasoningType: ev.type, supportingFacts: ev.facts, testable: ev.testable }); } } } chains.sort(function(a, b) { return b.strength - a.strength; }); var transitive = []; for (var a = 0; a < chains.length; a++) { for (var b = 0; b < chains.length; b++) { if (a !== b && chains[a].to === chains[b].from) { var ts = Math.min(chains[a].strength, chains[b].strength) *0.7; if (ts >0.2) { var alreadyExists = false; for (var c =0; c < chains.length; c++) { if (chains[c].from === chains[a].from && chains[c].to === chains[b].to) { alreadyExists = true; break; } } for (var d =0; d < transitive.length; d++) { if (transitive[d].from === chains[a].from && transitive[d].to === chains[b].to) { alreadyExists = true; break; } } if (!alreadyExists) transitive.push({ from: chains[a].from, to: chains[b].to, direction: 'forward', strength: ts, reasoningType: 'transitive', supportingFacts: (chains[a].supportingFacts || []).concat(chains[b].supportingFacts || []), testable: chains[a].testable && chains[b].testable }); } } } } return chains.concat(transitive).sort(function(a, b) { return b.strength - a.strength; }); }
    function testCounterfactuals(chains, vars, facts) { var tests = []; for (var i = 0; i < Math.min(chains.length, 5); i++) { var c = chains[i]; if (c.strength < 0.5) continue; tests.push({ hypothesis: c.from + ' -> ' + c.to, counterfactual: 'If ' + c.from + ' were absent, would ' + c.to + ' still occur?', testMethod: c.testable ? 'controlled_comparison' : 'thought_experiment', dependenceStrength: c.strength, plausibleWithout: c.strength < 0.7 }); } return tests; }
    // ── Optimized: dynamic alternative explanations based on actual variables ──
    function generateAlternatives(thesis, vars, facts) {
        var alts = [];
        // Reverse causality: always plausible when >=2 variables
        if (vars.length >= 2) {
            alts.push({ type: 'reverse_causality',
                description: 'Causality direction may be reversed: ' + vars[1].name + ' → ' + vars[0].name,
                plausibility: 0.25 + (vars.length > 3 ? 0.1 : 0) });
        }
        // Common cause: more plausible with more variables
        if (vars.length >= 3) {
            alts.push({ type: 'common_cause',
                description: 'Unobserved third variable may drive all changes across ' + vars.length + ' variables',
                plausibility: 0.3 + (vars.length > 4 ? 0.1 : 0) });
        }
        // Selection bias: check if facts are all from similar sources
        var factSources = {};
        for (var i = 0; i < facts.length; i++) {
            var src = (facts[i].sourceUrl || facts[i].source || 'unknown');
            factSources[src] = (factSources[src] || 0) + 1;
        }
        var uniqueSources = Object.keys(factSources).length;
        if (uniqueSources <= 2 && facts.length >= 3) {
            alts.push({ type: 'selection_bias',
                description: 'Only ' + uniqueSources + ' unique sources for ' + facts.length + ' facts — possible selection bias',
                plausibility: 0.3 + (uniqueSources === 1 ? 0.15 : 0) });
        } else {
            alts.push({ type: 'selection_bias',
                description: 'Observed pattern may be survivorship or selection bias',
                plausibility: 0.2 });
        }
        // Confounding variable: always considered
        alts.push({ type: 'confounding',
            description: 'Correlation may not imply causation — confounding variable possible',
            plausibility: 0.35 });
        return alts;
    }
    function findIndirectEffects(chains) { var ind = []; for (var i = 0; i < chains.length; i++) { for (var j = 0; j < chains.length; j++) { if (i !== j && chains[i].to === chains[j].from) ind.push(chains[i].from + '->' + chains[i].to + '->' + chains[j].to); } } return ind; }
    function multiLayerReasoning(thesis, vars, chains, maxL) { var layers = []; var de = chains.filter(function(c) { return c.strength >= 0.7; }); layers.push({ layer: 1, name: 'Direct Effects', count: de.length, topChains: de.slice(0, 3).map(function(c) { return c.from + '->' + c.to + '(' + c.strength.toFixed(2) + ')'; }), confidence: de.length > 0 ? 'high' : 'moderate' }); if (maxL >= 2) { var ie = findIndirectEffects(chains); layers.push({ layer: 2, name: 'Indirect/Second-Order', count: ie.length, topChains: ie.slice(0, 3), confidence: ie.length > 0 ? 'moderate' : 'low' }); } if (maxL >= 3) { layers.push({ layer: 3, name: 'System-Level Emergence', count: vars.length, topChains: ['Multiple interacting variables create feedback loops'], confidence: 'speculative' }); } return layers; }
    function assessFalsifiability(thesis, vars) { var hm = vars.length >= 2, hp = (thesis.indexOf('will') !== -1 || thesis.indexOf('by 20') !== -1); if (hm && hp) return { level: 'falsifiable', score: 0.8, detail: 'measurable vars + temporal prediction' }; if (hm) return { level: 'partially_falsifiable', score: 0.5, detail: 'measurable vars but no time constraint' }; return { level: 'unfalsifiable', score: 0.2, detail: 'no measurable vars, hard to falsify' }; }
    function countAssumptions(layers) { var c = 0; for (var i = 0; i < layers.length; i++) { if (layers[i].confidence === 'speculative') c += 3; else if (layers[i].confidence === 'low') c += 2; else if (layers[i].confidence === 'moderate') c += 1; } return c; }
    function calculateMetaConfidence(chains, cf, alt) { var avg = 0; for (var i = 0; i < chains.length; i++) avg += chains[i].strength; avg = chains.length > 0 ? avg / chains.length : 0; var penalty = 0; for (var j = 0; j < cf.length; j++) { if (cf[j].plausibleWithout) penalty += 0.05; } return Math.max(0.2, Math.min(0.95, avg - penalty)); }
    function identifyUncertainties(chains, alt) { var unc = []; for (var i = 0; i < chains.length; i++) { if (chains[i].strength < 0.5 && chains[i].strength >= 0.3) unc.push('Weak: ' + chains[i].from + '->' + chains[i].to + '(' + chains[i].strength.toFixed(2) + ')'); } if (alt.length > 0) unc.push('Alternative explanations not ruled out (' + alt.length + ')'); return unc; }

// ═══════════════════════════════════════════════════════════
// P2 (v3.6.0) Item 2: PipelineWriter with capacity protection
// ═══════════════════════════════════════════════════════════
var MAX_CHECKPOINTS = 100;

function PipelineWriter_write(sessionId, checkpoint) {
    try {
        var dir = '/sdcard/Operit/deep_research/pipeline/' + sessionId + '/';
        var fDir = new java.io.File(dir);
        if (!fDir.exists()) fDir.mkdirs();
        var filename = dir + 'checkpoint_' + checkpoint.checkpointId + '.json';
        var fos = new java.io.FileOutputStream(filename);
        try {
            var bytes = new java.lang.String(JSON.stringify(checkpoint)).getBytes('UTF-8');
            fos.write(bytes);
        } finally {
            try { fos.close(); } catch(ignored) {}
        }
        // ── Rotate: enforce MAX_CHECKPOINTS ──
        try {
            var files = fDir.listFiles();
            if (files && files.length > MAX_CHECKPOINTS) {
                java.util.Arrays.sort(files, function(a, b) {
                    return java.lang.Long.compare(a.lastModified(), b.lastModified());
                });
                var toDelete = files.length - MAX_CHECKPOINTS;
                for (var i = 0; i < toDelete; i++) {
                    files[i].delete();
                }
            }
        } catch (e) {
            // rotate failure must not interrupt main flow
        }
        return true;
    } catch (e) {
        // fail-soft: write failure must not interrupt main flow
        return false;
    }
}

    // ── PipelineWriter_read: load latest checkpoint for resume (v3.9.0 Phase2) ──
    function PipelineWriter_read(sessionId) {
        try {
            var dir = '/sdcard/Operit/deep_research/pipeline/' + sessionId + '/';
            var fDir = new java.io.File(dir);
            if (!fDir.exists()) return null;
            var files = fDir.listFiles();
            if (!files || files.length === 0) return null;
            // Sort by lastModified descending, pick newest checkpoint_*.json
            var candidates = [];
            for (var i = 0; i < files.length; i++) {
                var name = files[i].getName();
                if (name.indexOf('checkpoint_') === 0 && name.indexOf('.json') !== -1) {
                    candidates.push(files[i]);
                }
            }
            if (candidates.length === 0) return null;
            candidates.sort(function(a, b) { return b.lastModified() - a.lastModified(); });
            var newest = candidates[0];
            var reader = new java.io.BufferedReader(new java.io.InputStreamReader(
                new java.io.FileInputStream(newest), 'UTF-8'));
            var sb = new java.lang.StringBuilder();
            try {
                var line;
                while ((line = reader.readLine()) !== null) {
                    sb.append(line);
                }
            } finally {
                try { reader.close(); } catch(ignored) {}
            }
            var ckpt = JSON.parse(sb.toString());
            return ckpt && ckpt.sessionState ? ckpt : null;
        } catch(e) {
            return null;  // fail-soft: read failure returns null, caller handles
        }
    }

    // ==================== Tool 6: create_checkpoint ====================
    var create_checkpoint = _wrapTool({
name: 'create_checkpoint',
            checkToggle: true,
            requiresSession: true,
            stage: 'CHECKPOINT',
            params: [{name:'session_state', hint:'session_state'}],
        suggestNext: 'create_checkpoint',
        impl: async function(params, ss) {
            var sessionState = ss;
            var _data = createCheckpointV4(sessionState);
            return { success: true, data: _data };
        }
    });

    function createCheckpointV4(sessionState) {
        var now = new Date().toISOString();
        var searchObj = sessionState.search || {};
        var qgObj = sessionState.qualityGate || {};
        var langCfg = sessionState.languageConfig || {};

        // ── P2 (v3.6.0) Item 2: PipelineWriter activated ──
        var checkpoint = { checkpointId: 'ckpt_' + Date.now(), timestamp: now, version: 'v3.2-V4',
            meta: { thesis: sessionState.thesis || null, topic: sessionState.query || sessionState.topic || null, startedAt: sessionState.startedAt || now, languagePriority: langCfg.mode || sessionState.languagePriority || 'balanced' },
            stateMachine: { currentStage: sessionState.currentStage || 'INIT', completedStages: sessionState.completedStages || [], stageResults: sessionState.stageResults || {} },
            search: { rounds: searchObj.rounds || 0, roundAdvances: searchObj.roundAdvances || 0, totalSearches: searchObj.totalSearches || 0, totalIngested: searchObj.totalIngested || 0, pendingQueries: searchObj.pendingQueries || [], searchHistory: (searchObj.searchHistory || []).slice(-10) },
            sources: { total: (sessionState.sources || []).length,
                byLanguage: ckptCountByLang(sessionState.sources || []),
                byTier: ckptCountByTier(sessionState.sources || []),
                urls: (sessionState.sources || []).map(function(s) { return s.url; }) },
            factsForArchive: (sessionState.extractedFacts || []).filter(function(f) { return f.confidence !== undefined && f.confidence >= 4; }),
            archiveHint: "AI: iterate factsForArchive[], call extended_memory_tools:create_memory per item with title=fact.text[0:80], content=JSON.stringify(fact), tags constructed per memory_bridge.md (conditional push only). Skip if factsForArchive is empty.",
            qualityGate: { lastCheck: qgObj.lastCheck || null, lastResult: qgObj.lastResult || null, failedGates: qgObj.failedGates || [], checkCount: qgObj.checkCount || 0 },
            confidence: { stats: ckptCountByConfidence(sessionState.assertions || []) },
            gaps: sessionState.gaps || [], unresolvedConflicts: (sessionState.conflicts || []).filter(function(c) { return !c.resolved; }),
            deepAnalysis: { executed: !!sessionState.deepAnalysisResult, lastResult: sessionState.deepAnalysisResult ? ckptTruncate(sessionState.deepAnalysisResult) : null },
            resume: { nextActions: genResumeActions(sessionState), estimatedRemainingStages: estRemaining(sessionState), priorityGaps: (sessionState.gaps || []).filter(function(g) { return g.priority === 'high'; }) } };
        // ── PipelineWriter: fail-soft write ──
        try {
            PipelineWriter_write(sessionState.sessionId, checkpoint);
        } catch (e) {
            // fail-soft: silently ignore write failure
        }
        return checkpoint;
    }

    function ckptCountByLang(sources) { var r = {}; for (var i = 0; i < sources.length; i++) { var l = sources[i].language || 'unknown'; r[l] = (r[l] || 0) + 1; } return r; }
    function ckptCountByTier(sources) { var r = {}; for (var i = 0; i < sources.length; i++) { var t = 'tier' + (sources[i].authorityTier !== undefined ? sources[i].authorityTier : 'unknown'); r[t] = (r[t] || 0) + 1; } return r; }
    function ckptCountByConfidence(assertions) { var s = { V: 0, L: 0, U: 0, X: 0, UNMARKABLE: 0, ATTRIB_ERR: 0 }; for (var i = 0; i < assertions.length; i++) { var a = assertions[i]; var sym = a.symbol || a.level || a.confidenceLevel || ''; if (sym === '[V]' || sym === 'VERIFIED') s.V++; else if (sym === '[L]' || sym === 'LIKELY') s.L++; else if (sym === '[U]' || sym === 'UNCERTAIN') s.U++; else if (sym === '[X]' || sym === 'LOW_TRUST') s.X++; else if (sym === '[?]' || sym === 'UNMARKABLE') s.UNMARKABLE++; else if (sym === '[-]' || sym === 'ATTRIB_ERR') s.ATTRIB_ERR++; } return s; }
    function ckptTruncate(analysisResult) { return { thesis: analysisResult.thesis, causalChainCount: (analysisResult.causalChains || []).length, falsifiability: analysisResult.falsifiability ? analysisResult.falsifiability.level : null, metaConfidence: analysisResult.metaAudit ? analysisResult.metaAudit.confidenceAfterAnalysis : null }; }
    function genResumeActions(sessionState) { var actions = [], stage = sessionState.currentStage || 'INIT', order = STAGE_CONFIG.order; var ci = order.indexOf(stage); if (ci === -1) ci = 0; for (var i = ci; i < Math.min(order.length, ci + 3); i++) { actions.push({ stage: order[i], action: 'resume_from_' + order[i].toLowerCase() }); } return actions; }
    // ==================== Tool 7: sync_to_plan ====================
    var sync_to_plan = _wrapTool({
        name: 'sync_to_plan',
        checkToggle: true,
        requiresSession: true,
        params: [{name:'session_state', hint:'session_state'}],
        suggestNext: 'sync_to_plan',
        impl: async function(params, ss) {
            var sessionState = ss, action = params.action || 'snapshot';
            var planTodo = buildPlanTodo(sessionState, action);
            return { success: true, data: { action: action, plantodo: planTodo.plantodo,
                summary: planTodo.summary, stageProgress: planTodo.stageProgress,
                usage_instruction: planTodo.usage_instruction } };
        }
    });

    function buildPlanTodo(sessionState, action) {
        var stages = (sessionState.stageDefinitions && sessionState.stageDefinitions.length > 0) ? sessionState.stageDefinitions : DEFAULT_STAGES;
        var completed = sessionState.completedStages || [];
        var current = sessionState.currentStage || 'INIT';
        var query = sessionState.query || 'Research';
        var results = sessionState.stageResults || {};
        var lines = [], progressItems = [];
        var totalStages = stages.length, completedCount = completed.length;
        var pct = totalStages > 0 ? Math.round(completedCount / totalStages * 100) : 0;

        lines.push('## 🔬 ' + query + ' — DeepResearch');
        lines.push('');
        lines.push('> **Progress**: ' + completedCount + '/' + totalStages + ' stages (' + pct + '%) | **Current**: ' + current);
        lines.push('');

        for (var i = 0; i < stages.length; i++) {
            var sid = stages[i].id, sname = stages[i].name;
            var isCompleted = completed.indexOf(sid) !== -1;
            var isCurrent = sid === current;
            var marker = isCompleted ? '[x]' : (isCurrent ? '[~]' : '[ ]');
            var label = isCompleted ? '✅ ' + sname : (isCurrent ? '🔄 **' + sname + '**' : '⏳ ' + sname);
            lines.push('- ' + marker + ' ' + label);
            progressItems.push({ stageId: sid, stageName: sname, completed: isCompleted, current: isCurrent });
        }

        if (action === 'complete' && pct >= 100) {
            lines.push('');
            lines.push('> ✅ Research complete. All ' + totalStages + ' stages passed.');
        }

        var usage = 'Copy this block into PLAN.md or use with plan mode. Stages auto-track via create_checkpoint.';
        return { plantodo: lines.join('\n'), summary: completedCount + '/' + totalStages + ' stages (' + pct + '%)',
            stageProgress: progressItems, currentStage: current, query: query,
            usage_instruction: usage };
    }

    function estRemaining(sessionState) { var c = (sessionState.completedStages || []).length; return Math.max(0, DEFAULT_STAGES.length - c); }

 // ═══════════════════════════════════════════════════════
 // Idempotency guard — one execution per query per 60s window
 // ═══════════════════════════════════════════════════════
 var _lastExecution = { query: "", time: 0 };

// ═══════════════════════════════════════════════════════════
// P2 (v3.6.0) Item 5: Multi-session coordination — decomposeSubtasks
// ═══════════════════════════════════════════════════════════
function decomposeSubtasks(query) {
    // Heuristic: detect comparison/compound queries
    var ql = query.toLowerCase();
    var comparisonMarkers = [' vs ', ' versus ', ' compare ', ' comparison ', ' and '];
    var hasComparison = false;
    for (var i = 0; i < comparisonMarkers.length; i++) {
        if (ql.indexOf(comparisonMarkers[i]) !== -1) { hasComparison = true; break; }
    }
    if (!hasComparison) return [];
    
    // Extract candidate entities (capitalized words or known product names)
    var entities = [];
    var words = query.split(/\s+/);
    var currentEntity = '';
    for (var w = 0; w < words.length; w++) {
        var word = words[w];
        // Heuristic: entities are capitalized or contain digits/version numbers
        if (/^[A-Z][a-zA-Z]*$/.test(word) || /\d/.test(word) || word.length >= 4) {
            if (currentEntity) currentEntity += ' ';
            currentEntity += word;
        } else if (comparisonMarkers.indexOf(' ' + word.toLowerCase() + ' ') === -1) {
            if (currentEntity && currentEntity.length >= 2) {
                entities.push(currentEntity);
                currentEntity = '';
            }
        }
    }
    if (currentEntity && currentEntity.length >= 2) entities.push(currentEntity);
    
    // Extract dimensions (aspects being compared)
    var dimensions = [];
    var dimKeywords = ['performance', 'benchmark', 'coding', 'reasoning', 'math', 'safety',
        'latency', 'throughput', 'cost', 'accuracy', 'capability', 'feature', 'speed',
        'quality', 'reliability', 'scalability', 'usability'];
    for (var d = 0; d < dimKeywords.length; d++) {
        if (ql.indexOf(dimKeywords[d]) !== -1) dimensions.push(dimKeywords[d]);
    }
    if (dimensions.length === 0) dimensions = ['overall'];
    
    // Build subTasks: entities × dimensions, capped at 6
    var subTasks = [];
    var subId = 1;
    for (var e = 0; e < entities.length && subTasks.length < 6; e++) {
        for (var dm = 0; dm < dimensions.length && subTasks.length < 6; dm++) {
            subTasks.push({
                id: 'sub' + subId,
                query: entities[e] + ' ' + dimensions[dm],
                entity: entities[e],
                dimension: dimensions[dm]
            });
            subId++;
        }
    }
    
    // If still empty after all that, return empty (single-dimension)
    if (subTasks.length === 0) return [];
    
    return subTasks;
}

 // ==================== Tool 8: orchestrate_research ====================
 // v3.2.26: Three-mode dispatch — FORCE executes + closes toggle (finally),
 // SUGGEST returns assessment only, OFF prompts to enable.
 // Idempotency: same query within 60s is blocked.
async function orchestrate_research(params) {
      var mode = "suggest";
    var isForce = false;
    var _forceFailed = false;  // v4.4.1: track FORCE failure for finally-block menu state
    var ctx = getAppContext();  // Single acquisition — reused throughout
      try {
var ig = _inputGuard(params, [{name:'query', hint:'query'}]); if (ig) return ig;
var query = params.query;
         if (!query || query.trim() === '') return { success: false, error: 'query is required' };  /* unreachable: _inputGuard */

         // ── Clear any prior active session (new orchestration supersedes) ──
         clearActiveSession();

         // ── Idempotency: same query within 60s → skip ──
         var now = Date.now();
         var qKey = query.trim().toLowerCase();
         if (_lastExecution.query === qKey && (now - _lastExecution.time) < 60000) {
return {
                  success: false,
                  error: 'Idempotent block: same query processed ' + Math.floor((now - _lastExecution.time) / 1000) + 's ago. Wait before re-running.',
                  _errorCode: 'IDEMPOTENT_BLOCK',
                  _errorCategory: ERROR.code.IDEMPOTENT_BLOCK.cat,
                  idempotent: true
              };
         }

         // ── Mode gate ──
         mode = readMode();
         if (mode === "off") {
             return {
                 success: false,
                 error: 'Deep Research is OFF. Tap the input menu (⋮ → Deep Research) to enable.',
                 toggleRequired: true,
                 mode: "off"
             };
         }

         isForce = (mode === "force");

         if (mode === "suggest") {
             // ── SUGGEST: light assessment, no execution, keep toggle ──
             // SUGGEST is a diagnostic mode — no RUN_PENDING required.
             var languageConfig = resolveLanguagePriority(query, "auto");
             var dimensions = identifyDimensions(query);
             var topicProfile = profileTopic(query);
             return {
                 success: true,
                 mode: "suggest",
                 executed: false,
                 assessment: {
                     query: query,
                     dimensions: dimensions,
                     topicProfile: topicProfile,
                     languageConfig: { mode: languageConfig.mode, primaryLang: languageConfig.primaryLang }
                 },
                 note: 'SUGGEST: assessment only (diagnostic mode). Toggle stays ON.'
             };
         }

// ── FORCE: validate execution request before running ──
          var runPending = ctx ? Boolean(ApiPreferences.getFeatureToggleBlocking(ctx, RUN_PENDING_KEY, false)) : false;
         if (!runPending) {
return {
 success: false,
 error: 'No pending execution request. Tap Deep Research in the input menu first to request execution.',
 _errorCode: 'NO_RUN_PENDING',
 _errorCategory: ERROR.code.NO_RUN_PENDING.cat,
 runPending: false,
 mode: mode
};
}

// ── EXEC_LOCK: persistent mutex (prevents cross-cycle re-entry) ──
var execLock = ctx ? Boolean(ApiPreferences.getFeatureToggleBlocking(ctx, EXEC_LOCK_KEY, false)) : false;
if (!execLock) {
if (ctx) ApiPreferences.setFeatureToggleBlocking(ctx, RUN_PENDING_KEY, false);
return { success: false, error: 'Execution lock not set. Toggle OFF then ON to re-arm.', _errorCode: 'LOCK_MISSING', _errorCategory: ERROR.code.LOCK_MISSING.cat, lock_missing: true, mode: mode };
}

// ── CONSUME run request BEFORE execution (hard rule) ──
        if (ctx) {
            ApiPreferences.setFeatureToggleBlocking(ctx, RUN_PENDING_KEY, false);
            ApiPreferences.setFeatureToggleBlocking(ctx, 'deep_research_awaiting_input', false); // v4.4.2
        }

        // ── Clear previous result keys before new execution ──
          if (ctx) {
              ApiPreferences.setFeatureToggleBlocking(ctx, LAST_DONE_KEY, false);
              ApiPreferences.setFeatureToggleBlocking(ctx, LAST_FAILED_KEY, false);
          }

          var languagePriority = params.language_priority || 'auto';
          var planAware = params.plan_aware === true;
          var base = await start_research({ query: query, language_priority: languagePriority, plan_aware: planAware });
if (!base.success) {
            // Record failure before returning
            _forceFailed = true;  // v4.4.1: signal finally block to use OUTPUT
            if (ctx) ApiPreferences.setFeatureToggleBlocking(ctx, LAST_FAILED_KEY, true);
            _updateMenuState('OUTPUT');  // v4.4.1: pipeline failed → menu idle
            return base;
        }

         // ── FORCE: record idempotency only after successful execution ──
         _lastExecution = { query: qKey, time: now };
var sessionState = base.sessionState;
          // v4.1.0 Phase4: inject plan-mode metadata if plan_aware
          if (planAware) {
              sessionState.planIntegration = true;
              sessionState.plan_aware = true;
              sessionState.planProgress = base.planProgress || '0%';
          }
          // ── v3.6.1: Set active session for defense-in-depth toggle fallback ──
          setActiveSession(sessionState.sessionId);
        _updateMenuState('QUERY_PLAN');  // v4.4.1: menu reflects pipeline start
        // ── v3.2.27: push pipeline past INIT, set baseline round ──
         sessionState.currentStage = 'QUERY_PLAN';
         sessionState.completedStages.push('INIT');
         sessionState.stageResults['INIT'] = { completedAt: new Date().toISOString(), output: 'Session initialized' };
         advanceSearchRound(sessionState);
         var baselineQG = checkQualityGateV4(sessionState, query);
         sessionState.qualityGate.lastCheck = new Date().toISOString();
         sessionState.qualityGate.lastResult = baselineQG;
         sessionState.qualityGate.checkCount = 1;
var guide = buildOrchestrationGuide(sessionState, base.meta);

// ── Record success result ──
           if (ctx) ApiPreferences.setFeatureToggleBlocking(ctx, LAST_DONE_KEY, true);

          var _subTasks = decomposeSubtasks(query);
          if (_subTasks.length > 0) {
              sessionState.subTasks = _subTasks;
          }
          _writeAutoCheckpoint('INIT', sessionState); // v4.0.0 Phase3
          return Metrics.attachTo({
             success: true,
             mode: "force",
             executed: true,
             sessionState: sessionState,
             orchestrationPlan: guide,
             baselineQualityGate: baselineQG,
             pipelineStatus: 'INIT completed. Stage QUERY_PLAN ready. Base QG: ' + baselineQG.passedCount + '/' + baselineQG.gateCount + ' passed.',
             meta: base.meta,
             plantodo: base.plantodo || null,
             planProgress: base.planProgress || null,
             toggleAutoClosed: true,
              note: 'FORCE: one-shot execution. Run request consumed. Pipeline advanced to QUERY_PLAN. Remaining stages require AI to call tools step-by-step.',
              subTasks: _subTasks.length > 0 ? _subTasks : undefined,
              _suggestNext: _makeSuggestNext('orchestrate_research', sessionState)
           });
} catch (e) {
// ── Record failure result ──
            _forceFailed = true;  // v4.4.1: signal finally block to use OUTPUT
            if (ctx) ApiPreferences.setFeatureToggleBlocking(ctx, LAST_FAILED_KEY, true);
          var ce = _classifyError(e); // v4.0.0 Phase3
          return { success: false, error: ce.hint + ' (orchestrate_research: ' + e.message + ')', mode: mode, _errorCode: ce.code, _errorCategory: ce.cat };
     } finally {
        // ── Always close toggle in FORCE mode (one-shot window) ──
        if (isForce) {
            try {
                closeToggle(_forceFailed ? 'OUTPUT' : 'RUNNING'); // v4.4.1: OUTPUT if failed, RUNNING if success
                if (ctx) { try { ApiPreferences.setFeatureToggleBlocking(ctx, 'deep_research_awaiting_input', false); } catch(e) {} }
            } catch (e) {
                // cleanup failure must not mask primary error
            }
        }
    }
 }

// ── Optimized: machine-checkable doneWhen conditions ──
 function buildOrchestrationGuide(sessionState, meta) {
       meta = meta || {};
       var stages = (sessionState.stageDefinitions && sessionState.stageDefinitions.length > 0) ? sessionState.stageDefinitions : DEFAULT_STAGES;
       var languageConfig = sessionState.languageConfig || {};
       var searchPlan = (sessionState.search && sessionState.search.plan) || {};
       var subQCount = meta.subQuestionCount || (sessionState.subQuestions ? sessionState.subQuestions.length : 0);
       var dimensions = meta.dimensions || sessionState.dimensions || [];
       var phases = [];
       for (var i = 0; i < stages.length; i++) {
           var s = stages[i];
           var p = { stage: s.id, name: s.name, order: i + 1, totalStages: stages.length,
               externalTools: [], internalTools: [], instruction: '', doneWhen: '', checkFn: null };
           switch (s.id) {
               case 'INIT':
                   p.instruction = 'Session initialized with ' + subQCount + ' sub-questions, ' + dimensions.length + ' dimensions. Ready to proceed.';
                   p.internalTools = ['start_research'];
                   p.doneWhen = 'Stage INIT completed — session initialized'; break;
               case 'QUERY_PLAN':
                   p.instruction = 'Review search plan. Prepare external tools: visit_web, browser, google_search, tavily, duckduckgo. Prioritize ' + (languageConfig.primaryLang || 'EN').toUpperCase() + ' sources.';
                   p.externalTools = ['visit_web', 'browser', 'google_search', 'tavily', 'duckduckgo'];
                   p.doneWhen = 'Search plan generated with at least one query'; break;
               case 'SEARCH':
                   var qs = (searchPlan.queries || []).slice(0, 3).map(function(q) { return '"' + q.query + '"'; }).join(', ');
                   p.instruction = 'Execute searches. Queries: ' + qs + '. For EACH result found, call ingest_source with: { url, title, snippet, language, stance, hasQuantitative, extractedFacts, coversQuestion }.';
                   p.externalTools = ['visit_web', 'browser', 'google_search', 'tavily', 'duckduckgo'];
                   p.internalTools = ['ingest_source'];
                   p.doneWhen = 'At least 3 sources ingested across at least 1 search round'; break;
               case 'FETCH':
                   p.instruction = 'Fetch full page content of top-tier sources. Extract: key facts, quantitative data, author credentials, publication date. For each fact extracted, append to source.extractedFacts and re-call ingest_source (duplicate-safe).';
                   p.externalTools = ['visit_web'];
                   p.internalTools = ['ingest_source'];
                   p.doneWhen = 'All Tier 0-2 sources have extracted facts populated'; break;
               case 'EXTRACT':
                   p.instruction = 'Structure extracted data: group facts by sub-question ID, identify quantitative claims, note author affiliations. Run classify_authority on each source URL if not yet classified.';
                   p.internalTools = ['classify_authority'];
                   p.doneWhen = 'All sources have authority tier assigned'; break;
               case 'AUTHORITY_CLASSIFY':
                   p.instruction = 'Run classify_authority for every source URL. Record tier (0-4) and authority type. Flag any Tier 4 sources for replacement.';
                   p.internalTools = ['classify_authority'];
                   p.doneWhen = 'All sources are classified with no undefined authority tier'; break;
               case 'CROSS_VALIDATE':
                   p.instruction = 'Cross-check facts across sources. For each claim: does another independent source corroborate? Mark conflicting claims as unresolved. Use tag_confidence on key assertions.';
                   p.internalTools = ['tag_confidence'];
                   p.doneWhen = 'Cross-validation complete with conflict resolution status recorded'; break;
               case 'GAP_DETECT':
                   p.instruction = 'Run check_quality_gate to identify gaps. Check: source count, sub-question coverage, ZH/EN balance, quantitative data, bias balance. If gaps found, loop back to SEARCH stage.';
                   p.internalTools = ['check_quality_gate'];
                   p.doneWhen = 'Quality gate check completed; decision is PROCEED or BACKFILL'; break;
               case 'DEEP_ANALYZE':
                   p.instruction = 'Formulate thesis from extracted facts. Identify key variables. Run deep_analyze with thesis + variables + known_facts. Review causal chains, counterfactuals, and falsifiability.';
                   p.internalTools = ['deep_analyze'];
                   p.doneWhen = 'Deep analysis result is set and contains at least one causal chain'; break;
               case 'THESIS_BUILD':
                   p.instruction = 'Synthesize all findings into a thesis statement. Must address all dimensions: ' + dimensions.join(', ') + '. Include supporting evidence and counterpoints.';
                   p.doneWhen = 'Thesis statement is set and non-empty'; break;
               case 'QUALITY_GATE':
                   p.instruction = 'Run full check_quality_gate (15 gates). Address ALL failed gates before proceeding. Common failures: insufficient sources (<6), missing CN authority sources, unresolved conflicts.';
                   p.internalTools = ['check_quality_gate'];
                   p.doneWhen = 'All quality gate checks passed'; break;
               case 'CONFIDENCE_TAG':
                   p.instruction = 'Tag every assertion with tag_confidence. Output: [V] Verified, [L] Likely, [U] Uncertain, [X] Low Trust, [?] Unmarkable, [-] Attribution Error.';
                   p.internalTools = ['tag_confidence'];
                   p.doneWhen = 'Assertions are populated and at least 30% are marked V or L'; break;
               case 'COMPILE':
                   p.instruction = 'Compile final research output. Structure: 1) Executive Summary 2) Methodology 3) Findings by Dimension 4) Confidence Assessment 5) Source Table with Tiers 6) Gaps & Limitations. Call create_checkpoint to snapshot state.';
                   p.internalTools = ['create_checkpoint', 'sync_to_plan'];
                   p.doneWhen = 'At least one checkpoint has been saved'; break;
               case 'OUTPUT':
                   p.instruction = 'Deliver final output to user. If plan mode active, call sync_to_plan(action=complete). Mark research as done.';
                   p.internalTools = ['sync_to_plan'];
                   p.doneWhen = 'Output delivered and plan synchronized when applicable'; break;
           }
           phases.push(p);
       }
       return {
           title: 'DeepResearch Orchestration Plan',
           query: sessionState.query,
           totalPhases: phases.length,
           languageMode: languageConfig.mode || 'auto',
           phases: phases,
           orchestratorRole: 'AI acts as the orchestrator — execute phases sequentially, use external tools for actual web search, call internal tools for structured analysis. NOTE: doneWhen fields are GUIDANCE TEXT for the AI orchestrator to manually evaluate — they are NOT auto-enforced by the framework. The AI must check each condition itself before advancing to the next phase.',
           bundleParallelNote: 'The system built-in deepsearching bundle runs independently via sub-agent dispatch. This orchestration framework is a parallel AI-driven pipeline that does NOT depend on the bundle.'
       };
   }

 // ==================== Tool 9: ingest_source ====================
 // Bridge between external search tools and the internal analysis pipeline.
 // Normalizes raw search results into the sessionState source schema with
 // automatic authority classification.
var ingest_source = _wrapTool({
        name: 'ingest_source',
        checkToggle: true,
        requiresSession: true,
        params: [{name:'session_state', hint:'session_state'}, {name:'source', hint:'source'}],
        suggestNext: 'ingest_source',
        autoCheckpoint: true,
        stage: 'INGEST',
        impl: async function(params, ss) {
            var sessionState = ss;
            var source = params.source;
            if (!source || typeof source.url !== 'string' || source.url.trim() === '') return { success: false, error: 'source.url must be a non-empty string' };  /* unreachable: _inputGuard */
            Store.ensureSources(sessionState);
            Store.ensureFacts(sessionState);
            // Duplicate check — delegated to SourceIndex
            if (SourceIndex.has(sessionState.sourceIndex, source.url)) {
                var existingIdx = SourceIndex.get(sessionState.sourceIndex, source.url);
                return { success: true, duplicate: true, message: 'Source already ingested at index ' + existingIdx,
                    sessionState: sessionState, sourceCount: sessionState.sources.length };
            }
            // Auto-classify authority
            var authority = classifyAuthorityV4(source.url, source.metadata || {});
            var now = new Date().toISOString();
            var normalized = {
                url: source.url,
                title: source.title || '',
                snippet: source.snippet || '',
                language: source.language || detectLanguage(source.url, source.metadata || {}),
                authorityTier: authority.tier,
                authorityLevel: authority.level,
                authorityLabel: authority.label,
                authorityScore: authority.score,
                authorityType: authority.authority,
                stance: source.stance || 'neutral',
                hasQuantitative: source.hasQuantitative === true,
                hasCaseStudy: source.hasCaseStudy === true,
                extractedFacts: source.extractedFacts || [],
                extractedTerms: Array.isArray(source.extractedTerms) ? source.extractedTerms : [],
                coversQuestion: source.coversQuestion || [],
                references: source.references || [],
                ingestedAt: now,
                metadata: source.metadata || {}
            };
            var idx = Store.pushSource(sessionState, normalized);
            // Update ingest stats (totalIngested tracks source injections, not searches)
            if (sessionState.search) {
                sessionState.search.totalIngested = (sessionState.search.totalIngested || 0) + 1;
                Store.pushHistory(sessionState, { url: source.url, timestamp: now, query: source.searchQuery || '' });
            }
            // Ingest facts
            if (source.extractedFacts && source.extractedFacts.length > 0) {
                for (var i = 0; i < source.extractedFacts.length; i++) {
                    Store.pushFact(sessionState, {
                        text: typeof source.extractedFacts[i] === 'string' ? source.extractedFacts[i] : (source.extractedFacts[i].text || ''),
                        sourceUrl: source.url, sourceIndex: idx, extractedAt: now,
                        confidence: (typeof source.extractedFacts[i] === 'object' ? source.extractedFacts[i].confidence : undefined)
                    });
                }
            }
            sessionState.updatedAt = now;
            // Invalidate QG cache: source count changed
            CachePolicy.invalidateGate();
            // Auto-advance FSM stage if conditions met
            Metrics.inc('sourceIngestions');
            tryAdvanceStage(sessionState);
            return {
                success: true, sourceCount: sessionState.sources.length, totalFacts: sessionState.extractedFacts.length,
                authority: { tier: authority.tier, label: authority.label, score: authority.score },
                sessionState: sessionState
            };
        }
    });

  // ── v3.3.1-P1: Auto-advance FSM when deterministic conditions met ──
  function tryAdvanceStage(sessionState) {
      var stage = sessionState.currentStage;
      var transition = STAGE_CONFIG.transitions[stage];
      if (!transition || !transition.next) return false;
      var sources = sessionState.sources || [];
      var autoAdvance = false;

      // AUTHORITY_CLASSIFY → CROSS_VALIDATE: all sources have authorityTier
      if (stage === 'AUTHORITY_CLASSIFY' && sources.length >= 3) {
          autoAdvance = sources.every(function(s) { return s.authorityTier !== undefined; });
      }
      // EXTRACT → AUTHORITY_CLASSIFY: at least 3 sources with facts
      if (stage === 'EXTRACT' && sources.length >= 3) {
          autoAdvance = sources.filter(function(s) { return s.extractedFacts && s.extractedFacts.length > 0; }).length >= 3;
      }
      // SEARCH → FETCH: at least 3 sources ingested
      if (stage === 'SEARCH' && sources.length >= 3) {
          autoAdvance = true;
      }
      // FETCH → EXTRACT: at least 3 sources have fetched content (extractedFacts non-empty)
      if (stage === 'FETCH') {
          var withFacts = sources.filter(function(s) { return s.extractedFacts && s.extractedFacts.length > 0; }).length;
          autoAdvance = withFacts >= 3;
      }

if (autoAdvance) {
           Metrics.inc('autoStageAdvances');
           sessionState.completedStages.push(stage);
          sessionState.stageResults[stage] = {
              completedAt: new Date().toISOString(),
              output: 'Auto-advanced to ' + transition.next
          };
          sessionState.currentStage = transition.next;
          return true;
      }
      return false;
  }

  // ==================== Tool 10: advance_search_round ====================
  // v3.3.3: Async tool wrapper with toggle gate.
  // Internal function advanceSearchRound(sessionState) remains callable
  // by orchestrate_research and tryAdvanceStage without gate.
  var advance_search_round = _wrapTool({
        name: 'advance_search_round',
        checkToggle: true,
        requiresSession: true,
        params: [{name:'session_state', hint:'session_state'}],
        suggestNext: 'advance_search_round',
        autoCheckpoint: true,
        stage: 'SEARCH',
        impl: async function(params, ss) {
            var sessionState = ss;
            advanceSearchRound(sessionState);
            var rounds = (sessionState.search && sessionState.search.rounds) || 0;
            return { success: true, rounds: rounds, message: 'Search round advanced to ' + rounds };
        }
    });

// ==================== Tool 11: check_research_status (v3.7.0 → v4.1.0) ====================
// AI-facing probe. Zero params. Always callable — no toggle gate.
// v4.1.0: +planIntegration, +planProgress, +planTodoAvailable
// v4.4.2: +selfCheck — menu state diagnostic

// ── _menuSelfCheck: internal diagnostic (7 checks, static) ──
function _menuSelfCheck(ctx) {
    var checks = [];
    try {
        var p = 'deep_research_';
        var tOn=!!ApiPreferences.getFeatureToggleBlocking(ctx,p+'mode',false);
        var fOn=!!ApiPreferences.getFeatureToggleBlocking(ctx,p+'mode_force',false);
        var rp=!!ApiPreferences.getFeatureToggleBlocking(ctx,p+'run_pending',false);
        var ld=!!ApiPreferences.getFeatureToggleBlocking(ctx,p+'last_done',false);
        var lf=!!ApiPreferences.getFeatureToggleBlocking(ctx,p+'last_failed',false);
        var ms=!!ApiPreferences.getFeatureToggleBlocking(ctx,p+'menu_state',false);
        var ai=!!ApiPreferences.getFeatureToggleBlocking(ctx,p+'awaiting_input',false);
        var el=!!ApiPreferences.getFeatureToggleBlocking(ctx,p+'exec_lock',false);

        // 1. Marker consistency
        var mode=tOn?(fOn?'FORCE':'SUGGEST'):'OFF',exp;
        if(mode==='OFF'&&rp)exp='OFF(anomaly)';
        else if(mode==='OFF'&&lf)exp='FAIL';else if(mode==='OFF'&&ld)exp='DONE';
        else if(mode==='OFF')exp='OFF';else if(rp)exp='READY';else if(ms)exp='RUNNING';
        else if(lf)exp='FAIL';else if(ld)exp='DONE';else exp='RUNNING(optimistic)';
        checks.push({name:'marker',passed:true,expected:exp,
            detail:'mode='+mode+' rp='+rp+' ms='+ms+' ld='+ld+' lf='+lf+' ai='+ai+' el='+el});

        // 2. Ghost references
        var v={};STAGE_CONFIG.stages.forEach(function(s){v[s.id]=true;});
        v.STUCK=v.INGEST=v.CHECKPOINT=true;
        var refs=['AUTHORITY_CLASSIFY','CROSS_VALIDATE','GAP_DETECT','DEEP_ANALYZE','THESIS_BUILD',
            'QUALITY_GATE','CONFIDENCE_TAG','COMPILE','OUTPUT','SEARCH','FETCH','EXTRACT','INIT','QUERY_PLAN','STUCK','INGEST','CHECKPOINT'];
        var gh=refs.filter(function(r){return!v[r];});
        checks.push({name:'ghost',passed:gh.length===0,detail:gh.length>0?'Ghost:'+gh.join(','):'0 ghosts'});

        // 3. Circuit breaker
        var cb=typeof _suggestNextCircuitBreaker!=='undefined'&&_suggestNextCircuitBreaker&&_suggestNextCircuitBreaker.tripped;
        checks.push({name:'breaker',passed:!cb,detail:cb?'TRIPPED':'Normal'});

        // 4. Await-input
        if(ai&&ms)checks.push({name:'await',passed:false,detail:'ai+ms both true'});
        else if(ai&&!tOn)checks.push({name:'await',passed:false,detail:'ai but toggle=OFF'});
        else checks.push({name:'await',passed:true,detail:'ai='+ai+' tOn='+tOn});

        // 5. Lock
        if(el&&!rp&&!ms)checks.push({name:'lock',passed:false,detail:'stale'});
        else if(!el&&(rp||ms))checks.push({name:'lock',passed:false,detail:'missing'});
        else checks.push({name:'lock',passed:true,detail:'el='+el+' rp='+rp+' ms='+ms});

        // 6. Tool reachability (static)
        var tok=(typeof orchestrate_research==='function');
        checks.push({name:'tool',passed:tok,detail:tok?'orchestrate_research OK':'NOT FOUND'});

        // 7. Config integrity
        checks.push({name:'hook',passed:true,detail:'SKIPPED'});
        checks.push({name:'config',passed:STAGE_CONFIG.stages.length===14,
            detail:STAGE_CONFIG.stages.length+'stages '+Object.keys(STAGE_CONFIG.transitions).length+'trans'});

    }catch(e){checks.push({name:'error',passed:false,detail:'threw:'+(e.message||'?')});}
    return{passed:checks.filter(function(c){return!c.passed;}).length===0,checks:checks};
}

async function check_research_status(params) {
    try {
        var ss = (params && params.session_state) || (typeof sessionState !== 'undefined' ? sessionState : null);
        var body = {
            toggle: 'off',
            pipeline: 'idle',
            stage: null,
            rounds: 0,
            sources: 0,
            progress: '就绪 — 深度研究未启动',
            lastError: null,
            planIntegration: false,
            planProgress: null,
            planTodoAvailable: false
        };
        var ctx = getAppContext();
        if (ctx) {
            try {
                body.toggle = Boolean(ApiPreferences.getFeatureToggleBlocking(ctx, KEY.TOGGLE, false)) ? 'on' : 'off';
            } catch(e) {}
        }
    if (ss && ss.sessionId) {
    body.pipeline = (ss.currentStage === 'OUTPUT') ? 'completed' : 'running';
    body.stage = ss.currentStage || '?';
    body.rounds = (ss.search && typeof ss.search.rounds === 'number') ? ss.search.rounds : 0;
    body.sources = (ss.sources && ss.sources.length) || 0;
    body.progress = _pipelineStatus(ss);
    // v4.1.0 Phase4: plan-mode integration
    body.planIntegration = !!(ss.plan_aware || ss.planIntegration);
    body.planProgress = ss.planProgress || null;
    body.planTodoAvailable = !!(ss.plantodo || body.planProgress);
    // v4.3.0: pipeline health diagnostics
    body.guardsEnabled = true;  // _inputGuard active on all 11 required-param tools
    body.errorTaxonomyEnabled = true;  // _classifyError in all 12 catch blocks
    // v4.2.0 Phase5: cross-session quality scoring
    body.sessionQuality = _scoreSession(ss);
    if (ss.errors && ss.errors.length > 0) {
    var last = ss.errors[ss.errors.length - 1];
    body.lastError = { stage: last.stage, message: last.message };
    }
    }
body.summary = body.progress;
        // v4.4.2: auto-execution hint
        if (body.toggle === 'on' && ctx) {
            try {
                if (ApiPreferences.getFeatureToggleBlocking(ctx, 'deep_research_awaiting_input', false)) {
                    body.suggestedAction = {
                        tool: 'deep_research_tools:orchestrate_research',
                        hint: 'Deep Research is armed. Call deep_research_tools:orchestrate_research NOW with user message as query.',
                        autoConsume: true
                    };
                }
            } catch(e) {}
        }
        // v4.4.2: self-check diagnostic
        try { body.selfCheck = _menuSelfCheck(ctx); } catch(e) {}
        return { success: true, data: body };
    } catch (e) {
        var ce = _classifyError(e); // v4.0.0 Phase3
        return { success: false, error: ce.hint + ' (check_research_status: ' + e.message + ')', _errorCode: ce.code, _errorCategory: ce.cat };
    }
}

// ==================== Tool 12: resume_research (v3.9.0 Phase2) ====================
async function resume_research(params) {
    try {
        var ig = _inputGuard(params, [{name:'session_id', hint:'session_id'}]); if (ig) return ig;
        var gate = requireToggleOn();
        if (gate.blocked) return gate;
        var sessionId = params.session_id;
        if (!sessionId) return { success: false, error: ERROR.code.INPUT_INVALID.hint + ': session_id is required', _errorCode: 'INPUT_INVALID' };
        var ckpt = PipelineWriter_read(sessionId);
        if (!ckpt) return { success: false, error: ERROR.code.RESUME_NO_CHECKPOINT.hint + ' (sessionId=' + sessionId + ')', _errorCode: 'RESUME_NO_CHECKPOINT' };
        var ss = ckpt.sessionState || ckpt;
        if (!ss || !ss.currentStage) return { success: false, error: ERROR.code.CHECKPOINT_READ_FAILED.hint + ': invalid sessionState in checkpoint', _errorCode: 'CHECKPOINT_READ_FAILED' };
        ss.updatedAt = new Date().toISOString();
        // Restore active session tracking
        setActiveSession(sessionId);
        var nextActions = genResumeActions(ss);
        var remaining = estRemaining(ss);
        return {
            success: true,
            resumed: true,
            sessionState: ss,
            nextActions: nextActions,
            estimatedRemainingStages: remaining,
            resumeFrom: ss.currentStage,
            sourceCount: (ss.sources && ss.sources.length) || 0,
            searchRounds: (ss.search && ss.search.rounds) || 0
        };
    } catch (e) {
        var ce = _classifyError(e); // v4.0.0 Phase3: ErrorTaxonomy
        return { success: false, error: ce.hint + ' (resume_research: ' + e.message + ')', _errorCode: ce.code, _errorCategory: ce.cat };
    }
}

// ==================== Exports ====================
exports.check_research_status = check_research_status;
exports.start_research = start_research;
 exports.classify_authority = classify_authority;
 exports.check_quality_gate = check_quality_gate;
 exports.tag_confidence = tag_confidence;
 exports.deep_analyze = deep_analyze;
 exports.create_checkpoint = create_checkpoint;
 exports.sync_to_plan = sync_to_plan;
 exports.orchestrate_research = orchestrate_research;
 exports.ingest_source = ingest_source;
 exports.advance_search_round = advance_search_round;
exports.resume_research = resume_research;

})();

