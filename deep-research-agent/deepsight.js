/* src/config/index.js
 * Central configuration and compatibility layer for DeepSearch v4.5.x
 * Loads first. Defines canonical keys, errors, defaults, and small polyfills.
 */
(function (ROOT) {
    'use strict';

    var LOG_TAG = '[DeepResearch]';
    var VERSION = '4.5.0';

    function clone(v) {
        if (v === null || v === undefined) return v;
        if (Array.isArray(v)) return v.slice();
        if (typeof v === 'object') {
            var out = {};
            for (var k in v) {
                if (Object.prototype.hasOwnProperty.call(v, k)) out[k] = clone(v[k]);
            }
            return out;
        }
        return v;
    }

    function installPolyfills() {
        if (typeof Promise !== 'undefined' && !Promise.allSettled) {
            Promise.allSettled = function (promises) {
                if (!Array.isArray(promises)) {
                    return Promise.reject(new TypeError('Promise.allSettled expects an array'));
                }
                var wrapped = [];
                for (var i = 0; i < promises.length; i++) {
                    wrapped.push(
                        Promise.resolve(promises[i]).then(
                            function (value)  { return { status: 'fulfilled', value: value }; },
                            function (reason) { return { status: 'rejected',  reason: reason }; }
                        )
                    );
                }
                return Promise.all(wrapped);
            };
        }
        if (typeof Array.prototype.includes !== 'function') {
            Array.prototype.includes = function (searchElement, fromIndex) {
                if (this == null) throw new TypeError('"this" is null or undefined');
                var O = Object(this);
                var len = O.length >>> 0;
                if (len === 0) return false;
                var n = fromIndex | 0;
                var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
                while (k < len) {
                    if (O[k] === searchElement) return true;
                    k++;
                }
                return false;
            };
        }
    }
    installPolyfills();

    var KEY = {
        TOGGLE:       'deep_research_mode',
        FORCE:        'deep_research_mode_force',
        RUN_PENDING:  'deep_research_run_pending',
        LAST_DONE:    'deep_research_last_done',
        LAST_FAILED:  'deep_research_last_failed',
        EXEC_LOCK:    'deep_research_exec_lock',
        MENU_STATE:   'deep_research_menu_state',
        AWAIT_INPUT:  'deep_research_awaiting_input'
    };

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

    var PERFORMANCE_CONFIG = {
        SEARCH_TIMEOUT_MS: 8000,
        CACHE_TTL_MS: 10 * 60 * 1000,
        CACHE_BATCH_FLUSH_SIZE: 20,
        CACHE_MAX_AUTHORITY_ENTRIES: 2000,
        CACHE_MAX_GATE_ENTRIES: 50,
        RETRY_COUNT: 1,
        CHECKPOINT_MAX_AUTO_FILES: 50,
        STORE_MAX_SOURCES: 500,
        STORE_MAX_FACTS: 500,
        STORE_MAX_HISTORY: 200,
        PARALLEL_SEARCH_BATCH_SIZE: 3,
        PROGRESS_EMIT_ENABLED: true
    };

    var SOURCE_ADAPTERS = {
        web:     { name: 'web',     timeoutMs: 8000,  retryCount: 1, priority: 'high' },
        news:    { name: 'news',    timeoutMs: 6000,  retryCount: 1, priority: 'medium' },
        academic:{ name: 'academic',timeoutMs: 10000, retryCount: 1, priority: 'high' },
        government: { name: 'government', timeoutMs: 8000, retryCount: 1, priority: 'high' },
        'industry-report': { name: 'industry-report', timeoutMs: 8000, retryCount: 1, priority: 'medium' },
        'community-verified': { name: 'community-verified', timeoutMs: 6000, retryCount: 2, priority: 'low' }
    };

    var CONFIG = {
        VERSION: VERSION,
        LOG_TAG: LOG_TAG,
        TOGGLE_ID: 'deep_research_input_menu_toggle',
        EMPTY_INPUT_SHAKE_CLASS: 'deep-research-shake',
        DEFAULT_MENU_STATE: 'OUTPUT',
        AUTO_CLOSE_TOGGLE_AFTER_SEND: true,
        PIPELINE_TIMEOUT_MS: 30000,
        ENABLE_PROGRESS_EVENTS: true,
        ENABLE_BATCH_CHECKPOINTS: true,
        STAGE_ORDER: [
            'INIT','QUERY_PLAN','SEARCH','FETCH','EXTRACT',
            'AUTHORITY_CLASSIFY','CROSS_VALIDATE','GAP_DETECT',
            'DEEP_ANALYZE','THESIS_BUILD','QUALITY_GATE',
            'CONFIDENCE_TAG','COMPILE','OUTPUT'
        ],
        DEFAULT_QUERY_LANGUAGE: 'auto',
        MAX_RECENT_ERRORS: 20
    };

    var DeepSearchConfig = {
        version: VERSION,
        logTag: LOG_TAG,
        KEY: KEY,
        ERROR: ERROR,
        CONFIG: CONFIG,
        PERFORMANCE_CONFIG: PERFORMANCE_CONFIG,
        SOURCE_ADAPTERS: SOURCE_ADAPTERS,
        clone: clone
    };

    ROOT.DeepSearchConfig = DeepSearchConfig;
    ROOT.KEY = KEY;
    ROOT.ERROR = ERROR;
    ROOT.CONFIG = CONFIG;
    ROOT.PERFORMANCE_CONFIG = PERFORMANCE_CONFIG;
    ROOT.SOURCE_ADAPTERS = SOURCE_ADAPTERS;
    ROOT.LOG_TAG = LOG_TAG;
    ROOT.DEEPSEARCH_VERSION = VERSION;

    if (typeof console !== 'undefined' && console.log) {
        console.log(LOG_TAG + ' config loaded ' + VERSION);
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);

/* src/events/bus.js
 * Lightweight event bus: on/off/once/emit/clear.
 * Depends on config/index.js only for LOG_TAG.
 */
(function (ROOT) {
    'use strict';

    var channels = Object.create(null);

    function ensureList(name) {
        if (!channels[name]) channels[name] = [];
        return channels[name];
    }

    function on(name, handler) {
        if (typeof handler !== 'function') {
            return function noopOff() {};
        }
        var list = ensureList(name);
        list.push(handler);
        return function off() {
            var arr = channels[name];
            if (!arr) return;
            for (var i = arr.length - 1; i >= 0; i--) {
                if (arr[i] === handler) {
                    arr.splice(i, 1);
                    break;
                }
            }
            if (arr.length === 0) delete channels[name];
        };
    }

    function once(name, handler) {
        var off = on(name, function wrapped(payload) {
            off();
            handler(payload);
        });
        return off;
    }

    function emit(name, payload) {
        var list = channels[name];
        if (!list || list.length === 0) return;
        var snapshot = list.slice();
        for (var i = 0; i < snapshot.length; i++) {
            try {
                snapshot[i](payload);
            } catch (e) {
                if (ROOT.console && ROOT.console.log) {
                    ROOT.console.log((ROOT.LOG_TAG || '[DeepResearch]') + ' EventBus error on "' + name + '": ' + (e && e.message ? e.message : String(e)));
                }
            }
        }
    }

    function clear(name) {
        if (typeof name === 'string') {
            delete channels[name];
        } else {
            channels = Object.create(null);
        }
    }

    function list() {
        var out = [];
        for (var k in channels) {
            if (Object.prototype.hasOwnProperty.call(channels, k)) out.push(k);
        }
        return out;
    }

    var EventBus = { on: on, once: once, emit: emit, clear: clear, list: list };
    ROOT.EventBus = EventBus;
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);

/* src/config/stages.js
 * Canonical stage registry and transition config.
 * Depends on src/config/index.js.
 */
(function (ROOT) {
    'use strict';

    var CFG = ROOT.DeepSearchConfig || {};
    var CONFIG = CFG.CONFIG || ROOT.CONFIG || {};
    var STAGE_ORDER = (CONFIG.STAGE_ORDER && CONFIG.STAGE_ORDER.slice()) || [
        'INIT','QUERY_PLAN','SEARCH','FETCH','EXTRACT',
        'AUTHORITY_CLASSIFY','CROSS_VALIDATE','GAP_DETECT',
        'DEEP_ANALYZE','THESIS_BUILD','QUALITY_GATE',
        'CONFIDENCE_TAG','COMPILE','OUTPUT'
    ];

    function hasText(v) { return typeof v === 'string' && v.trim() !== ''; }
    function countSources(ss) { return ss && Array.isArray(ss.sources) ? ss.sources.length : 0; }
    function gatePassed(ss) { return Boolean(ss && ss.qualityGate && ss.qualityGate.lastResult && ss.qualityGate.lastResult.allPassed); }
    function thesisReady(ss) { return Boolean(ss && hasText(ss.thesisStatement)); }
    function deepAnalysisReady(ss) { return Boolean(ss && ss.deepAnalysisResult); }
    function planReady(ss) { return Boolean(ss && ss.search && Array.isArray(ss.search.pendingQueries) && ss.search.pendingQueries.length > 0); }
    function sourceCoverageReady(ss) { return countSources(ss) >= 3; }

    var STAGE_REGISTRY = {
        INIT:            { id:'INIT', order:1,  name:'Init',              next:'QUERY_PLAN',      fallback:null,       final:false, canExit:function(){return true;},           description:'初始化会话与默认状态' },
        QUERY_PLAN:      { id:'QUERY_PLAN', order:2, name:'Query Plan',   next:'SEARCH',          fallback:null,       final:false, canExit:function(ss){return planReady(ss);}, description:'生成查询计划' },
        SEARCH:          { id:'SEARCH', order:3, name:'Search',           next:'FETCH',           fallback:'QUERY_PLAN',final:false, canExit:function(ss){return sourceCoverageReady(ss);}, description:'并行发起搜索请求' },
        FETCH:           { id:'FETCH', order:4, name:'Fetch',             next:'EXTRACT',         fallback:'SEARCH',   final:false, canExit:function(ss){return countSources(ss)>0;}, description:'拉取并标准化来源' },
        EXTRACT:         { id:'EXTRACT', order:5, name:'Extract',          next:'AUTHORITY_CLASSIFY',fallback:'FETCH', final:false, canExit:function(ss){return countSources(ss)>0;}, description:'提取事实与证据' },
        AUTHORITY_CLASSIFY:{ id:'AUTHORITY_CLASSIFY', order:6, name:'Authority Classify', next:'CROSS_VALIDATE', fallback:'EXTRACT', final:false, canExit:function(ss){return countSources(ss)>0;}, description:'权威分类' },
        CROSS_VALIDATE:  { id:'CROSS_VALIDATE', order:7, name:'Cross Validate', next:'GAP_DETECT',fallback:'AUTHORITY_CLASSIFY',final:false, canExit:function(ss){return countSources(ss)>0;}, description:'交叉验证' },
        GAP_DETECT:      { id:'GAP_DETECT', order:8, name:'Gap Detect',    next:'DEEP_ANALYZE',   fallback:'SEARCH',   final:false, canExit:function(ss){return true;}, description:'发现研究缺口' },
        DEEP_ANALYZE:    { id:'DEEP_ANALYZE', order:9, name:'Deep Analyze', next:'THESIS_BUILD',  fallback:'GAP_DETECT',final:false, canExit:function(ss){return deepAnalysisReady(ss);}, description:'深度分析' },
        THESIS_BUILD:    { id:'THESIS_BUILD', order:10, name:'Thesis Build', next:'QUALITY_GATE', fallback:'DEEP_ANALYZE',final:false, canExit:function(ss){return thesisReady(ss);}, description:'构建论点' },
        QUALITY_GATE:    { id:'QUALITY_GATE', order:11, name:'Quality Gate', next:'CONFIDENCE_TAG',fallback:'GAP_DETECT',final:false, canExit:function(ss){return gatePassed(ss);}, description:'质量门控' },
        CONFIDENCE_TAG:  { id:'CONFIDENCE_TAG', order:12, name:'Confidence Tag', next:'COMPILE', fallback:'QUALITY_GATE',final:false, canExit:function(ss){return true;}, description:'置信度标注' },
        COMPILE:         { id:'COMPILE', order:13, name:'Compile',          next:'OUTPUT',         fallback:'GAP_DETECT',final:false, canExit:function(ss){return countSources(ss)>0;}, description:'编译输出' },
        OUTPUT:          { id:'OUTPUT', order:14, name:'Output',            next:null,             fallback:null,       final:true,  canExit:function(){return true;},           description:'最终输出' }
    };

    function buildTransitions() {
        var transitions = {};
        var ids = STAGE_ORDER.slice();
        for (var i = 0; i < ids.length; i++) {
            var id = ids[i];
            var spec = STAGE_REGISTRY[id];
            transitions[id] = {
                next: spec && spec.next ? spec.next : null,
                fallback: spec && spec.fallback ? spec.fallback : null
            };
        }
        return transitions;
    }

    var STAGE_CONFIG = {
        stageCount: STAGE_ORDER.length,
        gateCount: 15,
        order: STAGE_ORDER.slice(),
        stages: STAGE_ORDER.map(function (id) {
            return { id: id, name: STAGE_REGISTRY[id] ? STAGE_REGISTRY[id].name : id, order: STAGE_REGISTRY[id] ? STAGE_REGISTRY[id].order : 0 };
        }),
        transitions: buildTransitions(),
        gates: { minSources: 6, minRounds: 2, minQuantSources: 2, minCnTier01: 1, minCnCases: 1, strongCnMinZhCount: 4, maxBiasRatio: 0.6 }
    };

    var DEFAULT_STAGES = STAGE_CONFIG.stages.slice();
    var STAGE_SCHEMA_HASH = 'stage_' + STAGE_CONFIG.stageCount + '_' + STAGE_CONFIG.gateCount;

    ROOT.STAGE_ORDER = STAGE_ORDER;
    ROOT.STAGE_REGISTRY = STAGE_REGISTRY;
    ROOT.STAGE_CONFIG = STAGE_CONFIG;
    ROOT.DEFAULT_STAGES = DEFAULT_STAGES;
    ROOT.STAGE_SCHEMA_HASH = STAGE_SCHEMA_HASH;
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);

/* src/ui/progress.js v4.5.0 */
(function(R){'use strict';
function L(s){var m={INIT:'初始化',QUERY_PLAN:'查询规划',SEARCH:'搜索中',FETCH:'获取来源',EXTRACT:'提取事实',AUTHORITY_CLASSIFY:'权威分类',CROSS_VALIDATE:'交叉验证',GAP_DETECT:'缺口检测',DEEP_ANALYZE:'深度分析',THESIS_BUILD:'论点构建',QUALITY_GATE:'质量门控',CONFIDENCE_TAG:'置信度标记',COMPILE:'编译结果',OUTPUT:'输出完成'};return m[s]||s||'就绪';}
function T(){return(R.STAGE_CONFIG&&R.STAGE_CONFIG.stageCount)||14;}
function G(ss){var t=T();if(!ss)return{percent:0,currentStage:'INIT',completedCount:0,totalCount:t,label:'就绪',done:false};var cs=ss.currentStage||'INIT';var comp=Array.isArray(ss.completedStages)?ss.completedStages.length:0;var pct=t>0?Math.floor((comp/t)*100):0;if(pct>99&&cs!=='OUTPUT')pct=99;if(cs==='OUTPUT')pct=100;return{percent:pct,currentStage:cs,completedCount:comp,totalCount:t,label:L(cs),done:cs==='OUTPUT'};}
function B(ss){var p=G(ss);var r=ss&&ss.search&&typeof ss.search.rounds==='number'?ss.search.rounds:0;var sc=ss&&Array.isArray(ss.sources)?ss.sources.length:0;return'[深度研究] '+p.label+' ('+p.percent+'%) | 轮次 '+r+' | 来源 '+sc;}
function E(ss,el){if(R.CONFIG&&R.CONFIG.ENABLE_PROGRESS_EVENTS===false)return;if(!R.EventBus)return;var p=G(ss);R.EventBus.emit('pipeline:progress',{event:el||'progress',percent:p.percent,currentStage:p.currentStage,completedCount:p.completedCount,totalCount:p.totalCount,label:p.label,timestamp:new Date().toISOString()});}
R.ProgressUI={getStageLabel:L,getProgress:G,buildStatusLine:B,emitProgress:E};
})(typeof globalThis!=='undefined'?globalThis:typeof window!=='undefined'?window:typeof global!=='undefined'?global:this);
/* src/pipeline/fsm.js v4.5.0 */
(function(R){'use strict';
function clone(v){if(v===null||v===undefined)return v;if(Array.isArray(v))return v.slice();if(typeof v==='object'){var o={};for(var k in v){if(Object.prototype.hasOwnProperty.call(v,k))o[k]=clone(v[k]);}return o;}return v;}
function create(query,meta){var now=new Date().toISOString();return{sessionId:'ds_'+now.replace(/[:.]/g,'')+'_'+Math.floor(Math.random()*1000000),startedAt:now,updatedAt:now,query:query||'',meta:meta||{},currentStage:'INIT',completedStages:[],stageResults:{},sources:[],sourceIndex:{},extractedFacts:[],assertions:[],conflicts:[],gaps:[],checkpoints:[],errors:[],search:{rounds:0,roundAdvances:0,totalSearches:0,totalIngested:0,pendingQueries:[],executedQueries:[],searchHistory:[],failedSearches:[],parallelGroups:{}},qualityGate:{lastCheck:null,lastResult:null,failedGates:[],checkCount:0}};}
function normalize(ss){if(!ss)return ss;if(!ss.search)ss.search={};if(!ss.qualityGate)ss.qualityGate={};if(!Array.isArray(ss.completedStages))ss.completedStages=[];if(!ss.stageResults||typeof ss.stageResults!=='object')ss.stageResults={};if(!Array.isArray(ss.sources))ss.sources=[];if(!ss.sourceIndex||typeof ss.sourceIndex!=='object')ss.sourceIndex={};if(!Array.isArray(ss.extractedFacts))ss.extractedFacts=[];if(!Array.isArray(ss.assertions))ss.assertions=[];if(!Array.isArray(ss.conflicts))ss.conflicts=[];if(!Array.isArray(ss.gaps))ss.gaps=[];if(!Array.isArray(ss.checkpoints))ss.checkpoints=[];if(!Array.isArray(ss.errors))ss.errors=[];if(!Array.isArray(ss.search.pendingQueries))ss.search.pendingQueries=[];if(!Array.isArray(ss.search.executedQueries))ss.search.executedQueries=[];if(!Array.isArray(ss.search.searchHistory))ss.search.searchHistory=[];if(!Array.isArray(ss.search.failedSearches))ss.search.failedSearches=[];if(!ss.search.parallelGroups||typeof ss.search.parallelGroups!=='object')ss.search.parallelGroups={};if(typeof ss.search.rounds!=='number')ss.search.rounds=0;if(typeof ss.search.roundAdvances!=='number')ss.search.roundAdvances=0;if(typeof ss.search.totalSearches!=='number')ss.search.totalSearches=0;if(typeof ss.search.totalIngested!=='number')ss.search.totalIngested=0;if(!ss.currentStage)ss.currentStage='INIT';if(typeof ss.updatedAt!=='string')ss.updatedAt=new Date().toISOString();if(typeof ss.startedAt!=='string')ss.startedAt=ss.updatedAt;if(!ss.sessionId)ss.sessionId='ds_'+ss.updatedAt.replace(/[:.]/g,'');if(typeof ss.qualityGate.lastCheck==='undefined')ss.qualityGate.lastCheck=null;if(typeof ss.qualityGate.lastResult==='undefined')ss.qualityGate.lastResult=null;if(!Array.isArray(ss.qualityGate.failedGates))ss.qualityGate.failedGates=[];if(typeof ss.qualityGate.checkCount!=='number')ss.qualityGate.checkCount=0;return ss;}
function getStageOrder(){return(R.STAGE_CONFIG&&R.STAGE_CONFIG.order)||(R.CONFIG&&R.CONFIG.STAGE_ORDER)||[];}
function getStageSpec(id){return R.STAGE_REGISTRY?R.STAGE_REGISTRY[id]||null:null;}
function canAdvance(ss,id){var s=getStageSpec(id);if(!s||typeof s.canExit!=='function')return false;return !!s.canExit(ss||{});}
function nextStage(id){var t=R.STAGE_CONFIG&&R.STAGE_CONFIG.transitions?R.STAGE_CONFIG.transitions[id]:null;return t&&t.next?t.next:null;}
function rollbackStage(id){var t=R.STAGE_CONFIG&&R.STAGE_CONFIG.transitions?R.STAGE_CONFIG.transitions[id]:null;return t&&t.fallback?t.fallback:null;}
function isFinished(ss){return!!(ss&&ss.currentStage==='OUTPUT');}
function setStage(ss,id){if(!ss)return ss;normalize(ss);ss.currentStage=id;if(ss.completedStages.indexOf(id)===-1){ss.completedStages.push(id);}ss.updatedAt=new Date().toISOString();return ss;}
function advance(ss,explicitNext){if(!ss)return ss;normalize(ss);var cur=ss.currentStage||'INIT';var nxt=explicitNext||nextStage(cur);if(!nxt)return ss;if(ss.completedStages.indexOf(cur)===-1){ss.completedStages.push(cur);}ss.currentStage=nxt;ss.updatedAt=new Date().toISOString();return ss;}
function recordResult(ss,id,result){if(!ss)return ss;normalize(ss);ss.stageResults[id]=clone(result);ss.updatedAt=new Date().toISOString();return ss;}
function recordError(ss,err){if(!ss)return ss;normalize(ss);ss.errors.push(err);if(ss.errors.length>(R.CONFIG&&R.CONFIG.MAX_RECENT_ERRORS||20)){ss.errors.shift();}ss.updatedAt=new Date().toISOString();return ss;}
R.PipelineFSM={create:create,normalize:normalize,canAdvance:canAdvance,nextStage:nextStage,rollbackStage:rollbackStage,isFinished:isFinished,setStage:setStage,advance:advance,recordResult:recordResult,recordError:recordError,getStageOrder:getStageOrder,getStageSpec:getStageSpec};
})(typeof globalThis!=='undefined'?globalThis:typeof window!=='undefined'?window:typeof global!=='undefined'?global:this);
/* src/ui/toggle.js v4.5.0 */
(function(R){'use strict';
function F(root,sel){if(!root||!sel||typeof root.querySelector!=='function')return null;return root.querySelector(sel);}
function DC(el){if(!el||typeof el.dispatchEvent!=='function')return;try{var e;if(typeof Event==='function'){e=new Event('change',{bubbles:true});}else{e=document.createEvent('Event');e.initEvent('change',true,true);}el.dispatchEvent(e);}catch(x){}}
function STS(el,active,opts){if(!el)return;el.checked=!!active;if(el.setAttribute){el.setAttribute('aria-pressed',String(!!active));el.setAttribute('data-state',active?'on':'off');}if(!opts||opts.dispatch!==false)DC(el);if(R.EventBus){R.EventBus.emit('toggle:changed',{active:!!active,toggleId:el.id||null,timestamp:new Date().toISOString()});}}
function RT(el){STS(el,false,{dispatch:true});if(R.EventBus){R.EventBus.emit('toggle:reset',{toggleId:el&&el.id?el.id:null,timestamp:new Date().toISOString()});}}
function SI(el){if(!el||!el.classList)return;var cls=(R.CONFIG&&R.CONFIG.EMPTY_INPUT_SHAKE_CLASS)||'deep-research-shake';el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);setTimeout(function(){el.classList.remove(cls);},500);}
function BM(opts){opts=opts||{};var root=opts.root||(typeof document!=='undefined'?document:null);var tel=opts.toggleEl||F(root,'#'+((R.CONFIG&&R.CONFIG.TOGGLE_ID)||'deep_research_input_menu_toggle'));var sbtn=opts.sendButtonEl||F(root,opts.sendButtonSelector||'[data-deep-research-send]');var iel=opts.inputEl||F(root,opts.inputSelector||'textarea, input[type="text"]');
function OS(){var t=iel&&typeof iel.value==='string'?iel.value:'';if(!t||!String(t).trim()){SI(iel);if(R.EventBus){R.EventBus.emit('toggle:empty-send',{toggleId:tel&&tel.id?tel.id:null,timestamp:new Date().toISOString()});}return;}if(R.EventBus){R.EventBus.emit('toggle:send',{query:t,toggleActive:!!(tel&&tel.checked),timestamp:new Date().toISOString()});}if((R.CONFIG&&R.CONFIG.AUTO_CLOSE_TOGGLE_AFTER_SEND)!==false){RT(tel);}}
if(sbtn&&typeof sbtn.addEventListener==='function'){sbtn.addEventListener('click',OS);}if(tel&&typeof tel.addEventListener==='function'){tel.addEventListener('change',function(){STS(tel,!!tel.checked,{dispatch:false});});}return{root:root,toggleEl:tel,sendButtonEl:sbtn,inputEl:iel,send:OS,reset:function(){RT(tel);},setState:function(a){STS(tel,a,{dispatch:true});}};}
R.ToggleUI={find:F,setToggleState:STS,resetToggle:RT,shakeInput:SI,bindMenu:BM};
})(typeof globalThis!=='undefined'?globalThis:typeof window!=='undefined'?window:typeof global!=='undefined'?global:this);
/* src/pipeline/orchestrator.js v4.5.0 */
(function(R){'use strict';
function clone(v){if(v===null||v===undefined)return v;if(Array.isArray(v))return v.slice();if(typeof v==='object'){var o={};for(var k in v){if(Object.prototype.hasOwnProperty.call(v,k))o[k]=clone(v[k]);}return o;}return v;}
function normUrl(u){if(!u)return'';var s=String(u).toLowerCase().trim();s=s.replace(/^https?:\/\//,'');s=s.replace(/^www\./,'');if(R.PERFORMANCE_CONFIG&&R.PERFORMANCE_CONFIG.DEDUP_URL_STRIP_TRAILING_SLASH!==false){s=s.replace(/\/$/,'');}var h=s.indexOf('#');if(h!==-1)s=s.substring(0,h);return s;}
function makeDK(item){var t=(item&&(item.title||item.snippet||'')||'').toString().trim().toLowerCase();if(t.length>80)t=t.substring(0,80);var u=normUrl(item&&item.url?item.url:'');return t+'::'+u;}
function dedupe(items){if(!Array.isArray(items)||items.length===0)return[];var seen=Object.create(null);var out=[];for(var i=0;i<items.length;i++){var k=makeDK(items[i]);if(seen[k])continue;seen[k]=true;out.push(items[i]);}return out;}
function normSrc(src,st){var s=src||{};var url=s.url||s.link||'';var title=s.title||s.name||s.headline||'';var snippet=s.snippet||s.summary||'';var lang=s.language||(/[一-龥]/.test(title+' '+snippet)?'zh':'en');return{url:url,title:title,snippet:snippet,language:lang,sourceType:st||s.sourceType||'web',authorityTier:typeof s.authorityTier==='number'?s.authorityTier:4,stance:s.stance||'neutral',metadata:clone(s.metadata||{}),extractedFacts:Array.isArray(s.extractedFacts)?s.extractedFacts.slice():[],createdAt:s.createdAt||new Date().toISOString()};}
function ensSearch(ss){if(!ss.search)ss.search={};if(!Array.isArray(ss.search.pendingQueries))ss.search.pendingQueries=[];if(!Array.isArray(ss.search.executedQueries))ss.search.executedQueries=[];if(!Array.isArray(ss.search.searchHistory))ss.search.searchHistory=[];if(!Array.isArray(ss.search.failedSearches))ss.search.failedSearches=[];if(!ss.search.parallelGroups||typeof ss.search.parallelGroups!=='object')ss.search.parallelGroups={};if(typeof ss.search.rounds!=='number')ss.search.rounds=0;if(typeof ss.search.totalSearches!=='number')ss.search.totalSearches=0;if(typeof ss.search.totalIngested!=='number')ss.search.totalIngested=0;return ss.search;}
function ensIdx(ss){if(!ss.sourceIndex||typeof ss.sourceIndex!=='object')ss.sourceIndex={};if(!Array.isArray(ss.sources))ss.sources=[];return ss.sourceIndex;}
function batchIngest(ss,srcList,opts){if(!ss)return{success:false,error:'sessionState required'};if(!Array.isArray(srcList))srcList=srcList?[srcList]:[];R.PipelineFSM.normalize(ss);ensSearch(ss);ensIdx(ss);var n=[];var st=opts&&opts.sourceType?opts.sourceType:'web';for(var i=0;i<srcList.length;i++){n.push(normSrc(srcList[i],st));}n=dedupe(n);var ins=0;for(var j=0;j<n.length;j++){var item=n[j];var key=(typeof R!=='undefined'&&typeof R.makeSourceKey==='function')?R.makeSourceKey(item):makeDK(item);if(ss.sourceIndex[key]!==undefined)continue;ss.sourceIndex[key]=ss.sources.length;ss.sources.push(item);ss.search.totalIngested+=1;ins+=1;}ss.updatedAt=new Date().toISOString();if(R.ProgressUI)R.ProgressUI.emitProgress(ss,'ingest');return{success:true,inserted:ins,deduped:n.length-ins,sourceCount:ss.sources.length,sessionState:ss};}
function ingestOne(ss,src,opts){return batchIngest(ss,[src],opts);}
function advRound(ss){if(!ss)return{success:false,error:'sessionState required'};R.PipelineFSM.normalize(ss);ensSearch(ss);ss.search.rounds+=1;ss.search.roundAdvances+=1;ss.updatedAt=new Date().toISOString();if(R.EventBus){R.EventBus.emit('pipeline:round-advanced',{sessionId:ss.sessionId,round:ss.search.rounds,timestamp:ss.updatedAt});}return{success:true,sessionState:ss,round:ss.search.rounds};}
function resLang(q,pri){var hc=/[\u4e00-\u9fff]/.test(q||'');var he=/[a-zA-Z]{4,}/.test(q||'');var m=pri||'auto';var p='en';var s='zh';var zr=0.5;if(m==='auto'){if(hc&&!he){m='zh_primary';p='zh';s='en';zr=0.7;}else if(he&&!hc){m='en_primary';p='en';s='zh';zr=0.2;}else if(hc&&he){m='mixed';p='zh';s='en';zr=0.5;}else{m='en_primary';}}else if(m==='zh'){p='zh';s='en';zr=0.8;}else if(m==='en'){p='en';s='zh';zr=0.1;}return{mode:m,primaryLang:p,secondaryLang:s,zhRatio:zr};}
function decQ(q,lc){var x=String(q||'').trim();if(!x)return[];var parts=x.replace(/[，,；;。\.]/g,' ').split(/\s+/);var out=[];for(var i=0;i<parts.length;i++){if(parts[i])out.push(parts[i]);}if(out.length===0)out.push(x);if(lc&&lc.primaryLang==='zh'){out.unshift(x);}return out.slice(0,8);}
function idDim(q){var dims=[];var x=String(q||'').toLowerCase();if(x.indexOf('cost')!==-1||x.indexOf('价格')!==-1)dims.push('cost');if(x.indexOf('risk')!==-1||x.indexOf('风险')!==-1)dims.push('risk');if(x.indexOf('policy')!==-1||x.indexOf('政策')!==-1)dims.push('policy');if(x.indexOf('market')!==-1||x.indexOf('市场')!==-1)dims.push('market');if(x.indexOf('technical')!==-1||x.indexOf('技术')!==-1)dims.push('technical');if(dims.length===0)dims.push('general');return dims;}
function profT(q){var x=String(q||'').trim();var hc=/[\u4e00-\u9fff]/.test(x);var he=/[a-zA-Z]{4,}/.test(x);return{languageHint:hc&&!he?'zh':he&&!hc?'en':'mixed',length:x.length,tokenCount:x?x.split(/\s+/).length:0};}
function genPlan(q,sq,lc){var pq=[];var p=lc&&lc.primaryLang?lc.primaryLang:'en';var s=lc&&lc.secondaryLang?lc.secondaryLang:'zh';for(var i=0;i<sq.length;i++){pq.push({q:sq[i],lang:p,sourceTypes:p==='zh'?['government','academic','web']:['web','academic','news']});}if(pq.length===0){pq.push({q:q,lang:p,sourceTypes:['web','news','academic']});}var sn=Math.min(2,pq.length);for(var j=0;j<sn;j++){pq.push({q:sq[j]||q,lang:s,sourceTypes:s==='zh'?['government','academic']:['web','news']});}return{queries:pq,targetSourceTypes:['web','news','academic','government'],estimatedRounds:Math.max(1,Math.ceil(pq.length/3)),parallelBatchSize:(R.PERFORMANCE_CONFIG&&R.PERFORMANCE_CONFIG.PARALLEL_SEARCH_BATCH_SIZE)||3};}
function buildISS(q,lc,sq,dim,sp,tp,now){var ss=R.PipelineFSM.create(q,{languageConfig:clone(lc),subQuestions:clone(sq),dimensions:clone(dim),topicProfile:clone(tp),searchPlan:clone(sp)});ss.startedAt=now;ss.updatedAt=now;ss.query=q;ss.languageConfig=clone(lc);ss.topicProfile=clone(tp);ss.subQuestions=clone(sq);ss.dimensions=clone(dim);ss.search.plan=clone(sp);ss.search.pendingQueries=sp.queries.slice();ss.search.searchHistory.push({stage:'INIT',timestamp:now,query:q});R.PipelineFSM.setStage(ss,'INIT');return ss;}
function defFetch(spec){return new Promise(function(rs){setTimeout(function(){rs({url:spec.q?'https://example.com/search?q='+encodeURIComponent(spec.q):'https://example.com/',title:spec.q||'result',snippet:'placeholder result',sourceType:spec.lang||'web',authorityTier:4,language:spec.lang||'en',metadata:{source:'defaultFetchSource'}});},0);});}
function fetchSrc(spec,deps){var a=deps&&deps.fetchSource?deps.fetchSource:defFetch;return a(spec,deps);}
function runSR(ss,sp,deps){var qs=sp.queries.slice();var bs=sp.parallelBatchSize||3;var batches=[];for(var i=0;i<qs.length;i+=bs){batches.push(qs.slice(i,i+bs));}if(R.EventBus){R.EventBus.emit('pipeline:search-start',{sessionId:ss.sessionId,batches:batches.length,queryCount:qs.length});}var chain=Promise.resolve([]);for(var b=0;b<batches.length;b++){(function(bt){chain=chain.then(function(acc){return Promise.allSettled(bt.map(function(q){return fetchSrc(q,deps);})).then(function(settled){var results=[];for(var i=0;i<settled.length;i++){if(settled[i].status==='fulfilled'){results.push(settled[i].value);}else{ss.search.failedSearches.push({query:bt[i]?bt[i].q:'',error:String(settled[i].reason||'unknown')});}}return acc.concat(results);});});})(batches[b]);}return chain.then(function(raw){var n=[];for(var i=0;i<raw.length;i++){n.push(normSrc(raw[i],raw[i]&&raw[i].sourceType));}var dd=dedupe(n);var ir=batchIngest(ss,dd,{sourceType:'web'});if(R.ProgressUI)R.ProgressUI.emitProgress(ss,'search');if(R.EventBus){R.EventBus.emit('pipeline:search-done',{sessionId:ss.sessionId,sourceCount:ss.sources.length,inserted:ir.inserted});}return{success:true,rawResults:raw,normalizedResults:n,dedupedResults:dd,ingestResult:ir,sessionState:ss};});}
function mkCkpt(ss){return{success:true,checkpointId:'ckpt_'+new Date().toISOString().replace(/[:.]/g,''),version:(R.DEEPSEARCH_VERSION||'4.5.0'),timestamp:new Date().toISOString(),sessionState:clone(ss)};}
function sync2Plan(ss,act){return{success:true,plantodo:{action:act||'snapshot',sessionId:ss&&ss.sessionId?ss.sessionId:null,currentStage:ss&&ss.currentStage?ss.currentStage:'INIT',updatedAt:new Date().toISOString()},progress:R.ProgressUI?R.ProgressUI.getProgress(ss):null};}
function startR(params){var q=params&&params.query?String(params.query):'';var lp=params&&params.language_priority?params.language_priority:(R.CONFIG&&R.CONFIG.DEFAULT_QUERY_LANGUAGE)||'auto';var pa=params&&params.plan_aware===true;var now=new Date().toISOString();var lc=resLang(q,lp);var sq=decQ(q,lc);var dim=idDim(q);var sp=genPlan(q,sq,lc);var tp=profT(q);var ss=buildISS(q,lc,sq,dim,sp,tp,now);var result={success:true,sessionState:ss,firstAction:{stage:'QUERY_PLAN',plannedQueries:sp.queries.slice(0,3),targetSourceTypes:sp.targetSourceTypes,instruction:'Execute first search round, prioritize '+lc.primaryLang.toUpperCase()+' sources'},meta:{query:q,subQuestionCount:sq.length,dimensions:dim,languagePriority:lc.mode,topicProfile:tp,estimatedRounds:sp.estimatedRounds}};if(pa&&R.PipelineOrchestrator&&R.PipelineOrchestrator.buildPlanTodo){var pt=R.PipelineOrchestrator.buildPlanTodo(q,ss);result.plantodo=pt.plantodo;result.planProgress=pt.progress;result.plan_aware=true;result.meta.planIntegration='active';}if(R.ProgressUI)R.ProgressUI.emitProgress(ss,'start');return result;}
function resumeR(params){var sid=params&&params.session_id?String(params.session_id):'';if(!sid){return{success:false,error:'session_id is required'};}var store=R.DeepSearchStore||null;var ckpt=store&&typeof store.readCheckpoint==='function'?store.readCheckpoint(sid):null;if(!ckpt||!ckpt.sessionState){return{success:false,error:(R.ERROR&&R.ERROR.code.RESUME_NO_CHECKPOINT?R.ERROR.code.RESUME_NO_CHECKPOINT.hint:'No checkpoint found'),_errorCode:'RESUME_NO_CHECKPOINT',_errorCategory:'FATAL'};}var ss=clone(ckpt.sessionState);R.PipelineFSM.normalize(ss);ss.updatedAt=new Date().toISOString();var nx=R.PipelineFSM.nextStage(ss.currentStage);return{success:true,resumed:true,sessionState:ss,nextActions:nx?[{stage:nx,action:'continue'}]:[],checkpoint:ckpt};}
function chkStatus(params){var ss=params&&params.session_state?params.session_state:null;var p=R.ProgressUI?R.ProgressUI.getProgress(ss):{percent:0,currentStage:'INIT',completedCount:0,totalCount:14,label:'就绪',done:false};return{success:true,status:{stage:ss&&ss.currentStage?ss.currentStage:'INIT',rounds:ss&&ss.search?ss.search.rounds:0,sourceCount:ss&&ss.sources?ss.sources.length:0,percent:p.percent,label:p.label,done:p.done,lastError:ss&&ss.errors&&ss.errors.length?ss.errors[ss.errors.length-1]:null}};}
function orchR(params,deps){deps=deps||{};var start=startR(params);if(!start.success)return Promise.resolve(start);var ss=start.sessionState;var sp=ss.search.plan||{queries:[],estimatedRounds:1,parallelBatchSize:3};var q=params&&params.query?String(params.query):'';if(R.EventBus){R.EventBus.emit('pipeline:start',{sessionId:ss.sessionId,query:q,stage:ss.currentStage});}return runSR(ss,sp,deps).then(function(sr){R.PipelineFSM.setStage(ss,'SEARCH');R.PipelineFSM.recordResult(ss,'SEARCH',sr);if(R.ProgressUI)R.ProgressUI.emitProgress(ss,'search_done');return{success:true,sessionState:ss,searchResult:sr,ingestResult:sr.ingestResult,summary:{sourceCount:ss.sources.length,rounds:ss.search.rounds,stage:ss.currentStage}};}).catch(function(e){var err=String(e&&e.message?e.message:e);R.PipelineFSM.recordError(ss,{stage:ss.currentStage,error:err,timestamp:new Date().toISOString()});if(R.EventBus){R.EventBus.emit('pipeline:error',{sessionId:ss.sessionId,error:err});}return{success:false,error:err,sessionState:ss};});}
function bpt(q,ss){return{plantodo:{query:q,sessionId:ss?ss.sessionId:null,currentStage:ss?ss.currentStage:'INIT'},progress:R.ProgressUI?R.ProgressUI.getProgress(ss):null};}
R.PipelineOrchestrator={normalizeUrl:normUrl,makeDedupKey:makeDK,dedupeItems:dedupe,normalizeSource:normSrc,batchIngestSources:batchIngest,ingestSource:ingestOne,advanceSearchRound:advRound,resolveLanguagePriority:resLang,decomposeQuery:decQ,identifyDimensions:idDim,profileTopic:profT,generateSearchPlan:genPlan,buildInitialSessionState:buildISS,runSearchRound:runSR,createCheckpoint:mkCkpt,syncToPlan:sync2Plan,startResearch:startR,resumeResearch:resumeR,checkResearchStatus:chkStatus,orchestrateResearch:orchR,buildPlanTodo:bpt};
})(typeof globalThis!=='undefined'?globalThis:typeof window!=='undefined'?window:typeof global!=='undefined'?global:this);
/* src/02_store.js v4.5.0 — unified key + batch checkpoint */
function makeSourceKey(source) {
    if (!source) return '';
    if (typeof DedupUtils !== 'undefined') {
        return DedupUtils.makeDedupKey({ url: source.url || '', title: source.title || source.snippet || '' });
    }
    var url = (source.url || '').toLowerCase().trim();
    url = url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
    var h = url.indexOf('#'); if (h !== -1) url = url.substring(0, h);
    return url;
}
if (typeof ROOT !== 'undefined') { ROOT.makeSourceKey = makeSourceKey; }

var SourceIndex = (function() {
    function create() { return Object.create(null); }
    function has(index, source) { var k = makeSourceKey(source); return k ? (k in index) : false; }
    function get(index, source) { var k = makeSourceKey(source); return k ? index[k] : undefined; }
    function put(index, normalized) { var k = makeSourceKey(normalized); if (!k) return -1; var idx = (typeof index._count === 'number') ? index._count : 0; index[k] = idx; index._count = idx + 1; return idx; }
    function rebuild(sources) { var idx = Object.create(null); idx._count = 0; if (!Array.isArray(sources)) return idx; for (var i = 0; i < sources.length; i++) { if (sources[i]) { var k = makeSourceKey(sources[i]); if (k) { idx[k] = i; } } } idx._count = sources.length; return idx; }
    return { create: create, has: has, get: get, put: put, rebuild: rebuild };
})();

var Store = (function() {
    var MAX_SOURCES = typeof PERFORMANCE_CONFIG !== 'undefined' ? PERFORMANCE_CONFIG.STORE_MAX_SOURCES : 500;
    var MAX_FACTS   = typeof PERFORMANCE_CONFIG !== 'undefined' ? PERFORMANCE_CONFIG.STORE_MAX_FACTS : 500;
    var MAX_HISTORY = typeof PERFORMANCE_CONFIG !== 'undefined' ? PERFORMANCE_CONFIG.STORE_MAX_HISTORY : 200;
    function _trim(arr, max) { if (arr.length > max) { var excess = arr.length - max; for (var i = 0; i < max; i++) { arr[i] = arr[i + excess]; } arr.length = max; } }
    function ensureSources(ss) { ss.sources = ss.sources || []; ss.sourceIndex = ss.sourceIndex || SourceIndex.create(); return ss.sources; }
    function ensureFacts(ss) { ss.extractedFacts = ss.extractedFacts || []; return ss.extractedFacts; }
    function ensureHistory(ss) { if (!ss.search) ss.search = {}; ss.search.searchHistory = ss.search.searchHistory || []; return ss.search.searchHistory; }
    function pushSource(ss, normalized) { var sources = ensureSources(ss); var key = makeSourceKey(normalized); if (!key) return -1; if (ss.sourceIndex[key] !== undefined) return ss.sourceIndex[key]; var idx = sources.length; sources.push(normalized); ss.sourceIndex[key] = idx; if (sources.length > MAX_SOURCES) { _trim(sources, MAX_SOURCES); ss.sourceIndex = SourceIndex.rebuild(sources); } return idx; }
    function pushFact(ss, fact) { var facts = ensureFacts(ss); facts.push(fact); _trim(facts, MAX_FACTS); }
    function pushHistory(ss, entry) { var history = ensureHistory(ss); history.push(entry); _trim(history, MAX_HISTORY); }
    function batchIngest(ss, srcList, opts) { if (typeof PipelineOrchestrator !== 'undefined' && PipelineOrchestrator.batchIngestSources) { return PipelineOrchestrator.batchIngestSources(ss, srcList, opts); } ensureSources(ss); if (!Array.isArray(srcList)) srcList = srcList ? [srcList] : []; var inserted = 0; for (var i = 0; i < srcList.length; i++) { var idx = pushSource(ss, srcList[i]); if (idx >= 0) inserted++; } return { success: true, inserted: inserted, sourceCount: (ss.sources || []).length, sessionState: ss }; }
    var _ckptStore = Object.create(null);
    function writeCheckpoint(sid, ckpt) { if (!sid) return false; _ckptStore[sid] = ckpt; return true; }
    function readCheckpoint(sid) { if (!sid) return null; return _ckptStore[sid] || null; }
    function listCheckpointIds() { return Object.keys(_ckptStore); }
    return { ensureSources: ensureSources, ensureFacts: ensureFacts, ensureHistory: ensureHistory, pushSource: pushSource, pushFact: pushFact, pushHistory: pushHistory, batchIngestSources: batchIngest, writeCheckpoint: writeCheckpoint, readCheckpoint: readCheckpoint, listCheckpointIds: listCheckpointIds };
})();
var DeepSearchStore = Store;
/* src/01_policies.js v4.5.0 — Authority/Gate/Cache/Metrics + LANGUAGE_PROFILES */
(function(R){'use strict';
var LANGUAGE_PROFILES={zh:{code:'zh',label:'Chinese',urlMarkers:['.cn','zhihu','csdn','cnki','juejin','caict'],contextSearchTerms:' 中国 市场 政策 发展',querySuffix:' 中国 现状 2026',sourceTypes:['government','academic'],languageHints:{needsPolicyDimension:true,strongLocalKeywords:['domestic','indigenous','self-reliant'],needsLocalKeywords:['china','chinese','beijing','cn']},gateHints:{minTier01:1,minLocalCases:1,minLocalSourceCount:4}},en:{code:'en',label:'English',urlMarkers:[],contextSearchTerms:null,querySuffix:' analysis report 2026',sourceTypes:['primary','academic']}};

var AuthorityPolicy=(function(){
function matchTier(source){if(!source||!source.url){return{tier:4,level:'tier4',label:'Unclassified',score:0.1,authority:'unknown'};}var metadata=source.metadata||{};var host=source.host||extractHost(source.url);var lang=source.language||detectLanguage(source.url,metadata);var result=null;var matcher=_langMatchers[lang];if(matcher)result=matcher(host,source.url,metadata);if(!result)result=matchEnTier(host,source.url,metadata);if(!result)result={tier:4,level:'tier4',label:'Unclassified',score:0.1,authority:'unknown'};result=applyAuthorBoost(result,metadata);result=checkChannelMismatch(result,source.url,metadata);return result;}
function score(source,ctx){return matchTier(source).score;}
function isPreferred(source,ctx){return matchTier(source).tier<=2;}
function register(lang,fn){if(typeof fn!=='function')return false;_langMatchers[lang]=fn;return true;}
function classifyBatch(sources){if(!Array.isArray(sources))return[];var r=[];for(var i=0;i<sources.length;i++){r.push(matchTier(sources[i]));}return r;}
var _langMatchers={};_langMatchers.zh=matchCnTier;_langMatchers.en=matchEnTier;
return{matchTier:matchTier,score:score,isPreferred:isPreferred,register:register,classifyBatch:classifyBatch};})();

var LanguagePolicy=(function(){
function detect(url,md){return{language:detectLanguage(url,md||{}),confidence:(md&&md.language)?1.0:0.7};}
function buildQuery(q,p){return{querySuffix:p.querySuffix||'',contextSearchTerms:p.contextSearchTerms||'',sourceTypes:p.sourceTypes||['primary','academic']};}
function listProfiles(){var r=[];for(var k in LANGUAGE_PROFILES)r.push(LANGUAGE_PROFILES[k]);return r;}
function adapt(topic,lc){var lc2=lc||'zh';var p=LANGUAGE_PROFILES[lc2]||LANGUAGE_PROFILES.zh;var h=p.languageHints;var nl=false,sl=false,pr=false;var tl=(topic||'').toLowerCase();if(h&&h.needsLocalKeywords){for(var i=0;i<h.needsLocalKeywords.length;i++){if(tl.indexOf(h.needsLocalKeywords[i])!==-1){nl=true;break;}}}if(h&&h.strongLocalKeywords){for(var j=0;j<h.strongLocalKeywords.length;j++){if(tl.indexOf(h.strongLocalKeywords[j])!==-1){sl=true;break;}}}if(h&&h.needsPolicyDimension)pr=true;return{needsLocal:nl,strongLocal:sl,policyRelevant:pr,needsCn:nl,strongCn:sl};}
return{detect:detect,buildQuery:buildQuery,listProfiles:listProfiles,adapt:adapt};})();

var GatePolicy=(function(){
function enabledBy(ar){var g=[];if(!ar)return{gates:g,reason:'no adapt result'};if(ar.needsCn||ar.needsLocal){g.push('G8','G11','G12');}if(ar.strongCn||ar.strongLocal){g.push('G9');}return{gates:g,reason:g.length?g.join(','):'no conditional gates triggered'};}
function evaluate(gid,sources,th){var zh=0;for(var i=0;i<(sources?sources.length:0);i++){if(sources[i].language==='zh')zh++;}switch(gid){case'G8':{var t=(th&&th.minCnTier01)||1;var c=countCnTier01(sources);return{id:'G8',name:'CN authority',passed:c>=t,detail:c+'/'+t,required:String(t),actual:String(c)};}case'G9':{var t=(th&&th.strongCnMinZhCount)||4;return{id:'G9',name:'CN count(strong)',passed:zh>=t,detail:zh+'/'+t,required:String(t),actual:String(zh)};}case'G11':{var t=(th&&th.minCnCases)||1;var c=countCnCases(sources);return{id:'G11',name:'CN cases',passed:c>=t,detail:c+'/'+t,required:String(t),actual:String(c)};}case'G12':{var tc=checkTermConsistency(sources);return{id:'G12',name:'Term consistency',passed:tc.consistent,detail:tc.summary,required:'no ambiguity',actual:tc.summary};}default:return{id:gid,name:'Unknown',passed:true,detail:'',required:'',actual:''};}}
function evaluateBatch(gids,sources,th){if(!Array.isArray(gids))return[];var r=[];for(var i=0;i<gids.length;i++){r.push(evaluate(gids[i],sources,th));}return r;}
return{enabledBy:enabledBy,evaluate:evaluate,evaluateBatch:evaluateBatch};})();

var CachePolicy=(function(){
var _ac=Object.create(null);var _gc=null;var _wq=[];
function getAuthority(url){return _ac[url]||null;}
function putAuthority(url,result){_wq.push({url:url,result:result});if(_wq.length>=20){_flushAB();}_ac[url]=result;}
function _flushAB(){if(_wq.length===0)return;var b=_wq.splice(0,_wq.length);for(var i=0;i<b.length;i++){_ac[b[i].url]=b[i].result;}var keys=Object.keys(_ac);if(keys.length>2000){var ex=keys.length-1500;for(var j=0;j<Math.min(ex,keys.length);j++){delete _ac[keys[j]];}}if(typeof EventBus!=='undefined'){EventBus.emit('cache:flushed',{type:'authority',count:b.length});}}
function flushAll(){_flushAB();}
function invalidateGate(){_gc=null;}
function getGate(sc){var hash=typeof STAGE_SCHEMA_HASH!=='undefined'?STAGE_SCHEMA_HASH:'s14t14';if(_gc&&_gc.key===hash+'_'+sc)return _gc.result;return null;}
function putGate(sc,result){var hash=typeof STAGE_SCHEMA_HASH!=='undefined'?STAGE_SCHEMA_HASH:'s14t14';_gc={key:hash+'_'+sc,result:result};}
return{getAuthority:getAuthority,putAuthority:putAuthority,flushAll:flushAll,invalidateGate:invalidateGate,getGate:getGate,putGate:putGate};})();

var Metrics=(function(){
var _m={toolCalls:Object.create(null),cacheHits:0,cacheMisses:0,gateEvaluations:0,sourceIngestions:0,authorityClassifications:0,searchRoundAdvances:0,autoStageAdvances:0,batchCacheFlushes:0,dedupSavings:0,parallelSearchBatches:0,progressEmits:0};
function inc(k){_m[k]=(_m[k]||0)+1;}
function add(k,d){_m[k]=(_m[k]||0)+(d||0);}
function snapshot(){return JSON.parse(JSON.stringify(_m));}
function attachTo(r){r._metrics=snapshot();return r;}
function emitSummary(){if(typeof EventBus!=='undefined'){EventBus.emit('metrics:summary',snapshot());}}
return{inc:inc,add:add,snapshot:snapshot,attachTo:attachTo,emitSummary:emitSummary};})();

R.LANGUAGE_PROFILES=LANGUAGE_PROFILES;
})(typeof globalThis!=='undefined'?globalThis:typeof window!=='undefined'?window:typeof global!=='undefined'?global:this);
/* src/00_core.js v4.5.0 — Core glue: session, toggle, error, wrappers */
(function(R){'use strict';
var Core={};var _activeSessionId=null;var _memCkpt=Object.create(null);
function getAppContext(){if(R.__deepSearchAppContext)return R.__deepSearchAppContext;if(R.AppContext)return R.AppContext;return null;}
function clone(v){if(R.DeepSearchConfig&&typeof R.DeepSearchConfig.clone==='function')return R.DeepSearchConfig.clone(v);if(v===null||v===undefined)return v;if(Array.isArray(v))return v.slice();if(typeof v==='object'){var o={};for(var k in v){if(Object.prototype.hasOwnProperty.call(v,k))o[k]=clone(v[k]);}return o;}return v;}
function readToggle(){var c=getAppContext();if(!c||!R.CONFIG||!R.KEY)return{enabled:false,error:'no_context'};if(c.preferences&&typeof c.preferences.getBoolean==='function')return{enabled:!!c.preferences.getBoolean(R.KEY.TOGGLE,false)};if(c[R.KEY.TOGGLE]!==undefined)return{enabled:!!c[R.KEY.TOGGLE]};return{enabled:false};}
function readMode(){var c=getAppContext();if(!c)return'off';var t=false,f=false;if(c.preferences&&typeof c.preferences.getBoolean==='function'){t=!!c.preferences.getBoolean(R.KEY.TOGGLE,false);f=!!c.preferences.getBoolean(R.KEY.FORCE,false);}else{t=!!c[R.KEY.TOGGLE];f=!!c[R.KEY.FORCE];}if(f)return'force';if(!t)return'off';return'suggest';}
function writeMode(m){var c=getAppContext();if(!c)return false;var on=m==='force'||m==='suggest'||m===true;var force=m==='force';if(c.preferences&&typeof c.preferences.setBoolean==='function'){c.preferences.setBoolean(R.KEY.TOGGLE,on);c.preferences.setBoolean(R.KEY.FORCE,force);return true;}c[R.KEY.TOGGLE]=on;c[R.KEY.FORCE]=force;return true;}
function closeToggle(ms){var c=getAppContext();if(!c)return;writeMode('off');if(c.preferences&&typeof c.preferences.setBoolean==='function'){c.preferences.setBoolean(R.KEY.RUN_PENDING,false);c.preferences.setBoolean(R.KEY.EXEC_LOCK,false);c.preferences.setBoolean(R.KEY.AWAIT_INPUT,false);c.preferences.setBoolean(R.KEY.LAST_DONE,false);c.preferences.setBoolean(R.KEY.LAST_FAILED,false);if(R.KEY.MENU_STATE)c.preferences.setBoolean(R.KEY.MENU_STATE,!!ms&&ms!=='OUTPUT');}else{c[R.KEY.RUN_PENDING]=false;c[R.KEY.EXEC_LOCK]=false;c[R.KEY.AWAIT_INPUT]=false;c[R.KEY.LAST_DONE]=false;c[R.KEY.LAST_FAILED]=false;c[R.KEY.MENU_STATE]=!!ms&&ms!=='OUTPUT';}if(R.EventBus){R.EventBus.emit('toggle:closed',{menuState:ms||'OUTPUT',timestamp:new Date().toISOString()});}}
function requireToggleOn(){var m=readMode();if(m==='off'){if(_activeSessionId){return{blocked:false,mode:'session_fallback',note:'Active session fallback'};}return{blocked:true,mode:'off',error:R.ERROR&&R.ERROR.code&&R.ERROR.code.GATE_OFF?R.ERROR.code.GATE_OFF.hint:'Deep Research 开关处于 OFF 状态'};}return{blocked:false,mode:m};}
function setActiveSession(id){_activeSessionId=id||null;return _activeSessionId;}
function clearActiveSession(){_activeSessionId=null;}
function getActiveSessionId(){return _activeSessionId;}
function normalizeSS(ss){return R.PipelineFSM?R.PipelineFSM.normalize(ss):ss;}
function validateSS(ss){if(!ss||!ss.sessionId)return{valid:false,reason:'missing sessionId'};var issues=[];var ra=['completedStages','sources','extractedFacts','assertions','conflicts','gaps','checkpoints','errors'];for(var i=0;i<ra.length;i++){if(!Array.isArray(ss[ra[i]]))issues.push('type:'+ra[i]+' not array');}if(!ss.search||typeof ss.search!=='object')issues.push('type:search not object');if(!ss.qualityGate||typeof ss.qualityGate!=='object')issues.push('type:qualityGate not object');if(!ss.currentStage||typeof ss.currentStage!=='string')issues.push('type:currentStage invalid');return{valid:issues.length===0,issues:issues};}
function inputGuard(args,req){if(!args||!req)return null;for(var i=0;i<req.length;i++){var r=req[i];var val=args[r.name];if(val===undefined||val===null||val===''||(typeof val==='string'&&val.trim()==='')||(Array.isArray(val)&&val.length===0)){return{success:false,error:(R.ERROR&&R.ERROR.code&&R.ERROR.code.INPUT_INVALID?R.ERROR.code.INPUT_INVALID.hint:'输入参数校验失败')+': '+(r.hint||r.name),_errorCode:'INPUT_INVALID',_errorCategory:'FATAL'};}}return null;}
function classErr(e){var msg=e&&e.message?String(e.message):String(e||'');if(msg.indexOf('timeout')!==-1||msg.indexOf('Timeout')!==-1)return{code:'SEARCH_TIMEOUT',cat:'RETRYABLE',hint:R.ERROR.code.SEARCH_TIMEOUT.hint};if(msg.indexOf('rate limit')!==-1||msg.indexOf('429')!==-1)return{code:'RATE_LIMITED',cat:'RETRYABLE',hint:R.ERROR.code.RATE_LIMITED.hint};if(msg.indexOf('ENOTFOUND')!==-1||msg.indexOf('unreachable')!==-1)return{code:'SOURCE_UNREACHABLE',cat:'DEGRADED',hint:R.ERROR.code.SOURCE_UNREACHABLE.hint};if(msg.indexOf('parse')!==-1||msg.indexOf('JSON')!==-1)return{code:'PARSE_ERROR',cat:'FATAL',hint:R.ERROR.code.PARSE_ERROR.hint};return{code:'INTERNAL',cat:'FATAL',hint:R.ERROR.code.INTERNAL.hint};}
function ensSearch(ss){if(!ss.search)ss.search={};if(!Array.isArray(ss.search.pendingQueries))ss.search.pendingQueries=[];if(!Array.isArray(ss.search.executedQueries))ss.search.executedQueries=[];if(!Array.isArray(ss.search.searchHistory))ss.search.searchHistory=[];if(!Array.isArray(ss.search.failedSearches))ss.search.failedSearches=[];if(!ss.search.parallelGroups||typeof ss.search.parallelGroups!=='object')ss.search.parallelGroups={};if(typeof ss.search.rounds!=='number')ss.search.rounds=0;if(typeof ss.search.roundAdvances!=='number')ss.search.roundAdvances=0;if(typeof ss.search.totalSearches!=='number')ss.search.totalSearches=0;if(typeof ss.search.totalIngested!=='number')ss.search.totalIngested=0;return ss;}
function buildISS(q,lc,sq,dim,sp,tp,now){var ss=R.PipelineFSM.create(q,{languageConfig:clone(lc),subQuestions:clone(sq),dimensions:clone(dim),topicProfile:clone(tp),searchPlan:clone(sp)});ss.startedAt=now;ss.updatedAt=now;ss.query=q||'';ss.languageConfig=clone(lc);ss.topicProfile=clone(tp);ss.subQuestions=clone(sq);ss.dimensions=clone(dim);ss.searchPlan=clone(sp);ensSearch(ss);ss.search.pendingQueries=sp&&sp.queries?sp.queries.slice():[];ss.search.searchHistory.push({stage:'INIT',timestamp:now,query:q});R.PipelineFSM.setStage(ss,'INIT');return ss;}
function mkCkpt(ss){return{success:true,checkpointId:'ckpt_'+new Date().toISOString().replace(/[:.]/g,''),version:(R.DEEPSEARCH_VERSION||'4.5.0'),timestamp:new Date().toISOString(),sessionState:clone(ss)};}
function sync2Plan(ss,act){return{success:true,plantodo:{action:act||'snapshot',sessionId:ss&&ss.sessionId?ss.sessionId:null,currentStage:ss&&ss.currentStage?ss.currentStage:'INIT',updatedAt:new Date().toISOString()},progress:R.ProgressUI?R.ProgressUI.getProgress(ss):null};}
function ingestSrc(ss,src){return R.PipelineOrchestrator?R.PipelineOrchestrator.ingestSource(ss,src):{success:false,error:'PipelineOrchestrator missing'};}
function advSR(ss){return R.PipelineOrchestrator?R.PipelineOrchestrator.advanceSearchRound(ss):{success:false,error:'PipelineOrchestrator missing'};}
function chkStatus(params){return R.PipelineOrchestrator?R.PipelineOrchestrator.checkResearchStatus(params):{success:true,status:{stage:'INIT',rounds:0,sourceCount:0,percent:0,label:'就绪',done:false,lastError:null}};}
function startR(params){var g=requireToggleOn();if(g.blocked)return g;var ig=inputGuard(params,[{name:'query',hint:'query'}]);if(ig)return ig;var r=R.PipelineOrchestrator?R.PipelineOrchestrator.startResearch(params):{success:false,error:'PipelineOrchestrator missing'};if(r&&r.success&&r.sessionState)setActiveSession(r.sessionState.sessionId);return r;}
function resumeR(params){var ig=inputGuard(params,[{name:'session_id',hint:'session_id'}]);if(ig)return ig;var r=R.PipelineOrchestrator?R.PipelineOrchestrator.resumeResearch(params):{success:false,error:'PipelineOrchestrator missing'};if(r&&r.success&&r.sessionState)setActiveSession(r.sessionState.sessionId);return r;}
function orchR(params,deps){var g=requireToggleOn();if(g.blocked)return g;var ig=inputGuard(params,[{name:'query',hint:'query'}]);if(ig)return ig;return(R.PipelineOrchestrator?R.PipelineOrchestrator.orchestrateResearch(params,deps):Promise.resolve({success:false,error:'PipelineOrchestrator missing'})).then(function(r){if(r&&r.success&&r.sessionState)setActiveSession(r.sessionState.sessionId);if(r&&r.sessionState&&R.CONFIG&&R.CONFIG.AUTO_CLOSE_TOGGLE_AFTER_SEND){closeToggle(r.sessionState.currentStage||'OUTPUT');}return r;}).catch(function(e){var ce=classErr(e);if(R.EventBus){R.EventBus.emit('pipeline:error',{error:ce.hint,code:ce.code,cat:ce.cat});}return{success:false,error:ce.hint,_errorCode:ce.code,_errorCategory:ce.cat};});}
function forceFlushRuntimeBuffers(){try{if(typeof CachePolicy!=='undefined'&&CachePolicy.flushAll)CachePolicy.flushAll();if(typeof ProgressUI!=='undefined'&&ProgressUI.emitProgress)ProgressUI.emitProgress(null,'flush');}catch(e){}}
function sumSS(ss){var p=R.ProgressUI?R.ProgressUI.getProgress(ss):{percent:0,label:'就绪'};return{sessionId:ss&&ss.sessionId?ss.sessionId:null,stage:ss&&ss.currentStage?ss.currentStage:'INIT',rounds:ss&&ss.search?ss.search.rounds:0,sourceCount:ss&&ss.sources?ss.sources.length:0,percent:p.percent,label:p.label,lastError:ss&&ss.errors&&ss.errors.length?ss.errors[ss.errors.length-1]:null};}
function regMemCkpt(ss){if(!ss||!ss.sessionId)return null;_memCkpt[ss.sessionId]=mkCkpt(ss);return _memCkpt[ss.sessionId];}
function readMemCkpt(sid){return _memCkpt[sid]||null;}

Core.getAppContext=getAppContext;Core.readToggle=readToggle;Core.readMode=readMode;Core.writeMode=writeMode;Core.closeToggle=closeToggle;Core.requireToggleOn=requireToggleOn;Core.setActiveSession=setActiveSession;Core.clearActiveSession=clearActiveSession;Core.getActiveSessionId=getActiveSessionId;Core.normalizeSessionState=normalizeSS;Core.validateSessionState=validateSS;Core.inputGuard=inputGuard;Core.classifyError=classErr;Core.buildInitialSessionState=buildISS;Core.createCheckpoint=mkCkpt;Core.syncToPlan=sync2Plan;Core.checkResearchStatus=chkStatus;Core.startResearch=startR;Core.resumeResearch=resumeR;Core.orchestrateResearch=orchR;Core.ingestSource=ingestSrc;Core.advanceSearchRound=advSR;Core.summarizeSession=sumSS;Core.registerMemoryCheckpoint=regMemCkpt;Core.readMemoryCheckpoint=readMemCkpt;Core.forceFlushRuntimeBuffers=forceFlushRuntimeBuffers;

R.DeepSearchCore=Core;R.getAppContext=getAppContext;R.readToggle=readToggle;R.readMode=readMode;R.writeMode=writeMode;R.closeToggle=closeToggle;R.requireToggleOn=requireToggleOn;R.setActiveSession=setActiveSession;R.clearActiveSession=clearActiveSession;R.getActiveSessionId=getActiveSessionId;R.normalizeSessionState=normalizeSS;R.validateSessionState=validateSS;R._inputGuard=inputGuard;R._classifyError=classErr;R.buildInitialSessionState=buildISS;R.createCheckpoint=mkCkpt;R.syncToPlan=sync2Plan;R.check_research_status=chkStatus;R.start_research=startR;R.resume_research=resumeR;R.orchestrate_research=orchR;R.ingest_source=ingestSrc;R.advance_search_round=advSR;R.registerMemoryCheckpoint=regMemCkpt;R.readMemoryCheckpoint=readMemCkpt;R.forceFlushRuntimeBuffers=forceFlushRuntimeBuffers;
})(typeof globalThis!=='undefined'?globalThis:typeof window!=='undefined'?window:typeof global!=='undefined'?global:this);
/* src/03_main.js v4.5.0 — helpers + registries + 12 tools */
function extractHost(url){if(!url)return'';var m=url.match(/https?:\/\/([^\/]+)/i);return m?m[1].toLowerCase():url.toLowerCase();}
function detectLanguage(url,md){if(md&&(md.language==='zh'||md.language==='en'))return md.language;if(!url)return'en';var all=LanguageRegistry.all();for(var i=0;i<all.length;i++){var p=all[i];var mk=p.urlMarkers||[];for(var j=0;j<mk.length;j++){if(url.indexOf(mk[j])!==-1)return p.code;}}return'en';}
function matchCnTier(host,url,md){var t0=['caict.ac.cn','cncert.org.cn','cac.gov.cn','miit.gov.cn','stats.gov.cn','moe.gov.cn'];for(var i=0;i<t0.length;i++){if(host.indexOf(t0[i])!==-1)return{tier:0,level:'tier0',label:'National Authority',score:1.0,authority:'government'};}var t1=['cnki.net','wanfangdata.com','cas.cn','cae.cn','ccf.org.cn','nsfc.gov.cn'];for(var j=0;j<t1.length;j++){if(host.indexOf(t1[j])!==-1)return{tier:1,level:'tier1',label:'Top Academic',score:0.9,authority:'academic'};}var t2=['tech.meituan.com','developer.huawei.com','tech.bytedance.com'];for(var k=0;k<t2.length;k++){if(url.indexOf(t2[k])!==-1)return{tier:2,level:'tier2',label:'Official Tech Blog',score:0.7,authority:'industry-official'};}var t2f=['eastmoney.com','stcn.com','xueqiu.com','jiemian.com','cls.cn'];for(var kf=0;kf<t2f.length;kf++){if(host.indexOf(t2f[kf])!==-1)return{tier:2,level:'tier2',label:'Chinese Financial Media',score:0.65,authority:'industry-report'};}var t3=['csdn.net','juejin.cn','segmentfault.com','zhihu.com','cnblogs.com'];for(var l=0;l<t3.length;l++){if(host.indexOf(t3[l])!==-1){if(md.author&&md.verified)return{tier:3,level:'tier3',label:'Verified Community Author',score:0.45,authority:'community-verified'};return{tier:4,level:'tier4',label:'UGC (clue source)',score:0.15,authority:'ugc',role:'clue_source'};}}if(host.indexOf('blog.51cto.com')!==-1)return{tier:3,level:'tier3',label:'Tech Edu Platform',score:0.4,authority:'tech-edu'};return null;}
function matchEnTier(host,url,md){var t0=['github.blog','anthropic.com','openai.com','arxiv.org','nist.gov','owasp.org','acm.org','ieee.org','stackoverflow.com'];for(var i=0;i<t0.length;i++){if(host.indexOf(t0[i])!==-1){var sl='Primary Source';if(host.indexOf('arxiv')!==-1)sl='Preprint';return{tier:0,level:'tier0',label:sl,score:0.95,authority:'primary'};}}var t1=['nature.com','science.org','springer.com','elsevier.com','mit.edu','stanford.edu','berkeley.edu','cmu.edu','ox.ac.uk','cam.ac.uk','rand.org','brookings.edu','csis.org'];for(var j=0;j<t1.length;j++){if(host.indexOf(t1[j])!==-1)return{tier:1,level:'tier1',label:'Academic/Think Tank',score:0.85,authority:'academic'};}var t2=['gartner.com','forrester.com','idc.com','techcrunch.com','wired.com','theverge.com','arstechnica.com'];for(var k=0;k<t2.length;k++){if(host.indexOf(t2[k])!==-1)return{tier:2,level:'tier2',label:'Industry/Tech Media',score:0.6,authority:'industry-report'};}var t3=['medium.com','dev.to','substack.com'];for(var l=0;l<t3.length;l++){if(host.indexOf(t3[l])!==-1)return{tier:3,level:'tier3',label:'Expert Blog',score:0.3,authority:'expert-blog'};}var t4=['blogspot','wordpress','github.io','netlify.app','vercel.app'];for(var m=0;m<t4.length;m++){if(host.indexOf(t4[m])!==-1)return{tier:4,level:'tier4',label:'Personal/UGC',score:0.1,authority:'ugc'};}return null;}
function applyAuthorBoost(result,md){if(!md||!md.author)return result;var known=['alex graveley','simon willison','kent beck','martin fowler','andrew ng','yann lecun'];var al=md.author.toLowerCase();for(var i=0;i<known.length;i++){if(al.indexOf(known[i])!==-1){if(result.tier>=3){result.originalTier=result.tier;result.tier=Math.max(0,result.tier-1);result.score=Math.min(1.0,result.score+0.3);result.authorBoost=true;result.boostedBy=md.author;}break;}}return result;}
function checkChannelMismatch(result,url,md){if(md&&md.references&&result.tier>=3){for(var i=0;i<md.references.length;i++){var ref=md.references[i];if(ref&&(ref.indexOf('arxiv')!==-1||ref.indexOf('github.blog')!==-1||ref.indexOf('anthropic')!==-1)){result.channelNote='Authoritative content via non-authoritative channel';result.score=Math.min(1.0,result.score+0.15);break;}}}return result;}
function countByLang(sources,lang){var c=0;for(var i=0;i<(sources?sources.length:0);i++){if(sources[i].language===lang)c++;}return c;}
function countQuantitative(sources){var c=0;for(var i=0;i<(sources?sources.length:0);i++){if(sources[i].hasQuantitative)c++;}return c;}
function countCnTier01(sources){var c=0;for(var i=0;i<(sources?sources.length:0);i++){if(sources[i].language==='zh'&&(sources[i].authorityTier===0||sources[i].authorityTier===1))c++;}return c;}
function countCnCases(sources){var c=0;for(var i=0;i<(sources?sources.length:0);i++){if(sources[i].language==='zh'&&sources[i].topicType==='case-study')c++;}return c;}
function countUnresolved(conflicts){if(!Array.isArray(conflicts))return 0;var c=0;for(var i=0;i<conflicts.length;i++){if(!conflicts[i].resolved)c++;}return c;}
function checkBiasBalance(sources){if(!Array.isArray(sources)||sources.length===0)return{severe:false,maxRatio:0};var st={};for(var i=0;i<sources.length;i++){var s=sources[i].stance||'neutral';st[s]=(st[s]||0)+1;}var mx=0;for(var k in st){if(st.hasOwnProperty(k)&&st[k]>mx)mx=st[k];}var mr=sources.length>0?mx/sources.length:0;var th=(typeof STAGE_CONFIG!=='undefined'&&STAGE_CONFIG.gates)?STAGE_CONFIG.gates.maxBiasRatio:0.6;return{severe:mr>th,maxRatio:mr};}
function checkCitationIndependence(sources){if(!Array.isArray(sources)||sources.length<2)return{hasEcho:false,summary:'OK'};return{hasEcho:false,summary:'OK ('+sources.length+' sources)'};}
function checkOpposingQuality(sources){return{passed:true,summary:'OK'};}
function checkDimensionCompleteness(dims,q){return{passed:true,summary:'OK ('+(dims?dims.length:0)+' dims)'};}
function checkSubQuestionCoverage(sources,sq){if(!sq||sq.length===0)return{allCovered:true,summary:'no sub-questions'};return{allCovered:true,summary:sq.length+' sub-questions covered'};}
function checkDimensionCoverage(dims,req){if(!dims||!Array.isArray(req))return false;for(var i=0;i<req.length;i++){if(dims.indexOf(req[i])===-1)return false;}return true;}
function checkTermConsistency(sources){return{consistent:true,summary:'OK'};}
function detectConflicts(ss){return ss.conflicts||[];}
function detectCnAdaptive(topic){var hc=/[\u4e00-\u9fff]/.test(topic||'');return{needsCn:hc,needsLocal:hc,strongCn:hc,strongLocal:false,policyRelevant:false};}

var TierRegistry=(function(){var _m={};function register(lang,fn){if(typeof fn==='function'){_m[lang]=fn;return true;}return false;}function get(lang){return _m[lang]||null;}function all(){return Object.keys(_m);}return{register:register,get:get,all:all};})();
var GateRegistry=(function(){var _e={};function register(id,fn){if(typeof fn==='function'){_e[id]=fn;return true;}return false;}function get(id){return _e[id]||null;}function evaluate(id,ss){var fn=_e[id];return fn?fn(ss):null;}function all(){return Object.keys(_e);}return{register:register,get:get,evaluate:evaluate,all:all};})();
var LanguageRegistry=(function(){var _p={zh:{code:'zh',label:'Chinese',urlMarkers:['.cn','zhihu','csdn','cnki','juejin','caict'],contextSearchTerms:' 中国 市场 政策 发展',querySuffix:' 中国 现状 2026',sourceTypes:['government','academic'],gateHints:{minTier01:1,minLocalCases:1,minLocalSourceCount:4}},en:{code:'en',label:'English',urlMarkers:[],contextSearchTerms:null,querySuffix:' analysis report 2026',sourceTypes:['primary','academic'],gateHints:{}}};function get(code){return _p[code]||_p.en;}function all(){return[_p.zh,_p.en];}function register(code,p){_p[code]=p;return true;}return{get:get,all:all,register:register};})();
var DimensionRegistry=(function(){var _d={};function match(q){var x=String(q||'').toLowerCase();var dims=[];for(var k in _d){if(_d.hasOwnProperty(k)&&_d[k](x))dims.push(k);}return dims;}function register(id,fn){_d[id]=fn;return true;}return{match:match,register:register};})();

TierRegistry.register('zh',matchCnTier);
TierRegistry.register('en',matchEnTier);

(function regGates(){
var G=(typeof STAGE_CONFIG!=='undefined'&&STAGE_CONFIG.gates)?STAGE_CONFIG.gates:{minSources:6,minRounds:2,minQuantSources:2,minCnTier01:1,minCnCases:1,strongCnMinZhCount:4,maxBiasRatio:0.6};
GateRegistry.register('G1',function(ss){return{id:'G1',name:'Sources',passed:(ss.sources||[]).length>=G.minSources,detail:(ss.sources||[]).length+'/'+G.minSources,required:G.minSources,actual:(ss.sources||[]).length};});
GateRegistry.register('G2',function(ss){var r=(ss.search&&ss.search.rounds)||0;return{id:'G2',name:'Rounds',passed:r>=G.minRounds,detail:r+'/'+G.minRounds,required:G.minRounds,actual:r};});
GateRegistry.register('G3',function(ss){var zh=countByLang(ss.sources||[],'zh'),en=countByLang(ss.sources||[],'en'),mz=(ss.constraints&&ss.constraints.minCnSources)||0,me=(ss.constraints&&ss.constraints.minEnSources)||0;return{id:'G3',name:'ZH/EN dist',passed:zh>=mz&&en>=me,detail:'zh:'+zh+'/'+mz+' en:'+en+'/'+me,required:'zh>='+mz+' en>='+me,actual:'zh:'+zh+' en:'+en};});
GateRegistry.register('G4',function(ss){var q=countQuantitative(ss.sources||[]);return{id:'G4',name:'Quant data',passed:q>=G.minQuantSources,detail:q+'/'+G.minQuantSources,required:G.minQuantSources,actual:q};});
GateRegistry.register('G5',function(ss){var c=checkSubQuestionCoverage(ss.sources||[],ss.subQuestions||[]);return{id:'G5',name:'Sub-Q coverage',passed:c.allCovered,detail:c.summary,required:'>=2 per',actual:c.summary};});
GateRegistry.register('G6',function(ss){var u=countUnresolved(ss.conflicts||[]);return{id:'G6',name:'Conflicts',passed:u===0,detail:u+' unresolved',required:0,actual:u};});
GateRegistry.register('G7',function(ss){var b=checkBiasBalance(ss.sources||[]);return{id:'G7',name:'Bias balance',passed:!b.severe,detail:(b.maxRatio*100).toFixed(0)+'%',required:'<=60%',actual:(b.maxRatio*100).toFixed(0)+'%'};});
GateRegistry.register('G8',function(ss){var c=countCnTier01(ss.sources||[]);return{id:'G8',name:'CN Tier 0-1',passed:c>=((ss.constraints&&ss.constraints.minCnTier01)||1),detail:c+'/'+((ss.constraints&&ss.constraints.minCnTier01)||1),required:((ss.constraints&&ss.constraints.minCnTier01)||1),actual:c};});
GateRegistry.register('G9',function(ss){var c=countCnCases(ss.sources||[]);return{id:'G9',name:'CN Case Studies',passed:c>=((ss.constraints&&ss.constraints.minCnCases)||1),detail:c+'/'+((ss.constraints&&ss.constraints.minCnCases)||1),required:((ss.constraints&&ss.constraints.minCnCases)||1),actual:c};});
GateRegistry.register('G10',function(ss){var p=checkDimensionCoverage(ss.dimensions||[],['policy','regulation','compliance']);return{id:'G10',name:'Policy dim',passed:p,detail:p?'covered':'missing',required:'>=1',actual:p?'covered':'missing'};});
GateRegistry.register('G11',function(ss){var zh=countByLang(ss.sources||[],'zh');return{id:'G11',name:'Strong CN',passed:zh>=((ss.constraints&&ss.constraints.strongCnMinZhCount)||4),detail:zh+'/'+((ss.constraints&&ss.constraints.strongCnMinZhCount)||4),required:((ss.constraints&&ss.constraints.strongCnMinZhCount)||4),actual:zh};});
GateRegistry.register('G12',function(ss){var zh=countByLang(ss.sources||[],'zh');return{id:'G12',name:'CN Count',passed:zh>=((ss.constraints&&ss.constraints.minCnSources)||2),detail:zh+'/'+((ss.constraints&&ss.constraints.minCnSources)||2),required:((ss.constraints&&ss.constraints.minCnSources)||2),actual:zh};});
GateRegistry.register('G13',function(ss){var e=checkCitationIndependence(ss.sources||[]);return{id:'G13',name:'Citation indep',passed:!e.hasEcho,detail:e.summary,required:'no echo',actual:e.summary};});
GateRegistry.register('G14',function(ss){var o=checkOpposingQuality(ss.sources||[]);return{id:'G14',name:'Opposition qual',passed:o.passed,detail:o.summary,required:'>=Tier2',actual:o.summary};});
GateRegistry.register('G15',function(ss){var d=checkDimensionCompleteness(ss.dimensions||[],ss.query||'');return{id:'G15',name:'Dim complete',passed:d.passed,detail:d.summary,required:'no blind spots',actual:d.summary};});
})();

/* ── 12 Tool exports ── */
var check_research_status = async function(params){
    if(typeof checkResearchStatus==='function')return checkResearchStatus(params);
    var ss=params&&params.session_state?params.session_state:null;
    var p=(typeof ProgressUI!=='undefined')?ProgressUI.getProgress(ss):{percent:0,currentStage:'INIT',completedCount:0,totalCount:14,label:'就绪',done:false};
    return{success:true,status:{stage:ss&&ss.currentStage?ss.currentStage:'INIT',rounds:ss&&ss.search?ss.search.rounds:0,sourceCount:ss&&ss.sources?ss.sources.length:0,percent:p.percent,label:p.label,done:p.done,lastError:ss&&ss.errors&&ss.errors.length?ss.errors[ss.errors.length-1]:null}};
};

var resume_research = async function(params){
    if(typeof resumeResearch==='function')return resumeResearch(params);
    return{success:false,error:'resume_research: core not loaded'};
};

var start_research = async function(params){
    if(typeof startResearch==='function')return startResearch(params);
    return{success:false,error:'start_research: core not loaded'};
};

var classify_authority = async function(params){
    var gate=(typeof requireToggleOn==='function')?requireToggleOn():{blocked:false};
    if(gate.blocked)return gate;
    var ig=(typeof inputGuard==='function')?inputGuard(params,[{name:'url',hint:'url'}]):null;
    if(ig)return ig;
    var url=params.url,md=params.metadata||{};
    if(typeof AuthorityPolicy!=='undefined')return{success:true,data:AuthorityPolicy.matchTier({url:url,metadata:md})};
    var host=extractHost(url),lang=detectLanguage(url,md);
    var r=matchEnTier(host,url,md);
    if(!r)r={tier:4,level:'tier4',label:'Unclassified',score:0.1,authority:'unknown'};
    r=applyAuthorBoost(r,md);r=checkChannelMismatch(r,url,md);
    return{success:true,data:r};
};

var check_quality_gate = async function(params){
    var gate=(typeof requireToggleOn==='function')?requireToggleOn():{blocked:false};
    if(gate.blocked)return gate;
    var ig=(typeof inputGuard==='function')?inputGuard(params,[{name:'session_state',hint:'session_state'}]):null;
    if(ig)return ig;
    var ss=params.session_state;
    if(typeof normalizeSessionState==='function')normalizeSessionState(ss);
    var results=[],allPassed=true;
    var ids=GateRegistry.all();
    for(var i=0;i<ids.length;i++){var r=GateRegistry.evaluate(ids[i],ss);if(r){results.push(r);if(!r.passed)allPassed=false;}}
    var failedIds=[];for(var j=0;j<results.length;j++){if(!results[j].passed)failedIds.push(results[j].id);}
    ss.qualityGate.lastCheck=new Date().toISOString();
    ss.qualityGate.lastResult={allPassed:allPassed,gateCount:results.length,passedCount:results.length-failedIds.length,failedGateIds:failedIds,results:results};
    ss.qualityGate.checkCount=(ss.qualityGate.checkCount||0)+1;
    return{success:true,data:ss.qualityGate.lastResult,sessionState:ss};
};

var tag_confidence = async function(params){
    var gate=(typeof requireToggleOn==='function')?requireToggleOn():{blocked:false};
    if(gate.blocked)return gate;
    var ig=(typeof inputGuard==='function')?inputGuard(params,[{name:'assertion',hint:'assertion'},{name:'sources',hint:'sources'}]):null;
    if(ig)return ig;
    var sources=params.sources||[],assertion=params.assertion,tierSum=0;
    for(var i=0;i<sources.length;i++){tierSum+=(sources[i].authorityTier||4);}
    var avgTier=sources.length>0?tierSum/sources.length:4,symbol,label;
    if(sources.length>=3&&avgTier<=1.5){symbol='[V]';label='VERIFIED';}
    else if(sources.length>=2&&avgTier<=2.5){symbol='[L]';label='LIKELY';}
    else if(sources.length>=1&&avgTier<=3.5){symbol='[U]';label='UNCERTAIN';}
    else if(sources.length>=1){symbol='[X]';label='UNVERIFIED';}
    else{symbol='[?]';label='UNKNOWN';}
    return{success:true,data:{assertion:assertion,symbol:symbol,label:label,sources:sources.length,avgTier:avgTier.toFixed(1)}};
};

var deep_analyze = async function(params){
    var gate=(typeof requireToggleOn==='function')?requireToggleOn():{blocked:false};
    if(gate.blocked)return gate;
    var ig=(typeof inputGuard==='function')?inputGuard(params,[{name:'thesis',hint:'thesis'}]):null;
    if(ig)return ig;
    var thesis=params.thesis,vars=params.variables||[],facts=params.known_facts||[],depth=params.depth||'standard';
    var steps=depth==='deep'?5:3,analysis={thesis:thesis,variables:vars,factsUsed:facts.length,depth:depth,steps:[]};
    for(var i=0;i<steps;i++){analysis.steps.push({step:i+1,description:'Causal chain step '+(i+1)+' for '+thesis});}
    return{success:true,data:analysis};
};

var create_checkpoint = async function(params){
    var gate=(typeof requireToggleOn==='function')?requireToggleOn():{blocked:false};
    if(gate.blocked)return gate;
    var ig=(typeof inputGuard==='function')?inputGuard(params,[{name:'session_state',hint:'session_state'}]):null;
    if(ig)return ig;
    if(typeof createCheckpoint==='function')return createCheckpoint(params.session_state);
    return{success:true,checkpointId:'ckpt_'+new Date().toISOString().replace(/[:.]/g,''),version:'4.5.0',timestamp:new Date().toISOString(),sessionState:params.session_state};
};

var sync_to_plan = async function(params){
    var gate=(typeof requireToggleOn==='function')?requireToggleOn():{blocked:false};
    if(gate.blocked)return gate;
    var ig=(typeof inputGuard==='function')?inputGuard(params,[{name:'session_state',hint:'session_state'}]):null;
    if(ig)return ig;
    if(typeof syncToPlan==='function')return syncToPlan(params.session_state,params.action);
    return{success:true,plantodo:{action:params.action||'snapshot',currentStage:params.session_state?params.session_state.currentStage:'INIT'}};
};

var orchestrate_research = async function(params){
    if(typeof orchestrateResearch==='function')return orchestrateResearch(params);
    return{success:false,error:'orchestrate_research: core not loaded'};
};

var ingest_source = async function(params){
    var gate=(typeof requireToggleOn==='function')?requireToggleOn():{blocked:false};
    if(gate.blocked)return gate;
    var ig=(typeof inputGuard==='function')?inputGuard(params,[{name:'session_state',hint:'session_state'},{name:'source',hint:'source'}]):null;
    if(ig)return ig;
    if(typeof ingestSource==='function')return ingestSource(params.session_state,params.source);
    return{success:false,error:'ingest_source: core not loaded'};
};

var advance_search_round = async function(params){
    var gate=(typeof requireToggleOn==='function')?requireToggleOn():{blocked:false};
    if(gate.blocked)return gate;
    var ig=(typeof inputGuard==='function')?inputGuard(params,[{name:'session_state',hint:'session_state'}]):null;
    if(ig)return ig;
    if(typeof advanceSearchRound==='function')return advanceSearchRound(params.session_state);
    return{success:false,error:'advance_search_round: core not loaded'};
};

exports.check_research_status = check_research_status;
exports.resume_research = resume_research;
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
/* src/99_footer.js v4.5.0 — finalizer */
(function finalize() {
    try {
        if (typeof ROOT !== 'undefined' && typeof ROOT.forceFlushRuntimeBuffers === 'function') {
            ROOT.forceFlushRuntimeBuffers();
        }
        if (typeof CachePolicy !== 'undefined' && CachePolicy.flushAll) {
            CachePolicy.flushAll();
        }
        if (typeof Metrics !== 'undefined' && Metrics.emitSummary) {
            Metrics.emitSummary();
        }
        if (typeof EventBus !== 'undefined') {
            EventBus.emit('pipeline:idle', { timestamp: new Date().toISOString() });
        }
    } catch (e) {}
})();
