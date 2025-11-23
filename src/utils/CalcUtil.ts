// 用途：计算粮食水分和凝结温度的工具类
// 原因：根据温度、湿度和粮食品种计算预估水分，辅助判断是否需要通风

type GrainType =
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

type ModelFunction = (
  RHdec: number,
  A: number,
  B: number,
  C: number,
  ambientTemp: number,
) => number;

export class CalcUtil {
  // 用途：摄氏度转华氏度
  // 原因：某些计算需要华氏度单位
  private cToF(degC: number): number {
    const degF = parseFloat(String((9 / 5) * parseFloat(String(degC)) + 32));
    return degF;
  }

  // 用途：华氏度转摄氏度
  // 原因：统一温度单位用于计算
  private fToC(degF: number): number {
    const degC = parseFloat(String((5 / 9) * (parseFloat(String(degF)) - 32)));
    return degC;
  }

  // 用途：摄氏度温差转华氏度温差
  // 原因：处理温度差值的单位转换
  private cToFDelta(degC: number): number {
    const degF = parseFloat(String((9 / 5) * parseFloat(String(degC))));
    return degF;
  }

  // 用途：华氏度温差转摄氏度温差
  // 原因：处理温度差值的单位转换
  private fToCDelta(degF: number): number {
    const degC = parseFloat(String((5 / 9) * parseFloat(String(degF))));
    return degC;
  }

  // 用途：使用Henderson模型计算水分
  // 原因：特定粮食品种使用此模型计算更准确
  private hendersen(
    RHdec: number,
    A: number,
    B: number,
    C: number,
    ambientTemp: number,
  ): number {
    const MCDry = Math.pow(
      Math.log(1 - RHdec) / (-A * (ambientTemp + C)),
      1 / B,
    );
    const MCWet = (100 * MCDry) / (100 + MCDry);
    return MCWet;
  }

  // 用途：使用Halsey模型计算水分
  // 原因：特定粮食品种使用此模型计算更准确
  private halsey(
    RHdec: number,
    A: number,
    B: number,
    C: number,
    ambientTemp: number,
  ): number {
    const MCDry = Math.pow(
      -Math.exp(A + B * ambientTemp) / Math.log(RHdec),
      1 / C,
    );
    const MCWet = (100 * MCDry) / (100 + MCDry);
    return MCWet;
  }

  // 用途：使用Chung模型计算水分
  // 原因：特定粮食品种使用此模型计算更准确
  private chung(
    RHdec: number,
    A: number,
    B: number,
    C: number,
    ambientTemp: number,
  ): number {
    const x = Math.log(RHdec);
    const y = ambientTemp + C;
    const z = (x * y) / -A;
    const MCDry = -Math.log(z) / B;
    const MCWet = (100 * MCDry) / (100 + MCDry);
    return MCWet;
  }

  // 用途：使用Oswin模型计算水分
  // 原因：特定粮食品种使用此模型计算更准确
  private oswin(
    RHdec: number,
    A: number,
    B: number,
    C: number,
    ambientTemp: number,
  ): number {
    const MCDry =
      (A + B * ambientTemp) * Math.pow(1 / RHdec - 1, -1 / C);
    const MCWet = (100 * MCDry) / (100 + MCDry);
    return MCWet;
  }

  // 用途：根据温度变化计算相对湿度变化
  // 原因：温度变化会影响相对湿度，需要重新计算
  private getRh2(
    newTemp: number,
    ambientTemp: number,
    rh: number,
  ): number {
    const A = -27405.526;
    const B = 97.5413;
    const C = -0.146244;
    const D = 0.00012558;
    const E = -0.000000048502;
    const F = 4.34903;
    const G = 0.0039381;

    const T1 = ambientTemp + 273.15;
    const T2 = newTemp + 273.15;

    const RH1d = rh / 100;
    let RH2d = 0;

    RH2d =
      (RH1d *
        Math.exp(
          (A +
            B * T1 +
            C * Math.pow(T1, 2) +
            D * Math.pow(T1, 3) +
            E * Math.pow(T1, 4)) /
            (F * T1 - G * Math.pow(T1, 2)),
        )) /
      Math.exp(
        (A +
          B * T2 +
          C * Math.pow(T2, 2) +
          D * Math.pow(T2, 3) +
          E * Math.pow(T2, 4)) /
          (F * T2 - G * Math.pow(T2, 2)),
      );

    const RH2 = RH2d * 100;
    return RH2;
  }

