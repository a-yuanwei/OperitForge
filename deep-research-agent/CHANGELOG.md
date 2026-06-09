# DeepResearch Agent Changelog

## [4.4.2] — 2026-06-07

### Added
- P0: SESSION_SCHEMA + normalizeSessionState + validateSessionState
- P0: STAGE_REGISTRY (14 stages, exit/fallback as functions)
- P0: migrateCheckpoint (versioned, non-destructive)
- P0: STAGE_SCHEMA_HASH for cache binding
- P1: Structured telemetry log in _wrapTool
- P1: gateSummary (inputGate/processGate/outputGate)
- P1: CALL_CONTRACT_BROKEN warning (sessionId-only calls)
- P2: BUILD_ASSERT_V4 (node --check) + V5 (brace balance)
- release.sh: A-G 7-stage delivery pipeline
- RELEASE_GUIDE.md + CHANGELOG.md

### Fixed
- D1: _makeSuggestNext ghost reference THESIS_SYNTHESIS → THESIS_BUILD
- D6-D8: _wrapTool sessionState injection (state accumulation)
- Menu toggle: plan_mode return format alignment (null on toggle, {toggles} on create)
- Menu toggle: OFF + runPending anomaly branch added
- Menu toggle: lastDone/lastFailed checked outside OFF branch
- _inputGuard: sessionId acceptance as session_state alternative
- resume_research: migrateCheckpoint call before restore

### Changed
- STAGE_CONFIG now generated from STAGE_REGISTRY (single source of truth)
- Menutoggle return format aligned with plan_mode (null on toggle, {toggles} without ok in create)
- Cache key: gate_v{SCHENA_HASH}_{sourceCount}_{stage}

### Known Issues
- (Resolved in v4.5.2) D5: classify_authority classification DB — unified inline AUTHORITY_DOMAIN_DB object replaces all hardcoded domain arrays and removes external file path dependency.

## [4.4.1] — 2026-06-06

### Fixed
- GatePolicy.enabledBy / resume_research toggle gate
- Redundant JSON.parse in resume_research

## [4.4.0] — 2026-06-05

### Added
- Industrial _wrapTool implementation
- V1/V2/V3 build assertions
- 12-tool pipeline complete

### Notes
- Baseline for all subsequent P0/P1/P2 work

---

## 变更记录模板

### [版本号]
- 发布日期：
- 发布负责人：
- 构建号：
- 变更范围：
- 影响模块：
- 风险等级：

#### Added
- 

#### Changed
- 

#### Fixed
- 

#### Removed
- 

#### Regression
- 通过项：
- 失败项：
- 已知边界：

#### Release Artifacts
- `dist/`：
- `build/build-report.json`：
- `build/regression/regression-report.json`：
- `releases/`：

#### Rollback Plan
- 回滚条件：
- 回滚方式：
- 回滚验证：