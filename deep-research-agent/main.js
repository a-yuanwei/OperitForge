"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerToolPkg = exports.onInputMenuToggle = void 0;

// ═══════════════════════════════════════════════════════════
// DeepResearch Agent v3.3.0 — main.js
//
// Architecture: explicit decision + explicit call (user directive)
//
// Layer 1 — Message: ALWAYS pass through.
//   onMessageProcessing NOT registered. The hook is a filter,
//   not a modifier. We never intercept messages.
//
// Layer 2 — Menu: pure state switch (two boolean keys).
//   onInputMenuToggle only records state via ApiPreferences
//   boolean API (getFeatureToggleBlocking / setFeatureToggleBlocking).
//   It does NOT modify messages, inject prompts, or couple to
//   filtering logic. Single source of truth in ApiPreferences.
//
// Layer 3 — Research: explicit call chain with mode dispatch.
//   User input → model judges → calls orchestrate_research →
//   FORCE: auto-execute + close toggle (finally)
//   SUGGEST: return assessment, keep toggle
//   OFF: prompt to enable
//
// Layer 4 — Risk control: three-state + idempotency.
//   Toggle cycles: OFF → SUGGEST → FORCE → OFF
//   Same query blocked for 60s window.
//
// History:
//   v3.2.9–v3.2.21 — 13 attempts at message injection (all failed)
//   v3.2.22–v3.2.23 — stripped injection, upgraded tool descriptions
//   v3.2.24 — arch rewrite: 4-layer, three-state (string prefs — failed)
//   v3.2.25 — fix: two boolean keys instead of string prefs
//   v3.2.26 — execution: FORCE/SUGGEST/OFF dispatch + finally close + idempotency
//   v3.2.27 — audit & closure: FORCE pipeline push (INIT→QUERY_PLAN),
//             advanceSearchRound() with exports + METADATA registration,
//             G2 rounds>=2 gate wired, ingest_source/rounds separation,
//             URL null-guards, detectUnmarkable case fix, clamp removal,
//             doneWhen honest comments, METADATA description de-exaggerated,
//             3-file version alignment. P1 closed. Design boundary:
//             Operit runtime cache may require app restart to reflect METADATA.
//   v3.2.28 — state & reliability fixes (5 items, 3 commits):
//             A: advanceSearchRound() → roundAdvances only (totalSearches moved
//                to actual search exec point); _lastExecution deferred to after
//                start_research() success (fixes idempotent deadlock on failure).
//             B: G3 ZH/EN gate now derives minZh/minEn dynamically from
//                constraints.topicLanguage (no more hardcoded >=2 each);
//                detectUnmarkable() upgraded to \b word-boundary regex
//                (eliminates substring false positives on will/should/must/best).
//             C: doneWhen strings unified to natural-language hints (no more
//                pseudo-code that looked executable).
//   v3.2.29 — P0 correctness fixes (5 items):
//             1) G3 gate added to results + allPassed (was computed but orphaned).
//             2) registerToolPkg() defers _registered=true to after
//                registration success; failure allows retry.
//             3) extractedTerms now Array.isArray() guarded (4 sites).
//             4) closeToggle() wrapped in try/catch in orchestrate's finally.
//             5) sourceIndex URL key validated as non-empty string.
//   v3.3.0 — Architecture refactor (Phases 2–6, 6 IIFE):
//             Phase 2: AuthorityPolicy IIFE — TierMatcher registry
//             Phase 3: LanguagePolicy IIFE — adapt() generalizes detectCnAdaptive
//             Phase 4: GatePolicy IIFE — G8/G9/G11/G12 strategy delegation
//             Phase 5: SourceIndex IIFE — independent index layer + rebuild()
//             Phase 6: Store IIFE — push/trim/capacity consolidation
//             Phase 7: Real Operit runtime smoke test — 10/10 tools verified
// ═══════════════════════════════════════════════════════════

// ── Configuration ─────────────────────────────────────────
var CONFIG = {
    FEATURE_KEY: "deep_research_mode",       // main toggle ON/OFF
    FORCE_KEY:   "deep_research_mode_force", // when ON+true → FORCE; ON+false → SUGGEST
    TOGGLE_ID:   "deep_research_input_menu_toggle",
    LOG_TAG:     "[DeepResearch]"
};

// ── Mode labels ───────────────────────────────────────────
var MODES = {
    OFF:     { label: "OFF",     desc: "Research inactive. AI answers normally." },
    SUGGEST: { label: "SUGGEST", desc: "AI may suggest calling orchestrate_research." },
    FORCE:   { label: "FORCE",   desc: "AI SHOULD call orchestrate_research. Toggle off after use." }
};

// ── Dependencies ──────────────────────────────────────────
var ApiPreferences = Java.com.ai.assistance.operit.data.preferences.ApiPreferences;

// ═══════════════════════════════════════════════════════════
// Helpers — only boolean API (getFeatureToggleBlocking /
//            setFeatureToggleBlocking), proven to work.
// ═══════════════════════════════════════════════════════════

