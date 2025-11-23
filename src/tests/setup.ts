// 用途：测试环境初始化配置
// 原因：统一配置测试环境，模拟React Native环境

// 用途：模拟AsyncStorage
// 原因：测试中不需要真实的本地存储
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

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
    default: React.forwardRef((props: unknown, ref: unknown) => (
      <View testID="mock-map" {...props} ref={ref} />
    )),
    Marker: (props: unknown) => <View testID="mock-marker" {...props} />,
    PROVIDER_GOOGLE: 'google',
  };
});

// 用途：模拟victory-native
// 原因：测试中不需要渲染真实的图表
jest.mock('victory-native', () => ({
  VictoryChart: ({ children }: { children: React.ReactNode }) => children,
  VictoryLine: () => null,
  VictoryAxis: () => null,
  VictoryTheme: {
    material: {},
  },
}));

// 用途：模拟react-native-paper的Portal
// 原因：测试中不需要真实的Portal渲染
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  const actual = jest.requireActual('react-native-paper');
  return {
    ...actual,
    Portal: ({ children }: { children: React.ReactNode }) => children,
    Provider: ({ children }: { children: React.ReactNode }) => children,
  };
});

