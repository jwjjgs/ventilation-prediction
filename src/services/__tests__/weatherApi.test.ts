// 用途：weatherApi服务层的完整测试用例
// 原因：确保天气API调用和数据处理的正确性

import Config from 'react-native-config';
import { fetchWeatherData, fetchWeatherDataWithRetry } from '../weatherApi';
import type { Location, CaiyunWeatherResponse } from '../../types';

// 用途：模拟react-native-config
// 原因：测试中使用模拟的API密钥
jest.mock('react-native-config', () => ({
  CAIYUN_API_KEY: 'test_api_key',
}));

// 用途：模拟fetch
// 原因：测试中不需要真实的网络请求
global.fetch = jest.fn() as jest.Mock;

describe('WeatherApi', () => {
  const mockFetch = global.fetch as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchWeatherData', () => {
    // 用途：测试成功获取天气数据
    // 原因：验证API调用和数据解析功能正常
    it('应该成功获取天气数据', async () => {
      const mockResponse: CaiyunWeatherResponse = {
        status: 'ok',
        result: {
          hourly: {
            datetime: ['2024-01-01T00:00:00+08:00', '2024-01-01T01:00:00+08:00'],
            temperature: [20, 21],
            humidity: [60, 65],
          },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const location: Location = {
        latitude: 39.976,
        longitude: 116.3176,
      };

      const result = await fetchWeatherData(location);

      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(2);
      expect(result.get('2024-01-01T00:00:00+08:00')).toEqual({
        datetime: '2024-01-01T00:00:00+08:00',
        temperature: 20,
        humidity: 60,
      });
    });

    // 用途：测试API URL构建
    // 原因：确保URL格式正确
    it('应该构建正确的API URL', async () => {
      const mockResponse: CaiyunWeatherResponse = {
        status: 'ok',
        result: {
          hourly: {
            datetime: ['2024-01-01T00:00:00+08:00'],
            temperature: [20],
            humidity: [60],
          },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const location: Location = {
        latitude: 39.976,
        longitude: 116.3176,
      };

      await fetchWeatherData(location);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.caiyunapp.com/v2.6/test_api_key/116.3176,39.976/weather.json',
      );
    });

    // 用途：测试API响应错误处理
    // 原因：确保在API返回错误时能正确处理
    it('应该在API返回错误时抛出异常', async () => {
      const mockResponse: CaiyunWeatherResponse = {
        status: 'error',
        result: {
          hourly: {
            datetime: [],
            temperature: [],
            humidity: [],
          },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const location: Location = {
        latitude: 39.976,
        longitude: 116.3176,
      };

      await expect(fetchWeatherData(location)).rejects.toThrow('天气API返回错误');
    });

    // 用途：测试HTTP错误处理
    // 原因：确保在HTTP请求失败时能正确处理
    it('应该在HTTP请求失败时抛出异常', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      const location: Location = {
        latitude: 39.976,
        longitude: 116.3176,
      };

      await expect(fetchWeatherData(location)).rejects.toThrow('天气API请求失败');
    });

    // 用途：测试数据格式错误处理
    // 原因：确保在数据格式不正确时能正确处理
    it('应该在数据格式错误时抛出异常', async () => {
      const mockResponse = {
        status: 'ok',
        result: {},
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const location: Location = {
        latitude: 39.976,
        longitude: 116.3176,
      };

      await expect(fetchWeatherData(location)).rejects.toThrow('天气数据格式错误');
    });

    // 用途：测试API密钥缺失处理
    // 原因：确保在API密钥未配置时能正确提示
    it('应该在API密钥缺失时抛出异常', async () => {
      // 临时移除API密钥
      const originalKey = Config.CAIYUN_API_KEY;
      (Config as { CAIYUN_API_KEY?: string }).CAIYUN_API_KEY = '';

      const location: Location = {
        latitude: 39.976,
        longitude: 116.3176,
      };

      await expect(fetchWeatherData(location)).rejects.toThrow('彩云天气API密钥未配置');

      // 恢复API密钥
      (Config as { CAIYUN_API_KEY?: string }).CAIYUN_API_KEY = originalKey;
    });

    // 用途：测试数据映射完整性
    // 原因：确保所有时间点的数据都能正确映射
    it('应该正确映射所有时间点的数据', async () => {
      const mockResponse: CaiyunWeatherResponse = {
        status: 'ok',
        result: {
          hourly: {
            datetime: [
              '2024-01-01T00:00:00+08:00',
              '2024-01-01T01:00:00+08:00',
              '2024-01-01T02:00:00+08:00',
            ],
            temperature: [20, 21, 22],
            humidity: [60, 65, 70],
          },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const location: Location = {
        latitude: 39.976,
        longitude: 116.3176,
      };

      const result = await fetchWeatherData(location);

      expect(result.size).toBe(3);
      mockResponse.result.hourly.datetime.forEach((dt, index) => {
        const data = result.get(dt);
        expect(data).toEqual({
          datetime: dt,
          temperature: mockResponse.result.hourly.temperature[index],
          humidity: mockResponse.result.hourly.humidity[index],
        });
      });
    });
  });

  describe('fetchWeatherDataWithRetry', () => {
    // 用途：测试重试机制
    // 原因：确保在网络失败时能自动重试
    it('应该在失败时自动重试', async () => {
      const mockResponse: CaiyunWeatherResponse = {
        status: 'ok',
        result: {
          hourly: {
            datetime: ['2024-01-01T00:00:00+08:00'],
            temperature: [20],
            humidity: [60],
          },
        },
      };

      // 第一次失败，第二次成功
      mockFetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        });

      const location: Location = {
        latitude: 39.976,
        longitude: 116.3176,
      };

      const result = await fetchWeatherDataWithRetry(location, 3);

      expect(result).toBeInstanceOf(Map);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    // 用途：测试重试次数限制
    // 原因：确保重试不会无限进行
    it('应该在达到最大重试次数后抛出异常', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const location: Location = {
        latitude: 39.976,
        longitude: 116.3176,
      };

      await expect(
        fetchWeatherDataWithRetry(location, 3),
      ).rejects.toThrow('Network error');

      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    // 用途：测试成功时不重试
    // 原因：确保成功时不会进行不必要的重试
    it('应该在成功时不进行重试', async () => {
      const mockResponse: CaiyunWeatherResponse = {
        status: 'ok',
        result: {
          hourly: {
            datetime: ['2024-01-01T00:00:00+08:00'],
            temperature: [20],
            humidity: [60],
          },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const location: Location = {
        latitude: 39.976,
        longitude: 116.3176,
      };

      await fetchWeatherDataWithRetry(location, 3);

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});

