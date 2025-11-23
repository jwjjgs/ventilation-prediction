// 用途：测试环境初始化配置
// 原因：统一配置测试环境，模拟React Native环境

// 用途：模拟AsyncStorage
// 原因：测试中不需要真实的本地存储
jest.mock('@react-native-async-storage/async-storage', () => {
  try {
    return require('@react-native-async-storage/async-storage/jest/async-storage-mock');
  } catch {
    // 如果jest mock不存在，使用简单的mock实现
    return {
      getItem: jest.fn(() => Promise.resolve(null)),
      setItem: jest.fn(() => Promise.resolve()),
      removeItem: jest.fn(() => Promise.resolve()),
      clear: jest.fn(() => Promise.resolve()),
    };
  }
});

// 用途：模拟react-native-config
// 原因：测试中使用模拟的环境变量
jest.mock('react-native-config', () => ({
  CAIYUN_API_KEY: 'test_api_key',
}));

// 用途：模拟Geolocation
// 原因：测试中不需要真实的GPS定位
jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn((success) =>
    success({
      coords: {
        latitude: 39.976,
        longitude: 116.3176,
        altitude: null,
        accuracy: 10,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    }),
  ),
}));

// 用途：模拟react-native-maps
// 原因：测试中不需要真实的地图组件
jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: React.forwardRef((props: Record<string, unknown>, ref: unknown) =>
      React.createElement(View, { testID: 'mock-map', ...props, ref }),
    ),
    Marker: (props: Record<string, unknown>) =>
      React.createElement(View, { testID: 'mock-marker', ...props }),
    PROVIDER_GOOGLE: 'google',
  };
});

// 用途：模拟victory-native
// 原因：测试中不需要渲染真实的图表
jest.mock('victory-native', () => {
  const React = require('react');
  return {
    VictoryChart: ({ children }: { children: unknown }) => children,
    VictoryLine: () => null,
    VictoryAxis: () => null,
    VictoryTheme: {
      material: {},
    },
  };
});

// 用途：模拟react-native-paper
// 原因：测试中不需要真实的UI组件渲染
jest.mock('react-native-paper', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    Portal: ({ children }: { children: unknown }) => children,
    Provider: ({ children }: { children: unknown }) => children,
    Button: ({ children, onPress, ...props }: Record<string, unknown>) =>
      React.createElement(TouchableOpacity, { onPress, ...props }, children),
    Card: ({ children, ...props }: Record<string, unknown>) =>
      React.createElement(View, props, children),
    CardTitle: ({ title, ...props }: Record<string, unknown>) =>
      React.createElement(Text, props, title),
    CardContent: ({ children, ...props }: Record<string, unknown>) =>
      React.createElement(View, props, children),
    Chip: ({ children, onPress, ...props }: Record<string, unknown>) =>
      React.createElement(TouchableOpacity, { onPress, ...props }, children),
    TextInput: ({ value, ...props }: Record<string, unknown>) =>
      React.createElement(Text, props, value),
    Paragraph: ({ children, ...props }: Record<string, unknown>) =>
      React.createElement(Text, props, children),
    Dialog: ({ children, visible, ...props }: Record<string, unknown>) =>
      visible ? React.createElement(View, props, children) : null,
    DialogTitle: ({ children, ...props }: Record<string, unknown>) =>
      React.createElement(Text, props, children),
    DialogContent: ({ children, ...props }: Record<string, unknown>) =>
      React.createElement(View, props, children),
    DialogActions: ({ children, ...props }: Record<string, unknown>) =>
      React.createElement(View, props, children),
  };
});