function log(msg) {
    console.log(CONFIG.LOG_TAG + " " + msg);
}

function getAppContext() {
    var fn = Java.getApplicationContext;
    return typeof fn === "function" ? fn() : null;
}

function readBool(context, key, fallback) {
    return Boolean(ApiPreferences.getFeatureToggleBlocking(
        context, key, !!fallback));
}

function writeBool(context, key, value) {
    ApiPreferences.setFeatureToggleBlocking(context, key, !!value);
}

/**
 * Read three-state mode from two boolean keys.
 * Returns one of MODES.OFF / .SUGGEST / .FORCE
 */
function readMode(context) {
    if (!readBool(context, CONFIG.FEATURE_KEY, false)) {
        return MODES.OFF;
    }
    if (readBool(context, CONFIG.FORCE_KEY, false)) {
        return MODES.FORCE;
    }
    return MODES.SUGGEST;
}

/**
 * Write three-state mode to two boolean keys.
 * OFF:     FEATURE_KEY=false, FORCE_KEY=false
 * SUGGEST: FEATURE_KEY=true,  FORCE_KEY=false
 * FORCE:   FEATURE_KEY=true,  FORCE_KEY=true
 */
function writeMode(context, mode) {
    if (mode === MODES.OFF) {
        writeBool(context, CONFIG.FEATURE_KEY, false);
        writeBool(context, CONFIG.FORCE_KEY, false);
    } else if (mode === MODES.FORCE) {
        writeBool(context, CONFIG.FEATURE_KEY, true);
        writeBool(context, CONFIG.FORCE_KEY, true);
    } else {
        // SUGGEST
        writeBool(context, CONFIG.FEATURE_KEY, true);
        writeBool(context, CONFIG.FORCE_KEY, false);
    }
}

function normalizePayload(input) {
    var record = input;
    return (record && record.eventPayload && typeof record.eventPayload === "object")
        ? record.eventPayload
        : (record || {});
}

// ═══════════════════════════════════════════════════════════
// Layer 2: onInputMenuToggle — pure state switch
//
// Toggle cycles: OFF → SUGGEST → FORCE → OFF
//
// Single source of truth:
//   FEATURE_KEY (bool)  +  FORCE_KEY (bool)
// Both stored via getFeatureToggleBlocking/setFeatureToggleBlocking.
// ═══════════════════════════════════════════════════════════
function onInputMenuToggle(input) {
    var payload = normalizePayload(input);
    var action  = (payload.action || "").toLowerCase();

    var context;
    try {
        context = getAppContext();
        if (!context) return [];
    } catch (e) {
        log("getAppContext error: " + String(e));
        return [];
    }

    try {
        if (action === "toggle") {
            var currentMode = readMode(context);

            if (currentMode === MODES.OFF) {
                // OFF → SUGGEST
                writeMode(context, MODES.SUGGEST);
                log("toggle: OFF → SUGGEST");
            } else if (currentMode === MODES.SUGGEST) {
                // SUGGEST → FORCE
                writeMode(context, MODES.FORCE);
                log("toggle: SUGGEST → FORCE");
            } else {
                // FORCE → OFF
                writeMode(context, MODES.OFF);
                log("toggle: FORCE → OFF");
            }
            return [];
        }

        if (action !== "create") return [];

        // ── create: read current state, return UI description ──
        var mode    = readMode(context);
        var enabled = (mode !== MODES.OFF);
        var desc    = mode.label + ": " + mode.desc;

        return [{
            id:          CONFIG.FEATURE_KEY,
            title:       "Deep Research [" + mode.label + "]",
            description: desc,
            isChecked:   enabled
        }];
    } catch (e) {
        log("onInputMenuToggle error: " + String(e));
        return [];
    }
}
exports.onInputMenuToggle = onInputMenuToggle;

// ═══════════════════════════════════════════════════════════
// Layer 1: onMessageProcessing — NOT REGISTERED
//
// This hook is a FILTER (matched:true = block).
// We do NOT use it. Messages always pass through.
// Business logic lives in the sub-package's explicit call chain.
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// Registration (startup thread — NO Java calls)
// ═══════════════════════════════════════════════════════════
var _registered = false;

function registerToolPkg() {
    if (_registered) return true;

    log("registerToolPkg start — v3.3.0");

    try {
        ToolPkg.registerInputMenuTogglePlugin({
            id:       CONFIG.TOGGLE_ID,
            function: onInputMenuToggle
        });
    } catch (e) {
        log("registerToolPkg failed: " + String(e));
        return false;
    }

    _registered = true;
    log("registered: InputMenuToggle (3-state: OFF→SUGGEST→FORCE→OFF)");

    // MessageProcessingPlugin intentionally NOT registered.
    // It's a filter API, not a modifier. We never intercept messages.

    log("registerToolPkg done");
    return true;
}
exports.registerToolPkg = registerToolPkg;