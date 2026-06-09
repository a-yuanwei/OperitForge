# DeepResearch Agent 发布规范

## 唯一发布入口

```bash
bash release.sh              # 全流程发布
bash release.sh --skip-regression  # 跳过回归（紧急修复）
```

## 发布流程（A-G）

```
A. Precheck   → 文件/版本/Hook 检查，失败即中止
B. Build      → 源码合并 + 版本注入 + 构建摘要
C. Lint/Syntax→ V1-V5 五道门禁，语法/括号/工具数/KEY 一致性
D. Regression → 回归测试集（4项静态 + AI 全链）
E. Package    → 唯一发布包 zip + build-report.json
F. Release    → 部署到平台 + 记录版本
G. Smoke Test → 发布后验收，失败触发自动回滚
```

## 版本规则

- 格式：`vX.Y.Z`（语义化版本）
- 每次发布必须更新：`manifest.json` 版本号 + `CHANGELOG.md`
- 发布标签：`v{VERSION}_{TIMESTAMP}`
- 保留上一版本包在 `releases/` 目录

## 文件交付清单

每次发布至少包含：

```
releases/v{VERSION}_{TIMESTAMP}.zip
  ├── deep_research_agent_v3_4.js  (dist)
  ├── main.js
  ├── manifest.json
  ├── src/ (全量源码)
  ├── build.sh / release.sh
  ├── build/build-report.json
  └── build/regression/regression-report.json
```

## 门禁规则

### 必过门禁

- [ ] 所有源文件存在
- [ ] manifest.json 版本号合法
- [ ] node --check 语法通过
- [ ] 括号平衡（{ = }）
- [ ] 12 工具全部注册
- [ ] 7 个 KEY 常量一致
- [ ] 5 个 Hook 注册
- [ ] 空查询返回 INPUT_INVALID
- [ ] 无 sessionId 返回 NO_SESSION
- [ ] 发布包存在
- [ ] smoke test 3/3 通过

### 回滚触发条件

出现以下任一情况自动回滚：

- build.sh 运行失败
- 语法检查失败
- 回归测试中任一项 FAIL
- smoke test 低于 3/3

## 已知缺陷基线

| ID | 严重度 | 类型 | 描述 | 状态 |
|----|--------|------|------|------|
| D5 | MEDIUM | design_boundary | classify_authority 分类数据库未初始化 | 不阻塞 |
