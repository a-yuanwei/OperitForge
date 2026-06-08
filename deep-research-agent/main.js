"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerToolPkg = exports.onInputMenuToggle = void 0;

/* main.js v4.5.0 — EventBus decoupled toggle + pipeline bridge */
var CONFIG = {
    FEATURE_KEY:      "deep_research_mode",
    FORCE_KEY:        "deep_research_mode_force",
    RUN_PENDING_KEY:  "deep_research_run_pending",
    LAST_DONE_KEY:    "deep_research_last_done",
    LAST_FAILED_KEY:  "deep_research_last_failed",
    EXEC_LOCK_KEY:    "deep_research_exec_lock",
    MENU_STATE_KEY:   "deep_research_menu_state",
    AWAIT_INPUT_KEY:  "deep_research_awaiting_input",
    TOGGLE_ID:        "deep_research_input_menu_toggle",
    LOG_TAG:          "[DeepResearch]"
};

var UI_STATES = {
    OFF:     { label: "OFF",    desc: "Closed." },
    READY:   { label: "READY",  desc: "Pending." },
    RUNNING: { label: "ON",     desc: "Active." },
    DONE:    { label: "DONE",   desc: "Completed." },
    FAIL:    { label: "FAIL",   desc: "Error." }
};

var MODES = {
    OFF:     { label: "OFF" },
    SUGGEST: { label: "SUGGEST" },
    FORCE:   { label: "FORCE" }
};

var ApiPreferences = Java.com.ai.assistance.operit.data.preferences.ApiPreferences;

function log(msg) { console.log(CONFIG.LOG_TAG + " " + msg); }
function getAppContext() { var fn = Java.getApplicationContext; return typeof fn === "function" ? fn() : null; }
function readBool(ctx, key, fb) { return Boolean(ApiPreferences.getFeatureToggleBlocking(ctx, key, !!fb)); }
function writeBool(ctx, key, v) { ApiPreferences.setFeatureToggleBlocking(ctx, key, !!v); }
function readMode(ctx) {
    if (readBool(ctx, CONFIG.FORCE_KEY, false)) return MODES.FORCE;
    if (!readBool(ctx, CONFIG.FEATURE_KEY, false)) return MODES.OFF;
    return MODES.SUGGEST;
}
function writeMode(ctx, mode) {
    if (mode === MODES.OFF) { writeBool(ctx, CONFIG.FEATURE_KEY, false); writeBool(ctx, CONFIG.FORCE_KEY, false); }
    else if (mode === MODES.FORCE) { writeBool(ctx, CONFIG.FEATURE_KEY, true); writeBool(ctx, CONFIG.FORCE_KEY, true); }
    else { writeBool(ctx, CONFIG.FEATURE_KEY, true); writeBool(ctx, CONFIG.FORCE_KEY, false); }
}
function normalizePayload(input) {
    var r = input;
    return (r && r.eventPayload && typeof r.eventPayload === "object") ? r.eventPayload : (r || {});
}

/* StateManager — single source of truth for all boolean keys */
var StateManager = {
    _ctx: null,
    getCtx: function() { if (!this._ctx) { try { this._ctx = getAppContext(); } catch(e) {} } return this._ctx; },
    isAwaiting: function() { var c = this.getCtx(); return c ? readBool(c, CONFIG.AWAIT_INPUT_KEY, false) : false; },
    setArmed: function() {
        var c = this.getCtx(); if (!c) return;
        writeMode(c, MODES.FORCE);
        writeBool(c, CONFIG.RUN_PENDING_KEY, true);
        writeBool(c, CONFIG.EXEC_LOCK_KEY, true);
        writeBool(c, CONFIG.AWAIT_INPUT_KEY, true);
        writeBool(c, CONFIG.MENU_STATE_KEY, true);
        writeBool(c, CONFIG.LAST_DONE_KEY, false);
        writeBool(c, CONFIG.LAST_FAILED_KEY, false);
    },
    setOff: function() {
        var c = this.getCtx(); if (!c) return;
        writeMode(c, MODES.OFF);
        writeBool(c, CONFIG.RUN_PENDING_KEY, false);
        writeBool(c, CONFIG.EXEC_LOCK_KEY, false);
        writeBool(c, CONFIG.AWAIT_INPUT_KEY, false);
        writeBool(c, CONFIG.MENU_STATE_KEY, false);
    },
    getMode: function() { var c = this.getCtx(); return c ? readMode(c) : MODES.OFF; }
};

