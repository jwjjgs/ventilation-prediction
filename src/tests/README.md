# 测试说明

## 测试覆盖率要求

项目要求测试覆盖率达到95%以上，包括：
- 语句覆盖率（statements）: ≥95%
- 分支覆盖率（branches）: ≥95%
- 函数覆盖率（functions）: ≥95%
- 行覆盖率（lines）: ≥95%

## 运行测试

```bash
# 运行所有测试
yarn test

# 运行测试并生成覆盖率报告
yarn test:coverage

# 监听模式运行测试
yarn test:watch

# CI环境运行测试
yarn test:ci
```

## 查看覆盖率报告

运行 `yarn test:coverage` 后，覆盖率报告会生成在：
- HTML报告: `coverage/lcov-report/index.html`
- LCOV报告: `coverage/lcov.info`
- JSON摘要: `coverage/coverage-summary.json`

## 测试文件结构

```
src/
  ├── utils/
  │   └── __tests__/
  │       ├── CalcUtil.test.ts
  │       └── storage.test.ts
  ├── services/
  │   └── __tests__/
  │       ├── locationService.test.ts
  │       └── weatherApi.test.ts
  ├── components/
  │   └── __tests__/
  │       ├── GrainTypeSelector.test.tsx
  │       ├── LocationPrompt.test.tsx
  │       └── WeatherChart.test.tsx
  └── screens/
      └── __tests__/
          ├── MainScreen.test.tsx
          └── SettingsScreen.test.tsx
```

## 测试最佳实践

1. **单元测试**: 每个工具函数和服务都应该有对应的测试用例
2. **集成测试**: 测试组件之间的交互
3. **边界测试**: 测试边界值和异常情况
4. **Mock使用**: 使用Mock避免真实的外部依赖（GPS、网络、存储等）
5. **覆盖率**: 确保所有关键路径都有测试覆盖

