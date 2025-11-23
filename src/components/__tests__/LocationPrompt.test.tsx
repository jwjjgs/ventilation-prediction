// 用途：LocationPrompt组件的完整测试用例
// 原因：确保位置切换提示弹窗功能正常

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { LocationPrompt } from '../LocationPrompt';
import type { Location } from '../../types';

describe('LocationPrompt', () => {
  const mockCurrentLocation: Location = {
    latitude: 40.0,
    longitude: 116.4,
    address: '当前位置',
  };

  const mockLastLocation: Location = {
    latitude: 39.976,
    longitude: 116.3176,
    address: '上次位置',
  };

  // 用途：测试组件渲染
  // 原因：确保组件能正常渲染
  it('应该正确渲染组件', () => {
    const { getByText } = render(
      <LocationPrompt
        visible={true}
        currentLocation={mockCurrentLocation}
        lastLocation={mockLastLocation}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />,
    );

    expect(getByText('位置已变化')).toBeTruthy();
  });

  // 用途：测试不显示时的行为
  // 原因：确保visible为false时不显示弹窗
  it('应该在visible为false时不显示', () => {
    const { queryByText } = render(
      <LocationPrompt
        visible={false}
        currentLocation={mockCurrentLocation}
        lastLocation={mockLastLocation}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />,
    );

    expect(queryByText('位置已变化')).toBeNull();
  });

  // 用途：测试显示位置信息
  // 原因：确保当前位置和上次位置信息都能正确显示
  it('应该正确显示位置信息', () => {
    const { getByText } = render(
      <LocationPrompt
        visible={true}
        currentLocation={mockCurrentLocation}
        lastLocation={mockLastLocation}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />,
    );

    expect(getByText(/经度: 116.3176/)).toBeTruthy();
    expect(getByText(/纬度: 39.976/)).toBeTruthy();
    expect(getByText(/经度: 116.4/)).toBeTruthy();
    expect(getByText(/纬度: 40.0/)).toBeTruthy();
  });

  // 用途：测试确认按钮
  // 原因：确保点击确认能触发onConfirm回调
  it('应该在点击确认时调用onConfirm', () => {
    const onConfirm = jest.fn();
    const { getByText } = render(
      <LocationPrompt
        visible={true}
        currentLocation={mockCurrentLocation}
        lastLocation={mockLastLocation}
        onConfirm={onConfirm}
        onCancel={jest.fn()}
      />,
    );

    fireEvent.press(getByText('切换'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  // 用途：测试取消按钮
  // 原因：确保点击取消能触发onCancel回调
  it('应该在点击取消时调用onCancel', () => {
    const onCancel = jest.fn();
    const { getByText } = render(
      <LocationPrompt
        visible={true}
        currentLocation={mockCurrentLocation}
        lastLocation={mockLastLocation}
        onConfirm={jest.fn()}
        onCancel={onCancel}
      />,
    );

    fireEvent.press(getByText('取消'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  // 用途：测试地址显示
  // 原因：确保有地址时能正确显示
  it('应该在有地址时显示地址信息', () => {
    const { getByText } = render(
      <LocationPrompt
        visible={true}
        currentLocation={mockCurrentLocation}
        lastLocation={mockLastLocation}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />,
    );

    expect(getByText('当前位置')).toBeTruthy();
    expect(getByText('上次位置')).toBeTruthy();
  });

  // 用途：测试无地址时的显示
  // 原因：确保没有地址时也能正常显示
  it('应该在没有地址时也能正常显示', () => {
    const locationWithoutAddress: Location = {
      latitude: 39.976,
      longitude: 116.3176,
    };

    const { getByText } = render(
      <LocationPrompt
        visible={true}
        currentLocation={locationWithoutAddress}
        lastLocation={locationWithoutAddress}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />,
    );

    expect(getByText('位置已变化')).toBeTruthy();
  });
});

