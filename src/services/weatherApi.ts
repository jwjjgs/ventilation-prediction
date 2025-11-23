// 用途：调用彩云天气API获取天气数据
// 原因：获取小时级别的温度和湿度数据，用于计算预估水分

import Config from 'react-native-config';
import type { WeatherData, CaiyunWeatherResponse, Location } from '../types';

const API_BASE_URL = 'https://api.caiyunapp.com/v2.6';

// 用途：获取API密钥
// 原因：从环境变量读取密钥，避免硬编码
const getApiKey = (): string => {
  const apiKey = Config.CAIYUN_API_KEY;
  if (!apiKey) {
    throw new Error('彩云天气API密钥未配置，请在.env文件中设置CAIYUN_API_KEY');
  }
  return apiKey;
};

// 用途：调用彩云天气API
// 原因：获取指定位置的天气数据
export const fetchWeatherData = async (
  location: Location,
): Promise<Map<string, WeatherData>> => {
  try {
    const apiKey = getApiKey();
    const locationStr = `${location.longitude},${location.latitude}`;
    const url = `${API_BASE_URL}/${apiKey}/${locationStr}/weather.json`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`天气API请求失败: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as CaiyunWeatherResponse;

    if (data.status !== 'ok') {
      throw new Error(`天气API返回错误: ${data.status}`);
    }

    // 用途：构建datetime为key的Map
    // 原因：便于按时间查找对应的温度和湿度数据
    const weatherMap = new Map<string, WeatherData>();
    const { hourly } = data.result;

    if (
      !hourly ||
      !hourly.datetime ||
      !hourly.temperature ||
      !hourly.humidity
    ) {
      throw new Error('天气数据格式错误');
    }

    const { datetime, temperature, humidity } = hourly;

    for (let i = 0; i < datetime.length; i++) {
      const dt = datetime[i];
      const temp = temperature[i];
      const hum = humidity[i];

      if (dt && typeof temp === 'number' && typeof hum === 'number') {
        weatherMap.set(dt, {
          datetime: dt,
          temperature: temp,
          humidity: hum,
        });
      }
    }

    return weatherMap;
  } catch (error) {
    console.error('获取天气数据失败:', error);
    throw error;
  }
};

// 用途：重试机制包装函数
// 原因：网络请求可能失败，提供重试功能提高成功率
export const fetchWeatherDataWithRetry = async (
  location: Location,
  maxRetries: number = 3,
): Promise<Map<string, WeatherData>> => {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetchWeatherData(location);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (i < maxRetries - 1) {
        // 等待后重试，使用指数退避
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  throw lastError || new Error('获取天气数据失败');
};

