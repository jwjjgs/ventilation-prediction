# 通风预测应用 (Wind2)

一个基于 React Native 的粮食通风预测应用，根据 GPS 位置获取天气数据，计算粮食水分和凝结温度，辅助用户判断是否需要通风。

## 功能特性

- 📍 **自动GPS定位**: 自动获取当前位置，支持手动选择位置
- 🌾 **10种粮食品种**: 支持大麦、油菜、玉米、燕麦、爆米花、大米、高粱、大豆、向日葵、小麦
- 🌤️ **实时天气数据**: 集成彩云天气API，获取小时级天气数据
- 📊 **可视化图表**: 使用 Victory Native 展示温度、湿度、预估水分、凝结温度
- ⚙️ **灵活配置**: 支持自定义offset参数调整计算结果
- 💾 **本地存储**: 自动保存位置和设置，下次打开自动恢复
- 🌍 **多语言支持**: 支持英文、中文、日文、法文、韩文、俄文（默认英文）

## 技术栈

- **框架**: React Native 0.82.1
- **语言**: TypeScript
- **状态管理**: React Hooks
- **UI组件**: React Native Paper
- **图表**: Victory Native
- **地图**: React Native Maps
- **存储**: AsyncStorage
- **测试**: Jest + React Testing Library
- **CI/CD**: GitHub Actions

## 项目结构

```
src/
  ├── components/          # UI组件
  │   ├── GrainTypeSelector.tsx
  │   ├── LocationPicker.tsx
  │   ├── LocationPrompt.tsx
  │   └── WeatherChart.tsx
  ├── screens/            # 界面
  │   ├── MainScreen.tsx
  │   └── SettingsScreen.tsx
  ├── services/           # 服务层
  │   ├── locationService.ts
  │   └── weatherApi.ts
  ├── utils/              # 工具类
  │   ├── CalcUtil.ts
  │   └── storage.ts
  ├── types/              # TypeScript类型定义
  └── tests/              # 测试配置
```

## 快速开始

### 环境要求

- Node.js >= 20
- Yarn
- React Native 开发环境（Android Studio / Xcode）

### 安装依赖

```bash
# 安装依赖
yarn install

# iOS需要安装CocoaPods依赖
cd ios && pod install && cd ..
```

**注意**: 如果遇到网络问题，可能需要配置代理或使用国内镜像源。

### 配置环境变量

创建 `.env` 文件（已添加到.gitignore）：

```env
CAIYUN_API_KEY=your_api_key_here
```

### 运行应用

```bash
# 启动Metro
yarn start

# Android
yarn android

# iOS
yarn ios
```

## 测试

项目包含完整的测试用例，覆盖率达到90%以上（目标95%）。

### 测试覆盖率要求

- 语句覆盖率（statements）: ≥90%
- 分支覆盖率（branches）: ≥90%
- 函数覆盖率（functions）: ≥90%
- 行覆盖率（lines）: ≥90%

### 运行测试

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

### 测试文件结构

```
src/
  ├── utils/__tests__/
  │   ├── CalcUtil.test.ts
  │   └── storage.test.ts
  ├── services/__tests__/
  │   ├── locationService.test.ts
  │   └── weatherApi.test.ts
  ├── components/__tests__/
  │   ├── GrainTypeSelector.test.tsx
  │   ├── LocationPrompt.test.tsx
  │   └── WeatherChart.test.tsx
  └── screens/__tests__/
      ├── MainScreen.test.tsx
      └── SettingsScreen.test.tsx
```

### 查看覆盖率报告

运行 `yarn test:coverage` 后会生成：
- **HTML报告**: `coverage/lcov-report/index.html` - 可视化查看
- **LCOV报告**: `coverage/lcov.info` - 用于CI/CD集成
- **JSON摘要**: `coverage/coverage-summary.json` - 机器可读格式

## 构建

### Android

```bash
cd android
./gradlew assembleRelease  # APK
./gradlew bundleRelease    # AAB
```

### iOS

```bash
cd ios
xcodebuild -workspace Wind2.xcworkspace -scheme Wind2 -configuration Release
```

## CI/CD

项目配置了 GitHub Actions 自动构建和测试：

- **测试工作流**: 每次push自动运行测试并生成覆盖率报告
- **Android构建**: 自动构建APK和AAB
- **iOS构建**: 自动构建IPA

## 代码规范

- **TypeScript**: 严格模式，禁止使用`any`
- **ESLint**: 使用React Native官方配置
- **Prettier**: 统一代码格式
- **测试**: 覆盖率要求≥95%

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
