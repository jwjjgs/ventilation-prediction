// 用途：SettingsScreen界面的完整测试用例
// 原因：确保设置页面功能正常

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SettingsScreen } from '../SettingsScreen';
import * as storage from '../../utils/storage';

// 用途：模拟storage模块
// 原因：测试中不需要真实的本地存储
jest.mock('../../utils/storage');

describe('SettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 用途：测试组件渲染
  // 原因：确保组件能正常渲染
  it('应该正确渲染组件', () => {
    (storage.getSettings as jest.Mock).mockResolvedValue(null);
    const { getByText } = render(<SettingsScreen />);
    expect(getByText('计算参数')).toBeTruthy();
  });

  // 用途：测试加载保存的设置
  // 原因：确保能正确加载已保存的设置
  it('应该加载保存的设置', async () => {
    (storage.getSettings as jest.Mock).mockResolvedValue({ offset: 5 });
    const { getByDisplayValue } = render(<SettingsScreen />);

    await waitFor(() => {
      expect(getByDisplayValue('5')).toBeTruthy();
    });
  });

  // 用途：测试保存设置
  // 原因：确保能正确保存设置
  it('应该能保存设置', async () => {
    (storage.getSettings as jest.Mock).mockResolvedValue(null);
    (storage.saveSettings as jest.Mock).mockResolvedValue(undefined);

    const { getByLabelText, getByText } = render(<SettingsScreen />);

    const input = getByLabelText('Offset');
    fireEvent.changeText(input, '10');

    const saveButton = getByText('保存');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(storage.saveSettings).toHaveBeenCalledWith({ offset: 10 });
    });
  });

  // 用途：测试输入验证
  // 原因：确保能处理无效输入
  it('应该处理无效输入', async () => {
    (storage.getSettings as jest.Mock).mockResolvedValue(null);
    (storage.saveSettings as jest.Mock).mockResolvedValue(undefined);

    const { getByLabelText, getByText } = render(<SettingsScreen />);

    const input = getByLabelText('Offset');
    fireEvent.changeText(input, 'invalid');

    const saveButton = getByText('保存');
    fireEvent.press(saveButton);

    await waitFor(() => {
      // 无效输入应该被转换为0
      expect(storage.saveSettings).toHaveBeenCalledWith({ offset: 0 });
    });
  });
});