/* onInputMenuToggle — event emitter only */
function onInputMenuToggle(input) {
    var payload = normalizePayload(input);
    var action = (payload.action || "").toLowerCase();
    try {
        if (action === "toggle") {
            var tid = payload.toggleId || "";
            if (tid === CONFIG.FEATURE_KEY || tid === CONFIG.TOGGLE_ID || tid === "" || tid.indexOf("deep_research") !== -1) {
                var mode = StateManager.getMode();
                if (mode === MODES.OFF) {
                    StateManager.setArmed();
                    log("toggle: OFF → FORCE");
                    if (typeof EventBus !== 'undefined') EventBus.emit('toggle:armed', { mode: 'FORCE', timestamp: new Date().toISOString() });
                } else {
                    StateManager.setOff();
                    log("toggle: → OFF");
                    if (typeof EventBus !== 'undefined') EventBus.emit('toggle:off', { timestamp: new Date().toISOString() });
                }
            }
            return null;
        }
        if (action === "create") {
            var m = StateManager.getMode();
            return { toggles: [{ id: CONFIG.TOGGLE_ID, title: "Deep Research [" + (m === MODES.OFF ? "OFF" : "ON") + "]", description: "Tap to toggle Deep Research", icon: "search", isChecked: m !== MODES.OFF }] };
        }
        return { toggles: [], ok: true };
    } catch (e) { log("onInputMenuToggle error: " + String(e)); return { toggles: [], ok: true }; }
}
exports.onInputMenuToggle = onInputMenuToggle;

function onMessageProcessing(event) {
    try {
        var payload = event.eventPayload || event;
        var ctx = getAppContext(); if (!ctx) return { matched: false };
        if (!Boolean(ApiPreferences.getFeatureToggleBlocking(ctx, CONFIG.AWAIT_INPUT_KEY, false))) return { matched: false };
        var txt = payload.messageContent || '';
        return { matched: false, text: "Call deepsight_v450_tools:orchestrate_research with query = \"" + txt + "\". No reply. Tool only." };
    } catch (e) { return { matched: false }; }
}
exports.onMessageProcessing = onMessageProcessing;

function onSystemPromptCompose(event) {
    try {
        var payload = event.eventPayload || event;
        if (payload.stage !== "after_compose_system_prompt") return null;
        var injection = "Deepsight is ARMED. Execute research pipeline.\nCall deepsight_v450_tools:orchestrate_research NOW.\nQuery = user message. No confirmation. No text.";
        return { systemPrompt: (payload.systemPrompt || '') + "\n\n" + injection };
    } catch (e) { return null; }
}
exports.onSystemPromptCompose = onSystemPromptCompose;

function onPromptFinalize(event) {
    try {
        var payload = event.eventPayload || event;
        if (payload.stage !== "before_send_to_model") return null;
        var ctx = getAppContext(); if (!ctx) return null;
        if (!Boolean(ApiPreferences.getFeatureToggleBlocking(ctx, CONFIG.AWAIT_INPUT_KEY, false))) return null;
        var ph = payload.preparedHistory; if (!Array.isArray(ph)) return null;
        return { preparedHistory: ph.concat([{ kind: "SYSTEM", content: "=== SYSTEM OVERRIDE — Call deepsight_v450_tools:orchestrate_research NOW. Query = user's last message. Tool call ONLY." }]) };
    } catch (e) { return null; }
}
exports.onPromptFinalize = onPromptFinalize;

