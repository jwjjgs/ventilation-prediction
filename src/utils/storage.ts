// 用途：封装本地存储操作
// 原因：统一管理应用数据的持久化存储，便于维护和扩展

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Location, AppSettings } from '../types';

const STORAGE_KEYS = {
  LAST_LOCATION: '@wind2:last_location',
  SETTINGS: '@wind2:settings',
} as const;

// 用途：保存上次使用的位置
// 原因：下次打开应用时优先使用上次的位置
export const saveLastLocation = async (location: Location): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.LAST_LOCATION,
      JSON.stringify(location),
    );
  } catch (error) {
    console.error('保存位置失败:', error);
    throw error;
  }
};

// 用途：获取上次保存的位置
// 原因：应用启动时恢复用户上次选择的位置
export const getLastLocation = async (): Promise<Location | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.LAST_LOCATION);
    if (data) {
      return JSON.parse(data) as Location;
    }
    return null;
  } catch (error) {
    console.error('获取位置失败:', error);
    return null;
  }
};

// 用途：保存应用设置
// 原因：持久化用户的配置选项，如offset值
export const saveSettings = async (settings: AppSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.SETTINGS,
      JSON.stringify(settings),
    );
  } catch (error) {
    console.error('保存设置失败:', error);
    throw error;
  }
};

// 用途：获取应用设置
// 原因：恢复用户的配置选项
export const getSettings = async (): Promise<AppSettings | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (data) {
      return JSON.parse(data) as AppSettings;
    }
    return null;
  } catch (error) {
    console.error('获取设置失败:', error);
    return null;
  }
};

// 用途：清除所有存储的数据
// 原因：提供重置功能，便于测试和故障排除
export const clearAllStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.LAST_LOCATION,
      STORAGE_KEYS.SETTINGS,
    ]);
  } catch (error) {
    console.error('清除存储失败:', error);
    throw error;
  }
};

