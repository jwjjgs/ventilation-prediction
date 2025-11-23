// 用途：处理GPS定位和位置相关操作
// 原因：统一管理位置获取、格式化和比较逻辑

import Geolocation from '@react-native-community/geolocation';
import type { Location } from '../types';

// 用途：格式化经纬度为4位小数
// 原因：符合API要求，保留足够的精度
const formatCoordinate = (coordinate: number): number => {
  return parseFloat(coordinate.toFixed(4));
};

// 用途：计算两个位置之间的距离（米）
// 原因：判断位置是否发生变化，决定是否提示用户切换
const calculateDistance = (
  loc1: Location,
  loc2: Location,
): number => {
  const R = 6371000; // 地球半径（米）
  const dLat = ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
  const dLon = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((loc1.latitude * Math.PI) / 180) *
      Math.cos((loc2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// 用途：获取当前GPS位置
// 原因：应用启动时自动获取用户当前位置
export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const location: Location = {
          latitude: formatCoordinate(position.coords.latitude),
          longitude: formatCoordinate(position.coords.longitude),
        };
        resolve(location);
      },
      (error) => {
        console.error('获取位置失败:', error);
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  });
};

// 用途：判断两个位置是否一致
// 原因：决定是否需要提示用户切换到当前位置
export const isLocationSimilar = (
  loc1: Location,
  loc2: Location,
  thresholdMeters: number = 100,
): boolean => {
  const distance = calculateDistance(loc1, loc2);
  return distance < thresholdMeters;
};

// 用途：格式化位置为API所需的字符串格式
// 原因：彩云天气API需要 "经度,纬度" 格式
export const formatLocationForApi = (location: Location): string => {
  return `${location.longitude},${location.latitude}`;
};

