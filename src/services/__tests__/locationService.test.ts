// 用途：locationService服务层的完整测试用例
// 原因：确保GPS定位和位置处理功能的正确性

import Geolocation from '@react-native-community/geolocation';
import {
  getCurrentLocation,
  isLocationSimilar,
  formatLocationForApi,
} from '../locationService';
import type { Location } from '../../types';

// 用途：模拟Geolocation
// 原因：测试中不需要真实的GPS定位
jest.mock('@react-native-community/geolocation');

describe('LocationService', () => {
  const mockGetCurrentPosition = Geolocation.getCurrentPosition as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrentLocation', () => {
    // 用途：测试成功获取位置
    // 原因：验证GPS定位功能正常工作
    it('应该成功获取当前位置', async () => {
      const mockPosition = {
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
      };

      mockGetCurrentPosition.mockImplementation((success) => {
        success(mockPosition);
      });

      const location = await getCurrentLocation();

      expect(location).toEqual({
        latitude: 39.976,
        longitude: 116.3176,
      });
      expect(mockGetCurrentPosition).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
        expect.objectContaining({
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }),
      );
    });

    // 用途：测试经纬度格式化
    // 原因：确保经纬度保留4位小数
    it('应该格式化经纬度为4位小数', async () => {
      const mockPosition = {
        coords: {
          latitude: 39.976123456,
          longitude: 116.317678901,
          altitude: null,
          accuracy: 10,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      };

      mockGetCurrentPosition.mockImplementation((success) => {
        success(mockPosition);
      });

      const location = await getCurrentLocation();

      expect(location.latitude).toBe(39.9761);
      expect(location.longitude).toBe(116.3177);
    });

    // 用途：测试定位失败处理
    // 原因：确保在GPS定位失败时能正确处理错误
    it('应该在定位失败时抛出错误', async () => {
      const mockError = {
        code: 1,
        message: 'Location permission denied',
      };

      mockGetCurrentPosition.mockImplementation((success, error) => {
        error(mockError);
      });

      await expect(getCurrentLocation()).rejects.toEqual(mockError);
    });

    // 用途：测试边界坐标值
    // 原因：确保在极端坐标下也能正常处理
    it('应该处理边界坐标值', async () => {
      const testCases = [
        { latitude: -90, longitude: -180 },
        { latitude: 90, longitude: 180 },
        { latitude: 0, longitude: 0 },
      ];

      for (const testCase of testCases) {
        mockGetCurrentPosition.mockImplementationOnce((success) => {
          success({
            coords: {
              ...testCase,
              altitude: null,
              accuracy: 10,
              altitudeAccuracy: null,
              heading: null,
              speed: null,
            },
            timestamp: Date.now(),
          });
        });

        const location = await getCurrentLocation();
        expect(location.latitude).toBe(testCase.latitude);
        expect(location.longitude).toBe(testCase.longitude);
      }
    });
  });

  describe('isLocationSimilar', () => {
    // 用途：测试位置相似判断
    // 原因：验证位置比较逻辑的正确性
    it('应该判断两个相近位置为相似', () => {
      const loc1: Location = {
        latitude: 39.976,
        longitude: 116.3176,
      };
      const loc2: Location = {
        latitude: 39.9761,
        longitude: 116.3177,
      };

      const result = isLocationSimilar(loc1, loc2, 100);
      expect(result).toBe(true);
    });

    // 用途：测试位置不相似判断
    // 原因：验证距离较远的位置能被正确识别
    it('应该判断两个较远位置为不相似', () => {
      const loc1: Location = {
        latitude: 39.976,
        longitude: 116.3176,
      };
      const loc2: Location = {
        latitude: 40.0,
        longitude: 116.5,
      };

      const result = isLocationSimilar(loc1, loc2, 100);
      expect(result).toBe(false);
    });

    // 用途：测试自定义阈值
    // 原因：验证阈值参数能正确影响判断结果
    it('应该使用自定义阈值进行判断', () => {
      const loc1: Location = {
        latitude: 39.976,
        longitude: 116.3176,
      };
      const loc2: Location = {
        latitude: 39.9765,
        longitude: 116.318,
      };

      const result1 = isLocationSimilar(loc1, loc2, 50);
      const result2 = isLocationSimilar(loc1, loc2, 1000);

      expect(result1).toBe(false);
      expect(result2).toBe(true);
    });

    // 用途：测试相同位置
    // 原因：确保相同位置总是被判断为相似
    it('应该判断相同位置为相似', () => {
      const loc: Location = {
        latitude: 39.976,
        longitude: 116.3176,
      };

      const result = isLocationSimilar(loc, loc, 100);
      expect(result).toBe(true);
    });

    // 用途：测试默认阈值
    // 原因：验证默认阈值（100米）的正确性
    it('应该使用默认阈值100米', () => {
      const loc1: Location = {
        latitude: 39.976,
        longitude: 116.3176,
      };
      // 约50米距离的位置
      const loc2: Location = {
        latitude: 39.97645,
        longitude: 116.3176,
      };

      const result = isLocationSimilar(loc1, loc2);
      expect(result).toBe(true);
    });
  });

  describe('formatLocationForApi', () => {
    // 用途：测试位置格式化
    // 原因：验证位置能正确格式化为API所需的字符串格式
    it('应该正确格式化位置为API字符串', () => {
      const location: Location = {
        latitude: 39.976,
        longitude: 116.3176,
      };

      const result = formatLocationForApi(location);
      expect(result).toBe('116.3176,39.976');
    });

    // 用途：测试格式化顺序
    // 原因：确保格式为"经度,纬度"而不是"纬度,经度"
    it('应该按照"经度,纬度"的顺序格式化', () => {
      const location: Location = {
        latitude: 39.976,
        longitude: 116.3176,
      };

      const result = formatLocationForApi(location);
      expect(result.split(',')[0]).toBe('116.3176');
      expect(result.split(',')[1]).toBe('39.976');
    });

    // 用途：测试不同精度的坐标
    // 原因：确保格式化能正确处理不同精度的坐标
    it('应该正确处理不同精度的坐标', () => {
      const locations: Location[] = [
        { latitude: 39.976, longitude: 116.3176 },
        { latitude: 40.0, longitude: 116.0 },
        { latitude: 39.9761234, longitude: 116.3176789 },
      ];

      locations.forEach((location) => {
        const result = formatLocationForApi(location);
        expect(result).toMatch(/^-?\d+\.\d+,-?\d+\.\d+$/);
      });
    });
  });
});

