# 贡献指南

感谢您对项目的贡献！在提交代码之前，请遵循以下指南。

## 开发流程

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 代码规范

### TypeScript

- 严格禁止使用 `any` 类型
- 避免使用 `as` 类型断言（除非从 `unknown` 类型收窄）
- 优先使用类型推断和类型守卫

### 代码风格

- 使用 2 空格缩进
- 使用单引号
- 行尾不要有空格
- 文件末尾要有空行

### 提交信息

- 使用中文描述
- 格式：`<类型>: <描述>`
- 类型：feat, fix, docs, style, refactor, test, chore

示例：
```
feat: 添加位置选择功能
fix: 修复GPS定位失败问题
docs: 更新README文档
```

## 测试要求

- 所有新功能必须包含测试用例
- 测试覆盖率必须≥95%
- 运行 `yarn test:coverage` 确保通过

## Pull Request 检查清单

- [ ] 代码通过 ESLint 检查
- [ ] 代码通过 TypeScript 类型检查
- [ ] 所有测试通过
- [ ] 测试覆盖率≥95%
- [ ] 更新了相关文档
- [ ] 提交信息符合规范

