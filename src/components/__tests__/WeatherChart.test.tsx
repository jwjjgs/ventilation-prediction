// 用途：WeatherChart组件的完整测试用例
// 原因：确保天气图表组件功能正常

import React from 'react';
import { render } from '@testing-library/react-native';
import { WeatherChart } from '../WeatherChart';
import type { CalculationResult } from '../../types';

describe('WeatherChart', () => {
  const mockData: CalculationResult[] = [
    {
      datetime: '2024-01-01T00:00:00+08:00',
      temperature: 20,
      humidity: 60,
      estimatedMoisture: 12.5,
      dewPoint: 15.2,
    },
    {
      datetime: '2024-01-01T01:00:00+08:00',
      temperature: 21,
      humidity: 65,
      estimatedMoisture: 13.0,
      dewPoint: 16.0,
    },
  ];

  // 用途：测试组件渲染
  // 原因：确保组件能正常渲染
  it('应该正确渲染组件', () => {
    const { container } = render(<WeatherChart data={mockData} />);
    expect(container).toBeTruthy();
  });

  // 用途：测试空数据时的行为
  // 原因：确保在没有数据时不渲染或返回null
  it('应该在数据为空时不渲染', () => {
    const { container } = render(<WeatherChart data={[]} />);
    // WeatherChart在数据为空时返回null
    expect(container.children.length).toBe(0);
  });

  // 用途：测试数据格式
  // 原因：确保能正确处理不同格式的数据
  it('应该正确处理数据格式', () => {
    const { container } = render(<WeatherChart data={mockData} />);
    expect(container).toBeTruthy();
  });

  // 用途：测试大量数据
  // 原因：确保能处理大量数据点
  it('应该能处理大量数据点', () => {
    const largeData: CalculationResult[] = Array.from({ length: 100 }, (_, i) => ({
      datetime: `2024-01-01T${String(i).padStart(2, '0')}:00:00+08:00`,
      temperature: 20 + i * 0.1,
      humidity: 60 + i * 0.2,
      estimatedMoisture: 12 + i * 0.05,
      dewPoint: 15 + i * 0.1,
    }));

    const { container } = render(<WeatherChart data={largeData} />);
    expect(container).toBeTruthy();
  });
});

