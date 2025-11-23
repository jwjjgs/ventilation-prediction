// 用途：GrainTypeSelector组件的完整测试用例
// 原因：确保粮食品种选择器功能正常

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GrainTypeSelector } from '../GrainTypeSelector';
import type { GrainType } from '../../types';

describe('GrainTypeSelector', () => {
  // 用途：测试组件渲染
  // 原因：确保组件能正常渲染
  it('应该正确渲染组件', () => {
    const { getByText } = render(
      <GrainTypeSelector selectedType={null} onSelect={jest.fn()} />,
    );

    expect(getByText('大麦')).toBeTruthy();
    expect(getByText('小麦')).toBeTruthy();
  });

  // 用途：测试显示所有粮食品种
  // 原因：确保所有10种粮食都能显示
  it('应该显示所有10种粮食品种', () => {
    const grainTypes: GrainType[] = [
      '大麦',
      '油菜',
      '玉米',
      '燕麦',
      '爆米花',
      '大米',
      '高粱',
      '大豆',
      '向日葵',
      '小麦',
    ];

    const { getByText } = render(
      <GrainTypeSelector selectedType={null} onSelect={jest.fn()} />,
    );

    grainTypes.forEach((type) => {
      expect(getByText(type)).toBeTruthy();
    });
  });

  // 用途：测试选择功能
  // 原因：确保点击能触发onSelect回调
  it('应该在点击时调用onSelect回调', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <GrainTypeSelector selectedType={null} onSelect={onSelect} />,
    );

    fireEvent.press(getByText('小麦'));
    expect(onSelect).toHaveBeenCalledWith('小麦');
  });

  // 用途：测试选中状态显示
  // 原因：确保选中的品种能正确高亮显示
  it('应该正确显示选中状态', () => {
    const { getByText } = render(
      <GrainTypeSelector selectedType="小麦" onSelect={jest.fn()} />,
    );

    const selectedChip = getByText('小麦').parent;
    expect(selectedChip).toBeTruthy();
  });

  // 用途：测试多次选择
  // 原因：确保可以切换选择不同的品种
  it('应该支持多次选择不同品种', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <GrainTypeSelector selectedType={null} onSelect={onSelect} />,
    );

    fireEvent.press(getByText('小麦'));
    fireEvent.press(getByText('玉米'));

    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenNthCalledWith(1, '小麦');
    expect(onSelect).toHaveBeenNthCalledWith(2, '玉米');
  });
});

