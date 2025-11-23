// 用途：MainScreen界面的完整测试用例
// 原因：确保主界面功能正常

import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { MainScreen } from '../MainScreen';
import * as locationService from '../../services/locationService';
import * as storage from '../../utils/storage';

// 用途：模拟服务模块
// 原因：测试中不需要真实的GPS和存储
jest.mock('../../services/locationService');
jest.mock('../../services/weatherApi');
jest.mock('../../utils/storage');

describe('MainScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 用途：测试组件初始化
  // 原因：确保组件能正常初始化和渲染
  it('应该正确初始化组件', async () => {
    (storage.getLastLocation as jest.Mock).mockResolvedValue(null);
    (storage.getSettings as jest.Mock).mockResolvedValue(null);
    (locationService.getCurrentLocation as jest.Mock).mockResolvedValue({
      latitude: 39.976,
      longitude: 116.3176,
    });

    const { getByText } = render(<MainScreen />);

    await waitFor(() => {
      expect(getByText('位置信息')).toBeTruthy();
    });
  });

  // 用途：测试加载上次位置
  // 原因：确保能正确加载上次保存的位置
  it('应该加载上次保存的位置', async () => {
    const lastLocation = {
      latitude: 39.976,
      longitude: 116.3176,
    };

    (storage.getLastLocation as jest.Mock).mockResolvedValue(lastLocation);
    (storage.getSettings as jest.Mock).mockResolvedValue(null);
    (locationService.getCurrentLocation as jest.Mock).mockResolvedValue({
      latitude: 39.976,
      longitude: 116.3176,
    });
    (locationService.isLocationSimilar as jest.Mock).mockReturnValue(true);

    const { getByText } = render(<MainScreen />);

    await waitFor(() => {
      expect(getByText(/经度: 116.3176/)).toBeTruthy();
    });
  });
});