function onToolPromptCompose(event) {
    try {
        var payload = event.eventPayload || event;
        if (payload.stage !== "filter_tool_prompt_items") return null;
        var ctx = getAppContext(); if (!ctx) return null;
        if (!Boolean(ApiPreferences.getFeatureToggleBlocking(ctx, CONFIG.AWAIT_INPUT_KEY, false))) return null;
        var tools = payload.availableTools; if (!Array.isArray(tools)) return null;
        var T = "deepsight_v450_tools:orchestrate_research";
        return { availableTools: tools.filter(function(t) { return t && t.name === T; }) };
    } catch (e) { return null; }
}
exports.onToolPromptCompose = onToolPromptCompose;

/* Registration */
var _reg = false, _clean = [], _busSubs = [];
function subscribeBus() {
    if (typeof EventBus === 'undefined') return;
    _busSubs.push(EventBus.on('toggle:armed', function(p) { log("EventBus: armed"); }));
    _busSubs.push(EventBus.on('toggle:off', function(p) { log("EventBus: off"); }));
    _busSubs.push(EventBus.on('pipeline:start', function(p) {
        var c = getAppContext(); if (c) { writeBool(c, CONFIG.MENU_STATE_KEY, true); writeBool(c, CONFIG.AWAIT_INPUT_KEY, false); }
    }));
    _busSubs.push(EventBus.on('pipeline:error', function(p) { log("EventBus: pipeline error — " + p.error); }));
}

function registerToolPkg() {
    if (_reg) return true;
    log("registerToolPkg start — v4.5.0");
    subscribeBus();
    try { ToolPkg.registerInputMenuTogglePlugin({ id: CONFIG.TOGGLE_ID, function: onInputMenuToggle }); log("registered: InputMenuToggle"); }
    catch (e) { log("registerToolPkg failed: " + String(e)); return false; }
    try { var r1 = ToolPkg.registerSystemPromptComposeHook({ id: "deep_research_system_prompt", function: onSystemPromptCompose }); if (r1 && typeof r1 === 'object') _clean.push(function() { try { r1.unregister(); } catch(e) {} }); log("registered: SystemPromptComposeHook"); }
    catch (e) { log("SystemPromptComposeHook failed: " + String(e)); }
    try { var r2 = ToolPkg.registerMessageProcessingPlugin({ id: "deep_research_message_processing", function: onMessageProcessing }); if (r2 && typeof r2 === 'object') _clean.push(function() { try { r2.unregister(); } catch(e) {} }); log("registered: MessageProcessingPlugin"); }
    catch (e) { log("MessageProcessingPlugin failed: " + String(e)); }
    try { var r3 = ToolPkg.registerPromptFinalizeHook({ id: "deep_research_prompt_finalize", function: onPromptFinalize }); if (r3 && typeof r3 === 'object') _clean.push(function() { try { r3.unregister(); } catch(e) {} }); log("registered: PromptFinalizeHook"); }
    catch (e) { log("PromptFinalizeHook failed: " + String(e)); }
    try { var r4 = ToolPkg.registerToolPromptComposeHook({ id: "deep_research_tool_prompt", function: onToolPromptCompose }); if (r4 && typeof r4 === 'object') _clean.push(function() { try { r4.unregister(); } catch(e) {} }); log("registered: ToolPromptComposeHook"); }
    catch (e) { log("ToolPromptComposeHook failed: " + String(e)); }
    _reg = true; log("registerToolPkg done"); return true;
}
exports.registerToolPkg = registerToolPkg;

var _cleaned = false;
function cleanup() {
    if (_cleaned) return; _cleaned = true;
    for (var i = 0; i < _clean.length; i++) { try { _clean[i](); } catch(e) {} } _clean = [];
    for (var j = 0; j < _busSubs.length; j++) { try { _busSubs[j](); } catch(e) {} } _busSubs = [];
    if (typeof EventBus !== 'undefined') EventBus.clear();
    try { StateManager.setOff(); } catch(e) {}
    _reg = false; log("cleanup: done");
}
exports.cleanup = cleanup;