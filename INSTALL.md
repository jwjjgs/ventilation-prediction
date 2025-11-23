# 安装说明

## 安装依赖

由于网络问题，请手动安装以下依赖包：

```bash
yarn add @react-native-community/geolocation react-native-maps @react-native-async-storage/async-storage react-native-config victory-native react-native-paper react-native-vector-icons
```

## 配置环境变量

1. 确保 `.env` 文件已创建，内容为：
```
CAIYUN_API_KEY=s0knd8SPdhlbEW7W
```

2. iOS 配置（安装依赖后运行）：
```bash
cd ios && pod install
```

## Android 配置

react-native-maps 需要 Google Maps API Key（可选，如果不配置会使用 OpenStreetMap）

## 运行应用

```bash
# Android
yarn android

# iOS
yarn ios
```

