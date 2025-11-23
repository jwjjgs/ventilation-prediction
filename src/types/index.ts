// 位置信息类型
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

// 天气数据类型
export interface WeatherData {
  datetime: string;
  temperature: number;
  humidity: number;
}

// 计算结果类型
export interface CalculationResult {
  datetime: string;
  temperature: number;
  humidity: number;
  estimatedMoisture: number;
  dewPoint: number;
}

// 粮食品种类型
export type GrainType =
  | '大麦'
  | '油菜'
  | '玉米'
  | '燕麦'
  | '爆米花'
  | '大米'
  | '高粱'
  | '大豆'
  | '向日葵'
  | '小麦';

// 彩云天气API响应类型
export interface CaiyunWeatherResponse {
  status: string;
  result: {
    hourly: {
      temperature: number[];
      humidity: number[];
      datetime: string[];
    };
  };
}

// 应用设置类型
export interface AppSettings {
  offset: number;
  lastLocation?: Location;
}