  // 用途：根据粮食品种、环境温度、压力上升和湿度计算最终水分
  // 原因：这是核心计算逻辑，整合了所有参数
  private calculate(
    grainType: GrainType,
    ambient: number,
    plenum: number,
    rh: number,
  ): number | null {
    let A = 0;
    let B = 0;
    let C = 0;
    const ambientTemp = ambient;
    const plenumRise = plenum;
    let RHdec = rh / 100;
    let MCFinal = 0;
    let model: ModelFunction | null = null;

    switch (grainType) {
      case '大麦':
        A = 475.12;
        B = 0.14843;
        C = 71.996;
        model = this.chung.bind(this);
        break;

      case '油菜':
        A = 3.489;
        B = -0.010553;
        C = 1.86;
        model = this.halsey.bind(this);
        break;

      case '玉米':
        A = 0.000066612;
        B = 1.9677;
        C = 42.143;
        model = this.hendersen.bind(this);
        break;

      case '燕麦':
        A = 0.000085511;
        B = 2.0087;
        C = 37.811;
        model = this.hendersen.bind(this);
        break;

      case '爆米花':
        A = 0.00015593;
        B = 1.5978;
        C = 60.754;
        model = this.hendersen.bind(this);
        break;

      case '大米':
        A = 0.000048524;
        B = 2.0794;
        C = 45.646;
        model = this.hendersen.bind(this);
        break;

      case '高粱':
        A = 797.33;
        B = 0.18159;
        C = 52.238;
        model = this.chung.bind(this);
        break;

      case '大豆':
        A = 228.2;
        B = 0.2072;
        C = 30;
        model = this.chung.bind(this);
        break;

      case '向日葵':
        A = 0.00031;
        B = 1.7459;
        C = 66.603;
        model = this.hendersen.bind(this);
        break;

      case '小麦':
        A = 0.000043295;
        B = 2.1119;
        C = 41.565;
        model = this.hendersen.bind(this);
        break;

      default:
        return null;
    }

    if (!model) {
      return null;
    }

    MCFinal = model(RHdec, A, B, C, ambientTemp);
    const newTemp = ambientTemp + plenumRise;
    const rh2 = this.getRh2(newTemp, ambientTemp, rh);

    RHdec = rh2 / 100;
    MCFinal = model(RHdec, A, B, C, newTemp);
    return MCFinal;
  }

  // 用途：使用华氏度单位计算
  // 原因：兼容使用华氏度的场景
  private get_f(
    a: GrainType,
    c: number,
    d: number,
    rh: number,
  ): number | null {
    return this.calculate(a, this.fToC(c), this.fToCDelta(d), rh);
  }

  // 用途：使用摄氏度单位计算
  // 原因：主要计算接口，使用摄氏度单位
  private get_c(
    a: GrainType,
    c: number,
    d: number,
    rh: number,
  ): number | null {
    return this.calculate(a, c, d, rh);
  }

  // 用途：公开的计算接口
  // 原因：提供给外部调用，计算预估水分
  get({
    type,
    hum,
    temp,
    offset,
  }: {
    type: GrainType;
    hum: number;
    temp: number;
    offset: number;
  }): number | null {
    try {
      const result = this.get_c(type, temp, offset, hum);
      if (result === null) {
        return null;
      }
      return Number(Number(result).toFixed(2));
    } catch {
      return null;
    }
  }

  // 用途：计算凝结温度（露点温度）
  // 原因：辅助判断是否需要通风，避免粮食结露
  lu(initialTemp: number, initialHumidity: number): string {
    const temperatureIncrease = 2;
    // Tetens Formula for Saturation Vapor Pressure
    function saturationVaporPressure(temp: number): number {
      return 6.11 * Math.pow(10, (7.5 * temp) / (237.3 + temp));
    }

    // Initial conditions
    const initialSaturationVaporPressure =
      saturationVaporPressure(initialTemp);
    const initialVaporPressure =
      (initialHumidity * initialSaturationVaporPressure) / 100;

    // New conditions after heating
    const newTemp = initialTemp + temperatureIncrease;
    const newSaturationVaporPressure = saturationVaporPressure(newTemp);
    const newHumidity =
      (initialVaporPressure / newSaturationVaporPressure) * 100;

    const lu =
      (17.27 * newTemp) / (237.7 + newTemp) + Math.log(newHumidity * 0.01);
    return ((237.7 * lu) / (17.27 - lu)).toFixed(2);
  }
}

