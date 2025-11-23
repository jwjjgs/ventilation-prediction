// 用途：主界面，整合所有功能
// 原因：这是应用的核心界面，处理位置获取、天气数据获取、计算和展示

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Button, Card, Portal, Provider as PaperProvider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { CalcUtil } from '../utils/CalcUtil';
import { getCurrentLocation, isLocationSimilar } from '../services/locationService';
import { fetchWeatherDataWithRetry } from '../services/weatherApi';
import { getLastLocation, saveLastLocation, getSettings } from '../utils/storage';
import { GrainTypeSelector } from '../components/GrainTypeSelector';
import { WeatherChart } from '../components/WeatherChart';
import { LocationPrompt } from '../components/LocationPrompt';
import { LocationPicker } from '../components/LocationPicker';
import type {
  Location,
  GrainType,
  WeatherData,
  CalculationResult,
} from '../types';

export const MainScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [location, setLocation] = useState<Location | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [grainType, setGrainType] = useState<GrainType | null>(null);
  const [calculationResults, setCalculationResults] = useState<
    CalculationResult[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [offset, setOffset] = useState(0);

  // 用途：应用启动时初始化位置和设置
  // 原因：恢复用户上次的位置和配置
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // 获取上次保存的位置
      const lastLocation = await getLastLocation();
      const settings = await getSettings();
      if (settings?.offset !== undefined) {
        setOffset(settings.offset);
      }

      // 获取当前GPS位置
      const current = await getCurrentLocation();
      setCurrentLocation(current);

      if (lastLocation) {
        // 用途：比较位置是否一致
        // 原因：决定是否提示用户切换位置
        if (isLocationSimilar(lastLocation, current)) {
          setLocation(lastLocation);
        } else {
          setLocation(lastLocation);
          setShowLocationPrompt(true);
        }
      } else {
        setLocation(current);
        await saveLastLocation(current);
      }
    } catch (error) {
      console.error('Initialization failed:', error);
      Alert.alert(t('common.error'), t('weather.locationError'));
    }
  };

  // 用途：处理位置切换确认
  // 原因：用户确认后更新位置并保存
  const handleLocationConfirm = async () => {
    if (currentLocation) {
      setLocation(currentLocation);
      await saveLastLocation(currentLocation);
      setShowLocationPrompt(false);
      // 如果已选择粮食品种，重新获取天气数据
      if (grainType) {
        await fetchAndCalculate();
      }
    }
  };

  // 用途：处理位置切换取消
  // 原因：用户取消时保持原位置
  const handleLocationCancel = () => {
    setShowLocationPrompt(false);
  };

  // 用途：打开位置选择器
  // 原因：允许用户手动选择位置
  const handleOpenLocationPicker = () => {
    setShowLocationPicker(true);
  };

  // 用途：处理位置选择
  // 原因：用户在地图上选择位置后更新
  const handleLocationSelect = async (selectedLocation: Location) => {
    setLocation(selectedLocation);
    await saveLastLocation(selectedLocation);
    setShowLocationPicker(false);
    // 如果已选择粮食品种，重新获取天气数据
    if (grainType) {
      await fetchAndCalculate();
    }
  };

  // 用途：获取天气数据并计算
  // 原因：当位置和粮食品种都确定后，获取数据并计算预估水分
  const fetchAndCalculate = async () => {
    if (!location || !grainType) {
      return;
    }

    setLoading(true);
    try {
      // 用途：重新获取设置，确保使用最新的offset值
      // 原因：用户可能在设置页面修改了offset，需要重新加载
      const settings = await getSettings();
      if (settings?.offset !== undefined) {
        setOffset(settings.offset);
      }

      // 获取天气数据
      const weatherMap = await fetchWeatherDataWithRetry(location);

      // 用途：计算每个时间点的预估水分和凝结温度
      // 原因：生成完整的数据用于图表展示
      const calcUtil = new CalcUtil();
      const results: CalculationResult[] = [];

      weatherMap.forEach((weatherData: WeatherData, datetime: string) => {
        const estimatedMoisture = calcUtil.get({
          type: grainType,
          temp: weatherData.temperature,
          hum: weatherData.humidity,
          offset: offset,
        });

        if (estimatedMoisture !== null) {
          const dewPoint = parseFloat(
            calcUtil.lu(weatherData.temperature, weatherData.humidity),
          );

          results.push({
            datetime,
            temperature: weatherData.temperature,
            humidity: weatherData.humidity,
            estimatedMoisture,
            dewPoint,
          });
        }
      });

      // 用途：按时间排序
      // 原因：确保图表按时间顺序显示
      results.sort(
        (a, b) =>
          new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
      );

      setCalculationResults(results);
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      Alert.alert(t('common.error'), t('weather.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  // 用途：处理粮食品种选择
  // 原因：选择后自动获取天气数据并计算
  const handleGrainTypeSelect = async (type: GrainType) => {
    setGrainType(type);
    // 延迟一下确保状态更新
    setTimeout(() => {
      fetchAndCalculate();
    }, 100);
  };

  return (
    <PaperProvider>
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Title title={t('location.title')} />
          <Card.Content>
            {location ? (
              <View>
                <Text style={styles.locationText}>
                  {t('location.longitude')}: {location.longitude.toFixed(4)}
                </Text>
                <Text style={styles.locationText}>
                  {t('location.latitude')}: {location.latitude.toFixed(4)}
                </Text>
                {location.address && (
                  <Text style={styles.addressText}>{location.address}</Text>
                )}
                <Button
                  mode="outlined"
                  onPress={handleOpenLocationPicker}
                  style={styles.button}>
                  {t('location.selectLocation')}
                </Button>
              </View>
            ) : (
              <ActivityIndicator />
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title={t('grain.title')} />
          <Card.Content>
            <GrainTypeSelector
              selectedType={grainType}
              onSelect={handleGrainTypeSelect}
            />
          </Card.Content>
        </Card>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>{t('weather.fetching')}</Text>
          </View>
        )}

        {calculationResults.length > 0 && (
          <Card style={styles.card}>
            <Card.Title title={t('calculation.title')} />
            <Card.Content>
              <WeatherChart data={calculationResults} />
            </Card.Content>
          </Card>
        )}

        {calculationResults.length > 0 && (
          <Card style={styles.card}>
            <Card.Title title={t('calculation.details')} />
            <Card.Content>
              <ScrollView style={styles.dataList}>
                {calculationResults.map((result, index) => (
                  <View key={index} style={styles.dataItem}>
                    <Text style={styles.dataTime}>
                      {new Date(result.datetime).toLocaleString(i18n.language)}
                    </Text>
                    <Text style={styles.dataText}>
                      {t('calculation.temperature')}: {result.temperature.toFixed(1)}°C
                    </Text>
                    <Text style={styles.dataText}>
                      {t('calculation.humidity')}: {result.humidity.toFixed(1)}%
                    </Text>
                    <Text style={styles.dataText}>
                      {t('calculation.estimatedMoisture')}: {result.estimatedMoisture.toFixed(2)}%
                    </Text>
                    <Text style={styles.dataText}>
                      {t('calculation.dewPoint')}: {result.dewPoint.toFixed(2)}°C
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      <LocationPrompt
        visible={showLocationPrompt}
        currentLocation={currentLocation!}
        lastLocation={location!}
        onConfirm={handleLocationConfirm}
        onCancel={handleLocationCancel}
      />

      {showLocationPicker && location && (
        <Portal>
          <View style={styles.pickerContainer}>
            <LocationPicker
              initialLocation={location}
              onLocationSelect={handleLocationSelect}
              onCancel={() => setShowLocationPicker(false)}
            />
          </View>
        </Portal>
      )}
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    marginVertical: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  button: {
    marginTop: 12,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#666',
  },
  dataList: {
    maxHeight: 400,
  },
  dataItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dataTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  dataText: {
    fontSize: 12,
    color: '#666',
    marginVertical: 2,
  },
  pickerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
  },
});

