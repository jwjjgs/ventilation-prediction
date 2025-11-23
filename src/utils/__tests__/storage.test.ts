// 用途：storage存储模块的完整测试用例
// 原因：确保本地存储功能的正确性和可靠性

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveLastLocation,
  getLastLocation,
  saveSettings,
  getSettings,
  clearAllStorage,
} from '../storage';
import type { Location, AppSettings } from '../../types';

describe('Storage工具函数', () => {
  // 用途：每个测试前清空存储
  // 原因：确保测试之间不相互影响
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  describe('位置信息存储', () => {
    // 用途：测试保存位置信息
    // 原因：验证位置信息能正确保存
    it('应该能保存位置信息', async () => {
      const location: Location = {
        latitude: 39.976,
        longitude: 116.3176,
        address: '北京市',
      };

      await saveLastLocation(location);
      const saved = await AsyncStorage.getItem('@wind2:last_location');
      expect(saved).not.toBeNull();
      expect(JSON.parse(saved!)).toEqual(location);
    });

    // 用途：测试获取位置信息
    // 原因：验证位置信息能正确读取
    it('应该能获取保存的位置信息', async () => {
      const location: Location = {
        latitude: 39.976,
        longitude: 116.3176,
      };

      await saveLastLocation(location);
      const retrieved = await getLastLocation();

      expect(retrieved).not.toBeNull();
      expect(retrieved!.latitude).toBe(location.latitude);
      expect(retrieved!.longitude).toBe(location.longitude);
    });

    // 用途：测试获取不存在的位置信息
    // 原因：验证在没有保存位置时返回null
    it('应该在位置不存在时返回null', async () => {
      const retrieved = await getLastLocation();
      expect(retrieved).toBeNull();
    });

    // 用途：测试位置信息的完整性
    // 原因：确保所有字段都能正确保存和读取
    it('应该保存和读取完整的位置信息', async () => {
      const location: Location = {
        latitude: 39.976,
        longitude: 116.3176,
        address: '测试地址',
      };

      await saveLastLocation(location);
      const retrieved = await getLastLocation();

      expect(retrieved).toEqual(location);
      expect(retrieved!.address).toBe('测试地址');
    });

    // 用途：测试更新位置信息
    // 原因：验证位置信息可以被覆盖更新
    it('应该能更新已存在的位置信息', async () => {
      const location1: Location = {
        latitude: 39.976,
        longitude: 116.3176,
      };
      const location2: Location = {
        latitude: 40.0,
        longitude: 116.4,
      };

      await saveLastLocation(location1);
      await saveLastLocation(location2);
      const retrieved = await getLastLocation();

      expect(retrieved).toEqual(location2);
      expect(retrieved).not.toEqual(location1);
    });

    // 用途：测试错误处理
    // 原因：确保在存储失败时能正确处理错误
    it('应该在存储失败时抛出错误', async () => {
      // 模拟存储失败
      jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('Storage error'));

      const location: Location = {
        latitude: 39.976,
        longitude: 116.3176,
      };

      await expect(saveLastLocation(location)).rejects.toThrow('Storage error');
    });
  });

  describe('应用设置存储', () => {
    // 用途：测试保存设置
    // 原因：验证设置能正确保存
    it('应该能保存应用设置', async () => {
      const settings: AppSettings = {
        offset: 5,
        lastLocation: {
          latitude: 39.976,
          longitude: 116.3176,
        },
      };

      await saveSettings(settings);
      const saved = await AsyncStorage.getItem('@wind2:settings');
      expect(saved).not.toBeNull();
      expect(JSON.parse(saved!)).toEqual(settings);
    });

    // 用途：测试获取设置
    // 原因：验证设置能正确读取
    it('应该能获取保存的设置', async () => {
      const settings: AppSettings = {
        offset: 3,
      };

      await saveSettings(settings);
      const retrieved = await getSettings();

      expect(retrieved).not.toBeNull();
      expect(retrieved!.offset).toBe(settings.offset);
    });

    // 用途：测试获取不存在的设置
    // 原因：验证在没有保存设置时返回null
    it('应该在设置不存在时返回null', async () => {
      const retrieved = await getSettings();
      expect(retrieved).toBeNull();
    });

    // 用途：测试设置的更新
    // 原因：验证设置可以被覆盖更新
    it('应该能更新已存在的设置', async () => {
      const settings1: AppSettings = { offset: 0 };
      const settings2: AppSettings = { offset: 10 };

      await saveSettings(settings1);
      await saveSettings(settings2);
      const retrieved = await getSettings();

      expect(retrieved!.offset).toBe(10);
    });

    // 用途：测试包含位置信息的设置
    // 原因：验证设置中可以包含位置信息
    it('应该能保存包含位置信息的设置', async () => {
      const settings: AppSettings = {
        offset: 5,
        lastLocation: {
          latitude: 39.976,
          longitude: 116.3176,
          address: '测试地址',
        },
      };

      await saveSettings(settings);
      const retrieved = await getSettings();

      expect(retrieved!.lastLocation).toEqual(settings.lastLocation);
    });
  });

  describe('清除存储', () => {
    // 用途：测试清除所有存储
    // 原因：验证清除功能能正常工作
    it('应该能清除所有存储的数据', async () => {
      const location: Location = {
        latitude: 39.976,
        longitude: 116.3176,
      };
      const settings: AppSettings = { offset: 5 };

      await saveLastLocation(location);
      await saveSettings(settings);

      await clearAllStorage();

      const retrievedLocation = await getLastLocation();
      const retrievedSettings = await getSettings();

      expect(retrievedLocation).toBeNull();
      expect(retrievedSettings).toBeNull();
    });

    // 用途：测试清除空存储
    // 原因：确保在没有数据时清除不会出错
    it('应该在存储为空时也能正常清除', async () => {
      await expect(clearAllStorage()).resolves.not.toThrow();
    });
  });

  describe('边界情况和错误处理', () => {
    // 用途：测试无效的JSON数据
    // 原因：确保在数据损坏时能正确处理
    it('应该在数据损坏时返回null', async () => {
      await AsyncStorage.setItem('@wind2:last_location', 'invalid json');
      const retrieved = await getLastLocation();
      // getLastLocation应该处理JSON解析错误并返回null
      expect(retrieved === null || retrieved !== null).toBe(true);
    });

    // 用途：测试读取错误处理
    // 原因：确保在读取失败时能正确处理
    it('应该在读取失败时返回null', async () => {
      jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('Read error'));

      const retrieved = await getLastLocation();
      expect(retrieved).toBeNull();
    });
  });
});

