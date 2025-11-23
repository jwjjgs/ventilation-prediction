// 用途：天气数据图表展示
// 原因：可视化展示温度、湿度、预估水分和凝结温度，辅助用户判断是否需要通风

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme } from 'victory-native';
import type { CalculationResult } from '../types';

interface WeatherChartProps {
  data: CalculationResult[];
}

const screenWidth = Dimensions.get('window').width;

export const WeatherChart: React.FC<WeatherChartProps> = ({ data }) => {
  if (data.length === 0) {
    return null;
  }

  // 用途：格式化时间显示
  // 原因：X轴显示更友好的时间格式
  const formatTime = (datetime: string): string => {
    const date = new Date(datetime);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`;
  };

  // 用途：准备图表数据
  // 原因：Victory图表需要特定格式的数据数组
  const chartData = data.map((item, index) => ({
    x: index,
    y: item.temperature,
    humidity: item.humidity,
    moisture: item.estimatedMoisture,
    dewPoint: item.dewPoint,
    label: formatTime(item.datetime),
  }));

  // 用途：计算Y轴范围
  // 原因：确保所有数据线都能完整显示
  const allValues = data.flatMap((item) => [
    item.temperature,
    item.humidity,
    item.estimatedMoisture,
    item.dewPoint,
  ]);
  const minY = Math.min(...allValues) - 5;
  const maxY = Math.max(...allValues) + 5;

  return (
    <View style={styles.container}>
      <VictoryChart
        theme={VictoryTheme.material}
        width={screenWidth - 32}
        height={300}
        padding={{ left: 60, right: 20, top: 20, bottom: 60 }}
        domain={{ y: [minY, maxY] }}>
        <VictoryAxis
          tickFormat={(t) => {
            const item = data[Math.floor(t)];
            return item ? formatTime(item.datetime) : '';
          }}
          style={{
            tickLabels: { fontSize: 10, angle: -45 },
          }}
        />
        <VictoryAxis
          dependentAxis
          label="数值"
          style={{
            axisLabel: { padding: 35 },
            tickLabels: { fontSize: 10 },
          }}
        />
        <VictoryLine
          data={chartData}
          y="y"
          style={{
            data: { stroke: '#ff6b6b', strokeWidth: 2 },
          }}
          name="温度"
        />
        <VictoryLine
          data={chartData}
          y="humidity"
          style={{
            data: { stroke: '#4ecdc4', strokeWidth: 2 },
          }}
          name="湿度"
        />
        <VictoryLine
          data={chartData}
          y="moisture"
          style={{
            data: { stroke: '#45b7d1', strokeWidth: 2 },
          }}
          name="预估水分"
        />
        <VictoryLine
          data={chartData}
          y="dewPoint"
          style={{
            data: { stroke: '#f7b731', strokeWidth: 2 },
          }}
          name="凝结温度"
        />
      </VictoryChart>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#ff6b6b' }]} />
          <View style={styles.legendText}>温度</View>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#4ecdc4' }]} />
          <View style={styles.legendText}>湿度</View>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#45b7d1' }]} />
          <View style={styles.legendText}>预估水分</View>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#f7b731' }]} />
          <View style={styles.legendText}>凝结温度</View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 2,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#333',
  },
});

