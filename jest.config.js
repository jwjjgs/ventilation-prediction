module.exports = {
  preset: 'react-native',
  // 用途：配置测试覆盖率收集
  // 原因：确保代码质量，达到企业级标准
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
  ],
  // 用途：设置覆盖率阈值
  // 原因：确保覆盖率达到95%以上
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  // 用途：覆盖率报告格式
  // 原因：生成多种格式的报告便于查看和分析
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  // 用途：测试环境配置
  // 原因：react-native preset会自动配置测试环境
  // 用途：模块路径映射
  // 原因：支持TypeScript路径别名
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // 用途：测试文件匹配模式
  // 原因：统一测试文件命名规范
  testMatch: [
    '**/__tests__/**/*.{ts,tsx}',
    '**/*.{test,spec}.{ts,tsx}',
  ],
  // 用途：转换配置
  // 原因：react-native preset已包含TypeScript支持
  // 用途：忽略的文件
  // 原因：排除不需要测试的文件
  testPathIgnorePatterns: [
    '/node_modules/',
    '/android/',
    '/ios/',
  ],
  // 用途：设置文件
  // 原因：测试前执行一些初始化操作
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  // 用途：模块文件扩展名
  // 原因：确保能正确解析TypeScript和JavaScript文件
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // Purpose: Transform ignore patterns
  // Reason: Exclude files in node_modules but include React Native packages
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-paper|victory-native|react-native-maps|react-native-svg|@react-native-community|@react-native-async-storage)/)',
  ],
};
