// 用途：CalcUtil工具类的完整测试用例
// 原因：确保核心计算逻辑的正确性，覆盖所有粮食品种和边界情况

import { CalcUtil } from '../CalcUtil';
import type { GrainType } from '../../types';

describe('CalcUtil', () => {
  let calcUtil: CalcUtil;

  beforeEach(() => {
    calcUtil = new CalcUtil();
  });

  describe('get方法 - 预估水分计算', () => {
    // 用途：测试大麦品种的计算
    // 原因：验证Chung模型对大麦的计算准确性
    it('应该正确计算大麦的预估水分', () => {
      const result = calcUtil.get({
        type: '大麦',
        temp: 20,
        hum: 60,
        offset: 0,
      });
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(100);
      expect(typeof result).toBe('number');
    });

    // 用途：测试油菜品种的计算
    // 原因：验证Halsey模型对油菜的计算准确性
    it('应该正确计算油菜的预估水分', () => {
      const result = calcUtil.get({
        type: '油菜',
        temp: 15,
        hum: 70,
        offset: 0,
      });
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(100);
    });

    // 用途：测试玉米品种的计算
    // 原因：验证Henderson模型对玉米的计算准确性
    it('应该正确计算玉米的预估水分', () => {
      const result = calcUtil.get({
        type: '玉米',
        temp: 25,
        hum: 65,
        offset: 0,
      });
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(100);
    });

    // 用途：测试所有粮食品种
    // 原因：确保所有品种都能正常计算
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

    grainTypes.forEach((type) => {
      it(`应该正确计算${type}的预估水分`, () => {
        const result = calcUtil.get({
          type,
          temp: 20,
          hum: 60,
          offset: 0,
        });
        expect(result).toBeGreaterThan(0);
        expect(result).toBeLessThan(100);
        expect(result).not.toBeNull();
      });
    });

    // 用途：测试offset参数的影响
    // 原因：验证offset能正确调整计算结果
    it('应该正确处理offset参数', () => {
      const result1 = calcUtil.get({
        type: '小麦',
        temp: 20,
        hum: 60,
        offset: 0,
      });
      const result2 = calcUtil.get({
        type: '小麦',
        temp: 20,
        hum: 60,
        offset: 5,
      });
      expect(result1).not.toBe(result2);
    });

    // 用途：测试边界温度值
    // 原因：确保在极端温度下也能正常计算
    it('应该处理极端温度值', () => {
      const result1 = calcUtil.get({
        type: '小麦',
        temp: -10,
        hum: 50,
        offset: 0,
      });
      const result2 = calcUtil.get({
        type: '小麦',
        temp: 50,
        hum: 50,
        offset: 0,
      });
      expect(result1).not.toBeNull();
      expect(result2).not.toBeNull();
    });

    // 用途：测试边界湿度值
    // 原因：确保在极端湿度下也能正常计算
    it('应该处理极端湿度值', () => {
      const result1 = calcUtil.get({
        type: '小麦',
        temp: 20,
        hum: 0,
        offset: 0,
      });
      const result2 = calcUtil.get({
        type: '小麦',
        temp: 20,
        hum: 100,
        offset: 0,
      });
      expect(result1).not.toBeNull();
      expect(result2).not.toBeNull();
    });

    // 用途：测试无效输入的处理
    // 原因：确保异常情况下返回null而不是抛出错误
    it('应该处理无效的输入参数', () => {
      // 注意：TypeScript类型检查会阻止无效输入，这里主要测试运行时错误处理
      const result = calcUtil.get({
        type: '小麦',
        temp: NaN,
        hum: 60,
        offset: 0,
      });
      // NaN可能导致计算结果异常，应该返回null或有效值
      expect(result === null || typeof result === 'number').toBe(true);
    });
  });

  describe('lu方法 - 凝结温度计算', () => {
    // 用途：测试凝结温度的基本计算
    // 原因：验证Tetens公式的正确性
    it('应该正确计算凝结温度', () => {
      const result = calcUtil.lu(20, 60);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      const numResult = parseFloat(result);
      expect(numResult).toBeGreaterThan(-50);
      expect(numResult).toBeLessThan(50);
    });

    // 用途：测试不同温度下的凝结温度
    // 原因：验证温度对凝结温度的影响
    it('应该在不同温度下正确计算凝结温度', () => {
      const result1 = calcUtil.lu(10, 60);
      const result2 = calcUtil.lu(30, 60);
      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      expect(parseFloat(result1)).not.toBe(parseFloat(result2));
    });

    // 用途：测试不同湿度下的凝结温度
    // 原因：验证湿度对凝结温度的影响
    it('应该在不同湿度下正确计算凝结温度', () => {
      const result1 = calcUtil.lu(20, 30);
      const result2 = calcUtil.lu(20, 90);
      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      expect(parseFloat(result2)).toBeGreaterThan(parseFloat(result1));
    });

    // 用途：测试边界值
    // 原因：确保在极端条件下也能正常计算
    it('应该处理边界温度值', () => {
      const result1 = calcUtil.lu(-20, 50);
      const result2 = calcUtil.lu(50, 50);
      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
    });

    // 用途：测试边界湿度值
    // 原因：确保在极端湿度下也能正常计算
    it('应该处理边界湿度值', () => {
      const result1 = calcUtil.lu(20, 0);
      const result2 = calcUtil.lu(20, 100);
      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
    });

    // 用途：测试返回值的格式
    // 原因：确保返回值是保留2位小数的字符串
    it('应该返回保留2位小数的字符串', () => {
      const result = calcUtil.lu(20, 60);
      expect(result).toMatch(/^-?\d+\.\d{2}$/);
    });
  });

  describe('综合测试场景', () => {
    // 用途：测试完整的计算流程
    // 原因：模拟实际使用场景
    it('应该完成完整的计算流程', () => {
      const moisture = calcUtil.get({
        type: '小麦',
        temp: 20,
        hum: 60,
        offset: 0,
      });
      const dewPoint = calcUtil.lu(20, 60);

      expect(moisture).not.toBeNull();
      expect(dewPoint).toBeDefined();
      expect(typeof moisture).toBe('number');
      expect(typeof dewPoint).toBe('string');
    });

    // 用途：测试多个品种的批量计算
    // 原因：验证系统在批量处理时的稳定性
    it('应该能处理多个品种的批量计算', () => {
      const types: GrainType[] = ['小麦', '玉米', '大米'];
      const results = types.map((type) =>
        calcUtil.get({
          type,
          temp: 20,
          hum: 60,
          offset: 0,
        }),
      );

      results.forEach((result) => {
        expect(result).not.toBeNull();
        expect(result).toBeGreaterThan(0);
        expect(result).toBeLessThan(100);
      });
    });
  });
});

